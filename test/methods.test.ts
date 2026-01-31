import { expect, jest } from "@jest/globals";
import { ChannelType } from "../src/types";
import { WebClient } from "../src/web-client";

// Mock dependencies
jest.mock("axios", () => ({
	create: jest.fn(() => ({
		interceptors: { request: { use: jest.fn() } },
		defaults: { headers: { post: {} } },
		getUri: jest.fn()
	}))
}));
jest.mock("breadline-ts");

describe("Methods", () => {
	let client: WebClient;

	beforeEach(() => {
		jest.clearAllMocks();
		// Mock apiCall on prototype before instantiation
		jest.spyOn(WebClient.prototype, "apiCall").mockResolvedValue({ data: {} });
		client = new WebClient("https://example.com");
	});

	it("should have all method groups defined", () => {
		expect(client.bots).toBeDefined();
		expect(client.brand).toBeDefined();
		expect(client.compliance).toBeDefined();
		expect(client.channels).toBeDefined();
		expect(client.cloud).toBeDefined();
		expect(client.dataRetention).toBeDefined();
		// Add more groups as needed
	});

	describe("bots", () => {
		it("create calls apiCall with correct params", async () => {
			await client.bots.create({
				username: "bot",
				display_name: "Bot",
				description: "Bot"
			});
			expect(client.apiCall).toHaveBeenCalledWith(
				expect.objectContaining({ path: "bots", method: "POST" }),
				expect.objectContaining({ username: "bot" })
			);
		});

		it("get calls apiCall", async () => {
			await client.bots.get({ user_id: "U1" });
			expect(client.apiCall).toHaveBeenCalledWith(
				expect.objectContaining({ path: "bots/:user_id", method: "GET" }),
				{ user_id: "U1" }
			);
		});
	});

	describe("channels", () => {
		it("create calls apiCall", async () => {
			await client.channels.create.regular({
				name: "c1",
				display_name: "c1",
				type: ChannelType.Open,
				team_id: ""
			});
			expect(client.apiCall).toHaveBeenCalledWith(
				expect.objectContaining({ path: "channels", method: "POST" }),
				expect.objectContaining({ name: "c1" })
			);
		});

		it("getById calls apiCall", async () => {
			await client.channels.get.byId({ channel_id: "C1" });
			expect(client.apiCall).toHaveBeenCalledWith(
				expect.objectContaining({
					path: "channels/:channel_id",
					method: "GET"
				}),
				{ channel_id: "C1" }
			);
		});

		it("search calls apiCall", async () => {
			await client.channels.search.team({ team_id: "T1", term: "foo" });
			expect(client.apiCall).toHaveBeenCalledWith(
				expect.objectContaining({
					path: "teams/:team_id/channels/search",
					method: "POST"
				}),
				expect.objectContaining({ team_id: "T1" })
			);
		});
	});

	// Sample test for nested methods like cloud.customer.get
	describe("cloud", () => {
		it("customer.get calls apiCall", async () => {
			await client.cloud.customer.get();
			expect(client.apiCall).toHaveBeenCalledWith(
				expect.objectContaining({ path: "cloud/customer", method: "GET" })
			);
		});
	});
});
