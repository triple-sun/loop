import type { Channel, ChannelType } from "../channels/channels";
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
