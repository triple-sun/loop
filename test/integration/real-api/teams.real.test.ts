/**
 * @file Teams API Integration Tests
 * @description Tests teams methods against the real Loop API
 */
/** biome-ignore-all lint/style/noNonNullAssertion: <jest> */

import type { WebClient } from "../../../src/web-client";
import {
	createRealApiClient,
	printReportSummary,
	TestResultCategory,
	testMethod
} from "./real-api-utils";

describe("Teams API - Real API Tests", () => {
	let client: WebClient;
	let foundTeamId: string | undefined;
	let foundTeamName: string | undefined;

	beforeAll(async () => {
		client = createRealApiClient();

		// Get a team for subsequent tests
		try {
			const teams = await client.teams.list();
			if (teams.data.length > 0) {
				foundTeamId = teams.data[0]?.id;
				foundTeamName = teams.data[0]?.name;
				console.log("Found team:", { id: foundTeamId, name: foundTeamName });
			}
		} catch (error) {
			console.error("Failed to get teams:", error);
		}
	});

	afterAll(() => {
		printReportSummary();
	});

	describe("teams.list", () => {
		it("should return list of teams", async () => {
			const result = await testMethod(
				"teams.list",
				"GET /teams",
				() => client.teams.list(),
				"Team[]"
			);

			if (result.category === TestResultCategory.SUCCESS) {
				expect(result.responseData).toBeDefined();
			}

			console.log("teams.list result:", JSON.stringify(result, null, 2));
		});
	});

	describe("teams.get.byId", () => {
		it("should return team by ID", async () => {
			if (!foundTeamId) {
				console.log("Skipping: No team ID available");
				return;
			}

			const result = await testMethod(
				"teams.get.byId",
				"GET /teams/:team_id",
				() => client.teams.get.byId({ team_id: foundTeamId! }),
				"Team"
			);

			console.log("teams.get.byId result:", JSON.stringify(result, null, 2));
		});
	});

	describe("teams.get.byName", () => {
		it("should return team by name", async () => {
			if (!foundTeamName) {
				console.log("Skipping: No team name available");
				return;
			}

			const result = await testMethod(
				"teams.get.byName",
				"GET /teams/name/:name",
				() => client.teams.get.byName({ name: foundTeamName! }),
				"Team"
			);

			console.log("teams.get.byName result:", JSON.stringify(result, null, 2));
		});
	});

	describe("teams.search", () => {
		it("should search teams", async () => {
			const result = await testMethod(
				"teams.search",
				"POST /teams/search",
				() => client.teams.search({ term: "a" }),
				"Team[]"
			);

			console.log("teams.search result:", JSON.stringify(result, null, 2));
		});
	});

	describe("teams.getStats", () => {
		it("should return team statistics", async () => {
			if (!foundTeamId) {
				console.log("Skipping: No team ID available");
				return;
			}

			const result = await testMethod(
				"teams.getStats",
				"GET /teams/:team_id/stats",
				() => client.teams.getStats({ team_id: foundTeamId! }),
				"TeamStats"
			);

			console.log("teams.getStats result:", JSON.stringify(result, null, 2));
		});
	});

	describe("teams.checkNameExists", () => {
		it("should check if team name exists", async () => {
			if (!foundTeamName) {
				console.log("Skipping: No team name available");
				return;
			}

			const result = await testMethod(
				"teams.checkNameExists",
				"GET /teams/name/:name/exists",
				() => client.teams.checkNameExists({ name: foundTeamName! }),
				"{ exists: boolean }"
			);

			console.log(
				"teams.checkNameExists result:",
				JSON.stringify(result, null, 2)
			);
		});
	});
});
