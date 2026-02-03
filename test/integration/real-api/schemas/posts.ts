import type {} from "./apps";
import type { ChannelType } from "./channels";
import type { CustomEmoji } from "./emojis";
import type { FileInfo } from "./files";
import type { OpenGraphMetadata } from "./metadata";
import type { Reaction } from "./reactions";
import type { TeamType } from "./teams";
import type {} from "./users";

/**
 * ===============================================
 * @description Posts main object
 * ===============================================
 */
export interface Post {
	id: string;
	create_at: number;
	update_at: number;
	edit_at: number;
	delete_at: number;
	is_pinned: boolean;
	user_id: string;
	channel_id: string;
	root_id: string;
	original_id: string;
	message: string;
	type: PostType;
	props?:  {
		app_bindings?: any[];
		attachments?: PostAttachment[];
		from_bot?: 'true' | 'false';
	};
	hashtags: string;
	pending_post_id: string;
	reply_count: number;
	file_ids?: string[];
	metadata: PostMetadata;
	failed?: boolean;
	user_activity_posts?: Post[];
	state?: PostState;
	filenames?: string[];
	last_reply_at?: number;
	participants?: (any | string /** userID */)[];
	message_source?: string;
	is_following?: boolean;
	exists?: boolean;
}

/**
 * ===============================================
 * @description Posts main enums
 * ===============================================
 */

export enum PostState {
	DELETED = "DELETED",
	NULL = ""
}

export enum PostPriority {
	URGENT = "urgent",
	IMPORTANT = "important",
	NULL = ""
}

export enum PostEmbedType {
	IMAGE = "image",
	LINK = "link",
	ATTACHMENT = "message_attachment",
	OPEN_GRAPH = "opengraph",
	PERMALINK = "permalink"
}

export enum PostType {
	SYSTEM_ADD_REMOVE = "system_add_remove",
	SYSTEM_ADD_TO_CHANNEL = "system_add_to_channel",
	SYSTEM_ADD_TO_TEAM = "system_add_to_team",
	SYSTEM_CHANNEL_DELETED = "system_channel_deleted",
	SYSTEM_CHANNEL_RESTORED = "system_channel_restored",
	SYSTEM_DISPLAY_NAME_CHANGE = "system_displayname_change",
	SYSTEM_CONVERT_CHANNEL = "system_convert_channel",
	SYSTEM_EPHEMERAL = "system_ephemeral",
	SYSTEM_HEADER_CHANGE = "system_header_change",
	SYSTEM_JOIN_CHANNEL = "system_join_channel",
	SYSTEM_JOIN_LEAVE = "system_join_leave",
	SYSTEM_LEAVE_CHANNEL = "system_leave_channel",
	SYSTEM_PURPOSE_CHANGE = "system_purpose_change",
	SYSTEM_REMOVE_FROM_CHANNEL = "system_remove_from_channel",
	SYSTEM_COMBINED_USER_ACTIVITY = "system_combined_user_activity",
	SYSTEM_FAKE_PARENT_DELETED = "system_fake_parent_deleted",
	SYSTEM_GENERIC = "system_generic",
	REMINDER = "reminder",
	SYSTEM_WRANGLER = "system_wrangler",
	NULL = ""
}

/**
 * ===============================================
 * @description Posts metadata
 * ===============================================
 */

export interface PostEmbed {
	type: PostEmbedType;
	url: string;
	data?: OpenGraphMetadata | PostPreviewMetadata;
}

export interface PostPriorityMetadata {
	priority: PostPriority;
	requested_ack?: boolean;
	persistent_notifications?: boolean;
}

export interface PostImage {
	format: string;
	frameCount: number;
	height: number;
	width: number;
}

export interface PostAcknowledgement {
	post_id: string;
	user_id: string;
	acknowledged_at: number;
}

export interface PostPreviewMetadata {
	post_id: string;
	post?: Post;
	channel_display_name: string;
	team_name: string;
	channel_type: string;
	channel_id: string;
}

export interface PostMetadata {
	embeds: PostEmbed[];
	emojis: CustomEmoji[];
	files: FileInfo[];
	images: Record<string, PostImage>;
	reactions?: Reaction[];
	priority?: PostPriorityMetadata;
	acknowledgements?: PostAcknowledgement[];
}

