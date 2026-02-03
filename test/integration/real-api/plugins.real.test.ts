/**
 * @file Plugins API Integration Tests
 * @description Tests plugins methods against the real Loop API
 */

import { z } from "zod";
import type { WebClient } from "../../../src/web-client";
import {
	pluginManifestSchema,
	pluginStatusSchema
} from "./schemas/plugins.zod";
import {
	createRealApiClient,
	printReportSummary,
	testMethod
} from "./utils.ts/real-api.utils";

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
			await testMethod(
				"plugins.get",
				"GET /plugins",
				() => client.plugins.get(),
				z.array(pluginManifestSchema)
			);
		});
	});

	describe("plugins.getStatuses", () => {
		it("should return plugin statuses", async () => {
			await testMethod(
				"plugins.getStatuses",
				"GET /plugins/statuses",
				() => client.plugins.getStatuses(),
				z.array(pluginStatusSchema)
			);
		});
	});

	describe("plugins.getWebapp", () => {
		it("should return webapp plugins", async () => {
			await testMethod(
				"plugins.getWebapp",
				"GET /plugins/webapp",
				() => client.plugins.getWebapp(),
				z.array(pluginManifestSchema)
			);
		});
	});
});
