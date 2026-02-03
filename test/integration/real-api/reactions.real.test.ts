/**
 * @file Reactions API Integration Tests
 * @description Tests reactions methods against the real Loop API
 */

import { describe } from "@jest/globals";
import { z } from "zod";
// import { ChannelType } from "../../../src/types";
import type { WebClient } from "../../../src/web-client";
import { statusOkSchema } from "./schemas/common.zod";
import { reactionSchema } from "./schemas/reactions.zod";
import {
	createRealApiClient,
	printReportSummary,
	testMethod
} from "./utils.ts/real-api.utils";

describe("Reactions API - Real API Tests", () => {
	let client: WebClient;
	let foundTeamId: string = "";
	let foundChannelId: string = "";
	let currentUserId: string = "";
	let createdPostId: string = "";

	beforeAll(async () => {
		client = createRealApiClient();

		// Get current user
		try {
			const me = await client.users.profile.get.me();
			currentUserId = me.data.id;
		} catch (error) {
			console.error("Failed to get current user:", error);
		}

		// Get a team
		try {
			const teams = await client.teams.list();
			if (teams.data.length > 0) {
				foundTeamId = teams.data[0]?.id;
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
				}
			} catch (error) {
				console.error("Failed to get channels:", error);
			}
		}

		// Create a post for reactions
		if (foundChannelId) {
			try {
				const post = await client.posts.create({
					channel_id: foundChannelId,
					message: `Test post for reactions - ${new Date().toISOString()}`
				});
				createdPostId = post.data.id;
				console.log("Created test post:", createdPostId);
			} catch (error) {
				console.error("Failed to create test post:", error);
			}
		}
	});

	afterAll(async () => {
		// Cleanup: Delete created post
		if (createdPostId) {
			try {
				await client.posts.delete({ post_id: createdPostId });
			} catch (error) {
				console.error("Failed to cleanup post:", error);
			}
		}
		printReportSummary();
	});

	describe("reactions.create", () => {
		it("should add a reaction to a post", async () => {
			if (!createdPostId || !currentUserId) {
				console.log("Skipping: No post ID or user ID available");
				return;
			}

			await testMethod(
				"reactions.create",
				"POST /reactions",
				async () => {
					const response = await client.reactions.create({
						user_id: currentUserId,
						post_id: createdPostId,
						emoji_name: "+1",
						create_at: Date.now()
					});
					return response;
				},
				reactionSchema
			);
		});
	});

	describe("reactions.getForPost", () => {
		it("should return reactions for a post", async () => {
			if (!createdPostId) {
				console.log("Skipping: No post ID available");
				return;
			}

			await testMethod(
				"reactions.getForPost",
				"GET /posts/:post_id/reactions",
				() => client.reactions.getForPost({ post_id: createdPostId }),
				z.array(reactionSchema)
			);
		});
	});

	describe("reactions.delete", () => {
		it("should remove a reaction from a post", async () => {
			if (!createdPostId || !currentUserId) {
				console.log("Skipping: No post ID or user ID available");
				return;
			}

			await testMethod(
				"reactions.delete",
				"POST /users/:user_id/posts/:post_id/reactions/:emoji_name",
				() =>
					client.reactions.delete({
						user_id: currentUserId,
						post_id: createdPostId,
						emoji_name: "+1"
					}),
				statusOkSchema
			);
		});
	});
});
