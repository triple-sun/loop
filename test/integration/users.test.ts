import { describe, expect } from "@jest/globals";
import type { WebClient } from "../../src/web-client";
import {
	cleanupTestClient,
	mockApi,
	setupTestClient,
	TEST_TOKEN
} from "./utils";

describe("Users Integration Tests", () => {
	let client: WebClient;

	beforeEach(() => {
		client = setupTestClient();
	});

	afterEach(() => {
		cleanupTestClient();
	});

	describe("users.profile.get.me", () => {
		it("should fetch current user profile", async () => {
			const mockUser = {
				id: "me_id",
				username: "my_username",
				email: "me@example.com"
			};

			const scope = mockApi("/users/me", "get", mockUser).matchHeader(
				"Authorization",
				`Bearer ${TEST_TOKEN}`
			);

			const result = await client.users.profile.get.me();

			expect(result.data.id).toBe(mockUser.id);
			expect(result.data.username).toBe(mockUser.username);
			scope.done();
		});

		it("should handle error when token is invalid", async () => {
			mockApi(
				"/users/me",
				"get",
				{
					id: "api.context.session_expired.app_error",
					message: "Invalid session",
					status_code: 401
				},
				401
			);

			await expect(client.users.profile.get.me()).rejects.toThrow();
		});
	});

	describe("users.updateRoles", () => {
		it("should update user roles", async () => {
			const userId = "user_id";

			const scope = mockApi(
				`/users/${userId}/roles`,
				"put",
				{ status: "OK" },
				200
			);

			const result = await client.users.updateRoles({
				user_id: userId,
				roles: ["system_user", "system_admin"]
			});

			expect(result.data.status).toBe("OK");
			scope.done();
		});
	});

	describe("users.list", () => {
		it("should list users with pagination", async () => {
			const users = [{ id: "u1" }, { id: "u2" }];

			// GET request - data becomes query params
			const scope = mockApi("/users", "get", users, 200);

			const result = await client.users.list({
				page: 1,
				per_page: 5,
				in_team: "team_id"
			});
			expect(result.data).toHaveLength(2);
			scope.done();
		});
	});
});
