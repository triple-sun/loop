import type { Logger } from "@triple-sun/logger";
import {
	CLIENT_PING_TIMEOUT_ERR_CODE,
	DEFAULT_CLIENT_PING_INTERVAL,
	DEFAULT_WEBSOCKET_JITTER_RANGE,
	DEFAULT_WEBSOCKET_MAX_FAILS,
	DEFAULT_WEBSOCKET_MAX_RETRY_TIME,
	DEFAULT_WEBSOCKET_MIN_RETRY_TIME
} from "./const";
import { getLogger } from "./logger";
import { LoopEvent } from "./types/events";
import type { Hello, LoopMessage } from "./types/messages";
import type {
	CloseListener,
	ElementType,
	ErrorListener,
	FirstConnectListener,
	ListenerStore,
	MessageListener,
	MissedMessageListener,
	Options,
	ReconnectListener
} from "./types/wsclient";
import { getUserAgent, isHelloMessage, isValidUrl } from "./utils";

export class WebSocketClient {
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
	private socket: WebSocket | null;

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

	private connectFailCount: number;
	private responseCallbacks: Map<number, (msg: unknown) => void>;
	private connectionId: string | null;
	private postedAck: boolean;
	private resetCount: boolean;
	private jitterRange: number;
	private maxFails: number;
	private minRetryTime: number;
	private maxRetryTime: number;
	private wsCreator: (url: string) => WebSocket;
	private clientPingInterval: number;

	private listenerStore: ListenerStore;

	private pingInterval: ReturnType<typeof setInterval> | null;
	private waitingForPong: boolean;
	private lastErrCode: string | null;

	// reconnectTimeout is used for automatic reconnect after socket close
	private reconnectTimeout: ReturnType<typeof setTimeout> | null;
	// Network event handlers
	private onlineHandler: (() => void) | null = null;
	private offlineHandler: (() => void) | null = null;

	constructor(o: Options) {
		this.socket = null;
		this.rSequence = 1;
		this.sSequence = 0;
		this.connectFailCount = 0;
		this.pingInterval = null;
		this.waitingForPong = false;
		this.lastErrCode = null;
		this.reconnectTimeout = null;

		if (!isValidUrl(o.url)) {
			throw new TypeError(`${o.url} is not a valid URL`);
		}

		if (o.url && !o.url.endsWith(`v4/websocket`)) {
			o.url += `v4/websocket`;
		}

		this.url = o.url;
		this.token = o.token;

		this.responseCallbacks = new Map<number, (msg: unknown) => void>();
		this.connectionId = "";
		this.postedAck = o.postedAck ?? false;
		this.resetCount = o.resetCount ?? true;
		this.jitterRange = o.jitterRange ?? DEFAULT_WEBSOCKET_JITTER_RANGE;
		this.maxFails = o.maxFails ?? DEFAULT_WEBSOCKET_MAX_FAILS;
		this.minRetryTime = o.minRetryTime ?? DEFAULT_WEBSOCKET_MIN_RETRY_TIME;
		this.maxRetryTime = o.maxRetryTime ?? DEFAULT_WEBSOCKET_MAX_RETRY_TIME;
		this.wsCreator = o.wsCreator ?? ((url: string) => new WebSocket(url));
		this.clientPingInterval =
			o.clientPingInterval ?? DEFAULT_CLIENT_PING_INTERVAL;

		/** Set up logging */
		this.logger = getLogger(o.logLevel, o.logger);

		this.listenerStore = {
			message: new Set<MessageListener>(),
			missedMessage: new Set<MissedMessageListener>(),
			firstConnect: new Set<FirstConnectListener>(),
			reconnect: new Set<ReconnectListener>(),
			close: new Set<CloseListener>(),
			error: new Set<ErrorListener>()
		} as const;

		this.listeners = {
			message: this.createListenerAccessor("message", "message"),
			firstConnect: this.createListenerAccessor(
				"firstConnect",
				"first connect"
			),
			reconnect: this.createListenerAccessor("reconnect", "reconnect"),
			missed: this.createListenerAccessor("missedMessage", "missed message"),
			close: this.createListenerAccessor("close", "close"),
			error: this.createListenerAccessor("error", "error")
		} as const;
	}

