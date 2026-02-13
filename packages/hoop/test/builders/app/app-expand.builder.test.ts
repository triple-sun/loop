import { expect } from "@jest/globals";
import { AppExpandLevel } from "loop-types";
import {
	createExpandBuilder,
	ExpandBuilder
} from "../../../src/builders/app/app-expand.builder";

describe("builders/expand.builder", () => {
	describe("ExpandBuilder", () => {
		it("should apply default AppExpandLevel.ALL values when no options provided", () => {
			const builder = new ExpandBuilder();
			const result = builder.build();

			expect(result.acting_user).toBe(AppExpandLevel.ALL);
			expect(result.app).toBe(AppExpandLevel.ALL);
			expect(result.channel).toBe(AppExpandLevel.ALL);
			expect(result.config).toBe(AppExpandLevel.ALL);
			expect(result.locale).toBe(AppExpandLevel.ALL);
			expect(result.mentioned).toBe(AppExpandLevel.ALL);
			expect(result.parent_post).toBe(AppExpandLevel.ALL);
			expect(result.post).toBe(AppExpandLevel.ALL);
			expect(result.root_post).toBe(AppExpandLevel.ALL);
			expect(result.team).toBe(AppExpandLevel.ALL);
			expect(result.user).toBe(AppExpandLevel.ALL);
		});

		it("should respect provided options", () => {
			const builder = new ExpandBuilder({
				acting_user: AppExpandLevel.SUMMARY,
				app: AppExpandLevel.NONE
			});
			const result = builder.build();

			expect(result.acting_user).toBe(AppExpandLevel.SUMMARY);
			expect(result.app).toBe(AppExpandLevel.NONE);
			expect(result.channel).toBe(AppExpandLevel.ALL);
		});

		it("should return a frozen object on unwrap", () => {
			const builder = new ExpandBuilder();
			const result = builder.build();

			expect(Object.isFrozen(result)).toBe(true);
		});
	});

	describe("buildAppExpand", () => {
		it("should create an ExpandBuilder instance", () => {
			const result = createExpandBuilder({});

			expect(result).toBeInstanceOf(ExpandBuilder);
		});
	});
});
