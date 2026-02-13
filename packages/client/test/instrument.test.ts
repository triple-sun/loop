import { expect } from "@jest/globals";
import { getUserAgent } from "../src/instrument";

describe("instrument", () => {
	it("should return default user agent string", () => {
		const ua = getUserAgent();
		expect(ua).toContain("loop-client");
	});
});
