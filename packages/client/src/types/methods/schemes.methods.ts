import type { Scheme } from "loop-types";

export interface SchemesCreateArguments {
	scheme: Scheme;
}

export interface SchemesGetArguments {
	scheme_id: string;
}

export interface SchemesListArguments {
	scope?: string;
	page?: number;
	per_page?: number;
}

export interface SchemesDeleteArguments {
	scheme_id: string;
}

export interface SchemesPatchArguments {
	scheme_id: string;
	scheme: Partial<
		Pick<Scheme, "name" | "display_name" | "description" | "scope">
	>;
}

export interface SchemesGetTeamsArguments {
	scheme_id: string;
	page?: number;
	per_page?: number;
}

export interface SchemesGetChannelsArguments {
	scheme_id: string;
	page?: number;
	per_page?: number;
}
