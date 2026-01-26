import { type Logger, LogLevel } from "@triplesunn/logger";
import {
	type RetryFailedResult,
	type RetryOkResult,
	type RetryOptions,
	retry
} from "again-ts";
import axios, {
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
	isAxiosError
} from "axios";
import { Breadline } from "breadline-ts";
import { HEADER_X_CLUSTER_ID, HEADER_X_VERSION_ID } from "./const";
import { isServerError, type ServerError, WebAPIServerError } from "./errors";
import { getUserAgent } from "./instrument";
import { getLogger } from "./logger";
import { Methods } from "./methods";
import { tenRetriesInAboutThirtyMinutes } from "./retry-policies.const";
import { ContentType } from "./types/enum";
import type {
	TLSOptions,
	WebApiCallConfig,
	WebApiCallContext,
	WebApiCallResult,
	WebClientOptions
} from "./types/web-api";
import { flattenRequestData, getFormDataConfig, redact } from "./utils";

export class WebClient extends Methods {
	/** The base URL for reaching Loop/Mattermost Web API */
	public url: string;
	/** Authentication and authorization token for accessing Loop/Mattermost API */
	public token: string | undefined;

	/**
	 * Configuration for retry operations. See {@link https://github.com/triplesunn/again-ts|Again} for more details.
	 * */
	private retryConfig: RetryOptions;

	/**
	 * Queue of requests in which a maximum of {@link WebClientOptions.maxRequestConcurrency} can concurrently be
	 * in-flight.
	 * */
	private breadline: Breadline;

	/**
	 * Axios HTTP client instance used by this client
	 * */
	private axios: AxiosInstance;

	/**
	 * Configuration for custom TLS handling
	 * */
	private tlsConfig: TLSOptions | undefined;

	/**
	 * The name used to prefix all logging generated from this object
	 * */
	private static loggerName = "WebClient";

	/**
	 * This object's logger instance
	 * */
	private logger: Logger;

	private clusterId!: string;
	private serverVersion!: string;

	constructor(
		url: Readonly<string>,
		{
			token = undefined,
			logger = undefined,
			logLevel = undefined,
			maxRequestConcurrency = 100,
			retryConfig = tenRetriesInAboutThirtyMinutes,
			agent = undefined,
			tls = undefined,
			timeout = 0,
			headers = {},
			requestInterceptor = undefined,
			adapter = undefined
		}: WebClientOptions = {}
	) {
		super();

		this.token = token;
		this.url = url;
		if (!this.url.endsWith("/")) this.url += "/";

		this.retryConfig = retryConfig;
		this.breadline = new Breadline({ concurrency: maxRequestConcurrency });
		// NOTE: may want to filter the keys to only those acceptable for TLS options
		this.tlsConfig = tls;

		if (typeof logger !== "undefined") {
			// Logging
			this.logger = logger;
			if (typeof logLevel !== "undefined") {
				this.logger.debug(
					"The logLevel given to WebClient was ignored as you also gave logger"
				);
			}
		} else {
			this.logger = getLogger(
				WebClient.loggerName,
				logLevel ?? LogLevel.INFO,
				logger
			);
		}

		if (this.token && !headers.Authorization)
			headers.Authorization = `Bearer ${this.token}`;

		this.axios = axios.create({
			timeout,
			baseURL: this.url,
			headers: { ...headers, "User-Agent": getUserAgent() },
			httpAgent: agent,
			httpsAgent: agent,
			validateStatus: () => true, // all HTTP status codes should result in a resolved promise (as opposed to only 2xx)
			maxRedirects: 0,
			// disabling axios' automatic proxy support:
			// axios would read from envvars to configure a proxy automatically, but it doesn't support TLS destinations.
			// for compatibility with https://api.slack.com, and for a larger set of possible proxies (SOCKS or other
			// protocols), users of this package should use the `agent` option to configure a proxy.
			proxy: false
		});
		// serializeApiCallData will always determine the appropriate content-type
		this.axios.defaults.headers.post["Content-Type"] = null;

		if (requestInterceptor) {
			/**
			 * request interceptors have reversed execution order
			 * see: {@link https://github.com/axios/axios/blob/v1.x/test/specs/interceptors.spec.js#L88}
			 * */
			this.axios.interceptors.request.use(requestInterceptor, null);
		}

		if (adapter) {
			this.axios.defaults.adapter = (config: InternalAxiosRequestConfig) =>
				adapter({ ...config });
		}

		this.axios.interceptors.request.use(
			this.serializeApiCallData.bind(this),
			null
		);

		this.logger.debug("initialized");
	}

	/**
	 * Generic method for calling a Web API method
	 * @param path - the Web API method to call {@link https://docs.slack.dev/reference/methods}
	 * @param options - options
	 */
	public async apiCall<T = unknown>(
		config: WebApiCallConfig,
		options: Record<string, unknown> = {}
	): Promise<WebApiCallResult<T>> {
		this.logger.debug(`apiCall('${config.path}') start`);

		if (
			typeof options === "string" ||
			typeof options === "number" ||
			typeof options === "boolean"
		) {
			throw new TypeError(
				`Expected an options argument but instead received a ${typeof options}`
			);
		}

		const headers: Record<string, string> = {};

		/** handle TokenOverridable */
		if (options["token"]) {
			headers["Authorization"] = `Bearer ${options["token"]}`;
			options["token"] = undefined;
		}

		const response = await this.makeRequest<T>(
			this.fillRequestUrl(config.path, options),
			{
				method: config.method,
				data: {
					// team_id: this.teamId,
					...options
				}
			}
		);
		const result = this.buildResult<T>(response);
		this.logger.debug(`http request result: ${JSON.stringify(result)}`);
		this.logger.debug(`apiCall('${config.path}') end`);
		return result;
	}

