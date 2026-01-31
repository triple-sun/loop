/**
 * @file Bots API Integration Tests
 * @description Tests bots methods against the real Loop API
 */

import type { WebClient } from "../../../src/web-client";
import {
	createRealApiClient,
	printReportSummary,
	testMethod
} from "./real-api-utils";

describe("Bots API - Real API Tests", () => {
	let client: WebClient;

	beforeAll(() => {
		client = createRealApiClient();
	});

	afterAll(() => {
		printReportSummary();
	});

	describe("bots.list", () => {
		it("should return list of bots", async () => {
			const result = await testMethod(
				"bots.list",
				"GET /bots",
				() => client.bots.list({ page: 0, per_page: 20 }),
				"Bot[]"
			);

			console.log("bots.list result:", JSON.stringify(result, null, 2));
		});
	});
});
