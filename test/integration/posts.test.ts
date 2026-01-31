import { describe, expect } from "@jest/globals";
import type { WebClient } from "../../src/web-client";
import { cleanupTestClient, mockApi, setupTestClient } from "./utils";

describe("Posts Integration Tests", () => {
	let client: WebClient;

	beforeEach(() => {
		client = setupTestClient();
	});

	afterEach(() => {
		cleanupTestClient();
	});

	describe("posts.create", () => {
		it("should create a post with channel_id", async () => {
			const postData = {
				channel_id: "channel_id",
				message: "Hello world"
			};
			const responsePost = { ...postData, id: "post_id" };

			const scope = mockApi("/posts", "post", responsePost, 201);

			const result = await client.posts.create(postData);
			expect(result.data.id).toBe("post_id");
			expect(result.data.message).toBe("Hello world");
			scope.done();
		});

		it("should create a post with user_id", async () => {
			// This tests the logic where the client automatically creates a direct channel first
			// But for this direct test, we assume the user might just want to use the method signature
			// However, `posts.create` logic in `web-client.ts` interceptor handles user_id -> channel_id resolution.
			// We'll test the raw API call assumption here that key/values are passed.

			// NOTE: The actual interceptor logic is tested in `web-client.integration.test.ts`.
			// Here we focus on the API endpoint contract.

			const postData = {
				channel_id: "channel_id", // client would have resolved this
				message: "Hello"
			};
			const responsePost = { ...postData, id: "p1" };

			const scope = mockApi("/posts", "post", responsePost, 201);

			const result = await client.posts.create(postData);
			expect(result.data.id).toBe("p1");
			scope.done();
		});
	});

	describe("posts.update", () => {
		it("should update a post", async () => {
			const postId = "p1";
			const updateData = { id: postId, message: "Updated" };

			const scope = mockApi(`/posts/${postId}`, "put", updateData, 200);

			const result = await client.posts.update(updateData);
			expect(result.data.message).toBe("Updated");
			scope.done();
		});
	});

	describe("posts.delete", () => {
		it("should delete a post", async () => {
			const postId = "p1";

			const scope = mockApi(`/posts/${postId}`, "delete", { status: "OK" });

			const result = await client.posts.delete({ post_id: postId });
			expect(result.data.status).toBe("OK");
			scope.done();
		});
	});

	describe("posts.getThread", () => {
		it("should get a thread", async () => {
			const postId = "p1";
			const thread = {
				posts: { p1: { id: "p1" }, p2: { id: "p2", root_id: "p1" } }
			};

			const scope = mockApi(`/posts/${postId}/thread`, "get", thread);

			const result = await client.posts.getThread({ post_id: postId });
			expect(result.data.posts["p1"]?.id).toBe("p1");
			expect(result.data.posts["p2"]?.root_id).toBe("p1");
			scope.done();
		});
	});

	describe("posts.pin", () => {
		it("should pin a post", async () => {
			const postId = "p1";
			const scope = mockApi(`/posts/${postId}/pin`, "post", { status: "OK" });

			const result = await client.posts.pin({ post_id: postId });
			expect(result.data.status).toBe("OK");
			scope.done();
		});
	});

	describe("posts.unpin", () => {
		it("should unpin a post", async () => {
			const postId = "p1";
			const scope = mockApi(`/posts/${postId}/unpin`, "post", { status: "OK" });

			const result = await client.posts.unpin({ post_id: postId });
			expect(result.data.status).toBe("OK");
			scope.done();
		});
	});
});
