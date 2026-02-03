/**
 * @file Type Schema Utilities using Zod v4
 * @description Provides Zod-based runtime type validation for API responses
 */

import { z } from "zod";

// Re-export z for convenience in tests
export { z };

/**
 * Type validation result with detailed error information
 */
export interface TypeValidationResult {
	/** Whether the validation passed */
	matches: boolean;
	/** List of differences/errors found */
	differences: string[];
}

/**
 * Gets the type name of a value
 */
function getTypeName(value: unknown): string {
	if (value === null) return "null";
	if (value === undefined) return "undefined";
	if (Array.isArray(value)) return "array";
	return typeof value;
}

/**
 * Validate a value against a Zod schema and return detailed differences
 * @param value - The value to validate
 * @param schema - The Zod schema to validate against
 * @returns TypeValidationResult with match status and differences
 */
export function validateType(
	value: unknown,
	schema: z.ZodType
): TypeValidationResult {
	const result = schema.safeParse(value);

	if (result.success) {
		return {
			matches: true,
			differences: []
		};
	}

	// Format Zod v4 errors into readable differences
	const differences = result.error.issues.map(issue => {
		const path = issue.path.length > 0 ? issue.path.join(".") : "root";
		const code = issue.code;

		// Navigate to the actual value at the issue path for better error messages
		let actualValue: unknown = value;
		for (const segment of issue.path) {
			if (actualValue && typeof actualValue === "object") {
				actualValue = (actualValue as Record<string | number, unknown>)[
					String(segment)
				];
			} else {
				actualValue = undefined;
				break;
			}
		}
		const actualType = getTypeName(actualValue);

		switch (code) {
			case "invalid_type":
				return `${path}: Expected type '${issue.expected}', got '${actualType}'${actualValue !== undefined ? ` (value: ${JSON.stringify(actualValue)})` : ""}`;
			case "unrecognized_keys":
				return `${path}: Unexpected keys: ${issue.keys.join(", ")}`;
			case "invalid_union":
				return `${path}: Value doesn't match any union type (got '${actualType}')`;
			case "invalid_value":
				return `${path}: Invalid value '${JSON.stringify(actualValue)}'`;
			case "too_small":
				return `${path}: Value too small (minimum: ${issue.minimum}, got: ${JSON.stringify(actualValue)})`;
			case "too_big":
				return `${path}: Value too big (maximum: ${issue.maximum}, got: ${JSON.stringify(actualValue)})`;
			default:
				return `${path}: ${issue.message}`;
		}
	});

	return {
		matches: false,
		differences
	};
}

/**
 * Describes a Zod schema in a human-readable format
 * Note: This is a simplified description, complex nested schemas may not be fully described
 * @param schema - The Zod schema to describe
 * @returns Human-readable description of the schema
 */
export function describeSchema(schema: z.ZodType): string {
	// Use Zod's built-in description if available
	const description = schema.description;
	if (description) {
		return description;
	}

	// For simple types we can try to infer
	try {
		// Check if it's a simple primitive by parsing known values
		if (schema.safeParse("").success && !schema.safeParse(0).success) {
			return "string";
		}
		if (schema.safeParse(0).success && !schema.safeParse("").success) {
			return "number";
		}
		if (schema.safeParse(true).success && !schema.safeParse("").success) {
			return "boolean";
		}
	} catch {
		// Ignore errors in type detection
	}

	return "ZodSchema";
}
