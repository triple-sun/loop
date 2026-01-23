import type { Stream } from "form-data";
import type {
	TokenOverridable,
	TraditionalPagingEnabled
} from "./common.methods";

export interface EmojisCreateArguments extends TokenOverridable {
	image: Buffer | Stream;
	emoji: {
		name: string;
		creator_id: string;
	};
}

export interface EmojisGetListArguments
	extends TokenOverridable,
		TraditionalPagingEnabled {
	sort?: string;
}

export interface EmojisGetArguments extends TokenOverridable {
	emoji_id: string;
}

export interface EmojisDeleteArguments extends TokenOverridable {
	emoji_id: string;
}

export interface EmojisSearchArguments
	extends TokenOverridable,
		TraditionalPagingEnabled {
	term: string;
	prefix_only?: string;
}

export interface EmojisAutocompleteArguments extends TokenOverridable {
	name: string;
}
