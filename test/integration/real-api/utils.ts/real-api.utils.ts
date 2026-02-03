import * as fs from "node:fs";
import * as path from "node:path";
import { LogLevel } from "@triple-sun/logger";
import * as dotenv from "dotenv";
import { WebClient } from "../../../../src/web-client";
import { describeSchema, validateType, type z } from "./type-schema.utils";

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
export function validateTestEnv(): void {
	if (!TEST_LOOP_URL) {
		throw new Error("TEST_LOOP_URL is not set in test.env");
	}
	if (!TEST_LOOP_TOKEN) {
		throw new Error("TEST_LOOP_TOKEN is not set in test.env");
	}
}

/**
 * Creates a WebClient configured for real API testing
 */
export function createRealApiClient(): WebClient {
	validateTestEnv();

	return new WebClient(TEST_LOOP_URL, {
		token: TEST_LOOP_TOKEN,
		logLevel: LogLevel.ERROR,
		retryConfig: { retries: 2 },
		saveFetchedUserID: true
	});
}

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
 * Full test report structure
 */
export interface TestReport {
	/** Test run timestamp */
	timestamp: string;
	/** API URL tested */
	apiUrl: string;
	/** Total methods tested */
	totalMethods: number;
	/** Results by category */
	results: {
		success: number;
		permissionDenied: number;
		notFound: number;
		invalidRequest: number;
		serverError: number;
		notImplemented: number;
		typeMismatch: number;
		unknownError: number;
	};
	/** Individual method results */
	methods: MethodTestResult[];
}

/**
 * Global test report that accumulates results
 */
export const testReport: TestReport = {
	timestamp: new Date().toISOString(),
	apiUrl: TEST_LOOP_URL,
	totalMethods: 0,
	results: {
		success: 0,
		permissionDenied: 0,
		notFound: 0,
		invalidRequest: 0,
		serverError: 0,
		notImplemented: 0,
		typeMismatch: 0,
		unknownError: 0
	},
	methods: []
};

/**
 * Records a test result
 */
export function recordResult(result: MethodTestResult): void {
	testReport.methods.push(result);
	testReport.totalMethods++;

	switch (result.category) {
		case TestResultCategory.SUCCESS:
			testReport.results.success++;
			break;
		case TestResultCategory.PERMISSION_DENIED:
			testReport.results.permissionDenied++;
			break;
		case TestResultCategory.NOT_FOUND:
			testReport.results.notFound++;
			break;
		case TestResultCategory.INVALID_REQUEST:
			testReport.results.invalidRequest++;
			break;
		case TestResultCategory.SERVER_ERROR:
			testReport.results.serverError++;
			break;
		case TestResultCategory.NOT_IMPLEMENTED:
			testReport.results.notImplemented++;
			break;
		case TestResultCategory.TYPE_MISMATCH:
			testReport.results.typeMismatch++;
			break;
		default:
			testReport.results.unknownError++;
	}
}

/**
 * Categorizes an error into a result category
 */
export function categorizeError(error: unknown): TestResultCategory {
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
export async function testMethod<T>(
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
			responseData: truncateResponse(data),
			expectedType: describeSchema(schema),
			actualType: typeof data,
			durationMs,
			typeValidation: {
				matches: validation.matches,
				differences: validation.differences
			}
		};

		recordResult(result);
		return result;
	} catch (error) {
		const durationMs = Date.now() - startTime;
		const category = categorizeError(error);

		const result: MethodTestResult = {
			methodPath,
			endpoint,
			category,
			errorMessage: error instanceof Error ? error.message : String(error),
			expectedType: describeSchema(schema),
			durationMs
		};

		recordResult(result);
		return result;
	}
}

/**
 * Truncates large response objects for logging
 */
function truncateResponse(
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
export function printReportSummary(): void {
	// Calculate type validation stats
	const methodsWithValidation = testReport.methods.filter(
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
		`Timestamp: ${testReport.timestamp}`,
		`API URL: ${testReport.apiUrl}`,
		`Total Methods Tested: ${testReport.totalMethods}`,
		"",
		"Results:",
		`  ✅ Success: ${testReport.results.success}`,
		`  🔒 Permission Denied: ${testReport.results.permissionDenied}`,
		`  🔍 Not Found: ${testReport.results.notFound}`,
		`  ⚠️  Invalid Request: ${testReport.results.invalidRequest}`,
		`  ❌ Server Error: ${testReport.results.serverError}`,
		`  🚫 Not Implemented: ${testReport.results.notImplemented}`,
		`  📝 Type Mismatch: ${testReport.results.typeMismatch}`,
		`  ❓ Unknown Error: ${testReport.results.unknownError}`,
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
	for (const line of summaryLines) {
		console.log(line);
	}

	// Save to files
	saveReportToFile(summaryLines.join("\n"));
}

/**
 * Saves the test report to files in the reports directory
 */
function saveReportToFile(summaryText: string): void {
	const reportsDir = path.resolve(__dirname, "reports");

	// Create reports directory if it doesn't exist
	if (!fs.existsSync(reportsDir)) {
		fs.mkdirSync(reportsDir, { recursive: true });
	}

	// Generate timestamp-based filename (ISO format with safe characters)
	const timestamp = testReport.timestamp.replace(/[:.]/g, "-");
	const jsonFilename = `report-${timestamp}.json`;
	const txtFilename = `report-${timestamp}.txt`;

	const jsonPath = path.join(reportsDir, jsonFilename);
	const txtPath = path.join(reportsDir, txtFilename);

	// Save full JSON report
	fs.writeFileSync(jsonPath, JSON.stringify(testReport, null, 2), "utf-8");

	// Save text summary
	fs.writeFileSync(txtPath, summaryText, "utf-8");

	console.log(`📁 Report saved to:`);
	console.log(`   JSON: ${jsonPath}`);
	console.log(`   TXT:  ${txtPath}`);
}

/**
 * Returns the full test report
 */
export function getTestReport(): TestReport {
	return testReport;
}
