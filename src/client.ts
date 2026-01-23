import { type Logger, LogLevel } from "@triplesunn/logger";
import { type RetryOptions, retry } from "again-ts";
import axios, {
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosResponse,
	type InternalAxiosRequestConfig
} from "axios";
import { Breadline } from "breadline-ts";
import { HEADER_X_CLUSTER_ID, HEADER_X_VERSION_ID } from "./const";
import {
	httpErrorFromResponse,
	platformErrorFromResult,
	rateLimitedErrorWithDelay,
	requestErrorWithOriginal
} from "./errors";
import { getUserAgent } from "./instrument";
import { getLogger } from "./logger";
import { Methods } from "./methods";
import { tenRetriesInAboutThirtyMinutes } from "./retry-policies.const";
import { ContentType } from "./types/enum";
import {
	type TLSOptions,
	type WebApiCallConfig,
	type WebApiCallContext,
	type WebApiCallResult,
	WebClientEvent,
	type WebClientOptions
} from "./types/web-api";
import {
	flattenRequestData,
	getFormDataConfig,
	parseRetryHeaders,
	redact,
	wait
} from "./utils";

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
	 * Preference for immediately rejecting API calls which result in a rate-limited response
	 */
	private rejectRateLimitedCalls: boolean;

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
			rejectRateLimitedCalls = false,
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
		this.rejectRateLimitedCalls = rejectRateLimitedCalls;

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

		//if (method === "files.uploadV2")
		//	return this.filesUploadV2(options as FilesUploadV2Arguments);

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

		// log warnings in response metadata
		if (result.ctx?.warnings !== undefined) {
			result.ctx.warnings.forEach(this.logger.warn.bind(this.logger));
		}

		// log warnings and errors in response metadata messages
		// related to https://docs.slack.dev/changelog/2016/09/28/response-metadata-is-on-the-way
		if (result.ctx?.messages !== undefined) {
			for (const msg of result.ctx.messages) {
				const errReg: RegExp = /\[ERROR\](.*)/;
				const warnReg: RegExp = /\[WARN\](.*)/;
				if (errReg.test(msg)) {
					const errMatch = msg.match(errReg);
					if (errMatch != null) {
						this.logger.error(errMatch[1]?.trim());
					}
				} else if (warnReg.test(msg)) {
					const warnMatch = msg.match(warnReg);
					if (warnMatch != null) {
						this.logger.warn(warnMatch[1]?.trim());
					}
				}
			}
		}

		// If result's content is gzip, "ok" property is not returned with successful response
		// TODO: look into simplifying this code block to only check for the second condition
		// if an { ok: false } body applies for all API errors
		if (!result.ok && response.headers["content-type"] !== "application/gzip") {
			throw platformErrorFromResult(
				result as WebApiCallResult & { error: string }
			);
		}
		if ("ok" in result && result.ok === false) {
			throw platformErrorFromResult(
				result as WebApiCallResult & { error: string }
			);
		}
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
	): Promise<AxiosResponse<T>> {
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

					if (response.status === 429) {
						const retrySec = parseRetryHeaders(response.headers);
						if (retrySec !== undefined) {
							this.emit(WebClientEvent.RateLimited, retrySec, {
								url,
								body: config.data
							});
							if (this.rejectRateLimitedCalls) {
								throw rateLimitedErrorWithDelay(retrySec);
							}
							this.logger.info(
								`API Call failed due to rate limiting. Will retry in ${retrySec} seconds.`
							);
							// pause the request queue and then delay the rejection by the amount of time in the retry header
							this.breadline.pause();
							// NOTE: if there was a way to introspect the current RetryOperation and know what the next timeout
							// would be, then we could subtract that time from the following delay, knowing that it the next
							// attempt still wouldn't occur until after the rate-limit header has specified. an even better
							// solution would be to subtract the time from only the timeout of this next attempt of the
							// RetryOperation. this would result in the staying paused for the entire duration specified in the
							// header, yet this operation not having to pay the timeout cost in addition to that.
							await wait(retrySec * 1000);
							// resume the request queue and throw a non-abort error to signal a retry
							this.breadline.start();
							// TODO: We may want to have more detailed info such as team_id, params except tokens, and so on.
							throw new Error(
								`A rate limit was exceeded (url: ${url}, retry-after: ${retrySec})`
							);
						}
						// TODO: turn this into some CodedError
						throw new Error(
							`Retry header did not contain a valid timeout (url: ${url}, retry-after header: ${response.headers["retry-after"]})`
						);
					}

					if (response.status !== 200) throw httpErrorFromResponse(response);

					return response;
				} catch (error) {
					// To make this compatible with tsd, casting here instead of `catch (error: any)`
					// biome-ignore lint/suspicious/noExplicitAny: errors can be anything
					const e = error as any;
					this.logger.warn("http request failed", e.message);
					if (e.request) throw requestErrorWithOriginal(e);
					throw error;
				}
			});

		const result = await retry(task, this.retryConfig);

		if (result.ok) return result.value;

		throw result.ctx.errors[result.ctx.errors.length - 1];
	}

	/**
	 * Processes an HTTP response into a WebAPICallResult by performing JSON parsing on the body and merging relevant
	 * HTTP headers into the object.
	 * @param response - an http response
	 */
	private buildResult<T>({
		data,
		headers
	}: AxiosResponse): WebApiCallResult<T> {
		const ctx: WebApiCallContext = { ...data };

		if (typeof data === "string") {
			// response.data can be a string, not an object for some reason
			try {
				data = JSON.parse(data);
			} catch (_) {
				// failed to parse the string value as JSON data
				return { ok: false, errors: [data] };
			}
		}

		// add scopes metadata from headers
		if (headers["x-oauth-scopes"] !== undefined) {
			ctx.scopes = String(headers["x-oauth-scopes"])
				.trim()
				.split(/\s*,\s*/);
		}
		if (headers["x-accepted-oauth-scopes"] !== undefined) {
			ctx.acceptedScopes = String(headers["x-accepted-oauth-scopes"])
				.trim()
				.split(/\s*,\s*/);
		}

		// add retry metadata from headers
		const retrySec = parseRetryHeaders(headers);
		if (retrySec !== undefined) ctx.retryAfter = retrySec;

		return { ok: true, data, ctx };
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
