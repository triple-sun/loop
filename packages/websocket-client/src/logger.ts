import { ConsoleLogger, type Logger, LogLevel } from "@triple-sun/logger";

let instanceCount = 0;

/**
 * INTERNAL interface for getting or creating a named Logger.
 * */
export function getLogger(
	level: LogLevel = LogLevel.INFO,
	existing?: Logger
): Logger {
	// Get a unique ID for the logger.
	const instanceId = instanceCount;

	instanceCount++;

	// Set up the logger.
	const logger: Logger = (() => {
		if (existing !== undefined) {
			if (level !== undefined) {
				existing.debug(
					"The logLevel given to WebClient was ignored as you also gave logger"
				);
			}
			return existing;
		}

		return new ConsoleLogger();
	})();

	logger.setName(`loop-ws-client:${instanceId}`);
	logger.setLevel(level);

	return logger;
}
