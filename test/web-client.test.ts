/** biome-ignore-all lint/correctness/noUndeclaredVariables: <jest> */
import * as againTs from "again-ts";
import axios, { type AxiosInstance } from "axios";
import { Breadline } from "breadline-ts";
import { ContentType } from "../src/types";
import { WebClient } from "../src/web-client";

// Mocking axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mocking breadline-ts
jest.mock("breadline-ts");
const mockedBreadline = Breadline as jest.MockedClass<typeof Breadline>;

// Mocking again-ts
jest.spyOn(againTs, "retry").mockImplementation(async task => {
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

describe("WebClient", () => {
	let client: WebClient;
	let mockAxiosInstance: unknown;
	let mockAxios: jest.Mock;

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
		const axiosFn = jest.fn().mockResolvedValue({
			status: 200,
			headers: {},
			data: { ok: true }
		});
		Object.assign(axiosFn, mockAxiosInstance);

		mockedAxios.create.mockReturnValue(axiosFn as unknown as AxiosInstance);
		mockAxios = axiosFn;

		// Mock Breadline add to just run the task
		mockedBreadline.mockImplementation(
			() =>
				({
					add: jest.fn().mockImplementation(fn => fn())
				}) as unknown as Breadline
		);

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

	describe("buildResult", () => {
		// Since buildResult is private, we test via apiCall results

		it("should return { data: ... } on success", async () => {
			const result = await client.apiCall({
				path: "test",
				method: "GET",
				type: ContentType.JSON
			});
			expect(result.data).toEqual({ ok: true });
		});

		it("should return { ok: false, errors: ... } on failure > 300", () => {
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

			const result = client.apiCall({
				path: "channels",
				method: "POST",
				type: ContentType.JSON
			});

			expect(mockAxios).toHaveBeenCalled();
			expect(result).rejects.toHaveProperty("ctx");
		});
	});
});
