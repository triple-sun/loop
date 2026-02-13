/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: <jest tests are long> */

import { expect } from "@jest/globals";
import { AppLocation } from "loop-types";
import { createExpandBuilder } from "../../src/builders";
import { AppBindingBuilder } from "../../src/builders/app/app-binding.builder";
import { BindingFactory } from "../../src/factories/bindings.factory";

describe("factories/binding", () => {
	describe("BindingFactory", () => {
		describe("Create", () => {
			it("should create a basic binding", () => {
				const binding = BindingFactory.Basic({
					app_id: "app1",
					location: "/command",
					label: "Command"
				});

				expect(binding).toBeInstanceOf(AppBindingBuilder);
				expect(binding.get("app_id")).toBe("app1");
				expect(binding.get("location")).toBe("/command");
			});

			it("should handle bindings with submit", () => {
				const binding = BindingFactory.Basic({
					app_id: "app1",
					location: AppLocation.COMMAND,
					label: "Action",
					submit: {
						path: "/submit",
						expand: {}
					}
				});

				expect(binding.get("submit")?.get("path")).toBe("/submit");
				expect(binding.get("submit")?.get("expand")).toEqual(
					createExpandBuilder()
				);
			});

			it("should preserve form when provided", () => {
				const binding = BindingFactory.Basic({
					app_id: "app1",
					location: AppLocation.COMMAND,
					label: "Form Action",
					form: {
						title: "Test Form",
						icon: "form-icon.png",
						fields: []
					}
				});

				expect(binding.get("form")?.get("title")).toBe("Test Form");
				expect(binding.get("form")?.get("icon")).toBe("form-icon.png");
				expect(binding.get("form")?.get("fields")).toEqual([]);
			});

			it("should handle bindings array", () => {
				const binding = BindingFactory.Basic({
					app_id: "app1",
					location: AppLocation.COMMAND,
					label: "Parent",
					bindings: [
						{
							app_id: "app1",
							location: "/child",
							label: "Child"
						}
					]
				});

				const bindings = binding.get("bindings");
				expect(bindings).toHaveLength(1);
				expect(bindings[0]?.get("location")).toBe("/child");
				expect(bindings[0]?.get("label")).toBe("Child");
			});
		});

		describe("Embed.Button", () => {
			it("should create an embed button binding", () => {
				const button = BindingFactory.Embed.Button({
					app_id: "app1",
					label: "Click Me"
				});

				expect(button).toBeInstanceOf(AppBindingBuilder);
				expect(button.get("label")).toBe("Click Me");
			});
		});

		describe("Embed.Select", () => {
			it("should create an embed select binding with mapped options", () => {
				const select = BindingFactory.Embed.Select({
					app_id: "app1",
					label: "Choose",
					submit: {
						path: "/handle",
						expand: {}
					},
					options: [
						{ label: "Option 1", value: "opt1" },
						{ label: "Option 2", value: "opt2" }
					]
				});

				expect(select).toBeInstanceOf(AppBindingBuilder);
				const bindings = select.get("bindings");
				expect(bindings).toHaveLength(2);
				expect(bindings?.[0]?.get("location")).toBe("opt1");
				expect(bindings?.[0]?.get("label")).toBe("Option 1");
			});

			it("should preserve app_id in sub-bindings", () => {
				const select = BindingFactory.Embed.Select({
					app_id: "myapp",
					label: "Select",
					submit: {
						path: "/submit",
						expand: {}
					},
					options: [{ label: "Item", value: "item1" }]
				});

				const bindings = select.get("bindings");
				expect(bindings?.[0]?.get("app_id")).toBe("myapp");
			});

			it("should handle empty options", () => {
				const select = BindingFactory.Embed.Select({
					app_id: "app1",
					label: "Empty",
					submit: {
						path: "/submit",
						expand: {}
					},
					options: []
				});

				expect(select.get("bindings")).toEqual([]);
			});
		});
	});
});
