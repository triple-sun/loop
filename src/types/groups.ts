import type { UserProfile } from "./users";

export enum SyncableType {
	Team = "team",
	Channel = "channel"
}

export interface SyncablePatch {
	scheme_admin: boolean;
	auto_add: boolean;
}

export interface GroupPatch {
	allow_reference: boolean;
	name?: string;
}

export interface CustomGroupPatch {
	name: string;
	display_name: string;
}

export interface Group {
	id: string;
	name: string;
	display_name: string;
	description: string;
	source: string;
	remote_id: string | null;
	create_at: number;
	update_at: number;
	delete_at: number;
	has_syncables: boolean;
	member_count: number;
	scheme_admin: boolean;
	allow_reference: boolean;
	channel_member_count?: number;
	channel_member_timezones_count?: number;
	member_ids?: string[];
}

export enum GroupSource {
	Ldap = "ldap",
	Custom = "custom"
}

export interface GroupTeam {
	team_id: string;
	team_display_name: string;
	team_type?: string;
	group_id?: string;
	auto_add?: boolean;
	scheme_admin?: boolean;
	create_at?: number;
	delete_at?: number;
	update_at?: number;
}

export interface GroupChannel {
	channel_id: string;
	channel_display_name: string;
	channel_type?: string;
	team_id: string;
	team_display_name: string;
	team_type?: string;
	group_id?: string;
	auto_add?: boolean;
	scheme_admin?: boolean;
	create_at?: number;
	delete_at?: number;
	update_at?: number;
}

export interface GroupSyncable {
	group_id: string;

	auto_add: boolean;
	scheme_admin: boolean;
	create_at: number;
	delete_at: number;
	update_at: number;
	type: "Team" | "Channel";
}

export interface GroupStats {
	group_id: string;
	total_member_count: number;
}

export interface GroupSearchOpts {
	q: string;
	is_linked?: boolean;
	is_configured?: boolean;
}

export interface MixedUnlinkedGroup {
	mattermost_group_id?: string;
	name: string;
	primary_key: string;
	has_syncables?: boolean;
}

export interface MixedUnlinkedGroupRedux extends MixedUnlinkedGroup {
	failed?: boolean;
}

export interface UserWithGroup extends UserProfile {
	groups: Group[];
	scheme_guest: boolean;
	scheme_user: boolean;
	scheme_admin: boolean;
}

export interface GroupsWithCount {
	groups: Group[];
	total_group_count: number;

	// These fields are added by the client after the groups are returned by the server
	channelID?: string;
	teamID?: string;
}

export interface UsersWithGroupsAndCount {
	users: UserWithGroup[];
	total_count: number;
}

export interface GroupCreateWithUserIds {
	name: string;
	allow_reference: boolean;
	display_name: string;
	source: string;
	user_ids: string[];
	description?: string;
}

export interface GetGroupsParams {
	filter_allow_reference?: boolean;
	page?: number;
	per_page?: number;
	include_member_count?: boolean;
	include_archived?: boolean;
	filter_archived?: boolean;
	include_member_ids?: boolean;
}

export interface GetGroupsForUserParams extends GetGroupsParams {
	filter_has_member: string;
}

export interface GroupSearchParams extends GetGroupsParams {
	q: string;
	filter_has_member?: string;
	include_timezones?: string;
	include_channel_member_count?: string;
}

export interface GroupMembership {
	user_id: string;
	roles: string;
}

export interface GroupPermissions {
	can_delete: boolean;
	can_manage_members: boolean;
	can_restore: boolean;
}
