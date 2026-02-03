import type {} from "./errors";

export enum TeamType {
	O = "O",
	I = "I"
}

export interface TeamsUsageResponse {
	active: number;
	cloud_archived: number;
}

export interface TeamMembership extends TeamUnread {
	user_id: string;
	roles: string;
	delete_at: number;
	scheme_admin: boolean;
	scheme_guest: boolean;
	scheme_user: boolean;
}

export interface TeamMemberWithError {
	member: TeamMembership;
	user_id: string;
	error: ServerError;
}

export interface Team {
	id: string;
	create_at: number;
	update_at: number;
	delete_at: number;
	display_name: string;
	name: string;
	description: string;
	email: string;
	type: TeamType;
	company_name: string;
	allowed_domains: string;
	invite_id: string;
	allow_open_invite: boolean;
	scheme_id: string;
	group_constrained: boolean;
	policy_id?: string | null;
	last_team_icon_update?: number;
}

export interface TeamUnread {
	team_id: string;

	/** The number of unread mentions in channels on this team, not including DMs and GMs */
	mention_count: number;

	/** The number of unread mentions in root posts in channels on this team, not including DMs and GMs */
	mention_count_root: number;

	/**
	 * The number of unread posts in channels on this team, not including DMs and GMs
	 *
	 * @remarks Note that this differs from ChannelMembership.msg_count and ChannelUnread.msg_count since it tracks
	 * unread posts instead of read posts.
	 */
	msg_count: number;

	/**
	 * The number of unread root posts in channels on this team, not including DMs and GMs
	 *
	 * @remarks Note that this differs from ChannelMember.msg_count_root and ChannelUnread.msg_count_root since it
	 * tracks unread posts instead of read posts.
	 */
	msg_count_root: number;

	thread_count?: number;
	thread_mention_count?: number;
	thread_urgent_mention_count?: number;
}

export interface GetTeamMembersOpts {
	sort?: "Username";
	exclude_deleted_users?: boolean;
}

export interface TeamsWithCount {
	teams: Team[];
	total_count: number;
}

export interface TeamStats {
	team_id: string;
	total_member_count: number;
	active_member_count: number;
}

export type TeamSearchOpts = PagedTeamSearchOpts | NotPagedTeamSearchOpts;

export interface PagedTeamSearchOpts extends NotPagedTeamSearchOpts {
	page: number;
	per_page: number;
}
export interface NotPagedTeamSearchOpts {
	allow_open_invite?: boolean;
	group_constrained?: boolean;
}

export interface TeamInviteWithError {
	email: string;
	// Unlike ServerError, error uses field names directly from model.AppError on the server
	error: {
		id: string;
		message: string;
	};
}
