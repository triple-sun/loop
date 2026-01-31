/**
 * @file Users API Integration Tests
 * @description Tests users methods against the real Loop API
 */
/** biome-ignore-all lint/style/noNonNullAssertion: <jest> */

import type { WebClient } from "../../../src/web-client";
import {
	createRealApiClient,
	printReportSummary,
	TestResultCategory,
	testMethod
} from "./real-api-utils";

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: <jest>
describe("Users API - Real API Tests", () => {
	let client: WebClient;
	let currentUserId: string | undefined;
	let foundTeamId: string | undefined;

	beforeAll(async () => {
		client = createRealApiClient();

		// Get current user ID for subsequent tests
		try {
			const me = await client.users.profile.me();
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
		printReportSummary();
	});

	describe("users.profile.me", () => {
		it("should return current user profile", async () => {
			const result = await testMethod(
				"users.profile.me",
				"GET /users/me",
				() => client.users.profile.me(),
				"UserProfile"
			);

			if (result.category === TestResultCategory.SUCCESS) {
				expect(result.responseData).toBeDefined();
			}

			console.log("users.profile.me result:", JSON.stringify(result, null, 2));
		});
	});

	describe("users.profile.getById", () => {
		it("should return user profile by ID", async () => {
			if (!currentUserId) {
				console.log("Skipping: No user ID available");
				return;
			}

			const result = await testMethod(
				"users.profile.getById",
				"GET /users/:user_id",
				() => client.users.profile.getById({ user_id: currentUserId! }),
				"UserProfile"
			);

			console.log(
				"users.profile.getById result:",
				JSON.stringify(result, null, 2)
			);
		});
	});

	describe("users.list", () => {
		it("should return list of users", async () => {
			const result = await testMethod(
				"users.list",
				"GET /users",
				() => client.users.list({ page: 0, per_page: 10 }),
				"UserProfile[]"
			);

			if (result.category === TestResultCategory.SUCCESS) {
				expect(
					Array.isArray(result.responseData) ||
						typeof result.responseData === "string"
				).toBe(true);
			}

			console.log("users.list result:", JSON.stringify(result, null, 2));
		});
	});

	describe("users.autocomplete", () => {
		it("should return user autocomplete results", async () => {
			const result = await testMethod(
				"users.autocomplete",
				"GET /users/autocomplete",
				() => client.users.autocomplete({ name: "a" }),
				"{ users: UserProfile[]; out_of_channel?: UserProfile[] }"
			);

			console.log(
				"users.autocomplete result:",
				JSON.stringify(result, null, 2)
			);
		});
	});

	describe("users.status.get", () => {
		it("should return user status", async () => {
			if (!currentUserId) {
				console.log("Skipping: No user ID available");
				return;
			}

			const result = await testMethod(
				"users.status.get",
				"GET /users/:user_id/status",
				() => client.users.status.get({ user_id: currentUserId! }),
				"UserStatus"
			);

			console.log("users.status.get result:", JSON.stringify(result, null, 2));
		});
	});

	describe("users.channels", () => {
		it("should return user's channels", async () => {
			if (!currentUserId) {
				console.log("Skipping: No user ID available");
				return;
			}

			const result = await testMethod(
				"users.channels",
				"GET /users/:user_id/channels",
				() => client.users.channels({ user_id: currentUserId! }),
				"Channel[]"
			);

			console.log("users.channels result:", JSON.stringify(result, null, 2));
		});
	});

	describe("users.preferences.get", () => {
		it("should return user preferences", async () => {
			if (!currentUserId) {
				console.log("Skipping: No user ID available");
				return;
			}

			const result = await testMethod(
				"users.preferences.get",
				"GET /users/:user_id/preferences",
				() => client.users.preferences.get({ user_id: currentUserId! }),
				"PreferenceType[]"
			);

			console.log(
				"users.preferences.get result:",
				JSON.stringify(result, null, 2)
			);
		});
	});

	describe("users.profile.getByEmail", () => {
		it("should find user by email (may require specific email)", async () => {
			const result = await testMethod(
				"users.profile.getByEmail",
				"GET /users/email",
				() => client.users.profile.getByEmail({ email: "test@example.com" }),
				"UserProfile"
			);

			console.log(
				"users.profile.getByEmail result:",
				JSON.stringify(result, null, 2)
			);
		});
	});

	describe("users.profile.getByUsername", () => {
		it("should find user by username", async () => {
			const result = await testMethod(
				"users.profile.getByUsername",
				"GET /users/username",
				() => client.users.profile.getByUsername({ username: "triplesun" }),
				"UserProfile"
			);

			console.log(
				"users.profile.getByUsername result:",
				JSON.stringify(result, null, 2)
			);
		});
	});
});
