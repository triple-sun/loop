// biome-ignore-all lint/suspicious/noExplicitAny: objects can be anything
import { jest } from "@jest/globals";
import { WebSocket } from "ws";
import WebSocketClient from "../src/websocket-client";

jest.mock("ws");
jest.useFakeTimers();

const MockWebSocket = WebSocket as unknown as jest.Mock;

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: <jesting>
describe("WebSocketClient", () => {
	let client: WebSocketClient;
	let mockWs: any;

	beforeEach(() => {
		mockWs = {
			onopen: jest.fn(),
			onclose: jest.fn(),
			onmessage: jest.fn(),
			send: jest.fn(),
			close: jest.fn(),
			readyState: WebSocket.OPEN,
			addEventListener: jest.fn(),
			removeEventListener: jest.fn()
		};
		MockWebSocket.mockImplementation(() => mockWs);
		(MockWebSocket as any).OPEN = 1;
		(MockWebSocket as any).CLOSED = 3;

		client = new WebSocketClient({
			url: "wss://example.com/api/v4/websocket",
			token: "test-token",
			minRetryTime: 100, // Speed up tests
			jitterRange: 0
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.clearAllTimers();
	});

	describe("Initialization", () => {
		it("should initialize with provided options", () => {
			expect(client).toBeDefined();
		});

		it("should connect when initialize is called", () => {
			client.initialize();
			expect(MockWebSocket).toHaveBeenCalledWith(
				expect.stringContaining(
					"wss://example.com/api/v4/websocket?connection_id=&sequence_number=0"
				)
			);
		});

		it("should not connect if url is missing", () => {
			const noUrlClient = new WebSocketClient({
				token: "token",
				url: null as any
			});
			noUrlClient.initialize();
			expect(MockWebSocket).not.toHaveBeenCalled();
		});
	});

	describe("Connection Lifecycle", () => {
		it("should send authentication challenge on open", () => {
			client.initialize();
			mockWs.onopen();

			expect(mockWs.send).toHaveBeenCalledWith(
				JSON.stringify({
					action: "authentication_challenge",
					seq: 1,
					data: { token: "test-token" }
				})
			);
		});

		it("should handle reconnection logic on close", () => {
			client.initialize();
			mockWs.onopen(); // Open first

			// Trigger close
			mockWs.onclose();

			expect(client["connFailCount"]).toBe(1);

			// Should schedule reconnect
			jest.advanceTimersByTime(100);

			expect(MockWebSocket).toHaveBeenCalledTimes(2); // Initial + Reconnect
		});

		it("should reset sequence number on close if resetCount is true", () => {
			client = new WebSocketClient({
				url: "wss://example.com",
				token: "token",
				resetCount: true,
				minRetryTime: 10
			});
			client.initialize();
			client["sSequence"] = 5;

			mockWs.onclose();

			expect(client["sSequence"]).toBe(0);
		});

		it("should NOT reset sequence number on close if resetCount is false", () => {
			client = new WebSocketClient({
				url: "wss://example.com",
				token: "token",
				resetCount: false,
				minRetryTime: 10
			});
			client.initialize();
			client["sSequence"] = 5;

			mockWs.onclose();

			expect(client["sSequence"]).toBe(5);
		});
	});

	describe("Message Handling", () => {
		it("should handle hello message and set connectionId", () => {
			client.initialize();
			mockWs.onopen();

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
			client.initialize();
			mockWs.onopen();

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
			client.initialize();
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
			client.initialize();
			mockWs.onopen();

			const callback = jest.fn();
			// Send message with callback
			client.sendMessage("custom_action", {}, callback);
			const sentSeq = 2; // Seq 1 used by authentication_challenge

			const replyMsg = {
				seq_reply: sentSeq,
				status: "OK"
			};

			mockWs.onmessage({ data: JSON.stringify(replyMsg) });

			expect(callback).toHaveBeenCalledWith(replyMsg);
		});
	});

	describe("API Methods", () => {
		beforeEach(() => {
			client.initialize();
			mockWs.onopen();
		});

		it("should send user_typing", () => {
			client.userTyping("channel_1", "post_1");
			expect(mockWs.send).toHaveBeenCalledWith(
				expect.stringContaining('"action":"user_typing"')
			);
		});

		it("should send presence updates", () => {
			client.updateActiveChannel("channel_1");
			expect(mockWs.send).toHaveBeenCalledWith(
				expect.stringContaining('"action":"presence"')
			);
		});

		it("userUpdateActiveStatus sends correct action", () => {
			client.userUpdateActiveStatus(true, true);
			expect(mockWs.send).toHaveBeenCalledWith(
				expect.stringContaining('"action":"user_update_active_status"')
			);
		});

		it("acknowledgePostedNotification sends correct action", () => {
			client.acknowledgePostedNotification("post_id", "status");
			expect(mockWs.send).toHaveBeenCalledWith(
				expect.stringContaining('"action":"posted_notify_ack"')
			);
		});

		it("getStatuses sends correct action", () => {
			client.getStatuses();
			expect(mockWs.send).toHaveBeenCalledWith(
				expect.stringContaining('"action":"get_statuses"')
			);
		});

		it("getStatusesByIds sends correct action", () => {
			client.getStatusesByIds(["u1"]);
			expect(mockWs.send).toHaveBeenCalledWith(
				expect.stringContaining('"action":"get_statuses_by_ids"')
			);
		});
	});

	describe("Listeners Management", () => {
		it("should add and remove message listeners", () => {
			const fn = jest.fn();
			client.listeners.message.add(fn);
			expect(client["messageListeners"].has(fn)).toBe(true);
			client.listeners.message.remove(fn);
			expect(client["messageListeners"].has(fn)).toBe(false);
		});

		// Similar tests for other listener types...
		it("should warn if too many listeners added", () => {
			const loggerSpy = jest.spyOn(client["logger"], "warn");
			for (let i = 0; i < 6; i++) {
				client.listeners.message.add(() => null);
			}
			expect(loggerSpy).toHaveBeenCalledWith(
				expect.stringContaining("has 6 message listeners registered")
			);
		});
	});

	describe("Error Handling", () => {
		it("should log error on json parse failure", () => {
			client.initialize();
			const loggerSpy = jest.spyOn(client["logger"], "error");

			mockWs.onmessage({ data: "invalid json" });

			expect(loggerSpy).toHaveBeenCalledWith(
				expect.stringContaining("Failed to parse websocket message")
			);
		});

		it("should log error on unexpected data type", () => {
			client.initialize();
			const loggerSpy = jest.spyOn(client["logger"], "error");

			mockWs.onmessage({ data: 123 }); // Number invalid

			expect(loggerSpy).toHaveBeenCalledWith(
				expect.stringContaining("Received unexpected data type")
			);
		});
	});

	describe("More API Methods", () => {
		beforeEach(() => {
			client.initialize();
			mockWs.onopen();
		});

		it("updateActiveTeam sends correct action", () => {
			client.updateActiveTeam("team_1");
			expect(mockWs.send).toHaveBeenCalledWith(
				expect.stringContaining('"action":"presence"')
			);
			expect(mockWs.send).toHaveBeenCalledWith(
				expect.stringContaining('"team_id":"team_1"')
			);
		});

		it("updateActiveThread sends correct action", () => {
			client.updateActiveThread(true, "channel_1");
			expect(mockWs.send).toHaveBeenCalledWith(
				expect.stringContaining('"action":"presence"')
			);
			expect(mockWs.send).toHaveBeenCalledWith(
				expect.stringContaining('"thread_channel_id":"channel_1"')
			);
		});
	});

	describe("Close and Reconnect Listeners", () => {
		it("should call close listeners", () => {
			const closeListener = jest.fn();
			client.listeners.close.add(closeListener);

			client.initialize();
			mockWs.onclose();

			expect(closeListener).toHaveBeenCalled();
		});

		it("should close connection explicitly", () => {
			client.initialize();
			mockWs.onopen();

			client.close();

			expect(mockWs.close).toHaveBeenCalled();
			expect(client["conn"]).toBeNull();
		});

		it("should trigger reconnect listeners on reconnection", () => {
			const reconnectListener = jest.fn();
			client.listeners.reconnect.add(reconnectListener);

			client.initialize();
			// Mock first fail
			mockWs.onclose();
			// Wait for retry
			jest.advanceTimersByTime(1000);

			// Reconnect happens, onopen is called
			mockWs.onopen();

			expect(reconnectListener).toHaveBeenCalled();
		});
	});
});
