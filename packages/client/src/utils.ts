import { basename } from "node:path";
import type { Logger } from "@triple-sun/logger";
import type { AxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";
import FormData from "form-data";
import { isStream } from "is-stream";
import type {
	CloudCustomerAddress,
	UserThread,
	UserThreadSynthetic
} from "loop-types";
import { DEFAULT_FILE_NAME } from "./const";

interface FileLike {
	name?: string;
	path?: string;
}

export const wait = (ms: number): Promise<void> => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

export const isValidUrl = (string: string): boolean => {
	try {
		new URL(string);
		return true;
	} catch (_) {
		return false;
	}
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
	headers: AxiosRequestHeaders
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
				const streamOrBuffer = value as FileLike;

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
		for (const [header, value] of Object.entries(form.getHeaders())) {
			headers[header] = value;
		}
	}
	config.data = form;
	config.headers = headers;
	return config;
};

/**
 * Regex pattern to match sensitive keys that should be redacted
 * Matches: token, authorization, password, secret, apikey, bearer (case-insensitive)
 */
const SENSITIVE_KEYS_REGEX =
	/token|authorization|password|secret|apikey|bearer/i;

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

			// Redact sensitive keys using pre-compiled case-insensitive regex
			if (SENSITIVE_KEYS_REGEX.test(key)) {
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
	address: CloudCustomerAddress | null | undefined
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
): thread is UserThreadSynthetic => thread.type === "S";
