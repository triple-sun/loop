import type { IncomingHttpHeaders } from "node:http";
import type { AxiosResponse } from "axios";
import type { WebApiCallResult } from "./types/web-api";

/**
 * All errors produced by this package adhere to this interface
 */
export interface CodedError extends NodeJS.ErrnoException {
	code: ErrorCode;
}

/**
 * A dictionary of codes for errors produced by this package
 */
export enum ErrorCode {
	// general error
	RequestError = "request_error",
	HTTPError = "http_error",
	PlatformError = "platform_error",
	RateLimitedError = "rate_limited_error",
	// file uploads errors
	FileUploadInvalidArgumentsError = "file_upload_invalid_args_error",
	FileUploadReadFileDataError = "file_upload_read_file_data_error"
}

export type WebAPICallError =
	| WebAPIPlatformError
	| WebAPIRequestError
	| WebAPIHTTPError
	| WebAPIRateLimitedError;
export type WebAPIFilesUploadError = WebAPIFileUploadInvalidArgumentsError;

export interface WebAPIFileUploadInvalidArgumentsError extends CodedError {
	code: ErrorCode.FileUploadInvalidArgumentsError;
	data: WebApiCallResult & {
		error: string;
	};
}

export interface WebAPIPlatformError extends CodedError {
	code: ErrorCode.PlatformError;
	data: WebApiCallResult & {
		error: string;
	};
}

export interface WebAPIRequestError extends CodedError {
	code: ErrorCode.RequestError;
	original: Error;
}

export interface WebAPIHTTPError extends CodedError {
	code: ErrorCode.HTTPError;
	statusCode: number;
	statusMessage: string;
	headers: IncomingHttpHeaders;
	// biome-ignore lint/suspicious/noExplicitAny: HTTP response bodies might be anything
	body?: any;
}

export interface WebAPIRateLimitedError extends CodedError {
	code: ErrorCode.RateLimitedError;
	retryAfter: number;
}

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
): WebAPIPlatformError {
	const error = errorWithCode(
		new Error(`An API error occurred: ${result.error}`),
		ErrorCode.PlatformError
	) as Partial<WebAPIPlatformError>;
	error.data = result;
	return error as WebAPIPlatformError;
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
