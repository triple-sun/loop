/**
 * @file Roles API Integration Tests
 * @description Tests roles methods against the real Loop API
 */

import { afterAll, beforeAll } from "@jest/globals";
import z from "zod";
import type { LoopClient } from "../../src/client";
import { roleSchema } from "./schemas/roles.zod";
import { createRealApiClient, TestReport } from "./utils/real-api.utils";

describe("Roles API - Real API Tests", () => {
	let client: LoopClient;

	const report = new TestReport("Roles");

	beforeAll(() => {
		client = createRealApiClient();
	});

	afterAll(() => {
		report.summarize();
	});

	describe("roles.getByName", () => {
		it("should return role by name (system_user)", async () => {
			await report.testMethod(
				"roles.getByName",
				"GET /roles/name/:role_name",
				() => client.roles.get.byName({ name: "system_user" }),
				roleSchema
			);
		});
	});

	describe("roles.getByNames", () => {
		it("should return roles by names", async () => {
			await report.testMethod(
				"roles.getByNames",
				"POST /roles/names",
				() =>
					client.roles.get.byNames({
						roles: ["system_user", "team_user", "channel_user"]
					}),
				z.array(roleSchema)
			);
		});
	});
});
