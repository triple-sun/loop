import { expect, jest } from "@jest/globals";
import {
	append,
	clearCollection,
	find,
	findIndex,
	isSelected,
	mutateCollection
} from "../src/internal/utils";

describe("internal/utils", () => {
	describe("find", () => {
		const source = ["a", "b", "c"];

		it("should find element by index", () => {
			expect(find(1, source)).toBe("b");
		});

		it("should return undefined if index is out of bounds", () => {
			expect(find(3, source)).toBeUndefined();
		});

		it("should find element by finder function", () => {
			expect(find(item => item === "b", source)).toBe("b");
		});

		it("should return undefined if finder function returns false", () => {
			expect(find(item => item === "d", source)).toBeUndefined();
		});

		it("should return undefined if source is undefined", () => {
			expect(find(1, undefined)).toBeUndefined();
			expect(find(() => true, undefined)).toBeUndefined();
		});
	});

	describe("isSelected", () => {
		const source = { id: 1, name: "test" };

		it("should return true if selector is not provided", () => {
			expect(isSelected(source)).toBe(true);
		});

		it("should return true if selector returns true", () => {
			expect(isSelected(source, item => item.id === 1)).toBe(true);
		});

		it("should return false if selector returns false", () => {
			expect(isSelected(source, item => item.id === 2)).toBe(false);
		});

		it("should pass index to selector", () => {
			const selector = jest.fn(
				(_el: typeof source, _index?: number): boolean => true
			);
			isSelected(source, selector, 5);
			expect(selector).toHaveBeenCalledWith(source, 5);
		});
	});

	describe("findIndex", () => {
		const source = ["a", "b", "c"];

		it("should find index by finder function", () => {
			expect(findIndex((item: string) => item === "b", source)).toBe(1);
		});

		it("should return -1 if not found", () => {
			expect(findIndex((item: string) => item === "d", source)).toBe(-1);
		});
	});

	describe("append", () => {
		describe("string handling", () => {
			it("should concatenate two strings", () => {
				expect(append("hello", " world")).toBe("hello world");
				expect(append("", "test")).toBe("test");
			});
		});

		describe("array handling", () => {
			it("should spread two arrays together", () => {
				expect(append([1, 2], 3, 4)).toEqual([1, 2, 3, 4]);
				expect(append([], 1)).toEqual([1]);
				expect(append([1], 1)).toEqual([1, 1]);
			});
		});

		describe("object handling", () => {
			it("should merge two objects", () => {
				expect(append({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
			});

			it("should override properties with second object", () => {
				expect(append({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
			});
		});

		describe("error handling", () => {
			it("should throw TypeError for incompatible types", () => {
				// @ts-expect-error testing invalid type
				expect(() => append(123, 456)).toThrow(TypeError);
			});
		});
	});

	describe("mutateCollection", () => {
		it("should return unchanged collection when item not found", () => {
			const collection = [1, 2, 3];
			const result = mutateCollection(collection, (x: number) => x * 2, 5);
			expect(result).toBe(collection);
		});
	});

	describe("clearCollection", () => {
		it("should return empty array when no selector provided", () => {
			expect(clearCollection([1, 2, 3])).toEqual([]);
		});
	});
});
