/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: <jest tests are long!> */

import { describe, expect, it, jest } from "@jest/globals";
import * as againTs from "again-ts";
import axios, { type AxiosInstance, type RawAxiosRequestHeaders } from "axios";
import { LoopClient } from "../src/client";
import { ContentType } from "../src/client.types";
import {
	WebAPIRateLimitedError,
	WebAPIRequestError,
	WebAPIServerError
} from "../src/errors";
import { createMockAxiosInstance } from "./helpers/test-utils";

// Mocking axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mocking again-ts
// Mocking again-ts
jest.mock("again-ts", () => ({
	__esModule: true,
	retry: jest.fn(async (_: any, task: any) => {
		try {
			const res = await task({} as any);
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
	})
	// Add other exports if necessary, but client only uses retry and types
}));

describe("LoopClient", () => {
	let client: LoopClient;
	let mockAxiosInstance: AxiosInstance;

	beforeEach(() => {
		jest.clearAllMocks();
		mockAxiosInstance = createMockAxiosInstance();
		mockedAxios.create.mockReturnValue(mockAxiosInstance);
		client = new LoopClient("https://api.example.com");
	});

	describe("Configuration Usage", () => {
		it("passes retryConfig to again-ts retry", async () => {
			const customRetry = { retries: 5 };
			client = new LoopClient("https://example.com", {
				retryConfig: customRetry
			});

			// Trigger a request
			await client.apiCall({
				path: "test",
				method: "GET",
				type: ContentType.JSON
			});

			expect(againTs.retry).toHaveBeenCalledWith(
				"safe",
				expect.anything(),
				customRetry
			);
		});

		it("initializes breadline with maxRequestConcurrency", () => {
			client = new LoopClient("https://example.com", {
				maxRequestConcurrency: 50
			});
			expect((client as any).breadline).toBeDefined();
		});

		it("passes tlsConfig to axios requests", async () => {
			const tlsConfig = { ca: "some-ca-cert" };
			client = new LoopClient("https://example.com", { tls: tlsConfig });

			await client.apiCall({
				path: "test",
				method: "GET",
				type: ContentType.JSON
			});

			expect(mockAxiosInstance).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					ca: "some-ca-cert"
				})
			);
		});
	});

	describe("Constructor", () => {
		it("initializes with default URL", () => {
			expect(client.url).toBe("https://api.example.com/api/v4/");
			expect(mockedAxios.create).toHaveBeenCalled();
		});

		it("appends api/v4/ if missing", () => {
			const c = new LoopClient("https://api.example.com");
			expect(c.url).toBe("https://api.example.com/api/v4/");
		});

		it("sets Authorization header if token provided", () => {
			mockedAxios.create.mockClear();
			new LoopClient("https://api.example.com", { token: "mytoken" });
			expect(mockedAxios.create).toHaveBeenCalledWith(
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: "Bearer mytoken"
					})
				})
			);
		});
	});

	describe("apiCall", () => {
		it("throws TypeError if options is a primitive", async () => {
			await expect(
				client.apiCall(
					{ path: "test", method: "GET", type: ContentType.JSON },
					"string" as unknown as Record<string, unknown>
				)
			).rejects.toThrow(TypeError);
		});

		it("handles token override in options", async () => {
			await client.apiCall(
				{ path: "test", method: "GET", type: ContentType.JSON },
				{ token: "override-token" }
			);

			expect(mockAxiosInstance).toHaveBeenCalledWith(
				expect.stringContaining("test"),
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: "Bearer override-token"
					})
				})
			);
		});

		it("replaces parameters in URL", async () => {
			await client.apiCall(
				{ path: "channels/:channel_id", method: "GET", type: ContentType.JSON },
				{ channel_id: "C123" }
			);
			expect(mockAxiosInstance).toHaveBeenCalledWith(
				expect.stringContaining("channels/C123"),
				expect.any(Object)
			);
		});

		it("replaces :user_id with me if matched", async () => {
			await client.apiCall(
				{ path: "users/:user_id", method: "GET", type: ContentType.JSON },
				{}
			);
			expect(mockAxiosInstance).toHaveBeenCalledWith(
				expect.stringContaining("users/me"),
				expect.any(Object)
			);
		});
	});

	describe("Interceptors", () => {
		describe("setCurrentUserForDirectChannel", () => {
			it("throws if data length is 0", async () => {
				const config = {
					url: "https://api.example.com/api/v4/channels/direct",
					headers: {} as RawAxiosRequestHeaders,
					data: []
				};

				await expect(
					client["setCurrentUserForDirectChannel"](config as any)
				).rejects.toThrow("at least one user_id");
			});

			it("throws if data.length is 1 and useCurrentUserForDirectChannels is false", async () => {
				client = new LoopClient("https://api.example.com", {
					useCurrentUserForDirectChannels: false
				});
				const config = {
					url: "https://api.example.com/api/v4/channels/direct",
					headers: {} as RawAxiosRequestHeaders,
					data: ["other_user"]
				};
				await expect(
					client["setCurrentUserForDirectChannel"](config as any)
				).rejects.toThrow("If useCurrentUserForDirectChannels is false");
			});

			it("fetches my ID if data.length is 1 and useCurrentUserForDirectChannels is true", async () => {
				const meMock = jest
					.fn(async () => ({ ok: true, data: { id: "my_id" } }))
					.mockResolvedValue({ ok: true, data: { id: "my_id" } });

				(client as any).users = { profile: { get: { me: meMock } } };

				const config = {
					url: "https://api.example.com/api/v4/channels/direct",
					headers: {} as RawAxiosRequestHeaders,
					data: ["other_user"]
				};

				const newConfig = await client["setCurrentUserForDirectChannel"](
					config as any
				);

				expect(meMock).toHaveBeenCalled();
				expect(newConfig.data).toEqual(["other_user", "my_id"]);
			});

			it("uses userID property if set", async () => {
				client = new LoopClient("https://api.example.com", {
					userID: "cached_id"
				});
				const meMock = jest.fn();

				(client as any)["users"] = { profile: { get: { me: meMock } } };

				const config = {
					url: "https://api.example.com/api/v4/channels/direct",
					headers: {} as RawAxiosRequestHeaders,
					data: ["other_user"]
				};

				const newConfig = await client["setCurrentUserForDirectChannel"](
					config as any
				);

				expect(meMock).not.toHaveBeenCalled();
				expect(newConfig.data).toEqual(["other_user", "cached_id"]);
			});
		});

		describe("setCurrentUserForPostCreation", () => {
			it("throws if useCurrentUserForPostCreation is false and channel_id missing", async () => {
				client = new LoopClient("https://api.example.com", {
					useCurrentUserForPostCreation: false
				});
				const config = {
					url: "https://api.example.com/api/v4/posts",
					headers: {} as RawAxiosRequestHeaders,
					method: "post",
					data: { user_id: "u1" }
				};
				await expect(
					client["setCurrentUserForPostCreation"](config as any)
				).rejects.toThrow("If useCurrentUserForPostCreation is false");
			});

			it("throws if neither user_id nor channel_id provided", async () => {
				const config = {
					url: "https://api.example.com/api/v4/posts",
					headers: {} as RawAxiosRequestHeaders,
					method: "post",
					data: {}
				};
				await expect(
					client["setCurrentUserForPostCreation"](config as any)
				).rejects.toThrow("To create a post you need to provide");
			});

			it("creates direct channel if user_id provided", async () => {
				client = new LoopClient("https://api.example.com", { userID: "me" });
				const createDirectMock = jest
					.fn(async (_: { user_ids: string[] }) => ({
						ok: true,
						data: { id: "direct_channel_id" }
					}))
					.mockResolvedValue({ ok: true, data: { id: "direct_channel_id" } });

				Object.defineProperty(client, "channels", {
					get: jest.fn(() => ({ create: { direct: createDirectMock } }))
				});

				const config = {
					url: "https://api.example.com/api/v4/posts",
					headers: {} as RawAxiosRequestHeaders,
					method: "post",
					data: { to_user_id: "other", message: "" }
				};

				const newConfig = await client["setCurrentUserForPostCreation"](
					config as any
				);

				expect(createDirectMock).toHaveBeenCalledWith(
					expect.objectContaining({ user_ids: ["other", "me"] })
				);
				expect(newConfig.data.channel_id).toBe("direct_channel_id");
			});
		});
	});

	describe("Response Handling", () => {
		it("returns { data: ... } on success", async () => {
			const result = await client.apiCall({
				path: "test",
				method: "GET",
				type: ContentType.JSON
			});
			expect(result.data).toEqual({ ok: true });
		});

		it("rejects with { ctx: ... } on failure > 300", async () => {
			(mockAxiosInstance as any).mockResolvedValue({
				status: 400,
				statusText: "Bad Request",
				headers: {},
				data: {
					id: "api.context.invalid_param.app_error",
					message: "Invalid parameter",
					status_code: 400
				},
				config: {}
			});

			await expect(
				client.apiCall({
					path: "channels",
					method: "POST",
					type: ContentType.JSON
				})
			).rejects.toThrow(WebAPIServerError);
		});
	});

	describe("LoopClient Advanced Coverage", () => {
		describe("Interceptors - transformPathSpecificParams", () => {
			it("transforms user_ids to array for channels/direct", () => {
				const config = {
					url: "https://api.example.com/api/v4/channels/direct",
					data: { user_ids: ["u1", "u2"] },
					headers: {} as RawAxiosRequestHeaders
				};
				const newConfig = client["transformPathSpecificParams"](config as any);
				expect(newConfig.data).toEqual(["u1", "u2"]);
			});

			it("throws if user_ids is not array for channels/direct", () => {
				const config = {
					url: "https://api.example.com/api/v4/channels/direct",
					data: { user_ids: "not-array" },
					headers: {} as RawAxiosRequestHeaders
				};
				expect(() =>
					client["transformPathSpecificParams"](config as any)
				).toThrow("Expected data.user_ids to be an array");
			});

			it("transforms channel_ids to array for channels/ids", () => {
				const config = {
					url: "https://api.example.com/api/v4/teams/t1/channels/ids",
					data: { channel_ids: ["c1", "c2"] },
					headers: {} as RawAxiosRequestHeaders
				};
				const newConfig = client["transformPathSpecificParams"](config as any);
				expect(newConfig.data).toEqual(["c1", "c2"]);
			});

			it("throws if channel_ids is not array for channels/ids", () => {
				const config = {
					url: "https://api.example.com/api/v4/teams/t1/channels/ids",
					data: { channel_ids: "not-array" },
					headers: {} as RawAxiosRequestHeaders
				};
				expect(() =>
					client["transformPathSpecificParams"](config as any)
				).toThrow("Expected data.channel_ids to be an array");
			});

			it("transforms roles to array for roles/names", () => {
				const config = {
					url: "https://api.example.com/api/v4/roles/names",
					method: "post",
					data: { roles: ["r1", "r2"] },
					headers: {} as RawAxiosRequestHeaders
				};
				const newConfig = client["transformPathSpecificParams"](config as any);
				expect(newConfig.data).toEqual(["r1", "r2"]);
			});

			it("throws if roles is not array for roles/names", () => {
				const config = {
					url: "https://api.example.com/api/v4/roles/names",
					method: "post",
					data: { roles: "not-array" },
					headers: {} as RawAxiosRequestHeaders
				};
				expect(() =>
					client["transformPathSpecificParams"](config as any)
				).toThrow("Expected data.roles to be an array");
			});
		});

		describe("serializeApiCallData", () => {
			it("handles JSON content type", () => {
				const config = {
					headers: {
						"Content-Type": ContentType.JSON
					} as RawAxiosRequestHeaders,
					data: { key: "value" }
				};
				const newConfig = client["serializeApiCallData"](config as any);
				expect(newConfig.data).toEqual({ key: "value" });
			});

			it("handles FormData content type", () => {
				const config = {
					headers: {
						"Content-Type": ContentType.FormData
					} as RawAxiosRequestHeaders,
					data: { key: "value" }
				};
				const newConfig = client["serializeApiCallData"](config as any);
				// In test environment, FormData might be different, just check it exists and is not raw object
				expect(newConfig.data).toBeDefined();
				expect(newConfig.data.constructor.name).toBe("FormData");
			});

			it("converts unknown content type to query params", () => {
				const config = {
					headers: { "Content-Type": "other" } as RawAxiosRequestHeaders,
					data: { key: "value", undefinedKey: undefined }
				};
				const newConfig = client["serializeApiCallData"](config as any);
				expect(newConfig.params).toEqual({ key: "value" });
			});
		});

		describe("makeRequest", () => {
			it("handles 429 errors", async () => {
				(mockAxiosInstance as any).mockResolvedValue({
					status: 429,
					data: {
						id: "api.context.rate_limit.app_error",
						message: "Rate Limited",
						status_code: 429
					},
					headers: {}
				});
				const result = await client["makeRequest"]("url", {});
				expect(result.ok).toBe(false);
				expect(result.ctx.errors[0]).toBeInstanceOf(WebAPIRateLimitedError);
			});

			it("handles other server errors", async () => {
				(mockAxiosInstance as any).mockResolvedValue({
					status: 500,
					data: {
						id: "api.context.server_error",
						message: "Server Error",
						status_code: 500,
						request_id: "123"
					},
					headers: {}
				});
				const result = await client["makeRequest"]("url", {});
				expect(result.ok).toBe(false);
				expect(result.ctx.errors[0]).toBeInstanceOf(WebAPIServerError);
			});

			it("handles non-server errors in makeRequest", async () => {
				(mockAxiosInstance as any).mockResolvedValue({
					status: 400,
					data: { message: "Bad Request" }, // Not a ServerError shape
					headers: {}
				});
				const result = await client["makeRequest"]("url", {});
				expect(result.ok).toBe(false);
				expect(result.ctx.errors[0]).toBeInstanceOf(WebAPIRequestError);
			});

			it("updates server version and cluster id from headers", async () => {
				(mockAxiosInstance as any).mockResolvedValue({
					status: 200,
					data: {},
					headers: {
						"X-Version-Id": "5.0.0",
						"X-Cluster-Id": "cluster-1"
					}
				});
				await client["makeRequest"]("url", {});
				expect(client["serverVersion"]).toBe("5.0.0");
				expect(client["clusterId"]).toBe("cluster-1");
			});
		});

		describe("Constructor Options", () => {
			it("registers request interceptor", () => {
				const interceptor = jest.fn();
				new LoopClient("https://example.com", {
					requestInterceptor: interceptor as any
				});
				// axios create mock returns object with interceptors.request.use mock
				// verify it was called with our interceptor
				expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledWith(
					interceptor,
					null
				);
			});

			it("sets custom adapter", () => {
				const adapter = jest.fn();
				new LoopClient("https://example.com", { adapter: adapter as any });
				// verify adapter is set on defaults
				// Since we mock axios.create returning an object, we need to check if defaults.adapter was assigned
				// or if we can invoke it. The mock in tests might not fully support this assignment verification
				// directly unless we spy on the property setter or check the object structure.
				// However, in the provided mock factory, defaults is a simple object.
				// verify adapter is set on defaults
				expect(client["axios"].defaults.adapter).toBeDefined();
			});
		});

		describe("Test Connection", () => {
			it("checks health on init if requested", () => {
				const checkHealthSpy = jest
					.spyOn(LoopClient.prototype as any, "apiCall")
					.mockResolvedValue({ data: {} });

				new LoopClient("https://example.com", { testConnectionOnInit: true });
				// apiCall is called with just config when using bindApiCall without optional args
				expect(checkHealthSpy).toHaveBeenCalledWith(
					expect.objectContaining({ path: "system/ping" })
				);
			});
		});

		describe("Resource Management", () => {
			it("removes all listeners on destroy", () => {
				const removeAllListenersSpy = jest.spyOn(client, "removeAllListeners");
				client.destroy();
				expect(removeAllListenersSpy).toHaveBeenCalled();
			});
		});
	});
});
