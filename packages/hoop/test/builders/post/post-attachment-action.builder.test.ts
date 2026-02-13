/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: <jesting> */

import { expect } from "@jest/globals";
import {
	type PostAction,
	PostActionStyle,
	PostActionType,
	SelectDataSource
} from "loop-types";
import {
	ActionBuilder,
	createActionBuilder
} from "../../../src/builders/post/post-attachment-action.builder";

describe("builders/post/post-attachment-action", () => {
	describe("AttachmentActionBuilder", () => {
		describe("constructor", () => {
			it("should construct with button action", () => {
				const action: PostAction = {
					id: "action1",
					name: "Click Me",
					type: PostActionType.BUTTON,
					integration: { url: "/api/action" }
				};

				const builder = new ActionBuilder(action);

				expect(builder.get("id")).toBe("action1");
				expect(builder.get("name")).toBe("Click Me");
				expect(builder.get("type")).toBe(PostActionType.BUTTON);
			});

			it("should construct with select action", () => {
				const action: PostAction = {
					id: "select1",
					name: "Choose Option",
					type: PostActionType.SELECT,
					integration: { url: "/api/select" },
					options: [
						{ text: "Option 1", value: "opt1" },
						{ text: "Option 2", value: "opt2" }
					]
				};

				const builder = new ActionBuilder(action);

				expect(builder.get("id")).toBe("select1");
				expect(builder.get("name")).toBe("Choose Option");
				expect(builder.get("type")).toBe(PostActionType.SELECT);
				expect(builder.get("options")).toHaveLength(2);
			});

			it("should construct with minimal data", () => {
				const action: PostAction = {
					id: "min",
					name: "Minimal",
					type: PostActionType.BUTTON,
					integration: { url: "/api" }
				};

				const builder = new ActionBuilder(action);

				expect(builder.get("id")).toBe("min");
			});

			it("should handle empty object", () => {
				// biome-ignore lint/suspicious/noExplicitAny: <jest>
				const builder = new ActionBuilder({} as any);

				expect(builder.get("id")).toBeUndefined();
				expect(builder.get("name")).toBeUndefined();
			});
		});

		describe("build", () => {
			it("should return frozen action object", () => {
				const action: PostAction = {
					id: "action1",
					name: "Action",
					type: PostActionType.BUTTON,
					integration: { url: "/api" }
				};

				const builder = new ActionBuilder(action);
				const result = builder.build();

				expect(Object.isFrozen(result)).toBe(true);
			});

			it("should preserve all properties in built object", () => {
				const action: PostAction = {
					id: "action1",
					name: "Test Action",
					type: PostActionType.BUTTON,
					integration: {
						url: "/api/test",
						context: { key: "value" }
					},
					style: PostActionStyle.PRIMARY
				};

				const builder = new ActionBuilder(action);
				const result = builder.build();

				expect(result.id).toBe("action1");
				expect(result.name).toBe("Test Action");
				expect(result.type).toBe(PostActionType.BUTTON);

				if (result.type === PostActionType.BUTTON) {
					expect(result.style).toBe(PostActionStyle.PRIMARY);
				}
			});
		});

		describe("get and set", () => {
			it("should get property value", () => {
				const action: PostAction = {
					id: "action1",
					name: "Action",
					type: PostActionType.BUTTON,
					integration: { url: "/api" }
				};

				const builder = new ActionBuilder(action);

				expect(builder.get("name")).toBe("Action");
			});

			it("should set property value", () => {
				const action: PostAction = {
					id: "action1",
					name: "Old Name",
					type: PostActionType.BUTTON,
					integration: { url: "/api" }
				};

				const builder = new ActionBuilder(action);
				builder.set("name", "New Name");

				expect(builder.get("name")).toBe("New Name");
			});

			it("should support method chaining", () => {
				const action: PostAction = {
					id: "action1",
					name: "Action",
					type: PostActionType.BUTTON,
					integration: { url: "/api" }
				};

				const builder = new ActionBuilder(action);
				const result = builder
					.set("name", "Updated")
					.set("style", PostActionStyle.DANGER);

				expect(result).toBe(builder);
				expect(builder.get("name")).toBe("Updated");
				expect(builder.get("style")).toBe("danger");
			});
		});

		describe("mutate", () => {
			it("should mutate property value", () => {
				const action: PostAction = {
					id: "action1",
					name: "Action",
					type: PostActionType.BUTTON,
					integration: { url: "/api" }
				};

				const builder = new ActionBuilder(action);
				builder.mutate("name", old => `${old} Updated`);

				expect(builder.get("name")).toBe("Action Updated");
			});
		});

		describe("edge cases", () => {
			it("should handle button action with all properties", () => {
				const action: PostAction = {
					id: "btn1",
					name: "Submit",
					type: PostActionType.BUTTON,
					integration: {
						url: "/api/submit",
						context: { formId: "form123" }
					},
					style: PostActionStyle.PRIMARY,
					data_source: "users"
					// biome-ignore lint/suspicious/noExplicitAny: <jest>
				} as any;

				const builder = new ActionBuilder(action);
				const result = builder.build();

				expect(result.id).toBe("btn1");
				expect(result.type).toBe(PostActionType.BUTTON);

				if (result.type === PostActionType.BUTTON) {
					expect(result.style).toBe(PostActionStyle.PRIMARY);
				}
			});

			it("should handle select action with data source", () => {
				const action: PostAction = {
					id: "select1",
					name: "Select User",
					type: PostActionType.SELECT,
					integration: { url: "/api/users" },
					data_source: SelectDataSource.USERS
				};

				const builder = new ActionBuilder(action);
				const result = builder.build();

				expect(result.type).toBe(PostActionType.SELECT);

				if (result.type === PostActionType.SELECT) {
					expect(result.data_source).toBe("users");
				}
			});
		});
	});

	describe("createPostActionBuilder", () => {
		it("should create an AttachmentActionBuilder instance", () => {
			const action: PostAction = {
				id: "action1",
				name: "Action",
				type: PostActionType.BUTTON,
				integration: { url: "/api" }
			};

			const result = createActionBuilder(action);

			expect(result).toBeInstanceOf(ActionBuilder);
		});

		it("should preserve action data in builder", () => {
			const action: PostAction = {
				id: "action1",
				name: "Test Action",
				type: PostActionType.BUTTON,
				integration: { url: "/api/test" }
			};

			const result = createActionBuilder(action);

			expect(result.get("id")).toBe("action1");
			expect(result.get("name")).toBe("Test Action");
		});

		it("should handle select action", () => {
			const action: PostAction = {
				id: "select1",
				name: "Select",
				type: PostActionType.SELECT,
				integration: { url: "/api" },
				options: [{ text: "Option", value: "val" }]
			};

			const result = createActionBuilder(action);

			expect(result).toBeInstanceOf(ActionBuilder);
			expect(result.get("type")).toBe(PostActionType.SELECT);
		});
	});
});
