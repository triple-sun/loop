import type {
	Channel,
	ChannelBookmark,
	ChannelBookmarkWithFileInfo,
	ChannelCategory,
	ChannelMembership,
	ChannelType,
	ClientConfig,
	ClientLicense,
	CloudLimits,
	CloudSubscription,
	CustomEmoji,
	Dialog,
	Draft,
	Group,
	GroupMember as GroupMemberType,
	PluginManifest,
	PluginStatus,
	Post,
	PostAcknowledgement as PostAcknowledgementType,
	Preference,
	PropertyField,
	PropertyValue,
	Reaction,
	Role,
	ScheduledPost as ScheduledPostType,
	TeamMembership,
	Team as TeamType,
	UserProfile,
	UserStatusValue,
	UserThread
} from "loop-types";
import type { LoopEvent } from "./events";

export type JsonValue<_JSON_TYPE> = string;
export type Response = BaseWebSocketMessage<LoopEvent.RESPONSE>;

export type BaseWebSocketMessage<Event, DATA = Record<string, never>> = {
	event: Event;
	data: DATA;
	broadcast: WebSocketBroadcast;
	seq: number;
	seq_reply?: number;
	error?: unknown;
};

export type WebSocketBroadcast = {
	omit_users: Record<string, boolean> | null;
	user_id: string | "";
	channel_id: string | "";
	team_id: string | "";
	connection_id: string | "";
	omit_connection_id: string | "";
};

export type Hello = BaseWebSocketMessage<
	LoopEvent.HELLO,
	{
		server_version: string;
		connection_id: string;
		server_hostname?: string;
	}
>;

export type AuthenticationChallenge = BaseWebSocketMessage<
	LoopEvent.AUTHENTICATION_CHALLENGE,
	unknown
>;

// Post, reactions, and acknowledgement messages

export type Posted = BaseWebSocketMessage<
	LoopEvent.POSTED,
	{
		channel_type: ChannelType;
		channel_display_name: string;
		channel_name: string;
		sender_name: string;
		team_id: string;
		set_online: boolean;
		otherFile?: boolean;
		image?: boolean;
		post: JsonValue<Post>;

		/**
		 * If the current user is mentioned by this post, this field will contain the ID of that user. Otherwise,
		 * it will be empty.
		 */
		mentions?: JsonValue<string[]>;

		/**
		 * If the current user is following this post, this field will contain the ID of that user. Otherwise,
		 * it will be empty.
		 */
		followers?: JsonValue<string[]>;

		should_ack?: boolean;
	}
>;

export type PostEdited = BaseWebSocketMessage<
	LoopEvent.POST_EDITED,
	{
		post: JsonValue<Post>;
	}
>;

export type PostDeleted = BaseWebSocketMessage<
	LoopEvent.POST_DELETED,
	{
		post: JsonValue<Post>;

		/** The user ID of the user who deleted the post, only sent to admin users. */
		delete_by?: string;
	}
>;

export type PostUnread = BaseWebSocketMessage<
	LoopEvent.POST_UNREAD,
	{
		msg_count: number;
		msg_count_root: number;
		mention_count: number;
		mention_count_root: number;
		urgent_mention_count: number;
		last_viewed_at: number;
		post_id: string;
	}
>;

export type BurnOnReadPostRevealed = BaseWebSocketMessage<
	LoopEvent.BURN_ON_READ_POST_REVEALED,
	{
		post?: string | Post;
		recipients?: string[];
	}
>;

export type BurnOnReadPostBurned = BaseWebSocketMessage<
	LoopEvent.BURN_ON_READ_POST_BURNED,
	{
		post_id: string;
	}
>;

export type BurnOnReadPostAllRevealed = BaseWebSocketMessage<
	LoopEvent.BURN_ON_READ_POST_ALL_REVEALED,
	{
		post_id: string;
		sender_expire_at: number;
	}
>;

export type EphemeralPost = BaseWebSocketMessage<
	LoopEvent.EPHEMERAL_MESSAGE,
	{
		post: JsonValue<Post>;
	}
>;

export type PostReaction = BaseWebSocketMessage<
	LoopEvent.REACTION_ADDED | LoopEvent.REACTION_REMOVED,
	{
		reaction: JsonValue<Reaction>;
	}
