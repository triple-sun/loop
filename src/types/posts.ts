import type { AppBinding } from "./apps";
import type { ChannelType } from "./channels";
import type { CustomEmoji } from "./emojis";
import type { FileInfo } from "./files";
import type { OpenGraphMetadata } from "./metadata";
import type { Reaction } from "./reactions";
import type { TeamType } from "./teams";
import type { UserProfile } from "./users";

/**
 * ===============================================
 * @description Posts main object
 * ===============================================
 */
export interface Post<PROP_METADATA = Record<string, unknown>> {
	id: string;

	/** dates */
	/** @description The time in milliseconds a post was created */
	create_at: number;
	/** @description The time in milliseconds a post was last updated */
	update_at: number;
	/** @description */
	delete_at: number;
	edit_at: number;

	/** ids */
	root_id: string;
	channel_id: string;
	user_id: string;
	original_id: string;
	pending_post_id: string;

	/** message data */
	message: string;
	type: PostType;
	metadata: PostMetadata;
	props: PostProps<PROP_METADATA>;
	file_ids?: string[];
	hashtag?: string;

	/** interactions */
	reply_count: number;
	last_reply_at: number;
	participants: (UserProfile | string /** userID */)[] | null;

	/**
	 * @description ???
	 * @deprecated
	 * @todo verify
	 */
	state?: PostState;

	/**
	 * @deprecated ?
	 * @todo verify
	 */
	filenames?: string[];

	/**
	 * @deprecated ?
	 * @todo verify
	 */
	is_pinned?: boolean;
	/**
	 * @deprecated ?
	 * @todo verify
	 */
	message_source?: string /**
	 * @deprecated ?
	 * @todo verify
	 */;
	is_following?: boolean;
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
	channel_type: ChannelType;
	channel_id: string;
}

export interface PostMetadata {
	embeds?: PostEmbed[];
	emojis?: CustomEmoji[];
	files?: FileInfo[];
	images?: Record<string, PostImage>;
	reactions?: Reaction[];
	priority?: PostPriorityMetadata;
	acknowledgements?: PostAcknowledgement[];
}

/**
 * ===============================================
 * @description Posts props
 * ===============================================
 */
export interface PostProps<PROP_METADATA = Record<string, unknown>> {
	app_bindings?: AppBinding[];
	attachments?: PostAttachment[];
	from_bot?: "true" | "false";
	metadata?: PROP_METADATA;
	disable_group_highlight?: boolean;
	locationReplyMessage?: "CENTER" | string;
	replyMessage?: string;
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

/**
 * Post attachment
 *
 * @see {@link https://developers.mattermost.com/integrate/reference/message-attachments/ | Message attachments}
 */
export interface PostAttachment {
	/**
	 * @description A required plain-text summary of the attachment.
	 * This is used in notifications, and in clients that don't support formatted text (e.g. IRC).
	 */
	fallback?: string;

	/**
	 * @description A hex color code that will be used as the left border color for the attachment.
	 * If not specified, it will default to match the channel sidebar header background color.
	 */
	color?: PostAttachmentColor | string;

	/**
	 * @description An optional line of text that will be shown above the attachment.
	 * Supports @mentions.
	 */
	pretext?: string;

	/**
	 * @description The text to be included in the attachment.
	 * It can be formatted using {@link https://docs.mattermost.com/help/messaging/formatting-text.html | Markdown}.
	 * For long texts, the message is collapsed and a 'Show More' link is added to expand the message.
	 * Supports @mentions.
	 */
	text: string;

	/**
	 * @description An optional name used to identify the author.
	 * It will be included in a small section at the top of the attachment.
	 */
	author_name?: string;

	/**
	 * @description An optional URL used to hyperlink the author_name.
	 * If no author_name is specified, this field does nothing.
	 */
	author_link?: string;

	/**
	 * @description An optional URL used to display a 16x16 pixel icon beside the author_name.
	 */
	author_icon?: string;

	/**
	 * @description An optional title displayed below the author information in the attachment.
	 */
	title?: string;

	/**
	 * @description An optional URL used to hyperlink the title. If no title is specified, this field does nothing.
	 */
	title_link?: string;

	/**
	 * @description Fields can be included as an optional array within attachments,
	 * and are used to display information in a table format inside the attachment.
	 */
	fields?: PostAttachmentField[];

	/**
	 * @description Post action array (buttons/selects) used in interactive messages
	 */
	actions?: Array<
		PostActionButton | PostActionStaticSelect | PostActionSourcedSelect
	>;

	/**
	 * @description An optional URL to an image file (GIF, JPEG, PNG, BMP, or SVG)
	 * that is displayed inside a message attachment.
	 */
	image_url?: string;

	/**
	 * @description An optional URL to an image file (GIF, JPEG, PNG, BMP, or SVG) that is displayed as
	 * a 75x75 pixel thumbnail on the right side of an attachment.
	 *
	 * We recommend using an image that is already 75x75 pixels, but larger images will be scaled down with the aspect ratio maintained.
	 */
	thumb_url?: string;

