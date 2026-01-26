import type { Stream } from "form-data";
import type { Paginated, TokenOverridable } from "./common.methods";

export interface EmojisCreateArguments extends TokenOverridable {
	image: Buffer | Stream;
	emoji: {
		name: string;
		creator_id: string;
	};
}

export interface EmojisGetListArguments extends TokenOverridable, Paginated {
	sort?: string;
}

export interface EmojisGetArguments extends TokenOverridable {
	emoji_id: string;
}

export interface EmojisDeleteArguments extends TokenOverridable {
	emoji_id: string;
}

export interface EmojisSearchArguments extends TokenOverridable, Paginated {
	term: string;
	prefix_only?: string;
}

export interface EmojisAutocompleteArguments extends TokenOverridable {
	name: string;
}

export interface EmojisGetByNameArguments extends TokenOverridable {
	name: string;
}

export interface EmojisGetImageArguments extends TokenOverridable {
	emoji_id: string;
}
