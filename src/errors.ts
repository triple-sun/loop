import type { IncomingHttpHeaders } from "node:http";
import type { MattermostErrorID } from "./mm-errors";
import type { WebApiCallResult } from "./types/web-api";

/**
 * A dictionary of codes for errors produced by this package
 */
export enum ErrorCode {
	// general error
	RequestError = "request_error",
	HTTPError = "http_error",
	ServerError = "server_error",
	RateLimitedError = "rate_limited_error"
}

export interface ServerError {
	/**
	 * @description Error id
	 * @example app.user.missing_account.const
	 */
	id: string | MattermostErrorID;
	request_id?: string;
	message: string;
	status_code: number;
	detailed_error?: string;
}

export interface WebClientCodedError extends Error {
	code: ErrorCode;
}

export type WebAPICallError =
	| WebAPIServerError
	| WebAPIRequestError
	| WebAPIHTTPError
	| WebAPIRateLimitedError;

export class WebAPIServerError implements WebClientCodedError, ServerError {
	code = ErrorCode.ServerError;
	name = WebAPIServerError.name;
	id: string;
	status_code: number;
	message: string;
	request_id?: string;
	detailed_error?: string;

	constructor(error: ServerError) {
		this.id = error.id;
		this.status_code = error.status_code;
		this.request_id = error.request_id;
		this.detailed_error = error.detailed_error;
		this.message = error.message;
	}
}

export class WebAPIRequestError implements WebClientCodedError {
	name = WebAPIRequestError.name;
	code = ErrorCode.RequestError;
	original: Error;
	message: string;

	constructor(original: Error) {
		this.message = `A request error occurred: ${original.message}`;
		this.original = original;
	}
}

export interface WebAPIHTTPError extends WebClientCodedError {
	code: ErrorCode.HTTPError;
	statusCode: number;
	statusMessage: string;
	headers: IncomingHttpHeaders;
	// biome-ignore lint/suspicious/noExplicitAny: HTTP response bodies might be anything
	body?: any;
}

export interface WebAPIRateLimitedError extends WebClientCodedError {
	code: ErrorCode.RateLimitedError;
	retryAfter: number;
}

export const isServerError = (error: unknown): boolean => {
	if (
		error &&
		typeof error === "object" &&
		"id" in error &&
		"message" in error &&
		"status_code" in error &&
		typeof error.id === "string" &&
		typeof error.message === "string" &&
		typeof error.status_code === "number"
	) {
		return true;
	}

	return false;
};

/**
 * Factory for producing a {@link CodedError} from a generic error
 */
export function errorWithCode(error: Error, code: ErrorCode): CodedError {
	// NOTE: might be able to return something more specific than a CodedError with conditional typing
	const codedError = error as Partial<CodedError>;
	codedError.code = code;
	return codedError as CodedError;
}

/**
 * A factory to create WebAPIRequestError objects
 * @param original - original error
 * @param attachOriginal - config indicating if 'original' property should be added on the error object
 */
export function requestErrorWithOriginal(original: Error): WebAPIRequestError {
	const error = errorWithCode(
		new Error(`A request error occurred: ${original.message}`),
		ErrorCode.RequestError
	) as Partial<WebAPIRequestError>;
	error.original = original;
	return error as WebAPIRequestError;
}

/**
 * A factory to create WebAPIHTTPError objects
 * @param response - original error
 */
export function httpErrorFromResponse(
	response: AxiosResponse
): WebAPIHTTPError {
	const error = errorWithCode(
		new Error(
			`An HTTP protocol error occurred: statusCode = ${response.status}`
		),
		ErrorCode.HTTPError
	) as Partial<WebAPIHTTPError>;
	error.statusCode = response.status;
	error.statusMessage = response.statusText;
	const nonNullHeaders: Record<string, string> = {};
	for (const k of Object.keys(response.headers)) {
		if (k && response.headers[k]) {
			nonNullHeaders[k] = response.headers[k];
		}
	}
	error.headers = nonNullHeaders;
	error.body = response.data;
	return error as WebAPIHTTPError;
}

/**
 * A factory to create WebAPIPlatformError objects
 * @param result - Web API call result
 */
export function platformErrorFromResult(
	result: WebApiCallResult & { error: string }
): WebAPIServerError {
	const error = errorWithCode(
		new Error(`An API error occurred: ${result.error}`),
		ErrorCode.PlatformError
	) as Partial<WebAPIServerError>;
	error.data = result;
	return error as WebAPIServerError;
}

/**
 * A factory to create WebAPIRateLimitedError objects
 * @param retrySec - Number of seconds that the request can be retried in
 */
export function rateLimitedErrorWithDelay(
	retrySec: number
): WebAPIRateLimitedError {
	const error = errorWithCode(
		new Error(
			`A rate-limit has been reached, you may retry this request in ${retrySec} seconds`
		),
		ErrorCode.RateLimitedError
	) as Partial<WebAPIRateLimitedError>;
	error.retryAfter = retrySec;
	return error as WebAPIRateLimitedError;
}
