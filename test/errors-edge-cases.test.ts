import { expect } from "@jest/globals";
import {
	ErrorCode,
	ServerError,
	type ServerErrorID,
	WebAPIRateLimitedError,
	WebAPIRequestError,
	WebAPIServerError,
	WebClientOptionsError
} from "../src/errors";

describe("Error Edge Cases", () => {
	describe("ServerError", () => {
		it("should create error with all parameters", () => {
			const error = new ServerError(
				"error.id" as ServerErrorID,
				"Error message",
				500,
				"request-123",
				"Detailed error info"
			);

			expect(error.id).toBe("error.id");
			expect(error.message).toBe("Error message");
			expect(error.status_code).toBe(500);
			expect(error.request_id).toBe("request-123");
			expect(error.detailed_error).toBe("Detailed error info");
		});

		it("should handle missing detailed_error (default empty string)", () => {
			const error = new ServerError(
				"error.id" as ServerErrorID,
				"Error message",
				500,
				"request-123"
			);

			expect(error.detailed_error).toBe("");
		});

		it("should handle numeric status_code", () => {
			const error = new ServerError(
				"error.id" as ServerErrorID,
				"Error message",
				"429" as unknown as number,
				"request-123"
			);

			// Should convert to number
			expect(error.status_code).toBe(429);
			expect(typeof error.status_code).toBe("number");
		});

		it("should handle very long error messages", () => {
			const longMessage = "error ".repeat(10000);
			const error = new ServerError(
				"error.id" as ServerErrorID,
				longMessage,
				500,
				"request-123"
			);

			expect(error.message).toBe(longMessage);
		});

		it("should handle unicode in error messages", () => {
			const error = new ServerError(
				"error.id" as ServerErrorID,
				"エラーメッセージ 🚨",
				500,
				"request-123"
			);

			expect(error.message).toBe("エラーメッセージ 🚨");
		});
	});

	describe("WebClientOptionsError", () => {
		it("should create error with message", () => {
			const error = new WebClientOptionsError("Invalid options");
			expect(error.message).toBe("Invalid options");
			expect(error.code).toBe("options_error");
		});

		it("should handle empty message", () => {
			const error = new WebClientOptionsError("");
			expect(error.message).toBe("");
		});

		it("should handle undefined message", () => {
			const error = new WebClientOptionsError(undefined as unknown as string);
			expect(error).toBeDefined();
		});

		it("should have correct error name", () => {
			const error = new WebClientOptionsError("test");
			expect(error.name).toBe("WebClientOptionsError");
		});
	});

	describe("WebAPIRequestError", () => {
		it("should create error with original data", () => {
			const originalError = { error: "request failed" };
			const error = new WebAPIRequestError(originalError);

			expect(error.original).toEqual(originalError);
			expect(error.code).toBe("request_error");
		});

		it("should handle null original", () => {
			const error = new WebAPIRequestError(null);
			expect(error.original).toBeNull();
		});

		it("should handle undefined original", () => {
			const error = new WebAPIRequestError(undefined);
			expect(error.original).toBeUndefined();
		});

		it("should handle primitive original values", () => {
			const error = new WebAPIRequestError(
				"string error" as unknown as Record<string, unknown>
			);
			expect(error.original).toBe("string error");
		});
	});

	describe("WebAPIServerError", () => {
		it("should create error from ServerError", () => {
			const serverError = new ServerError(
				"api.error" as ServerErrorID,
				"Server error",
				500,
				"req-123",
				"Details"
			);

			const error = new WebAPIServerError(serverError);

			expect(error.original).toEqual(serverError);
			expect(error.message).toBe("Server error");
			expect(error.code).toBe(ErrorCode.ServerError);
		});

		it("should handle server error with missing fields", () => {
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
		it("should create error with retryAfter", () => {
			const serverError = new ServerError(
				"api.rate_limit" as ServerErrorID,
				"Too many requests",
				429,
				"req-123"
			);

			const error = new WebAPIRateLimitedError(serverError, 60);

			expect(error.retryAfter).toBe(60);
			expect(error.message).toBe("Rate limited: Too many requests");
			expect(error.code).toBe("rate_limited_error");
		});

		it("should handle missing retryAfter", () => {
			const serverError = new ServerError(
				"api.rate_limit" as ServerErrorID,
				"Too many requests",
				429,
				"req-123"
			);

			const error = new WebAPIRateLimitedError(serverError);

			expect(error.retryAfter).toBeUndefined();
		});

		it("should handle retryAfter as 0", () => {
			const serverError = new ServerError(
				"api.rate_limit" as ServerErrorID,
				"Too many requests",
				429,
				"req-123"
			);

			const error = new WebAPIRateLimitedError(serverError, 0);

			expect(error.retryAfter).toBe(0);
		});

		it("should handle negative retryAfter", () => {
			const serverError = new ServerError(
				"api.rate_limit" as ServerErrorID,
				"Too many requests",
				429,
				"req-123"
			);

			const error = new WebAPIRateLimitedError(serverError, -1);

			expect(error.retryAfter).toBe(-1);
		});

		it("should handle very large retryAfter", () => {
			const serverError = new ServerError(
				"api.rate_limit" as ServerErrorID,
				"Too many requests",
				429,
				"req-123"
			);

			const error = new WebAPIRateLimitedError(
				serverError,
				Number.MAX_SAFE_INTEGER
			);

			expect(error.retryAfter).toBe(Number.MAX_SAFE_INTEGER);
		});

		it("should have correct error inheritance", () => {
			const serverError = new ServerError(
				"api.rate_limit" as ServerErrorID,
				"Too many requests",
				429,
				"req-123"
			);

			const error = new WebAPIRateLimitedError(serverError, 60);

			expect(error instanceof WebAPIServerError).toBe(true);
			expect(error instanceof Error).toBe(true);
		});
	});
});
