import type { Post } from "../posts/posts";
import type {
	ChannelID,
	TeamID,
	TokenOverridable,
	TraditionalPagingEnabled,
	UserID
} from "./common.methods";

export interface PostsCreateArguments extends TokenOverridable, ChannelID {
	message: string;
	root_id?: string;
	file_ids?: string[];
	props?: Record<string, unknown>;
	metadata?: Record<string, unknown>;
}

export interface PostsUpdateArguments
	extends TokenOverridable,
		Omit<Partial<Post>, "id"> {
	id: string;
}

export interface PostsGetArguments extends TokenOverridable {
	post_id: string;
}

export interface PostsDeleteArguments extends TokenOverridable {
	post_id: string;
}

export interface PostsGetThreadArguments
	extends TokenOverridable,
		TraditionalPagingEnabled {
	post_id: string;
}

export interface PostsGetForChannelArguments
	extends TokenOverridable,
		ChannelID,
		TraditionalPagingEnabled {
	include_deleted?: boolean;
	since?: number;
	before?: string;
	after?: string;
}

export interface PostsPinArguments extends TokenOverridable {
	post_id: string;
}

export interface PostsUnpinArguments extends TokenOverridable {
	post_id: string;
}
