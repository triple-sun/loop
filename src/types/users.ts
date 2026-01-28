import type { Audit } from "./audits";
import type { Channel } from "./channels/channels";
import type { Group } from "./groups";
import type { Session } from "./sessions";
import type { Team } from "./teams";
import type {
	IDMappedObjects,
	RelationOneToManyUnique,
	RelationOneToOne,
	StringBool
} from "./utilities";

export enum Notify {
	Default = "default",
	All = "all",
	Mention = "mention",
	None = "none"
}

export enum NotifyDesktopSound {
	Bing = "Bing",
	Crackle = "Crackle",
	Down = "Down",
	Hello = "Hello",
	Ripple = "Ripple",
	Upstairs = "Upstairs"
}

export enum CallSound {
	Dynamic = "Dynamic",
	Calm = "Calm",
	Urgent = "Urgent",
	Cheerful = "Cheerful",
	None = ""
}

export enum PushStatus {
	Ooo = "ooo",
	Offline = "offline",
	Away = "away",
	DnD = "dnd",
	Online = "online"
}

export enum UserStatusValue {
	Onlines = "online",
	Away = "away",
	Offline = "offline",
	DnD = "dnd"
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

export enum NotifyComments {
	Never = "never",
	Root = "root",
	Any = "any"
}

export enum MarkUnread {
	All = "all",
	Mention = "mention"
}

export interface NotifyProps {
	desktop: Notify;
	desktop_sound: StringBool;
	calls_desktop_sound: StringBool;
	email: StringBool;
	push: Notify;
	push_status: PushStatus;
	comments: NotifyComments;
	first_name: StringBool;
	channel: StringBool;
	mention_keys: string;

	//highlight_keys: string;
	//mark_unread: ENotifyMarkUnread;

	desktop_notification_sound?: NotifyDesktopSound;
	calls_notification_sound?: CallSound;
	desktop_threads?: Notify;
	email_threads?: Notify;
	push_threads?: Notify;
	auto_responder_active?: StringBool;
	auto_responder_message?: string;
	calls_mobile_sound?: StringBool | "";
	calls_mobile_notification_sound?: CallSound;
}

export interface UserProfile {
	id: string;
	create_at: number;
	update_at: number;
	delete_at: number;
	username: string;
	password?: string;
	auth_service: string;
	email: string;
	nickname: string;
	first_name: string;
	last_name: string;
	position: string;
	roles: string;
	props?: Record<string, string>;
	notify_props: NotifyProps;
	last_password_update: number;
	last_picture_update: number;
	locale: string;
	timezone?: UserTimezone;
	//mfa_active: boolean;
	//last_activity_at: number;
	//is_bot: boolean;
	//bot_description: string;
	//terms_of_service_id: string;
	//terms_of_service_create_at: number;
	remote_id?: string;
	status?: string;
}

export interface UserProfileWithLastViewAt extends UserProfile {
	last_viewed_at: number;
}

export interface UsersState {
	currentUserId: string;
	isManualStatus: RelationOneToOne<UserProfile, boolean>;
	mySessions: Session[];
	myAudits: Audit[];
	profiles: IDMappedObjects<UserProfile>;
	profilesInTeam: RelationOneToManyUnique<Team, UserProfile>;
	profilesNotInTeam: RelationOneToManyUnique<Team, UserProfile>;
	profilesWithoutTeam: Set<string>;
	profilesInChannel: RelationOneToManyUnique<Channel, UserProfile>;
	profilesNotInChannel: RelationOneToManyUnique<Channel, UserProfile>;
	profilesInGroup: RelationOneToManyUnique<Group, UserProfile>;
	profilesNotInGroup: RelationOneToManyUnique<Group, UserProfile>;
	statuses: RelationOneToOne<UserProfile, string>;
	stats: Partial<UsersStats>;
	filteredStats: Partial<UsersStats>;
	myUserAccessTokens: Record<string, UserAccessToken>;
	lastActivity: RelationOneToOne<UserProfile, number>;
	dndEndTimes: RelationOneToOne<UserProfile, number>;
}

export interface UserTimezone {
	useAutomaticTimezone: boolean | string;
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
