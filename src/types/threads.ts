import type { Post } from "./posts";
import type { UserProfile } from "./users";

export interface UserThreadSynthetic
	extends Omit<
		UserThread,
		"unread_replies" | "unread_mentions" | "last_viewed_at"
	> {
	type: "S";
}

export interface UserThreadWithPost extends UserThread {
	post: Post;
}

export interface UserThread {
	id: string;
	reply_count: number;
	last_reply_at: number;
	last_viewed_at: number;
	participants: Array<{ id: string } | UserProfile>;
	unread_replies: number;
	unread_mentions: number;
	is_following: boolean;
	is_urgent?: boolean;
	type?: "S" | "";
	post: {
		channel_id: string;
		user_id: string;
	};
}

export interface UserThreadList {
	total: number;
	total_unread_threads: number;
	total_unread_mentions: number;
	total_unread_urgent_mentions?: number;
	threads: UserThreadWithPost[];
}
