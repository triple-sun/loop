/**
 * @file Plugins API Integration Tests
 * @description Tests plugins methods against the real Loop API
 */

import type { WebClient } from "../../../src/web-client";
import {
	createRealApiClient,
	printReportSummary,
	testMethod
} from "./real-api-utils";

describe("Plugins API - Real API Tests", () => {
	let client: WebClient;

	beforeAll(() => {
		client = createRealApiClient();
	});

	afterAll(() => {
		printReportSummary();
	});

	describe("plugins.get", () => {
		it("should return list of plugins (may require admin)", async () => {
			const result = await testMethod(
				"plugins.get",
				"GET /plugins",
				() => client.plugins.get(),
				"PluginManifest[]"
			);

			console.log("plugins.get result:", JSON.stringify(result, null, 2));
		});
	});

	describe("plugins.getStatuses", () => {
		it("should return plugin statuses", async () => {
			const result = await testMethod(
				"plugins.getStatuses",
				"GET /plugins/statuses",
				() => client.plugins.getStatuses(),
				"PluginStatus[]"
			);

			console.log(
				"plugins.getStatuses result:",
				JSON.stringify(result, null, 2)
			);
		});
	});

	describe("plugins.getWebapp", () => {
		it("should return webapp plugins", async () => {
			const result = await testMethod(
				"plugins.getWebapp",
				"GET /plugins/webapp",
				() => client.plugins.getWebapp(),
				"PluginManifest[]"
			);

			console.log("plugins.getWebapp result:", JSON.stringify(result, null, 2));
		});
	});
});
