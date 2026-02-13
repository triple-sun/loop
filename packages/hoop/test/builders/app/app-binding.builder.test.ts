import { expect } from "@jest/globals";
import { AppLocation } from "loop-types";
import {
	AppBindingBuilder,
	createAppBindingBuilder
} from "../../../src/builders/app/app-binding.builder";

describe("builders/binding.builder", () => {
	describe("AppBindingBuilder", () => {
		it("should construct with basic properties", () => {
			const builder = new AppBindingBuilder({
				app_id: "test-app",
				location: AppLocation.EMBEDDED,
				description: "Test binding",
				bindings: []
			});

			expect(builder.get("app_id")).toBe("test-app");
			expect(builder.get("location")).toBe(AppLocation.EMBEDDED);
			expect(builder.get("description")).toBe("Test binding");
		});

		it("should construct with nested bindings", () => {
			const builder = new AppBindingBuilder({
				app_id: "test-app",
				location: AppLocation.EMBEDDED,
				description: "",
				bindings: [
					{
						app_id: "nested-app",
						location: AppLocation.COMMAND,
						description: "Nested",
						bindings: []
					}
				]
			});

			const unwrapped = builder.build();
			expect(unwrapped.bindings).toHaveLength(1);
			expect(unwrapped.bindings?.[0]?.app_id).toBe("nested-app");
		});

		it("should construct with submit call", () => {
			const builder = new AppBindingBuilder({
				app_id: "test-app",
				location: AppLocation.EMBEDDED,
				description: "",
				bindings: [],
				submit: { path: "/api/submit" }
			});

			const unwrapped = builder.build();
			expect(unwrapped.submit?.path).toBe("/api/submit");
		});

		it("should return frozen object on unwrap", () => {
			const builder = new AppBindingBuilder({
				app_id: "test",
				location: AppLocation.EMBEDDED,
				description: "",
				bindings: []
			});
			const result = builder.build();

			expect(Object.isFrozen(result)).toBe(true);
		});
	});

	describe("buildAppBinding", () => {
		it("should create a AppBindingBuilder instance", () => {
			const result = createAppBindingBuilder({
				app_id: "test",
				location: AppLocation.EMBEDDED,
				description: "",
				bindings: []
			});

			expect(result).toBeInstanceOf(AppBindingBuilder);
		});
	});
});
