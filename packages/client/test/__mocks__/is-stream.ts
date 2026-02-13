export function isStream(stream: unknown): boolean {
	return (
		stream !== null &&
		typeof stream === "object" &&
		"pipe" in stream &&
		typeof stream.pipe === "function"
	);
}
