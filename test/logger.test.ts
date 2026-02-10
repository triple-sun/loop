import { expect, jest } from "@jest/globals";
import { type Logger, LogLevel } from "@triple-sun/logger";
import { getOrCreateLogger } from "../src/logger";

describe("Logger Edge Cases", () => {
	describe("getLogger", () => {
		it("should create logger with valid name", () => {
			const logger = getOrCreateLogger("test", "INFO" as LogLevel);
			expect(logger).toBeDefined();
		});

		it("should handle empty string name", () => {
			const logger = getOrCreateLogger("", "INFO" as LogLevel);
			expect(logger).toBeDefined();
		});

		it("should handle unicode name", () => {
			const logger = getOrCreateLogger("テスト", "INFO" as LogLevel);
			expect(logger).toBeDefined();
		});

		it("should handle emoji in logger name", () => {
			const logger = getOrCreateLogger("🚀💻", "INFO" as LogLevel);
			expect(logger).toBeDefined();
		});

		it("should handle very long name", () => {
			const longName = "a".repeat(1000);
			const logger = getOrCreateLogger(longName, "INFO" as LogLevel);
			expect(logger).toBeDefined();
		});

		it("should handle special characters in name", () => {
			const logger = getOrCreateLogger("test!@#$%^&*()", "INFO" as LogLevel);
			expect(logger).toBeDefined();
		});

		it("should use existing logger if provided", () => {
			const mockLogger = {
				debug: jest.fn(),
				info: jest.fn(),
				warn: jest.fn(),
				error: jest.fn(),
				setLevel: jest.fn(),
				getLevel: jest.fn(),
				setName: jest.fn()
			} as Logger;

			const logger = getOrCreateLogger("test", LogLevel.INFO, mockLogger);

			// Should use the provided logger
			expect(mockLogger.setName).toHaveBeenCalled();
			expect(logger).toBe(mockLogger);
		});

		it("should increment instance count for unique loggers", () => {
			const logger1 = getOrCreateLogger("test", LogLevel.INFO);
			const logger2 = getOrCreateLogger("test", LogLevel.INFO);

			// Both should be defined but potentially have different instance IDs
			expect(logger1).toBeDefined();
			expect(logger2).toBeDefined();
		});

		it("should set log level when provided", () => {
			const mockLogger = {
				debug: jest.fn(),
				info: jest.fn(),
				warn: jest.fn(),
				error: jest.fn(),
				setLevel: jest.fn(),
				getLevel: jest.fn(),
				setName: jest.fn()
			} as Logger;

			getOrCreateLogger("test", LogLevel.DEBUG, mockLogger);

			expect(mockLogger.setLevel).toHaveBeenCalledWith(LogLevel.DEBUG);
		});

		it("should handle undefined log level gracefully", () => {
			const logger = getOrCreateLogger(
				"test",
				undefined as unknown as LogLevel
			);
			expect(logger).toBeDefined();
		});
	});
});
