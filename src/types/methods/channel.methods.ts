import type { Channel, ChannelType } from "../channels";
import type {
	ChannelID,
	TeamID,
	TokenOverridable,
	TraditionalPagingEnabled,
	UserID
} from "./common.methods";

export interface ChannelsCreateArguments extends TokenOverridable, TeamID {
	name: string;
	display_name: string;
	type: ChannelType;
	purpose?: string;
	header?: string;
}

export interface ChannelsCreateDirectArguments extends TokenOverridable {
	term: string;
}

export interface ChannelsCreateGroupArguments extends TokenOverridable {
	user_ids: string[];
}

export interface ChannelsGetArguments
	extends TokenOverridable,
		TraditionalPagingEnabled,
		TeamID {
	include_total_count?: boolean;
	include_deleted?: boolean;
}

export interface ChannelsGetByIdArguments extends TokenOverridable, ChannelID {}

export interface ChannelsUpdateArguments
	extends TokenOverridable,
		ChannelID,
		Partial<Channel> {}

export interface ChannelsDeleteArguments extends TokenOverridable, ChannelID {}

export interface ChannelsPatchArguments
	extends TokenOverridable,
		ChannelID,
		Partial<Channel> {}

export interface ChannelsRestoreArguments extends TokenOverridable, ChannelID {}

export interface ChannelsGetStatsArguments
	extends TokenOverridable,
		ChannelID {}

export interface ChannelsSearchArguments
	extends TokenOverridable,
		TeamID,
		TraditionalPagingEnabled {
	term: string;
	not_associated_to_group?: string;
	exclude_default_channels?: boolean;
	include_deleted?: boolean;
	deleted?: boolean;
	public?: boolean;
	private?: boolean;
	exclude_group_constrained?: boolean;
}

export interface ChannelsViewArguments extends TokenOverridable, ChannelID {
	prev_channel_id?: string;
}

export interface ChannelsMemberArguments
	extends TokenOverridable,
		ChannelID,
		UserID {}

export interface ChannelsMembersArguments
	extends TokenOverridable,
		ChannelID,
		TraditionalPagingEnabled {}