	/**
	 * @description An optional line of text that will be displayed at the bottom of the attachment.
	 * Footers with more than 300 characters will be truncated with an ellipsis (…).
	 */
	footer?: string;

	/**
	 * @description  An optional URL to an image file (GIF, JPEG, PNG, BMP, or SVG) that
	 * is displayed as a 16x16 pixel thumbnail before the footer text.
	 */
	footer_icon?: string;
}

export interface PostAttachmentField {
	/**
	 * @description A title shown in the table above the value.
	 * As of @version 5.14 a title will render emojis properly.
	 */
	title: string;

	/**
	 * @description The text value of the field.
	 * It can be formatted using Markdown.
	 * Supports @mentions.
	 */
	value: string;

	/**
	 * @description Optionally set to true or false (boolean) to
	 * indicate whether the value is short enough to be displayed beside other values.
	 */
	short?: boolean;
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

/**
 * @description Use interactive messages to simplify complex workflows by allowing users
 * to take quick actions directly through your integration post.
 *
 * @see {@link https://developers.mattermost.com/integrate/plugins/interactive-messages/ | Interactive messages}
 */
export interface PostAction<CONTEXT = Record<string, unknown>> {
	/**
	 * @description Action type - button or select
	 */
	type: PostActionType;

	/**
	 * @description A per post unique identifier.
	 * Must not contain "_" or "-"
	 */
	id: string;

	/**
	 * @description Give your action a descriptive name.
	 */
	name: string;

	/**
	 * @description Integration params
	 */
	integration: {
		/**
		 * @description The actions are backed by an integration that handles HTTP POST requests when users select the message button.
		 * The URL parameter determines where this action is sent. The request contains an application/json JSON string.
		 * As of @version 5.14, relative URLs are accepted, simplifying the workflow when a plugin handles the action.
		 */
		url: string;

		/**
		 * @description The requests sent to the specified URL contain the user ID, post ID, channel ID, team ID, and any context that was provided in the action definition. If the post was of type Message Menus, then context also contains the selected_option field with the user-selected option value. The post ID can be used to, for example, delete or edit the post after selecting a message button.
		 */
		context?: CONTEXT;
	};
	options?: PostActionOption[];
	data_source?: PostActionDataSource;
}

/**
 * Message buttons
 *
 * @description Add message buttons as actions in your integration {@link https://developers.mattermost.com/integrate/reference/message-attachments/ | message attachments}
 */
export interface PostActionButton<CONTEXT = Record<string, unknown>>
	extends PostAction<CONTEXT> {
	readonly type: PostActionType.BUTTON;

	/**
	 * @description Button text
	 */
	name: string;

	/**
	 * @description Button color
	 *
	 * Button actions support a style parameter to change the color of the button.
	 * The possible values for style are: good, warning, danger, default, primary, and success.
	 *
	 * It's also possible to pass a theme variable or a hex color, but we discourage this approach because it won't be resilient against theme changes.
	 */
	style?: PostActionStyle;
}

/**
 * Message static select
 *
 * @description Similar to buttons, add message menus as actions in your integration {@link https://developers.mattermost.com/integrate/reference/message-attachments/ | message attachments}
 */
export interface PostActionStaticSelect<CONTEXT = Record<string, unknown>>
	extends PostAction<CONTEXT> {
	readonly type: PostActionType.SELECT;
	options: PostActionOption[];
}

/**
 * Message dynamic user/channel select
 *
 * @description Similar to buttons, add message menus as actions in your integration {@link https://developers.mattermost.com/integrate/reference/message-attachments/ | message attachments}
 */
export interface PostActionSourcedSelect<CONTEXT = Record<string, unknown>>
	extends PostAction<CONTEXT> {
	readonly type: PostActionType.SELECT;
	/**
	 * @description Data source for options
	 *
	 * You can provide a list of channels for message menus for users to select from.
	 * Users can only select from public channels in their teams.
	 *
	 * Similar to channels, you can also provide a list of users for message menus.
	 * The user can choose the user who is part of the Mattermost system.
	 */
	data_source: PostActionDataSource;
}

export interface PostActionPayload<CONTEXT = Record<string, unknown>> {
	post_id: string;
	channel_id: string;
	user_id: string;
	team_id?: string;
	context: CONTEXT;
}

export interface PostActionResponse<PROP_METADATA = Record<string, unknown>> {
	update?: Partial<Post<PROP_METADATA>>;
	ephemeral_text?: string;
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
 * @todo Find where it is used
 */
export interface PostActivityEntry {
	postType: PostType;
	actorId: string[];
	userIds: string[];
	usernames: string[];
}

/**
 * @todo Find where it is used
 */
export interface PostInfo {
	channel_id: string;
	channel_type: ChannelType;
	channel_display_name: string;
	has_joined_channel: boolean;
	team_id: string;
	team_type: TeamType;
	team_display_name: string;
	has_joined_team: boolean;
}
