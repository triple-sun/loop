import type { AppContextProps } from "./apps";
import type { Dialog } from "./dialog";
import type { PostActionType } from "./posts/posts-action";

export interface Context {
	app_id?: string;
	location?: string;
	acting_user_id?: string;
	user_id?: string;
	channel_id?: string;
	team_id?: string;
	post_id?: string;
	root_id?: string;
	props?: AppContextProps;
	user_agent?: string;
	track_as_submit?: boolean;
	acting_user?: { id: string };
	type?: PostActionType;
	service?: string;
	token?: string;
	general?: number;
	nav?: {
		history?: string[];
		goBack?: boolean;
	};
	confirm?: {
		dialog: Dialog;
		path: string;
	};
	[key: string]: unknown;
}
