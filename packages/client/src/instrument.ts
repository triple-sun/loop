import packageJson from "../package.json";

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
		`${packageJson.name.replaceAll("/", ":")}/${packageJson.version} ` +
		`${getProcessMeta()} `
	);
}
