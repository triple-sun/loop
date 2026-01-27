export function isStream(stream: any): boolean {
	return (
		stream !== null &&
		typeof stream === "object" &&
		typeof stream.pipe === "function"
	);
}
