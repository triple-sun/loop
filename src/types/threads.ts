import type { Channel } from "./channels";
import type { Post } from "./posts";
import type { UserProfile } from "./users";

type SyntheticMissingKeys =
	| "unread_replies"
	| "unread_mentions"
	| "last_viewed_at";

export enum UserThreadType {
	Synthetic = "S" // derived from post
}

export type UserThread = {
	id: string;
	reply_count: number;
	last_reply_at: number;
	last_viewed_at: number;
	participants: Array<{ id: UserProfile["id"] } | UserProfile>;
	unread_replies: number;
	unread_mentions: number;
	is_following: boolean;
	is_urgent?: boolean;
	type?: UserThreadType;
	post: {
		channel_id: Channel["id"];
		user_id: UserProfile["id"];
	};
};

export type UserThreadSynthetic = Omit<UserThread, SyntheticMissingKeys> & {
	type: UserThreadType.Synthetic;
};

export type UserThreadWithPost = UserThread & { post: Post };

export type UserThreadList = {
	total: number;
	total_unread_threads: number;
	total_unread_mentions: number;
	total_unread_urgent_mentions?: number;
	threads: UserThreadWithPost[];
};
