
import type { AdminState } from "../../oldsrc/client/types/admin";
import type { AppsState } from "../../oldsrc/client/types/apps";
import type { Bot } from "../../oldsrc/client/types/bots";
import type { ChannelBookmarksState } from "../../oldsrc/client/types/channel_bookmarks";
import type { ChannelCategoriesState } from "../../oldsrc/client/types/channel_categories";
import type { ChannelsState } from "../../oldsrc/client/types/channels";
import type { CloudState, CloudUsage } from "../../oldsrc/client/types/cloud";
import type { EmojisState } from "../../oldsrc/client/types/emojis";
import type { FilesState } from "../../oldsrc/client/types/files";
import type { GeneralState } from "../../oldsrc/client/types/general";
import type { HostedCustomerState } from "../../oldsrc/client/types/hosted_customer";
import type { IntegrationsState } from "../../oldsrc/client/types/integrations";
import type { JobsState } from "../../oldsrc/client/types/jobs";
import type { LimitsState } from "../../oldsrc/client/types/limits";
import type { PostsState } from "../../oldsrc/client/types/posts";
import type { PreferenceType } from "../../oldsrc/client/types/preferences";
import type { GroupsState } from "./groups";
import type {
	AdminRequestsStatuses,
	ChannelsRequestsStatuses,
	FilesRequestsStatuses,
	GeneralRequestsStatuses,
	PostsRequestsStatuses,
	RolesRequestsStatuses,
	TeamsRequestsStatuses,
	UsersRequestsStatuses
} from "./requests";
import type { Role } from "./roles";
import type { SchemesState } from "./schemes";
import type { SearchState } from "./search";
import type { TeamsState } from "./teams";
import type { ThreadsState } from "./threads";
import type { Typing } from "./typing";
import type { UsersState } from "./users";

export type GlobalState = {
	entities: {
		general: GeneralState;
		users: UsersState;
		limits: LimitsState;
		teams: TeamsState;
		channels: ChannelsState;
		channelBookmarks: ChannelBookmarksState;
		posts: PostsState;
		threads: ThreadsState;
		bots: {
			accounts: Record<string, Bot>;
		};
		preferences: {
			myPreferences: {
				[x: string]: PreferenceType;
			};
		};
		admin: AdminState;
		jobs: JobsState;
		search: SearchState;
		integrations: IntegrationsState;
		files: FilesState;
		emojis: EmojisState;
		typing: Typing;
		roles: {
			roles: {
				[x: string]: Role;
			};
			pending: Set<string>;
		};
		schemes: SchemesState;
		groups: GroupsState;
		channelCategories: ChannelCategoriesState;
		apps: AppsState;
		cloud: CloudState;
		hostedCustomer: HostedCustomerState;
		usage: CloudUsage;
	};
	errors: any[];
	requests: {
		channels: ChannelsRequestsStatuses;
		general: GeneralRequestsStatuses;
		posts: PostsRequestsStatuses;
		teams: TeamsRequestsStatuses;
		users: UsersRequestsStatuses;
		admin: AdminRequestsStatuses;
		files: FilesRequestsStatuses;
		roles: RolesRequestsStatuses;
	};
	websocket: {
		connected: boolean;
		lastConnectAt: number;
		lastDisconnectAt: number;
		connectionId: string;
	};
};
