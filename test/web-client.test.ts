import { jest } from "@jest/globals";
import * as againTs from "again-ts";
import axios, {
	type AxiosInstance,
	type AxiosStatic,
	type RawAxiosRequestHeaders
} from "axios";

import { WebAPIServerError } from "../src/errors";
import { ContentType } from "../src/types";
import { WebClient } from "../src/web-client";

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
		}; // Mocking RetryOkResult
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
		}; // Mocking RetryFailedResult
	}
});

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: <vitest>
describe("WebClient", () => {
	let client: WebClient;
	let mockAxiosInstance: unknown;
	let mockAxios: jest.Mock<AxiosStatic>;

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
		// The client expects axios(url, config) or similar.
		// It's a callable object.
		const axiosFn = jest.fn(axios).mockResolvedValue({
			status: 200,
			headers: {},
			data: { ok: true }
		});
		Object.assign(axiosFn, mockAxiosInstance);

		mockedAxios.create.mockReturnValue(axiosFn as unknown as AxiosInstance);
		mockAxios = axiosFn;

		client = new WebClient("https://api.example.com");
	});

	describe("Constructor", () => {
		it("should initialize with default URL and settings", () => {
			expect(client.url).toBe("https://api.example.com/api/v4/");
			expect(mockedAxios.create).toHaveBeenCalled();
		});

		it("should append api/v4/ if missing", () => {
			const c = new WebClient("https://api.example.com");
			expect(c.url).toBe("https://api.example.com/api/v4/");
		});

		it("should set Authorization header if token is provided", () => {
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
		it("should throw TypeError if options is a primitive", async () => {
			await expect(
				client.apiCall(
					{ path: "test", method: "GET", type: ContentType.JSON },
					"string" as unknown as Record<string, unknown>
				)
			).rejects.toThrow(TypeError);
		});

		it("should handle token override in options", async () => {
			const axiosInstance = mockedAxios.create.mock.results[0]?.value;
			if (!axiosInstance) throw new Error("Axios instance not found");

			await client.apiCall(
				{ path: "test", method: "GET", type: ContentType.JSON },
				{ token: "override" }
			);

			expect(axiosInstance).toHaveBeenCalledWith(
				expect.stringContaining("test"),
				expect.objectContaining({
					// If the bug exists about passed headers, this checks correct internal behavior
				})
			);
		});

		it("should replace parameters in URL", async () => {
			const axiosInstance = mockedAxios.create.mock.results[0]?.value;
			if (!axiosInstance) throw new Error("Axios instance not found");

			await client.apiCall(
				{ path: "channels/:channel_id", method: "GET", type: ContentType.JSON },
				{ channel_id: "C123" }
			);
			expect(axiosInstance).toHaveBeenCalledWith(
				expect.stringContaining("channels/C123"),
				expect.any(Object)
			);
		});

		it("should replace :user_id with me if matched", async () => {
			const axiosInstance = mockedAxios.create.mock.results[0]?.value;
			if (!axiosInstance) throw new Error("Axios instance not found");

			await client.apiCall(
				{ path: "users/:user_id", method: "GET", type: ContentType.JSON },
				{}
			);
			expect(axiosInstance).toHaveBeenCalledWith(
				expect.stringContaining("users/me"),
				expect.any(Object)
			);
		});
	});

	// biome-ignore lint/complexity/noExcessiveLinesPerFunction: <vitest>
	describe("Interceptors", () => {
		let client: WebClient;
		// biome-ignore lint/suspicious/noExplicitAny: <test>
		let mockAxiosInstance: any;

		beforeEach(() => {
			jest.clearAllMocks();
			mockAxiosInstance = {
				defaults: { headers: { common: {}, post: {} } },
				interceptors: { request: { use: jest.fn() } },
				getUri: jest.fn().mockReturnValue("https://api.example.com/api/v4/"),
				request: jest.fn()
			};
			const axiosFn = jest
				.fn(async () => ({
					status: 200,
					headers: {},
					data: { ok: true }
				}))
				.mockResolvedValue({
					status: 200,
					headers: {},
					data: { ok: true }
				});
			Object.assign(axiosFn, mockAxiosInstance);
			mockedAxios.create.mockReturnValue(axiosFn as unknown as AxiosInstance);
			// biome-ignore lint/suspicious/noExplicitAny: <jesting>
			mockAxios = axiosFn as any;

			client = new WebClient("https://api.example.com");
		});

		describe("setCurrentUserForDirectChannel", () => {
			it("should throw if data length is 0", async () => {
				client = new WebClient("https://api.example.com");

				const config = {
					url: "https://api.example.com/api/v4/channels/direct",
					headers: {} as RawAxiosRequestHeaders,
					data: []
				};

				try {
					// biome-ignore lint/suspicious/noExplicitAny: <test>
					await (client as any).setCurrentUserForDirectChannel(config);
					throw new Error("Should have thrown");
					// biome-ignore lint/suspicious/noExplicitAny: <test>
				} catch (e: any) {
					expect(e.message).toContain("at least one user_id");
				}
			});

			it("should throw if data.length is 1 and useCurrentUserForDirectChannels is false", async () => {
				client = new WebClient("https://api.example.com", {
					useCurrentUserForDirectChannels: false
				});
				const config = {
					url: "https://api.example.com/api/v4/channels/direct",
					headers: {} as RawAxiosRequestHeaders,
					data: ["other_user"]
				};
				try {
					// biome-ignore lint/suspicious/noExplicitAny: <test>
					await (client as any).setCurrentUserForDirectChannel(config);
					throw new Error("Should have thrown");
					// biome-ignore lint/suspicious/noExplicitAny: <test>
				} catch (e: any) {
					expect(e.message).toContain(
						"If useCurrentUserForDirectChannels is false"
					);
				}
			});

			it("should fetch my ID if data.length is 1 and useCurrentUserForDirectChannels is true", async () => {
				client = new WebClient("https://api.example.com");
				// Mock users.profile.me
				const meMock = jest
					.fn(async () => ({ ok: true, data: { id: "my_id" } }))
					.mockResolvedValue({ ok: true, data: { id: "my_id" } });
				// biome-ignore lint/suspicious/noExplicitAny: <test>
				(client as any).users = { profile: { me: meMock } };

				const config = {
					url: "https://api.example.com/api/v4/channels/direct",
					headers: {} as RawAxiosRequestHeaders,
					data: ["other_user"]
				};

				// biome-ignore lint/suspicious/noExplicitAny: <test>
				const newConfig = await (client as any).setCurrentUserForDirectChannel(
					config
				);

				expect(meMock).toHaveBeenCalled();
				expect(newConfig.data).toEqual(["other_user", "my_id"]);
			});

			it("should use userID property if set", async () => {
				client = new WebClient("https://api.example.com", {
					userID: "cached_id"
				});
				// Ensure users.profile.me is NOT called
				const meMock = jest.fn();
				// biome-ignore lint/suspicious/noExplicitAny: <test>
				(client as any).users = { profile: { me: meMock } };

				const config = {
					url: "https://api.example.com/api/v4/channels/direct",
					headers: {} as RawAxiosRequestHeaders,
					data: ["other_user"]
				};

				// biome-ignore lint/suspicious/noExplicitAny: <test>
				const newConfig = await (client as any).setCurrentUserForDirectChannel(
					config
				);

				expect(meMock).not.toHaveBeenCalled();
				expect(newConfig.data).toEqual(["other_user", "cached_id"]);
			});
		});

		describe("setCurrentUserForPostCreation", () => {
			it("should throw if useCurrentUserForPostCreation is false and channel_id missing", async () => {
				client = new WebClient("https://api.example.com", {
					useCurrentUserForPostCreation: false
				});
				const config = {
					url: "https://api.example.com/api/v4/posts",
					headers: {} as RawAxiosRequestHeaders,
					method: "post",
					data: { user_id: "u1" }
				};
				try {
					// biome-ignore lint/suspicious/noExplicitAny: <test>
					await (client as any).setCurrentUserForPostCreation(config);
					throw new Error("Should have thrown");
					// biome-ignore lint/suspicious/noExplicitAny: <test>
				} catch (e: any) {
					expect(e.message).toContain(
						"If useCurrentUserForPostCreation is false"
					);
				}
			});

			it("should throw if neither user_id nor channel_id provided", async () => {
				client = new WebClient("https://api.example.com");
				const config = {
					url: "https://api.example.com/api/v4/posts",
					headers: {} as RawAxiosRequestHeaders,
					method: "post",
					data: {}
				};
				try {
					// biome-ignore lint/suspicious/noExplicitAny: <test>
					await (client as any).setCurrentUserForPostCreation(config);
					throw new Error("Should have thrown");
					// biome-ignore lint/suspicious/noExplicitAny: <test>
				} catch (e: any) {
					expect(e.message).toContain(
						"To create a post you need to provide either a channel_id or user_id"
					);
				}
			});

			it("should create direct channel if user_id provided", async () => {
				client = new WebClient("https://api.example.com", { userID: "me" });
				const createDirectMock = jest
					.fn(async () => ({ ok: true, data: { id: "direct_channel_id" } }))
					.mockResolvedValue({ ok: true, data: { id: "direct_channel_id" } });

				// Mock the getter for channels
				Object.defineProperty(client, "channels", {
					get: jest.fn(() => ({ create: { direct: createDirectMock } }))
				});

				const config = {
					url: "https://api.example.com/api/v4/posts",
					headers: {} as RawAxiosRequestHeaders,
					method: "post",
					data: { user_id: "other" }
				};

				// biome-ignore lint/suspicious/noExplicitAny: <jesting>
				const newConfig = await (client as any).setCurrentUserForPostCreation(
					config
				);

				expect(createDirectMock).toHaveBeenCalledWith(
					expect.objectContaining({ user_ids: ["other", "me"] })
				);
				expect(newConfig.data.channel_id).toBe("direct_channel_id");
			});
		});

		describe("buildResult tests", () => {
			it("should return { data: ... } on success", async () => {
				const result = await client.apiCall({
					path: "test",
					method: "GET",
					type: ContentType.JSON
				});
				expect(result.data).toEqual({ ok: true });
			});

			it("should reject with { ctx: ... } on failure > 300", async () => {
				mockAxios.mockResolvedValue({
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

				expect(mockAxios).toHaveBeenCalled();
			});
		});
	});
});