	public init(): this {
		// Don't init if already connected or connecting
		if (
			this.socket &&
			this.socket.readyState !== WebSocket.CLOSED &&
			this.socket.readyState !== WebSocket.CLOSING
		) {
			return this;
		}

		if (this.reconnectTimeout) {
			return this;
		}

		if (this.connectFailCount === 0) {
			this.logger.info(`Websocket connecting to ${this.url}`);
		}

		// Setup network event listener
		// biome-ignore lint/suspicious/noExplicitAny: <required for browser compatibility>
		const windowGlobal = (globalThis as any).window;
		if (windowGlobal) {
			this.setUpBrowserListeners(windowGlobal);
		}

		// Add connection id, and last_sequence_number to the query param.
		// We cannot use a cookie because it will bleed across tabs.
		// We cannot also send it as part of the auth_challenge, because the session cookie is already sent with the request.
		this.socket = this.wsCreator(
			`${this.url}?connection_id=${this.connectionId}&sequence_number=${this.sSequence}` +
				`${this.postedAck ? "&posted_ack=true" : ""}` +
				`${this.lastErrCode ? `&disconnect_err_code=${encodeURIComponent(this.lastErrCode)}` : ""}`
		);

		this.socket.onopen = this.onOpen.bind(this);
		this.socket.onclose = this.onClose.bind(this);
		this.socket.onmessage = this.onMessage.bind(this);
		this.socket.onerror = this.onError.bind(this);

		return this;
	}

	public close(): this {
		this.connectFailCount = 0;
		this.rSequence = 1;
		this.lastErrCode = null;

		if (this.reconnectTimeout) {
			clearTimeout(this.reconnectTimeout);
			this.reconnectTimeout = null;
		}
		this.responseCallbacks.clear();
		this.stopPingInterval();

		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.onclose = () => null;
			this.socket.close();
			this.socket = null;
			this.logger.debug("Websocket closed manually");
		}

