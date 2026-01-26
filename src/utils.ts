/** biome-ignore-all lint/complexity/useLiteralKeys: <ts4111> */
import { basename } from "node:path";
import type { Logger } from "@triplesunn/logger";
import type { AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import FormData from "form-data";
import { isStream } from "is-stream";
import { DEFAULT_FILE_NAME } from "./const";

export const wait = (ms: number) => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Flattens and checks request data for binary data
 */
export const flattenRequestData = (
	data: Record<string, unknown>
): { hasBinaryData: boolean; flattened: ([string, unknown] | [])[] } => {
	let hasBinaryData = false;

	const flattened = Object.entries(data).map<[string, unknown] | []>(
		([key, value]) => {
			if (value === undefined || value === null) return [];
			if (Buffer.isBuffer(value) || isStream(value)) {
				hasBinaryData = true;
			} else if (
				typeof value !== "string" &&
				typeof value !== "number" &&
				typeof value !== "boolean"
			) {
				// if value is anything other than string, number, boolean, binary data, a Stream, or a Buffer, then encode it
				// as a JSON string.
				return [key, JSON.stringify(value)];
			}

			return [key, value];
		}
	);

	return { hasBinaryData, flattened };
};

export const getFormDataConfig = (
	flattened: ([string, unknown] | [])[],
	headers: AxiosHeaders
): InternalAxiosRequestConfig => {
	const config: InternalAxiosRequestConfig = {
		headers
	};

	const form = flattened.reduce((frm, [key, value]) => {
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
				return DEFAULT_FILE_NAME;
			})();
			frm.append(key as string, value, opts);
		} else if (key !== undefined && value !== undefined) {
			frm.append(key, value);
		}
		return frm;
	}, new FormData());

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
	// biome-ignore lint/suspicious/noExplicitAny: objects can be anything
	const flattened = Object.entries(data).map<[string, any] | []>(
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
				serializedValue = JSON.stringify(value);
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
 * Log a warning when using chat.postMessage without text argument or attachments with fallback argument
 * @param method api method being called
 * @param logger instance of we clients logger
 * @param options arguments for the Web API method
 */
export const warnIfFallbackIsMissing = (
	method: string,
	logger: Logger,
	options?: Record<string, unknown>
): void => {
	const targetMethods = [
		"chat.postEphemeral",
		"chat.postMessage",
		"chat.scheduleMessage"
	];
	const isTargetMethod = targetMethods.includes(method);

	const hasAttachments = (args: Record<string, unknown>) =>
		Array.isArray(args["attachments"]) && args["attachments"].length;

	const missingAttachmentFallbackDetected = (args: Record<string, unknown>) =>
		Array.isArray(args["attachments"]) &&
		args["attachments"].some(
			attachment => !attachment.fallback || attachment.fallback.trim() === ""
		);

	const isEmptyText = (args: Record<string, unknown>) =>
		(args["text"] === undefined ||
			args["text"] === null ||
			args["text"] === "") &&
		(args["markdown_text"] === undefined ||
			args["markdown"] === null ||
			args["markdown_text"] === "");

	const buildMissingTextWarning = () =>
		`The top-level \`text\` argument is missing in the request payload for a ${method} call - It's a best practice to always provide a \`text\` argument when posting a message. The \`text\` is used in places where the content cannot be rendered such as: system push notifications, assistive technology such as screen readers, etc.`;

	const buildMissingFallbackWarning = () =>
		`Additionally, the attachment-level \`fallback\` argument is missing in the request payload for a ${method} call - To avoid this warning, it is recommended to always provide a top-level \`text\` argument when posting a message. Alternatively, you can provide an attachment-level \`fallback\` argument, though this is now considered a legacy field (see https://docs.slack.dev/legacy/legacy-messaging/legacy-secondary-message-attachments for more details).`;
	if (isTargetMethod && typeof options === "object") {
		if (hasAttachments(options)) {
			if (missingAttachmentFallbackDetected(options) && isEmptyText(options)) {
				logger.warn(buildMissingTextWarning());
				logger.warn(buildMissingFallbackWarning());
			}
		} else if (isEmptyText(options)) {
			logger.warn(buildMissingTextWarning());
		}
	}
};

/**
 * Log a warning when thread_ts is not a string
 * @param method api method being called
 * @param logger instance of web clients logger
 * @param options arguments for the Web API method
 */
export const warnIfThreadTsIsNotString = (
	method: string,
	logger: Logger,
	options?: Record<string, unknown>
): void => {
	const targetMethods = [
		"chat.postEphemeral",
		"chat.postMessage",
		"chat.scheduleMessage",
		"files.upload"
	];
	const isTargetMethod = targetMethods.includes(method);

	if (
		isTargetMethod &&
		options?.["thread_ts"] !== undefined &&
		typeof options?.["thread_ts"] !== "string"
	) {
		logger.warn(buildThreadTsWarningMessage(method));
	}
};

export const buildThreadTsWarningMessage = (method: string): string => {
	return `The given thread_ts value in the request payload for a ${method} call is a float value. We highly recommend using a string value instead.`;
};
