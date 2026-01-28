export type Search = {
	terms: string;
	isOrSearch: boolean;
};

export type SearchState = {
	current: unknown;
	results: string[];
	fileResults: string[];
	flagged: string[];
	pinned: Record<string, string[]>;
	isSearchingTerm: boolean;
	isSearchGettingMore: boolean;
	isLimitedResults: number;
	matches: {
		[x: string]: string[];
	};
};

export type SearchParameter = {
	terms: string;
	is_or_search: boolean;
	time_zone_offset?: number;
	page: number;
	per_page: number;
	include_deleted_channels: boolean;
};
