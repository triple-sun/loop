import type {
	Directionable,
	Paginated,
	TeamID,
	TokenOverridable
} from "./common.methods";

/**
 * Get a playbook run
 *
 * @description Get a playbook run
 */
export interface PlaybookRunsGetArguments extends TokenOverridable {
	/**
	 * @description ID of the playbook run to retrieve.
	 */
	id: string;
}

/**
 * Create a new playbook run
 *
 * @description Create a new playbook run in a team, using a playbook as template,
 * with a specific name and a specific owner.
 */
export interface PlaybookRunsCreateArguments extends TokenOverridable, TeamID {
	/**
	 * @description The name of the playbook run.
	 */
	name: string;

	/**
	 * @description The description of the playbook run.
	 */
	description?: string;

	/**
	 * @description The identifier of the user who is commanding the playbook run.
	 */
	owner_user_id: string;

	/**
	 * @description The identifier of the team where the playbook run's channel is in.
	 */
	team_id: string;

	/**
	 * @description If the playbook run was created from a post,
	 * this field contains the identifier of such post.
	 * If not, this field is empty.
	 *
	 * @default ""
	 */
	post_id?: string | "";

	/**
	 * @description The identifier of the playbook with from which this playbook run was created.
	 */
	playbook_id: string;
}

export interface PlaybookRunsListArguments
	extends TokenOverridable,
		TeamID,
		Paginated,
		Directionable {
	/**
	 * @description Number of playbook runs to return per page.
	 *
	 * @default 1000
	 */
	per_page?: number;

	/**
	 * @description Field to sort the returned playbook runs by.
	 *
	 * @default "create_at"
	 */
	sort?:
		| "id"
		| "name"
		| "is_active"
		| "create_at"
		| "end_at"
		| "team_id"
		| "owner_user_id";

	/**
	 * @description Direction (ascending or descending) followed by the sorting of the playbook runs.
	 *
	 * @default "desc"
	 */
	direction?: "desc" | "asc";

	/**
	 * @description The returned list will contain only the playbook runs with the specified statuses.
	 */
	statuses?: ("InProgress" | "Finished")[];

	/**
	 * @description The returned list will contain only the playbook runs commanded by this user.
	 * Specify "me" for current user.
	 */
	owner_user_id?: string;

	/**
	 * @description The returned list will contain only the playbook runs for
	 * which the given user is a participant.
	 *
	 * Specify "me" for current user.
	 */
	participant_id?: string | "me";

	/**
	 * @description The returned list will contain only the playbook runs whose name contains the search term.
	 */
	search_term?: string;
}
