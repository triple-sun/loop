import { expect } from "@jest/globals";
import { OptionBuilder } from "../../src/builders/common/option.builder";

describe("builders/option", () => {
	describe("OptionBuilder", () => {
		describe("constructor", () => {
			it("should create option with value only", () => {
				const option = new OptionBuilder({ value: "test_value" });

				expect(option.get("value")).toBe("test_value");
				// Should auto-fill text and label from value
				expect(option.get("text")).toBe("test_value");
				expect(option.get("label")).toBe("test_value");
			});

			it("should create option with all properties", () => {
				const option = new OptionBuilder({
					value: "val",
					text: "Display Text",
					label: "Label Text",
					icon_data: "icon_url"
				});

				expect(option.get("value")).toBe("val");
				expect(option.get("text")).toBe("Display Text");
				expect(option.get("label")).toBe("Label Text");
				expect(option.get("icon_data")).toBe("icon_url");
			});

			it("should prioritize text over label when both provided", () => {
				const option = new OptionBuilder({
					value: "val",
					text: "Text",
					label: "Label"
				});

				expect(option.get("text")).toBe("Text");
				expect(option.get("label")).toBe("Label");
			});

			it("should fall back to label for text if text not provided", () => {
				const option = new OptionBuilder({
					value: "val",
					label: "Label Only"
				});

				expect(option.get("text")).toBe("Label Only");
				expect(option.get("label")).toBe("Label Only");
			});

			it("should fall back to text for label if label not provided", () => {
				const option = new OptionBuilder({
					value: "val",
					text: "Text Only"
				});

				expect(option.get("text")).toBe("Text Only");
				expect(option.get("label")).toBe("Text Only");
			});

			it("should use value for both text and label if neither provided", () => {
				const option = new OptionBuilder({
					value: "fallback_value"
				});

				expect(option.get("text")).toBe("fallback_value");
				expect(option.get("label")).toBe("fallback_value");
			});
		});

		describe("build", () => {
			it("should build a frozen option object", () => {
				const option = new OptionBuilder({
					value: "test",
					text: "Test Option"
				});

				const built = option.build();

				expect(built.value).toBe("test");
				expect(built.text).toBe("Test Option");
				expect(Object.isFrozen(built)).toBe(true);
			});
		});

		describe("set", () => {
			it("should update option properties", () => {
				const option = new OptionBuilder({ value: "initial" });

				option.set("text", "Updated Text");
				option.set("icon_data", "new_icon");

				expect(option.get("text")).toBe("Updated Text");
				expect(option.get("icon_data")).toBe("new_icon");
			});
		});
	});
});
