import packageJson from "../package.json";

/**
 * Replaces occurrences of '/' with ':' in a string, since '/' is meaningful inside User-Agent strings as a separator.
 */
function replaceSlashes(s: string): string {
	return s.replace("/", ":");
}

const getProcessMeta = (): string => {
	if (typeof process !== "undefined" && process.version) {
		return `${process.title}/${process.version.replace("v", "")} `;
	}

	if (typeof navigator !== "undefined" && navigator.userAgent) {
		return `browser/${navigator.userAgent} `;
	}

	return "unknown ";
};

/**
 * Returns the current User-Agent value for instrumentation
 */
export function getUserAgent(): string {
	return (
		`${replaceSlashes(packageJson.name)}/${packageJson.version} ` +
		`${getProcessMeta()} `
	);
}
