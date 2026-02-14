import type { Logger, LogLevel } from "@triple-sun/logger";
import type { LoopMessage } from "./messages";

export type ElementType<T> =
	T extends Set<infer U>
		? U
		: T extends Array<infer U>
			? U
			: T extends Iterable<infer U>
				? U
				: never;

export type MessageListener = (msg: LoopMessage) => void;
export type FirstConnectListener = () => void;
export type ReconnectListener = () => void;
export type MissedMessageListener = () => void;
export type ErrorListener = (msg: ErrorEvent) => void;
export type CloseListener = (connectFailCount: number) => void;

export type Options = {
	/**
	 * @description Websocket connection url
	 * @example wss://your-loop.loop.ru/api/v4/websocket
	 * @example wss://your-loop.loop.ru
	 *
	 * Both are acceptable, api/v4/websocket will be added automatically if not present
	 */
	readonly url: string;

	/**
	 * @description Websocket auth token (usually is the same as regular auth token)
	 */
	readonly token: string;

	/**
	 * @description logger instance
	 */
	readonly logger?: Logger;

	/**
	 * @description will log only this level and above
	 */
	readonly logLevel?: LogLevel;

	/**
	 * @description if true, will send ack for each posted message
	 */
	readonly postedAck?: boolean | undefined;

	/**
	 * @description if true, will reset sequence and connection id on close
	 * @default true
	 */
	readonly resetSequenceOnClose?: boolean | undefined;

	/**
	 * @description jitter range for reconnecting
	 */
	readonly reconnectJitterRange?: number | undefined;

	/**
	 * @description max connection fails before backoff
	 */
	readonly maxReconnectFails?: number | undefined;

	/**
	 * @description min retry time
	 * @default 3000
	 */
	readonly minReconnectTime?: number | undefined;

	/**
	 * @description max retry time
	 */
	readonly maxReconnectTime?: number | undefined;

	/**
	 * @description Custom websocket constructor
	 */
	readonly wsConstructor?: (url: string) => WebSocket;
	readonly pingInterval?: number;
};

export type ListenerStore = {
	message: Set<MessageListener>;
	firstConnect: Set<FirstConnectListener>;
	reconnect: Set<ReconnectListener>;
	missedMessage: Set<MissedMessageListener>;
	close: Set<CloseListener>;
	error: Set<ErrorListener>;
};
