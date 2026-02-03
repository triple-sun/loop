import type { Channel, ChannelModerationPatch, ChannelType } from "../channels";
import type {
	ChannelID,
	Paginated,
	TeamID,
	TokenOverridable,
	UserID
} from "./common.methods";

export interface ChannelsCreateArguments extends TokenOverridable, TeamID {
	/** The unique handle for the channel, will be present in the channel URL */
	name: string;
	/** The non-unique UI name for the channel */
	display_name: string;
	/** 'O' for a public channel, 'P' for a private channel */
	type: ChannelType;
	/** A short description of the purpose of the channel */
	purpose?: string;
	/** Markdown-formatted text to display in the header of the channel */
	header?: string;
}

/**
 * Arguments for creating a direct message channel.
 * Tuple of two user IDs to include in the direct message.
 * Use single user_id to use currently authorized user
 */
export interface ChannelsCreateDirectArguments extends TokenOverridable {
	user_ids: [string, string] | [string];
}

/**
 * Arguments for creating a group message channel.
 */
export interface ChannelsCreateGroupArguments extends TokenOverridable {
	/** User IDs to be added to the group message channel */
	user_ids: string[];
}

/**
 * Arguments for listing channels in a team.
 */
export interface ChannelsListAllArguments extends TokenOverridable, Paginated {
	/**
	 * @description A group id to exclude channels that are associated with that group via GroupChannel records.
	 * This can also be left blank with not_associated_to_group=.
	 * */
	not_associated_to_group?: string;

	/**
	 * @description Whether to exclude default channels
	 * (ex Town Square, Off-Topic) from the results.
	 */
	exclude_default_channels?: boolean;

	/**
	 * @description Include channels that have been archived.
	 * This correlates to the DeleteAt flag being set in the database.
	 */
	include_deleted?: boolean;

	/**
	 * @description If set to true, channels which are part of a data retention policy will be excluded.
	 * The sysconsole_read_compliance permission is required to use this parameter.
	 * @version 5.35+
	 */
	exclude_policy_constrained?: boolean;
}

/**
 * Arguments for listing channels in a team.
 */
export interface ChannelsListInTeamArguments
	extends TokenOverridable,
		Paginated,
		TeamID {
	/** Include the total count of channels in the response */
	include_total_count?: boolean;
	/** Include deleted channels in the response */
	include_deleted?: boolean;
	/** Exclude default channels from search results */
	exclude_default_channels?: boolean;
	/** If set, exclude channels that are associated to the given group */
	not_associated_to_group?: string;
}

/**
 * Arguments for getting a channel by ID.
 */
export interface ChannelsGetByIdArguments extends TokenOverridable, ChannelID {}

/**
 * Arguments for getting a channel by display_name.
 */
export interface ChannelsGetByNameArguments extends TokenOverridable, TeamID {
	/**
	 * @description channel display name
	 */
	channel_name: string;
	/**
	 * @description Defines if deleted channels should be returned or not
	 * @version 5.26.0+
	 */
	include_deleted?: boolean;
}

/**
 * Arguments for updating a channel.
 */
export interface ChannelsUpdateArguments
	extends TokenOverridable,
		ChannelID,
		Partial<Channel> {}

/**
 * Arguments for deleting a channel.
 */
export interface ChannelsDeleteArguments extends TokenOverridable, ChannelID {}

/**
 * Arguments for patching a channel.
 */
export interface ChannelsPatchArguments
	extends TokenOverridable,
		ChannelID,
		Partial<Channel> {}

/**
 * Arguments for restoring a deleted channel.
 */
export interface ChannelsRestoreArguments extends TokenOverridable, ChannelID {}

/**
 * Arguments for getting channel statistics.
 */
export interface ChannelsGetStatsArguments
	extends TokenOverridable,
		ChannelID {}

/**
 * Arguments for searching channels in a team.
 */
export interface ChannelsSearchArguments
	extends TokenOverridable,
		TeamID,
		Paginated {
	/** The search term to match against channel names and display names */
	term: string;
	/** If set, exclude channels that are associated to the given group */
	not_associated_to_group?: string;
	/** Exclude default channels from search results */
	exclude_default_channels?: boolean;
	/** Include deleted channels in search results */
	include_deleted?: boolean;
	/** Filter by deleted status */
	deleted?: boolean;
	/** Include public channels */
	public?: boolean;
	/** Include private channels */
	private?: boolean;
	/** Exclude group constrained channels */
	exclude_group_constrained?: boolean;
}

