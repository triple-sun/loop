import { type Logger, LogLevel } from "@triple-sun/logger";
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
	type RawAxiosRequestHeaders
} from "axios";
import { Breadline } from "breadline-ts";
import {
	HEADER_X_CLUSTER_ID,
	HEADER_X_VERSION_ID,
	tenRetriesInAboutThirtyMinutes
} from "./const";
import {
	isServerError,
	WebAPIRateLimitedError,
	WebAPIRequestError,
	WebAPIServerError,
	WebClientOptionsError
} from "./errors";
import { getUserAgent } from "./instrument";
import { getLogger } from "./logger";
import { Methods } from "./methods";
import type {
	ChannelsCreateDirectArguments,
	TokenOverridable,
	WebAPICallResult
} from "./types";
import {
	ContentType,
	type TLSOptions,
	type WebAPICallContext,
	type WebApiCallConfig,
	type WebClientOptions
} from "./types/web-client";
import {
	checkForBinaryData,
	getFormDataConfig,
	redact,
	warnIfFallbackIsMissing
} from "./utils";

export class WebClient extends Methods {
	/**
	 * @description The base URL for reaching Loop/Mattermost Web API
	 * Must end with `api/v4/`
	 * @example https://your-loop.loop.ru/api/v4/
	 */
	public url: string;

	/**
	 * @descripton Authentication and authorization token for accessing Loop/Mattermost API
	 */
	public token: string | undefined;

	/**
	 * Configuration for retry operations. See {@link https://github.com/triplesunn/again-ts|Again} for more details.
	 */
	private retryConfig: RetryOptions;

	/**
	 * Queue of requests in which a maximum of {@link WebClientOptions.maxRequestConcurrency} can concurrently be
	 * in-flight.
	 */
	private breadline: Breadline;

	/**
	 * Axios HTTP client instance used by this client
	 */
	private axios: AxiosInstance;

	/**
	 * Configuration for custom TLS handling
	 */
	private tlsConfig: TLSOptions | undefined;

	/**
	 * The name used to prefix all logging generated from this object
	 */
	private static loggerName = "LoopWebClient";

	/**
	 * This object's logger instance
	 */
	private logger: Logger;

	/**
	 * @description Current userID
	 * useCurrentUserForDirectChannels and useCurrentUserForPostCreation will
	 * use it instead of fetching from server if not overriden by token
	 */
	public userID: string | undefined;

	/**
	 * @description Use current user_id if only one was provided for direct channel creation.
	 * Will fetch current user ID from server if no userID was provided or overridden by token in options
	 *
	 * @default true
	 */
	readonly useCurrentUserForDirectChannels?: boolean;

	/**
	 * @description Use post.user_id in PostCreateArguments to fetch a channel_id for post
	 * Will call channels.createDirect for current
	 * Will fetch current user ID from server if no userID was provided or overridden by token in options
	 *
	 * @default true
	 * @default false if userID is provided
	 */
	readonly useCurrentUserForPostCreation?: boolean;

	/**
	 * @description If true the client will set its userID if it was fetched while
	 * useCurrentUserForDirectChannels=true, useCurrentUserForPostCreation=true
	 * or via users.profile.me()
	 *
	 * @default false
	 */
	readonly saveFetchedUserID?: boolean;

	private clusterId: string;
	private serverVersion: string;

