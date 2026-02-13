import packageJson from "../package.json";
import { LoopEvent } from "./types/events";
import type { Hello, LoopMessage } from "./types/messages";

const getProcessOrBrowserString = (): string => {
	if (typeof process !== "undefined" && process?.version) {
		return `${process.title}/${process.version.replace("v", "")} `;
	}

	if (typeof navigator !== "undefined" && navigator?.userAgent) {
		return `browser/${navigator.userAgent} `;
	}

	return "unknown ";
};

/**
 * Returns the current User-Agent value for instrumentation
 */
export function getUserAgent(): string {
	return (
		`${packageJson.name.replace("/", ":")}/${packageJson.version} ` +
		`${getProcessOrBrowserString()} `
	);
}

export const isValidUrl = (string: string): boolean => {
	try {
		new URL(string);
		return true;
	} catch (_) {
		return false;
	}
};

/**
 * Checks that evt.data is WebSocketMessage
 * @param data evt.data
 */
export const isLoopMessage = (
	data: Record<string, unknown>
): data is LoopMessage => {
	if (
		"seq" in data &&
		"event" in data &&
		"broadcast" in data &&
		"data" in data
	) {
		return true;
	}

	return false;
};

/**
 * Checks that WebSocketMessage.data is WebSocketHelloMessageData
 * @param data msg.data
 */
export const isHelloMessage = (
	event: string,
	data: unknown
): data is Hello["data"] => {
	return (
		event === LoopEvent.HELLO &&
		data !== null &&
		typeof data === "object" &&
		"connection_id" in data &&
		typeof data.connection_id === "string"
	);
};
