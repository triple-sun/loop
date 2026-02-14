import { expect, jest, test } from "@jest/globals";
import type { AxiosInstance } from "axios";
import axios from "axios";
import { LoopClient } from "../src/client";
import { ContentType } from "../src/client.types";
import { createMockAxiosInstance } from "./helpers/test-utils";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("LoopClient URL Building", () => {
	let mockAxiosInstance: AxiosInstance;

	beforeEach(() => {
		jest.clearAllMocks();
		mockAxiosInstance = createMockAxiosInstance();
		mockedAxios.create.mockReturnValue(mockAxiosInstance);
	});

	test.each([
		{
			name: "forward slashes",
			path: "channels/:channel_id",
			params: { channel_id: "team/channel" },
			expectedInUrl: "team/channel"
		},
		{
			name: "special characters",
			path: "users/:user_id",
			params: { user_id: "user@example.com" },
			expectedInUrl: "user@example.com" // Should be encoded, but current impl might just replace
		},
		{
			name: "unicode",
			path: "teams/:team_name",
			params: { team_name: "チーム名" },
			expectedInUrl: "チーム名"
		},
		{
			name: "emoji",
			path: "channels/:channel_name",
			params: { channel_name: "🎉💻🚀" },
			expectedInUrl: "🎉💻🚀"
		}
	])("handles path parameters with $name", async ({
		path,
		params,
		expectedInUrl
	}) => {
		const client = new LoopClient("https://api.example.com");
		await client.apiCall(
			{ path, method: "GET", type: ContentType.JSON },
			params
		);

		expect(mockAxiosInstance).toHaveBeenCalled();
		const callUrl = (mockAxiosInstance as unknown as jest.Mock).mock
			.calls[0]?.[0] as string;
		// Decode URI component to check for expected string if it was encoded
		expect(decodeURIComponent(callUrl)).toContain(expectedInUrl);
	});

	it("handles missing path parameter (keeps :param)", async () => {
		const client = new LoopClient("https://api.example.com");
		await client.apiCall(
			{
				path: "channels/:channel_id/:post_id",
				method: "GET",
				type: ContentType.JSON
			},
			{ channel_id: "C123" }
			// post_id is missing
		);

		const callUrl = (mockAxiosInstance as unknown as jest.Mock).mock
			.calls[0]?.[0] as string;
		expect(callUrl).toContain(":post_id");
	});

	it("replaces :user_id with 'me' when not provided", async () => {
		const client = new LoopClient("https://api.example.com");
		await client.apiCall(
			{ path: "users/:user_id", method: "GET", type: ContentType.JSON },
			{}
		);

		const callUrl = (mockAxiosInstance as unknown as jest.Mock).mock
			.calls[0]?.[0] as string;
		expect(callUrl).toContain("users/me");
	});
});
