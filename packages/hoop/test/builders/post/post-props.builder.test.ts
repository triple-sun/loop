/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: <jesting> */

import { expect } from "@jest/globals";
import { AppLocation } from "loop-types";
import { AppBindingBuilder } from "../../../src/builders/app/app-binding.builder";
import { AttachmentBuilder } from "../../../src/builders/post/post-attachment.builder";
import {
	createPostPropsBuilder,
	PostPropsBuilder
} from "../../../src/builders/post/post-props.builder";

describe("builders/post/props.builder", () => {
	describe("PostPropsBuilder", () => {
		describe("constructor", () => {
			it("should construct with default empty arrays", () => {
				const builder = new PostPropsBuilder();
				const result = builder.build();

				expect(result.attachments).toEqual([]);
				expect(result.app_bindings).toEqual([]);
				expect(result.from_bot).toBe("false");
			});

			it("should construct with provided attachments", () => {
				const builder = new PostPropsBuilder({
					attachments: [{ text: "Test attachment" }]
				});

				const result = builder.build();
				expect(result.attachments).toHaveLength(1);
			});

			it("should construct with provided bindings", () => {
				const builder = new PostPropsBuilder({
					app_bindings: [
						{
							app_id: "test-app",
							location: AppLocation.EMBEDDED,
							description: "",
							bindings: []
						}
					]
				});

				const result = builder.build();
				expect(result.app_bindings).toHaveLength(1);
			});

			it("should construct with metadata", () => {
				const builder = new PostPropsBuilder<{ userId: number }>({
					metadata: { userId: 123 }
				});

				expect(builder.get("metadata")).toEqual({ userId: 123 });
			});

			it("should construct with from_bot flag", () => {
				const builder = new PostPropsBuilder({ from_bot: "true" });

				expect(builder.get("from_bot")).toBe("true");
			});

			it("should handle empty metadata", () => {
				const builder = new PostPropsBuilder({ metadata: undefined });

				expect(builder.get("metadata")).toBeUndefined();
			});
		});

		describe("build", () => {
			it("should return frozen object on build", () => {
				const builder = new PostPropsBuilder();
				const result = builder.build();

				expect(Object.isFrozen(result)).toBe(true);
			});

			it("should build attachments array", () => {
				const builder = new PostPropsBuilder({
					attachments: [{ text: "Attachment 1" }, { text: "Attachment 2" }]
				});

				const result = builder.build();
				expect(result.attachments).toHaveLength(2);
			});

			it("should build app_bindings array", () => {
				const builder = new PostPropsBuilder({
					app_bindings: [
						{
							app_id: "app1",
							location: AppLocation.EMBEDDED,
							description: "Test",
							bindings: []
						}
					]
				});

				const result = builder.build();
				expect(result.app_bindings).toHaveLength(1);
			});
		});

		describe("get and set", () => {
			it("should get property value", () => {
				const builder = new PostPropsBuilder({ from_bot: "true" });

				expect(builder.get("from_bot")).toBe("true");
			});

			it("should set property value", () => {
				const builder = new PostPropsBuilder();
				builder.set("from_bot", "true");

				expect(builder.get("from_bot")).toBe("true");
			});

			it("should set metadata", () => {
				const builder = new PostPropsBuilder<{ key: string }>();
				builder.set("metadata", { key: "value" });

				expect(builder.get("metadata")).toEqual({ key: "value" });
			});
		});

		describe("array operations", () => {
			describe("attachments", () => {
				it("should append attachments", () => {
					const builder = new PostPropsBuilder({
						attachments: [{ text: "First" }]
					});

					builder.append(
						"attachments",
						new AttachmentBuilder({ text: "Second" })
					);

					expect(builder.get("attachments")).toHaveLength(2);
				});
			});

			describe("app_bindings", () => {
				it("should append app bindings", () => {
					const builder = new PostPropsBuilder({
						app_bindings: [
							{
								app_id: "app1",
								location: AppLocation.EMBEDDED,
								description: "First",
								bindings: []
							}
						]
					});

					builder.append(
						"app_bindings",
						new AppBindingBuilder({
							app_id: "app2",
							location: AppLocation.EMBEDDED,
							description: "Second",
							bindings: []
						})
					);

					expect(builder.get("app_bindings")).toHaveLength(2);
				});

				it("should clear app bindings", () => {
					const builder = new PostPropsBuilder({
						app_bindings: [
							{
								app_id: "app1",
								location: AppLocation.EMBEDDED,
								description: "Test",
								bindings: []
							}
						]
					});

					builder.set("app_bindings", []);

					expect(builder.get("app_bindings")).toEqual([]);
				});
			});
		});

		describe("edge cases", () => {
			it("should handle undefined metadata", () => {
				const builder = new PostPropsBuilder();

				expect(builder.get("metadata")).toBeUndefined();
			});

			it("should handle empty arrays", () => {
				const builder = new PostPropsBuilder({
					attachments: [],
					app_bindings: []
				});

				const result = builder.build();
				expect(result.attachments).toEqual([]);
				expect(result.app_bindings).toEqual([]);
			});

			it("should handle complex metadata", () => {
				interface ComplexMetadata {
					user: {
						id: number;
						name: string;
					};
					tags: string[];
				}

				const builder = new PostPropsBuilder<ComplexMetadata>({
					metadata: {
						user: { id: 123, name: "John" },
						tags: ["urgent", "important"]
					}
				});

				const metadata = builder.get("metadata");
				expect(metadata?.user.id).toBe(123);
				expect(metadata?.tags).toEqual(["urgent", "important"]);
			});

			it("should handle multiple bindings with different locations", () => {
				const builder = new PostPropsBuilder({
					app_bindings: [
						{
							app_id: "app1",
							location: AppLocation.EMBEDDED,
							description: "Embedded",
							bindings: []
						},
						{
							app_id: "app2",
							location: AppLocation.IN_POST,
							description: "In Post",
							bindings: []
						}
					]
				});

				const result = builder.build();
				expect(result.app_bindings).toHaveLength(2);
			});
		});
	});

	describe("buildPostProps", () => {
		it("should create a PostPropsBuilder instance", () => {
			const result = createPostPropsBuilder({});

			expect(result).toBeInstanceOf(PostPropsBuilder);
		});

		it("should preserve metadata", () => {
			const result = createPostPropsBuilder<{ key: string }>({
				metadata: { key: "value" }
			});

			expect(result.get("metadata")).toEqual({ key: "value" });
		});

		it("should preserve attachments", () => {
			const result = createPostPropsBuilder({
				attachments: [{ text: "Test" }]
			});

			expect(result.get("attachments")).toHaveLength(1);
		});

		it("should preserve app bindings", () => {
			const result = createPostPropsBuilder({
				app_bindings: [
					{
						app_id: "app1",
						location: AppLocation.EMBEDDED,
						description: "Test",
						bindings: []
					}
				]
			});

			expect(result.get("app_bindings")).toHaveLength(1);
		});
	});
});
