import * as fs from "node:fs";
import * as path from "node:path";
import { LogLevel } from "@triple-sun/logger";
import * as dotenv from "dotenv";
import { WebClient } from "../../../../src/web-client";
import { describeSchema, validateType, type z } from "./type-schema.utils";

/**
 * Result categories for API method tests
 */
export enum TestResultCategory {
	/** Method executed successfully with valid response */
	SUCCESS = "SUCCESS",
	/** Method returned permission denied (403) */
	PERMISSION_DENIED = "PERMISSION_DENIED",
	/** Resource not found (404) */
	NOT_FOUND = "NOT_FOUND",
	/** Invalid request parameters (400) */
	INVALID_REQUEST = "INVALID_REQUEST",
	/** Server error (5xx) */
	SERVER_ERROR = "SERVER_ERROR",
	/** Method not implemented or endpoint doesn't exist */
	NOT_IMPLEMENTED = "NOT_IMPLEMENTED",
	/** Type mismatch between expected and actual response */
	TYPE_MISMATCH = "TYPE_MISMATCH",
	/** Unexpected error */
	UNKNOWN_ERROR = "UNKNOWN_ERROR"
}

/**
 * Test result structure for a single API method
 */
export interface MethodTestResult {
	/** Method path (e.g., "users.profile.get.me") */
	methodPath: string;
	/** HTTP endpoint called */
	endpoint: string;
	/** Test result category */
	category: TestResultCategory;
	/** Actual response data (truncated if large) */
	responseData?: unknown;
	/** Error message if test failed */
	errorMessage?: string;
	/** Expected type description */
	expectedType?: string;
	/** Actual type description */
	actualType?: string;
	/** Any inconsistencies noted */
	inconsistencies?: string[];
	/** Type validation result */
	typeValidation?: {
		/** Whether types match */
		matches: boolean;
		/** List of differences */
		differences: string[];
	};
	/** Execution time in ms */
	durationMs?: number;
}

/**
 * Load environment variables from test.env
 */
dotenv.config({ path: path.resolve(process.cwd(), "test.env") });

/**
 * Real API test configuration from test.env
 */
export const TEST_LOOP_URL = process.env["TEST_LOOP_URL"] ?? "";
export const TEST_LOOP_TOKEN = process.env["TEST_LOOP_TOKEN"] ?? "";

/**
 * Validates that required environment variables are present
 */
export const validateTestEnv = (): void => {
	if (!TEST_LOOP_URL) {
		throw new Error("TEST_LOOP_URL is not set in test.env");
	}
	if (!TEST_LOOP_TOKEN) {
		throw new Error("TEST_LOOP_TOKEN is not set in test.env");
	}
};

/**
 * Creates a WebClient configured for real API testing
 */
export const createRealApiClient = (): WebClient => {
	validateTestEnv();

	return new WebClient(TEST_LOOP_URL, {
		token: TEST_LOOP_TOKEN,
		logLevel: LogLevel.ERROR,
		retryConfig: { retries: 2 },
		saveFetchedUserID: true
	});
};

interface MethodTestResultCounts {
	success: number;
	permissionDenied: number;
	notFound: number;
	invalidRequest: number;
	serverError: number;
	notImplemented: number;
	typeMismatch: number;
	unknownError: number;
}

export class TestReport {
	name: string = "";
	timestamp: string = new Date().toISOString();
	apiUrl: string = TEST_LOOP_URL;
	totalMethods: number = 0;
	testResultCounts: MethodTestResultCounts = {
		success: 0,
		permissionDenied: 0,
		notFound: 0,
		invalidRequest: 0,
		serverError: 0,
		notImplemented: 0,
		typeMismatch: 0,
		unknownError: 0
	};

	methodResults: MethodTestResult[] = [];

	constructor(name: string) {
		this.name = name;
	}

	/**
	 * Records a test result
	 */
	saveResult(result: MethodTestResult): void {
		this.methodResults.push(result);
		this.totalMethods++;

		switch (result.category) {
			case TestResultCategory.SUCCESS:
				this.testResultCounts.success++;
				break;
			case TestResultCategory.PERMISSION_DENIED:
				this.testResultCounts.permissionDenied++;
				break;
			case TestResultCategory.NOT_FOUND:
				this.testResultCounts.notFound++;
				break;
			case TestResultCategory.INVALID_REQUEST:
				this.testResultCounts.invalidRequest++;
				break;
			case TestResultCategory.SERVER_ERROR:
				this.testResultCounts.serverError++;
				break;
			case TestResultCategory.NOT_IMPLEMENTED:
				this.testResultCounts.notImplemented++;
				break;
			case TestResultCategory.TYPE_MISMATCH:
				this.testResultCounts.typeMismatch++;
				break;
			default:
				this.testResultCounts.unknownError++;
		}
	}

	/**
	 * Categorizes an error into a result category
	 */
	categorizeError(error: unknown): TestResultCategory {
		if (error instanceof Error) {
			const message = error.message.toLowerCase();

			// Check for HTTP status codes in error messages
			if (
				message.includes("403") ||
				message.includes("forbidden") ||
				message.includes("permission")
			) {
				return TestResultCategory.PERMISSION_DENIED;
			}
			if (message.includes("404") || message.includes("not found")) {
				return TestResultCategory.NOT_FOUND;
			}
			if (
				message.includes("400") ||
				message.includes("bad request") ||
				message.includes("invalid")
			) {
				return TestResultCategory.INVALID_REQUEST;
			}
			if (
				message.includes("500") ||
				message.includes("502") ||
				message.includes("503") ||
				message.includes("server")
			) {
				return TestResultCategory.SERVER_ERROR;
			}
			if (message.includes("501") || message.includes("not implemented")) {
				return TestResultCategory.NOT_IMPLEMENTED;
			}
		}

		return TestResultCategory.UNKNOWN_ERROR;
	}

