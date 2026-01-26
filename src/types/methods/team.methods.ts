import type { Team, TeamSearchOpts } from "../teams";
import type { Paginated, TeamID, TokenOverridable } from "./common.methods";

/**
 * Arguments for creating a new team.
 */
export interface TeamsCreateArguments extends TokenOverridable, Team {}

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
export interface TeamsUpdateArguments
	extends TokenOverridable,
		TeamID,
		Partial<Team> {}

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
