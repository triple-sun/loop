// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import { ConsoleLogger, type Logger } from "@triplesunn/logger";
import WebSocket from "ws";
import { getUserAgent } from "./instrument";

const MAX_WEBSOCKET_FAILS = 7;
const MIN_WEBSOCKET_RETRY_TIME = 3000; // 3 sec
const MAX_WEBSOCKET_RETRY_TIME = 300000; // 5 mins
const JITTER_RANGE = 2000; // 2 sec

const WEBSOCKET_HELLO = "hello";

export type MessageListener = (msg: WebSocketMessage) => void;
export type FirstConnectListener = () => void;
export type ReconnectListener = () => void;
export type MissedMessageListener = () => void;
export type ErrorListener = (event: Event) => void;
export type CloseListener = (connectFailCount: number) => void;

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
};

export default class WebSocketClient {
	private conn: WebSocket | null;
	private url: string | null;

	// responseSequence is the number to track a response sent
	// via the websocket. A response will always have the same sequence number
	// as the request.
	private responseSequence: number;

	// serverSequence is the incrementing sequence number from the
	// server-sent event stream.
	private serverSequence: number;
	private connectFailCount: number;
	private responseCallbacks: { [x: number]: (msg: unknown) => void };

	private messageListeners = new Set<MessageListener>();
	private firstConnectListeners = new Set<FirstConnectListener>();
	private reconnectListeners = new Set<ReconnectListener>();
	private missedMessageListeners = new Set<MissedMessageListener>();
	private closeListeners = new Set<CloseListener>();

	private connectionId: string | null;
	private postedAck: boolean;

	private resetCount: boolean;
	private logger: Logger;

	constructor(logger: Logger = new ConsoleLogger()) {
		this.conn = null;
		this.url = null;
		this.responseSequence = 1;
		this.serverSequence = 0;
		this.connectFailCount = 0;
		this.responseCallbacks = {};
		this.connectionId = "";
		this.postedAck = false;
		this.resetCount = true;
		this.logger = logger;
	}

	// on connect, only send auth cookie and blank state.
	// on hello, get the connectionID and store it.
	// on reconnect, send cookie, connectionID, sequence number.
	initialize(
		{
			token,
			postedAck,
			resetCount,
			url = this.url
		}: WebSocketClientInitArguments = { url: this.url }
	): void {
		if (this.conn) return;

		if (url == null) {
			this.logger.info("websocket must have connection url");
			return;
		}

		if (this.connectFailCount === 0) {
			this.logger.info(`websocket connecting to ${url}`);
		}

		if (typeof postedAck !== "undefined") this.postedAck = postedAck;
		if (typeof resetCount !== "undefined") this.resetCount = resetCount;

		// Add connection id, and last_sequence_number to the query param.
		// We cannot use a cookie because it will bleed across tabs.
		// We cannot also send it as part of the auth_challenge, because the session cookie is already sent with the request.
		this.url = url;
		this.conn = new WebSocket(
			`${url}?connection_id=${this.connectionId}&sequence_number=${this.serverSequence}${this.postedAck ? "&posted_ack=true" : ""}`
		);

		this.conn.onopen = () => {
			if (token) this.sendMessage("authentication_challenge", { token });

			if (this.connectFailCount > 0) {
				this.logger.info("websocket re-established connection");
				this.reconnectListeners.forEach(listener => {
					listener();
				});
			} else if (this.firstConnectListeners.size > 0) {
				this.firstConnectListeners.forEach(listener => {
					listener();
				});
			}

			this.connectFailCount = 0;
		};

		this.conn.onclose = () => {
			this.conn = null;
			this.responseSequence = 1;

			if (this.resetCount) {
				this.serverSequence = 0;
				this.connectionId = null;
			}

			if (this.connectFailCount === 0) this.logger.info("websocket closed");

			this.connectFailCount++;

			this.closeListeners.forEach(listener => {
				listener(this.connectFailCount);
			});

			let retryTime = MIN_WEBSOCKET_RETRY_TIME;

			// If we've failed a bunch of connections then start backing off
			if (this.connectFailCount > MAX_WEBSOCKET_FAILS) {
				retryTime =
					MIN_WEBSOCKET_RETRY_TIME *
					this.connectFailCount *
					this.connectFailCount;
				if (retryTime > MAX_WEBSOCKET_RETRY_TIME) {
					retryTime = MAX_WEBSOCKET_RETRY_TIME;
				}
			}

			// Applying jitter to avoid thundering herd problems.
			retryTime += Math.random() * JITTER_RANGE;

			setTimeout(() => {
				this.initialize({ url, token, postedAck });
			}, retryTime);
		};

		this.conn.onmessage = evt => {
			const msg =
				typeof evt.data === "string" ? JSON.parse(evt.data) : evt.data;

			if (msg.seq_reply) {
				// This indicates a reply to a websocket request.
				// We ignore sequence number validation of message responses
				// and only focus on the purely server side event stream.
				if (msg.error) {
					this.logger.info(msg);
				}

				if (this.responseCallbacks[msg.seq_reply]) {
					this.responseCallbacks[msg.seq_reply]?.(msg);
					Reflect.deleteProperty(this.responseCallbacks, msg.seq_reply);
				}
			} else if (this.messageListeners.size > 0) {
				// We check the hello packet, which is always the first packet in a stream.
				if (
					msg.event === WEBSOCKET_HELLO &&
					this.missedMessageListeners.size > 0
				) {
					this.logger.info("got connection id ", msg.data.connection_id);
					// If we already have a connectionId present, and server sends a different one,
					// that means it's either a long timeout, or server restart, or sequence number is not found.
					// Then we do the sync calls, and reset sequence number to 0.
					if (
						this.connectionId !== "" &&
						this.connectionId !== msg.data.connection_id
					) {
						this.logger.info(
							"long timeout, or server restart, or sequence number is not found."
						);

						for (const listener of this.missedMessageListeners) {
							try {
								listener();
							} catch (e) {
								this.logger.info(
									`missed message listener "${listener.name}" failed: ${e}`
								); // eslint-disable-line no-console
							}
						}

						this.serverSequence = 0;
					}

					// If it's a fresh connection, we have to set the connectionId regardless.
					// And if it's an existing connection, setting it again is harmless, and keeps the code simple.
					this.connectionId = msg.data.connection_id;
				}

				// Now we check for sequence number, and if it does not match,
				// we just disconnect and reconnect.
				if (msg.seq !== this.serverSequence) {
					this.logger.info(
						"missed websocket event, act_seq=" +
							msg.seq +
							" exp_seq=" +
							this.serverSequence
					);
					// We are not calling this.close() because we need to auto-restart.
					this.connectFailCount = 0;
					this.responseSequence = 1;
					this.conn?.close(); // Will auto-reconnect after MIN_WEBSOCKET_RETRY_TIME.
					return;
				}
				this.serverSequence = msg.seq + 1;

				this.messageListeners.forEach(listener => {
					listener(msg);
				});
			}
		};
	}

