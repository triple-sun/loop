import { expect } from "@jest/globals";
import { AppFormFieldTextSubType, AppFormFieldType } from "loop-types";
import { FormFieldBuilder } from "../../src/builders/form/form-field.builder";
import { FormFieldFactory } from "../../src/factories/form-fields.factory";

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: <jest>
describe("factories/form-field", () => {
	// biome-ignore lint/complexity/noExcessiveLinesPerFunction: <jest>
	describe("FormFieldFactory", () => {
		describe("Checkbox", () => {
			it("should create a boolean form field", () => {
				const field = FormFieldFactory.Checkbox({
					name: "accept_terms",
					modal_label: "Accept Terms",
					value: false
				});

				expect(field).toBeInstanceOf(FormFieldBuilder);
				expect(field.get("type")).toBe(AppFormFieldType.BOOLEAN);
				expect(field.get("name")).toBe("accept_terms");
			});
		});

		describe("Markdown", () => {
			it("should create a markdown form field", () => {
				const field = FormFieldFactory.Markdown({
					name: "info",
					modal_label: "Information",
					description: "## Heading\nSome **bold** text"
				});

				expect(field).toBeInstanceOf(FormFieldBuilder);
				expect(field.get("type")).toBe(AppFormFieldType.MARKDOWN);
				expect(field.get("description")).toContain("## Heading");
			});
		});

		describe("Divider", () => {
			it("should create a markdown divider field", () => {
				const field = FormFieldFactory.Divider("divider1");

				expect(field).toBeInstanceOf(FormFieldBuilder);
				expect(field.get("type")).toBe(AppFormFieldType.MARKDOWN);
				expect(field.get("description")).toBe("\n\n---\n\n");
			});
		});

		describe("Select.Static", () => {
			it("should create a static select field", () => {
				const field = FormFieldFactory.Select.Static({
					name: "choice",
					modal_label: "Select Option",
					options: [
						{ label: "Option 1", value: "opt1" },
						{ label: "Option 2", value: "opt2" }
					]
				});

				expect(field).toBeInstanceOf(FormFieldBuilder);
				expect(field.get("type")).toBe(AppFormFieldType.STATIC_SELECT);
				expect(field.get("options")).toHaveLength(2);
			});
		});

		describe("Select.Users", () => {
			it("should create a user select field", () => {
				const field = FormFieldFactory.Select.Users({
					name: "user_id",
					modal_label: "Choose User"
				});

				expect(field).toBeInstanceOf(FormFieldBuilder);
				expect(field.get("type")).toBe(AppFormFieldType.USER);
			});
		});

		describe("Select.Channels", () => {
			it("should create a channel select field", () => {
				const field = FormFieldFactory.Select.Channels({
					name: "channel_id",
					modal_label: "Choose Channel"
				});

				expect(field).toBeInstanceOf(FormFieldBuilder);
				expect(field.get("type")).toBe(AppFormFieldType.CHANNEL);
			});
		});

		describe("Select.Dynamic", () => {
			it("should create a dynamic select field", () => {
				const field = FormFieldFactory.Select.Dynamic({
					name: "dynamic",
					modal_label: "Dynamic Select",
					lookup: { path: "/api/lookup" }
				});

				expect(field).toBeInstanceOf(FormFieldBuilder);
				expect(field.get("type")).toBe(AppFormFieldType.DYNAMIC_SELECT);
			});
		});

		describe("Text.Input", () => {
			it("should create a text input field", () => {
				const field = FormFieldFactory.Text.Input({
					name: "username",
					modal_label: "Username"
				});

				expect(field).toBeInstanceOf(FormFieldBuilder);
				expect(field.get("type")).toBe(AppFormFieldType.TEXT);
				expect(field.get("subtype")).toBe(AppFormFieldTextSubType.INPUT);
			});
		});

		describe("Text.TextArea", () => {
			it("should create a textarea field", () => {
				const field = FormFieldFactory.Text.TextArea({
					name: "description",
					modal_label: "Description"
				});

				expect(field).toBeInstanceOf(FormFieldBuilder);
				expect(field.get("subtype")).toBe(AppFormFieldTextSubType.TEXT_AREA);
			});
		});

		describe("Text.Email", () => {
			it("should create an email field", () => {
				const field = FormFieldFactory.Text.Email({
					name: "email",
					modal_label: "Email Address"
				});

				expect(field).toBeInstanceOf(FormFieldBuilder);
				expect(field.get("subtype")).toBe(AppFormFieldTextSubType.EMAIL);
			});
		});

		describe("Text.Number", () => {
			it("should create a number field", () => {
				const field = FormFieldFactory.Text.Number({
					name: "age",
					modal_label: "Age"
				});

				expect(field).toBeInstanceOf(FormFieldBuilder);
				expect(field.get("subtype")).toBe(AppFormFieldTextSubType.NUMBER);
			});
		});

		describe("Text.Password", () => {
			it("should create a password field", () => {
				const field = FormFieldFactory.Text.Password({
					name: "password",
					modal_label: "Password"
				});

				expect(field).toBeInstanceOf(FormFieldBuilder);
				expect(field.get("subtype")).toBe(AppFormFieldTextSubType.PASSWORD);
			});
		});

		describe("Text.Telephone", () => {
			it("should create a telephone field", () => {
				const field = FormFieldFactory.Text.Telephone({
					name: "phone",
					modal_label: "Phone Number"
				});

				expect(field).toBeInstanceOf(FormFieldBuilder);
				expect(field.get("subtype")).toBe(AppFormFieldTextSubType.TELEPHONE);
			});
		});

		describe("Text.Url", () => {
			it("should create a URL field", () => {
				const field = FormFieldFactory.Text.Url({
					name: "website",
					modal_label: "Website"
				});

				expect(field).toBeInstanceOf(FormFieldBuilder);
				expect(field.get("subtype")).toBe(AppFormFieldTextSubType.URL);
			});
		});
	});
});
