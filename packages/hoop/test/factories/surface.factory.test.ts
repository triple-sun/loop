import { expect } from "@jest/globals";
import { DialogBuilder } from "../../src/builders/dialog/dialog.builder";
import { FormBuilder } from "../../src/builders/form/form.builder";
import { PostBuilder } from "../../src/builders/post/post.builder";
import { HoopFactory } from "../../src/factories/hoop.factory";

describe("factories/surface", () => {
	describe("HoopFactory", () => {
		describe("Dialog", () => {
			it("should create a DialogBuilder instance", () => {
				const dialog = HoopFactory.Dialog();
				expect(dialog).toBeInstanceOf(DialogBuilder);
			});
		});

		describe("Form", () => {
			it("should create a FormBuilder instance", () => {
				const form = HoopFactory.Form();
				expect(form).toBeInstanceOf(FormBuilder);
			});
		});

		describe("Post", () => {
			it("should create a PostBuilder instance", () => {
				const post = HoopFactory.Post();
				expect(post).toBeInstanceOf(PostBuilder);
			});
		});
	});
});
