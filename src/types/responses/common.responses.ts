export interface StatusOKResponse {
	status: "OK";
}

export interface PaginatedListResponse<T> {
	/**
	 * @description The total number of playbooks in the list, regardless of the paging.
	 */
	total_count: number;

	/**
	 * @description The total number of pages.
	 * This depends on the total number of playbooks in the database and the per_page parameter sent with the request.
	 */
	page_count: number;

	/**
	 * @description A boolean describing whether there are more pages after the currently returned.
	 */
	has_more: boolean;

	/**
	 * @description Items in this page
	 */
	items: T[];
}