>;

export type PostAcknowledgement = BaseWebSocketMessage<
	LoopEvent.POST_ACKNOWLEDGEMENT_ADDED | LoopEvent.POST_ACKNOWLEDGEMENT_REMOVED,
	{
		acknowledgement: JsonValue<PostAcknowledgementType>;
	}
>;

export type PostDraft = BaseWebSocketMessage<
	LoopEvent.DRAFT_CREATED | LoopEvent.DRAFT_UPDATED | LoopEvent.DRAFT_DELETED,
	{
		draft: JsonValue<Draft>;
	}
>;

export type PersistentNotificationTriggered = BaseWebSocketMessage<
	LoopEvent.PERSISTENT_NOTIFICATION_TRIGGERED,
	{
		post: JsonValue<Post>;
		channel_type: ChannelType;
		channel_display_name: string;
		channel_name: string;
		sender_name: string;
		team_id: string;
		otherFile?: boolean;
		image?: boolean;
		mentions?: JsonValue<string[]>;
	}
>;

export type ScheduledPost = BaseWebSocketMessage<
	| LoopEvent.SCHEDULED_POST_CREATED
	| LoopEvent.SCHEDULED_POST_UPDATED
	| LoopEvent.SCHEDULED_POST_DELETED,
	{
		scheduledPost: JsonValue<ScheduledPostType>;
	}
>;

// Thread messages

export type ThreadUpdated = BaseWebSocketMessage<
	LoopEvent.THREAD_UPDATED,
	{
		thread: JsonValue<UserThread>;

		previous_unread_mentions?: number;
		previous_unread_replies?: number;
	}
>;

export type ThreadFollowedChanged = BaseWebSocketMessage<
	LoopEvent.THREAD_FOLLOW_CHANGED,
	{
		thread_id: string;
		state: boolean;
		reply_count: number;
	}
>;

export type ThreadReadChanged = BaseWebSocketMessage<
	LoopEvent.THREAD_READ_CHANGED,
	{
		thread_id?: string;
		timestamp: number;
		unread_mentions?: number;
		unread_replies?: number;
		previous_unread_mentions?: number;
		previous_unread_replies?: number;
		channel_id?: string;
	}
>;

// Channel and channel member messages

export type ChannelCreated = BaseWebSocketMessage<
	LoopEvent.CHANNEL_CREATED,
	{
		channel_id: string;
		team_id: string;
	}
>;

export type ChannelUpdated = BaseWebSocketMessage<
	LoopEvent.CHANNEL_UPDATED,
	{
		// Normally, the channel field is sent, except in some cases where a shared channel is updated in which case
		// the channel_id field is used.

		channel?: JsonValue<Channel>;
		channel_id?: string;
	}
>;

export type ChannelConverted = BaseWebSocketMessage<
	LoopEvent.CHANNEL_CONVERTED,
	{
		channel_id: string;
	}
>;

export type ChannelSchemeUpdated =
	BaseWebSocketMessage<LoopEvent.CHANNEL_SCHEME_UPDATED>;

export type ChannelDeleted = BaseWebSocketMessage<
	LoopEvent.CHANNEL_DELETED,
	{
		channel_id: string;
		delete_at: number;
	}
>;

export type ChannelRestored = BaseWebSocketMessage<
	LoopEvent.CHANNEL_RESTORED,
	{
		channel_id: string;
	}
>;

export type DirectChannelCreated = BaseWebSocketMessage<
	LoopEvent.DIRECT_ADDED,
	{
		creator_id: string;
		teammate_id: string;
	}
>;

export type GroupChannelCreated = BaseWebSocketMessage<
	LoopEvent.GROUP_ADDED,
	{
		teammate_ids: JsonValue<string[]>;
	}
>;

export type UserAddedToChannel = BaseWebSocketMessage<
	LoopEvent.USER_ADDED,
	{
		user_id: string;
		team_id: string;
	}
>;

export type UserRemovedFromChannel = BaseWebSocketMessage<
	LoopEvent.USER_REMOVED,
	{
		/** The user ID of the user that was removed from the channel. It isn't sent to the user who was removed. */
		user_id?: string;

		/** The ID of the channel that the user was removed from. It's only sent to the user who was removed. */
		channel_id?: string;

		remover_id: string;
	}