	public readonly listeners = {
		message: {
			add: (listener: MessageListener): void => {
				this.messageListeners.add(listener);
				if (this.messageListeners.size > 5) {
					this.logger.warn(
						`WebSocketClient has ${this.messageListeners.size} message listeners registered`
					);
				}
			},
			remove: (listener: MessageListener): void => {
				this.messageListeners.delete(listener);
			}
		},
		firstConnect: {
			add: (listener: FirstConnectListener): void => {
				this.firstConnectListeners.add(listener);

				if (this.firstConnectListeners.size > 5) {
					this.logger.warn(
						`WebSocketClient has ${this.firstConnectListeners.size} first connect listeners registered`
					);
				}
			},
			remove: (listener: FirstConnectListener): void => {
				this.firstConnectListeners.delete(listener);
			}
		},
		reconnect: {
			add: (listener: ReconnectListener): void => {
				this.reconnectListeners.add(listener);

				if (this.reconnectListeners.size > 5) {
					this.logger.warn(
						`WebSocketClient has ${this.reconnectListeners.size} reconnect listeners registered`
					);
				}
			},
			remove: (listener: ReconnectListener): void => {
				this.reconnectListeners.delete(listener);
			}
		},
		missed: {
			add: (listener: MissedMessageListener): void => {
				this.missedMessageListeners.add(listener);

				if (this.missedMessageListeners.size > 5) {
					this.logger.warn(
						`WebSocketClient has ${this.missedMessageListeners.size} missed message listeners registered`
					);
				}
			},
			remove: (listener: MissedMessageListener): void => {
				this.missedMessageListeners.delete(listener);
			}
		},
		close: {
			add: (listener: CloseListener): void => {
				this.closeListeners.add(listener);

				if (this.closeListeners.size > 5) {
					this.logger.warn(
						`WebSocketClient has ${this.closeListeners.size} close listeners registered`
					);
				}
			},
			remove: (listener: CloseListener): void => {
				this.closeListeners.delete(listener);
			}
		}
	};

	close() {
		this.connectFailCount = 0;
		this.responseSequence = 1;
		if (this.conn && this.conn.readyState === WebSocket.OPEN) {
			this.conn.onclose = () => {};
			this.conn.close();
			this.conn = null;
			this.logger.info("websocket closed");
		}
	}

	sendMessage(
		action: string,
		data: unknown,
		responseCallback?: (msg: unknown) => void
	) {
		const msg = {
			action,
			seq: this.responseSequence++,
			data
		};

		if (responseCallback) {
			this.responseCallbacks[msg.seq] = responseCallback;
		}

		if (this.conn && this.conn.readyState === WebSocket.OPEN) {
			this.conn.send(JSON.stringify(msg));
		} else if (!this.conn || this.conn.readyState === WebSocket.CLOSED) {
			this.conn = null;
			this.initialize();
		}
	}

	userTyping(channel_id: string, parent_id: string, callback?: () => void) {
		this.sendMessage(
			"user_typing",
			{
				channel_id,
				parent_id
			},
			callback
		);
	}

	updateActiveChannel(channel_id: string, callback?: (msg: unknown) => void) {
		this.sendMessage(
			"presence",
			{
				channel_id
			},
			callback
		);
	}

	updateActiveTeam(team_id: string, callback?: (msg: unknown) => void) {
		this.sendMessage(
			"presence",
			{
				team_id
			},
			callback
		);
	}

	updateActiveThread(
		is_thread_view: boolean,
		thread_channel_id: string,
		callback?: (msg: unknown) => void
	) {
		this.sendMessage(
			"presence",
			{
				thread_channel_id,
				is_thread_view
			},
			callback
		);
	}

	userUpdateActiveStatus(
		user_is_active: boolean,
		manual: boolean,
		callback?: () => void
	) {
		this.sendMessage(
			"user_update_active_status",
			{
				user_is_active,
				manual
			},
			callback
		);
	}

	acknowledgePostedNotification(
		postId: string,
		status: string,
		reason?: string,
		postedData?: string
	) {
		this.sendMessage("posted_notify_ack", {
			post_id: postId,
			user_agent: getUserAgent(),
			status,
			reason,
			data: postedData
		});
	}

	getStatuses(callback?: () => void) {
		this.sendMessage("get_statuses", null, callback);
	}

	getStatusesByIds(user_ids: string[], callback?: () => void) {
		this.sendMessage(
			"get_statuses_by_ids",
			{
				user_ids
			},
			callback
		);
	}
}