/**
 * Arguments for viewing a channel (marking it as read/viewed).
 */
export interface ChannelsViewArguments extends TokenOverridable, ChannelID {
	/** The ID of the previous channel visited */
	prev_channel_id?: string;
}

/**
 * Arguments for getting a channel member.
 */
export interface ChannelsMemberArguments
	extends TokenOverridable,
		ChannelID,
		UserID {}

/**
 * Arguments for getting channel members.
 */
export interface ChannelsMembersArguments
	extends TokenOverridable,
		ChannelID,
		Paginated {}

/**
 * Arguments for searching all channels.
 */
export interface ChannelsSearchAllArguments extends TokenOverridable {
	term: string;
	not_associated_to_group?: string;
	exclude_default_channels?: boolean;
	include_deleted?: boolean;
	exclude_group_constrained?: boolean;
	public?: boolean;
	private?: boolean;
	deleted?: boolean;
	page?: number;
	per_page?: number;
}

/**
 * Arguments for searching archived channels.
 */
export interface ChannelsSearchArchivedArguments
	extends TokenOverridable,
		TeamID,
		Paginated {
	term: string;
}

/**
 * Arguments for autocompleting channels.
 */
export interface ChannelsAutocompleteArguments
	extends TokenOverridable,
		TeamID {
	/**
	 * @description name or display name
	 */
	name: string;
}

/**
 * Arguments for getting channels by IDs.
 */
export interface ChannelsGetByIdsArguments extends TokenOverridable, TeamID {
	channel_ids: string[];
}

// ============================================================================
// Channel Member Operations
// ============================================================================

/**
 * Arguments for adding a user to a channel.
 * @see https://developers.loop.ru/API/4.0.0/add-channel-member
 */
export interface ChannelsMemberAddArguments
	extends TokenOverridable,
		ChannelID {
	/** The user ID to add to the channel */
	user_id: string;
	/** Optional post root ID for context */
	post_root_id?: string;
}

/**
 * Arguments for removing a user from a channel.
 * @see https://developers.loop.ru/API/4.0.0/remove-user-from-channel
 */
export interface ChannelsMemberRemoveArguments
	extends TokenOverridable,
		ChannelID,
		UserID {}

/**
 * Arguments for getting channel members by user IDs.
 * @see https://developers.loop.ru/API/4.0.0/get-channel-members-by-ids
 */
export interface ChannelsMembersGetByIdsArguments
	extends TokenOverridable,
		ChannelID {
	/** Array of user IDs to look up */
	user_ids: string[];
}

/**
 * Arguments for updating channel member roles.
 * @see https://developers.loop.ru/API/4.0.0/update-channel-roles
 */
export interface ChannelsMemberUpdateRolesArguments
	extends TokenOverridable,
		ChannelID,
		UserID {
	/** Space-separated list of roles to assign */
	roles: string;
}

/**
 * Arguments for updating channel member scheme roles.
 * @see https://developers.loop.ru/API/4.0.0/update-channel-member-scheme-roles
 */
export interface ChannelsMemberUpdateSchemeRolesArguments
	extends TokenOverridable,
		ChannelID,
		UserID {
	/** Whether user is a scheme admin */
	scheme_admin: boolean;
	/** Whether user is a scheme user */
	scheme_user: boolean;
}

/**
 * Arguments for updating channel member notification properties.
 * @see https://developers.loop.ru/API/4.0.0/update-channel-notify-props
 */
export interface ChannelsMemberUpdateNotifyPropsArguments
	extends TokenOverridable,
		ChannelID,
		UserID {
	/** Notification properties to update */
	desktop?: string;
	email?: string;
	push?: string;
	mark_unread?: string;
}

// ============================================================================
// Core Channel Operations
// ============================================================================

/**
 * Arguments for updating a channel's privacy.
 * @description Convert a public channel to private or vice-versa.
 * @see https://developers.loop.ru/API/4.0.0/update-channel-privacy
 */
export interface ChannelsUpdatePrivacyArguments
	extends TokenOverridable,
		ChannelID {
	/** The new privacy setting: 'O' for public, 'P' for private */
	privacy: "O" | "P";
}

/**
 * Arguments for moving a channel to another team.
 * @description Move a channel to a different team.
 * @see https://developers.loop.ru/API/4.0.0/move-channel
 */
