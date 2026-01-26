import type { Team } from "../teams";
import type { UserProfile } from "../users";
import type { IDMappedObjects, RelationOneToOne } from "../utilities";
import type { Channel } from "./channels";

export type ChannelCategoryType =
	| "favorites"
	| "channels"
	| "direct_messages"
	| "custom";

export enum ChannelCategorySorting {
	Alphabetical = "alpha",
	Default = "", // behaves the same as manual
	Recency = "recent",
	Manual = "manual"
}

export type ChannelCategory = {
	id: string;
	user_id: UserProfile["id"];
	team_id: Team["id"];
	type: ChannelCategoryType;
	display_name: string;
	sorting: ChannelCategorySorting;
	channel_ids: Array<Channel["id"]>;
	muted: boolean;
	collapsed: boolean;
};

export type OrderedChannelCategories = {
	categories: ChannelCategory[];
	order: string[];
};

export type ChannelCategoriesState = {
	byId: IDMappedObjects<ChannelCategory>;
	orderByTeam: RelationOneToOne<Team, Array<ChannelCategory["id"]>>;
};
