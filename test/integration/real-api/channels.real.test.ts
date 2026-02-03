/**
 * @file Channels API Integration Tests
 * @description Tests channels methods against the real Loop API
 */
/** biome-ignore-all lint/style/noNonNullAssertion: <jest> */

import { z } from "zod";
import { ChannelType } from "../../../src/types";
import type { WebClient } from "../../../src/web-client";
import {
	channelMembershipSchema,
	channelSchema,
	channelStatsSchema
} from "./schemas/channels.zod";
import {
	createRealApiClient,
	printReportSummary,
	TestResultCategory,
	testMethod
} from "./utils.ts/real-api.utils";

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: <jest>
describe("Channels API - Real API Tests", () => {
	let client: WebClient;
	let foundTeamId: string | undefined;
	let foundChannelId: string | undefined;
	let currentUserId: string | undefined;
	let createdChannelId: string | undefined;

	beforeAll(async () => {
		client = createRealApiClient();

		// Get current user
		try {
			const me = await client.users.profile.get.me();
			currentUserId = me.data.id;
			console.log("Current user ID:", currentUserId);
		} catch (error) {
			console.error("Failed to get current user:", error);
		}

		// Get a team
		try {
			const teams = await client.teams.list();
			if (teams.data.length > 0) {
				foundTeamId = teams.data[0]?.id;
				console.log("Found team ID:", foundTeamId);
			}
		} catch (error) {
			console.error("Failed to get teams:", error);
		}

		// Get a channel
		if (foundTeamId) {
			try {
				const channels = await client.channels.list.inTeam({
					team_id: foundTeamId
				});
				if (channels.data.length > 0) {
					foundChannelId = channels.data[0]?.id;
					console.log("Found channel ID:", foundChannelId);
				}
			} catch (error) {
				console.error("Failed to get channels:", error);
			}
		}
	});

	afterAll(async () => {
		// Cleanup: Delete created channel if exists
		if (createdChannelId) {
			try {
				await client.channels.delete({ channel_id: createdChannelId });
				console.log("Cleaned up test channel:", createdChannelId);
			} catch (error) {
				console.error("Failed to cleanup test channel:", error);
			}
		}
		printReportSummary();
	});

	describe("channels.list", () => {
		it("should return list of channels for a team", async () => {
			if (!foundTeamId) {
				console.log("Skipping: No team ID available");
				return;
			}

			const result = await testMethod(
				"channels.list",
				"GET /teams/:team_id/channels",
				() => client.channels.list.inTeam({ team_id: foundTeamId! }),
				z.array(channelSchema)
			);

			if (result.category === TestResultCategory.SUCCESS) {
				expect(result.responseData).toBeDefined();
			}
		});
	});

	describe("channels.getById", () => {
		it("should return channel by ID", async () => {
			if (!foundChannelId) {
				console.log("Skipping: No channel ID available");
				return;
			}

			await testMethod(
				"channels.getById",
				"GET /channels/:channel_id",
				() => client.channels.get.byId({ channel_id: foundChannelId! }),
				channelSchema
			);
		});
	});

	describe("channels.search", () => {
		it("should search channels in a team", async () => {
			if (!foundTeamId) {
				console.log("Skipping: No team ID available");
				return;
			}

			await testMethod(
				"channels.search",
				"POST /teams/:team_id/channels/search",
				() => client.channels.search.team({ team_id: foundTeamId!, term: "a" }),
				z.array(channelSchema)
			);
		});
	});

	describe("channels.autocomplete", () => {
		it("should autocomplete channels", async () => {
			if (!foundTeamId) {
				console.log("Skipping: No team ID available");
				return;
			}

			await testMethod(
				"channels.autocomplete",
				"GET /teams/:team_id/channels/autocomplete",
				() =>
					client.channels.autocomplete({ team_id: foundTeamId!, name: "a" }),
				z.array(channelSchema)
			);
		});
	});

	describe("channels.getStats", () => {
		it("should return channel statistics", async () => {
			if (!foundChannelId) {
				console.log("Skipping: No channel ID available");
				return;
			}

			await testMethod(
				"channels.getStats",
				"GET /channels/:channel_id/stats",
				() => client.channels.getStats({ channel_id: foundChannelId! }),
				channelStatsSchema
			);
		});
	});

	describe("channels.members.get", () => {
		it("should return channel members", async () => {
			if (!foundChannelId) {
				console.log("Skipping: No channel ID available");
				return;
			}

			await testMethod(
				"channels.members.get",
				"GET /channels/:channel_id/members",
				() => client.channels.members.get({ channel_id: foundChannelId! }),
				z.array(channelMembershipSchema)
			);
		});
	});

	describe("channels.members.getById", () => {
		it("should return specific channel member", async () => {
			if (!foundChannelId || !currentUserId) {
				console.log("Skipping: No channel or user ID available");
				return;
			}

			await testMethod(
				"channels.members.getById",
				"GET /channels/:channel_id/members/:user_id",
				() =>
					client.channels.members.getById({
						channel_id: foundChannelId!,
						user_id: currentUserId!
					}),
				channelMembershipSchema
			);
		});
	});

	describe("channels.create", () => {
		it("should create a new channel", async () => {
			if (!foundTeamId) {
				console.log("Skipping: No team ID available");
				return;
			}

			const testChannelName = `test-channel-${Date.now()}`;

			await testMethod(
				"channels.create",
				"POST /channels",
				async () => {
					const response = await client.channels.create.regular({
						team_id: foundTeamId!,
						name: testChannelName,
						display_name: "Test Channel (API Test)",
						type: ChannelType.OPEN
					});
					createdChannelId = response.data.id;
					return response;
				},
				channelSchema
			);
		});
	});

	describe("channels.searchAll", () => {
		it("should search all channels", async () => {
			await testMethod(
				"channels.searchAll",
				"POST /channels/search_all",
				() => client.channels.search.all({ term: "test" }),
				z.array(channelSchema)
			);
		});
	});

	describe("channels.listByIds", () => {
		it("should return channels by IDs", async () => {
			if (!foundChannelId || !foundTeamId) {
				console.log("Skipping: No channel or team ID available");
				return;
			}

			await testMethod(
				"channels.listByIds",
				"POST /channels/ids",
				() =>
					client.channels.list.byIds({
						channel_ids: [foundChannelId!],
						team_id: foundTeamId!
					}),
				z.array(channelSchema)
			);
		});
	});
});
