import { describe, expect } from "@jest/globals";
import { ChannelType } from "../../src/types";
import type { WebClient } from "../../src/web-client";
import { cleanupTestClient, mockApi, setupTestClient } from "./utils";

describe("Channels Integration Tests", () => {
	let client: WebClient;

	beforeEach(() => {
		client = setupTestClient();
	});

	afterEach(() => {
		cleanupTestClient();
	});

	describe("channels.create", () => {
		it("should create a public channel", async () => {
			const channelData = {
				team_id: "team_id",
				name: "new-channel",
				display_name: "New Channel",
				type: ChannelType.Open
			};
			const responseChannel = { ...channelData, id: "channel_id" };

			const scope = mockApi("/channels", "post", responseChannel, 201);

			const result = await client.channels.create.regular(channelData);
			expect(result.data.id).toBe("channel_id");
			scope.done();
		});
	});

	describe("channels.create.direct", () => {
		it("should create a direct channel", async () => {
			const responseChannel = { id: "dc_id", type: ChannelType.Direct };

			const scope = mockApi("/channels/direct", "post", responseChannel, 201);

			const result = await client.channels.create.direct({
				user_ids: ["u1", "u2"]
			});
			expect(result.data.id).toBe("dc_id");
			scope.done();
		});
	});

	describe("channels.get.byId", () => {
		it("should get a channel by id", async () => {
			const channelId = "c1";
			const responseChannel = { id: channelId, name: "general" };

			const scope = mockApi(`/channels/${channelId}`, "get", responseChannel);

			const result = await client.channels.get.byId({ channel_id: channelId });
			expect(result.data.id).toBe(channelId);
			scope.done();
		});
	});

	describe("channels.update", () => {
		it("should update a channel", async () => {
			const channelId = "c1";
			const updateData = { id: channelId, name: "renamed" };

			const scope = mockApi(`/channels/${channelId}`, "put", updateData, 200);

			const result = await client.channels.update({
				channel_id: channelId,
				name: "renamed"
			});
			expect(result.data.name).toBe("renamed");
			scope.done();
		});
	});

	describe("channels.delete", () => {
		it("should delete (archive) a channel", async () => {
			const channelId = "c1";

			const scope = mockApi(`/channels/${channelId}`, "delete", {
				status: "OK"
			});

			const result = await client.channels.delete({ channel_id: channelId });
			expect(result.data.status).toBe("OK");
			scope.done();
		});
	});

	describe("channels.members", () => {
		it("should get channel members", async () => {
			const channelId = "c1";
			const members = [{ user_id: "u1" }, { user_id: "u2" }];

			// GET requests don't have body, data is sent as query params
			const scope = mockApi(`/channels/${channelId}/members`, "get", members);

			const result = await client.channels.members.get({
				channel_id: channelId
			});
			expect(result.data).toHaveLength(2);
			scope.done();
		});
	});
});
