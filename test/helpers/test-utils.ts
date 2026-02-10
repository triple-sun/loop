import { jest } from "@jest/globals";
import type { AxiosInstance, AxiosResponse } from "axios";
import { ServerError, type ServerErrorID } from "../../src/errors";

/**
 * Factory for creating ServerError instances for testing
 * Provides sensible defaults while allowing overrides
 *
 * @example
 * const error = createServerError({ message: "Custom error", status_code: 404 });
 */
export function createServerError(
	overrides: Partial<{
		id: ServerErrorID;
		message: string;
		status_code: number;
		request_id: string;
		detailed_error: string;
	}> = {}
): ServerError {
	return new ServerError(
		(overrides.id ?? "api.error.test") as ServerErrorID,
		overrides.message ?? "Test error",
		overrides.status_code ?? 500,
		overrides.request_id ?? "req-test-123",
		overrides.detailed_error ?? ""
	);
}

/**
 * Factory for creating mock AxiosResponse with rate limit headers
 * Used primarily for testing WebAPIRateLimitedError
 *
 * @example
 * const response = createRateLimitResponse(60, 0, 1234567890);
 */
export function createRateLimitResponse(
	limit?: number,
	remaining?: number,
	reset?: number
): AxiosResponse {
	const headers: Record<string, number> = {};

	if (limit !== undefined) headers["X-RateLimit-Limit"] = limit;
	if (remaining !== undefined) headers["X-RateLimit-Remaining"] = remaining;
	if (reset !== undefined) headers["X-RateLimit-Reset"] = reset;

	return { headers } as unknown as AxiosResponse;
}

/**
 * Factory for creating mock Axios instance for WebClient tests
 * Creates a fully-featured mock with defaults, interceptors, and methods
 *
 * @example
 * const mockInstance = createMockAxiosInstance();
 * mockedAxios.create.mockReturnValue(mockInstance);
 */
export function createMockAxiosInstance(): AxiosInstance {
	const mockInstance = {
		defaults: {
			headers: {
				common: {},
				post: {}
			}
		},
		interceptors: {
			request: {
				use: jest.fn()
			}
		},
		getUri: jest.fn().mockReturnValue("https://api.example.com/api/v4/"),
		request: jest.fn()
	};
	const mockResponse = {
		status: 200,
		headers: {},
		data: { ok: true }
	};

	// Create callable axios function
	const axiosFn = jest.fn(() => mockResponse);

	// Merge mock instance properties into function
	Object.assign(axiosFn, mockInstance);

	return axiosFn as unknown as AxiosInstance;
}