/**
 * ===============================================
 * @description Posts attachments
 * ===============================================
 */

export enum PostAttachmentColor {
	DARK_RED = "#8B0000",
	GREEN = "#008000",
	BLUE = "#0000FF",
	ORANGE = "#FFA500",
	GRAY = "#808080"
}

export interface PostAttachment {
	id: number;
	fallback: string;
	color: PostAttachmentColor | string;
	pretext: string;
	author_name: string;
	author_link: string;
	author_icon: string;
	title: string;
	title_link: string;
	text: string;
	fields: PostAttachmentField[];
	actions?: PostAction[];
	image_url: string;
	thumb_url: string;
	footer: string;
	footer_icon: string;
	timestamp: number | string;
}

export interface PostAttachmentField {
	title: string;
	value: unknown;
	short: boolean;
}

/**
 * ===============================================
 * @description Posts actions
 * ===============================================
 */

export enum PostActionStyle {
	GOOD = "good",
	WARNING = "warning",
	DANGER = "danger",
	DEFAULT = "default",
	PRIMARY = "primary",
	SUCCESS = "success"
}

export enum PostActionType {
	SELECT = "select",
	BUTTON = "button"
}

export enum PostActionDataSource {
	CHANNELS = "channels",
	USERS = "users"
}

export interface PostActionOption {
	text: string;
	value: string;
}
export interface PostActionIntegration {
	url: string;
	context?: PostContext;
}
export interface PostAction {
	id: string;
	name: string;
	integration: PostActionIntegration;
	type: PostActionType;
	options?: PostActionOption[];
	style?: PostActionStyle;
	data_source?: PostActionDataSource;
}

/**
 * ===============================================
 * @description Posts context
 * ===============================================
 */

export type PostContextProps = {
	[name: string]: string;
};

export interface PostContext {
	app_id?: string;
	location?: string;
	acting_user_id?: string;
	user_id?: string;
	channel_id?: string;
	team_id?: string;
	post_id?: string;
	root_id?: string;
	props?: PostContextProps;
	user_agent?: string;
	track_as_submit?: boolean;
	acting_user?: { id: string };
	[key: string]: unknown;
}

/**
 * ===============================================
 * @description Posts responses
 * ===============================================
 */

export enum PostNotificationStatus {
	ERROR = "error",
	NOT_SENT = "not_sent",
	UNSUPPORTED = "unsupported",
	SUCCESS = "success"
}

export interface PostListResponse {
	order: Array<string>;
	posts: Record<string, Post>;
	next_post_id: string;
	prev_post_id: string;
	first_inaccessible_post_time: number;
}

export interface PaginatedPostListResponse extends PostListResponse {
	has_next: boolean;
}

export interface PostSearchResponse extends PostListResponse {
	matches: { [postId: string]: string[] };
}

export interface PostsUsageResponse {
	count: number;
}

export interface PostNotificationResponse {
	status: PostNotificationStatus;
	reason?: string;
	data?: string;
}

/**
 * ===============================================
 * @description Posts analytics
 * ===============================================
 */

export interface PostAnalytics {
	channel_id: string;
	post_id: string;
	user_actual_id: string;
	root_id: string;
	priority?: PostPriority;
	requested_ack?: boolean | undefined;
	persistent_notifications?: boolean | undefined;
}

/**
 * ===============================================
 * @description Posts state
 * ===============================================
 */

export interface PostOrderBlock {
	order: string[];
	recent?: boolean;
	oldest?: boolean;
}

export interface MessageHistory {
	messages: string[];
	index: {
		post: number;
		comment: number;
	};
}

/**
 * ===============================================
 * @description Posts other
 * ===============================================
 */

/**
 * @todo Find where its used
 */
export interface PostActivityEntry {
	postType: PostType;
	actorId: string[];
	userIds: string[];
	usernames: string[];
}

/**
 * @todo Find where its used
 */
export interface PostInfo {
	channel_id: string;
	channel_type: string;
	channel_display_name: string;
	has_joined_channel: boolean;
	team_id: string;
	team_type: string;
	team_display_name: string;
	has_joined_team: boolean;
}
