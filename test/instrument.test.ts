import * as os from "node:os";
import { addAppMetadata, getUserAgent } from "../src/instrument";

describe("instrument", () => {
	it("should return default user agent string", () => {
		const ua = getUserAgent();
		expect(ua).toContain("loop-web-client");
		expect(ua).toContain(process.version.replace("v", ""));
		expect(ua).toContain(os.platform());
	});

	it("should add metadata to user agent", () => {
		addAppMetadata({ name: "test-app", version: "1.0.0" });
		const ua = getUserAgent();
		expect(ua).toContain("test-app/1.0.0");
	});

	it("should replace slashes in app name", () => {
		addAppMetadata({ name: "test/app", version: "2.0.0" });
		const ua = getUserAgent();
		expect(ua).toContain("test:app/2.0.0");
	});
});
