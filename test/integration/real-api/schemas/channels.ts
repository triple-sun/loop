import type { FileInfo } from "./files";

/**
 * ===============================================
 * @description Channel main object
 * ===============================================
 */
export type Channel = {
	id: string;
	create_at: number;
	update_at: number;
	delete_at: number;
	team_id: string;
	type: ChannelType;
	display_name: string;
	name: string;
	header: string;
	purpose: string;
	last_post_at: number;
	total_msg_count: number;
	extra_update_at: number;
	creator_id: string;

	scheme_id?: string | null;
	props?: Record<string, unknown> | null;
	group_constrained?: boolean | null;
	shared?: boolean | null;
	total_msg_count_root: number;
	policy_id: string | null;
	last_root_post_at: number;
};

/**
 * ===============================================
 * @description Channel enums
 * ===============================================
 */
export enum ChannelType {
	OPEN = "O",
	PRIVATE = "P",
	DIRECT = "D",
	GROUP = "G",
	THREADS = "threads"
}

export enum ChannelNotify {
	DEFAULT = "default",
	ALL = "all",
	MENTION = "mention",
	NONE = "none"
}

export enum ChannelNotifyDesktopSound {
	BING = "Bing",
	CRACKLE = "Crackle",
	DOWN = "Down",
	HELLO = "Hello",
	RIPPLE = "Ripple",
	UPSTAIRS = "Upstairs"
}

/**
 * ===============================================
 * @description Channels general types
 * ===============================================
 */

export interface ServerChannel extends Channel {
	/**
	 * The total number of posts in this channel, not including join/leave messages
	 *
	 * @remarks This field will be moved to a {@link ChannelMessageCount} object when this channel is stored in Redux.
	 */
	total_msg_count: number;

	/**
	 * The number of root posts in this channel, not including join/leave messages
	 *
	 * @remarks This field will be moved to a {@link ChannelMessageCount} object when this channel is stored in Redux.
	 */
	total_msg_count_root: number;
}

/**
 * ===============================================
 * @description Channels category types
 * ===============================================
 */

export enum ChannelCategoryType {
	FAVORITES = "favorites",
	CHANNELS = "channels",
	DIRECTT_MESSAGES = "direct_messages",
	CUSTOM = "custom"
}

export enum ChannelCategorySorting {
	ALPHABETICAL = "alpha",
	DEFAULT = "", // behaves the same as manual
	RECENCY = "recent",
	MANUAL = "manual"
}

export interface ChannelCategory {
	id: string;
	user_id: string;
	team_id: string;
	type: ChannelCategoryType;
	display_name: string;
	sorting: ChannelCategorySorting;
	channel_ids: string[];
	muted: boolean;
	collapsed: boolean;
}

export interface OrderedChannelCategories {
	categories: ChannelCategory[];
	order: string[];
}

/**
 * ===============================================
 * @description Channels bookmark types
 * ===============================================
 */

export enum ChannelBookmarkType {
	LINK = "link",
	FILE = "file"
}

export type ChannelBookmark = {
	id: string;
	create_at: number;
	update_at: number;
	delete_at: number;
	channel_id: string;
	owner_id: string;
	file_id?: string;
	file?: FileInfo;
	display_name: string;
	sort_order: number;
	link_url?: string;
	image_url?: string;
	emoji?: string;
	type: ChannelBookmarkType;
	original_id?: string;
	parent_id?: string;
};

export interface ChannelBookmarkCreateLink {
	type: ChannelBookmarkType.LINK;
	link_url: string;
}
export interface ChannelBookmarkCreateFile {
	type: ChannelBookmarkType.FILE;
	file_id: string;
}

export interface ChannelBookmarkCreateBase {
	display_name: string;
	image_url?: string;
	emoji?: string;
}

export type ChannelBookmarkCreate = ChannelBookmarkCreateBase &
	(ChannelBookmarkCreateLink | ChannelBookmarkCreateFile);

export interface ChannelBookmarkPatch {
	file_id?: string;
	display_name?: string;
	sort_order?: number;
	link_url?: string;
	image_url?: string;
	emoji?: string;
}

export interface ChannelBookmarkWithFileInfo extends ChannelBookmark {
	file?: FileInfo;
}

/**
 * ===============================================
 * @description Channels other types
 * ===============================================
 */

export interface ChannelMessageCount {
	/** The total number of posts in this channel, not including join/leave messages */
	total: number;

	/** The number of root posts in this channel, not including join/leave messages */
	root: number;
}

export interface ChannelModeration {
	name: string;
	roles: {
		guests?: {
			value: boolean;
			enabled: boolean;
		};
		members: {
			value: boolean;
			enabled: boolean;
		};
		admins: {
			value: boolean;
			enabled: boolean;
		};
	};
}

export interface ChannelModerationPatch {
	name: string;
	roles: {
		guests?: boolean;
		members?: boolean;
	};
}

export interface ChannelWithTeamData extends Channel {
	team_display_name: string;
	team_name: string;
	team_update_at: number;
}

export interface ChannelsWithTotalCount {
	channels: ChannelWithTeamData[];
	total_count: number;
}

export interface ChannelMemberCountByGroup {
	group_id: string;
	channel_member_count: number;
	channel_member_timezones_count: number;
}

export interface ChannelMemberCountsByGroup {
	[channelId: string]: ChannelMemberCountByGroup;
}

/**
 * ===============================================
 * @description Channel responses types
 * ===============================================
 */

export interface ChannelViewResponse {
	status: string;
	last_viewed_at_times: { [channelId: string]: number };
}

export interface ChannelStats {
	channel_id: string;
	member_count: number;
	guest_count: number;
	pinnedpost_count: number;
	files_count: number;
}

export interface ChannelMembership {
	channel_id: string;
	user_id: string;
	roles: string;
	last_viewed_at: number;

	/** The number of posts in this channel which have been read by the user */
	msg_count: number;

	/** The number of root posts in this channel which have been read by the user */
	msg_count_root: number;

	/** The number of unread mentions in this channel */
	mention_count: number;

	/** The number of unread mentions in root posts in this channel */
	mention_count_root: number;

	/** The number of unread urgent mentions in this channel */
	urgent_mention_count: number;

	notify_props: Partial<ChannelNotifyPropsResponse>;
	last_update_at: number;
	scheme_user: boolean;
	scheme_admin: boolean;
	post_root_id?: string;
}

export interface ChannelNotifyPropsResponse {
	desktop_threads: ChannelNotify;
	desktop: ChannelNotify;
	desktop_sound: "on" | "off";
	desktop_notification_sound?: ChannelNotifyDesktopSound;
	email: ChannelNotify;
	mark_unread: ChannelNotify;
	push: ChannelNotify;
	push_threads: ChannelNotify;
	ignore_channel_mentions: "default" | "off" | "on";
	channel_auto_follow_threads: "off" | "on";
}

export interface ChannelUnreadResponse {
	channel_id: string;
	user_id: string;
	team_id: string;

	/** The number of posts which have been read by the user */
	msg_count: number;

	/** The number of root posts which have been read by the user */
	msg_count_root: number;

	/** The number of unread mentions in this channel */
	mention_count: number;

	/** The number of unread urgent mentions in this channel */
	urgent_mention_count: number;

	/** The number of unread mentions in root posts in this channel */
	mention_count_root: number;

	last_viewed_at: number;
	deltaMsgs: number;
}
