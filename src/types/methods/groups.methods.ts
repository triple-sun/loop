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
