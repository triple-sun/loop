import { DialogElementType } from "loop-types";
import {
	createDialogElementBuilder,
	DialogElementBuilder
} from "../../../src/builders/dialog/dialog-element.builder";

describe("builders/dialog-element", () => {
	describe("DialogElementBuilder", () => {
		it("should construct and unwrap element", () => {
			const element = {
				type: DialogElementType.TEXT,
				name: "testField",
				display_name: "Test Field",
				placeholder: "Enter text"
			};

			const builder = new DialogElementBuilder(element);
			const result = builder.build();

			expect(result.name).toBe("testField");
			expect(result.display_name).toBe("Test Field");
			expect(Object.isFrozen(result)).toBe(true);
		});
	});

	describe("buildDialogElement", () => {
		it("should create an DialogElementBuilder instance", () => {
			const element = {
				type: DialogElementType.TEXT,
				name: "field",
				display_name: "Field"
			};

			const result = createDialogElementBuilder(element);

			expect(result).toBeInstanceOf(DialogElementBuilder);
		});
	});
});
