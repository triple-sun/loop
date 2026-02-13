/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: <jest> */

import { expect } from "@jest/globals";
import { PostActionStyle, PostActionType } from "loop-types";
import {
	AttachmentBuilder,
	createAttachmentBuilder
} from "../../../src/builders/post/post-attachment.builder";
import {
	ActionBuilder,
	createActionBuilder
} from "../../../src/builders/post/post-attachment-action.builder";
import {
	createFieldBuilder,
	FieldBuilder
} from "../../../src/builders/post/post-attachment-field.builder";

describe("builders/post/attachment", () => {
	describe("AttachmentFieldBuilder", () => {
		it("should construct with default values", () => {
			const builder = new FieldBuilder();
			const result = builder.build();

			expect(result.short).toBe(true);
			expect(result.title).toBe("");
			expect(result.value).toBe("");
		});

		it("should construct with provided values", () => {
			const builder = new FieldBuilder({
				short: false,
				title: "Test Title",
				value: "Test Value"
			});

			expect(builder.get("title")).toBe("Test Title");
			expect(builder.get("value")).toBe("Test Value");
			expect(builder.get("short")).toBe(false);
		});

		it("should toString with title and value", () => {
			const builder = new FieldBuilder({
				title: "Status",
				value: "Active"
			});

			expect(builder.toString()).toBe("[Status]:\nActive");
		});

		it("should toString without title", () => {
			const builder = new FieldBuilder({
				value: "Standalone value"
			});

			expect(builder.toString()).toBe("\nStandalone value");
		});

		it("should toString with empty value", () => {
			const builder = new FieldBuilder({
				title: "Empty"
			});

			expect(builder.toString()).toBe("[Empty]:\n");
		});

		it("should return frozen object on build", () => {
			const builder = new FieldBuilder();
			const result = builder.build();

			expect(Object.isFrozen(result)).toBe(true);
		});
	});

	describe("buildAttachmentField", () => {
		it("should create a AttachmentFieldBuilder instance", () => {
			const result = createFieldBuilder({ title: "t", value: "v" });

			expect(result).toBeInstanceOf(FieldBuilder);
		});
	});

	describe("AttachmentActionBuilder", () => {
		it("should construct and build action", () => {
			const action = {
				id: "action1",
				name: "Test Action",
				type: PostActionType.BUTTON,
				integration: { url: "/api/action" }
			};

			const builder = new ActionBuilder(action);
			const result = builder.build();

			expect(result.id).toBe("action1");
			expect(result.name).toBe("Test Action");
			expect(Object.isFrozen(result)).toBe(true);
		});
	});

	describe("wrapAction", () => {
		it("should create an AttachmentActionBuilder instance", () => {
			const result = createActionBuilder({
				id: "a",
				name: "Action",
				type: PostActionType.BUTTON,
				integration: { url: "/api/action" }
			});

			expect(result).toBeInstanceOf(ActionBuilder);
		});
	});

	describe("AttachmentBuilder", () => {
		describe("constructor", () => {
			it("should construct with default values", () => {
				const builder = new AttachmentBuilder();
				const result = builder.build();

				expect(result.fallback).toBeDefined();
				expect(result.text).toBe("");
				expect(result.title).toBe("");
				expect(result.actions).toEqual([]);
				expect(result.fields).toEqual([]);
				expect(result.author_name).toBe("");
				expect(result.author_icon).toBe("");
				expect(result.author_link).toBe("");
				expect(result.color).toBe("");
				expect(result.title_link).toBe("");
				expect(result.pretext).toBe("");
				expect(result.image_url).toBe("");
				expect(result.thumb_url).toBe("");
				expect(result.footer).toBe("");
				expect(result.footer_icon).toBe("");
				expect(result.ts).toBe(0);
			});

			it("should construct with provided values", () => {
				const builder = new AttachmentBuilder({
					title: "Test Title",
					text: "Test Text",
					color: "#FF0000"
				});

				expect(builder.get("title")).toBe("Test Title");
				expect(builder.get("text")).toBe("Test Text");
				expect(builder.get("color")).toBe("#FF0000");
			});

			it("should construct with all author properties", () => {
				const builder = new AttachmentBuilder({
					author_name: "John Doe",
					author_icon: "https://example.com/icon.png",
					author_link: "https://example.com/author"
				});

				expect(builder.get("author_name")).toBe("John Doe");
				expect(builder.get("author_icon")).toBe("https://example.com/icon.png");
				expect(builder.get("author_link")).toBe("https://example.com/author");
			});

			it("should construct with footer properties", () => {
				const builder = new AttachmentBuilder({
					footer: "Footer text",
					footer_icon: "https://example.com/footer.png"
				});

				expect(builder.get("footer")).toBe("Footer text");
				expect(builder.get("footer_icon")).toBe(
					"https://example.com/footer.png"
				);
			});

			it("should construct with image URLs", () => {
				const builder = new AttachmentBuilder({
					image_url: "https://example.com/image.jpg",
					thumb_url: "https://example.com/thumb.jpg"
				});

				expect(builder.get("image_url")).toBe("https://example.com/image.jpg");
				expect(builder.get("thumb_url")).toBe("https://example.com/thumb.jpg");
			});

			it("should construct with actions", () => {
				const builder = new AttachmentBuilder({
					actions: [
						{
							id: "action1",
							name: "Action 1",
							type: PostActionType.BUTTON,
							integration: { url: "/api" }
						}
					]
				});

				expect(builder.get("actions")).toHaveLength(1);
			});

			it("should construct with fields", () => {
				const builder = new AttachmentBuilder({
					fields: [
						{ title: "Field 1", value: "Value 1" },
						{ title: "Field 2", value: "Value 2" }
					]
				});

				expect(builder.get("fields")).toHaveLength(2);
			});

			it("should auto-generate fallback from content", () => {
				const builder = new AttachmentBuilder({
					title: "My Title",
					text: "My Text"
				});

				const fallback = builder.get("fallback");
				expect(fallback).toContain("My Title");
				expect(fallback).toContain("My Text");
			});

			it("should use provided fallback if given", () => {
				const builder = new AttachmentBuilder({
					fallback: "Custom fallback",
					title: "Title",
					text: "Text"
				});

				expect(builder.get("fallback")).toBe("Custom fallback");
			});

			it("should generate fallback with author name", () => {
				const builder = new AttachmentBuilder({
					author_name: "Author",
					text: "Content"
				});

				const fallback = builder.get("fallback");
				expect(fallback).toContain("Author");
			});

			it("should generate fallback with pretext", () => {
				const builder = new AttachmentBuilder({
					pretext: "Pretext content",
					text: "Main text"
				});

				const fallback = builder.get("fallback");
				expect(fallback).toContain("Pretext content");
			});

			it("should include fields in fallback", () => {
				const builder = new AttachmentBuilder({
					text: "Text",
					fields: [{ title: "Status", value: "Active" }]
				});

				const fallback = builder.get("fallback");
				expect(fallback).toContain("Status");
				expect(fallback).toContain("Active");
			});

			it("should include action names in fallback", () => {
				const builder = new AttachmentBuilder({
					text: "Text",
					actions: [
						{
							id: "action1",
							name: "Click Me",
							type: PostActionType.BUTTON,
							integration: { url: "/api" }
						},
						{
							id: "action2",
							name: "Submit",
							type: PostActionType.BUTTON,
							integration: { url: "/api2" }
						}
					]
				});

				const fallback = builder.get("fallback");
				expect(fallback).toContain("Click Me");
				expect(fallback).toContain("Submit");
			});

			it("should handle markdown in fallback", () => {
				const builder = new AttachmentBuilder({
					text: "**Bold** and *italic* and [link](https://example.com)"
				});

				const fallback = builder.get("fallback");
				// The removeMd library should strip markdown
				expect(fallback).not.toContain("**");
				expect(fallback).not.toContain("*");
			});
		});

		describe("build", () => {
			it("should return frozen object on build", () => {
				const builder = new AttachmentBuilder();
				const result = builder.build();

				expect(Object.isFrozen(result)).toBe(true);
			});
		});

		describe("get and set", () => {
			it("should get property value", () => {
				const builder = new AttachmentBuilder({ text: "Test" });

				expect(builder.get("text")).toBe("Test");
			});

			it("should set property value", () => {
				const builder = new AttachmentBuilder();
				builder.set("text", "New Text");

				expect(builder.get("text")).toBe("New Text");
			});

			it("should update color", () => {
				const builder = new AttachmentBuilder();
				builder.set("color", "#00FF00");

				expect(builder.get("color")).toBe("#00FF00");
			});
		});

		describe("array operations", () => {
			it("should append actions", () => {
				const builder = new AttachmentBuilder();
				builder.append(
					"actions",
					createActionBuilder({
						id: "action1",
						name: "Action",
						type: PostActionType.BUTTON,
						integration: { url: "/api" }
					})
				);

				expect(builder.get("actions")).toHaveLength(1);
			});
		});

		describe("edge cases", () => {
			it("should handle empty attachment", () => {
				const builder = new AttachmentBuilder({});
				const result = builder.build();

				expect(result).toBeDefined();
				expect(result.fallback).toBeDefined();
			});

			it("should handle attachment with only color", () => {
				const builder = new AttachmentBuilder({ color: "#FF0000" });

				expect(builder.get("color")).toBe("#FF0000");
			});

			it("should handle complex nested structure", () => {
				const builder = new AttachmentBuilder({
					title: "Complex Attachment",
					text: "With multiple elements",
					author_name: "Author",
					fields: [
						{ title: "Field 1", value: "Value 1" },
						{ title: "Field 2", value: "Value 2", short: false }
					],
					actions: [
						{
							id: "action1",
							name: "Primary",
							type: PostActionType.BUTTON,
							integration: { url: "/api" },
							style: PostActionStyle.PRIMARY
						},
						{
							id: "action2∑",
							name: "Secondary",
							type: PostActionType.BUTTON,
							integration: { url: "/api2" },
							style: PostActionStyle.DEFAULT
						}
					],
					color: "#0066CC",
					footer: "Footer"
				});

				const result = builder.build();
				expect(result.title).toBe("Complex Attachment");
				expect(result.fields).toHaveLength(2);
				expect(result.actions).toHaveLength(2);
			});
		});
	});

	describe("buildAttachment", () => {
		it("should create an AttachmentBuilder instance", () => {
			const result = createAttachmentBuilder({ text: "test" });

			expect(result).toBeInstanceOf(AttachmentBuilder);
		});

		it("should preserve attachment data", () => {
			const result = createAttachmentBuilder({
				text: "test",
				color: "#FF0000"
			});

			expect(result.get("text")).toBe("test");
			expect(result.get("color")).toBe("#FF0000");
		});
	});
});
