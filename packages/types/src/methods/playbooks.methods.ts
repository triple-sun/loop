import type { Playbook, PlaybookChecklist, PlaybookTask } from "../playbooks";
import type {
	Directionable,
	Paginated,
	TeamID,
	TokenOverridable
} from "./common.methods";

/**
 * List all playbooks
 *
 * @description Retrieve a paged list of playbooks, filtered by team,
 * and sorted by title, number of stages or number of steps.
 *
 * @see {@link https://developers.loop.ru/API/4.0.0/get-playbooks | List playbooks}
 */
export interface PlaybooksListArguments
	extends TokenOverridable,
		TeamID,
		Paginated,
		Directionable {
	/**
	 * @description ID of the team to filter by.
	 *
	 * @example 08fmfasq5wit3qyfmq4mjk0rto
	 */
	team_id: string;

	/**
	 * @description Number of playbooks to return per page.
	 * @default 1000
	 */
	per_page?: number;

	/**
	 * @description Field to sort the returned playbooks by title,
	 * number of stages or total number of steps.
	 * @default "title"
	 */
	sort?: "title" | "stages" | "steps";

	/**
	 * @description Direction (ascending or descending) followed by the sorting of the playbooks.
	 *
	 * @default "asc"
	 */
	direction?: "desc" | "asc";

	/**
	 * @description Includes archived playbooks in the result.
	 */
	with_archived?: boolean;
}

/**
 * @description Get a playbook type
 *
 * @see {@link https://developers.loop.ru/API/4.0.0/get-playbook | Get a playbook}
 */
export interface PlaybooksGetArguments extends TokenOverridable {
	id: string;
}

export interface CreatePlaybookTask
	extends Partial<Pick<PlaybookTask, "title" | "command" | "description">> {
	title: Required<string>;
}
export interface CreatePlaybookChecklist
	extends Pick<PlaybookChecklist, "title"> {
	items: CreatePlaybookTask;
}

/**
 * Create a playbook types
 *
 * @description Create a playbook
 *
 * @see {@link https://developers.loop.ru/API/4.0.0/create-playbook | Create a playbook}
 */
export interface PlaybooksCreateArguments extends TokenOverridable, TeamID {
	/**
	 * @description The title of the playbook.
	 */
	title: string;

	/**
	 * @description The description of the playbook.
	 */
	description?: string;

	/**
	 * @description A boolean indicating whether the playbook runs created from this playbook should be public or private.
	 */
	create_public_playbook_run: boolean;

	/**
	 * @description The stages defined by this playbook.
	 */
	checklists: CreatePlaybookChecklist[];

	/**
	 * @description The identifiers of all the users that are members of this playbook.
	 */
	member_ids: string[];

	/**
	 * @description The IDs of the channels where all the status updates will be broadcasted.
	 * The team of the broadcast channel must be the same as the playbook's team.
	 */
	broadcast_channel_ids?: string[];

	/**
	 * @description A list with the IDs of the members to be automatically invited to
	 * the playbook run's channel as soon as the playbook run is created.
	 */
	invited_user_ids?: string[];

	/**
	 * @description Boolean that indicates whether the members declared in
	 * invited_user_ids will be automatically invited.
	 */
	invite_users_enabled?: boolean;

	/**
	 * @description User ID of the member that will be automatically assigned as owner as soon as the playbook run is created.
	 * If the member is not part of the playbook run's channel or is not included in the invited_user_ids list, they will be automatically invited to the channel.
	 */
	default_owner_id?: string;

	/**
	 * @description Boolean that indicates whether the member declared in default_owner_id will be automatically assigned as owner.
	 */
	default_owner_enabled?: boolean;

	/**
	 * @description ID of the channel where the playbook run will be automatically announced as soon as the playbook run is created.
	 */
	announcement_channel_id?: string;

	/**
	 * @description Boolean that indicates whether the playbook run creation will be announced in the channel declared in announcement_channel_id.
	 */
	announcement_channel_enabled?: boolean;

	/**
	 * @description An absolute URL where a POST request will be sent as soon as the playbook run is created.
	 * The allowed protocols are HTTP and HTTPS.
	 */
	webhook_on_creation_url?: string;

	/**
	 * @description Boolean that indicates whether the webhook declared in webhook_on_creation_url will be automatically sent.
	 */
	webhook_on_creation_enabled?: boolean;

	/**
	 * @description An absolute URL where a POST request will be sent as soon as the playbook run's status is updated.
	 * The allowed protocols are HTTP and HTTPS.
	 */
	webhook_on_status_update_url?: string;

	/**
	 * @description Boolean that indicates whether the webhook declared in webhook_on_status_update_url will be automatically sent.
	 */
	webhook_on_status_update_enabled?: boolean;
}

/**
 * Update a playbook
 *
 * @description Update a playbook
 *
 * @see {@link https://developers.loop.ru/API/4.0.0/update-playbook | Update a playbook}
 */
export interface PlaybooksUpdateArguments
	extends TokenOverridable,
		Pick<
			Playbook,
			| "id"
			| "title"
			| "description"
			| "team_id"
			| "create_public_playbook_run"
			| "create_at"
			| "delete_at"
			| "num_stages"
			| "num_steps"
			| "checklists"
			| "member_ids"
		> {
	id: string;
}

/**
 * Delete a playbook
 *
 * @description Delete a playbook
 *
 * @see {@link https://developers.loop.ru/API/4.0.0/delete-playbook | Delete a playbook}
 */
export interface PlaybooksDeleteArguments extends TokenOverridable {
	/**
	 * @description ID of the playbook to delete.
	 */
	id: string;
}
