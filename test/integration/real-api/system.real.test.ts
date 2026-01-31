/**
 * @file System API Integration Tests
 * @description Tests system methods against the real Loop API
 */

import type { WebClient } from "../../../src/web-client";
import {
	createRealApiClient,
	printReportSummary,
	TestResultCategory,
	testMethod
} from "./real-api-utils";

describe("System API - Real API Tests", () => {
	let client: WebClient;

	beforeAll(() => {
		client = createRealApiClient();
	});

	afterAll(() => {
		printReportSummary();
	});

	describe("system.getPing", () => {
		it("should return server ping status", async () => {
			const result = await testMethod(
				"system.getPing",
				"GET /system/ping",
				() => client.system.getPing({}),
				"{ status: string }"
			);

			if (result.category === TestResultCategory.SUCCESS) {
				expect(result.responseData).toBeDefined();
			}

			// Log for documentation
			console.log("system.getPing result:", JSON.stringify(result, null, 2));
		});
	});

	describe("system.getLogs", () => {
		it("should return server logs (may require admin)", async () => {
			const result = await testMethod(
				"system.getLogs",
				"GET /logs",
				() =>
					client.system.getLogs({
						serverNames: [],
						logLevels: [],
						dateFrom: "0",
						dateTo: String(Date.now()),
						page: 0,
						logs_per_page: 10
					}),
				"string[]"
			);

			// May fail with permission denied for non-admin users
			console.log("system.getLogs result:", JSON.stringify(result, null, 2));
		});
	});

	describe("system.getAnalytics", () => {
		it("should return analytics data (may require admin)", async () => {
			const result = await testMethod(
				"system.getAnalytics",
				"GET /analytics/old",
				() => client.system.getAnalytics({ name: "standard" }),
				"AnalyticsRow[]"
			);

			// May fail with permission denied for non-admin users
			console.log(
				"system.getAnalytics result:",
				JSON.stringify(result, null, 2)
			);
		});
	});
});