	/**
	 * Helper to run a test method and record the result
	 */
	/**
	 * Helper to run a test method and record the result
	 */
	async testMethod<T>(
		methodPath: string,
		endpoint: string,
		testFn: () => Promise<{ data: T }>,
		schema: z.ZodType
	): Promise<MethodTestResult> {
		const startTime = Date.now();

		try {
			const { data } = await testFn();
			const durationMs = Date.now() - startTime;

			const validation = validateType(data, schema);

			const result: MethodTestResult = {
				methodPath,
				endpoint,
				category: validation.matches
					? TestResultCategory.SUCCESS
					: TestResultCategory.TYPE_MISMATCH,
				responseData: this.truncateResponse(data),
				expectedType: describeSchema(schema),
				actualType: typeof data,
				durationMs,
				typeValidation: {
					matches: validation.matches,
					differences: validation.differences
				}
			};

			this.saveResult(result);
			return result;
		} catch (error) {
			const durationMs = Date.now() - startTime;
			const category = this.categorizeError(error);

			const result: MethodTestResult = {
				methodPath,
				endpoint,
				category,
				errorMessage: error instanceof Error ? error.message : String(error),
				expectedType: describeSchema(schema),
				durationMs
			};

			this.saveResult(result);
			return result;
		}
	}

	/**
	 * Truncates large response objects for logging
	 */
	truncateResponse(
		response: unknown,
		maxLength = Number.POSITIVE_INFINITY
	): unknown {
		if (process.env["GENERATE_SCHEMAS"] === "true") {
			return response;
		}
		const str = JSON.stringify(response);
		if (str.length <= maxLength) {
			return response;
		}
		return `[Truncated: ${str.length} chars] ${str.substring(0, maxLength)}...`;
	}

	/**
	 * Prints the test report summary and saves results to files
	 */
	summarize(): void {
		// Calculate type validation stats
		const methodsWithValidation = this.methodResults.filter(
			m => m.typeValidation !== undefined
		);
		const typeValidationPassed = methodsWithValidation.filter(
			m => m.typeValidation?.matches === true
		).length;
		const typeValidationFailed = methodsWithValidation.filter(
			m => m.typeValidation?.matches === false
		).length;

		const summaryLines = [
			"",
			"========== API TEST REPORT SUMMARY ==========",
			`Timestamp: ${this.timestamp}`,
			`API URL: ${this.apiUrl}`,
			`Total Methods Tested: ${this.totalMethods}`,
			"",
			"Results:",
			`  ✅ Success: ${this.testResultCounts.success}`,
			`  🔒 Permission Denied: ${this.testResultCounts.permissionDenied}`,
			`  🔍 Not Found: ${this.testResultCounts.notFound}`,
			`  ⚠️  Invalid Request: ${this.testResultCounts.invalidRequest}`,
			`  ❌ Server Error: ${this.testResultCounts.serverError}`,
			`  🚫 Not Implemented: ${this.testResultCounts.notImplemented}`,
			`  📝 Type Mismatch: ${this.testResultCounts.typeMismatch}`,
			`  ❓ Unknown Error: ${this.testResultCounts.unknownError}`,
			""
		];

		// Add type validation stats if any methods were validated
		if (methodsWithValidation.length > 0) {
			summaryLines.push(
				"Type Validation:",
				`  Total Validated: ${methodsWithValidation.length}`,
				`  ✅ Passed: ${typeValidationPassed}`,
				`  ❌ Failed: ${typeValidationFailed}`,
				""
			);
		}

		// Add detailed type mismatch information
		const failedValidations = methodsWithValidation.filter(
			m => m.typeValidation?.matches === false
		);
		if (failedValidations.length > 0) {
			summaryLines.push("Type Mismatch Details:", "");
			for (const method of failedValidations) {
				summaryLines.push(`  📌 ${method.methodPath} (${method.endpoint})`);
				if (method.typeValidation?.differences) {
					for (const diff of method.typeValidation.differences) {
						summaryLines.push(`     - ${diff}`);
					}
				}
				summaryLines.push("");
			}
		}

		summaryLines.push("==============================================", "");

		// Print to console
		console.log(summaryLines.join(`\n`));

		// Save to files
		this.saveToFile(summaryLines.join("\n"));
	}

	/**
	 * Saves the test report to files in the reports directory
	 */
	saveToFile(summaryText: string): void {
		const reportsDir = path.resolve(__dirname, "..", "reports");

		// Create reports directory if it doesn't exist
		if (!fs.existsSync(reportsDir)) {
			fs.mkdirSync(reportsDir, { recursive: true });
		}

		// Generate timestamp-based filename (ISO format with safe characters)
		const timestamp = this.timestamp.replace(/[:.]/g, "-");
		const jsonFilename = `report-${this.name}-${timestamp}.json`;
		const txtFilename = `report-${this.name}-${timestamp}.txt`;

		const jsonPath = path.join(reportsDir, jsonFilename);
		const txtPath = path.join(reportsDir, txtFilename);

		// Save full JSON report
		fs.writeFileSync(jsonPath, JSON.stringify(this, null, 2), "utf-8");

		// Save text summary
		fs.writeFileSync(txtPath, summaryText, "utf-8");

		console.log(`📁 Report saved to:`);
		console.log(`   JSON: ${jsonPath}`);
		console.log(`   TXT:  ${txtPath}`);
	}

	/**
	 * Returns the full test report
	 */
	getTestReport(): TestReport {
		return this;
	}
}
