/** biome-ignore-all lint/suspicious/noExplicitAny: <jest> */
/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: <jest> */
/** biome-ignore-all lint/suspicious/noEmptyBlockStatements: <jest> */

import { expect, jest } from "@jest/globals";
import { ConsoleLogger, LogLevel } from "@triple-sun/logger";
import { WebSocketClient } from "../src";
import { CLIENT_PING_TIMEOUT_ERR_CODE } from "../src/const";
import { LoopEvent } from "../src/types/events";

jest.mock("ws");
jest.useFakeTimers();

if (typeof WebSocket === "undefined") {
	(globalThis as any).WebSocket = {
		CONNECTING: 0,
		OPEN: 1,
		CLOSING: 2,
		CLOSED: 3
	};
}

// Mock CloseEvent class if it's not defined
if (typeof CloseEvent === "undefined") {
	(globalThis as any).CloseEvent = class MockCloseEvent extends (
		(globalThis as any).Event
	) {
		code: number;
		reason: string;
		wasClean: boolean;

		constructor(
			type: string,
			options?: { code?: number; reason?: string; wasClean?: boolean }
		) {
			super(type);
			this.code = options?.code || 0;
			this.reason = options?.reason || "";
			this.wasClean = options?.wasClean || false;
		}
	};
}

class MockWebSocket {
	readonly binaryType = "blob";
	readonly bufferedAmount: number = 0;
	readonly extensions: string = "";

	readonly CONNECTING = WebSocket.CONNECTING;
	readonly OPEN = WebSocket.OPEN;
	readonly CLOSING = WebSocket.CLOSING;
	readonly CLOSED = WebSocket.CLOSED;

	public url: string = "";
	readonly protocol: string = "";
	public readyState: number = WebSocket.CONNECTING;

	public onopen: (() => void) | null = null;
	public onclose: (() => void) | null = null;
	public onerror: (() => void) | null = null;
	public onmessage: ((evt: any) => void) | null = null;

	constructor(url: string) {
		this.url = url;
	}

	open() {
		this.readyState = WebSocket.OPEN;
		if (this.onopen) {
			this.onopen();
		}
	}

	close() {
		this.readyState = WebSocket.CLOSED;
		if (this.onclose) {
			this.onclose();
		}
	}

	send(_msg: any) {}
	addEventListener() {}
	removeEventListener() {}
	dispatchEvent(): boolean {
		return false;
	}
}