export interface ChannelsMoveArguments extends TokenOverridable, ChannelID {
	/** The team ID to move the channel to */
	team_id: string;
	/** Whether to force the move even if there are scheme-assigned members */
	force?: boolean;
}

/**
 * Arguments for getting pinned posts in a channel.
 * @description Get a list of pinned posts in a channel.
 * @see https://developers.loop.ru/API/4.0.0/get-channel-pinned-posts
 */
export interface ChannelsGetPinnedArguments
	extends TokenOverridable,
		ChannelID {}

/**
 * Arguments for getting user timezones in a channel.
 * @description Get a list of timezones of users in a channel.
 * @see https://developers.loop.ru/API/4.0.0/get-channel-timezones
 */
export interface ChannelsGetTimezonesArguments
	extends TokenOverridable,
		ChannelID {}

// ============================================================================
// Channel Discovery (Missing)
// ============================================================================

/**
 * Arguments for listing private channels in a team.
 * @description Get a list of private channels in a specific team.
 * @see https://developers.loop.ru/API/4.0.0/get-private-channels
 */
export interface ChannelsListPrivateArguments
	extends TokenOverridable,
		TeamID,
		Paginated {}

/**
 * Arguments for listing deleted channels in a team.
 * @description Get a list of deleted (archived) channels in a team.
 * @see https://developers.loop.ru/API/4.0.0/get-deleted-channels
 */
export interface ChannelsListDeletedArguments
	extends TokenOverridable,
		TeamID,
		Paginated {
	/** Include the total count in response */
	include_total_count?: boolean;
}

/**
 * Arguments for autocompleting channels for search.
 * @description Autocomplete channels for search in a team.
 * @see https://developers.loop.ru/API/4.0.0/autocomplete-channels-for-search
 */
export interface ChannelsSearchAutocompleteArguments
	extends TokenOverridable,
		TeamID {
	/** The search term */
	name: string;
}

/**
 * Arguments for searching group channels.
 * @description Search for group message channels.
 * @see https://developers.loop.ru/API/4.0.0/search-group-channels
 */
export interface ChannelsSearchGroupsArguments extends TokenOverridable {
	/** The search term to match against group names */
	term: string;
}

// ============================================================================
// Channel Member Operations (Missing)
// ============================================================================

/**
 * Arguments for getting all channels for a user in a team.
 * @description Get all channel memberships and roles for a user in a team.
 * @see https://developers.loop.ru/API/4.0.0/get-channels-for-user
 */
export interface ChannelsGetForUserArguments
	extends TokenOverridable,
		UserID,
		TeamID {
	/** Include deleted channels */
	include_deleted?: boolean;
	/** Include the last deleted channel */
	last_delete_at?: number;
}

/**
 * Arguments for getting all channels for a user across all teams.
 * @description Get all channel memberships for a user.
 * @see https://developers.loop.ru/API/4.0.0/get-all-channels-for-user
 */
export interface ChannelsGetAllForUserArguments
	extends TokenOverridable,
		UserID {
	/** Include deleted channels */
	include_deleted?: boolean;
	/** Include the last deleted channel */
	last_delete_at?: number;
}

/**
 * Arguments for getting unread count for a channel.
 * @description Get the unread message and mention counts for a user in a channel.
 * @see https://developers.loop.ru/API/4.0.0/get-channel-unread
 */
export interface ChannelsGetUnreadArguments
	extends TokenOverridable,
		UserID,
		ChannelID {}

/**
 * Arguments for getting channel members minus group members.
 * @description Get channel members who are not part of specified groups.
 * @see https://developers.loop.ru/API/4.0.0/channel-members-minus-group-members
 */
export interface ChannelsGetMembersMinusGroupArguments
	extends TokenOverridable,
		ChannelID,
		Paginated {
	/** Comma-separated list of group IDs */
	group_ids: string;
}

/**
 * Arguments for getting member counts by group.
 * @description Get counts of channel members categorized by group.
 * @see https://developers.loop.ru/API/4.0.0/channel-member-counts-by-group
 */
export interface ChannelsCountByGroupArguments
	extends TokenOverridable,
		ChannelID {
	/** Include timezone information */
	include_timezones?: boolean;
}

// ============================================================================
// Channel Moderation
// ============================================================================

/**
 * Arguments for getting channel moderation settings.
 * @description Get the moderation settings for a channel.
 * @see https://developers.loop.ru/API/4.0.0/get-channel-moderations
 */
export interface ChannelsModerationGetArguments
	extends TokenOverridable,
		ChannelID {}

