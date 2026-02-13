import { expect } from "@jest/globals";
import { DialogElementType, DialogTextSubType } from "loop-types";
import { DialogElementBuilder } from "../../src/builders/dialog/dialog-element.builder";
import { DialogElementFactory } from "../../src/factories/dialog-elements.factory";

describe("factories/dialog-element", () => {
	describe("DialogElementFactory", () => {
		describe("Text", () => {
			it("should create a text dialog element", () => {
				const element = DialogElementFactory.Text({
					name: "name",
					display_name: "Name",
					subtype: DialogTextSubType.TEXT
				});

				expect(element).toBeInstanceOf(DialogElementBuilder);
				expect(element.get("type")).toBe(DialogElementType.TEXT);
				expect(element.get("name")).toBe("name");
				expect(element.get("subtype")).toBe(DialogTextSubType.TEXT);
			});

			it("should handle optional fields", () => {
				const element = DialogElementFactory.Text({
					name: "field",
					display_name: "Field",
					subtype: DialogTextSubType.EMAIL,
					placeholder: "Enter email",
					optional: true
				});

				expect(element.get("placeholder")).toBe("Enter email");
				expect(element.get("optional")).toBe(true);
			});
		});

		describe("TextArea", () => {
			it("should create a textarea dialog element", () => {
				const element = DialogElementFactory.TextArea({
					name: "description",
					display_name: "Description"
				});

				expect(element).toBeInstanceOf(DialogElementBuilder);
				expect(element.get("type")).toBe(DialogElementType.TEXT_AREA);
			});

			it("should handle max_length and min_length", () => {
				const element = DialogElementFactory.TextArea({
					name: "comment",
					display_name: "Comment",
					max_length: 500,
					min_length: 10
				});

				expect(element.get("max_length")).toBe(500);
				expect(element.get("min_length")).toBe(10);
			});
		});

		describe("Select", () => {
			it("should create a select dialog element", () => {
				const element = DialogElementFactory.Select.Static({
					name: "choice",
					display_name: "Choice",
					options: [
						{ text: "Option 1", value: "1" },
						{ text: "Option 2", value: "2" }
					]
				});

				expect(element).toBeInstanceOf(DialogElementBuilder);
				expect(element.get("type")).toBe(DialogElementType.SELECT);
				expect(element.get("options")).toHaveLength(2);
			});

			it("should handle empty options", () => {
				const element = DialogElementFactory.Select.Static({
					name: "empty",
					display_name: "Empty",
					options: []
				});

				if (element.get("type") === DialogElementType.SELECT) {
					expect(element.get("options")).toEqual([]);
				}
			});

			it("should create channels select element", () => {
				const element = DialogElementFactory.Select.Channels({
					name: "channel",
					display_name: "Select Channel"
				});

				expect(element).toBeInstanceOf(DialogElementBuilder);
				expect(element.get("type")).toBe(DialogElementType.SELECT);
			});

			it("should create users select element", () => {
				const element = DialogElementFactory.Select.Users({
					name: "user",
					display_name: "Select User"
				});

				expect(element).toBeInstanceOf(DialogElementBuilder);
				expect(element.get("type")).toBe(DialogElementType.SELECT);
			});
		});

		describe("Checkbox", () => {
			it("should create a checkbox dialog element", () => {
				const element = DialogElementFactory.Checkbox({
					name: "agree",
					display_name: "I Agree"
				});

				expect(element).toBeInstanceOf(DialogElementBuilder);
				expect(element.get("type")).toBe(DialogElementType.CHECKBOX);
			});
		});

		describe("Radio", () => {
			it("should create a radio dialog element", () => {
				const element = DialogElementFactory.Radio({
					name: "gender",
					display_name: "Gender"
				});

				expect(element).toBeInstanceOf(DialogElementBuilder);
				expect(element.get("type")).toBe(DialogElementType.RADIO);
			});
		});
	});
});
