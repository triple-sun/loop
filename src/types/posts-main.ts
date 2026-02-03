import type { AppBinding } from "./apps";
import type {
	PostAttachment,
	PostMetadata,
	PostState,
	PostType
} from "./posts";
import type { UserProfile } from "./users";
import type { StringBool } from "./utilities";

/**
 * ===============================================
 * @description Posts main object
 * ===============================================
 */
export interface Post<PROPS_TYPE = Record<string, unknown>> {
	id: string;
	create_at: number;
	update_at: number;
	edit_at: number;
	delete_at: number;
	is_pinned: boolean;
	user_id: string;
	channel_id: string;
	root_id: string;
	original_id: string;
	message: string;
	type: PostType;
	props?: PROPS_TYPE & {
		app_bindings?: AppBinding[];
		attachments?: PostAttachment[];
		from_bot?: StringBool;
	};
	hashtags: string;
	pending_post_id: string;
	reply_count: number;
	file_ids?: string[];
	metadata: PostMetadata;
	failed?: boolean;
	user_activity_posts?: Post[];
	state?: PostState;
	filenames?: string[];
	last_reply_at?: number;
	participants?: Array<UserProfile | UserProfile["id"]>;
	message_source?: string;
	is_following?: boolean;
	exists?: boolean;
}
