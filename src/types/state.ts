import type { AnalyticsRow, ClusterInfo, LogObject } from "./admin";
import type { AppCallRequest, AppForm, BindingsInfo } from "./apps";
import type { Audit } from "./audits";
import type {
	Channel,
	ChannelBookmark,
	ChannelCategory,
	ChannelMemberCountByGroup,
	ChannelMembership,
	ChannelMessageCount,
	ChannelModeration,
	ChannelStats
} from "./channels";
import type {
	CloudCustomer,
	CloudInvoice,
	CloudLimits,
	CloudProduct,
	CloudSubscription
} from "./cloud";
import type { Command } from "./commands";
import type { ComplianceReport } from "./compliance";
import type {
	AdminConfig,
	ClientConfig,
	ClientLicense,
	EnvironmentConfig
} from "./config";
import type { DataRetentionCustomPolicies } from "./data-retention";
import type { Dialog } from "./dialog";
import type { CustomEmoji } from "./emojis";
import type { FileInfo, FileSearchResultItem } from "./files";
import type {
	Group,
	GroupChannel,
	GroupStats,
	GroupTeam,
	MixedUnlinkedGroupRedux
} from "./groups";
import type { Job, JobType } from "./jobs";
import type { ServerLimits } from "./limits";
import type { OpenGraphMetadata } from "./metadata";
import type { OAuthApp, OutgoingOAuthConnection } from "./oauth";
import type { PluginRedux, PluginStatusRedux } from "./plugins";
import type { MessageHistory, Post, PostOrderBlock } from "./posts";
import type { Reaction } from "./reactions";
import type { SamlCertificateStatus, SamlMetadataResponse } from "./saml";
import type { Scheme } from "./schemes";
import type { Team, TeamMembership, TeamStats } from "./teams";
import type { UserThread } from "./threads";
import type {
	UserAccessToken,
	UserProfile,
	UserSession,
	UsersStats
} from "./users";
import type { IncomingWebhook, OutgoingWebhook } from "./webhooks";

/**
 * =======================================
 * @description General State Types
 * =======================================
 */
export interface GeneralState {
	config: Partial<ClientConfig>;
	firstAdminVisitMarketplaceStatus: boolean;
	firstAdminCompleteSetup: boolean;
	license: ClientLicense;
	serverVersion: string;
}

/**
 * =======================================
 * @description Admin State Type
 * =======================================
 */
export interface AdminState {
	logs: LogObject[];
	plainLogs: string[];
	audits: Record<string, Audit>;
	config: Partial<AdminConfig>;
	environmentConfig: Partial<EnvironmentConfig>;
	complianceReports: Record<string, ComplianceReport>;
	ldapGroups: Record<string, MixedUnlinkedGroupRedux>;
	ldapGroupsCount: number;
	userAccessTokens: Record<string, UserAccessToken>;
	clusterInfo: ClusterInfo[];
	samlCertStatus?: SamlCertificateStatus;
	analytics: AnalyticsState;
	teamAnalytics: { [teamId: string]: AnalyticsState };
	userAccessTokensByUser?: {
		[userId: string]: Record<string, UserAccessToken>;
	};

	plugins?: Record<string, PluginRedux>;
	pluginStatuses?: Record<string, PluginStatusRedux>;
	samlMetadataResponse?: SamlMetadataResponse;
	dataRetentionCustomPolicies: DataRetentionCustomPolicies;
	dataRetentionCustomPoliciesCount: number;
	prevTrialLicense: ClientLicense;
}

/**
 * =======================================
 * @description Analytics State Types
 * =======================================
 */
export interface AnalyticsState {
	POST_PER_DAY?: AnalyticsRow[];
	BOT_POST_PER_DAY?: AnalyticsRow[];
	USERS_WITH_POSTS_PER_DAY?: AnalyticsRow[];

