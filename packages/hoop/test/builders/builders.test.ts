import { expect } from "@jest/globals";
import { Builder } from "../../src/internal/builders";

interface TestBuilderData {
	name: string;
	count?: number;
	items: string[];
	optional?: string;
	value?: string;
}

class TestBuilder extends Builder<TestBuilderData> {
	override build(): Readonly<TestBuilderData> {
		return Object.freeze({ ...this.d });
	}
}

describe("internal/builder", () => {
	describe("Builder", () => {
		it("should store the wrapped value", () => {
			const wrapped = new TestBuilder({
				name: "",
				count: 0,
				items: [],
				value: "hello"
			});
			expect(wrapped.build().value).toBe("hello");
		});
	});

	describe("builder", () => {
		describe("set", () => {
			it("should set a property and return this for chaining", () => {
				const builder = new TestBuilder({
					name: "initial",
					count: 0,
					items: []
				});

				const result = builder.set("name", "updated");

				expect(result).toBe(builder);
				expect(builder.get("name")).toBe("updated");
			});
		});

		describe("get", () => {
			it("should return the property value", () => {
				const builder = new TestBuilder({
					name: "test",
					count: 42,
					items: ["a", "b"]
				});

				expect(builder.get("name")).toBe("test");
				expect(builder.get("count")).toBe(42);
				expect(builder.get("items")).toEqual(["a", "b"]);
			});
		});

		describe("mutate", () => {
			it("should apply mutagen function and return this", () => {
				const builder = new TestBuilder({
					name: "test",
					count: 5,
					items: []
				});

				const result = builder.mutate("count", c => (c ?? 0) * 2);

				expect(result).toBe(builder);
				expect(builder.get("count")).toBe(10);
			});
		});

		describe("append", () => {
			it("should append data to property and return this", () => {
				const builder = new TestBuilder({
					name: "hello",
					count: 5,
					items: ["a"]
				});

				const result = builder.append("name", " world");

				expect(result).toBe(builder);
				expect(builder.get("name")).toBe("hello world");
			});

			it("should append arrays together", () => {
				const builder = new TestBuilder({
					name: "test",
					count: 0,
					items: ["a", "b"]
				});

				builder.append("items", "c", "d");

				expect(builder.get("items")).toEqual(["a", "b", "c", "d"]);
			});
		});

		describe("remove", () => {
			it("should set optional property to undefined", () => {
				const builder = new TestBuilder({
					name: "test",
					count: 0,
					items: [],
					optional: "has value"
				});

				const result = builder.remove("optional");

				expect(result).toBe(builder);
				expect(builder.get("optional")).toBeUndefined();
			});
		});
	});
});
