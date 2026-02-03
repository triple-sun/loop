export type Search = {
	terms: string;
	isOrSearch: boolean;
};

export type SearchParameter = {
	terms: string;
	is_or_search: boolean;
	time_zone_offset?: number;
	page: number;
	per_page: number;
	include_deleted_channels: boolean;
};