>;

export type ChannelMemberUpdated = BaseWebSocketMessage<
	LoopEvent.CHANNEL_MEMBER_UPDATED,
	{
		channelMember: JsonValue<ChannelMembership>;
	}
>;

export type MultipleChannelsViewed = BaseWebSocketMessage<
	LoopEvent.MULTIPLE_CHANNELS_VIEWED,
	{
		channel_times: Record<string, number>;
	}
>;

// Channel bookmark messages

export type ChannelBookmarkCreated = BaseWebSocketMessage<
	LoopEvent.CHANNEL_BOOKMARK_CREATED,
	{
		bookmark: JsonValue<ChannelBookmarkWithFileInfo>;
	}
>;

export type ChannelBookmarkUpdated = BaseWebSocketMessage<
	LoopEvent.CHANNEL_BOOKMARK_UPDATED,
	{
		bookmarks: JsonValue<ChannelBookmark>;
	}
>;

export type ChannelBookmarkDeleted = BaseWebSocketMessage<
	LoopEvent.CHANNEL_BOOKMARK_DELETED,
	{
		bookmark: JsonValue<ChannelBookmarkWithFileInfo>;
	}
>;

export type ChannelBookmarkSorted = BaseWebSocketMessage<
	LoopEvent.CHANNEL_BOOKMARK_SORTED,
	{
		bookmarks: JsonValue<ChannelBookmarkWithFileInfo[]>;
	}
>;

// Team and team member messages

export type Team = BaseWebSocketMessage<
	LoopEvent.UPDATE_TEAM | LoopEvent.DELETE_TEAM | LoopEvent.RESTORE_TEAM,
	{
		team: JsonValue<TeamType>;
	}
>;

export type UserAddedToTeam = BaseWebSocketMessage<
	LoopEvent.ADDED_TO_TEAM,
	{
		team_id: string;
		user_id: string;
	}
>;

export type UserRemovedFromTeam = BaseWebSocketMessage<
	LoopEvent.LEAVE_TEAM,
	{
		user_id: string;
		team_id: string;
	}
>;

export type UpdateTeamScheme = BaseWebSocketMessage<
	LoopEvent.UPDATE_TEAM_SCHEME,
	{
		team: JsonValue<Team>;
	}
>;

export type TeamMemberRoleUpdated = BaseWebSocketMessage<
	LoopEvent.MEMBER_ROLE_UPDATED,
	{
		member: JsonValue<TeamMembership>;
	}
>;

// User and status messages

export type NewUser = BaseWebSocketMessage<
	LoopEvent.NEW_USER,
	{
		user_id: string;
	}
>;

export type UserUpdated = BaseWebSocketMessage<
	LoopEvent.USER_UPDATED,
	{
		/** This user may be missing sensitive data based on if the recipient is that user or an admin. */
		user: UserProfile;
	}
>;

export type UserActivationStatusChanged =
	BaseWebSocketMessage<LoopEvent.USER_ACTIVATION_STATUS_CHANGE>;

export type UserRoleUpdated = BaseWebSocketMessage<
	LoopEvent.USER_ROLE_UPDATED,
	{
		user_id: string;
		roles: string;
	}
>;

export type StatusChanged = BaseWebSocketMessage<
	LoopEvent.STATUS_CHANGE,
	{
		status: UserStatusValue;
		user_id: string;
	}
>;

export type Typing = BaseWebSocketMessage<
	LoopEvent.TYPING,
	{
		parent_id: string;
		user_id: string;
	}
>;

// Group-related messages

export type ReceivedGroup = BaseWebSocketMessage<
	LoopEvent.RECEIVED_GROUP,
	{
		group: JsonValue<Group>;
	}
>;

export type GroupAssociatedToTeam = BaseWebSocketMessage<
	| LoopEvent.RECEIVED_GROUP_ASSOCIATED_TO_TEAM
	| LoopEvent.RECEIVED_GROUP_NOT_ASSOCIATED_TO_TEAM,
	{
		group_id: string;
	}
>;

