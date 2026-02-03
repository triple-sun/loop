import type { Bot } from "./bots";
import type { CloudUsage } from "./cloud";
import type { PreferenceType } from "./preferences";
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
import type {
	AdminState,
	AppsState,
	ChannelBookmarksState,
	ChannelCategoriesState,
	ChannelsState,
	CloudState,
	EmojisState,
	FilesState,
	GeneralState,
	GroupsState,
	HostedCustomerState,
	IntegrationsState,
	JobsState,
	LimitsState,
	PostsState,
	SchemesState,
	SearchState,
	TeamsState,
	ThreadsState,
	UsersState
} from "./state";
import type { Typing } from "./typing";

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
	errors: unknown[];
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
