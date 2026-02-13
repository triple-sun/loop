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
	url: string;
	token: string;
	logger?: Logger;
	logLevel?: LogLevel;
	postedAck?: boolean | undefined;
	/** Should reset count on reconnect? Fixes loop websocket closed error */
	resetCount?: boolean | undefined;
	jitterRange?: number | undefined;
	maxFails?: number | undefined;
	minRetryTime?: number | undefined;
	maxRetryTime?: number | undefined;
	wsCreator?: (url: string) => WebSocket;
	clientPingInterval?: number;
};

export type ListenerStore = {
	message: Set<MessageListener>;
	firstConnect: Set<FirstConnectListener>;
	reconnect: Set<ReconnectListener>;
	missedMessage: Set<MissedMessageListener>;
	close: Set<CloseListener>;
	error: Set<ErrorListener>;
};
