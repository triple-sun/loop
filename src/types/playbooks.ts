export interface Playbook {
	/**
	 * @description A unique, 26 characters long, alphanumeric identifier for the playbook.
	 */
	id: string;

	/**
	 * @description The title of the playbook.
	 */
	title: string;

	/**
	 * @description The description of the playbook.
	 */
	description: string;

	/**
	 * @description The identifier of the team where the playbook is in.
	 */
	team_id: string;

	/**
	 * @description A boolean indicating whether the playbook runs created
	 * from this playbook should be public or private.
	 */
	create_public_playbook_run?: boolean;

	/**
	 * @description The playbook creation timestamp,
	 * formatted as the number of milliseconds: since the Unix epoch.
	 */
	create_at: number;

	/**
	 * @description The playbook deletion timestamp,
	 * formatted as the number of milliseconds: since the Unix epoch.
	 *
	 * It equals 0 if the playbook is not deleted.
	 * @default 0
	 */
	delete_at: number;

	/**
	 * @description The number of stages defined in this playbook.
	 */
	num_stages: number;

	/**
	 * @description The total number of steps from all the: stages defined in this playbook.
	 */
	num_steps: number;

	/**
	 * @description The: stages defined in this playbook.
	 */
	checklists: PlaybookChecklist[];

	/**
	 * @description The identifiers of all the users that are members of this playbook.
	 */
	member_ids: string[];
}

export interface PlaybookChecklist {
	/**
	 * @description A unique, 26 characters long, alphanumeric identifier for the checklist.
	 */
	id: string;

	/**
	 * @description The title of the checklist.
	 */
	title: string;

	/**
	 * @description The list of tasks to do.
	 */
	items: PlaybookTask[];
}

export interface PlaybookTask {
	/**
	 * @description A unique, 26 characters long, alphanumeric identifier for the checklist item.
	 */
	id: string;

	/**
	 * @description The title of the checklist item.
	 */
	title: string;

	/**
	 * @description The state of the checklist item.
	 * An empty string means that the item is not done.
	 *
	 * @default ""
	 */
	state: "" | "in_progress" | "closed";

	/**
	 * @description The timestamp for the latest modification of the item's state,
	 * formatted as the number of milliseconds since the Unix epoch.
	 * It equals 0 if the item was never modified.
	 * @default 0
	 */
	state_modified: number;

	/**
	 * @description The identifier of the user that has been assigned to complete this item.
	 *  If the item has no assignee, this is an empty string.
	 *
	 * @default ""
	 */
	assignee_id: string | "";

	/**
	 * @description The timestamp for the latest modification of the item's assignee,
	 * formatted as the number of milliseconds since the Unix epoch.
	 * It equals 0 if the item never got an assignee.
	 *
	 * @default 0
	 */
	assignee_modified: number;

	/**
	 * @description The slash command associated with this item.
	 * If the item has no slash command associated, this is an empty string
	 *
	 * @default ""
	 */
	command: string;

	/**
	 * @description The timestamp for the latest execution of the item's command,
	 * formatted as the number of milliseconds since the Unix epoch.
	 * It equals 0 if the command was never executed.
	 *
	 * @default 0
	 */
	command_last_run: number;

	/**
	 * @description A detailed description of the checklist item, formatted with Markdown.
	 */
	description: string;
}

export interface PlaybookRun {
	/**
	 * @description A unique, 26 characters long, alphanumeric identifier for the playbook run.
	 */
	id: string;

	/**
	 * @description The name of the playbook run.
	 */
	name: string;

	/**
	 * @description The description of the playbook run.
	 */
	description: string;

	/**
	 * @description True if the playbook run is ongoing; false if the playbook run is ended.
	 */
	is_active: boolean;

	/**
	 * @description The identifier of the user that is commanding the playbook run.
	 */
	owner_user_id: string;

	/**
	 * @description The identifier of the team where the playbook run's channel is in.
	 */
	team_id: string;

	/**
	 * @description The identifier of the playbook run's channel.
	 */
	channel_id: string;

	/**
	 * @description The playbook run creation timestamp,
	 * formatted as the number of milliseconds since the Unix epoch.
	 */
	create_at: number;

	/**
	 * @description The playbook run finish timestamp,
	 * formatted as the number of milliseconds since the Unix epoch.
	 *
	 * It equals 0 if the playbook run is not finished.
	 *
	 * @default 0
	 */
	end_at: number;

	/**
	 * @description The playbook run deletion timestamp,
	 * formatted as the number of milliseconds since the Unix epoch.
	 *
	 * It equals 0 if the playbook run is not deleted.
	 *
	 * @default 0
	 */
	delete_at: number;

	/**
	 * @description Zero-based index of the currently active stage.
	 */
	active_stage: number;

	/**
	 * @description The title of the currently active stage.
	 */
	active_stage_title: string;

	/**
	 * @description If the playbook run was created from a post,
	 * this field contains the identifier of such post.
	 * If not, this field is empty.
	 *
	 * @default ""
	 */
	post_id: string | "";

	/**
	 * @description The identifier of the playbook with from which this playbook run was created.
	 */
	playbook_id: string;

	checklists: PlaybookChecklist[];
}

export interface PlaybookRunMetadata {
	/**
	 * @description Name of the channel associated to the playbook run.
	 */
	channel_name: string;

	/**
	 * @description Display name of the channel associated to the playbook run.
	 */
	channel_display_name: string;

	/**
	 * @description Name of the team the playbook run is in.
	 */
	team_name: string;

	/**
	 * @description Number of users that have been members of the playbook run at any point.
	 */
	num_members: number;

	/**
	 * @description Number of posts in the channel associated to the playbook run.
	 */
	total_posts: number;
}
