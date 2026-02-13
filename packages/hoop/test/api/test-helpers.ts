import * as dotenv from "dotenv";
import type { Channel, Post } from "loop-types";
import { ChannelType, WebClient } from "loop-types";

// Load test environment variables
dotenv.config({ path: ".env.test" });

/**
 * Get WebClient configured with test credentials from .env.test
 *
 * @throws Error if TEST_LOOP_TOKEN or TEST_LOOP_URL are not set
 */
export function getTestClient(): WebClient {
	const token = process.env["TEST_LOOP_TOKEN"];
	const url = process.env["TEST_LOOP_URL"];

	if (!token || !url) {
		throw new Error(
			"TEST_LOOP_TOKEN and TEST_LOOP_URL must be set in .env.test"
		);
	}

	return new WebClient(token);
}

/**
 * Check if test environment is configured
 */
export function isTestEnvConfigured(): boolean {
	return Boolean(
		process.env["TEST_LOOP_TOKEN"] && process.env["TEST_LOOP_URL"]
	);
}

/**
 * Generate a unique test identifier
 */
export function generateTestId(): string {
	return `test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Track created resources for cleanup
const createdChannels: string[] = [];
const createdPosts: string[] = [];

/**
 * Create a temporary test channel
 *
 * @param client - WebClient instance
 * @param teamId - Team ID where channel should be created
 * @param name - Optional channel name (will be auto-generated if not provided)
 * @returns Created channel
 */
export async function createTestChannel(
	client: WebClient,
	teamId: string,
	name?: string
): Promise<Channel> {
	const channelName = name || `test-channel-${generateTestId()}`;
	const displayName = `Test Channel ${generateTestId()}`;

	const result = await client.channels.create.regular({
		team_id: teamId,
		name: channelName,
		display_name: displayName,
		type: ChannelType.OPEN // Open channel
	});

	createdChannels.push(result.data.id);
	return result.data;
}

/**
 * Delete a test channel
 *
 * @param client - WebClient instance
 * @param channel_id - Channel ID to delete
 */
export async function deleteTestChannel(
	client: WebClient,
	channel_id: string
): Promise<void> {
	try {
		await client.channels.delete({ channel_id });
		const index = createdChannels.indexOf(channel_id);
		if (index > -1) {
			createdChannels.splice(index, 1);
		}
	} catch (error) {
		console.warn(`Failed to delete test channel ${channel_id}:`, error);
	}
}

/**
 * Create a test post in the specified channel
 *
 * @param client - WebClient instance
 * @param channel_id - Channel ID where post should be created
 * @param post - Post data
 * @returns Created post
 */
export async function createTestPost(
	client: WebClient,
	channel_id: string,
	post: Partial<Post>
): Promise<Post> {
	const result = await client.posts.create({
		channel_id,
		message: post.message || "Test post",
		...post
	});

	createdPosts.push(result.data.id);
	return result.data;
}

/**
 * Delete a test post
 *
 * @param client - WebClient instance
 * @param postId - Post ID to delete
 */
export async function deleteTestPost(
	client: WebClient,
	postId: string
): Promise<void> {
	try {
		await client.posts.delete({ post_id: postId });
		const index = createdPosts.indexOf(postId);
		if (index > -1) {
			createdPosts.splice(index, 1);
		}
	} catch (error) {
		console.warn(`Failed to delete test post ${postId}:`, error);
	}
}

/**
 * Get the current user's team ID (for creating channels)
 *
 * @param client - WebClient instance
 * @returns Team ID
 */
export async function getUserTeamId(
	client: WebClient
): Promise<string | undefined> {
	const user = await client.users.profile.get.me();
	const teams = await client.users.teams({ user_id: user.data.id });

	if (teams.data.length === 0) {
		throw new Error("User is not a member of any teams");
	}

	return teams.data[0]?.id;
}

/**
 * Global cleanup function to remove all created test resources
 *
 * @param client - WebClient instance
 */
export async function cleanup(client: WebClient): Promise<void> {
	// Delete posts first (await in sequence to avoid rate limiting)
	for (const postId of [...createdPosts]) {
		// biome-ignore lint/performance/noAwaitInLoops: <should be chained>
		await deleteTestPost(client, postId);
	}

	// Then delete channels (await in sequence to avoid rate limiting)
	for (const channelId of [...createdChannels]) {
		// biome-ignore lint/performance/noAwaitInLoops: <should be chained>
		await deleteTestChannel(client, channelId);
	}
}