		return this;
	}

	public readonly listeners;

	public readonly send = {
		message: <T = unknown>(
			action: LoopEvent,
			data: T,
			responseCallback?: (msg: unknown) => void
		): this => {
			const msg = {
				action,
				seq: this.rSequence++,
				data
			};

			if (responseCallback) {
				this.responseCallbacks.set(msg.seq, responseCallback);
			}

			if (this.socket && this.socket.readyState === WebSocket.OPEN) {
				this.socket.send(JSON.stringify(msg));
			} else if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
				this.socket = null;
				this.init();
			}

			return this;
		},

		typing: (
			channel_id: string,
			parent_id: string,
			callback?: () => void
		): this => {
			return this.send.message(
				LoopEvent.TYPING,
				{
					channel_id,
					parent_id
				},
				callback
			);
		},

		notifyAck: (
			postId: string,
			status: string,
			reason?: string,
			postedData?: string
		): this => {
			return this.send.message(LoopEvent.POSTED_NOTIFY_ACK, {
				post_id: postId,
				user_agent: getUserAgent(),
				status,
				reason,
				data: postedData
			});
		}
	} as const;

	public readonly update = {
		presence: {
			channel: (
				channel_id: string,
				callback?: (msg: unknown) => void
			): this => {
				return this.send.message(
					LoopEvent.PRESENCE_INDICATOR,
					{
						channel_id
					},
					callback
				);
			},

			team: (team_id: string, callback?: (msg: unknown) => void): this => {
				return this.send.message(
					LoopEvent.PRESENCE_INDICATOR,
					{
						team_id
					},
					callback
				);
			},

			thread: (
				is_thread_view: boolean,
				thread_channel_id: string,
				callback?: (msg: unknown) => void
			): this => {
				return this.send.message(
					LoopEvent.PRESENCE_INDICATOR,
					{
						thread_channel_id,
						is_thread_view
					},
					callback
				);
			}
		},

		userActiveStatus: (
			user_is_active: boolean,
			manual: boolean,
			callback?: () => void
		): this => {
			return this.send.message(
				LoopEvent.USER_UPDATE_ACTIVE_STATUS,
				{
					user_is_active,
					manual
				},
				callback
			);
		}
	} as const;

	public readonly get = {
		statuses: (callback?: () => void): this => {
			return this.send.message(LoopEvent.GET_STATUSES, null, callback);
		},

		statusesByIds: (user_ids: string[], callback?: () => void): this => {
			return this.send.message(
				LoopEvent.GET_STATUSES_BY_IDS,
				{
					user_ids
				},
				callback
			);
		}
	} as const;

	/**
	 * *********************************************************
	 * Internal methods
	 * *********************************************************
	 */

	private clearReconnectTimeout() {
		if (this.reconnectTimeout) {
			clearTimeout(this.reconnectTimeout);
			this.reconnectTimeout = null;
		}
	}

	private stopPingInterval() {
		if (this.pingInterval) {
			clearInterval(this.pingInterval);
			this.pingInterval = null;
		}
	}

	private onError(event: ErrorEvent): void {
		if (this.connectFailCount <= 1) {
			this.logger.error(`Websocket error: ${event.message}`);
		}
		this.executeListeners("error", event);
	}

	private onOpen() {
		this.send.message(LoopEvent.AUTHENTICATION_CHALLENGE, {
			token: this.token
		});

		if (this.connectFailCount > 0) {
			this.logger.info("Websocket re-established connection");
			this.executeListeners("reconnect");
		} else if (this.listenerStore.firstConnect.size > 0) {
			this.executeListeners("firstConnect");
		}

		this.stopPingInterval();

		// Send a ping immediately to test the socket
		this.waitingForPong = true;
		this.ping(() => {
			this.waitingForPong = false;
		});

		// And every 30 seconds after, checking to ensure
		// we're getting responses from the server
		this.pingInterval = setInterval(() => {
			if (!this.waitingForPong) {
				this.waitingForPong = true;
				this.ping(() => {
					this.waitingForPong = false;
				});
				return;
			}

			this.stopPingInterval();

			// If we aren't connected, we should already be trying to
			// re-connect the websocket. So there's nothing more to do here.
			if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
				return;
			}

			this.logger.info(
				`ping received no response within time limit: re-establishing websocket`
			);

			// Calling conn.close() will trigger the onclose callback,
			// but sometimes with a significant delay. So instead, we
			// call the onclose callback ourselves immediately. We also
			// unset the callback on the old connection to ensure it
			// is only called once.
			this.connectFailCount = 0;
			this.rSequence = 1;
			this.socket.onclose = () => null;
			this.socket.close();
			this.onClose(
				new CloseEvent("close", {
					reason: "timeout",
					code: CLIENT_PING_TIMEOUT_ERR_CODE,
					wasClean: false
				})
			);
		}, this.clientPingInterval);

		this.connectFailCount = 0;
	}

	private onClose(event: CloseEvent): void {
		this.socket = null;
		this.rSequence = 1;

		if (this.resetCount) {
			this.sSequence = 0;
			this.connectionId = null;
		}

		if (!this.lastErrCode && event && event.code) {
			this.lastErrCode = `${event.code}`;
		}

		if (this.connectFailCount === 0) {
			this.logger.warn("Websocket closed");
		}

		this.connectFailCount++;

		/** call close listeners */
		this.executeListeners("close", this.connectFailCount);

		// Make sure we stop pinging if the connection is closed
		this.stopPingInterval();

		if (this.reconnectTimeout) {
			return;
		}

		/** retry */
		const retryTime = this.getRetryTime();

		this.reconnectTimeout = setTimeout(() => {
			this.reconnectTimeout = null;
			this.init();
		}, retryTime);

		this.responseCallbacks.clear();
	}

	private onMessage(evt: MessageEvent): void {
		const msg = this.parseMessageData(evt);

		if (!msg) return;

		/** Handle socket reply */
		if (msg.seq_reply) {
			this.handleSocketReply(msg, msg.seq_reply);
			return;
		}

		if (this.listenerStore.message.size === 0) {
			return;
		}

		/** Handle other messages */
		// We check the hello packet, which is always the first packet in a stream.
		if (isHelloMessage(msg.event, msg.data)) {
			this.handleHelloMessage(msg.data);
		}

		// Now we check for sequence number, and if it does not match,
		// we just disconnect and reconnect.
		if (msg.seq !== this.sSequence) {
			this.handleMissedEvent(msg);
			return;
		}

		this.sSequence = msg.seq + 1;

		this.executeListeners("message", msg);
	}

	// biome-ignore lint/suspicious/noExplicitAny: <required for browser compatibility>
	private setUpBrowserListeners(globalWindow: any): void {
		// Remove existing listeners if any
		if (this.onlineHandler) {
			globalWindow.removeEventListener("online", this.onlineHandler);
		}
		if (this.offlineHandler) {
			globalWindow.removeEventListener("offline", this.offlineHandler);
		}

		this.onlineHandler = () => {
			// If we're already connected, don't need to do anything
			if (this.socket && this.socket.readyState === WebSocket.OPEN) {
				return;
			}

			console.log("Network online event received, scheduling reconnect"); // eslint-disable-line no-console

			// Set a timer to reconnect after a delay to avoid rapid connection attempts
			this.clearReconnectTimeout();

			this.reconnectTimeout = setTimeout(() => {
				this.reconnectTimeout = null;
				this.init();
			}, this.minRetryTime);
		};

		this.offlineHandler = () => {
			// If we've detected a full disconnection, don't need to do anything more
			if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
				return;
			}

			this.logger.info("Network offline event received, checking connection");

			// If we haven't detected a full disconnection,
			// send a ping immediately to test the socket
			//
			// NOTE: There is a potential race condition here with the regular ping interval.
			// If we send this ping close to when the interval check occurs (e.g., at 29.5s of the 30s interval),
			// the server might not have enough time to respond before the interval executes.
			// When the interval runs, it will see we're still waiting for a pong and close the connection,
			// even though the network might be fine and the server just needs a bit more time to respond.
			// This race condition is rare and the impact is just an unnecessary reconnect,
			// so we accept this limitation to keep the implementation simple.
			this.waitingForPong = true;
			this.ping(() => {
				this.waitingForPong = false;
			});
		};

		globalWindow.addEventListener("online", this.onlineHandler);
		globalWindow.addEventListener("offline", this.offlineHandler);
	}

	private executeListeners<K extends keyof ListenerStore>(
		kind: K,
		...args: Parameters<ElementType<ListenerStore[K]>>
	): void {
		for (const listener of this.listenerStore[kind]) {
			try {
				// type casting is required
				(listener as (...args: unknown[]) => void)(...args);
			} catch (e) {
				this.logger.error(`Error in "${kind}" listener: ${e}`);
			}
		}
	}

	private createListenerAccessor<K extends keyof ListenerStore>(
		kind: K,
		name: string
	) {
		return {
			add: (listener: ElementType<ListenerStore[K]>): this => {
				// type casting is required
				this.listenerStore[kind].add(listener as (...args: unknown[]) => void);
				if (this.listenerStore[kind].size > 5) {
					this.logger.warn(
						`WebSocketClient has ${this.listenerStore[kind].size} ${name} listeners registered`
					);
				}
				return this;
			},
			remove: (listener: ElementType<ListenerStore[K]>): this => {
				// type casting is required
				this.listenerStore[kind].delete(
					listener as (...args: unknown[]) => void
				);
				return this;
			}
		};
	}

	private ping(responseCallback?: (msg: unknown) => void) {
		const msg = {
			action: "ping",
			seq: this.rSequence++
		};

		if (responseCallback) {
			this.responseCallbacks.set(msg.seq, responseCallback);
		}

		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify(msg));
		}
	}

	private handleHelloMessage(data: Hello["data"]): void {
		this.logger.debug("got connection id ", data.connection_id);

		if (this.connectionId !== "" && this.connectionId !== data.connection_id) {
			// If we already have a connectionId present, and server sends a different one,
			// that means it's either a long timeout, or server restart, or sequence number is not found.
			// Then we do the sync calls, and reset sequence number to 0.
			this.logger.debug(
				"Long timeout, or server restart, or sequence number is not found."
			);

			this.executeListeners("missedMessage");
			this.sSequence = 0;
		}

		// If it's a fresh connection, we have to set the connectionId regardless.
		// And if it's an existing connection, setting it again is harmless, and keeps the code simple.
		this.connectionId = data.connection_id;
	}

	private handleMissedEvent(msg: LoopMessage): void {
		this.logger.warn(
			`Missed websocket event, actual seq: ${msg.seq} expected seq: ${this.sSequence}`
		);
		// We are not calling this.close() because we need to auto-restart.
		this.connectFailCount = 0;
		this.rSequence = 1;
		this.socket?.close(); // Will auto-reconnect after MIN_WEBSOCKET_RETRY_TIME.
	}

	private handleSocketReply(msg: LoopMessage, seq_reply: number): void {
		/**
		 * This indicates a reply to a websocket request.
		 * We ignore sequence number validation of message responses
		 * and only focus on the purely server side event stream.
		 */
		if (msg.error) this.logger.error(msg);

		if (this.responseCallbacks.has(seq_reply)) {
			this.responseCallbacks.get(seq_reply)?.(msg);
			this.responseCallbacks.delete(seq_reply);
		}
	}

	private getRetryTime(): number {
		let retryTime = this.minRetryTime;

		if (this.connectFailCount > this.maxFails) {
			// If we've failed a bunch of connections then start backing off
			retryTime =
				this.minRetryTime * this.connectFailCount * this.connectFailCount;

			if (retryTime > this.maxRetryTime) retryTime = this.maxRetryTime;
		}

		// Applying jitter to avoid thundering herd problems.
		retryTime += Math.random() * this.jitterRange;

		return retryTime;
	}

	/**
	 * Safely parses websocket event or returns undefined
	 * @param event websocket event
	 */
	private parseMessageData(event: MessageEvent): LoopMessage | undefined {
		if (!event.data) return;

		try {
			if (typeof event.data === "string") {
				return JSON.parse(event.data);
			}

			this.logger.error(`Received unexpected data type: ${typeof event.data}`);

			return;
		} catch (e) {
			this.logger.error(`Failed to parse websocket message: ${e}`);

			return;
		}
	}
}
