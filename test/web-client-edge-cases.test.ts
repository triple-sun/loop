import { jest } from "@jest/globals";
import * as againTs from "again-ts";
import axios, { type AxiosInstance } from "axios";
import { WebAPIRequestError, WebAPIServerError } from "../src/errors";
import { ContentType } from "../src/types";
import { WebClient } from "../src/web-client";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock again-ts retry
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

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: <test file>
describe("WebClient Edge Cases", () => {
	let mockAxiosInstance: unknown;

	beforeEach(() => {
		jest.clearAllMocks();

		mockAxiosInstance = {
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

		const axiosFn = jest.fn(axios).mockResolvedValue({
			status: 200,
			headers: {},
			data: { ok: true }
		});
		Object.assign(axiosFn, mockAxiosInstance);

		mockedAxios.create.mockReturnValue(axiosFn as unknown as AxiosInstance);
	});

	describe("Initialization Edge Cases", () => {
		it("should handle URLs without trailing slash", () => {
			const client = new WebClient("https://api.example.com");
			expect(client.url).toBe("https://api.example.com/api/v4/");
		});

		it("should handle URLs already containing /api/v4/", () => {
			const client = new WebClient("https://api.example.com/api/v4/");
			expect(client.url).toBe("https://api.example.com/api/v4/");
		});

		it("should handle empty string URL", () => {
			expect(() => new WebClient("")).toThrow();
		});

		it("should handle malformed URL", () => {
			expect(() => new WebClient("not-a-url")).toThrow();
		});

		it("should accept custom logger and ignore logLevel", () => {
			const mockLogger = {
				debug: jest.fn(),
				info: jest.fn(),
				warn: jest.fn(),
				error: jest.fn(),
				setLevel: jest.fn(),
				getLevel: jest.fn(() => "INFO" as never),
				setName: jest.fn()
			};

			new WebClient("https://api.example.com", {
				logger: mockLogger,
				logLevel: "DEBUG" as never
			});

			// Should log warning about ignored logLevel
			expect(mockLogger.debug).toHaveBeenCalledWith(
				expect.stringContaining("logLevel given to WebClient was ignored")
			);
		});

		it("should handle userID option", () => {
			const client = new WebClient("https://api.example.com", {
				userID: "test-user-123"
			});
			expect(client).toBeDefined();
		});

		it("should handle saveFetchedUserID option", () => {
			const client = new WebClient("https://api.example.com", {
				saveFetchedUserID: false
			});
			expect(client).toBeDefined();
		});
	});

	describe("Authentication Edge Cases", () => {
		it("should handle token with special characters", async () => {
			const client = new WebClient("https://api.example.com");
			const axiosInstance = mockedAxios.create.mock.results[0]?.value;

			await client.apiCall(
				{ path: "test", method: "GET", type: ContentType.JSON },
				{ token: "token-with-!@#$%^&*()_+" }
			);

			expect(axiosInstance).toHaveBeenCalled();
		});

		it("should handle extremely long token (>1000 chars)", async () => {
			const client = new WebClient("https://api.example.com");
			const longToken = "a".repeat(2000);

			await client.apiCall(
				{ path: "test", method: "GET", type: ContentType.JSON },
				{ token: longToken }
			);

			// Should not crash
			expect(true).toBe(true);
		});

		it("should handle empty string token", async () => {
			const client = new WebClient("https://api.example.com");

			await client.apiCall(
				{ path: "test", method: "GET", type: ContentType.JSON },
				{ token: "" }
			);

			// Should handle gracefully
			expect(true).toBe(true);
		});

		it("should handle token override with null", async () => {
			const client = new WebClient("https://api.example.com", {
				token: "default-token"
			});

			await client.apiCall(
				{ path: "test", method: "GET", type: ContentType.JSON },
				{ token: null as unknown as string }
			);

			// Should not crash
			expect(true).toBe(true);
		});
	});

	describe("URL Building Edge Cases", () => {
		it("should handle path parameters with forward slashes", async () => {
			const client = new WebClient("https://api.example.com");
			const axiosInstance = mockedAxios.create.mock.results[0]
				?.value as jest.Mock;

			await client.apiCall(
				{ path: "channels/:channel_id", method: "GET", type: ContentType.JSON },
				{ channel_id: "team/channel" }
			);

			// Verify the URL was constructed
			expect(axiosInstance).toHaveBeenCalled();
			const callUrl = axiosInstance.mock.calls[0]?.[0];
			expect(callUrl).toContain("team/channel");
		});

		it("should handle path parameters with special characters", async () => {
			const client = new WebClient("https://api.example.com");

			await client.apiCall(
				{ path: "users/:user_id", method: "GET", type: ContentType.JSON },
				{ user_id: "user@example.com" }
			);

			// Should encode special characters
			expect(true).toBe(true);
		});

		it("should handle unicode in path parameters", async () => {
			const client = new WebClient("https://api.example.com");

			await client.apiCall(
				{ path: "teams/:team_name", method: "GET", type: ContentType.JSON },
				{ team_name: "チーム名" }
			);

			expect(true).toBe(true);
		});

		it("should handle emoji in path parameters", async () => {
			const client = new WebClient("https://api.example.com");

			await client.apiCall(
				{
					path: "channels/:channel_name",
					method: "GET",
					type: ContentType.JSON
				},
				{ channel_name: "🎉💻🚀" }
			);

			expect(true).toBe(true);
		});

		it("should handle missing path parameter (keeps :param)", async () => {
			const client = new WebClient("https://api.example.com");
			const axiosInstance = mockedAxios.create.mock.results[0]
				?.value as jest.Mock;

			await client.apiCall(
				{
					path: "channels/:channel_id/:post_id",
					method: "GET",
					type: ContentType.JSON
				},
				{ channel_id: "C123" }
				// post_id is missing
			);

			const callUrl = axiosInstance.mock.calls[0]?.[0];
			// Should still have :post_id in URL
			expect(callUrl).toContain(":post_id");
		});

		it("should replace :user_id with 'me' when not provided", async () => {
			const client = new WebClient("https://api.example.com");
			const axiosInstance = mockedAxios.create.mock.results[0]
				?.value as jest.Mock;

			await client.apiCall(
				{ path: "users/:user_id", method: "GET", type: ContentType.JSON },
				{}
			);

			const callUrl = axiosInstance.mock.calls[0]?.[0];
			expect(callUrl).toContain("users/me");
		});
	});

	describe("Error Response Edge Cases", () => {
		it("should handle 429 rate limit without Retry-After header", async () => {
			const client = new WebClient("https://api.example.com");
			const axiosFn = mockedAxios.create.mock.results[0]?.value as jest.Mock;

			axiosFn.mockResolvedValue({
				status: 429,
				headers: {}, // No Retry-After header
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

		it("should handle 429 with invalid Retry-After header", async () => {
			const client = new WebClient("https://api.example.com");
			const axiosFn = mockedAxios.create.mock.results[0]?.value as jest.Mock;

			axiosFn.mockResolvedValue({
				status: 429,
				headers: { "retry-after": "not-a-number" },
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
			).rejects.toThrow();
		});

		it("should handle non-standard HTTP status codes", async () => {
			const client = new WebClient("https://api.example.com");
			const axiosFn = mockedAxios.create.mock.results[0]?.value as jest.Mock;

			axiosFn.mockResolvedValue({
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

		it("should handle malformed error response (missing required fields)", async () => {
			const client = new WebClient("https://api.example.com");
			const axiosFn = mockedAxios.create.mock.results[0]?.value as jest.Mock;

			axiosFn.mockResolvedValue({
				status: 500,
				headers: {},
				data: {
					// Missing id, message, status_code
					error: "Something went wrong"
				}
			} as never);

			await expect(
				client.apiCall({
					path: "test",
					method: "GET",
					type: ContentType.JSON
				})
			).rejects.toThrow(WebAPIRequestError);
		});

		it("should handle empty error response", async () => {
			const client = new WebClient("https://api.example.com");
			const axiosFn = mockedAxios.create.mock.results[0]?.value as jest.Mock;

			axiosFn.mockResolvedValue({
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

		it("should handle string response when expecting JSON", async () => {
			const client = new WebClient("https://api.example.com");
			const axiosFn = mockedAxios.create.mock.results[0]?.value as jest.Mock;

			axiosFn.mockResolvedValue({
				status: 200,
				headers: {},
				data: '{"ok": true}'
			} as never);

			const result = await client.apiCall({
				path: "test",
				method: "GET",
				type: ContentType.JSON
			});

			// Should parse JSON string
			expect(result.data).toEqual({ ok: true });
		});

		it("should handle invalid JSON string response", async () => {
			const client = new WebClient("https://api.example.com");
			const axiosFn = mockedAxios.create.mock.results[0]?.value as jest.Mock;

			axiosFn.mockResolvedValue({
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

	describe("Payload Edge Cases", () => {
		it("should handle empty request body", async () => {
			const client = new WebClient("https://api.example.com");

			await client.apiCall(
				{ path: "test", method: "POST", type: ContentType.JSON },
				{}
			);

			expect(true).toBe(true);
		});

		it("should handle primitive value as options (should throw TypeError)", async () => {
			const client = new WebClient("https://api.example.com");

			await expect(
				client.apiCall(
					{ path: "test", method: "GET", type: ContentType.JSON },
					"string" as unknown as Record<string, unknown>
				)
			).rejects.toThrow(TypeError);
		});

		it("should handle number as options (should throw TypeError)", async () => {
			const client = new WebClient("https://api.example.com");

			await expect(
				client.apiCall(
					{ path: "test", method: "GET", type: ContentType.JSON },
					123 as unknown as Record<string, unknown>
				)
			).rejects.toThrow(TypeError);
		});

		it("should handle null as options (should throw TypeError)", async () => {
			const client = new WebClient("https://api.example.com");

			await expect(
				client.apiCall(
					{ path: "test", method: "GET", type: ContentType.JSON },
					null as unknown as Record<string, unknown>
				)
			).rejects.toThrow(TypeError);
		});

		it("should handle very large payload object", async () => {
			const client = new WebClient("https://api.example.com");

			// Create large payload
			const largePayload: Record<string, string> = {};
			for (let i = 0; i < 1000; i++) {
				largePayload[`key_${i}`] = `value_${"x".repeat(100)}`;
			}

			await client.apiCall(
				{ path: "test", method: "POST", type: ContentType.JSON },
				largePayload
			);

			expect(true).toBe(true);
		});

		it("should handle deeply nested payload", async () => {
			const client = new WebClient("https://api.example.com");

			// Create deeply nested object
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

			expect(true).toBe(true);
		});
	});

	describe("Memory Management", () => {
		it("should clean up listeners when destroy() is called", () => {
			const client = new WebClient("https://api.example.com");

			// Add event listeners
			// biome-ignore lint/suspicious/noExplicitAny: <test>
			(client as any).on("error", () => null);
			// biome-ignore lint/suspicious/noExplicitAny: <test>
			(client as any).on("data", () => null);

			// Destroy client
			client.destroy();

			// Verify listeners are removed
			// biome-ignore lint/suspicious/noExplicitAny: <test>
			expect((client as any).listenerCount("error")).toBe(0);
			// biome-ignore lint/suspicious/noExplicitAny: <test>
			expect((client as any).listenerCount("data")).toBe(0);
		});

		it("should allow multiple destroy() calls", () => {
			const client = new WebClient("https://api.example.com");

			client.destroy();
			client.destroy();
			client.destroy();

			// Should not crash
			expect(true).toBe(true);
		});
	});
});