	/**
	 * Transforms options (a simple key-value object) into an acceptable value for a body. This can be either
	 * a string, used when posting with a content-type of url-encoded. Or, it can be a readable stream, used
	 * when the options contain a binary (a stream or a buffer) and the upload should be done
	 * with content-type multipart/form-data.
	 * @param config - The Axios request configuration object
	 */
	private serializeApiCallData(
		config: InternalAxiosRequestConfig
	): InternalAxiosRequestConfig {
		const { data, headers } = config;

		// The following operation both flattens complex objects into a JSON-encoded strings and searches the values for
		// binary content
		const { flattened, hasBinaryData } = flattenRequestData(data);

		// A body with binary content should be serialized as multipart/form-data
		if (
			hasBinaryData ||
			config.headers["Content-Type"] === ContentType.FormData
		) {
			this.logger.debug("Request arguments contain binary data");
			return getFormDataConfig(flattened, headers);
		}

		if (headers["Content-Type"] === ContentType.JSON) {
			return { ...config, data };
		}

		/**
		 * Otherwise it's a query
		 */
		return {
			...config,
			params: flattened.reduce(
				(accumulator, [key, value]) => {
					if (key !== undefined && value !== undefined) {
						accumulator[key] = value;
					}
					return accumulator;
				},
				{} as Record<string, unknown>
			) //qs.stringify()
		};
	}

	/**
	 * Low-level function to make a single API request. handles queuing, retries, and http-level errors
	 */
	private async makeRequest<T>(
		url: string,
		config: AxiosRequestConfig
	): Promise<RetryOkResult<AxiosResponse<T>> | RetryFailedResult> {
		// TODO: better input types - remove any
		const task = () =>
			this.breadline.add(async () => {
				try {
					const cfg: AxiosRequestConfig = {
						...config,
						...this.tlsConfig
					};

					this.logger.debug(`http request url: ${url}`);
					this.logger.debug(`http request data: ${redact(config.data)}`);
					this.logger.debug(
						`http request headers: ${redact({
							...this.axios.defaults.headers.common,
							...config.headers
						})}`
					);

					/** ApiCallData is serialized through interceptors */
					const response = await this.axios<T>(url, cfg);

					this.logger.debug("http response received");

					const resServerVersion = response.headers[HEADER_X_VERSION_ID];
					if (resServerVersion && this.serverVersion !== resServerVersion) {
						this.serverVersion = resServerVersion;
					}

					const resClusterId = response.headers[HEADER_X_CLUSTER_ID];
					if (resClusterId && this.clusterId !== resClusterId) {
						this.clusterId = resClusterId;
					}

					if (isServerError(response.data)) {
						throw new WebAPIServerError(response.data as ServerError);
					}

					return response;
				} catch (error) {
					if (isAxiosError(error) && error.response) {
						return error.response;
					}
					throw error;
				}
			});

		return await retry<AxiosResponse<T>>(task, this.retryConfig);
	}

	/**
	 * Processes an HTTP response into a WebAPICallResult by performing JSON parsing on the body and merging relevant
	 * HTTP headers into the object.
	 * @param response - an http response
	 */
	private buildResult<T>(
		result: RetryOkResult<AxiosResponse<T>> | RetryFailedResult
	): WebApiCallResult<T> {
		const ctx: WebApiCallContext = { ...result.ctx };
		/** short-circuit if we have an error */
		if (!result.ok) {
			return { ok: false, ctx };
		}

		/** nandle error status codes */
		if (result.value.status > 300) {
			ctx.headers = result.value.headers;
			/** Push error if response data is an error object */
			if (isServerError(result.value.data)) {
				ctx.errors.push(
					new WebAPIServerError(result.value.data as ServerError)
				);
			}
			return { ok: false, ctx };
		}

		/**
		 * handle string responses?
		 * @todo: check if it's needed
		 */
		if (typeof result.value.data === "string") {
			try {
				result.value.data = JSON.parse(result.value.data);
			} catch (err) {
				ctx.errors.push(
					err instanceof Error ? err : new TypeError(`non-error type thrown`)
				);
				// failed to parse the string value as JSON data
				return {
					ok: false,
					ctx
				};
			}
		}

		return { ok: true, data: result.value.data, ctx };
	}

	/**
	 * Get the complete request URL for the provided URL.
	 * @param url - The resource to POST to. Either a Slack API method or absolute URL.
	 */
	private fillRequestUrl(
		url: string,
		options: Record<string, unknown>
	): string {
		/** fill request url */
		if (url.match(/\$:[\d\D]*\//gm)) {
			Object.entries(options).forEach(([k, v]) => {
				url.replaceAll(`:${k}`, String(v));
			});
		}

		/** get 'me' user_id by default */
		if (url.match("/users/:user_id")) {
			url.replaceAll(":user_id", "me");
		}

		return `${this.axios.getUri()}${url}`;
	}
}
