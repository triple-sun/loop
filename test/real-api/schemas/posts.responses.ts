/**
 * ===============================================
 * @description Posts responses
 * ===============================================
 */

import type {
	Post,
	PostAction,
	PostAttachment,
	PostAttachmentField,
	PostProps
} from "./posts";

export type PostActionResponse = PostAction & {
	integration: never;
};

export interface PostAttachmentResponse extends PostAttachment {
	actions: PostActionResponse[];
	fields: PostAttachmentField[] | null;
}

export interface PostPropsResponse extends PostProps {
	attachments?: PostAttachment[];
}

export interface PostResponse extends Post {
	props: PostProps;
	ts: number | null;
}

export interface PostListResponse {
	order: string[];
	posts: {
		[postId: string]: PostResponse;
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
	status: "error" | "not_sent" | "unsupported" | "success";
	reason?: string;
	data?: string;
}
