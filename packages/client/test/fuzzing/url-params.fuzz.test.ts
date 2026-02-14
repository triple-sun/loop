/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: <jest> */

import { expect, jest } from "@jest/globals";
import * as againTs from "again-ts";
import axios, { type AxiosInstance } from "axios";
import { LoopClient } from "../../src/client";
import { ContentType } from "../../src/types";

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

describe("URL Parameter Fuzzing", () => {
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

	describe("Path Traversal Attempts", () => {
		const pathTraversalPayloads = [
			"../../../etc/passwd",
			"..\\..\\..\\windows\\system32",
			"....//....//....//etc/passwd",
			"%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd",
			"..%252f..%252f..%252fetc%252fpasswd",
			"..%c0%af..%c0%af..%c0%afetc%c0%afpasswd"
		];

		it("should handle path traversal attempts safely", async () => {
			const client = new LoopClient("https://api.example.com");

			await Promise.all(
				pathTraversalPayloads.map(payload => {
					return expect(
						client.apiCall(
							{ path: "files/:file_id", method: "GET", type: ContentType.JSON },
							{ file_id: payload }
						)
					).resolves.toBeDefined();
				})
			);
		});
	});

	describe("Injection Attack Attempts", () => {
		const injectionPayloads = [
			"' OR '1'='1",
			"1' OR '1' = '1",
			"admin'--",
			"' OR 1=1--",
			"<script>alert('XSS')</script>",
			"<img src=x onerror=alert(1)>",
			"javascript:alert(1)",
			// biome-ignore lint/suspicious/noTemplateCurlyInString: <fuzzing test>
			"${7*7}",
			"{{7*7}}",
			"<%= 7*7 %>",
			"; DROP TABLE users;--",
			"1; DELETE FROM users"
		];

		it("should handle SQL injection attempts safely", async () => {
			const client = new LoopClient("https://api.example.com");

			const sqlPayloads = injectionPayloads.filter(
				p => p.includes("OR") || p.includes("DROP") || p.includes("DELETE")
			);

			await Promise.all(
				sqlPayloads.map(payload => {
					return expect(
						client.apiCall(
							{ path: "users/:user_id", method: "GET", type: ContentType.JSON },
							{ user_id: payload }
						)
					).resolves.toBeDefined();
				})
			);
		});

		it("should handle XSS attempts safely", async () => {
			const client = new LoopClient("https://api.example.com");

			const xssPayloads = injectionPayloads.filter(
				p =>
					p.includes("<script>") ||
					p.includes("javascript:") ||
					p.includes("onerror")
			);

			await Promise.all(
				xssPayloads.map(payload => {
					return expect(
						client.apiCall(
							{
								path: "channels/:channel_name",
								method: "GET",
								type: ContentType.JSON
							},
							{ channel_name: payload }
						)
					).resolves.toBeDefined();
				})
			);
		});

		it("should handle template injection attempts safely", async () => {
			const client = new LoopClient("https://api.example.com");

			const templatePayloads = injectionPayloads.filter(
				p => p.includes("${") || p.includes("{{") || p.includes("<%=")
			);

			await Promise.all(
				templatePayloads.map(payload => {
					return expect(
						client.apiCall(
							{ path: "posts/:post_id", method: "GET", type: ContentType.JSON },
							{ post_id: payload }
						)
					).resolves.toBeDefined();
				})
			);
		});
	});

	describe("Special Character Handling", () => {
		const specialChars = [
			"\u0000", // Null byte
			"\n\r\t", // Newlines, tabs
			"\"'`", // Quotes
			"<>&", // HTML special chars
			"%00", // Encoded null
			"\uffff", // Max unicode
			"😀🎉💻", // Emoji
			"日本語", // Japanese
			"العربية", // Arabic
			"Русский" // Cyrillic
		];

		it("should handle null bytes", async () => {
			const client = new LoopClient("https://api.example.com");

			await expect(
				client.apiCall(
					{ path: "teams/:team_id", method: "GET", type: ContentType.JSON },
					{ team_id: "team\u0000id" }
				)
			).resolves.toBeDefined();
		});

		it("should handle unicode characters", async () => {
			const client = new LoopClient("https://api.example.com");

			await Promise.all(
				Array.from(specialChars.filter(c => c.match(/[\u0100-\uffff]/))).map(
					char => {
						return expect(
							client.apiCall(
								{
									path: "users/:user_name",
									method: "GET",
									type: ContentType.JSON
								},
								{ user_name: char }
							)
						).resolves.toBeDefined();
					}
				)
			);
		});

		it("should handle very long parameter values", async () => {
			const client = new LoopClient("https://api.example.com");

			const longValues = [
				"a".repeat(1000),
				"a".repeat(10000),
				"😀".repeat(500)
			];

			await Promise.all(
				Array.from(longValues).map(longValue => {
					return expect(
						client.apiCall(
							{
								path: "channels/:channel_id",
								method: "GET",
								type: ContentType.JSON
							},
							{ channel_id: longValue }
						)
					).resolves.toBeDefined();
				})
			);
		});
	});

	describe("URL Encoding Edge Cases", () => {
		const encodedValues = [
			"%20", // Space
			"%2F", // Forward slash
			"%3A", // Colon
			"%3F", // Question mark
			"%23", // Hash
			"%26", // Ampersand
			"%2B", // Plus
			"a%20b%20c", // Spaces in between
			"%E2%9C%93", // Unicode check mark
			"%F0%9F%98%80" // Emoji
		];

		it("should handle URL encoded values", async () => {
			const client = new LoopClient("https://api.example.com");

			await Promise.all(
				encodedValues.map(encoded => {
					return expect(
						client.apiCall(
							{
								path: "files/:file_name",
								method: "GET",
								type: ContentType.JSON
							},
							{ file_name: encoded }
						)
					).resolves.toBeDefined();
				})
			);
		});

		it("should handle double-encoded values", async () => {
			const client = new LoopClient("https://api.example.com");

			await expect(
				client.apiCall(
					{ path: "files/:file_id", method: "GET", type: ContentType.JSON },
					{ file_id: "%252F" } // Double encoded slash
				)
			).resolves.toBeDefined();
		});
	});

	describe("Boundary Value Testing", () => {
		it("should handle empty string parameter", async () => {
			const client = new LoopClient("https://api.example.com");

			await expect(
				client.apiCall(
					{ path: "users/:user_id", method: "GET", type: ContentType.JSON },
					{ user_id: "" }
				)
			).resolves.toBeDefined();
		});

		it("should handle whitespace-only parameter", async () => {
			const client = new LoopClient("https://api.example.com");

			await expect(
				client.apiCall(
					{ path: "users/:user_id", method: "GET", type: ContentType.JSON },
					{ user_id: "   " }
				)
			).resolves.toBeDefined();
		});

		it("should handle parameter with leading/trailing whitespace", async () => {
			const client = new LoopClient("https://api.example.com");

			await expect(
				client.apiCall(
					{ path: "users/:user_id", method: "GET", type: ContentType.JSON },
					{ user_id: "  user123  " }
				)
			).resolves.toBeDefined();
		});

		it("should handle numeric zero", async () => {
			const client = new LoopClient("https://api.example.com");

			await expect(
				client.apiCall(
					{
						path: "channels/:channel_id",
						method: "GET",
						type: ContentType.JSON
					},
					{ channel_id: 0 as unknown as string }
				)
			).resolves.toBeDefined();
		});
	});
});
