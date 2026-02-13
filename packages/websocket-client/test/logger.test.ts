import { describe, expect } from "@jest/globals";
import { ConsoleLogger, LogLevel } from "@triple-sun/logger";
import { getLogger } from "../src/logger";

describe("logger", () => {
	it("should return a new Logger instance with correct name", () => {
		const logger = getLogger(LogLevel.INFO);
		// @ts-expect-error - name is protected
		expect(logger.name).toMatch(/^loop-ws-client:\d+$/);
	});

	it("should set the log level if provided", () => {
		const logger = getLogger(LogLevel.DEBUG);
		// @ts-expect-error - level is protected
		expect(logger.level).toBe(LogLevel.DEBUG);
	});

	it("should not set the log level if none provided", () => {
		const logger = getLogger();
		// @ts-expect-error - level is protected
		expect(logger.level).toBe(LogLevel.INFO);
	});

	it("should verify unique IDs are assigned", () => {
		const logger1 = getLogger(LogLevel.INFO);
		const logger2 = getLogger(LogLevel.INFO);
		// @ts-expect-error - name is protected
		expect(logger1.name).not.toBe(logger2.name);
	});

	it("should return existing logger if provided", () => {
		const existingLogger = new ConsoleLogger();
		const logger = getLogger(LogLevel.INFO, existingLogger);
		expect(logger).toBe(existingLogger);
	});
});
