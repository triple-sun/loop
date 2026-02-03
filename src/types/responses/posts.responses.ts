/**
 * ===============================================
 * @description Posts responses
 * ===============================================
 */

import type { Post } from "../posts";

export enum PostNotificationStatus {
	ERROR = "error",
	NOT_SENT = "not_sent",
	UNSUPPORTED = "unsupported",
	SUCCESS = "success"
}

export interface PostListResponse {
	order: string[];
	posts: {
		[postId: string]: Post;
	};
	next_post_id: string;
	prev_post_id: string;
	first_inaccessible_post_time: number;
}

export interface PaginatedPostListResponse extends PostListResponse {
	has_next: boolean;
}

export interface PostSearchResponse extends PostListResponse {
	matches: { [postId: string]: string[] };
}

export interface PostsUsageResponse {
	count: number;
}

export interface PostNotificationResponse {
	status: PostNotificationStatus;
	reason?: string;
	data?: string;
}