export type GroupAssociatedToChannel = BaseWebSocketMessage<
	| LoopEvent.RECEIVED_GROUP_ASSOCIATED_TO_CHANNEL
	| LoopEvent.RECEIVED_GROUP_NOT_ASSOCIATED_TO_CHANNEL,
	{
		group_id: string;
	}
>;

export type GroupMember = BaseWebSocketMessage<
	LoopEvent.GROUP_MEMBER_ADDED | LoopEvent.GROUP_MEMBER_DELETED,
	{
		group_member: JsonValue<GroupMemberType>;
	}
>;

// Preference messages

export type PreferenceChanged = BaseWebSocketMessage<
	LoopEvent.PREFERENCE_CHANGED,
	{
		preference: JsonValue<Preference>;
	}
>;

export type PreferencesChanged = BaseWebSocketMessage<
	LoopEvent.PREFERENCES_CHANGED | LoopEvent.PREFERENCES_DELETED,
	{
		preferences: JsonValue<Preference[]>;
	}
>;

// Channel sidebar messages

export type SidebarCategoryCreated = BaseWebSocketMessage<
	LoopEvent.SIDEBAR_CATEGORY_CREATED,
	{
		category_id: string;
	}
>;

export type SidebarCategoryUpdated = BaseWebSocketMessage<
	LoopEvent.SIDEBAR_CATEGORY_UPDATED,
	{
		updatedCategories: JsonValue<ChannelCategory[]>;
	}
>;

export type SidebarCategoryDeleted = BaseWebSocketMessage<
	LoopEvent.SIDEBAR_CATEGORY_DELETED,
	{
		category_id: string;
	}
>;

export type SidebarCategoryOrderUpdated = BaseWebSocketMessage<
	LoopEvent.SIDEBAR_CATEGORY_ORDER_UPDATED,
	{
		order: string[];
	}
>;

// Emoji messages

export type EmojiAdded = BaseWebSocketMessage<
	LoopEvent.EMOJI_ADDED,
	{
		emoji: JsonValue<Omit<CustomEmoji, "category">>;
	}
>;

// Role messages

export type RoleUpdated = BaseWebSocketMessage<
	LoopEvent.ROLE_UPDATED,
	{
		role: JsonValue<Role>;
	}
>;

// Configuration and license messages

export type ConfigChanged = BaseWebSocketMessage<
	LoopEvent.CONFIG_CHANGED,
	{
		config: ClientConfig;
	}
>;

export type GuestsDeactivated =
	BaseWebSocketMessage<LoopEvent.GUESTS_DEACTIVATED>;

export type LicenseChanged = BaseWebSocketMessage<
	LoopEvent.LICENSE_CHANGED,
	{
		license: ClientLicense;
	}
>;

export type CloudSubscriptionChanged = BaseWebSocketMessage<
	LoopEvent.CLOUD_SUBSCRIPTION_CHANGED,
	{
		limits?: CloudLimits;
		subscription: CloudSubscription;
	}
>;

export type FirstAdminVisitMarketplaceStatusReceived = BaseWebSocketMessage<
	LoopEvent.FIRST_ADMIN_VISIT_MARKETPLACE_STATUS_RECEIVED,
	{
		firstAdminVisitMarketplaceStatus: JsonValue<boolean>;
	}
>;

export type HostedCustomerSignupProgressUpdated = BaseWebSocketMessage<
	LoopEvent.HOSTED_CUSTOMER_SIGNUP_PROGRESS_UPDATED,
	{
		progress: string;
	}
>;

// Custom properties messages

export type CPAFieldCreated = BaseWebSocketMessage<
	LoopEvent.CPA_FIELD_CREATED,
	{
		field: PropertyField;
	}
>;

export type CPAFieldUpdated = BaseWebSocketMessage<
	LoopEvent.CPA_FIELD_UPDATED,
	{
		field: PropertyField;
		delete_values: boolean;
	}
>;

export type CPAFieldDeleted = BaseWebSocketMessage<
	LoopEvent.CPA_FIELD_DELETED,
	{
		field_id: string;
	}
>;

export type CPAValuesUpdated = BaseWebSocketMessage<
	LoopEvent.CPA_VALUES_UPDATED,
	{
		user_id: string;
		values: Array<PropertyValue<unknown>>;
	}
