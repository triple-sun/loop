import type { UserProfile } from "./users";

export enum UserReportSortColumns {
	USERNAME = "Username",
	EMAIL = "Email",
	CREATE_AT = "CreateAt",
	FIRST_NAME = "FirstName",
	LAST_NAME = "LastName",
	NICKNAME = "Nickname"
}

export enum ReportSortDirection {
	ASC = "asc",
	DESC = "desc"
}

export enum ReportDuration {
	ALL_TIME = "all_time",
	LAST_30_DAYS = "last_30_days",
	PREV_MONTH = "previous_month",
	LAST_6_MONTHS = "last_6_months"
}

export enum CursorPaginationDirection {
	PREV = "prev",
	NEXT = "next"
}

export type UserReportFilter = {
	role_filter?: string;
	has_no_team?: boolean;
	team_filter?: string;
	hide_active?: boolean;
	hide_inactive?: boolean;
	search_term?: string;
};

export interface UserReportOptions extends UserReportFilter {
	page_size?: number;

	// Following are optional sort parameters
	/**
	 * The column to sort on. Provide the id of the column. Use the UserReportSortColumns enum.
	 */
	sort_column?: UserReportSortColumns;

	/**
	 * The sort direction to use. Either "asc" or "desc". Use the ReportSortDirection enum.
	 */
	sort_direction?: ReportSortDirection;

	// Following are optional pagination parameters
	/**
	 * The direction to paginate in. Either "up" or "down". Use the CursorPaginationDirection enum.
	 */
	direction?: CursorPaginationDirection;

	/**
	 * The cursor to paginate from.
	 */
	from_column_value?: string;

	/**
	 * The id of the user to paginate from.
	 */
	from_id?: string;

	// Following are optional filters
	/**
	 * The duration to filter by. Use the ReportDuration enum.
	 */
	date_range?: ReportDuration;
}

export interface UserReport extends UserProfile {
	last_login_at: number;
	last_status_at?: number;
	last_post_date?: number;
	days_active?: number;
	total_posts?: number;
}
