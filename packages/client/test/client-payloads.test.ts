/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: <jest tests are long!> */
/** biome-ignore-all lint/correctness/noUndeclaredVariables: <jest> */

import { expect, jest, test } from "@jest/globals";
import * as againTs from "again-ts";
import type { AxiosInstance } from "axios";
import axios from "axios";
import { LoopClient } from "../src/client";
import { WebAPIRequestError, WebAPIServerError } from "../src/errors";
import { ContentType } from "../src/types";
import { createMockAxiosInstance } from "./helpers/test-utils";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.spyOn(againTs, "retry").mockImplementation(async (_, task) => {
	try {
		const res = await task({} as againTs.RetryContext);
		return {
			ok: true,
			value: res,
			ctx: {
				attempts: 1,
				errors: [],
				triesConsumed: 0,
				start: performance.now(),
				end: performance.now()
			}
		};
	} catch (err) {
		return {
			ok: false,
			ctx: {
				attempts: 1,
				errors: [err as Error],
				triesConsumed: 0,
				start: performance.now(),
				end: performance.now()
			}
		};
	}
});

describe("LoopClient Payloads & Responses", () => {
	let mockAxiosInstance: AxiosInstance;

	beforeEach(() => {
		jest.clearAllMocks();
		mockAxiosInstance = createMockAxiosInstance();
		mockedAxios.create.mockReturnValue(mockAxiosInstance);
	});

	describe("Payload Handling", () => {
		it("handles empty request body", async () => {
			const client = new LoopClient("https://api.example.com");
			await client.apiCall(
				{ path: "test", method: "POST", type: ContentType.JSON },
				{}
			);
			expect(mockAxiosInstance).toHaveBeenCalled();
		});

		test.each([
			{ name: "string", value: "string" },
			{ name: "number", value: 123 },
			{ name: "null", value: null }
		])("throws TypeError when options is $name", async ({ value }) => {
			const client = new LoopClient("https://api.example.com");
			await expect(
				client.apiCall(
					{ path: "test", method: "GET", type: ContentType.JSON },
					value as unknown as Record<string, unknown>
				)
			).rejects.toThrow(TypeError);
		});

		it("handles very large payload object", async () => {
			const client = new LoopClient("https://api.example.com");
			const largePayload: Record<string, string> = {};
			for (let i = 0; i < 1000; i++) {
				largePayload[`key_${i}`] = `value_${"x".repeat(100)}`;
			}

			await client.apiCall(
				{ path: "test", method: "POST", type: ContentType.JSON },
				largePayload
			);
			expect(mockAxiosInstance).toHaveBeenCalled();
		});

		it("handles deeply nested payload", async () => {
			const client = new LoopClient("https://api.example.com");
			const deepPayload: Record<string, unknown> = {};
			let current = deepPayload;
			for (let i = 0; i < 50; i++) {
				current["nested"] = {};
				current = current["nested"] as Record<string, unknown>;
			}
			current["value"] = "deep value";

			await client.apiCall(
				{ path: "test", method: "POST", type: ContentType.JSON },
				deepPayload
			);
			expect(mockAxiosInstance).toHaveBeenCalled();
		});
	});

	describe("Error Responses", () => {
		const axiosFn = () =>
			mockAxiosInstance as unknown as jest.Mock<() => Promise<unknown>>;

		it("handles 429 rate limit without Retry-After header", async () => {
			const client = new LoopClient("https://api.example.com");
			axiosFn().mockResolvedValue({
				status: 429,
				headers: {},
				data: {
					id: "api.context.too_many_requests",
					message: "Rate limited",
					status_code: 429
				}
			} as never);

			await expect(
				client.apiCall({
					path: "test",
					method: "GET",
					type: ContentType.JSON
				})
			).rejects.toThrow(WebAPIServerError);
		});

		it("handles 429 with invalid Retry-After header", async () => {
			const client = new LoopClient("https://api.example.com");
			axiosFn().mockResolvedValue({
				status: 429,
				headers: { "retry-after": "not-a-number" },
				data: { status_code: 429 }
			} as never);

			await expect(
				client.apiCall({
					path: "test",
					method: "GET",
					type: ContentType.JSON
				})
			).rejects.toThrow();
		});

		it("handles non-standard HTTP status codes (e.g. 418)", async () => {
			const client = new LoopClient("https://api.example.com");
			axiosFn().mockResolvedValue({
				status: 418,
				headers: {},
				data: {
					id: "api.error.teapot",
					message: "I'm a teapot",
					status_code: 418
				}
			} as never);

			await expect(
				client.apiCall({
					path: "test",
					method: "GET",
					type: ContentType.JSON
				})
			).rejects.toThrow();
		});

		it("handles malformed error response (missing required fields)", async () => {
			const client = new LoopClient("https://api.example.com");
			axiosFn().mockResolvedValue({
				status: 500,
				headers: {},
				data: { error: "Something went wrong" } // Missing id, message, status_code
			} as never);

			await expect(
				client.apiCall({
					path: "test",
					method: "GET",
					type: ContentType.JSON
				})
			).rejects.toThrow(WebAPIRequestError);
		});

		it("handles empty error response", async () => {
			const client = new LoopClient("https://api.example.com");
			axiosFn().mockResolvedValue({
				status: 500,
				headers: {},
				data: {}
			} as never);

			await expect(
				client.apiCall({
					path: "test",
					method: "GET",
					type: ContentType.JSON
				})
			).rejects.toThrow();
		});
	});

	describe("Response Parsing", () => {
		const axiosFn = () =>
			mockAxiosInstance as unknown as jest.Mock<() => Promise<unknown>>;

		it("handles string response when expecting JSON", async () => {
			const client = new LoopClient("https://api.example.com");
			axiosFn().mockResolvedValue({
				status: 200,
				headers: {},
				data: '{"ok": true}'
			} as never);

			const result = await client.apiCall({
				path: "test",
				method: "GET",
				type: ContentType.JSON
			});

			expect(result.data).toEqual({ ok: true });
		});

		it("handles invalid JSON string response", async () => {
			const client = new LoopClient("https://api.example.com");
			axiosFn().mockResolvedValue({
				status: 200,
				headers: {},
				data: "not valid json {"
			} as never);

			await expect(
				client.apiCall({
					path: "test",
					method: "GET",
					type: ContentType.JSON
				})
			).rejects.toThrow();
		});
	});
});