	TOTAL_PUBLIC_CHANNELS?: number;
	TOTAL_PRIVATE_GROUPS?: number;
	TOTAL_POSTS?: number;
	TOTAL_USERS?: number;
	TOTAL_INACTIVE_USERS?: number;
	TOTAL_TEAMS?: number;
	TOTAL_WEBSOCKET_CONNECTIONS?: number;
	TOTAL_MASTER_DB_CONNECTIONS?: number;
	TOTAL_READ_DB_CONNECTIONS?: number;
	DAILY_ACTIVE_USERS?: number;
	MONTHLY_ACTIVE_USERS?: number;
	TOTAL_FILE_POSTS?: number;
	TOTAL_HASHTAG_POSTS?: number;
	TOTAL_IHOOKS?: number;
	TOTAL_OHOOKS?: number;
	TOTAL_COMMANDS?: number;
	TOTAL_SESSIONS?: number;
	REGISTERED_USERS?: number;
}

/**
 * =======================================
 * @description App State Types
 * =======================================
 */
export interface AppModalState {
	form: AppForm;
	call: AppCallRequest;
}

export interface AppsState {
	main: BindingsInfo;
	rhs: BindingsInfo;
	pluginEnabled: boolean;
}

/**
 * =======================================
 * @description Channels State Types
 * =======================================
 */
export interface ChannelBookmarksState {
	byChannelId: {
		[channelId: string]: { [bookmarkId: string]: ChannelBookmark };
	};
}

export interface ChannelCategoriesState {
	byId: { [channelCategoryId: string]: ChannelCategory };
	orderByTeam: { [teamId: string]: /** channel categiry id array */ string[] };
}

export interface ChannelsState {
	currentChannelId: string;
	channels: { [channelId: string]: Channel };
	channelsInTeam: { [teamId: string]: Set<string> /** channel id set */ };
	myMembers: { [channelId: string]: ChannelMembership };
	roles: { [channelId: string]: Set<string> /** roles set */ };
	membersInChannel: {
		[channelId: string]: Record<string, ChannelMembership>;
	};
	stats: { [channelId: string]: ChannelStats };
	groupsAssociatedToChannel: unknown;
	totalCount: number;
	manuallyUnread: { [channelId: string]: boolean };
	channelModerations: { [channelId: string]: ChannelModeration[] };
	channelMemberCountsByGroup: {
		[channelId: string]: ChannelMemberCountByGroup;
	};
	messageCounts: { [channelId: string]: ChannelMessageCount };
	channelsMemberCount: Record<string, number>;
}

/**
 * =======================================
 * @description Cloud State Types
 * =======================================
 */
export interface CloudState {
	subscription?: CloudSubscription;
	products?: Record<string, CloudProduct>;
	customer?: CloudCustomer;
	invoices?: Record<string, CloudInvoice>;
	limits: {
		limitsLoaded: boolean;
		limits: CloudLimits;
	};
	errors: {
		subscription?: true;
		products?: true;
		customer?: true;
		invoices?: true;
		limits?: true;
		trueUpReview?: true;
	};
}

/**
 * =======================================
 * @description Emojis State Types
 * =======================================
 */
export interface EmojisState {
	customEmoji: {
		[emojiId: string]: CustomEmoji;
	};
	nonExistentEmoji: Set<string>;
}

/**
 * =======================================
 * @description Groups State Types
 * =======================================
 */
export interface GroupSyncablesState {
	teams: GroupTeam[];
	channels: GroupChannel[];
}

export interface GroupsState {
	syncables: Record<string, GroupSyncablesState>;
	stats: { [groupId: string]: GroupStats };
	groups: Record<string, Group>;
	myGroups: string[];
}

/**
 * =======================================
 * @description Files State Types
 * =======================================
 */
export interface FilesState {
	files: Record<string, FileInfo>;
	filesFromSearch: Record<string, FileSearchResultItem>;
	fileIdsByPostId: Record<string, string[]>;
	filePublicLink?: { link: string };
}

/**
 * =======================================
 * @description Hosted Customer State Types
 * =======================================
 */
export interface HostedCustomerState {
	products: {
		products: Record<string, CloudProduct>;
		productsLoaded: boolean;
	};
}

/**
 * =======================================
 * @description Integrations State Types
 * =======================================
 */
