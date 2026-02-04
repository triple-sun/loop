/**
 * @file Teams API Integration Tests
 * @description Tests teams methods against the real Loop API
 */

import { describe } from "@jest/globals";
import { z } from "zod";
import type { WebClient } from "../../../src/web-client";
import {
	teamMembershipSchema,
	teamSchema,
	teamStatsSchema
} from "./schemas/teams.zod";
import { createRealApiClient, TestReport } from "./utils/real-api.utils";

describe("Teams API - Real API Tests", () => {
	let client: WebClient;
	const foundTeamId: string = "";
	const foundTeamName: string = "";
	let currentUserId: string = "";

	const report = new TestReport("Teams");

	beforeAll(async () => {
		client = createRealApiClient();

		// Get current user
		try {
			const me = await client.users.profile.get.me();
			currentUserId = me.data.id;
		} catch (error) {
			console.error("Failed to get current user:", error);
		}
	});

	afterAll(() => {
		report.summarize();
	});

	describe("teams.list", () => {
		it("should return list of teams", async () => {
			await report.testMethod(
				"teams.list",
				"GET /teams",
				() => client.teams.list({ page: 0, per_page: 10 }),
				z.array(teamSchema)
			);
		});
	});

	describe("teams.getById", () => {
		it("should return team by ID", async () => {
			if (!foundTeamId) {
				console.log("Skipping: No team ID available");
				return;
			}

			await report.testMethod(
				"teams.getById",
				"GET /teams/:team_id",
				() => client.teams.get.byId({ team_id: foundTeamId }),
				teamSchema
			);
		});
	});

	describe("teams.getByName", () => {
		it("should return team by name", async () => {
			if (!foundTeamName) {
				console.log("Skipping: No team name available");
				return;
			}

			await report.testMethod(
				"teams.getByName",
				"GET /teams/name/:name",
				() => client.teams.get.byName({ name: foundTeamName }),
				teamSchema
			);
		});
	});

	describe("teams.getStats", () => {
		it("should return team stats", async () => {
			if (!foundTeamId) {
				console.log("Skipping: No team ID available");
				return;
			}

			await report.testMethod(
				"teams.getStats",
				"GET /teams/:team_id/stats",
				() => client.teams.getStats({ team_id: foundTeamId }),
				teamStatsSchema
			);
		});
	});

	describe("teams.members.get", () => {
		it("should return team members", async () => {
			if (!foundTeamId) {
				console.log("Skipping: No team ID available");
				return;
			}

			await report.testMethod(
				"teams.members.list",
				"GET /teams/:team_id/members",
				() => client.teams.members.list({ team_id: foundTeamId }),
				z.array(teamMembershipSchema)
			);
		});
	});

	describe("teams.members.getById", () => {
		it("should return team member by ID", async () => {
			if (!foundTeamId || !currentUserId) {
				console.log("Skipping: No team ID or user ID available");
				return;
			}

			await report.testMethod(
				"teams.members.get",
				"GET /teams/:team_id/members/:user_id",
				() =>
					client.teams.members.get({
						team_id: foundTeamId,
						user_id: currentUserId
					}),
				teamMembershipSchema
			);
		});
	});
});
