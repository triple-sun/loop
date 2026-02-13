/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: <jest> */

import { expect } from "@jest/globals";
import { PostActionStyle, PostActionType, SelectDataSource } from "loop-types";
import { ActionBuilder } from "../../src/builders/post/post-attachment-action.builder";
import { ActionFactory } from "../../src/factories/actions.factory";

describe("factories/action", () => {
	describe("ActionFactory", () => {
		describe("Button", () => {
			it("should create a button action builder", () => {
				const button = ActionFactory.Button({
					id: "btn1",
					name: "Click Me",
					integration: { url: "/api/action" }
				});

				expect(button).toBeInstanceOf(ActionBuilder);
				expect(button.get("type")).toBe(PostActionType.BUTTON);
				expect(button.get("id")).toBe("btn1");
				expect(button.get("name")).toBe("Click Me");
			});

			it("should handle button with all properties", () => {
				const button = ActionFactory.Button({
					id: "btn",
					name: "Submit",
					integration: {
						url: "/submit",
						context: { key: "value" }
					},
					style: PostActionStyle.PRIMARY
				});

				expect(button.get("style")).toBe(PostActionStyle.PRIMARY);
				expect(button.get("integration")?.context).toEqual({ key: "value" });
			});

			it("should work with generic context type", () => {
				interface CustomContext {
					userId: number;
					action: string;
				}

				const button = ActionFactory.Button<CustomContext>({
					id: "custom",
					name: "Custom Action",
					integration: {
						url: "/custom",
						context: {
							userId: 123,
							action: "submit"
						}
					}
				});

				const context = button.get("integration")?.context;
				expect(context?.userId).toBe(123);
				expect(context?.action).toBe("submit");
			});
		});

		describe("Select.Static", () => {
			it("should create a static select action", () => {
				const select = ActionFactory.Select.Static({
					id: "select1",
					name: "Choose Option",
					integration: { url: "/select" },
					options: [
						{ text: "Option 1", value: "opt1" },
						{ text: "Option 2", value: "opt2" }
					]
				});

				expect(select).toBeInstanceOf(ActionBuilder);
				expect(select.get("type")).toBe(PostActionType.SELECT);
				expect(select.get("data_source")).toBeUndefined();
				expect(select.get("options")).toHaveLength(2);
			});

			it("should handle empty options array", () => {
				const select = ActionFactory.Select.Static({
					id: "empty",
					name: "Empty Select",
					integration: { url: "/api" },
					options: []
				});

				expect(select.get("options")).toEqual([]);
			});

			it("should omit data_source for static select", () => {
				const select = ActionFactory.Select.Static({
					id: "static",
					name: "Static",
					integration: { url: "/api" },
					options: [{ text: "Item", value: "1" }]
				});

				expect(select.get("data_source")).toBeUndefined();
			});
		});

		describe("Select.Channels", () => {
			it("should create a channel picker select action", () => {
				const select = ActionFactory.Select.Channels({
					id: "channel_select",
					name: "Choose Channel",
					integration: { url: "/channel" }
				});

				expect(select).toBeInstanceOf(ActionBuilder);
				expect(select.get("type")).toBe(PostActionType.SELECT);
				expect(select.get("data_source")).toBe(SelectDataSource.CHANNELS);
				expect(select.get("options")).toEqual([]);
			});

			it("should automatically set CHANNELS data_source", () => {
				const select = ActionFactory.Select.Channels({
					id: "ch",
					name: "Channel",
					integration: { url: "/api" }
				});

				expect(select.get("data_source")).toBe(SelectDataSource.CHANNELS);
			});

			it("should have empty options array for dynamic select", () => {
				const select = ActionFactory.Select.Channels({
					id: "ch",
					name: "Channel",
					integration: { url: "/api" }
				});

				expect(select.get("options")).toEqual([]);
			});
		});

		describe("Select.Users", () => {
			it("should create a user picker select action", () => {
				const select = ActionFactory.Select.Users({
					id: "user_select",
					name: "Choose User",
					integration: { url: "/user" }
				});

				expect(select).toBeInstanceOf(ActionBuilder);
				expect(select.get("type")).toBe(PostActionType.SELECT);
				expect(select.get("data_source")).toBe(SelectDataSource.USERS);
				expect(select.get("options")).toEqual([]);
			});

			it("should automatically set USERS data_source", () => {
				const select = ActionFactory.Select.Users({
					id: "usr",
					name: "User",
					integration: { url: "/api" }
				});

				expect(select.get("data_source")).toBe(SelectDataSource.USERS);
			});

			it("should have empty options array for dynamic select", () => {
				const select = ActionFactory.Select.Users({
					id: "usr",
					name: "User",
					integration: { url: "/api" }
				});

				expect(select.get("options")).toEqual([]);
			});
		});
	});
});
