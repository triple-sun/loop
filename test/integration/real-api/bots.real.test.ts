/**
 * @file Bots API Integration Tests
 * @description Tests bots methods against the real Loop API
 */

import { z } from "zod";
import type { WebClient } from "../../../src/web-client";
import { botSchema } from "./schemas/bots.zod";
import {
	createRealApiClient,
	printReportSummary,
	testMethod
} from "./utils.ts/real-api.utils";

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
			await testMethod(
				"bots.list",
				"GET /bots",
				() => client.bots.list({ page: 0, per_page: 20 }),
				z.array(botSchema)
			);
		});
	});
});
