import { expect } from "@jest/globals";
import { AppExpandLevel } from "loop-types";
import {
	AppCallBuilder,
	createCallBuilder
} from "../../../src/builders/app/app-call.builder";

describe("builders/call.builder", () => {
	describe("AppCallBuilder", () => {
		it("should construct with path and wrapped expand", () => {
			const builder = new AppCallBuilder({
				path: "/api/test"
			});

			expect(builder.get("path")).toBe("/api/test");
			expect(builder.get("state")).toBeUndefined();
		});

		it("should construct with state", () => {
			const builder = new AppCallBuilder({
				path: "/api/test",
				state: { key: "value" }
			});

			expect(builder.get("state")).toEqual({ key: "value" });
		});

		it("should wrap expand options", () => {
			const builder = new AppCallBuilder({
				path: "/api/test",
				expand: {
					acting_user: AppExpandLevel.SUMMARY
				}
			});

			const unwrapped = builder.build();
			expect(unwrapped.expand?.acting_user).toBe(AppExpandLevel.SUMMARY);
		});

		it("should return frozen object on unwrap", () => {
			const builder = new AppCallBuilder({ path: "/test" });
			const result = builder.build();

			expect(Object.isFrozen(result)).toBe(true);
		});
	});

	describe("buildAppCall", () => {
		it("should create an AppCallBuilder instance", () => {
			const result = createCallBuilder({ path: "/test" });

			expect(result).toBeInstanceOf(AppCallBuilder);
		});
	});
});
