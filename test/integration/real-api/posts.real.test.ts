/**
 * @file Posts API Integration Tests
 * @description Tests posts methods against the real Loop API
 */
/** biome-ignore-all lint/style/noNonNullAssertion: <jest> */

import type { WebClient } from "../../../src/web-client";
import {
	createRealApiClient,
	printReportSummary,
	TestResultCategory,
	testMethod
} from "./real-api-utils";

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: <jesting>
describe("Posts API - Real API Tests", () => {
	let client: WebClient;
	let foundTeamId: string | undefined;
	let foundChannelId: string | undefined;
	let currentUserId: string | undefined;
	let createdPostId: string | undefined;

	beforeAll(async () => {
		client = createRealApiClient();

		// Get current user
		try {
			const me = await client.users.profile.me();
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
		// Cleanup: Delete created post if exists
		if (createdPostId) {
			try {
				await client.posts.delete({ post_id: createdPostId });
				console.log("Cleaned up test post:", createdPostId);
			} catch (error) {
				console.error("Failed to cleanup test post:", error);
			}
		}
		printReportSummary();
	});

	describe("posts.create", () => {
		it("should create a new post", async () => {
			if (!foundChannelId) {
				console.log("Skipping: No channel ID available");
				return;
			}

			const result = await testMethod(
				"posts.create",
				"POST /posts",
				async () => {
					const response = await client.posts.create({
						channel_id: foundChannelId!,
						message: `Test post (API Integration Test) - ${new Date().toISOString()}`
					});
					createdPostId = response.data.id;
					return response;
				},
				"Post"
			);

			if (result.category === TestResultCategory.SUCCESS) {
				expect(result.responseData).toBeDefined();
			}

			console.log("posts.create result:", JSON.stringify(result, null, 2));
		});
	});

	describe("posts.get", () => {
		it("should return post by ID", async () => {
			if (!createdPostId) {
				console.log("Skipping: No post ID available");
				return;
			}

			const result = await testMethod(
				"posts.get",
				"GET /posts/:post_id",
				() => client.posts.get({ post_id: createdPostId! }),
				"Post"
			);

			console.log("posts.get result:", JSON.stringify(result, null, 2));
		});
	});

	describe("posts.update", () => {
		it("should update a post", async () => {
			if (!createdPostId) {
				console.log("Skipping: No post ID available");
				return;
			}

			const result = await testMethod(
				"posts.update",
				"PUT /posts/:id",
				() =>
					client.posts.update({
						id: createdPostId!,
						message: `Updated post - ${new Date().toISOString()}`
					}),
				"Post"
			);

			console.log("posts.update result:", JSON.stringify(result, null, 2));
		});
	});

	describe("posts.getThread", () => {
		it("should return post thread", async () => {
			if (!createdPostId) {
				console.log("Skipping: No post ID available");
				return;
			}

			const result = await testMethod(
				"posts.getThread",
				"GET /posts/:post_id/thread",
				() => client.posts.getThread({ post_id: createdPostId! }),
				"PostList"
			);

			console.log("posts.getThread result:", JSON.stringify(result, null, 2));
		});
	});

	describe("posts.getForChannel", () => {
		it("should return posts for a channel", async () => {
			if (!foundChannelId) {
				console.log("Skipping: No channel ID available");
				return;
			}

			const result = await testMethod(
				"posts.getForChannel",
				"GET /channels/:channel_id/posts",
				() =>
					client.posts.getForChannel({
						channel_id: foundChannelId!,
						page: 0,
						per_page: 10
					}),
				"PostList"
			);

			console.log(
				"posts.getForChannel result:",
				JSON.stringify(result, null, 2)
			);
		});
	});

	describe("posts.pin", () => {
		it("should pin a post", async () => {
			if (!createdPostId) {
				console.log("Skipping: No post ID available");
				return;
			}

			const result = await testMethod(
				"posts.pin",
				"POST /posts/:post_id/pin",
				() => client.posts.pin({ post_id: createdPostId! }),
				"StatusOK"
			);

			console.log("posts.pin result:", JSON.stringify(result, null, 2));
		});
	});

	describe("posts.unpin", () => {
		it("should unpin a post", async () => {
			if (!createdPostId) {
				console.log("Skipping: No post ID available");
				return;
			}

			const result = await testMethod(
				"posts.unpin",
				"POST /posts/:post_id/unpin",
				() => client.posts.unpin({ post_id: createdPostId! }),
				"StatusOK"
			);

			console.log("posts.unpin result:", JSON.stringify(result, null, 2));
		});
	});
});
