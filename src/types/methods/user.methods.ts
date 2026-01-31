import type { Stream } from "form-data";
import type { UserProfile } from "fox-loop-sdk";
import type { UserCustomStatus, UserStatusValue } from "../users";
import type {
	OptionalChannelID,
	OptionalTeamID,
	OptionalUserID,
	Paginated,
	TokenOverridable,
	UserID,
	UserIDMe
} from "./common.methods";

/**
 * Arguments for getting a user's channels.
 */
export interface UsersChannelsArguments
	extends TokenOverridable,
		Paginated,
		OptionalUserID {
	/** @description Set to `true` to exclude deleted channels from the list. Default is `false`. */
	exclude_deleted?: boolean;
	/**
	 * @description Mix and match channel types by providing a comma-separated list of any combination of
	 * `public_channel`, `private_channel`, `mpim` and `im`. Defaults to `public_channel`.
	 */
	last_delete_at?: number;
	/**
	 * @description Browse conversations by a specific user ID's membership.
	 * Non-public channels are restricted to those where the calling user shares membership.
	 */
	user_id: string;
}

/**
 * @description Get a user object by providing a user email.
 * Sensitive information will be sanitized out.
 *
 * Requires an active session and for the current session to be able to
 * view another user's email based on the server's privacy settings.
 */
export interface UsersGetByEmailArguments extends TokenOverridable {
	/**
	 * @description User email
	 */
	email: string;
}

/**
 * @description Get a user object by providing a username.
 * Sensitive information will be sanitized out.
 *
 * Requires an active session but no other permissions.
 */
export interface UsersGetByUsernameArguments extends TokenOverridable {
	/**
	 * @description Username
	 */
	username: string;
}

/**
 * Arguments for setting a user's profile image.
 */
export interface UsersSetImageArguments extends TokenOverridable, UserID {
	/** @description Image file contents. */
	image: Buffer | Stream;
}

/**
 * Arguments for deleting a user's profile image.
 */
export interface UsersDeleteImageArguments extends TokenOverridable, UserID {}

/**
 * @description Get a page of a list of users. Based on query string parameters, select users from a team, channel, or select users not in a specific channel.
 * Since server version 4.0, some basic sorting is available using the sort query parameter. Sorting is currently only supported when selecting users on a team.
 * Permissions: Requires an active session and (if specified) membership to the channel or team being selected from.
 */
export interface UsersListArguments extends TokenOverridable, Paginated {
	/**
	 * @description The ID of the team to get users for.
	 */
	in_team?: string;
	/**
	 * @description The ID of the team to exclude users for. Must not be used with "in_team" query parameter.
	 */
	not_in_team?: string;
	/**
	 * @description Whether or not to list users that are not on any team.
	 * This option takes precendence over in_team, in_channel, and not_in_channel.
	 */
	without_team?: boolean;
	/**
	 * @description The ID of the channel to get users for.
	 */
	in_channel?: string;
	/**
	 * @description The ID of the channel to exclude users for. Must not  be used with "in_channel" query parameter.
	 */
	not_in_channel?: string;
	/**
	 * @description The ID of the group to get users for. Must have manage_system permission.
	 */
	in_group?: string;
	/**
	 * @description Whether or not to list only users that are active. This option cannot be used along with the inactive option.
	 */
	active?: boolean;
	/**
	 * @description Whether or not to list only users that are deactivated. This option cannot be used along with the active option.
	 */
	inactive?: boolean;
	/**
	 * @description Returns users that have this role.
	 */
	role?: string;
	/**
	 * @description Array used to filter users based on any of the specified system roles
	 * @example ['system_admin','system_user'] will return users that are either system admins or system users
	 */
	roles?: string[];
}

/**
 * @description Get a list of users based on search criteria provided in the request body.
 * Searches are typically done against username, full name, nickname and email unless otherwise configured by the server.
 * Requires an active session and read_channel and/or view_team permissions for any channels or teams specified in the request body.
 */
