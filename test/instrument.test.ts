import * as os from "node:os";
import { expect } from "@jest/globals";
import { getUserAgent } from "../src/instrument";

describe("instrument", () => {
	it("should return default user agent string", () => {
		const ua = getUserAgent();
		expect(ua).toContain("loop-client");
		expect(ua).toContain(process.version.replace("v", ""));
		expect(ua).toContain(os.platform());
	});
});
