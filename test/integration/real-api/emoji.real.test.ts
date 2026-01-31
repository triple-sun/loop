/**
 * @file Emoji API Integration Tests
 * @description Tests emoji methods against the real Loop API
 */

import type { WebClient } from "../../../src/web-client";
import {
	createRealApiClient,
	printReportSummary,
	testMethod
} from "./real-api-utils";

describe("Emoji API - Real API Tests", () => {
	let client: WebClient;

	beforeAll(() => {
		client = createRealApiClient();
	});

	afterAll(() => {
		printReportSummary();
	});

	describe("emoji.list", () => {
		it("should return list of custom emojis", async () => {
			const result = await testMethod(
				"emoji.list",
				"GET /emoji",
				() => client.emoji.list({ page: 0, per_page: 20 }),
				"CustomEmoji[]"
			);

			console.log("emoji.list result:", JSON.stringify(result, null, 2));
		});
	});

	describe("emoji.autocomplete", () => {
		it("should autocomplete emojis", async () => {
			const result = await testMethod(
				"emoji.autocomplete",
				"GET /emoji/autocomplete",
				() => client.emoji.autocomplete({ name: "smil" }),
				"CustomEmoji[]"
			);

			console.log(
				"emoji.autocomplete result:",
				JSON.stringify(result, null, 2)
			);
		});
	});

	describe("emoji.search", () => {
		it("should search emojis", async () => {
			const result = await testMethod(
				"emoji.search",
				"POST /emoji/search",
				() => client.emoji.search({ term: "test" }),
				"CustomEmoji[]"
			);

			console.log("emoji.search result:", JSON.stringify(result, null, 2));
		});
	});
});
