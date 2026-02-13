import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["<rootDir>/test/**/*.test.ts"],
	verbose: true,
	collectCoverage: true,
	coverageDirectory: "coverage",
	collectCoverageFrom: ["src/**/*.ts", "!src/**/*.spec.ts"],
	coveragePathIgnorePatterns: ["index.ts"],
	coverageThreshold: {
		global: {
			lines: 90,
			statements: 90
		}
	},
	transform: {
		"^.+\\.tsx?$": [
			"ts-jest",
			{
				tsconfig: "tsconfig.spec.json"
			}
		]
	}
};

export default config;
