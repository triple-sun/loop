/**
 * @file Reactions API Integration Tests
 * @description Tests reactions methods against the real Loop API
 */

// biome-ignore-all lint/style/noNonNullAssertion: <jest>
import type { WebClient } from "../../../src/web-client";
import {
	createRealApiClient,
	printReportSummary,
	testMethod
} from "./real-api-utils";

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: <jest>
describe("Reactions API - Real API Tests", () => {
	let client: WebClient;
	let foundTeamId: string | undefined;
	let foundChannelId: string | undefined;
	let testPostId: string | undefined;
	let currentUserId: string | undefined;

	beforeAll(async () => {
		client = createRealApiClient();

		// Get current user
		try {
			const me = await client.users.profile.me();
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

		// Create a test post for reactions
		if (foundChannelId) {
			try {
				const post = await client.posts.create({
					channel_id: foundChannelId,
					message: `Reaction test post - ${new Date().toISOString()}`
				});
				testPostId = post.data.id;
				console.log("Created test post for reactions:", testPostId);
			} catch (error) {
				console.error("Failed to create test post:", error);
			}
		}
	});

	afterAll(async () => {
		// Cleanup: Delete test post
		if (testPostId) {
			try {
				await client.posts.delete({ post_id: testPostId });
				console.log("Cleaned up test post:", testPostId);
			} catch (error) {
				console.error("Failed to cleanup test post:", error);
			}
		}
		printReportSummary();
	});

	describe("reactions.create", () => {
		it("should add a reaction to a post", async () => {
			if (!testPostId || !currentUserId) {
				console.log("Skipping: No post or user ID available");
				return;
			}

			const result = await testMethod(
				"reactions.create",
				"POST /reactions",
				() =>
					client.reactions.create({
						user_id: currentUserId!,
						post_id: testPostId!,
						emoji_name: "thumbsup",
						create_at: Date.now()
					}),
				"Reaction"
			);

			console.log("reactions.create result:", JSON.stringify(result, null, 2));
		});
	});

	describe("reactions.getForPost", () => {
		it("should return reactions for a post", async () => {
			if (!testPostId) {
				console.log("Skipping: No post ID available");
				return;
			}

			const result = await testMethod(
				"reactions.getForPost",
				"GET /posts/:post_id/reactions",
				() => client.reactions.getForPost({ post_id: testPostId! }),
				"Reaction[]"
			);

			console.log(
				"reactions.getForPost result:",
				JSON.stringify(result, null, 2)
			);
		});
	});

	describe("reactions.delete", () => {
		it("should delete a reaction from a post", async () => {
			if (!testPostId || !currentUserId) {
				console.log("Skipping: No post or user ID available");
				return;
			}

			const result = await testMethod(
				"reactions.delete",
				"DELETE /users/:user_id/posts/:post_id/reactions/:emoji_name",
				() =>
					client.reactions.delete({
						user_id: currentUserId!,
						post_id: testPostId!,
						emoji_name: "thumbsup"
					}),
				"StatusOK"
			);

			console.log("reactions.delete result:", JSON.stringify(result, null, 2));
		});
	});
});
