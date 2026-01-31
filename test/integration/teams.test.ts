import { describe, expect } from "@jest/globals";
import { TeamType } from "../../src/types";
import type { WebClient } from "../../src/web-client";
import { cleanupTestClient, mockApi, setupTestClient } from "./utils";

describe("Teams Integration Tests", () => {
	let client: WebClient;

	beforeEach(() => {
		client = setupTestClient();
	});

	afterEach(() => {
		cleanupTestClient();
	});

	describe("teams.create", () => {
		it("should create a team", async () => {
			const teamData = {
				name: "new-team",
				display_name: "New Team",
				type: TeamType.O
			};
			const responseTeam = { ...teamData, id: "team_id" };

			const scope = mockApi("/teams", "post", responseTeam, 201);

			const result = await client.teams.create(teamData);
			expect(result.data.id).toBe("team_id");
			scope.done();
		});
	});

	describe("teams.list", () => {
		it("should list teams", async () => {
			const teams = [{ id: "t1" }, { id: "t2" }];
			const scope = mockApi("/teams", "get", teams);

			const result = await client.teams.list();
			expect(result.data).toHaveLength(2);
			scope.done();
		});
	});

	describe("teams.get", () => {
		it("should get a team by id", async () => {
			const teamId = "t1";
			const team = { id: teamId, name: "team" };

			const scope = mockApi(`/teams/${teamId}`, "get", team);

			const result = await client.teams.get.byId({ team_id: teamId });
			expect(result.data.id).toBe(teamId);
			scope.done();
		});
	});

	describe("teams.update", () => {
		it("should update a team", async () => {
			const teamId = "t1";
			const updateData = { id: teamId, display_name: "Updated Name" };

			const scope = mockApi(`/teams/${teamId}`, "put", updateData, 200);

			const result = await client.teams.update(updateData);
			expect(result.data.display_name).toBe("Updated Name");
			scope.done();
		});
	});

	describe("teams.delete", () => {
		it("should delete a team", async () => {
			const teamId = "t1";

			const scope = mockApi(`/teams/${teamId}`, "delete", { status: "OK" });

			const result = await client.teams.delete({ team_id: teamId });
			expect(result.data.status).toBe("OK");
			scope.done();
		});
	});

	describe("teams.checkNameExists", () => {
		it("should check if team name exists", async () => {
			const name = "myteam";
			const exists = { exists: true };
			const scope = mockApi(`/teams/name/${name}/exists`, "get", exists);

			const result = await client.teams.checkNameExists({ name });
			expect(result.data.exists).toBe(true);
			scope.done();
		});
	});
});
