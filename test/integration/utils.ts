import { LogLevel } from "@triple-sun/logger";
import nock from "nock";
import type { WebClientOptions } from "../../src/types/web-client";
import { WebClient } from "../../src/web-client";

export const TEST_URL = "https://loop.example.com";
export const TEST_TOKEN = "test-token";

export function setupTestClient(
	options: {
		token?: string;
		retryConfig?: WebClientOptions["retryConfig"];
	} = {}
) {
	if (!nock.isActive()) nock.activate();

	return new WebClient(TEST_URL, {
		token: options.token ?? TEST_TOKEN,
		logLevel: LogLevel.ERROR, // Use ERROR to reduce noise
		retryConfig: options.retryConfig ?? { retries: 1 } // Default to 1 retry unless overridden
	});
}

export function cleanupTestClient() {
	nock.cleanAll();
	nock.restore();
}

export function mockApi(
	path: `/${string}`,
	method: "get" | "post" | "put" | "delete" | "patch",
	responseBody: Record<string, unknown> | unknown[] = {},
	statusCode = 200,
	matchBody?: nock.RequestBodyMatcher
) {
	let interceptor: nock.Interceptor;
	const scope = nock(TEST_URL);

	if (method === "get") {
		// GET requests may send params as query string - match any query
		interceptor = scope.get(`/api/v4${path}`).query(true);
	} else if (method === "post") {
		// If no body matcher, accept any query params (for URLEncoded POST requests)
		interceptor = scope.post(`/api/v4${path}`, matchBody);
		if (!matchBody) {
			interceptor = interceptor.query(true);
		}
	} else if (method === "put") {
		// If no body matcher, accept any query params (for URLEncoded PUT requests)
		interceptor = scope.put(`/api/v4${path}`, matchBody);
		if (!matchBody) {
			interceptor = interceptor.query(true);
		}
	} else if (method === "delete") {
		// DELETE requests may send params as query string - match any query
		interceptor = scope.delete(`/api/v4${path}`).query(true);
	} else {
		// patch
		interceptor = scope.patch(`/api/v4${path}`, matchBody);
	}

	return interceptor.reply(statusCode, responseBody);
}
