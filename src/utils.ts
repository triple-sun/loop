/** biome-ignore-all lint/complexity/useLiteralKeys: <ts4111> */
import { basename } from "node:path";
import type { Logger } from "@triple-sun/logger";
import type { AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import FormData from "form-data";
import { isStream } from "is-stream";
import { DEFAULT_FILE_NAME, WEBSOCKET_HELLO } from "./const";
import {
	type Address,
	type UserThread,
	type UserThreadSynthetic,
	UserThreadType,
	type WebSocketHelloMessageData,
	type WebSocketMessage
} from "./types";

export const wait = (ms: number) => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Checks request data for binary data
 */
export const checkForBinaryData = (data: unknown): boolean => {
	if (!data || typeof data !== "object") return false;

	for (const value of Object.values(data)) {
		if (Buffer.isBuffer(value) || isStream(value)) return true;
	}

	return false;
};

export const getFormDataConfig = (
	data: Record<string, unknown>,
	headers: AxiosHeaders
): InternalAxiosRequestConfig => {
	const config: InternalAxiosRequestConfig = {
		headers
	};

	const form = new FormData();

	for (const [key, value] of Object.entries(data)) {
		if (Buffer.isBuffer(value) || isStream(value)) {
			const opts: FormData.AppendOptions = {};
			opts.filename = (() => {
				// attempt to find filename from `value`. adapted from:
				// https://github.com/form-data/form-data/blob/028c21e0f93c5fefa46a7bbf1ba753e4f627ab7a/lib/form_data.js#L227-L230
				// formidable and the browser add a name property
				// fs- and request- streams have path property
				// biome-ignore lint/suspicious/noExplicitAny: form values can be anything
				const streamOrBuffer: any = value;
				if (typeof streamOrBuffer.name === "string") {
					return basename(streamOrBuffer.name);
				}
				if (typeof streamOrBuffer.path === "string") {
					return basename(streamOrBuffer.path);
				}
				return `${DEFAULT_FILE_NAME}_${Date.now().toString()}`;
			})();
			form.append(key as string, value, opts);
		} else if (key !== undefined && value !== undefined) {
			form.append(key, value);
		}
	}

	if (headers) {
		// Copying FormData-generated headers into headers param
		// not reassigning to headers param since it is passed by reference and behaves as an inout param
		for (const [header, value] of Object.entries(form.getHeaders())) {
			headers[header] = value;
		}
	}
	config.data = form;
	config.headers = headers;
	return config;
};

/**
 * Takes an object and redacts specific items
 * @param data
 * @returns
 */
export const redact = (data: unknown): string => {
	if (typeof data !== "object" || data === null) {
		return "Data is not an object!";
	}
	const flattened = Object.entries(data).map<[string, unknown] | []>(
		([key, value]) => {
			// no value provided
			if (value === undefined || value === null) return [];

			let serializedValue = value;

			// redact possible tokens
			if (key.match(/.*token.*/) !== null || key.match(/[Aa]uthorization/)) {
				serializedValue = "[[REDACTED]]";
			}

			// when value is buffer or stream we can avoid logging it
			if (Buffer.isBuffer(value) || isStream(value)) {
				serializedValue = "[[BINARY VALUE OMITTED]]";
			} else if (
				typeof value !== "string" &&
				typeof value !== "number" &&
				typeof value !== "boolean"
			) {
				serializedValue = JSON.stringify(value, null, 2);
			}
			return [key, serializedValue];
		}
	);

	// return as object
	return JSON.stringify(
		flattened.reduce(
			(accumulator, [key, value]) => {
				if (key !== undefined && value !== undefined) {
					accumulator[key] = value;
				}
				return accumulator;
			},
			{} as Record<string, unknown>
		)
	);
};

/**
 * @param path api method being called
 * @param logger instance of we clients logger
 * @param options arguments for the Web API method
 */
export const warnIfFallbackIsMissing = (
	path: string,
	logger: Logger,
	options?: Record<string, unknown> | unknown[]
): void => {
	if (!options || Array.isArray(options)) return;

	if (
		Array.isArray(options["attachments"]) &&
		options["attachments"].length > 0 &&
		options["attachments"].some(
			attachment => !attachment.fallback || attachment.fallback.trim() === ""
		)
	) {
		logger.warn(
			`The attachment-level \`fallback\` argument is missing in the request payload for a ${path} call - To avoid this warning, it is recommended to always provide a top-level \`text\` argument when posting a message. Alternatively, you can provide an attachment-level \`fallback\` argument, though this is now considered a legacy field (see https://docs.slack.dev/legacy/legacy-messaging/legacy-secondary-message-attachments for more details).`
		);
	}
};

export const areShippingDetailsValid = (
	address: Address | null | undefined
): boolean => {
	if (!address) return false;

	return Boolean(
		address.city &&
			address.country &&
			address.line1 &&
			address.postal_code &&
			address.state
	);
};

export const threadIsSynthetic = (
	thread: UserThread | UserThreadSynthetic
): thread is UserThreadSynthetic => thread.type === UserThreadType.Synthetic;

/**
 * Checks that evt.data is WebSocketMessage
 * @param data evt.data
 */
export const isLoopWebSocketMessage = (
	data: Record<string, unknown>
): data is WebSocketMessage => {
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
export const isWebSocketHelloMessage = (
	event: string,
	data: unknown
): data is WebSocketHelloMessageData => {
	if (
		data &&
		typeof data === "object" &&
		"connection_id" in data &&
		typeof data.connection_id === "string" &&
		event === WEBSOCKET_HELLO
	) {
		return true;
	}
	return false;
};
