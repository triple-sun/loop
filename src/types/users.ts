import type { TeamMembership } from "./teams";
import type { STRING_NULL, StringBool } from "./utilities";

export enum UserNotify {
	DEFAULT = "default",
	ALL = "all",
	MENTION = "mention",
	NONE = "none"
}

export enum UserNotifyComments {
	NEVER = "never",
	ROOT = "root",
	ANY = "any"
}

export enum UserNotifyDesktopSound {
	BING = "Bing",
	CRACKLE = "Crackle",
	DOWN = "Down",
	HELLO = "Hello",
	RIPPLE = "Ripple",
	UPSTAIRS = "Upstairs"
}

export enum UserNotifyMarkUnread {
	ALL = "all",
	MENTION = "mention"
}

export enum UserCallSound {
	DYNAMIC = "Dynamic",
	CALM = "Calm",
	URGENT = "Urgent",
	CHEERFUL = "Cheerful",
	NULL = ""
}

export enum PushStatus {
	OOO = "ooo",
	OFFLINE = "offline",
	AWAY = "away",
	DND = "dnd",
	ONLINE = "online"
}

export enum UserStatusValue {
	ONLINE = "online",
	AWAY = "away",
	OFFLINE = "offline",
	DND = "dnd"
}

export enum CustomStatusDuration {
	DONT_CLEAR = "",
	THIRTY_MINUTES = "thirty_minutes",
	ONE_HOUR = "one_hour",
	FOUR_HOURS = "four_hours",
	TODAY = "today",
	THIS_WEEK = "this_week",
	DATE_AND_TIME = "date_and_time",
	CUSTOM_DATE_TIME = "custom_date_time"
}

export interface NotifyProps {
	channel: StringBool;
	comments: UserNotifyComments;
	desktop: UserNotify;
	desktop_sound: StringBool;
	desktop_threads?: UserNotify;
	email: StringBool;
	email_threads?: UserNotify;
	first_name: StringBool;
	/** @version Loop only */
	loop_mobile_push_reactions?: UserNotify;
	/** @version Loop only */
	loop_mobile_push_reactions_sound?: StringBool;
	/** @version Loop only */
	loop_push_reactions?: UserNotify;
	/** @version Loop only */
	loop_push_reactions_sound?: StringBool;
	mention_keys: string;
	push: UserNotify;
	push_status: PushStatus;
	push_threads?: UserNotify;

	/**
	 * @deprecated
	 * @version Mattermost only
	 * @todo verify
	 */
	calls_desktop_sound?: StringBool;
	/**
	 * @deprecated
	 * @version Mattermost only
	 * @todo verify
	 */
	desktop_notification_sound?: UserNotifyDesktopSound;

	/**
	 * @deprecated
	 * @version Mattermost only
	 * @todo verify
	 */
	calls_notification_sound?: UserCallSound;

	/**
	 * @deprecated
	 * @version Mattermost only
	 * @todo verify
	 */
	auto_responder_active?: StringBool;

	/**
	 * @deprecated
	 * @version Mattermost only
	 * @todo verify
	 */
	auto_responder_message?: string;

	/**
	 * @deprecated
	 * @version Mattermost only
	 * @todo verify
	 */
	calls_mobile_sound?: StringBool | STRING_NULL;

	/**
	 * @deprecated
	 * @version Mattermost only
	 * @todo verify
	 */
	calls_mobile_notification_sound?: UserCallSound;
}

export interface UserProfile {
	id: string;

	/** @description unix format */
	create_at: number;

	/** @description unix format */
	update_at: number;

	/** @description unix format */
	delete_at: number;

	/** @default '' */
	username: string;

	/** @default '' */
	auth_data: string;

	/** @default '' */
	auth_service: string;

	email: string;

	/** @version Loop only */
	email_verified?: boolean;

	/** @default '' */
	nickname: string;

	/** @default '' */
	first_name: string;

	/** @default '' */
	last_name: string;

	/** @default '' */
	position: string;

	/** @description excluded from responses */
	password?: string;

	/**
	 * @description User roles in string format
	 * @example "system_admin system_user"
	 */
	roles: string;

	/** @todo verify possible props */
	props?: {
		[key: string]: unknown;
		customStatus?: UserCustomStatus;
	};

	notify_props: NotifyProps;

	last_password_update: number;

	/**
	 * @description Will be undefined if no picture was set
	 */
	last_picture_update?: number;

	/**
	 * @version Loop @default 'ru'
	 * @version Mattermost @default 'en'
	 */
	locale: string;

	timezone?: UserTimezone;

	/** @default '' */
	remote_id?: string;

	/** @version Loop only */
	disable_welcome_email?: boolean;

	/**
	 * @deprecated
	 * @version Mattermost only
	 * @todo verify
	 */ status?: string;

	/**
	 * @deprecated
	 * @version Mattermost only
	 */ mfa_active?: boolean;

	/**
	 * @deprecated
	 * @version Mattermost only
	 */ last_activity_at?: number;

	/**
	 * @deprecated
	 * @version Mattermost only
	 */ is_bot?: boolean;

	/**
	 * @deprecated
	 * @version Mattermost only
	 */ bot_description?: string;

	/**
	 * @deprecated
	 * @version Mattermost only
	 */ terms_of_service_id?: string;

	/**
	 * @deprecated
	 * @version Mattermost only
	 */ terms_of_service_create_at?: number;
}

export interface UserProfileWithLastViewAt extends UserProfile {
	last_viewed_at: number;
}

export interface UserSession {
	id: string;
	token: string;
	create_at: number;
	expires_at: number;
	last_activity_at: number;
	user_id: string;
	device_id: string;
	roles: string;
	is_oauth: boolean;
	props: Record<string, unknown>;
	team_members: TeamMembership[];
	local: boolean;
}

export interface UserTimezone {
	useAutomaticTimezone: boolean | StringBool;
	automaticTimezone: string;
	manualTimezone: string;
}

export interface UserStatus {
	user_id: string;
	status: UserStatusValue;
	manual?: boolean;
	last_activity_at?: number;
	active_channel?: string;
	dnd_end_time?: number;
}

export interface UserCustomStatus {
	emoji: string;
	text: string;
	duration: CustomStatusDuration;
	expires_at?: string;
}

export interface UserAccessToken {
	id: string;
	token?: string;
	user_id: string;
	description: string;
	is_active: boolean;
}

export interface UsersStats {
	total_users_count: number;
}

export interface GetFilteredUsersStatsOpts {
	in_team?: string;
	in_channel?: string;
	include_deleted?: boolean;
	include_bots?: boolean;
	include_remote_users?: boolean;
	roles?: string[];
	channel_roles?: string[];
	team_roles?: string[];
}

export interface AuthChangeResponse {
	follow_link: string;
}
