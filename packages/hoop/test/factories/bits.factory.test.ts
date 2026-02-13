import { expect } from "@jest/globals";
import { OptionBuilder } from "../../src/builders/common/option.builder";
import { FieldBuilder } from "../../src/builders/post/post-attachment-field.builder";
import { BitsFactory } from "../../src/factories/bits.factory";

describe("factories/bit", () => {
	describe("BitsFactory", () => {
		describe("Field", () => {
			it("should create an FieldBuilder instance", () => {
				const field = BitsFactory.Field({ title: "Test", value: "Value" });

				expect(field).toBeInstanceOf(FieldBuilder);
				expect(field.get("title")).toBe("Test");
				expect(field.get("value")).toBe("Value");
			});

			it("should handle minimal field data", () => {
				const field = BitsFactory.Field({
					title: "Title",
					value: "Value only"
				});

				expect(field).toBeInstanceOf(FieldBuilder);
				expect(field.get("value")).toBe("Value only");
			});

			it("should handle all field properties", () => {
				const field = BitsFactory.Field({
					title: "Title",
					value: "Value",
					short: false
				});

				expect(field.get("title")).toBe("Title");
				expect(field.get("value")).toBe("Value");
				expect(field.get("short")).toBe(false);
			});
		});

		describe("Option", () => {
			it("should create an OptionBuilder instance", () => {
				const option = BitsFactory.Option({
					text: "Option Text",
					value: "option_value"
				});

				expect(option).toBeInstanceOf(OptionBuilder);
				expect(option.get("text")).toBe("Option Text");
				expect(option.get("value")).toBe("option_value");
			});

			it("should handle option with icon", () => {
				const option = BitsFactory.Option({
					text: "Option",
					value: "val",
					icon_data: "icon_url"
				});

				expect(option.get("icon_data")).toBe("icon_url");
			});

			it("should handle value-only option", () => {
				const option = BitsFactory.Option({ value: "simple" });

				expect(option.get("value")).toBe("simple");
			});
		});
	});
});
