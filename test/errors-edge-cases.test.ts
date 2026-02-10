/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: <jest tests are long!> */
import { expect } from "@jest/globals";
import {
	ErrorCode,
	type ServerError,
	WebAPIRateLimitedError,
	WebAPIRequestError,
	WebAPIServerError,
	WebClientOptionsError
} from "../src/errors";
import {
	createRateLimitResponse,
	createServerError
} from "./helpers/test-utils";

describe("Error Edge Cases", () => {
	describe("ServerError", () => {
		it("creates error with all parameters", () => {
			const error = createServerError({
				id: "error.id" as never,
				message: "Error message",
				status_code: 500,
				request_id: "request-123",
				detailed_error: "Detailed error info"
			});

			expect(error.id).toBe("error.id");
			expect(error.message).toBe("Error message");
			expect(error.status_code).toBe(500);
			expect(error.request_id).toBe("request-123");
			expect(error.detailed_error).toBe("Detailed error info");
		});

		it("handles missing detailed_error (defaults to empty string)", () => {
			const error = createServerError({
				id: "error.id" as never,
				message: "Error message",
				status_code: 500,
				request_id: "request-123"
			});

			expect(error.detailed_error).toBe("");
		});

		it("handles numeric status_code conversion", () => {
			const error = createServerError({
				id: "error.id" as never,
				message: "Error message",
				status_code: "429" as unknown as number,
				request_id: "request-123"
			});

			expect(error.status_code).toBe(429);
			expect(typeof error.status_code).toBe("number");
		});

		it("handles very long error messages", () => {
			const longMessage = "error ".repeat(10000);
			const error = createServerError({
				message: longMessage
			});

			expect(error.message).toBe(longMessage);
		});

		it("handles unicode in error messages", () => {
			const error = createServerError({
				message: "エラーメッセージ 🚨"
			});

			expect(error.message).toBe("エラーメッセージ 🚨");
		});
	});

	describe("WebClientOptionsError", () => {
		it("creates error with message", () => {
			const error = new WebClientOptionsError("Invalid options");
			expect(error.message).toBe("Invalid options");
			expect(error.code).toBe("options_error");
		});

		it("handles empty message", () => {
			const error = new WebClientOptionsError("");
			expect(error.message).toBe("");
		});

		it("handles undefined message", () => {
			const error = new WebClientOptionsError(undefined as unknown as string);
			expect(error).toBeDefined();
		});

		it("has correct error name", () => {
			const error = new WebClientOptionsError("test");
			expect(error.name).toBe("WebClientOptionsError");
		});
	});

	describe("WebAPIRequestError", () => {
		it("creates error with original data", () => {
			const originalError = { error: "request failed" };
			const error = new WebAPIRequestError(originalError);

			expect(error.original).toEqual(originalError);
			expect(error.code).toBe("request_error");
		});

		it("handles null original", () => {
			const error = new WebAPIRequestError(null);
			expect(error.original).toBeNull();
		});

		it("handles undefined original", () => {
			const error = new WebAPIRequestError(undefined);
			expect(error.original).toBeUndefined();
		});

		it("handles primitive original values", () => {
			const error = new WebAPIRequestError(
				"string error" as unknown as Record<string, unknown>
			);
			expect(error.original).toBe("string error");
		});
	});

	describe("WebAPIServerError", () => {
		it("creates error from ServerError", () => {
			const serverError = createServerError({
				id: "api.error" as never,
				message: "Server error",
				status_code: 500,
				request_id: "req-123",
				detailed_error: "Details"
			});

			const error = new WebAPIServerError(serverError);

			expect(error.original).toEqual(serverError);
			expect(error.message).toBe("Server error");
			expect(error.code).toBe(ErrorCode.ServerError);
		});

		it("handles server error with missing fields", () => {
			const serverError = {
				id: "api.error",
				message: "Error"
			} as unknown as ServerError;

			const error = new WebAPIServerError(serverError);

			expect(error.original.id).toEqual(serverError.id);
			expect(error.message).toBe("Error");
		});
	});

	describe("WebAPIRateLimitedError", () => {
		const baseServerError = createServerError({
			id: "api.rate_limit" as never,
			message: "Too many requests",
			status_code: 429,
			request_id: "req-123"
		});

		// Parameterized test for different rate limit header values
		test.each([
			{
				name: "with all headers",
				headers: { limit: 60, remaining: 0, reset: 0 },
				expected: { limit: 60, remaining: 0, reset: 0 }
			},
			{
				name: "with missing headers",
				headers: {},
				expected: { limit: undefined, remaining: undefined, reset: undefined }
			},
			{
				name: "with zero values",
				headers: { limit: 0, remaining: 0, reset: 0 },
				expected: { limit: 0, remaining: 0, reset: 0 }
			},
			{
				name: "with negative values",
				headers: { limit: -1, remaining: -1, reset: -1 },
				expected: { limit: -1, remaining: -1, reset: -1 }
			},
			{
				name: "with max safe integer",
				headers: {
					limit: Number.MAX_SAFE_INTEGER,
					remaining: Number.MAX_SAFE_INTEGER,
					reset: Number.MAX_SAFE_INTEGER
				},
				expected: {
					limit: Number.MAX_SAFE_INTEGER,
					remaining: Number.MAX_SAFE_INTEGER,
					reset: Number.MAX_SAFE_INTEGER
				}
			}
		])("$name", ({ headers, expected }) => {
			const response = createRateLimitResponse(
				headers.limit,
				headers.remaining,
				headers.reset
			);
			const error = new WebAPIRateLimitedError(baseServerError, response);

			expect(error.limit).toBe(expected.limit);
			expect(error.remaining).toBe(expected.remaining);
			expect(error.reset).toBe(expected.reset);
		});

		it("has correct inheritance chain and properties", () => {
			const error = new WebAPIRateLimitedError(
				baseServerError,
				createRateLimitResponse(60, 0, 0)
			);

			expect(error).toBeInstanceOf(WebAPIServerError);
			expect(error).toBeInstanceOf(Error);
			expect(error.code).toBe(ErrorCode.RateLimitedError);
			expect(error.message).toBe("Rate limited: Too many requests");
		});
	});
});
