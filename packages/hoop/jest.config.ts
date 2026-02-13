import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/test/**/*.test.ts"],
	verbose: true,
	testTimeout: 15000, // Longer timeout for API integration tests
	collectCoverage: true,
	coverageDirectory: "coverage",
	collectCoverageFrom: ["src/**/*.ts"],
	moduleNameMapper: {
		"^is-stream$": "<rootDir>/test/__mocks__/is-stream.ts"
	},
	transformIgnorePatterns: [
		"node_modules/(?!(is-stream|again-ts|p-limit|yocto-queue)/)"
	],
	coveragePathIgnorePatterns: ["index.ts"],
	coverageThreshold: {
		global: {
			lines: 90,
			statements: 90
		}
	}
};

export default config;
