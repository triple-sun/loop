/**
 * @file System API Integration Tests
 * @description Tests system methods against the real Loop API
 */

import { z } from "zod";
import type { WebClient } from "../../../src/web-client";
import { statusOkSchema } from "./schemas/common.zod";
import {
	createRealApiClient,
	TestReport,
	TestResultCategory
} from "./utils.ts/real-api.utils";

describe("System API - Real API Tests", () => {
	let client: WebClient;

	const report = new TestReport("System");

	beforeAll(() => {
		client = createRealApiClient();
	});

	afterAll(() => {
		report.summarize();
	});

	describe("system.getPing", () => {
		it("should return server ping status", async () => {
			const result = await report.testMethod(
				"system.getPing",
				"GET /system/ping",
				() => client.system.checkHealth(),
				statusOkSchema
			);

			if (result.category === TestResultCategory.SUCCESS) {
				expect(result.responseData).toBeDefined();
			}
		});
	});

	describe("system.getLogs", () => {
		it("should return server logs (may require admin)", async () => {
			await report.testMethod(
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
				z.array(z.string())
			);
		});
	});

	describe("system.getAnalytics", () => {
		it("should return analytics data (may require admin)", async () => {
			await report.testMethod(
				"system.getAnalytics",
				"GET /analytics/old",
				() => client.system.getAnalytics({ name: "standard" }),
				z.array(z.any()) // AnalyticsRow[] was string, assuming array of any for now as schema isn't generated
			);
		});
	});
});
