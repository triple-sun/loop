import type { Agent } from "node:http";
import type { SecureContextOptions } from "node:tls";
import type { Logger, LogLevel } from "@triplesunn/logger";
import type { RetryOptions } from "again-ts";
import type {
	AxiosAdapter,
	InternalAxiosRequestConfig,
	Method,
	RawAxiosRequestHeaders
} from "axios";
import type { ContentType } from "./enum";

/*
 * Exported types
 */

export type StatusOK = {
	status: "OK";
};

export type FetchPaginatedThreadOptions = {
	fetchThreads?: boolean;
	collapsedThreads?: boolean;
	collapsedThreadsExtended?: boolean;
	direction?: "up" | "down";
	fetchAll?: boolean;
	perPage?: number;
	fromCreateAt?: number;
	fromPost?: string;
};

export type FileUploadData = {
	file: unknown;
	channel_id: string;
	filename: string;
};

export type WebApiCallConfig = {
	path: `/${string}`;
	method: Method;
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

export interface WebApiCallContext {
	warnings?: string[];
	// added from the headers of the http response
	scopes?: string[];
	acceptedScopes?: string[];
	retryAfter?: number;
	// `chat.postMessage` returns an array of error messages (e.g., "messages": ["[ERROR] invalid_keys"])
	messages?: string[];
	next_cursor?: string;
}

export interface WebApiCallOk<DATA_TYPE = unknown> {
	ok: true;
	data: DATA_TYPE;
	ctx?: WebApiCallContext;
}

export interface WebApiCallFailed {
	ok: false;
	errors: Error[];
	ctx?: WebApiCallContext;
}

export type WebApiCallResult<DATA_TYPE = unknown> =
	| WebApiCallOk<DATA_TYPE>
	| WebApiCallFailed;

export interface WebClientOptions {
	token?: Readonly<string>;
	logger?: Logger;
	logLevel?: LogLevel;
	maxRequestConcurrency?: number;
	retryConfig?: RetryOptions;
	agent?: Agent;
	tls?: TLSOptions;
	timeout?: number;
	rejectRateLimitedCalls?: boolean;
	headers?: RawAxiosRequestHeaders;
	requestInterceptor?: RequestInterceptor;
	adapter?: AdapterConfig;
}

export type TLSOptions = Pick<
	SecureContextOptions,
	"pfx" | "key" | "passphrase" | "cert" | "ca"
>;

export enum WebClientEvent {
	RateLimited = "rate_limited"
}
