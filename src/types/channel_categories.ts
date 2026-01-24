import type { UserProfileResponse } from "../../../src/types/users";
import type {
	IDMappedObjects,
	RelationOneToOne
} from "../../../src/types/utilities";
import type { Channel } from "./mm/channels";
import type { Team } from "./teams";

export type ChannelCategoryType =
	| "favorites"
	| "channels"
	| "direct_messages"
	| "custom";

export enum CategorySorting {
	Alphabetical = "alpha",
	Default = "", // behaves the same as manual
	Recency = "recent",
	Manual = "manual"
}

export type ChannelCategory = {
	id: string;
	user_id: UserProfileResponse["id"];
	team_id: Team["id"];
	type: ChannelCategoryType;
	display_name: string;
	sorting: CategorySorting;
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
