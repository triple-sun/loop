import type {
	CreateDataRetentionCustomPolicy,
	PatchDataRetentionCustomPolicy,
	PatchDataRetentionCustomPolicyChannels,
	PatchDataRetentionCustomPolicyTeams
} from "../data-retention";

export interface DataRetentionGetPolicyArguments {
	policy_id: string;
}

export interface DataRetentionGetPoliciesArguments {
	page?: number;
	per_page?: number;
}

export interface DataRetentionCreatePolicyArguments {
	policy: CreateDataRetentionCustomPolicy;
}

export interface DataRetentionDeletePolicyArguments {
	policy_id: string;
}

export interface DataRetentionUpdatePolicyArguments {
	policy_id: string;
	policy: CreateDataRetentionCustomPolicy;
}

export interface DataRetentionPatchPolicyArguments {
	policy_id: string;
	patch: PatchDataRetentionCustomPolicy;
}

export interface DataRetentionGetPolicyTeamsArguments {
	policy_id: string;
	page?: number;
	per_page?: number;
}

export interface DataRetentionAddPolicyTeamsArguments {
	policy_id: string;
	teams: PatchDataRetentionCustomPolicyTeams;
}

export interface DataRetentionRemovePolicyTeamsArguments {
	policy_id: string;
	teams: PatchDataRetentionCustomPolicyTeams;
}

export interface DataRetentionGetPolicyChannelsArguments {
	policy_id: string;
	page?: number;
	per_page?: number;
}

export interface DataRetentionAddPolicyChannelsArguments {
	policy_id: string;
	channels: PatchDataRetentionCustomPolicyChannels;
}

export interface DataRetentionRemovePolicyChannelsArguments {
	policy_id: string;
	channels: PatchDataRetentionCustomPolicyChannels;
}

export interface DataRetentionSearchPolicyTeamsArguments {
	policy_id: string;
	term: string;
}

export interface DataRetentionSearchPolicyChannelsArguments {
	policy_id: string;
	term: string;
}

export interface DataRetentionGetUserTeamPoliciesArguments {
	user_id: string;
	page?: number;
	per_page?: number;
}

export interface DataRetentionGetUserChannelPoliciesArguments {
	user_id: string;
	page?: number;
	per_page?: number;
}
