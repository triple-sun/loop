import { afterAll, beforeAll, expect } from "@jest/globals";
import type { Hello } from "../src/types/messages";
import { getUserAgent, isHelloMessage, isLoopMessage } from "../src/utils";

describe("utils", () => {
	describe("instrument", () => {
		it("should return default user agent string", () => {
			const ua = getUserAgent();
			expect(ua).toContain("loop-ws-client");
			expect(ua).toContain(process.version.replace("v", ""));
		});
	});

	describe("isLoopMessage", () => {
		it("should return true for valid WebSocket message", () => {
			const data = {
				seq: 1,
				event: "posted",
				broadcast: {},
				data: {}
			};
			expect(isLoopMessage(data)).toBe(true);
		});

		it("should return false when required fields are missing", () => {
			expect(isLoopMessage({ event: "posted", broadcast: {}, data: {} })).toBe(
				false
			);
			expect(isLoopMessage({ seq: 1, broadcast: {}, data: {} })).toBe(false);
			expect(isLoopMessage({ seq: 1, event: "posted", data: {} })).toBe(false);
			expect(isLoopMessage({ seq: 1, event: "posted", broadcast: {} })).toBe(
				false
			);
		});
	});

	describe("isHelloMessage", () => {
		it("should return true for valid hello message", () => {
			const data = {
				connection_id: "conn-123"
			} as Hello["data"];
			expect(isHelloMessage("hello", data)).toBe(true);
		});

		it("should return false for wrong event type", () => {
			const data = {
				connection_id: "conn-123"
			} as Hello["data"];
			expect(isHelloMessage("posted", data)).toBe(false);
		});

		it("should return false when connection_id is missing or invalid", () => {
			expect(isHelloMessage("hello", {})).toBe(false);
			expect(isHelloMessage("hello", { connection_id: 123 })).toBe(false);
			expect(isHelloMessage("hello", null)).toBe(false);
			expect(isHelloMessage("hello", undefined)).toBe(false);
		});
	});

	describe("getUserAgent in browser", () => {
		const originalNavigator = global.navigator;
		const originalProcess = global.process;

		beforeAll(() => {
			// @ts-expect-error
			delete global.process;
			// @ts-expect-error
			global.navigator = {
				userAgent: "TestBrowser/1.0"
			};
		});

		afterAll(() => {
			global.process = originalProcess;
			global.navigator = originalNavigator;
		});

		it("should return browser user agent", () => {
			const ua = getUserAgent();
			expect(ua).toContain("loop-ws-client");
			expect(ua).toContain("browser/TestBrowser/1.0");
		});

		it("should return unknown if env is weird", () => {
			// @ts-expect-error
			global.navigator = {};
			const ua = getUserAgent();
			expect(ua).toContain("unknown");
		});
	});
});
