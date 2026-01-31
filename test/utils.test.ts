import { PassThrough } from "node:stream";
import { expect, jest } from "@jest/globals";
import type { Logger } from "@triple-sun/logger";
import { AxiosHeaders } from "axios";
import FormData from "form-data";
import {
	type UserThread,
	type UserThreadSynthetic,
	UserThreadType,
	type WebSocketHelloMessageData
} from "../src/types";
import {
	areShippingDetailsValid,
	checkForBinaryData,
	getFormDataConfig,
	isLoopWebSocketMessage,
	isWebSocketHelloMessage,
	redact,
	threadIsSynthetic,
	wait,
	warnIfFallbackIsMissing
} from "../src/utils";

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: <jest>
describe("utils", () => {
	describe("wait", () => {
		it("should resolve after specified time", async () => {
			const start = Date.now();
			await wait(100);
			const end = Date.now();
			expect(end - start).toBeGreaterThanOrEqual(95);
		});
	});

	describe("checkForBinaryData", () => {
		it("should return false for null/undefined/primitive values", () => {
			expect(checkForBinaryData(null)).toBe(false);
			expect(checkForBinaryData(undefined)).toBe(false);
			expect(checkForBinaryData(1)).toBe(false);
			expect(checkForBinaryData("string")).toBe(false);
		});

		it("should return true if object contains a Buffer", () => {
			expect(checkForBinaryData({ file: Buffer.from("test") })).toBe(true);
		});

		it("should return true if object contains a Stream", () => {
			const stream = new PassThrough();
			expect(checkForBinaryData({ file: stream })).toBe(true);
		});

		it("should return false for plain objects without binary data", () => {
			expect(checkForBinaryData({ key: "value" })).toBe(false);
		});
	});

	describe("getFormDataConfig", () => {
		it("should return config with FormData object", () => {
			const headers = new AxiosHeaders();
			const config = getFormDataConfig({ key: "value" }, headers);
			expect(config.data).toBeInstanceOf(FormData);
			expect(config.headers).toBe(headers);
		});

		it("should append regular fields to FormData", () => {
			const headers = new AxiosHeaders();
			const config = getFormDataConfig({ key: "value", num: 123 }, headers);
			const form = config.data as FormData;
			expect(form).toBeInstanceOf(FormData);
		});

		it("should append Buffer with filename options if available (name property)", () => {
			const headers = new AxiosHeaders();
			const buffer = Buffer.from("test");
			// biome-ignore lint/suspicious/noExplicitAny: <test>
			(buffer as any).name = "test.png";
			const config = getFormDataConfig({ file: buffer }, headers);
			expect(config.data).toBeInstanceOf(FormData);
		});

		it("should append Stream with filename options if available (path property)", () => {
			const headers = new AxiosHeaders();
			const stream = new PassThrough();
			// biome-ignore lint/suspicious/noExplicitAny: <test>
			(stream as any).path = "/path/to/test.png";
			const config = getFormDataConfig({ file: stream }, headers);
			expect(config.data).toBeInstanceOf(FormData);
		});

		it("should generate default filename for buffer/stream if name unavailable", () => {
			const headers = new AxiosHeaders();
			const buffer = Buffer.from("test");
			const config = getFormDataConfig({ file: buffer }, headers);
			expect(config.data).toBeInstanceOf(FormData);
		});
	});

	describe("redact", () => {
		it('should return "Data is not an object!" for non-object inputs', () => {
			expect(redact("string")).toBe("Data is not an object!");
			expect(redact(null)).toBe("Data is not an object!");
		});

		it('should redact keys containing "token" or "Authorization" with "[[REDACTED]]"', () => {
			const data = {
				token: "secret",
				my_token: "secret",
				Authorization: "Bearer secret",
				authorization: "Bearer secret",
				other: "value"
			};
			const result = JSON.parse(redact(data));
			expect(result.token).toBe("[[REDACTED]]");
			expect(result.my_token).toBe("[[REDACTED]]");
			expect(result.Authorization).toBe("[[REDACTED]]");
			expect(result.authorization).toBe("[[REDACTED]]");
			expect(result.other).toBe("value");
		});

		it('should redact Buffer/Stream values with "[[BINARY VALUE OMITTED]]"', () => {
			const data = {
				buf: Buffer.from("test"),
				stream: new PassThrough()
			};
			const result = JSON.parse(redact(data));
			expect(result.buf).toBe("[[BINARY VALUE OMITTED]]");
			expect(result.stream).toBe("[[BINARY VALUE OMITTED]]");
		});

		it("should stringify objects/arrays", () => {
			const data = {
				obj: { a: 1 },
				arr: [1, 2]
			};
			const result = JSON.parse(redact(data));
			expect(result.obj).toBe(JSON.stringify({ a: 1 }, null, 2));
			expect(result.arr).toBe(JSON.stringify([1, 2], null, 2));
		});

		it("should return empty object for null/undefined values in object", () => {
			const data = {
				a: undefined,
				b: null,
				c: 1
			};
			const result = JSON.parse(redact(data));
			expect(result.a).toBeUndefined();
			expect(result.b).toBeUndefined();
			expect(result.c).toBe(1);
		});
	});

	describe("warnIfFallbackIsMissing", () => {
		let logger: Logger;
		let warnSpy: jest.SpiedFunction<typeof logger.warn>;

		beforeEach(() => {
			logger = {
				debug: jest.fn(),
				info: jest.fn(),
				warn: jest.fn(),
				error: jest.fn(),
				setLevel: jest.fn(),
				getLevel: jest.fn(),
				setName: jest.fn()
			} as Logger;
			warnSpy = jest.spyOn(logger, "warn");
		});

		it("should return early if options is not an object or is empty", () => {
			warnIfFallbackIsMissing("test", logger, undefined);
			warnIfFallbackIsMissing("test", logger, []);
			expect(warnSpy).not.toHaveBeenCalled();
		});

		it("should log warning if attachments is present but fallback is missing or empty", () => {
			warnIfFallbackIsMissing("test", logger, {
				attachments: [{ text: "foo" }]
			});
			expect(warnSpy).toHaveBeenCalled();

			warnSpy.mockClear();
			warnIfFallbackIsMissing("test", logger, {
				attachments: [{ text: "foo", fallback: "" }]
			});
			expect(warnSpy).toHaveBeenCalled();
			expect(warnSpy.mock.calls[0]?.[0]).toContain(
				"fallback` argument is missing"
			);
		});

		it("should NOT log warning if fallback is present", () => {
			warnIfFallbackIsMissing("test", logger, {
				attachments: [{ text: "foo", fallback: "fallback" }]
			});
			expect(warnSpy).not.toHaveBeenCalled();
		});
	});

	describe("areShippingDetailsValid", () => {
		it("should return true for valid address", () => {
			expect(
				areShippingDetailsValid({
					city: "New York",
					country: "US",
					line1: "123 Main St",
					line2: "",
					postal_code: "10001",
					state: "NY"
				})
			).toBe(true);
		});

		it("should return false when any required field is missing or empty", () => {
			expect(
				areShippingDetailsValid({
					city: "",
					country: "US",
					line1: "123 Main St",
					line2: "",
					postal_code: "10001",
					state: "NY"
				})
			).toBe(false);
			expect(
				areShippingDetailsValid({
					city: "New York",
					country: "",
					line1: "123 Main St",
					line2: "",
					postal_code: "10001",
					state: "NY"
				})
			).toBe(false);
		});

		it("should return false for null or undefined", () => {
			expect(areShippingDetailsValid(null)).toBe(false);
			expect(areShippingDetailsValid(undefined)).toBe(false);
		});
	});

	describe("threadIsSynthetic", () => {
		it("should return true for synthetic thread", () => {
			const thread: UserThreadSynthetic = {
				type: UserThreadType.Synthetic,
				id: "thread-id"
			} as UserThreadSynthetic;
			expect(threadIsSynthetic(thread)).toBe(true);
		});

		it("should return false for non-synthetic thread", () => {
			const thread: UserThread = {
				type: "" as UserThreadType,
				id: "thread-id"
			} as UserThread;
			expect(threadIsSynthetic(thread)).toBe(false);
		});
	});

	describe("isLoopWebSocketMessage", () => {
		it("should return true for valid WebSocket message", () => {
			const data = {
				seq: 1,
				event: "posted",
				broadcast: {},
				data: {}
			};
			expect(isLoopWebSocketMessage(data)).toBe(true);
		});

		it("should return false when required fields are missing", () => {
			expect(
				isLoopWebSocketMessage({ event: "posted", broadcast: {}, data: {} })
			).toBe(false);
			expect(isLoopWebSocketMessage({ seq: 1, broadcast: {}, data: {} })).toBe(
				false
			);
			expect(
				isLoopWebSocketMessage({ seq: 1, event: "posted", data: {} })
			).toBe(false);
			expect(
				isLoopWebSocketMessage({ seq: 1, event: "posted", broadcast: {} })
			).toBe(false);
		});
	});

	describe("isWebSocketHelloMessage", () => {
		it("should return true for valid hello message", () => {
			const data = {
				connection_id: "conn-123"
			} as WebSocketHelloMessageData;
			expect(isWebSocketHelloMessage("hello", data)).toBe(true);
		});

		it("should return false for wrong event type", () => {
			const data = {
				connection_id: "conn-123"
			} as WebSocketHelloMessageData;
			expect(isWebSocketHelloMessage("posted", data)).toBe(false);
		});

		it("should return false when connection_id is missing or invalid", () => {
			expect(isWebSocketHelloMessage("hello", {})).toBe(false);
			expect(isWebSocketHelloMessage("hello", { connection_id: 123 })).toBe(
				false
			);
			expect(isWebSocketHelloMessage("hello", null)).toBe(false);
			expect(isWebSocketHelloMessage("hello", undefined)).toBe(false);
		});
	});
});
