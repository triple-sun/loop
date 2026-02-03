/**
 * @file Users API Integration Tests
 * @description Tests users methods against the real Loop API
 */
/** biome-ignore-all lint/style/noNonNullAssertion: <jest> */

import { z } from "zod";
import type { WebClient } from "../../../src/web-client";
import { channelSchema } from "./schemas/channels.zod";
import { preferenceTypeSchema } from "./schemas/preferences.zod";
import { userProfileSchema, userStatusSchema } from "./schemas/users.zod";
import {
	createRealApiClient,
	TestReport,
	TestResultCategory
} from "./utils.ts/real-api.utils";

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: <jest>
describe("Users API - Real API Tests", () => {
	let client: WebClient;
	let currentUserId: string | undefined;
	let foundTeamId: string | undefined;

	const report = new TestReport("Users");

	beforeAll(async () => {
		client = createRealApiClient();

		// Get current user ID for subsequent tests
		try {
			const me = await client.users.profile.get.me();
			currentUserId = me.data.id;
			console.log("Current user ID:", currentUserId);
		} catch (error) {
			console.error("Failed to get current user:", error);
		}

		// Get a team for team-scoped tests
		try {
			const teams = await client.teams.list();
			if (teams.data.length > 0) {
				foundTeamId = teams.data[0]?.id;
				console.log("Found team ID:", foundTeamId);
			}
		} catch (error) {
			console.error("Failed to get teams:", error);
		}
	});

	afterAll(() => {
		report.summarize();
	});

	describe("users.profile.get.me", () => {
		it("should return current user profile", async () => {
			const result = await report.testMethod(
				"users.profile.get.me",
				"GET /users/me",
				() => client.users.profile.get.me(),
				userProfileSchema
			);

			if (result.category === TestResultCategory.SUCCESS) {
				expect(result.responseData).toBeDefined();
			}
		});
	});

	describe("users.profile.getById", () => {
		it("should return user profile by ID", async () => {
			if (!currentUserId) {
				console.log("Skipping: No user ID available");
				return;
			}

			await report.testMethod(
				"users.profile.getById",
				"GET /users/:user_id",
				() => client.users.profile.get.byId({ user_id: currentUserId! }),
				userProfileSchema
			);
		});
	});

	describe("users.list", () => {
		it("should return list of users", async () => {
			const result = await report.testMethod(
				"users.list",
				"GET /users",
				() => client.users.list({ page: 0, per_page: 10 }),
				z.array(userProfileSchema)
			);

			if (result.category === TestResultCategory.SUCCESS) {
				expect(
					Array.isArray(result.responseData) ||
						typeof result.responseData === "string"
				).toBe(true);
			}
		});
	});

	describe("users.autocomplete", () => {
		it("should return user autocomplete results", async () => {
			await report.testMethod(
				"users.autocomplete",
				"GET /users/autocomplete",
				() => client.users.autocomplete({ name: "a" }),
				z.object({
					users: z.array(userProfileSchema),
					out_of_channel: z.array(userProfileSchema).optional()
				})
			);
		});
	});

	describe("users.status.get", () => {
		it("should return user status", async () => {
			if (!currentUserId) {
				console.log("Skipping: No user ID available");
				return;
			}

			await report.testMethod(
				"users.status.get",
				"GET /users/:user_id/status",
				() => client.users.status.get({ user_id: currentUserId! }),
				userStatusSchema
			);
		});
	});

	describe("users.channels", () => {
		it("should return user's channels", async () => {
			if (!currentUserId) {
				console.log("Skipping: No user ID available");
				return;
			}

			await report.testMethod(
				"users.channels",
				"GET /users/:user_id/channels",
				() => client.users.channels.list.all({ user_id: currentUserId! }),
				z.array(channelSchema)
			);
		});
	});

	describe("users.preferences.get", () => {
		it("should return user preferences", async () => {
			if (!currentUserId) {
				console.log("Skipping: No user ID available");
				return;
			}

			await report.testMethod(
				"users.preferences.get",
				"GET /users/:user_id/preferences",
				() => client.users.preferences.get({ user_id: currentUserId! }),
				z.array(preferenceTypeSchema)
			);
		});
	});

	describe("users.profile.getByEmail", () => {
		it("should find user by email (may require specific email)", async () => {
			await report.testMethod(
				"users.profile.getByEmail",
				"GET /users/email",
				() =>
					client.users.profile.get.byEmail({
						email: "sploit.strannik@gmail.com"
					}),
				userProfileSchema
			);
		});
	});

	describe("users.profile.getByUsername", () => {
		it("should find user by username", async () => {
			await report.testMethod(
				"users.profile.getByUsername",
				"GET /users/username",
				() => client.users.profile.get.byUsername({ username: "triplesun" }),
				userProfileSchema
			);
		});
	});
});
