export enum RequestStatusOption {
	NOT_STARTED = "not_started",
	STARTED = "started",
	SUCCESS = "success",
	FAILURE = "failure",
	CANCELLED = "cancelled"
}

export interface RequestStatusType {
	status: RequestStatusOption;
	error: null | Record<string, unknown>;
}

export interface ChannelsRequestsStatuses {
	getChannels: RequestStatusType;
	getAllChannels: RequestStatusType;
	myChannels: RequestStatusType;
	createChannel: RequestStatusType;
}

export interface GeneralRequestsStatuses {
	websocket: RequestStatusType;
}

export interface PostsRequestsStatuses {
	createPost: RequestStatusType;
	editPost: RequestStatusType;
	getPostThread: RequestStatusType;
}

export interface ThreadsRequestStatuses {
	getThreads: RequestStatusType;
}

export interface TeamsRequestsStatuses {
	getMyTeams: RequestStatusType;
	getTeams: RequestStatusType;
}

export interface UsersRequestsStatuses {
	login: RequestStatusType;
	logout: RequestStatusType;
	autocompleteUsers: RequestStatusType;
	updateMe: RequestStatusType;
}

export interface AdminRequestsStatuses {
	createCompliance: RequestStatusType;
}

export interface EmojisRequestsStatuses {
	createCustomEmoji: RequestStatusType;
	getCustomEmojis: RequestStatusType;
	deleteCustomEmoji: RequestStatusType;
	getCustomEmoji: RequestStatusType;
}

export interface FilesRequestsStatuses {
	uploadFiles: RequestStatusType;
}

export interface RolesRequestsStatuses {
	getRolesByNames: RequestStatusType;
	getRoleByName: RequestStatusType;
	getRole: RequestStatusType;
	editRole: RequestStatusType;
}

export interface SearchRequestsStatuses {
	flaggedPosts: RequestStatusType;
	pinnedPosts: RequestStatusType;
}
