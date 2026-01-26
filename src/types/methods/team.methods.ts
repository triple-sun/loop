import type { Team, TeamSearchOpts } from "../teams";
import type { Paginated, TeamID, TokenOverridable } from "./common.methods";

export interface TeamsCreateArguments extends TokenOverridable, Team {}

export interface TeamsGetArguments extends TokenOverridable, Paginated {
	include_total_count?: boolean;
}

export interface TeamsGetByIdArguments extends TokenOverridable, TeamID {}

export interface TeamsGetByNameArguments extends TokenOverridable {
	name: string;
}

export interface TeamsUpdateArguments
	extends TokenOverridable,
		TeamID,
		Partial<Team> {}

export interface TeamsDeleteArguments extends TokenOverridable, TeamID {
	permanent?: boolean;
}

export interface TeamsPatchArguments
	extends TokenOverridable,
		TeamID,
		Partial<Team> {}

export interface TeamsRegenerateInviteIdArguments
	extends TokenOverridable,
		TeamID {}

export interface TeamsGetStatsArguments extends TokenOverridable, TeamID {}

export type TeamsSearchArguments = TokenOverridable &
	Paginated &
	TeamSearchOpts & {
		term: string;
	};

export interface TeamsCheckNameExistsArguments extends TokenOverridable {
	name: string;
}

export interface TeamsImportArguments extends TokenOverridable {
	file: File;
	filesize: number;
	importFrom: string;
}
