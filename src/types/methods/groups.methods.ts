import type {
	CustomGroupPatch,
	GetGroupsForUserParams,
	GetGroupsParams,
	GroupCreateWithUserIds,
	GroupPatch,
	GroupSearchOpts,
	GroupSyncable
} from "../groups";
import type { UserIDMe } from "./common.methods";

export interface GroupsCreateArguments {
	group: GroupCreateWithUserIds;
}

export interface GroupsGetArguments {
	group_id: string;
}

export interface GroupsUpdateArguments {
	group_id: string;
	group: CustomGroupPatch;
}

export interface GroupsDeleteArguments {
	group_id: string;
}

export interface GroupsPatchArguments {
	group_id: string;
	patch: GroupPatch;
}

export interface GroupsConnectPrimaryArguments {
	group_id: string;
	// TODO: Add type
}

export interface GroupsRestoreArguments {
	group_id: string;
}

export interface GroupsGetStatsArguments {
	group_id: string;
}

export interface GroupsListArguments extends GetGroupsParams {}

export interface GroupsListForUserArguments
	extends GetGroupsForUserParams,
		UserIDMe {}

export interface GroupsSearchArguments extends GroupSearchOpts {}

export interface GroupsTeamArguments {
	group_id: string;
	team_id: string;
}

export interface GroupsChannelArguments {
	group_id: string;
	channel_id: string;
}

export interface GroupsListSyncablesArguments {
	group_id: string;
}

export interface GroupsAddSyncableArguments extends GroupSyncable {}

export interface GroupsRemoveSyncableArguments {
	group_id: string;
	syncable_id: string;
	syncable_type: "team" | "channel";
}

export interface GroupsPatchSyncableArguments {
	group_id: string;
	syncable_id: string;
	syncable_type: "team" | "channel";
	patch: {
		auto_add: boolean;
		scheme_admin: boolean;
	};
}

export interface GroupsDeleteLdapLinkArguments {
	group_id: string;
}

// ============================================================================
// Group Member Operations
// ============================================================================

/**
 * Arguments for getting group members.
 * @see https://developers.loop.ru/API/4.0.0/get-group-members
 */
export interface GroupsMembersGetArguments {
	/** The group ID */
	group_id: string;
	/** Page number (0-based) */
	page?: number;
	/** Number of items per page */
	per_page?: number;
}

/**
 * Arguments for adding members to a custom group.
 * @see https://developers.loop.ru/API/4.0.0/add-group-members
 */
export interface GroupsMembersAddArguments {
	/** The group ID */
	group_id: string;
	/** Array of user IDs to add */
	user_ids: string[];
}

/**
 * Arguments for removing members from a custom group.
 * @see https://developers.loop.ru/API/4.0.0/delete-group-members
 */
export interface GroupsMembersRemoveArguments {
	/** The group ID */
	group_id: string;
	/** Array of user IDs to remove */
	user_ids: string[];
}

/**
 * Arguments for getting a group's teams.
 * @see https://developers.loop.ru/API/4.0.0/get-group-teams
 */
export interface GroupsTeamsGetArguments {
	/** The group ID */
	group_id: string;
}

/**
 * Arguments for getting a group's channels.
 * @see https://developers.loop.ru/API/4.0.0/get-group-channels
 */
export interface GroupsChannelsGetArguments {
	/** The group ID */
	group_id: string;
}
