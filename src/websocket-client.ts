// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import { ConsoleLogger, type Logger, LogLevel } from "@triple-sun/logger";
import WebSocket from "ws";
import {
	WEBSOCKET_JITTER_RANGE,
	WEBSOCKET_MAX_FAILS,
	WEBSOCKET_MAX_RETRY_TIME,
	WEBSOCKET_MIN_RETRY_TIME
} from "./const";
import { getUserAgent } from "./instrument";
import { getLogger } from "./logger";
import type {
	CloseListener,
	FirstConnectListener,
	MessageListener,
	MissedMessageListener,
	ReconnectListener,
	WebSocketClientInitArguments,
	WebSocketClientOptions,
	WebSocketHelloMessageData,
	WebSocketMessage
} from "./types";
import { isLoopWebSocketMessage, isWebSocketHelloMessage } from "./utils";

export default class WebSocketClient {
	/**
	 * @description Websocket connection url
	 * @example wss://your-loop.loop.ru/api/v4/websocket
	 */
	private url: string | null;
	/**
	 * @description Websocket auth token (usually is the same as regular auth token)
	 */
	private token: string;
	/**
	 * @description logger instance
	 */
	private logger: Logger;
	/**
	 * @description WebSocket connection (if connected)
	 */
	private conn: WebSocket | null;

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

	/**
	 * The name used to prefix all logging generated from this object
	 */
	private static loggerName = "LoopWebSocketClient";

	constructor({
		url,
		token,
		resetCount = true,
		postedAck = false,
		logger = new ConsoleLogger(),
		logLevel = undefined,
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
		this.jitterRange = jitterRange;
		this.maxFails = maxFails;
		this.minRetryTime = minRetryTime;
		this.maxRetryTime = maxRetryTime;

		/** Set up logging */
		if (logger !== undefined) {
			this.logger = logger;

			if (logLevel !== undefined) {
				this.logger.debug(
					"The logLevel given to WebClient was ignored as you also gave logger"
				);
			}
		} else {
			this.logger = getLogger(
				WebSocketClient.loggerName,
				logLevel ?? LogLevel.INFO,
				logger
			);
		}
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
			this.logger.error("Websocket must have connection url");
			return;
		}

		if (this.connFailCount === 0) {
			this.logger.info(`Websocket connecting to ${url}`);
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
				this.logger.info("Websocket re-established connection");

				for (const listener of this.reconnectListeners) listener();
			} else if (this.firstConnectListeners.size > 0) {
				for (const listener of this.firstConnectListeners) listener();
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

			if (this.connFailCount === 0) this.logger.warn("Websocket closed");

			this.connFailCount++;

			/** call close listeners */
			for (const listener of this.closeListeners) listener(this.connFailCount);

			/** retry */
			const retryTime = this.getRetryTime();

			setTimeout(() => {
				this.initialize({ url, token, postedAck });
			}, retryTime);
		};

		/**
		 * @description on message action
		 */
		this.conn.onmessage = evt => {
			const msg = this.parseMessage(evt);

			if (!msg) return;

			/** Handle socket reply */
			if (msg.seq_reply) {
				return this.handleSocketReply(msg, msg.seq_reply);
			}

			/** Handle other messages */
			if (this.messageListeners.size > 0) {
				// We check the hello packet, which is always the first packet in a stream.
				if (isWebSocketHelloMessage(msg.event, msg.data)) {
					this.handleHelloMessage(msg.data);
				}

				// Now we check for sequence number, and if it does not match,
				// we just disconnect and reconnect.
				if (msg.seq !== this.sSequence) return this.handleMissedEvent(msg);

				this.sSequence = msg.seq + 1;

				for (const listener of this.messageListeners) listener(msg);
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
			this.conn.onclose = () => null;
			this.conn.close();
			this.conn = null;
			this.logger.debug("Websocket closed");
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

	private handleHelloMessage(data: WebSocketHelloMessageData): void {
		this.logger.debug("got connection id ", data.connection_id);
		if (this.connectionId !== "" && this.connectionId !== data.connection_id) {
			// If we already have a connectionId present, and server sends a different one,
			// that means it's either a long timeout, or server restart, or sequence number is not found.
			// Then we do the sync calls, and reset sequence number to 0.
			this.logger.debug(
				"Long timeout, or server restart, or sequence number is not found."
			);

			for (const listener of this.missedMessageListeners) {
				try {
					listener();
				} catch (e) {
					this.logger.warn(
						`Missed message listener "${listener.name}" failed: ${e}`
					);
				}
			}

			this.sSequence = 0;
		}

		// If it's a fresh connection, we have to set the connectionId regardless.
		// And if it's an existing connection, setting it again is harmless, and keeps the code simple.
		this.connectionId = data.connection_id;
	}

	private handleMissedEvent(msg: WebSocketMessage): void {
		this.logger.warn(
			"Missed websocket event, act_seq=" +
				msg.seq +
				" exp_seq=" +
				this.sSequence
		);
		// We are not calling this.close() because we need to auto-restart.
		this.connFailCount = 0;
		this.rSequence = 1;
		this.conn?.close(); // Will auto-reconnect after MIN_WEBSOCKET_RETRY_TIME.
	}

	private handleSocketReply(msg: WebSocketMessage, seq_reply: number): void {
		/**
		 * This indicates a reply to a websocket request.
		 * We ignore sequence number validation of message responses
		 * and only focus on the purely server side event stream.
		 */
		if (msg.error) this.logger.error(msg);
		if (this.responseCallbacks[seq_reply]) {
			this.responseCallbacks[seq_reply]?.(msg);
			Reflect.deleteProperty(this.responseCallbacks, seq_reply);
		}
	}

	private getRetryTime(): number {
		let retryTime = this.minRetryTime;
		if (this.connFailCount > this.maxFails) {
			// If we've failed a bunch of connections then start backing off
			retryTime = this.minRetryTime * this.connFailCount * this.connFailCount;

			if (retryTime > this.maxRetryTime) retryTime = this.maxRetryTime;
		}

		// Applying jitter to avoid thundering herd problems.
		retryTime += Math.random() * this.jitterRange;

		return retryTime;
	}

	/**
	 * Safely parses websocket event or returns undefined
	 * @param evt websocket event
	 */
	private parseMessage(
		evt: WebSocket.MessageEvent
	): WebSocketMessage | undefined {
		if (!evt.data) return undefined;
		try {
			if (typeof evt.data === "string") {
				evt.data = JSON.parse(evt.data);
			}

			switch (typeof evt.data) {
				case "object":
					switch (true) {
						case Array.isArray(evt.data):
						case Buffer.isBuffer(evt.data):
						case evt.data instanceof ArrayBuffer:
							this.logger.error(
								"Received unxpected data type: Array, Buffer or ArrayBuffer, expected string or {}"
							);
							return undefined;
						default:
							if (
								isLoopWebSocketMessage(evt["data"]) ||
								("seq_reply" in evt.data && "status" in evt.data)
							) {
								return evt.data as WebSocketMessage;
							}
							this.logger.error(
								`Received unexpected message type: ${JSON.stringify(evt.data)}`
							);
							return undefined;
					}
				default:
					this.logger.error(
						`Received unexpected data type: ${typeof evt.data}, expected string or {}`
					);
					return undefined;
			}
		} catch (e) {
			this.logger.error(`Failed to parse websocket message: ${e}`);
			return undefined;
		}
	}
}
