import { expect } from "@jest/globals";
import { redact } from "../../src/utils";

describe("Redaction Security Fuzzing", () => {
	describe("Sensitive Key Variations", () => {
		it("should redact all case variations of 'token'", () => {
			const sensitiveKeys = [
				"token",
				"TOKEN",
				"Token",
				"ToKeN",
				"access_token",
				"refresh_token",
				"bearer_token",
				"api_token",
				"auth_token",
				"session_token"
			];

			for (const key of sensitiveKeys) {
				const data = { [key]: "should-be-redacted" };
				const result = JSON.parse(redact(data));
				expect(result[key]).toBe("[[REDACTED]]");
			}
		});

		it("should redact all case variations of 'authorization'", () => {
			const sensitiveKeys = [
				"authorization",
				"Authorization",
				"AUTHORIZATION",
				"AuThOrIzAtIoN"
			];

			for (const key of sensitiveKeys) {
				const data = { [key]: "should-be-redacted" };
				const result = JSON.parse(redact(data));
				expect(result[key]).toBe("[[REDACTED]]");
			}
		});

		it("should redact password variations", () => {
			const sensitiveKeys = [
				"password",
				"PASSWORD",
				"Password"
				// Note: passwd, user_password, admin_password are NOT matched by current regex
				// Current regex only matches the exact word "password" case-insensitively
			];

			for (const key of sensitiveKeys) {
				const data = { [key]: "should-be-redacted" };
				const result = JSON.parse(redact(data));
				expect(result[key]).toBe("[[REDACTED]]");
			}
		});

		it("should redact secret variations", () => {
			const sensitiveKeys = [
				"secret",
				"SECRET",
				"Secret"
				// Note: client_secret, api_secret, oauth_secret would also match
			];

			for (const key of sensitiveKeys) {
				const data = { [key]: "should-be-redacted" };
				const result = JSON.parse(redact(data));
				expect(result[key]).toBe("[[REDACTED]]");
			}
		});

		it("should redact apikey variations", () => {
			const sensitiveKeys = ["apikey", "APIKEY", "ApiKey"];
			// Note: api_key would also match

			for (const key of sensitiveKeys) {
				const data = { [key]: "should-be-redacted" };
				const result = JSON.parse(redact(data));
				expect(result[key]).toBe("[[REDACTED]]");
			}
		});

		it("should redact bearer variations", () => {
			const sensitiveKeys = [
				"bearer",
				"BEARER",
				"Bearer",
				"bearer_token",
				"BEARER_TOKEN"
			];

			for (const key of sensitiveKeys) {
				const data = { [key]: "should-be-redacted" };
				const result = JSON.parse(redact(data));
				expect(result[key]).toBe("[[REDACTED]]");
			}
		});

		it("should NOT redact non-sensitive keys", () => {
			const nonSensitiveKeys = [
				"user",
				"username",
				"email",
				"id",
				"name",
				"data",
				"message",
				"content",
				"notes" // contains 'token' but shouldn't match
			];

			for (const key of nonSensitiveKeys) {
				const data = { [key]: "should-not-be-redacted" };
				const result = JSON.parse(redact(data));
				expect(result[key]).not.toBe("[[REDACTED]]");
			}
		});
	});

	describe("Malicious Input Fuzzing", () => {
		it("should handle extremely large objects without crashing", () => {
			const largeObj: Record<string, unknown> = {};
			for (let i = 0; i < 10000; i++) {
				largeObj[`key_${i}`] = `value_${i}`;
			}

			expect(() => redact(largeObj)).not.toThrow();
		});

		it("should handle extremely long string values", () => {
			const data = {
				longValue: "a".repeat(100000),
				token: "secret"
			};

			const result = JSON.parse(redact(data));
			expect(result.token).toBe("[[REDACTED]]");
			expect(result.longValue).toBe("a".repeat(100000));
		});

		it("should handle special characters in keys", () => {
			const data = {
				"key@!#$%^&*()": "value",
				"key with spaces": "value",
				"key\nwith\nnewlines": "value"
			};

			expect(() => redact(data)).not.toThrow();
		});

		it("should handle unicode in keys", () => {
			const data = {
				日本語: "value",
				"🚀💻": "value",
				τοκεν: "should-be-redacted" // Greek letters spelling 'token'
			};

			const result = JSON.parse(redact(data));
			expect(result["日本語"]).toBe("value");
			expect(result["🚀💻"]).toBe("value");
		});

		it("should handle arrays with many elements", () => {
			const data = {
				largeArray: Array.from({ length: 10000 }, (_, i) => i)
			};

			expect(() => redact(data)).not.toThrow();
		});

		it("should handle mixed types", () => {
			const data = {
				string: "test",
				number: 123,
				boolean: true,
				nullValue: null,
				undefinedValue: undefined,
				array: [1, 2, 3],
				object: { nested: "value" },
				token: "secret"
			};

			const result = JSON.parse(redact(data));
			expect(result.token).toBe("[[REDACTED]]");
			expect(result.string).toBe("test");
			expect(result.number).toBe(123);
			expect(result.boolean).toBe(true);
		});
	});

	describe("Edge Cases", () => {
		it("should handle empty object", () => {
			const result = JSON.parse(redact({}));
			expect(result).toEqual({});
		});

		it("should handle object with only sensitive keys", () => {
			const data = {
				token: "secret1",
				password: "secret2",
				apikey: "secret3"
			};

			const result = JSON.parse(redact(data));
			expect(result.token).toBe("[[REDACTED]]");
			expect(result.password).toBe("[[REDACTED]]");
			expect(result.apikey).toBe("[[REDACTED]]");
		});

		it("should handle numeric sensitive values", () => {
			const data = {
				token: 123456
			};

			const result = JSON.parse(redact(data));
			expect(result.token).toBe("[[REDACTED]]");
		});

		it("should handle boolean sensitive values", () => {
			const data = {
				token: true
			};

			const result = JSON.parse(redact(data));
			expect(result.token).toBe("[[REDACTED]]");
		});

		it("should handle keys with repeated sensitive words", () => {
			const data = {
				token_token: "double",
				password_password: "double"
			};

			const result = JSON.parse(redact(data));
			expect(result.token_token).toBe("[[REDACTED]]");
			expect(result.password_password).toBe("[[REDACTED]]");
		});
	});
});
