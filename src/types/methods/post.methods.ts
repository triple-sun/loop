import type { Post } from "../posts/posts";
import type { ChannelID, Paginated, TokenOverridable } from "./common.methods";

/**
 * Arguments for creating a new post.
 */
export interface PostsCreateArguments extends TokenOverridable, ChannelID {
	/** The message to be included in the post */
	message: string;
	/** The ID of the root post, if this is a reply */
	root_id?: string;
	/** A list of file IDs to be attached to the post */
	file_ids?: string[];
	/** A general JSON property bag to attach to the post */
	props?: Record<string, unknown>;
	/** An optional JSON property bag to attach to the post metadata */
	metadata?: Record<string, unknown>;
}

/**
 * Arguments for updating a post.
 */
export interface PostsUpdateArguments
	extends TokenOverridable,
		Omit<Partial<Post>, "id"> {
	/** ID of the post to update */
	id: string;
}

/**
 * Arguments for getting a post.
 */
export interface PostsGetArguments extends TokenOverridable {
	/** ID of the post to get */
	post_id: string;
}

/**
 * Arguments for deleting a post.
 */
export interface PostsDeleteArguments extends TokenOverridable {
	/** ID of the post to delete */
	post_id: string;
}

/**
 * Arguments for getting a thread of posts.
 */
export interface PostsGetThreadArguments extends TokenOverridable, Paginated {
	/** ID of the root post of the thread */
	post_id: string;
}

/**
 * Arguments for getting posts for a channel.
 */
export interface PostsGetForChannelArguments
	extends TokenOverridable,
		ChannelID,
		Paginated {
	/** Include deleted posts */
	include_deleted?: boolean;
	/** Only get posts created after this time (timestamp in milliseconds) */
	since?: number;
	/** Only get posts created before this post ID */
	before?: string;
	/** Only get posts created after this post ID */
	after?: string;
}

/**
 * Arguments for pinning a post.
 */
export interface PostsPinArguments extends TokenOverridable {
	/** ID of the post to pin */
	post_id: string;
}

/**
 * Arguments for unpinning a post.
 */
export interface PostsUnpinArguments extends TokenOverridable {
	/** ID of the post to unpin */
	post_id: string;
}

/**
 * Arguments for moving a post.
 */
export interface PostsMoveArguments extends TokenOverridable {
	/** ID of the post to move */
	post_id: string;
	/** ID of the channel to move the post to */
	channel_id: string;
}
