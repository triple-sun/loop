import { expect } from "@jest/globals";
import { type AppFormField, AppFormFieldType } from "loop-types";
import {
	createFormFieldBuilder,
	FormFieldBuilder
} from "../../../src/builders/form/form-field.builder";

describe("builders/form-field", () => {
	describe("FormFieldBuilder", () => {
		it("should construct and unwrap field", () => {
			const field: AppFormField = {
				type: AppFormFieldType.TEXT,
				name: "testField",
				label: "Test Field",
				hint: "Enter text"
			};

			const builder = new FormFieldBuilder(field);
			const result = builder.build();

			expect(result.name).toBe("testField");
			expect(result.label).toBe("Test Field");
			expect(result.hint).toBe("Enter text");
			expect(Object.isFrozen(result)).toBe(true);
		});
	});

	describe("createFormFieldBuilder", () => {
		it("should create an FormFieldBuilder instance", () => {
			const field: AppFormField = {
				type: AppFormFieldType.TEXT,
				name: "field",
				label: "Field"
			};

			const result = createFormFieldBuilder(field);

			expect(result).toBeInstanceOf(FormFieldBuilder);
			expect(result.build()).toEqual(field);
		});
	});
});
