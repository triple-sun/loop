/**
 * @file Emoji API Integration Tests
 * @description Tests emoji methods against the real Loop API
 */

import { z } from "zod";
import type { WebClient } from "../../../src/web-client";
import { customEmojiSchema, emojiSchema } from "./schemas/emojis.zod";
import { createRealApiClient, TestReport } from "./utils.ts/real-api.utils";

describe("Emoji API - Real API Tests", () => {
	let client: WebClient;
	let foundEmojiId: string | undefined;

	const report = new TestReport("Emoji");

	beforeAll(() => {
		client = createRealApiClient();
	});

	afterAll(() => {
		report.summarize();
	});

	describe("emoji.list", () => {
		it("should return list of custom emoji", async () => {
			await report.testMethod(
				"emoji.list",
				"GET /emoji",
				() => client.emojis.list({ page: 0, per_page: 10 }),
				z.array(emojiSchema)
			);
		});
	});

	describe("emoji.get", () => {
		it("should return custom emoji by ID", async () => {
			if (!foundEmojiId) {
				console.log("Skipping: No emoji ID available");
				return;
			}

			await report.testMethod(
				"emoji.get.byId",
				"GET /emoji/:emoji_id",
				() => client.emojis.get.byId({ emoji_id: foundEmojiId }),
				customEmojiSchema
			);
		});
	});

	// Note: Providing a real emoji name might be tricky if none exist.
	// We'll skip strict failure if it returns 404 for 'smile'
	describe("emoji.getByName", () => {
		it("should return custom emoji by name", async () => {
			await report.testMethod(
				"emoji.get.byName",
				"GET /emoji/name/:name",
				() => client.emojis.get.byName({ name: "smile" }),
				customEmojiSchema
			);
		});
	});
});
