import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/test/**/*.test.ts"],
	verbose: true,
	collectCoverage: true,
	coverageDirectory: "coverage",
	collectCoverageFrom: ["src/**/*.ts"],
	moduleNameMapper: {
		"^is-stream$": "<rootDir>/test/__mocks__/is-stream.ts"
	},
	transformIgnorePatterns: [
		"node_modules/(?!(is-stream|again-ts|p-limit|yocto-queue)/)"
	]
};

export default config;
