import type { Team, TeamSearchOpts, TeamType } from "../teams";
import type {
	Paginated,
	TeamID,
	TokenOverridable,
	UserID
} from "./common.methods";

/**
 * Arguments for creating a new team.
 */
export interface TeamsCreateArguments extends TokenOverridable {
	display_name: string;
	name: string;
	type: TeamType;
}

/**
 * Arguments for getting teams.
 */
export interface TeamsGetArguments extends TokenOverridable, Paginated {
	/** Include total count of teams */
	include_total_count?: boolean;
}

/**
 * Arguments for getting a team by ID.
 */
export interface TeamsGetByIdArguments extends TokenOverridable, TeamID {}

/**
 * Arguments for getting a team by name.
 */
export interface TeamsGetByNameArguments extends TokenOverridable {
	/** Name of the team to get */
	name: string;
}

/**
 * Arguments for updating a team.
 */
export interface TeamsUpdateArguments extends TokenOverridable, Partial<Team> {}

/**
 * Arguments for deleting a team.
 */
export interface TeamsDeleteArguments extends TokenOverridable, TeamID {
	/** Permanently delete the team (soft delete if false) */
	permanent?: boolean;
}

/**
 * Arguments for patching a team.
 */
export interface TeamsPatchArguments
	extends TokenOverridable,
		TeamID,
		Partial<Team> {}

/**
 * Arguments for regenerating a team invite ID.
 */
export interface TeamsRegenerateInviteIdArguments
	extends TokenOverridable,
		TeamID {}

/**
 * Arguments for getting team statistics.
 */
export interface TeamsGetStatsArguments extends TokenOverridable, TeamID {}

/**
 * Arguments for searching teams.
 */
export type TeamsSearchArguments = TokenOverridable &
	Paginated &
	TeamSearchOpts & {
		/** Search term */
		term: string;
	};

/**
 * Arguments for checking if a team name exists.
 */
export interface TeamsCheckNameExistsArguments extends TokenOverridable {
	/** Team name to check */
	name: string;
}

/**
 * Arguments for importing a team.
 */
export interface TeamsImportArguments extends TokenOverridable {
	/** File to import */
	file: File;
	/** Size of the file */
	filesize: number;
	/** Source to import from */
	importFrom: string;
}

/**
 * Arguments for setting the team icon.
 */
export interface TeamsSetIconArguments extends TokenOverridable, TeamID {
	/** The icon image */
	image: File | Blob;
}

/**
 * Arguments for removing the team icon.
 */
export interface TeamsRemoveIconArguments extends TokenOverridable, TeamID {}

/**
 * Arguments for getting the team icon.
 */
export interface TeamsGetIconArguments extends TeamID {}

// ============================================================================
// Team Member Operations
// ============================================================================

/**
 * Arguments for listing team members.
 * @see https://developers.loop.ru/API/4.0.0/get-team-members
 */
export interface TeamsMembersListArguments
	extends TokenOverridable,
		TeamID,
		Paginated {}

/**
 * Arguments for adding a user to a team.
 * @see https://developers.loop.ru/API/4.0.0/add-team-member
 */
export interface TeamsMemberAddArguments extends TokenOverridable, TeamID {
	/** The user ID to add to the team */
	user_id: string;
}

/**
 * Arguments for batch adding users to a team.
 * @see https://developers.loop.ru/API/4.0.0/add-team-members
 */
export interface TeamsMemberAddBatchArguments extends TokenOverridable, TeamID {
	/** Array of team member objects with user_id */
	members: Array<{ user_id: string }>;
}

/**
 * Arguments for getting a specific team member.
 * @see https://developers.loop.ru/API/4.0.0/get-team-member
 */
export interface TeamsMemberGetArguments
	extends TokenOverridable,
		TeamID,
		UserID {}

/**
 * Arguments for removing a user from a team.
 * @see https://developers.loop.ru/API/4.0.0/remove-team-member
 */
export interface TeamsMemberRemoveArguments
	extends TokenOverridable,
		TeamID,
		UserID {}

/**
 * Arguments for getting team members by user IDs.
 * @see https://developers.loop.ru/API/4.0.0/get-team-members-by-ids
 */
export interface TeamsMembersGetByIdsArguments
	extends TokenOverridable,
		TeamID {
	/** Array of user IDs to look up */
	user_ids: string[];
}

/**
 * Arguments for updating team member roles.
 * @see https://developers.loop.ru/API/4.0.0/update-team-member-roles
 */
export interface TeamsMemberUpdateRolesArguments
	extends TokenOverridable,
		TeamID,
		UserID {
	/** Space-separated list of roles to assign */
	roles: string;
}

/**
 * Arguments for updating team member scheme roles.
 * @see https://developers.loop.ru/API/4.0.0/update-team-member-scheme-roles
 */
export interface TeamsMemberUpdateSchemeRolesArguments
	extends TokenOverridable,
		TeamID,
		UserID {
	/** Whether user is a scheme admin */
	scheme_admin: boolean;
	/** Whether user is a scheme user */
	scheme_user: boolean;
}