/**
 * Arguments for updating channel moderation settings.
 * @description Update the moderation settings for a channel.
 * @see https://developers.loop.ru/API/4.0.0/update-channel-moderations
 */
export interface ChannelsModerationUpdateArguments
	extends TokenOverridable,
		ChannelID {
	/** Array of moderation patches to apply */
	patches: ChannelModerationPatch[];
}

/**
 * Arguments for setting a channel's scheme.
 * @description Set a channel's permission scheme.
 * @see https://developers.loop.ru/API/4.0.0/set-channel-scheme
 */
export interface ChannelsSetSchemeArguments
	extends TokenOverridable,
		ChannelID {
	/** The ID of the scheme to set, or empty string to remove */
	scheme_id: string;
}

// ============================================================================
// Sidebar Categories
// ============================================================================

/**
 * Arguments for listing sidebar categories.
 * @description Get a user's custom sidebar categories for a team.
 * @see https://developers.loop.ru/API/4.0.0/get-sidebar-categories
 */
export interface ChannelsCategoriesListArguments
	extends TokenOverridable,
		UserID,
		TeamID {}

/**
 * Arguments for creating a sidebar category.
 * @description Create a new sidebar category for a user in a team.
 * @see https://developers.loop.ru/API/4.0.0/create-sidebar-category
 */
export interface ChannelsCategoriesCreateArguments
	extends TokenOverridable,
		UserID,
		TeamID {
	/** Display name of the category */
	display_name: string;
	/** Type of category: 'favorites', 'channels', 'direct_messages', or 'custom' */
	type: "favorites" | "channels" | "direct_messages" | "custom";
	/** Array of channel IDs to include in this category */
	channel_ids?: string[];
}

/**
 * Sidebar category data for updates.
 */
export interface SidebarCategory {
	/** Category ID */
	id: string;
	/** Display name */
	display_name: string;
	/** Type of category */
	type: "favorites" | "channels" | "direct_messages" | "custom";
	/** Sorting method */
	sorting?: "alpha" | "manual" | "recent";
	/** Channel IDs in this category */
	channel_ids: string[];
}

/**
 * Arguments for updating all sidebar categories.
 * @description Update a user's sidebar categories for a team.
 * @see https://developers.loop.ru/API/4.0.0/update-sidebar-categories
 */
export interface ChannelsCategoriesUpdateAllArguments
	extends TokenOverridable,
		UserID,
		TeamID {
	/** Array of category objects to update */
	categories: SidebarCategory[];
}

/**
 * Arguments for getting a sidebar category.
 * @description Get a specific sidebar category for a user in a team.
 * @see https://developers.loop.ru/API/4.0.0/get-sidebar-category
 */
export interface ChannelsCategoryGetArguments
	extends TokenOverridable,
		UserID,
		TeamID {
	/** The category ID */
	category_id: string;
}

/**
 * Arguments for updating a sidebar category.
 * @description Update a specific sidebar category for a user in a team.
 * @see https://developers.loop.ru/API/4.0.0/update-sidebar-category
 */
export interface ChannelsCategoryUpdateArguments
	extends TokenOverridable,
		UserID,
		TeamID {
	/** The category ID */
	category_id: string;
	/** Display name of the category */
	display_name?: string;
	/** Sorting method */
	sorting?: "alpha" | "manual" | "recent";
	/** Channel IDs in this category */
	channel_ids?: string[];
}

/**
 * Arguments for deleting a sidebar category.
 * @description Delete a sidebar category for a user in a team.
 * @see https://developers.loop.ru/API/4.0.0/delete-sidebar-category
 */
export interface ChannelsCategoryDeleteArguments
	extends TokenOverridable,
		UserID,
		TeamID {
	/** The category ID */
	category_id: string;
}

/**
 * Arguments for getting sidebar category order.
 * @description Get the order of sidebar categories for a user in a team.
 * @see https://developers.loop.ru/API/4.0.0/get-sidebar-category-order
 */
export interface ChannelsCategoriesOrderGetArguments
	extends TokenOverridable,
		UserID,
		TeamID {}

/**
 * Arguments for updating sidebar category order.
 * @description Update the order of sidebar categories for a user in a team.
 * @see https://developers.loop.ru/API/4.0.0/update-sidebar-category-order
 */
export interface ChannelsCategoriesOrderUpdateArguments
	extends TokenOverridable,
		UserID,
		TeamID {
	/** Ordered array of category IDs */
	order: string[];
}
