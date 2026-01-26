// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import { ConsoleLogger, type Logger } from "@triplesunn/logger";
import WebSocket from "ws";
import {
	WEBSOCKET_HELLO,
	WEBSOCKET_JITTER_RANGE,
	WEBSOCKET_MAX_FAILS,
	WEBSOCKET_MAX_RETRY_TIME,
	WEBSOCKET_MIN_RETRY_TIME
} from "./const";
import { getUserAgent } from "./instrument";
import type {
	CloseListener,
	FirstConnectListener,
	MessageListener,
	MissedMessageListener,
	ReconnectListener,
	WebSocketClientInitArguments,
	WebSocketClientOptions
} from "./types";

export default class WebSocketClient {
	private conn: WebSocket | null;
	/**
	 * @example wss://your-loop.loop.ru/api/v4/websocket
	 */
	private url: string | null;
	private token: string;

	private logger: Logger;

	/**
	 * @description rSequence is the number to track a response sent
	 * via the websocket. A response will always have the same sequence number
	 * as the request.
	 */
	private rSequence: number;

	/**
	 * @description  sSequence is the incrementing sequence number from the
	 * server-sent event stream.
	 */
	private sSequence: number;
	private connFailCount: number;
	private responseCallbacks: { [x: number]: (msg: unknown) => void };

	private messageListeners = new Set<MessageListener>();
	private firstConnectListeners = new Set<FirstConnectListener>();
	private reconnectListeners = new Set<ReconnectListener>();
	private missedMessageListeners = new Set<MissedMessageListener>();
	private closeListeners = new Set<CloseListener>();

	private connectionId: string | null;
	private postedAck: boolean;

	private resetCount: boolean;

	private jitterRange: number;
	private maxFails: number;
	private minRetryTime: number;
	private maxRetryTime: number;

	constructor({
		url,
		token,
		resetCount = true,
		postedAck = false,
		logger = new ConsoleLogger(),
		jitterRange = WEBSOCKET_JITTER_RANGE,
		maxFails = WEBSOCKET_MAX_FAILS,
		minRetryTime = WEBSOCKET_MIN_RETRY_TIME,
		maxRetryTime = WEBSOCKET_MAX_RETRY_TIME
	}: WebSocketClientOptions) {
		this.conn = null;
		this.url = url;
		this.token = token;
		this.rSequence = 1;
		this.sSequence = 0;
		this.connFailCount = 0;
		this.responseCallbacks = {};
		this.connectionId = "";
		this.postedAck = postedAck;
		this.resetCount = resetCount;
		this.logger = logger;
		this.jitterRange = jitterRange;
		this.maxFails = maxFails;
		this.minRetryTime = minRetryTime;
		this.maxRetryTime = maxRetryTime;
	}

	// on connect, only send auth cookie and blank state.
	// on hello, get the connectionID and store it.
	// on reconnect, send cookie, connectionID, sequence number.
	initialize(
		{
			postedAck,
			resetCount,
			url = this.url,
			token = this.token
		}: WebSocketClientInitArguments = { url: this.url, token: this.token }
	): void {
		if (this.conn) return;

		if (url == null) {
			this.logger.info("websocket must have connection url");
			return;
		}

		if (this.connFailCount === 0) {
			this.logger.info(`websocket connecting to ${url}`);
		}

		if (typeof postedAck !== "undefined") this.postedAck = postedAck;
		if (typeof resetCount !== "undefined") this.resetCount = resetCount;

		// Add connection id, and last_sequence_number to the query param.
		// We cannot use a cookie because it will bleed across tabs.
		// We cannot also send it as part of the auth_challenge, because the session cookie is already sent with the request.
		this.url = url;
		this.conn = new WebSocket(
			`${url}?connection_id=${this.connectionId}&sequence_number=${this.sSequence}${this.postedAck ? "&posted_ack=true" : ""}`
		);

		this.conn.onopen = () => {
			if (token) this.sendMessage("authentication_challenge", { token });

			if (this.connFailCount > 0) {
				this.logger.info("websocket re-established connection");
				this.reconnectListeners.forEach(listener => {
					listener();
				});
			} else if (this.firstConnectListeners.size > 0) {
				this.firstConnectListeners.forEach(listener => {
					listener();
				});
			}

			this.connFailCount = 0;
		};

		this.conn.onclose = () => {
			this.conn = null;
			this.rSequence = 1;

			if (this.resetCount) {
				this.sSequence = 0;
				this.connectionId = null;
			}

			if (this.connFailCount === 0) this.logger.info("websocket closed");

			this.connFailCount++;

			this.closeListeners.forEach(listener => {
				listener(this.connFailCount);
			});

			let retryTime = WEBSOCKET_MIN_RETRY_TIME;

			// If we've failed a bunch of connections then start backing off
			if (this.connFailCount > this.maxFails) {
				retryTime = this.minRetryTime * this.connFailCount * this.connFailCount;

				if (retryTime > this.maxRetryTime) retryTime = this.maxRetryTime;
			}

			// Applying jitter to avoid thundering herd problems.
			retryTime += Math.random() * this.jitterRange;

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

						this.sSequence = 0;
					}

					// If it's a fresh connection, we have to set the connectionId regardless.
					// And if it's an existing connection, setting it again is harmless, and keeps the code simple.
					this.connectionId = msg.data.connection_id;
				}

				// Now we check for sequence number, and if it does not match,
				// we just disconnect and reconnect.
				if (msg.seq !== this.sSequence) {
					this.logger.info(
						"missed websocket event, act_seq=" +
							msg.seq +
							" exp_seq=" +
							this.sSequence
					);
					// We are not calling this.close() because we need to auto-restart.
					this.connFailCount = 0;
					this.rSequence = 1;
					this.conn?.close(); // Will auto-reconnect after MIN_WEBSOCKET_RETRY_TIME.
					return;
				}
				this.sSequence = msg.seq + 1;

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
		this.connFailCount = 0;
		this.rSequence = 1;
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
			seq: this.rSequence++,
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
