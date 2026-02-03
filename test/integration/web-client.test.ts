/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: <testing> */

import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import nock from "nock";
import {
	WebAPIRateLimitedError,
	WebAPIRequestError,
	WebAPIServerError
} from "../../src/errors";
import { ChannelType } from "../../src/types";
import type { WebClient } from "../../src/web-client";
import { cleanupTestClient, mockApi, setupTestClient } from "./utils";

const TEST_URL = "https://loop.example.com";
const TEST_TOKEN = "test-token";

describe("WebClient Integration Tests", () => {
	let client: WebClient;

	beforeEach(() => {
		client = setupTestClient({ retryConfig: { retries: 0 } });
	});

	afterEach(() => {
		cleanupTestClient();
	});

	describe("Basic API Calls", () => {
		it("should make a successful GET request", async () => {
			const scope = mockApi(
				"/users/me",
				"get",
				{ id: "user_id_123", username: "testuser" },
				200
			).matchHeader("Authorization", `Bearer ${TEST_TOKEN}`);

			const result = await client.users.profile.get.me();

			expect(result.data.id).toBe("user_id_123");
			expect(result.data.username).toBe("testuser");
			scope.done();
		});

		it("should make a successful POST request with body", async () => {
			const channelData = {
				team_id: "team_id_123",
				name: "new-channel",
				display_name: "New Channel",
				type: ChannelType.OPEN
			};

			// Explicitly match body for JSON POST (use true to match any body)
			const scope = nock(TEST_URL)
				.post("/api/v4/channels", () => true)
				.matchHeader("Authorization", `Bearer ${TEST_TOKEN}`)
				.reply(201, {
					id: "channel_id_123",
					...channelData
				});
			const result = await client.channels.create.regular(channelData);
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

			// Test that the client properly sends query params for GET requests
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
			const scope = nock(TEST_URL)
				.get("/api/v4/users/me")
				.query(true)
				.reply(500, {
					id: "api.context.server_err",
					message: "Internal Server Error",
					status_code: 500
				});

			await expect(client.users.profile.get.me()).rejects.toThrow(
				WebAPIServerError
			);

			scope.done();
		});

		it("should throw WebAPIRequestError on 400 with non-server-error body", async () => {
			const scope = nock(TEST_URL)
				.get("/api/v4/users/me")
				.query(true)
				.reply(400, { name: Error, message: "http_error" });

			await expect(client.users.profile.get.me()).rejects.toThrow(
				WebAPIRequestError
			);

			scope.done();
		});

		it("should throw WebAPIRateLimitedError on 429", async () => {
			const scope = nock(TEST_URL)
				.get("/api/v4/users/me")
				.query(true)
				.reply(429, {
					id: "api.context.rate_limit",
					message: "Rate Limited",
					status_code: 429
				});

			await expect(client.users.profile.get.me()).rejects.toThrow(
				WebAPIRateLimitedError
			);

			scope.done();
		});
	});

	describe("Interceptors & internal logic", () => {
		it("should fetch current user ID when creating direct channel with single user", async () => {
			const myId = "me_id";
			const otherId = "other_id";

			const meScope = nock(TEST_URL)
				.get("/api/v4/users/me")
				.query(true)
				.reply(200, { id: myId });

			const createScope = nock(TEST_URL)
				.post("/api/v4/channels/direct", body => {
					return (
						Array.isArray(body) && body.includes(myId) && body.includes(otherId)
					);
				})
				.reply(201, { id: "dc_id" });

			await client.channels.create.direct({
				user_ids: [otherId]
			});

			meScope.done();
			createScope.done();
		});

		it("should NOT fetch current user ID if it is already known", async () => {
			const myId = "cached_me_id";
			const otherId = "other_id";

			client.userID = myId;

			const createScope = nock(TEST_URL)
				.post("/api/v4/channels/direct", [otherId, myId])
				.reply(201, { id: "dc_id" });

			await client.channels.create.direct({
				user_ids: [otherId]
			});

			createScope.done();
		});
	});
});
