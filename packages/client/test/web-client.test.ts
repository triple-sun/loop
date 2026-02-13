/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: <jest tests are long!> */

import { describe, expect, it, jest } from "@jest/globals";
import * as againTs from "again-ts";
import axios, { type AxiosInstance, type RawAxiosRequestHeaders } from "axios";
import { WebAPIServerError } from "../src/errors";
import { ContentType } from "../src/types/web-client";
import { WebClient } from "../src/web-client";
import { createMockAxiosInstance } from "./helpers/test-utils";

// Mocking axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mocking again-ts
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

describe("WebClient", () => {
	let client: WebClient;
	let mockAxiosInstance: AxiosInstance;

	beforeEach(() => {
		jest.clearAllMocks();
		mockAxiosInstance = createMockAxiosInstance();
		mockedAxios.create.mockReturnValue(mockAxiosInstance);
		client = new WebClient("https://api.example.com");
	});

	describe("Constructor", () => {
		it("initializes with default URL", () => {
			expect(client.url).toBe("https://api.example.com/api/v4/");
			expect(mockedAxios.create).toHaveBeenCalled();
		});

		it("appends api/v4/ if missing", () => {
			const c = new WebClient("https://api.example.com");
			expect(c.url).toBe("https://api.example.com/api/v4/");
		});

		it("sets Authorization header if token provided", () => {
			mockedAxios.create.mockClear();
			new WebClient("https://api.example.com", { token: "mytoken" });
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
					(client as any).setCurrentUserForDirectChannel(config)
				).rejects.toThrow("at least one user_id");
			});

			it("throws if data.length is 1 and useCurrentUserForDirectChannels is false", async () => {
				client = new WebClient("https://api.example.com", {
					useCurrentUserForDirectChannels: false
				});
				const config = {
					url: "https://api.example.com/api/v4/channels/direct",
					headers: {} as RawAxiosRequestHeaders,
					data: ["other_user"]
				};
				await expect(
					(client as any).setCurrentUserForDirectChannel(config)
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

				const newConfig = await (client as any).setCurrentUserForDirectChannel(
					config
				);

				expect(meMock).toHaveBeenCalled();
				expect(newConfig.data).toEqual(["other_user", "my_id"]);
			});

			it("uses userID property if set", async () => {
				client = new WebClient("https://api.example.com", {
					userID: "cached_id"
				});
				const meMock = jest.fn();

				(client as any).users = { profile: { get: { me: meMock } } };

				const config = {
					url: "https://api.example.com/api/v4/channels/direct",
					headers: {} as RawAxiosRequestHeaders,
					data: ["other_user"]
				};

				const newConfig = await (client as any).setCurrentUserForDirectChannel(
					config
				);

				expect(meMock).not.toHaveBeenCalled();
				expect(newConfig.data).toEqual(["other_user", "cached_id"]);
			});
		});

		describe("setCurrentUserForPostCreation", () => {
			it("throws if useCurrentUserForPostCreation is false and channel_id missing", async () => {
				client = new WebClient("https://api.example.com", {
					useCurrentUserForPostCreation: false
				});
				const config = {
					url: "https://api.example.com/api/v4/posts",
					headers: {} as RawAxiosRequestHeaders,
					method: "post",
					data: { user_id: "u1" }
				};
				await expect(
					(client as any).setCurrentUserForPostCreation(config)
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
					(client as any).setCurrentUserForPostCreation(config)
				).rejects.toThrow("To create a post you need to provide");
			});

			it("creates direct channel if user_id provided", async () => {
				client = new WebClient("https://api.example.com", { userID: "me" });
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

				const newConfig = await (client as any).setCurrentUserForPostCreation(
					config
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

			expect(mockAxiosInstance).toHaveBeenCalled();
		});
	});
});
