import { expect } from "@jest/globals";
import type { AppFormTextField } from "loop-types";
import { AppFormFieldTextSubType, AppFormFieldType } from "loop-types";
import { FormBuilder } from "../../../src/builders/form/form.builder";
import {
	createFormFieldBuilder,
	FormFieldBuilder
} from "../../../src/builders/form/form-field.builder";

describe("builders/form", () => {
	describe("FormFieldBuilder", () => {
		it("should construct and unwrap field", () => {
			const field: AppFormTextField = {
				type: AppFormFieldType.TEXT,
				subtype: AppFormFieldTextSubType.INPUT,
				name: "testField",
				label: "Test Label"
			};

			const builder = new FormFieldBuilder(field);
			const result = builder.build();

			expect(result.name).toBe("testField");
			expect(result.label).toBe("Test Label");
			expect(Object.isFrozen(result)).toBe(true);
		});
	});

	describe("buildFormField", () => {
		it("should create a FormFieldBuilder instance", () => {
			const field: AppFormTextField = {
				type: AppFormFieldType.TEXT,
				subtype: AppFormFieldTextSubType.INPUT,
				name: "field",
				label: "Field"
			};

			const result = createFormFieldBuilder(field);

			expect(result).toBeInstanceOf(FormFieldBuilder);
		});
	});

	describe("FormBuilder", () => {
		it("should construct with empty defaults", () => {
			const builder = new FormBuilder();
			const result = builder.build();

			expect(result.fields).toEqual([]);
		});

		it("should construct with provided fields", () => {
			const fields: AppFormTextField[] = [
				{
					type: AppFormFieldType.TEXT,
					subtype: AppFormFieldTextSubType.INPUT,
					name: "field1",
					label: "Field 1"
				},
				{
					type: AppFormFieldType.TEXT,
					subtype: AppFormFieldTextSubType.INPUT,
					name: "field2",
					label: "Field 2"
				}
			];

			const builder = new FormBuilder({ fields });
			const result = builder.build();

			expect(result.fields).toHaveLength(2);
			expect(result.fields?.[0]?.name).toBe("field1");
		});

		it("should construct with source and submit calls", () => {
			const builder = new FormBuilder({
				source: { path: "/api/source" },
				submit: { path: "/api/submit" }
			});

			const result = builder.build();
			expect(result.source?.path).toBe("/api/source");
			expect(result.submit?.path).toBe("/api/submit");
		});

		it("should return frozen object on unwrap", () => {
			const builder = new FormBuilder();
			const result = builder.build();

			expect(Object.isFrozen(result)).toBe(true);
		});
	});
});
