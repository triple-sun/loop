import type { Logger } from "@triple-sun/logger";

export type MessageListener = (msg: WebSocketMessage) => void;
export type FirstConnectListener = () => void;
export type ReconnectListener = () => void;
export type MissedMessageListener = () => void;
export type ErrorListener = (event: Event) => void;
export type CloseListener = (connectFailCount: number) => void;

export type WebSocketClientOptions = {
	url: string;
	token: string;
	logger?: Logger;
	postedAck?: boolean | undefined;
	/** Сброс счетчика при переподключении */
	resetCount?: boolean | undefined;
	jitterRange?: number | undefined;
	maxFails?: number | undefined;
	minRetryTime?: number | undefined;
	maxRetryTime?: number | undefined;
};

export type WebSocketClientInitArguments = {
	url?: string | null | undefined;
	token?: string | undefined;
	postedAck?: boolean | undefined;
	/** Сброс счетчика при переподключении */
	resetCount?: boolean | undefined;
};

export type WebSocketBroadcast = {
	omit_users: Record<string, boolean>;
	user_id: string;
	channel_id: string;
	team_id: string;
};

export type WebSocketMessage<T = unknown> = {
	event: string;
	data: T;
	broadcast: WebSocketBroadcast;
	seq: number;
	seq_reply?: number;
	error?: unknown;
};

export type WebSocketHelloMessageData = {
	connection_id: string;
	event: unknown;
};