describe("WebSocketClient", () => {
	let client: WebSocketClient;
	let mockWs: any;

	let wxCreatorSpy: any;

	beforeEach(() => {
		// Polyfill WebSocket for tests
		global.WebSocket = WebSocket as any;

		// We need to capture the instance created by the client
		wxCreatorSpy = jest.fn((url: string) => {
			mockWs = new MockWebSocket(url);
			jest.spyOn(mockWs, "close");
			jest.spyOn(mockWs, "send");
			return mockWs;
		});

		client = new WebSocketClient({
			url: "wss://example.com/api/v4/websocket",
			token: "test-token",
			minRetryTime: 100, // Speed up tests
			jitterRange: 0,
			logLevel: LogLevel.ERROR,
			wsCreator: wxCreatorSpy
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.clearAllTimers();
	});

	describe("Initialization", () => {
		it("should initialize with provided options", () => {
			expect(client).toBeDefined();
			expect(client["sSequence"]).toBe(0);
			expect(client["connectFailCount"]).toBe(0);
			expect(client["logger"]).toBeInstanceOf(ConsoleLogger);
			expect(client["logger"].getLevel()).toBe(LogLevel.ERROR);
		});

		it("should connect when initialize is called", () => {
			client.init();
			expect(wxCreatorSpy).toHaveBeenCalledWith(
				expect.stringContaining(
					"wss://example.com/api/v4/websocket?connection_id=&sequence_number=0"
				)
			);
		});

		it("should throw if url is missing", () => {
			expect(() => {
				new WebSocketClient({
					token: "token",
					url: null as any
				});
			}).toThrow(TypeError);
		});
	});

	describe("Connection Lifecycle", () => {
		it("should send authentication challenge on open", () => {
			client.init();
			mockWs.open();

			expect(mockWs.send).toHaveBeenCalledWith(
				JSON.stringify({
					action: "authentication_challenge",
					seq: 1,
					data: { token: "test-token" }
				})
			);
		});

		it("should handle reconnection logic on close", () => {
			client.init();
			mockWs.open(); // Open first

			// Trigger close
			mockWs.close();

			expect(client["connectFailCount"]).toBe(1);

			// Should schedule reconnect
			jest.advanceTimersByTime(5000);

			expect(wxCreatorSpy).toHaveBeenCalledTimes(2); // Initial + Reconnect
		});

		it("should reset sequence number on close if resetCount is true", () => {
			client = new WebSocketClient({
				url: "wss://example.com",
				token: "token",
				resetCount: true,
				minRetryTime: 10,
				wsCreator: wxCreatorSpy
			});
			client.init();
			client["sSequence"] = 5;

			mockWs.close();

			expect(client["sSequence"]).toBe(0);
		});

		it("should NOT reset sequence number on close if resetCount is false", () => {
			client = new WebSocketClient({
				url: "wss://example.com",
				token: "token",
				resetCount: false,
				minRetryTime: 10,
				wsCreator: wxCreatorSpy
			});
			client.init();
			client["sSequence"] = 5;

			mockWs.close();

			expect(client["sSequence"]).toBe(5);
		});
	});

	describe("Message Handling", () => {
		it("should handle hello message and set connectionId", () => {
			client.init();
			mockWs.open();

			const helloMsg = {
				event: "hello",
				data: { connection_id: "conn_id_1" },
				seq: 0,
				broadcast: {}
			};

			const listener = jest.fn();
			client.listeners.message.add(listener);

			mockWs.onmessage({ data: JSON.stringify(helloMsg) });

			expect(client["connectionId"]).toBe("conn_id_1");
			expect(listener).toHaveBeenCalledWith(helloMsg);
		});

		it("should handle valid event messages", () => {
			client.init();
			mockWs.open();

			const eventMsg = {
				event: "posted",
				data: { post: "{}" },
				seq: 0,
				broadcast: {}
			};

			const listener = jest.fn();
			client.listeners.message.add(listener);

			client["sSequence"] = 0; // Expected

			mockWs.onmessage({ data: JSON.stringify(eventMsg) });

			expect(listener).toHaveBeenCalledWith(eventMsg);
			expect(client["sSequence"]).toBe(1);
		});

		it("should handle missed events (sequence mismatch)", () => {
			client.init();
			expect(client["sSequence"]).toBe(0);

			const eventMsg = {
				event: "posted",
				seq: 2, // Gap!
				broadcast: {},
				data: {}
			};

			// We need to spy on handleMissedEvent or check side effects (autoclose)
			// But handleMissedEvent calls conn.close()

			// logic only triggers if there are listeners
			client.listeners.message.add(() => null);

			mockWs.onmessage({ data: JSON.stringify(eventMsg) });

			expect(mockWs.close).toHaveBeenCalled();
			// And it should schedule a reconnect?
			// Actually handleMissedEvent calls conn.close() which triggers onclose()
		});

		it("should handle socket replies (with response callback)", () => {
			client.init();
			mockWs.open();

			const callback = jest.fn();
			// Send message with callback
			client.send.message(LoopEvent.ADDED_TO_TEAM, {}, callback);
			const sentSeq = 3; // Seq 1 used by authentication_challenge

			const replyMsg = {
				seq_reply: sentSeq,
				status: "OK"
			};

			mockWs.onmessage({ data: JSON.stringify(replyMsg) });

			expect(callback).toHaveBeenCalledWith(replyMsg);
		});

		it("should log error when server replies with error", () => {
			client.init();
			mockWs.open();
			const loggerSpy = jest.spyOn(client["logger"], "error");

			const errorMsg = {
				seq_reply: 1,
				error: "Some server error"
			};

			mockWs.onmessage({ data: JSON.stringify(errorMsg) });

			expect(loggerSpy).toHaveBeenCalledWith(errorMsg);
		});
	});

	describe("API Methods", () => {
		beforeEach(() => {
			client.init();
			mockWs.open();
		});

		it("should send user_typing", () => {
			client.send.typing("channel_1", "post_1");
			expect(mockWs.send).toHaveBeenCalledWith(
				expect.stringContaining('"action":"typing"')
			);
		});

		it("should send presence updates", () => {
			client.update.presence.channel("channel_1");
			expect(mockWs.send).toHaveBeenCalledWith(
				expect.stringContaining('"action":"presence"')
			);
		});

		it("userUpdateActiveStatus sends correct action", () => {
			client.update.userActiveStatus(true, true);
			expect(mockWs.send).toHaveBeenCalledWith(
				expect.stringContaining('"action":"user_update_active_status"')
			);
		});

		it("acknowledgePostedNotification sends correct action", () => {
			client.send.notifyAck("post_id", "status");
			expect(mockWs.send).toHaveBeenCalledWith(
				expect.stringContaining('"action":"posted_notify_ack"')
			);
		});

		it("getStatuses sends correct action", () => {
			client.get.statuses();
			expect(mockWs.send).toHaveBeenCalledWith(
				expect.stringContaining('"action":"get_statuses"')
			);
		});

		it("getStatusesByIds sends correct action", () => {
			client.get.statusesByIds(["u1"]);
			expect(mockWs.send).toHaveBeenCalledWith(
				expect.stringContaining('"action":"get_statuses_by_ids"')
			);
		});
	});

	describe("Listeners Management", () => {
		it("should add and remove message listeners", () => {
			const fn = jest.fn();
			client.listeners.message.add(fn);
			expect(client["listenerStore"].message.has(fn)).toBe(true);
			client.listeners.message.remove(fn);
			expect(client["listenerStore"].message.has(fn)).toBe(false);
		});

		it("should warn if too many message listeners added", () => {
			const loggerSpy = jest.spyOn(client["logger"], "warn");
			for (let i = 0; i < 6; i++) {
				client.listeners.message.add(() => null);
			}
			expect(loggerSpy).toHaveBeenCalledWith(
				expect.stringContaining("has 6 message listeners registered")
			);
		});

		it("should add and remove firstConnect listeners", () => {
			const fn = jest.fn();
			client.listeners.firstConnect.add(fn);
			expect(client["listenerStore"].firstConnect.has(fn)).toBe(true);
			client.listeners.firstConnect.remove(fn);
			expect(client["listenerStore"].firstConnect.has(fn)).toBe(false);
		});

		it("should warn if too many firstConnect listeners added", () => {
			const loggerSpy = jest.spyOn(client["logger"], "warn");
			for (let i = 0; i < 6; i++) {
				client.listeners.firstConnect.add(() => null);
			}
			expect(loggerSpy).toHaveBeenCalledWith(
				expect.stringContaining("has 6 first connect listeners registered")
			);
		});

		it("should add and remove reconnect listeners", () => {
			const fn = jest.fn();
			client.listeners.reconnect.add(fn);
			expect(client["listenerStore"].reconnect.has(fn)).toBe(true);
			client.listeners.reconnect.remove(fn);
			expect(client["listenerStore"].reconnect.has(fn)).toBe(false);
		});

		it("should warn if too many reconnect listeners added", () => {
			const loggerSpy = jest.spyOn(client["logger"], "warn");
			for (let i = 0; i < 6; i++) {
				client.listeners.reconnect.add(() => null);
			}
			expect(loggerSpy).toHaveBeenCalledWith(
				expect.stringContaining("has 6 reconnect listeners registered")
			);
		});

		it("should add and remove missed listeners", () => {
			const fn = jest.fn();
			client.listeners.missed.add(fn);
			expect(client["listenerStore"].missedMessage.has(fn)).toBe(true);
			client.listeners.missed.remove(fn);
			expect(client["listenerStore"].missedMessage.has(fn)).toBe(false);
		});

		it("should warn if too many missed listeners added", () => {
			const loggerSpy = jest.spyOn(client["logger"], "warn");
			for (let i = 0; i < 6; i++) {
				client.listeners.missed.add(() => null);
			}
			expect(loggerSpy).toHaveBeenCalledWith(
				expect.stringContaining("has 6 missed message listeners registered")
			);
		});

		it("should add and remove close listeners", () => {
			const fn = jest.fn();
			client.listeners.close.add(fn);
			expect(client["listenerStore"].close.has(fn)).toBe(true);
			client.listeners.close.remove(fn);
			expect(client["listenerStore"].close.has(fn)).toBe(false);
		});

		it("should warn if too many close listeners added", () => {
			const loggerSpy = jest.spyOn(client["logger"], "warn");
			for (let i = 0; i < 6; i++) {
				client.listeners.close.add(() => null);
			}
			expect(loggerSpy).toHaveBeenCalledWith(
				expect.stringContaining("has 6 close listeners registered")
			);
		});
	});

	describe("Error Handling", () => {
		it("should log error on json parse failure", () => {
			client.init();
			const loggerSpy = jest.spyOn(client["logger"], "error");

			mockWs.onmessage({ data: "invalid json" });

			expect(loggerSpy).toHaveBeenCalledWith(
				expect.stringContaining("Failed to parse websocket message")
			);
		});

		it("should log error on unexpected data type", () => {
			client.init();
			const loggerSpy = jest.spyOn(client["logger"], "error");

			mockWs.onmessage({ data: 123 }); // Number invalid

			expect(loggerSpy).toHaveBeenCalledWith(
				expect.stringContaining("Received unexpected data type")
			);
		});
	});

	describe("More API Methods", () => {
		beforeEach(() => {
			client.init();
			mockWs.open();
		});

		it("updateActiveTeam sends correct action", () => {
			client.update.presence.team("team_1");
			expect(mockWs.send).toHaveBeenCalledWith(
				expect.stringContaining('"action":"presence"')
			);
			expect(mockWs.send).toHaveBeenCalledWith(
				expect.stringContaining('"team_id":"team_1"')
			);
		});

		it("updateActiveThread sends correct action", () => {
			client.update.presence.thread(true, "channel_1");
			expect(mockWs.send).toHaveBeenCalledWith(
				expect.stringContaining('"action":"presence"')
			);
			expect(mockWs.send).toHaveBeenCalledWith(
				expect.stringContaining('"thread_channel_id":"channel_1"')
			);
		});
	});

	describe("Browser Integration", () => {
		let originalWindow: any;
		let addEventListenerSpy: any;
		let removeEventListenerSpy: any;

		beforeEach(() => {
			originalWindow = (global as any).window;
			addEventListenerSpy = jest.fn();
			removeEventListenerSpy = jest.fn();
			(global as any).window = {
				addEventListener: addEventListenerSpy,
				removeEventListener: removeEventListenerSpy
			};
		});

		afterEach(() => {
			(global as any).window = originalWindow;
		});

		it("should set up browser listeners on init", () => {
			client.init();
			expect(addEventListenerSpy).toHaveBeenCalledWith(
				"online",
				expect.any(Function)
			);
			expect(addEventListenerSpy).toHaveBeenCalledWith(
				"offline",
				expect.any(Function)
			);
		});

		it("should handle online event by reconnecting", () => {
			client.init();
			const onlineHandler = addEventListenerSpy.mock.calls.find(
				(c: any) => c[0] === "online"
			)[1];

			// Simulate disconnected state with pending reconnect
			client["socket"] = null;
			const oldTimeout = setTimeout(() => {}, 10000);
			client["reconnectTimeout"] = oldTimeout;
			const initSpy = jest.spyOn(client, "init");

			jest.useFakeTimers();
			onlineHandler();

			expect(client["reconnectTimeout"]).not.toBe(oldTimeout); // Should be a new timeout
			expect(client["reconnectTimeout"]).not.toBeNull();
			jest.advanceTimersByTime(client["minRetryTime"]);
			expect(initSpy).toHaveBeenCalled();
		});

		it("should NOT reconnect on online event if already connected", () => {
			client.init();
			mockWs.open(); // Connected
			const onlineHandler = addEventListenerSpy.mock.calls.find(
				(c: any) => c[0] === "online"
			)[1];

			const initSpy = jest.spyOn(client, "init");
			onlineHandler();

			expect(initSpy).not.toHaveBeenCalled();
		});

		it("should handle offline event by pinging", () => {
			client.init();
			mockWs.open(); // Ensure connected
			const offlineHandler = addEventListenerSpy.mock.calls.find(
				(c: any) => c[0] === "offline"
			)[1];

			// Mock ping
			const pingSpy = jest.spyOn(client as any, "ping");

			offlineHandler();

			expect(pingSpy).toHaveBeenCalled();
			expect(client["waitingForPong"]).toBe(true);

			// Cover the callback execution
			// offlineHandler passes a callback to ping
			const callback = pingSpy.mock.calls[0]?.[0] as (() => void) | undefined;
			expect(callback).toBeDefined();
			if (callback) {
				callback();
			}
			expect(client["waitingForPong"]).toBe(false);
		});

		it("should NOT ping on offline event if socket is closed", () => {
			client.init();
			client["socket"] = null; // Disconnected
			const offlineHandler = addEventListenerSpy.mock.calls.find(
				(c: any) => c[0] === "offline"
			)[1];

			const pingSpy = jest.spyOn(client as any, "ping");

			offlineHandler();

			expect(pingSpy).not.toHaveBeenCalled();
		});

		it("should remove existing listeners before adding new ones", () => {
			client.init();
			mockWs.open(); // Ensure open so close() works
			client.close(); // Close to allow re-init
			client.init(); // Second init to trigger removal
			// We can't easily check removal of specific functions without storing them,
			// but we can check if removeEventListener was called
			expect(removeEventListenerSpy).toHaveBeenCalledTimes(2); // once for online, once for offline
		});
	});

	describe("Close and Reconnect Listeners", () => {
		it("should call close listeners", () => {
			const closeListener = jest.fn();
			client.listeners.close.add(closeListener);

			client.init();
			mockWs.close();

			expect(closeListener).toHaveBeenCalled();
		});

		it("should close connection explicitly", () => {
			client.init();
			mockWs.open();

			client.close();

			expect(mockWs.close).toHaveBeenCalled();
			expect(client["socket"]).toBeNull();
		});

		it("should trigger reconnect listeners on reconnection", () => {
			const reconnectListener = jest.fn();
			client.listeners.reconnect.add(reconnectListener);

			client.init();
			// Mock first fail
			mockWs.close();
			// Wait for retry
			jest.advanceTimersByTime(1000);

			// Reconnect happens, onopen is called
			mockWs.open();

			expect(reconnectListener).toHaveBeenCalled();
		});

		it("should trigger firstConnect listeners only on first connection", () => {
			const firstConnectListener = jest.fn();
			client.listeners.firstConnect.add(firstConnectListener);

			client.init();
			mockWs.open();

			expect(firstConnectListener).toHaveBeenCalled();

			// Simulate reconnect
			mockWs.close();
			jest.advanceTimersByTime(1000);
			mockWs.open();

			// Should not be called again
			expect(firstConnectListener).toHaveBeenCalledTimes(1);
		});
	});

	describe("Ping/Pong", () => {
		beforeEach(() => {
			client = new WebSocketClient({
				url: "wss://example.com/api/v4/websocket",
				token: "test-token",
				// Short interval for testing
				clientPingInterval: 1000,
				wsCreator: wxCreatorSpy,
				logLevel: LogLevel.INFO
			});
			client.init();
			mockWs.open();
		});

		it("should send ping periodically", () => {
			// Find initial ping and respond to it
			const calls = (mockWs.send as jest.Mock).mock.calls;
			const pingCall = calls.find((c: any) => c[0].includes('"action":"ping"'));
			if (!pingCall) throw new Error("Initial ping not found");
			const seq = JSON.parse(pingCall[0] as string).seq;

			mockWs.onmessage({
				data: JSON.stringify({ seq_reply: seq, status: "OK" })
			});

			// Clear mocks to check next interval
			(mockWs.send as jest.Mock).mockClear();

			// Advance time
			jest.advanceTimersByTime(1001);

			expect(mockWs.send).toHaveBeenCalledWith(
				expect.stringContaining('"action":"ping"')
			);
		});

		it("should handle pong response", () => {
			// Should be waiting for pong
			expect(client["waitingForPong"]).toBe(true);

			// Isolate the ping sequence number
			// Find the call that is a ping (not auth challenge)
			const calls = (mockWs.send as jest.Mock).mock.calls;
			const pingCall = calls.find((c: any) => c[0].includes('"action":"ping"'));
			if (!pingCall) throw new Error("Ping call not found");

			const lastCall = pingCall[0] as string;
			const parsed = JSON.parse(lastCall);
			const seq = parsed.seq;

			// simulate pong (reply with seq_reply)
			const pongMsg = {
				seq_reply: seq,
				status: "OK"
			};

			mockWs.onmessage({ data: JSON.stringify(pongMsg) });

			expect(client["waitingForPong"]).toBe(false);
		});

		it("should reconnect if ping times out", () => {
			// Initial ping sent, waitingForPong = true
			expect(client["waitingForPong"]).toBe(true);

			// Advance time past interval
			// This triggers the interval callback
			// Inside callback: waitingForPong is true -> calls close()

			jest.advanceTimersByTime(1001);

			// Should have closed connection
			expect(mockWs.close).toHaveBeenCalled();

			// Should have set error code
			// We can verify logging or check calls to onClose via spy?
			// client.logger spy
			const loggerSpy = jest.spyOn(client["logger"], "info");

			// Advance again to trigger reconnect if needed,
			// but here we just want to verify trigger of close
			mockWs.close(); // Ensure close callback runs if not already

			// Verify error code usage implies we might check logger or close event
			// But here just ensuring close was called is enough for now.
			// Let's use the loggerSpy to satisfy the linter and verify behavior

			// Advance time to trigger scheduled reconnect
			jest.advanceTimersByTime(500);

			// Reconnect sets up new connection, but we need to open it to trigger onOpen logic where log happens
			mockWs.open();

			expect(loggerSpy).toHaveBeenCalledWith(
				expect.stringContaining("Websocket re-established connection")
			);

			// Verify error code was set
			// This confirms it was a ping timeout close
			expect(client["lastErrCode"]).toBe(String(CLIENT_PING_TIMEOUT_ERR_CODE));
		});
	});

	describe("Internals & Edge Cases", () => {
		it("sendMessage should initialize connection if disconnected", () => {
			// Ensure disconnected
			client["socket"] = null;
			const initSpy = jest.spyOn(client, "init");

			client.send.message(LoopEvent.ADDED_TO_TEAM, {});

			expect(initSpy).toHaveBeenCalled();
		});

		it("handleHelloData should reset sequence and call missed listeners on connectionId mismatch", () => {
			const missedListener = jest.fn();
			client.listeners.missed.add(missedListener);
			const loggerSpy = jest.spyOn(client["logger"], "debug");

			// Setup initial state
			client["connectionId"] = "old_id";
			client["sSequence"] = 10;

			// Trigger hello with new ID
			client["handleHelloMessage"]({
				connection_id: "new_id",
				server_version: "1"
			});

			expect(loggerSpy).toHaveBeenCalledWith(
				expect.stringContaining("Long timeout, or server restart")
			);
			expect(missedListener).toHaveBeenCalled();
			expect(client["sSequence"]).toBe(0);
			expect(client["connectionId"]).toBe("new_id");
		});

		it("handleHelloData should handle errors in missed listeners", () => {
			const errorListener = jest.fn().mockImplementation(() => {
				throw new Error("oops");
			});
			client.listeners.missed.add(errorListener);
			const loggerSpy = jest.spyOn(client["logger"], "error");

			client["connectionId"] = "old_id";
			client["handleHelloMessage"]({
				connection_id: "new_id",
				server_version: "1"
			});

			expect(loggerSpy).toHaveBeenCalledWith(
				expect.stringContaining(
					'Error in "missedMessage" listener: Error: oops'
				)
			);
		});

		it("parseMessage should handle Array/Buffer inputs by returning undefined and logging error", () => {
			client.init();
			const loggerSpy = jest.spyOn(client["logger"], "error");

			// WebSocket.MessageEvent data can be string | Buffer | ArrayBuffer | Buffer[]
			// mocking the call to access private method or via onmessage
			// onmessage calls parseMessage

			mockWs.onmessage({ data: Buffer.from("test") });
			expect(loggerSpy).toHaveBeenCalledWith(
				expect.stringContaining("Received unexpected data type: ")
			);

			mockWs.onmessage({ data: new ArrayBuffer(8) });
			expect(loggerSpy).toHaveBeenCalledWith(
				expect.stringContaining("Received unexpected data type: ")
			);
			mockWs.onmessage({ data: ["buffer" as any] });
			expect(loggerSpy).toHaveBeenCalledWith(
				expect.stringContaining("Received unexpected data type: ")
			);
		});

		it("parseMessage should handle unexpected object structure", () => {
			client.init();
			const loggerSpy = jest.spyOn(client["logger"], "error");

			mockWs.onmessage({ data: "``//" });
			expect(loggerSpy).toHaveBeenCalledWith(
				expect.stringContaining("Failed to parse websocket message")
			);
		});

		it("getRetryTime should implement exponential backoff", () => {
			// Access private method
			const getRetryTime = () => client["getRetryTime"]();

			client["minRetryTime"] = 10;
			client["maxRetryTime"] = 1000;
			client["maxFails"] = 1;
			client["jitterRange"] = 0; // Disable jitter for predictable results

			client["connectFailCount"] = 1;
			expect(getRetryTime()).toBeCloseTo(10, 0); // 10 * 1 * 1

			client["connectFailCount"] = 2;
			expect(getRetryTime()).toBeCloseTo(40, 0); // 10 * 2 * 2

			client["connectFailCount"] = 5;
			expect(getRetryTime()).toBeCloseTo(250, 0); // 10 * 5 * 5

			client["connectFailCount"] = 10;
			expect(getRetryTime()).toBe(1000); // Capped at max
		});

		it("initialize should return early if connection already exists", () => {
			client.init();
			const firstConn = client["socket"];
			client.init();
			expect(client["socket"]).toBe(firstConn);
			expect(wxCreatorSpy).toHaveBeenCalledTimes(1);
		});

		it("constructor should log debug message if both logger and logLevel are provided", () => {
			const logger = new ConsoleLogger();
			const spy = jest.spyOn(logger, "debug");
			new WebSocketClient({
				url: "wss://example.com",
				token: "token",
				logger,
				logLevel: LogLevel.DEBUG
			});
			expect(spy).toHaveBeenCalledWith(
				expect.stringContaining(
					"The logLevel given to WebClient was ignored as you also gave logger"
				)
			);
		});

		it("onError should log error only if connectFailCount <= 1", () => {
			client.init();
			const loggerSpy = jest.spyOn(client["logger"], "error");

			// First error (failCount 0)
			client["onError"](new Event("error") as any);
			expect(loggerSpy).toHaveBeenCalledTimes(1);

			client["connectFailCount"] = 2;
			client["onError"](new Event("error") as any);
			// Should not log again
			expect(loggerSpy).toHaveBeenCalledTimes(1);
		});

		it("should handle ping-pong cycle in interval", () => {
			client.init();
			mockWs.open();

			// 1. Handle initial ping from onOpen
			const calls1 = (mockWs.send as jest.Mock).mock.calls;
			const ping1Func = calls1.find((c: any) =>
				c[0].includes('"action":"ping"')
			);
			if (!ping1Func) throw new Error("Ping 1 not found");
			const seq1 = JSON.parse(ping1Func[0] as string).seq;

			mockWs.onmessage({
				data: JSON.stringify({ seq_reply: seq1, status: "OK" })
			});
			expect(client["waitingForPong"]).toBe(false);

			// 2. Clear mocks and advance to interval
			(mockWs.send as jest.Mock).mockClear();
			jest.advanceTimersByTime(client["clientPingInterval"]);

			// 3. Handle interval ping
			const calls2 = (mockWs.send as jest.Mock).mock.calls;
			// There might be empty calls or non-ping calls? No, just ping.
			expect(calls2.length).toBeGreaterThan(0);
			const ping2Func = calls2.find((c: any) =>
				c[0].includes('"action":"ping"')
			);
			if (!ping2Func) throw new Error("Ping 2 not found");
			const seq2 = JSON.parse(ping2Func[0] as string).seq;

			expect(client["waitingForPong"]).toBe(true);

			// 4. Send pong for interval ping
			mockWs.onmessage({
				data: JSON.stringify({ seq_reply: seq2, status: "OK" })
			});

			// 5. Verify waitingForPong cleared (covers line 387)
			expect(client["waitingForPong"]).toBe(false);
		});

		it("onClose should return early if reconnectTimeout is already set", () => {
			client.init();
			client["reconnectTimeout"] = 123 as any; // Mock existing timeout
			const retrySpy = jest.spyOn(client as any, "getRetryTime");

			client["onClose"](new CloseEvent("close"));

			expect(retrySpy).not.toHaveBeenCalled();
			expect(client["reconnectTimeout"]).toBe(123);
		});

		it("ping interval should do nothing if socket is closed", () => {
			client.init();
			client["onOpen"](); // starts interval

			client["socket"] = {
				readyState: WebSocket.CLOSED,
				close: jest.fn()
			} as any;
			client["waitingForPong"] = true;

			const closeSpy = jest.spyOn(client["socket"] as any, "close");

			jest.advanceTimersByTime(client["clientPingInterval"]);

			expect(closeSpy).not.toHaveBeenCalled();
		});

		it("should not re-initialize if reconnecting", () => {
			client.init();
			mockWs.open();
			mockWs.close(); // triggers reconnect logic

			// reconnectTimeout is now set
			expect(client["reconnectTimeout"]).toBeDefined();

			const result = client.init(); // Should return early
			expect(result).toBe(client);

			// Verify no new connection attempt (wsCreatorSpy only called once for initial info + once for reconnect if we wait)
			// We haven't waited yet
			expect(wxCreatorSpy).toHaveBeenCalledTimes(1);
		});

		it("should clear reconnect timeout on close", () => {
			client.init();
			mockWs.open();
			mockWs.close(); // Triggers reconnect timeout

			const timeout = client["reconnectTimeout"];
			expect(timeout).toBeDefined();

			client.close(); // Should clear it

			expect(client["reconnectTimeout"]).toBeNull();
		});

		it("should ignore message if no listeners", () => {
			client.init();
			mockWs.open();

			// Ensure no listeners (default setup has none unless added)
			// Actually message listeners are empty by default

			// Spy on parseMessageData or similar internals?
			// Or just spy on executeListeners
			const executeSpy = jest.spyOn(client as any, "executeListeners");

			mockWs.onmessage({
				data: JSON.stringify({ event: "some_event", seq: 1, data: {} })
			});

			expect(executeSpy).not.toHaveBeenCalled();
		});
	});
});
