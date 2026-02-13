import type { Draft } from "./general";

export enum ScheduledPostErrorCode {
	UNKNOWN = "unknown",
	CHANNEL_ARCHIVED = "channel_archived",
	CHANNEL_NOT_FOUND = "channel_not_found",
	USER_MISSING = "user_missing",
	USER_DELETED = "user_deleted",
	NO_CHANNEL_PERMISSION = "no_channel_permission",
	NO_CHANNEL_MEMBER = "no_channel_member",
	THREAD_DELETED = "thread_deleted",
	UNABLE_TO_SEND = "unable_to_send",
	INVALID_POST = "invalid_post"
}

export interface SchedulingInfo {
	scheduled_at: number;
	processed_at?: number;
	error_code?: ScheduledPostErrorCode;
}

export interface ScheduledPost
	extends Omit<Draft, "delete_at">,
		SchedulingInfo {
	id: string;
}

export interface ScheduledPostsState {
	byId: {
		[scheduledPostId: string]: ScheduledPost | undefined;
	};
	byTeamId: {
		[teamId: string]: string[];
	};
	errorsByTeamId: {
		[teamId: string]: string[];
	};
	byChannelOrThreadId: {
		[channelId: string]: string[];
	};
}