>;

// Content flagging messages

export type ContentFlaggingReportValueUpdated = BaseWebSocketMessage<
	LoopEvent.CONTENT_FLAGGING_REPORT_VALUE_UPDATED,
	{
		property_values: JsonValue<Array<PropertyValue<unknown>>>;
		target_id: string;
	}
>;

// Recap messages

export type RecapUpdated = BaseWebSocketMessage<
	LoopEvent.RECAP_UPDATED,
	{
		recap_id: string;
	}
>;

export type PostTranslationUpdated = BaseWebSocketMessage<
	LoopEvent.POST_TRANSLATION_UPDATED,
	{
		language: string;
		object_id: string;
		src_lang: string;
		state: "ready" | "skipped" | "processing" | "unavailable";
		translation: string;
	}
>;

// Plugin and integration messages

export type Plugin = BaseWebSocketMessage<
	LoopEvent.PLUGIN_ENABLED | LoopEvent.PLUGIN_DISABLED,
	{
		manifest: PluginManifest;
	}
>;

export type PluginStatusesChanged = BaseWebSocketMessage<
	LoopEvent.PLUGIN_STATUSES_CHANGED,
	{
		plugin_statuses: PluginStatus[];
	}
>;

export type OpenDialog = BaseWebSocketMessage<
	LoopEvent.OPEN_DIALOG,
	{
		dialog: JsonValue<Dialog>;
	}
>;

/**
 * Unknown is used for WebSocket messages which don't come from Loop itself. It's primarily intended for use
 * by plugins.
 */
export type Unknown = BaseWebSocketMessage<string, unknown>;

export type LoopMessage =
	| Hello
	| AuthenticationChallenge
	| Response
	| Posted
	| PostEdited
	| PostDeleted
	| PostUnread
	| BurnOnReadPostRevealed
	| BurnOnReadPostBurned
	| BurnOnReadPostAllRevealed
	| EphemeralPost
	| PostReaction
	| PostAcknowledgement
	| PostDraft
	| PersistentNotificationTriggered
	| ScheduledPost
	| PostTranslationUpdated
	| ThreadUpdated
	| ThreadFollowedChanged
	| ThreadReadChanged
	| ChannelCreated
	| ChannelUpdated
	| ChannelConverted
	| ChannelSchemeUpdated
	| ChannelDeleted
	| ChannelRestored
	| DirectChannelCreated
	| GroupChannelCreated
	| UserAddedToChannel
	| UserRemovedFromChannel
	| ChannelMemberUpdated
	| MultipleChannelsViewed
	| ChannelBookmarkCreated
	| ChannelBookmarkUpdated
	| ChannelBookmarkDeleted
	| ChannelBookmarkSorted
	| Team
	| UpdateTeamScheme
	| UserAddedToTeam
	| UserRemovedFromTeam
	| TeamMemberRoleUpdated
	| NewUser
	| UserUpdated
	| UserActivationStatusChanged
	| UserRoleUpdated
	| StatusChanged
	| Typing
	| ReceivedGroup
	| GroupAssociatedToTeam
	| GroupAssociatedToChannel
	| GroupMember
	| PreferenceChanged
	| PreferencesChanged
	| SidebarCategoryCreated
	| SidebarCategoryUpdated
	| SidebarCategoryDeleted
	| SidebarCategoryOrderUpdated
	| EmojiAdded
	| RoleUpdated
	| ConfigChanged
	| GuestsDeactivated
	| LicenseChanged
	| CloudSubscriptionChanged
	| FirstAdminVisitMarketplaceStatusReceived
	| HostedCustomerSignupProgressUpdated
	| CPAFieldCreated
	| CPAFieldUpdated
	| CPAFieldDeleted
	| CPAValuesUpdated
	| ContentFlaggingReportValueUpdated
	| RecapUpdated
	| Plugin
	| PluginStatusesChanged
	| OpenDialog
	| BaseWebSocketMessage<LoopEvent.PRESENCE_INDICATOR, unknown>
	| BaseWebSocketMessage<LoopEvent.POSTED_NOTIFY_ACK, unknown>;
