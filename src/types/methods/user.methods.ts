import type { Stream } from "form-data";
import type { UserProfile } from "fox-loop-sdk";
import type { UserCustomStatus, UserStatusValue } from "../users";
import type {
	OptionalUserID,
	TeamID,
	TokenOverridable,
	TraditionalPagingEnabled,
	UserID,
	UserIDMe
} from "./common.methods";

interface Email {
	/** @description An email address belonging to a user in the workspace */
	email: string;
}

interface Username {
	/** @description An username belonging to a user in the workspace */
	username: string;
}

export interface UsersChannelsArguments
	extends TokenOverridable,
		TraditionalPagingEnabled,
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

export interface UsersFindByEmailArguments extends Email, TokenOverridable {}
export interface UsersFindByUsernameArguments
	extends Username,
		TokenOverridable {}

export interface UsersSetImageArguments extends TokenOverridable, UserID {
	/** @description Image file contents. */
	image: Buffer | Stream;
}
export interface UsersDeleteImageArguments extends TokenOverridable, UserID {}

export interface UsersListArguments
	extends TokenOverridable,
		TraditionalPagingEnabled,
		TeamID {
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
	 * Available as of server version 5.6. Defaults to 100 if not provided or on an earlier server version.
	 * @default 100
	 */
	limit?: number;
}

export interface UsersProfileGetArguments extends TokenOverridable, UserIDMe {}
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

export interface UsersStatusGetAruments extends TokenOverridable, UserIDMe {}
export interface UsersStatusSetAruments extends TokenOverridable, UserID {
	/**
	 * @description User status to set
	 */
	status: UserStatusValue;
}
export interface UsersCustomStatusSetArguments
	extends TokenOverridable,
		UserIDMe,
		UserCustomStatus {}
export interface UsersCustomStatusUnsetArguments
	extends TokenOverridable,
		UserIDMe {}

export interface UsersUpdateRolesArguments extends UserID {
	roles: string[];
}