export interface IntegrationsState {
	incomingHooks: { [webhookId: string]: IncomingWebhook };
	outgoingHooks: { [webhookId: string]: OutgoingWebhook };
	oauthApps: { [appId: string]: OAuthApp };
	outgoingOAuthConnections: { [connetionId: string]: OutgoingOAuthConnection };
	appsOAuthAppIDs: string[];
	appsBotIDs: string[];
	systemCommands: { [commandId: string]: Command };
	commands: { [commandId: string]: Command };
	dialog?: {
		url: string;
		dialog: Dialog;
	};
}

/**
 * =======================================
 * @description Jobs State Types
 * =======================================
 */
export interface JobsState {
	jobs: { [jobId: string]: Job };
	jobsByTypeList: { [type in JobType]?: Job[] };
}

/**
 * =======================================
 * @description Limits State Types
 * =======================================
 */
export interface LimitsState {
	serverLimits: ServerLimits;
}

/**
 * =======================================
 * @description Posts State Types
 * =======================================
 */
export interface PostsState {
	posts: { [postId: string]: Post };
	postsReplies: { [postId: string]: number };
	postsInChannel: Record<string, PostOrderBlock[]>;
	postsInThread: { [postId: string]: Post["id"][] };
	reactions: { [postId: string]: { [reactionId: string]: Reaction } };
	openGraph: { [postId: string]: { [metaId: string]: OpenGraphMetadata } };
	pendingPostIds: string[];
	postEditHistory: Post[];
	currentFocusedPostId: string;
	messagesHistory: MessageHistory;
	limitedViews: {
		channels: { [channelId: string]: number };
		threads: { [rootId: string]: number };
	};
	acknowledgements: { [postId: string]: { [userId: string]: number } };
}

/**
 * =======================================
 * @description Scheme State Types
 * =======================================
 */
export interface SchemesState {
	schemes: {
		[schemeId: string]: Scheme;
	};
}

/**
 * =======================================
 * @description Search State Types
 * =======================================
 */
export type SearchState = {
	current: unknown;
	results: string[];
	fileResults: string[];
	flagged: string[];
	pinned: Record<string, string[]>;
	isSearchingTerm: boolean;
	isSearchGettingMore: boolean;
	isLimitedResults: number;
	matches: {
		[x: string]: string[];
	};
};

/**
 * =======================================
 * @description Teams State Types
 * =======================================
 */

export interface TeamsState {
	currentTeamId: string;
	teams: Record<string, Team>;
	myMembers: Record<string, TeamMembership>;
	membersInTeam: { [teamId: string]: { [userId: string]: TeamMembership } };
	stats: { [teamId: string]: TeamStats };
	groupsAssociatedToTeam: unknown;
	totalCount: number;
}

/**
 * =======================================
 * @description Threads State Types
 * =======================================
 */
export type ThreadsState = {
	threadsInTeam: { [teamId: string]: /** threadId[] */ string[] };
	unreadThreadsInTeam: { [teamId: string]: /** threadId[] */ string[] };
	threads: { [rootId: string]: UserThread };
	counts: {
		[teamId: string]: {
			total: number;
			total_unread_threads: number;
			total_unread_mentions: number;
			total_unread_urgent_mentions?: number;
		};
	};
	countsIncludingDirect: {
		[teamId: string]: {
			total: number;
			total_unread_threads: number;
			total_unread_mentions: number;
			total_unread_urgent_mentions?: number;
		};
	};
};

/**
 * =======================================
 * @description Users State Types
 * =======================================
 */
export interface UsersState {
	currentUserId: string;
	isManualStatus: { [userId: string]: boolean };
	mySessions: UserSession[];
	myAudits: Audit[];
	profiles: { [userId: string]: UserProfile };
	profilesInTeam: { [teamId: string]: Set<string> };
	profilesNotInTeam: { [teamId: string]: Set<string> };
	profilesWithoutTeam: Set<string>;
	profilesInChannel: { [channelId: string]: Set<string> };
	profilesNotInChannel: { [channelId: string]: Set<string> };
	profilesInGroup: { [groupId: string]: Set<string> };
	profilesNotInGroup: { [groupId: string]: Set<string> };
	statuses: { [userId: string]: string };
	stats: Partial<UsersStats>;
	filteredStats: Partial<UsersStats>;
	myUserAccessTokens: Record<string, UserAccessToken>;
	lastActivity: { [userId: string]: number };
	dndEndTimes: { [userId: string]: number };
}