	constructor(
		url: Readonly<string>,
		{
			token = undefined,
			userID = undefined,
			logger = undefined,
			logLevel = undefined,
			maxRequestConcurrency = 100,
			retryConfig = tenRetriesInAboutThirtyMinutes,
			useCurrentUserForDirectChannels = true,
			useCurrentUserForPostCreation = true,
			saveFetchedUserID = false,
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
		if (!this.url.endsWith(`api/v4/`)) this.url += `api/v4/`;

		this.userID = userID;

		this.clusterId = "";
		this.serverVersion = "";

		this.retryConfig = retryConfig;
		this.breadline = new Breadline({ concurrency: maxRequestConcurrency });
		// NOTE: may want to filter the keys to only those acceptable for TLS options
		this.tlsConfig = tls;
		this.useCurrentUserForDirectChannels = useCurrentUserForDirectChannels;
		this.useCurrentUserForPostCreation = useCurrentUserForPostCreation;
		this.saveFetchedUserID = saveFetchedUserID;

		/** Set up logging */
		if (logger !== undefined) {
			this.logger = logger;

			if (logLevel !== undefined) {
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

		if (this.token && !headers.Authorization) {
			headers.Authorization = `Bearer ${this.token}`;
		}

		this.axios = axios.create({
			timeout,
			baseURL: this.url,
			httpAgent: agent,
			httpsAgent: agent,
			headers: { ...headers, "User-Agent": getUserAgent() },
			validateStatus: () => true, // all HTTP status codes should result in a resolved promise (as opposed to only 2xx)
			maxRedirects: 0,
			// disabling axios' automatic proxy support:
			// axios would read from envvars to configure a proxy automatically, but it doesn't support TLS destinations.
			// for compatibility and for a larger set of possible proxies (SOCKS or other
			// protocols), users of this package should use the `agent` option to configure a proxy.
			proxy: false
		});

		/** config.type and serializeApiCallData will set ContentType automatically */
		this.axios.defaults.headers.post["Content-Type"] = null;

		if (requestInterceptor) {
			/**
			 * request interceptors have reversed execution order
			 * see: {@link https://github.com/axios/axios/blob/v1.x/test/specs/interceptors.spec.js#L88}
			 */
			this.axios.interceptors.request.use(requestInterceptor, null);
		}

		if (adapter) {
			this.axios.defaults.adapter = (config: InternalAxiosRequestConfig) =>
				adapter({ ...config });
		}

		/**
		 * Built-int interceptors
		 */

		/** set current user for direct channels interceptor */
		if (this.useCurrentUserForDirectChannels) {
			this.axios.interceptors.request.use(
				this.setCurrentUserForDirectChannel.bind(this)
			);
		}

		/** set current user for posts interceptor */
		if (this.useCurrentUserForPostCreation) {
			this.axios.interceptors.request.use(
				this.setCurrentUserForPostCreation.bind(this)
			);
		}

		/** main data serializer interceptor */
		this.axios.interceptors.request.use(this.serializeApiCallData.bind(this));

		this.logger.debug("initialized");
	}

	/**
	 * Generic method for calling a Web API method
	 * @param path - the Web API path to call
	 * @param options - method options
	 *
	 * @throws WebApiCallFailedError with detailed errors in ctx.errors
	 */
	public async apiCall<T = unknown>(
		config: WebApiCallConfig,
		options: Record<string, unknown> = {}
	): Promise<WebAPICallResult<T>> {
		this.logger.debug(`apiCall [${config.method} ${config.path}] start`);

		if (
			typeof options === "string" ||
			typeof options === "number" ||
			typeof options === "boolean"
		) {
			throw new TypeError(
				`expected an options argument but instead received a ${typeof options}`
			);
		}

		const headers: RawAxiosRequestHeaders = {
			"Content-Type": config.type
		};

		/** handle TokenOverridable */
		if (typeof options["token"] === "string") {
			headers["Authorization"] = `Bearer ${options[""]}`;
			options["token"] = undefined;

			this.logger.debug(`token has been overridden from options`);
		}

		/** warn if no fallback */
		warnIfFallbackIsMissing(config.path, this.logger, options);

		const url = this.fillRequestUrl(config, options);

		const response = await this.makeRequest<T>(url, {
			method: config.method,
			headers,
			data: options
		});
		const result = this.buildResult<T>(url, response);
		this.logger.debug(`http request result: ${JSON.stringify(result)}`);
		this.logger.debug(`apiCall [${config.method} ${config.path}] end`);
		return result;
	}

	/**
	 * Low-level function to make a single API request. handles queuing, retries, and http-level errors
	 */
	private async makeRequest<T>(
		url: string,
		config: AxiosRequestConfig
	): Promise<RetryOkResult<AxiosResponse<T>> | RetryFailedResult> {
		const task = () =>
			this.breadline.add(async () => {
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
				this.logger.debug(`http response status: ${response.status}`);

				const resServerVersion = response.headers[HEADER_X_VERSION_ID];
				if (resServerVersion && this.serverVersion !== resServerVersion) {
					this.serverVersion = resServerVersion;
				}

				const resClusterId = response.headers[HEADER_X_CLUSTER_ID];

				if (resClusterId && this.clusterId !== resClusterId) {
					this.clusterId = resClusterId;
				}
				/** handle error status code */
				if (response.status > 300) {
					this.logger.debug(`http error: ${JSON.stringify(response.data)}`);

					const { data } = response;
					if (isServerError(data)) {
						if (response.status === 429) {
							throw new WebAPIRateLimitedError(data);
						}

						throw new WebAPIServerError(data);
					}

					throw new WebAPIRequestError(data);
				}

				return response;
			});

		return await retry<AxiosResponse<T>>(task, this.retryConfig);
	}

	/**
	 * Processes an HTTP response into a WebAPICallResult by performing JSON parsing on the body and merging relevant
	 * HTTP headers into the object.
	 * @param response - an http response
	 */
	private buildResult<T>(
		url: string,
		result: RetryOkResult<AxiosResponse<T>> | RetryFailedResult
	): WebAPICallResult<T> {
		const ctx: WebAPICallContext = { ...result.ctx, url };
		/** short-circuit if we have an error */
		if (!result.ok) throw result.ctx.errors[result.ctx.errors.length - 1];

		/**
		 * handle string responses?
		 * @todo check if it's actually needed
		 */
		if (typeof result.value.data === "string") {
			try {
				result.value.data = JSON.parse(result.value.data);
			} catch (err) {
				// failed to parse the string value as JSON data
				throw err instanceof Error
					? err
					: new TypeError(`non-error type thrown: ${err}`);
			}
		}

		return { data: result.value.data, ctx };
	}

	private fillRequestUrl(
		config: WebApiCallConfig,
		options: Record<string, unknown>
	): string {
		let requestUrl = `${config.path}`;

		if (requestUrl.match(new RegExp(/\/:\D*/))) {
			for (const [k, v] of Object.entries(options)) {
				this.logger.debug(`Replacing :${k} with ${v} in ${requestUrl}`);
				requestUrl = requestUrl.replace(new RegExp(`:${k}`, "g"), String(v));
			}
		}

		/** if no user_id in options: get 'me' user_id by default */
		if (requestUrl.includes("users/:user_id")) {
			requestUrl = requestUrl.replace(":user_id", "me");
		}

		return `${this.axios.getUri()}${requestUrl}`;
	}

	/**
	 * @description Sets authenticated user id for channel creation
	 */
	private async setCurrentUserForDirectChannel(
		config: InternalAxiosRequestConfig
	): Promise<InternalAxiosRequestConfig> {
		const { data } = config;

		if (config.url?.endsWith("/api/v4/channels/direct")) {
			const userIDs = data.user_ids;
			if (!Array.isArray(userIDs)) {
				throw new WebClientOptionsError(`Expected user_ids to be an array`);
			}

			if (userIDs.length === 0) {
				throw new WebClientOptionsError(
					`To create a direct channel you should use at least one user_id in a tuple`
				);
			}

			if (userIDs.length === 1) {
				/** throw if not enough user_ids and can't fetch current from server */
				if (!this.useCurrentUserForDirectChannels) {
					throw new WebClientOptionsError(
						`If useCurrentUserForDirectChannels is false you MUST use two user_ids in a tuple to create a direct channel`
					);
				}

				config.data = [data.user_ids[0], await this.getCurrentUserID(data)];
			}
		}

		return config;
	}

	/**
	 * @description Sets channel_id for user_id for post creation
	 */
	private async setCurrentUserForPostCreation(
		config: InternalAxiosRequestConfig
	): Promise<InternalAxiosRequestConfig> {
		if (config.url?.endsWith("/api/v4/posts") && config.method === "post") {
			const { data } = config;

			/** throw if we dont have required params and we can't fetch them */
			if (!this.useCurrentUserForPostCreation && !data.channel_id) {
				throw new WebClientOptionsError(
					"If useCurrentUserForPostCreation is false you MUST provide channel_id to send a post"
				);
			}
			/** throw if we don't even have options required to fetch missing data */
			if (!data.user_id && !data.channel_id) {
				throw new WebClientOptionsError(
					"To create a post you need to provide either a channel_id or user_id"
				);
			}

			if (typeof data.user_id === "string" && !data.channel_id) {
				const opts: ChannelsCreateDirectArguments = {
					token: data["token"],
					user_ids: [data.user_id, await this.getCurrentUserID(data)]
				};

				/** if token overridable or no userID - fetch channel_id from server  */
				const channel = await this.channels.createDirect(opts);

				config.data.channel_id = channel.data.id;
			}
		}

		return config;
	}

	/**
	 * Gets or fetches current user ID using
	 * @param data Axios config.data
	 * @returns
	 */
	private async getCurrentUserID(
		data: Record<string, unknown>
	): Promise<string> {
		const opts: TokenOverridable = {};

		if (typeof data["token"] === "string") {
			opts.token = data["token"];
		}

		if (opts.token || !this.userID) {
			/** if token overridable or no userID - fetch userID from server  */
			const me = await this.users.profile.me(opts);

			/** save if needed */
			if (this.saveFetchedUserID) {
				this.userID = me.data.id;
			}

			return me.data.id;
		} else {
			return this.userID;
		}
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

		const hasBinaryData = checkForBinaryData(data);

		/** Handling multipart form-data */
		if (
			hasBinaryData ||
			config.headers["Content-Type"] === ContentType.FormData
		) {
			this.logger.debug("Request arguments contain binary data");
			return getFormDataConfig(data, headers);
		}

		/** Use json for json oh wow ¯\_(ツ)_/¯ */
		if (headers["Content-Type"] === ContentType.JSON) {
			return { ...config, data };
		}

		/** Otherwise it's a query */
		return {
			...config,
			params: Object.entries(data).reduce(
				(accumulator, [key, value]) => {
					if (key !== undefined && value !== undefined) {
						accumulator[key] = value;
					}
					return accumulator;
				},
				{} as Record<string, unknown>
			)
		};
	}
}
