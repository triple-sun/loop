/**
 * ===============================================
 * @description Posts responses
 * ===============================================
 */

import type {
	Post,
	PostActionBase,
	PostAttachment,
	PostAttachmentField,
	PostProps
} from "../posts";

export interface PostActionResponse extends PostActionBase {
	integration: never;
}

export interface PostAttachmentResponse extends PostAttachment {
	actions: PostActionResponse[];
	fields: PostAttachmentField[] | null;
}

export interface PostPropsResponse<PROP_METADATA = Record<string, unknown>>
	extends PostProps<PROP_METADATA> {
	attachments?: PostAttachment[];
}

export interface PostResponse<PROP_METADATA = Record<string, unknown>>
	extends Post<PROP_METADATA> {
	props: PostProps<PROP_METADATA>;
	ts: number | null;
}

export interface PostListResponse<PROP_METADATA = Record<string, unknown>> {
	order: string[];
	posts: {
		[postId: string]: PostResponse<PROP_METADATA>;
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
