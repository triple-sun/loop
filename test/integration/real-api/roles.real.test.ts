/**
 * @file Roles API Integration Tests
 * @description Tests roles methods against the real Loop API
 */

import type { WebClient } from "../../../src/web-client";
import {
	createRealApiClient,
	printReportSummary,
	testMethod
} from "./real-api-utils";

describe("Roles API - Real API Tests", () => {
	let client: WebClient;

	beforeAll(() => {
		client = createRealApiClient();
	});

	afterAll(() => {
		printReportSummary();
	});

	describe("roles.getByName", () => {
		it("should return role by name (system_user)", async () => {
			const result = await testMethod(
				"roles.getByName",
				"GET /roles/name/:role_name",
				() => client.roles.get.byName({ name: "system_user" }),
				"Role"
			);

			console.log("roles.getByName result:", JSON.stringify(result, null, 2));
		});
	});

	describe("roles.getByNames", () => {
		it("should return roles by names", async () => {
			const result = await testMethod(
				"roles.getByNames",
				"POST /roles/names",
				() =>
					client.roles.get.byNames({
						roles: ["system_user", "team_user", "channel_user"]
					}),
				"Role[]"
			);

			console.log("roles.getByNames result:", JSON.stringify(result, null, 2));
		});
	});
});
