/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: <jest> */

import { expect } from "@jest/globals";
import { DialogElementType, DialogTextSubType } from "loop-types";
import { DialogBuilder } from "../../../src/builders/dialog/dialog.builder";
import { DialogElementFactory } from "../../../src/factories/dialog-elements.factory";

describe("builders/dialog", () => {
	describe("DialogBuilder", () => {
		describe("constructor", () => {
			it("should create dialog with basic properties", () => {
				const dialog = new DialogBuilder({
					title: "Test Dialog",
					introduction_text: "Enter information",
					elements: []
				});

				expect(dialog.get("title")).toBe("Test Dialog");
				expect(dialog.get("introduction_text")).toBe("Enter information");
			});

			it("should set default submit_label if not provided", () => {
				const dialog = new DialogBuilder({
					title: "Dialog",
					introduction_text: "Info",
					elements: []
				});

				expect(dialog.get("submit_label")).toBe("Отправить");
			});

			it("should preserve custom submit_label", () => {
				const dialog = new DialogBuilder({
					title: "Dialog",
					introduction_text: "Info",
					submit_label: "Submit",
					elements: []
				});

				expect(dialog.get("submit_label")).toBe("Submit");
			});

			it("should convert element objects to builders", () => {
				const dialog = new DialogBuilder({
					title: "Dialog",
					introduction_text: "Info",
					elements: [
						{
							type: DialogElementType.TEXT,
							name: "field1",
							display_name: "Field 1",
							subtype: DialogTextSubType.TEXT
						}
					]
				});

				const elements = dialog.get("elements");
				expect(elements).toHaveLength(1);
				expect(elements[0]?.get("name")).toBe("field1");
			});

			it("should handle all optional properties", () => {
				const dialog = new DialogBuilder({
					title: "Complete Dialog",
					introduction_text: "Intro",
					icon_url: "https://example.com/icon.png",
					submit_label: "Save",
					notify_on_cancel: true,
					state: JSON.stringify({ key: "value" }),
					elements: []
				});

				expect(dialog.get("icon_url")).toBe("https://example.com/icon.png");
				expect(dialog.get("notify_on_cancel")).toBe(true);
				expect(dialog.get("state")).toBe('{"key":"value"}');
			});
		});

		describe("state.set", () => {
			it("should set dialog state as JSON string", () => {
				const dialog = new DialogBuilder({
					title: "Test",
					introduction_text: "Info",
					elements: []
				});

				dialog.state.set({ userId: 123, action: "create" });

				const state = JSON.parse(dialog.get("state") || "{}");
				expect(state.userId).toBe(123);
				expect(state.action).toBe("create");
			});

			it("should return this for chaining", () => {
				const dialog = new DialogBuilder({
					title: "Test",
					introduction_text: "Info",
					elements: []
				});

				const result = dialog.state.set({ test: true });

				expect(result).toBe(dialog);
			});
		});

		describe("state.add", () => {
			it("should merge new state with existing state", () => {
				const dialog = new DialogBuilder({
					title: "Test",
					introduction_text: "Info",
					state: JSON.stringify({ existing: "value" }),
					elements: []
				});

				dialog.state.add({ new: "data" });

				const state = JSON.parse(dialog.get("state") || "{}");
				expect(state.existing).toBe("value");
				expect(state.new).toBe("data");
			});

			it("should handle empty initial state", () => {
				const dialog = new DialogBuilder({
					title: "Test",
					introduction_text: "Info",
					elements: []
				});

				dialog.state.add({ first: "value" });

				const state = JSON.parse(dialog.get("state") || "{}");
				expect(state.first).toBe("value");
			});

			it("should throw error on invalid JSON state", () => {
				const dialog = new DialogBuilder({
					title: "Test",
					introduction_text: "Info",
					state: "invalid json {",
					elements: []
				});

				expect(() => {
					dialog.state.add({ test: true });
				}).toThrow("Failed to parse dialog state");
			});

			it("should return this for chaining", () => {
				const dialog = new DialogBuilder({
					title: "Test",
					introduction_text: "Info",
					elements: []
				});

				const result = dialog.state.add({ test: true });

				expect(result).toBe(dialog);
			});
		});

		describe("build", () => {
			it("should build frozen dialog with built elements", () => {
				const dialog = new DialogBuilder({
					title: "Test Dialog",
					introduction_text: "Info",
					elements: []
				});

				dialog.set("elements", [
					DialogElementFactory.Text({
						name: "field",
						display_name: "Field",
						subtype: DialogTextSubType.TEXT
					})
				]);

				const built = dialog.build();

				expect(Object.isFrozen(built)).toBe(true);
				expect(built.elements).toHaveLength(1);
				expect(built.elements?.[0]?.name).toBe("field");
			});

			it("should preserve all dialog properties in build", () => {
				const dialog = new DialogBuilder({
					title: "Complete",
					introduction_text: "Intro",
					icon_url: "icon",
					submit_label: "Go",
					notify_on_cancel: false,
					elements: []
				});

				const built = dialog.build();

				expect(built.title).toBe("Complete");
				expect(built.introduction_text).toBe("Intro");
				expect(built.icon_url).toBe("icon");
				expect(built.submit_label).toBe("Go");
				expect(built.notify_on_cancel).toBe(false);
			});
		});

		describe("chaining", () => {
			it("should support method chaining", () => {
				const dialog = new DialogBuilder({
					title: "Initial",
					introduction_text: "Info",
					elements: []
				});

				dialog
					.set("title", "Updated")
					.state.set({ step: 1 })
					.state.add({ user: "test" });

				expect(dialog.get("title")).toBe("Updated");
				const state = JSON.parse(dialog.get("state") || "{}");
				expect(state.step).toBe(1);
				expect(state.user).toBe("test");
			});
		});
	});
});
