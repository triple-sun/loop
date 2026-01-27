import { HEADER_AUTH, retryPolicies } from "../src/const";

describe("const", () => {
	it("should have correct HEADER_AUTH", () => {
		expect(HEADER_AUTH).toBe("Authorization");
	});

	it("should have correct retryPolicies", () => {
		expect(retryPolicies.tenRetriesInAboutThirtyMinutes).toBeDefined();
		expect(retryPolicies.fiveRetriesInFiveMinutes).toBeDefined();
		expect(retryPolicies.tenRetriesInAboutThirtyMinutes.tries).toBe(10);
		expect(retryPolicies.fiveRetriesInFiveMinutes.tries).toBe(5);
	});
});
