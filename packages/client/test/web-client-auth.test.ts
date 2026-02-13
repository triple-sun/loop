import { expect, jest, test } from "@jest/globals";
import type { AxiosInstance } from "axios";
import axios from "axios";
import { ContentType } from "../src/types/web-client";
import { WebClient } from "../src/web-client";
import { createMockAxiosInstance } from "./helpers/test-utils";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("WebClient Authentication & Lifecycle", () => {
	let mockAxiosInstance: AxiosInstance;

	beforeEach(() => {
		jest.clearAllMocks();
		mockAxiosInstance = createMockAxiosInstance();
		mockedAxios.create.mockReturnValue(mockAxiosInstance);
	});

	describe("Initialization", () => {
		test.each([
			{
				name: "URL without trailing slash",
				url: "https://api.example.com",
				expected: "https://api.example.com/api/v4/"
			},
			{
				name: "URL with /api/v4/",
				url: "https://api.example.com/api/v4/",
				expected: "https://api.example.com/api/v4/"
			}
		])("handles $name", ({ url, expected }) => {
			const client = new WebClient(url);
			expect(client.url).toBe(expected);
		});

		test.each(["", "not-a-url"])("throws on invalid URL: %s", url => {
			expect(() => new WebClient(url)).toThrow();
		});

		it("accepts custom logger and ignores logLevel", () => {
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

			expect(mockLogger.debug).toHaveBeenCalledWith(
				expect.stringContaining("logLevel given to WebClient was ignored")
			);
		});

		test.each([
			{ option: "userID", value: "test-user-123" },
			{ option: "saveFetchedUserID", value: false }
		])("handles option $option", ({ option, value }) => {
			const client = new WebClient("https://api.example.com", {
				[option]: value
			});
			expect(client).toBeDefined();
		});
	});

	describe("Authentication", () => {
		test.each([
			{ name: "special characters", token: "token-with-!@#$%^&*()_+" },
			{ name: "long token", token: "a".repeat(2000) },
			{ name: "empty string", token: "" }
		])("handles token with $name", async ({ token }) => {
			const client = new WebClient("https://api.example.com");
			await client.apiCall(
				{ path: "test", method: "GET", type: ContentType.JSON },
				{ token }
			);
			expect(mockAxiosInstance).toHaveBeenCalled();
		});

		it("handles token override with null", async () => {
			const client = new WebClient("https://api.example.com", {
				token: "default-token"
			});

			await client.apiCall(
				{ path: "test", method: "GET", type: ContentType.JSON },
				{ token: null as unknown as string }
			);
			// Should validation pass/fail isn't asserted in original, just that it doesn't crash
			expect(mockAxiosInstance).toHaveBeenCalled();
		});
	});

	describe("Memory Management", () => {
		it("cleans up listeners on destroy", () => {
			const client = new WebClient("https://api.example.com");

			(client as any).on("error", () => null);
			(client as any).on("data", () => null);

			client.destroy();

			expect((client as any).listenerCount("error")).toBe(0);
			expect((client as any).listenerCount("data")).toBe(0);
		});

		it("allows multiple destroy calls", () => {
			const client = new WebClient("https://api.example.com");
			client.destroy();
			client.destroy();
			expect(true).toBe(true); // Should not throw
		});
	});
});
