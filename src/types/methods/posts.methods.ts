import type { Post } from "../posts";
import type {
	ChannelID,
	Paginated,
	TokenOverridable,
	UserID
} from "./common.methods";

interface PostArguments {
	/** The message to be included in the post */
	message: string;
	/** The ID of the root post, if this is a reply */
	root_id?: string;
	/** A list of file IDs to be attached to the post */
	file_ids?: string[];
	/** A general JSON property bag to attach to the post */
	props?: Record<string, unknown>;
	/**
	 * @description Whether to set the user status as online or not.
	 */
	set_online?: boolean;
}

interface PostCreateWithUserIDArguments
	extends TokenOverridable,
		UserID,
		PostArguments {}
interface PostCreateWithChannelIDArguments
	extends TokenOverridable,
		ChannelID,
		PostArguments {}

/**
 * Arguments for creating a new post.
 */
export type PostsCreateArguments =
	| PostCreateWithChannelIDArguments
	| PostCreateWithUserIDArguments;

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

/**
 * Arguments for creating an ephemeral post.
 * @description Create a new ephemeral post that is visible only to the specified user.
 */
export interface PostsCreateEphemeralArguments extends TokenOverridable {
	/** The ID of the user to receive the ephemeral post */
	user_id: string;
	/** The post content */
	post: Omit<PostsCreateArguments, "channel_id"> & { channel_id?: string };
}

/**
 * Arguments for marking a post as unread.
 * @description Mark a channel as being unread from a given post.
 */
export interface PostsMarkAsUnreadArguments extends TokenOverridable {
	/** The ID of the user */
	user_id: string;
	/** The ID of the post */
	post_id: string;
}

/**
 * Arguments for getting flagged posts.
 * @description Get a list of the target user's flagged posts.
 */
export interface PostsGetFlaggedArguments extends TokenOverridable, Paginated {
	/** The ID of the user whose flagged posts to retrieve */
	user_id: string;
	/** The ID of the team to filter by */
	team_id?: string;
	/** The ID of the channel to filter by */
	channel_id?: string;
}

/**
 * Arguments for getting file info from a post.
 * @description Gets a list of file information objects for the files attached to a post.
 */
export interface PostsGetFileInfoArguments extends TokenOverridable {
	/** The ID of the post */
	post_id: string;
}

/**
 * Arguments for getting posts around the last unread.
 * @description Get the posts around the oldest unread post in a channel for a given user.
 */
export interface PostsGetAroundLastUnreadArguments extends TokenOverridable {
	/** The ID of the channel */
	channel_id: string;
	/** The ID of the user */
	user_id: string;
	/** Number of posts to fetch before the unread post */
	limit_before?: number;
	/** Number of posts to fetch after the unread post */
	limit_after?: number;
}

/**
 * Arguments for searching posts.
 * @description Search posts in the specified team.
 */
export interface PostsSearchArguments extends TokenOverridable {
	/** The ID of the team to search in */
	team_id: string;
	/** The search terms */
	terms: string;
	/** Use OR instead of AND for search terms */
	is_or_search: boolean;
	/** The time zone offset in seconds */
	time_zone_offset?: number;
	/** Include posts from deleted channels */
	include_deleted_channels?: boolean;
	/** The page number */
	page?: number;
	/** The number of results per page */
	per_page?: number;
}

/**
 * Arguments for performing a post action.
 * @description Perform a post action (e.g., clicking an interactive button).
 */
export interface PostsDoActionArguments extends TokenOverridable {
	/** The ID of the post */
	post_id: string;
	/** The ID of the action to perform */
	action_id: string;
	/** The ID of the channel (optional) */
	channel_id?: string;
}

/**
 * Arguments for setting a reminder on a post.
 * @description Set a reminder for the specified user on the specified post.
 */
export interface PostsSetReminderArguments extends TokenOverridable {
	/** The ID of the user */
	user_id: string;
	/** The ID of the post */
	post_id: string;
	/** Unix timestamp (in seconds) when the reminder should fire */
	target_time: number;
}

/**
 * Arguments for partially updating a post.
 * @description Partially update a post by providing only the fields that need to be changed.
 */
export interface PostsPatchArguments extends TokenOverridable {
	/** The ID of the post to patch */
	post_id: string;
	/** Set to `true` to pin the post to the channel */
	is_pinned?: boolean;
	/** The message text of the post */
	message?: string;
	/** A list of file IDs to be attached to the post */
	file_ids?: string[];
	/** Whether the post has reactions */
	has_reactions?: boolean;
	/** A general JSON property bag to attach to the post */
	props?: Record<string, unknown>;
}

/**
 * Arguments for getting multiple posts by IDs.
 * @description Retrieve a list of posts by providing an array of post IDs.
 */
export interface PostsGetByIdsArguments extends TokenOverridable {
	/** List of post IDs to retrieve */
	ids: string[];
}