export interface UsersSearchArguments {
	term: string;
	/**
	 * @description The ID of the team to get users for.
	 */
	in_team_id?: string;
	/**
	 * @description The ID of the team to exclude users for. Must not be used with "in_team_id" query parameter.
	 */
	not_in_team_id?: string;
	/**
	 * @description The ID of the channel to get users for.
	 */
	in_channel_id?: string;
	/**
	 * @description The ID of the channel to exclude users for. Must not  be used with "in_channel-id" query parameter.
	 */
	not_in_channel_id?: string;
	group_constrained?: boolean;
	/**
	 * @description When true, include deactivated users in the results
	 */
	allow_inactive?: boolean;
	/**
	 * @description Set this to true if you would like to search for users that are not on a team.
	 * This option takes precendence over team_id, in_channel_id, and not_in_channel_id.
	 */
	without_team?: boolean;
	/**
	 * @description The maximum number of users to return in the results
	 * Available as of server @version 5.6. Defaults to 100 if not provided or on an earlier server version.
	 * @default 100
	 */
	limit?: number;
}

/**
 * @description Get a list of users for the purpose of autocompleting based on the provided search term.
 * Specify a combination of team_id and channel_id to filter results further.
 * Requires an active session and view_team and read_channel on any teams or channels used to filter the results further.
 */
export interface UsersAutocompleteArguments
	extends TokenOverridable,
		OptionalChannelID,
		OptionalTeamID {
	/**
	 * @description Username, nickname first name or last name
	 */
	name: string;
	/**
	 * @description The maximum number of users to return in each subresult
	 * Available as of server @version 5.6. Defaults to 100 if not provided or on an earlier server version.
	 * @default 100
	 */
	limit?: number;
}

/**
 * @description Get a list of users based on search criteria provided in the request body.
 * Searches are typically done against username, full name, nickname and email unless otherwise configured by the server.
 * Requires an active session and read_channel and/or view_team permissions for any channels or teams specified in the request body.
 */
export interface UsersSearchArguments extends TokenOverridable {
	/**
	 * @description The term to match against username, full name, nickname and email
	 */
	term: string;
	/**
	 * @description If provided, only search users on this team
	 */
	team_id?: string;
	/**
	 * @description If provided, only search users not on this team
	 */
	not_in_team_id?: string;
	/**
	 * @description If provided, only search users in this channel
	 */
	in_channel_id?: string;
	/**
	 * @description If provided, only search users not in this channel.
	 * Must specifiy team_id when using this option
	 */
	not_in_channel_id?: string;
	/**
	 * @description If provided, only search users in this group.
	 * Must have manage_system permission.
	 */
	in_group_id?: string;
	/**
	 * @description When used with not_in_channel_id or not_in_team_id, returns only the users
	 * that are allowed to join the channel or team based on its group constrains.
	 */
	group_constrained?: boolean;
	/**
	 * @description When true, include deactivated users in the results
	 */
	allow_inactive?: boolean;
	/**
	 * @description Set this to true if you would like to search for users that are not on a team.
	 * This option takes precendence over team_id, in_channel_id, and not_in_channel_id.
	 */
	without_team?: boolean;
	/**
	 * @description The maximum number of users to return in the results
	 * @version 5.6+ Defaults to 100 if not provided or on an earlier server version.
	 */
	limit?: number;
}

/**
 * Arguments for getting a user's profile.
 */
export interface UsersProfileGetArguments extends TokenOverridable, UserIDMe {}
/**
 * Arguments for updating a user's profile.
 */
export interface UsersProfileSetArguments
	extends TokenOverridable,
		UserIDMe,
		Partial<
			Pick<
				UserProfile,
				| "email"
				| "username"
				| "first_name"
				| "last_name"
				| "nickname"
				| "locale"
				| "position"
				| "props"
				| "notify_props"
			>
		> {}

/**
 * Arguments for getting a user's status.
 */
export interface UsersStatusGetAruments extends TokenOverridable, UserIDMe {}

/**
 * Arguments for setting a user's status.
 */
export interface UsersStatusSetAruments extends TokenOverridable, UserID {
	/**
	 * @description User status to set
	 */
	status: UserStatusValue;
}

/**
 * Arguments for setting a user's custom status.
 */
export interface UsersCustomStatusSetArguments
	extends TokenOverridable,
		UserIDMe,
		UserCustomStatus {}

/**
 * Arguments for unsetting a user's custom status.
 */
export interface UsersCustomStatusUnsetArguments
	extends TokenOverridable,
		UserIDMe {}

/**
 * Arguments for updating a user's roles.
 */
export interface UsersUpdateRolesArguments extends UserID {
	roles: string[];
}
