import { LogLevel } from "@triple-sun/logger";
import nock from "nock";
import {
	WebAPIRateLimitedError,
	WebAPIRequestError,
	WebAPIServerError
} from "../../src/errors";
import { ChannelType } from "../../src/types";
import { WebClient } from "../../src/web-client";

const TEST_URL = "https://loop.example.com";
const TEST_TOKEN = "test-token";

describe("WebClient Integration Tests", () => {
	let client: WebClient;

	beforeEach(() => {
		if (!nock.isActive()) nock.activate();

		client = new WebClient(TEST_URL, {
			token: TEST_TOKEN,
			logLevel: LogLevel.DEBUG,
			// Disable retries for most tests to speed them up, unless specifically testing retries
			retryConfig: { tries: 1 }
		});
	});

	afterEach(() => {
		nock.cleanAll();
		nock.restore();
	});

	describe("Basic API Calls", () => {
		it("should make a successful GET request", async () => {
			const scope = nock(TEST_URL)
				.get("/api/v4/users/me")
				.matchHeader("Authorization", `Bearer ${TEST_TOKEN}`)
				.reply(200, { id: "user_id_123", username: "testuser" });

			const result = await client.users.profile.me();

			expect(result.data.id).toBe("user_id_123");
			expect(result.data.username).toBe("testuser");
			scope.done();
		});

		it("should make a successful POST request with body", async () => {
			const channelData = {
				team_id: "team_id_123",
				name: "new-channel",
				display_name: "New Channel",
				type: ChannelType.Open
			};

			const scope = nock(TEST_URL)
				.post(`/api/v4/channels`, channelData)
				.matchHeader("Authorization", `Bearer ${TEST_TOKEN}`)
				.reply(201, { id: "channel_id_123", ...channelData });

			const result = await client.channels.create(channelData);
			expect(result.data.id).toBe("channel_id_123");
			expect(result.data.name).toBe("new-channel");
			scope.done();
		});

		it("should serialize query parameters correctly", async () => {
			const query = {
				page: 0,
				per_page: 20,
				team_id: "team_id_123"
			};

			const scope = nock(TEST_URL)
				.get("/api/v4/users")
				.query(query)
				.reply(200, []);

			await client.users.list(query);

			scope.done();
		});
	});

	describe("Error Handling", () => {
		it("should throw WebAPIServerError on 500", async () => {
			const scope = nock(TEST_URL).get("/api/v4/users/me").reply(500, {
				id: "api.context.server_err",
				message: "Internal Server Error",
				status_code: 500
			});

			await expect(client.users.profile.me()).rejects.toThrow(
				WebAPIServerError
			);

			scope.done();
		});

		it("should throw WebAPIRequestError on 400 with non-server-error body", async () => {
			const scope = nock(TEST_URL)
				.get("/api/v4/users/me")
				.reply(400, { name: Error, message: "http_error" });

			await expect(client.users.profile.me()).rejects.toThrow(
				WebAPIRequestError
			);

			scope.done();
		});

		it("should throw WebAPIRateLimitedError on 429", async () => {
			const scope = nock(TEST_URL).get("/api/v4/users/me").reply(429, {
				id: "api.context.rate_limit",
				message: "Rate Limited",
				status_code: 429
			});

			await expect(client.users.profile.me()).rejects.toThrow(
				WebAPIRateLimitedError
			);

			scope.done();
		});
	});

	describe("Interceptors & internal logic", () => {
		it("should fetch current user ID when creating direct channel with single user", async () => {
			const myId = "me_id";
			const otherId = "other_id";

			// 1. Mock the 'me' call that the interceptor will trigger
			const meScope = nock(TEST_URL)
				.get("/api/v4/users/me")
				.reply(200, { id: myId });

			// 2. Mock the actual direct channel creation call
			// It should now include BOTH IDs
			const createScope = nock(TEST_URL)
				.post("/api/v4/channels/direct", body => {
					return (
						Array.isArray(body) && body.includes(myId) && body.includes(otherId)
					);
				})
				.reply(201, { id: "dc_id" });

			// Call with only one ID, enabling the interceptor logic
			await client.channels.createDirect({
				user_ids: [otherId]
			});

			meScope.done();
			createScope.done();
		});

		it("should NOT fetch current user ID if it is already known", async () => {
			const myId = "cached_me_id";
			const otherId = "other_id";

			// Set the ID manually
			client.userID = myId;

			// Should mock ONLY the create call, no 'me' call
			const createScope = nock(TEST_URL)
				.post("/api/v4/channels/direct", [otherId, myId])
				.reply(201, { id: "dc_id" });

			await client.channels.createDirect({
				user_ids: [otherId]
			});

			createScope.done();
		});
	});
});
