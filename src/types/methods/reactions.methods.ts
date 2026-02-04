import type { Reaction } from "../reactions";
import type { TokenOverridable, UserIDMe } from "./common.methods";

export interface ReactionsCreateArguments extends TokenOverridable, Reaction {}

export interface ReactionsGetForPostArguments extends TokenOverridable {
	post_id: string;
}

export interface ReactionsDeleteArguments extends TokenOverridable, UserIDMe {
	post_id: string;
	emoji_name: string;
}

export interface ReactionsGetBulkArguments extends TokenOverridable {
	post_ids: string[];
}
