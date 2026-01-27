import type { Agent } from "node:http";
import type { SecureContextOptions } from "node:tls";
import type { Logger, LogLevel } from "@triplesunn/logger";
import type { RetryContext, RetryOptions } from "again-ts";
import type {
	AxiosAdapter,
	InternalAxiosRequestConfig,
	Method,
	RawAxiosRequestHeaders,
	RawAxiosResponseHeaders
} from "axios";

/*
 * Exported types
 */

export enum ContentType {
	FormData = "multipart/form-data",
	JSON = "application/json",
	URLEncoded = "application/x-www-form-urlencoded"
}

export type StatusOK = {
	status: "OK";
};

export type FileUploadData = {
	file: unknown;
	channel_id: string;
	filename: string;
};

export type WebApiCallConfig = {
	/**
	 * @description http request method
	 */
	path: string;
	/**
	 * @description A path for api call
	 * Params (:param) get filled from api call options
	 * @example users/:user_id
	 */
	method: Method;
	/**
	 * @description Content type for options handling
	 * Sets Content-Type header
	 * FormData - creates new FormData() and fills it from options
	 * URLEncoded options get passed to request config params instead of data
	 * JSON passes options as request config data
	 */
	type: ContentType;
};

/**
 * An alias to {@link https://github.com/axios/axios/blob/v1.x/index.d.ts#L367 Axios' `InternalAxiosRequestConfig`} object,
 * which is the main parameter type provided to Axios interceptors and adapters.
 * */
export type RequestConfig = InternalAxiosRequestConfig;

/**
 * An alias to {@link https://github.com/axios/axios/blob/v1.x/index.d.ts#L489 Axios' `AxiosInterceptorManager<InternalAxiosRequestConfig>` onFufilled} method,
 * which controls the custom request interceptor logic
 * */
export type RequestInterceptor = (
	config: RequestConfig
) => RequestConfig | Promise<RequestConfig>;

/**
 * An alias to {@link https://github.com/axios/axios/blob/v1.x/index.d.ts#L112 Axios' `AxiosAdapter`} interface,
 * which is the contract required to specify an adapter
 * */
export type AdapterConfig = AxiosAdapter;

export interface WebAPICallContext extends RetryContext {
	errors: Error[];
	headers?: RawAxiosResponseHeaders;
	url: string;
}

export interface WebAPICallResult<DATA_TYPE = unknown> {
	data: DATA_TYPE;
	ctx?: WebAPICallContext;
}

export interface WebClientOptions {
	readonly token?: Readonly<string>;
	readonly logger?: Logger;
	readonly logLevel?: LogLevel;
	readonly maxRequestConcurrency?: number;
	readonly retryConfig?: RetryOptions;
	readonly agent?: Agent;
	readonly tls?: TLSOptions;
	readonly timeout?: number;
	readonly headers?: RawAxiosRequestHeaders;
	readonly requestInterceptor?: RequestInterceptor;
	readonly adapter?: AdapterConfig;
	readonly userID?: string | undefined;
	readonly useCurrentUserForDirectChannels?: boolean;
	readonly useCurrentUserForPostCreation?: boolean;
}

export type TLSOptions = Pick<
	SecureContextOptions,
	"pfx" | "key" | "passphrase" | "cert" | "ca"
>;

export enum WebClientEvent {
	RateLimited = "rate_limited"
}
