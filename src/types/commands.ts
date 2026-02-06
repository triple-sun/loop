export enum CommandMethod {
	POST = "P",
	GET = "G",
	NULL = ""
}

export interface Command {
	/**
	 * @description The ID of the slash command
	 */
	id: string;

	/**
	 * @description The token which is used to verify the source of the payload
	 */
	token: string;

	/**
	 * @description Display name for the command
	 */
	display_name: string;

	/**
	 * @description Description for this command
	 */
	description: string;

	/**
	 * @description The URL that is triggered
	 */
	url: string;

	/**
	 * @description The string that triggers this command
	 */
	trigger: string;

	/**
	 * @description Is the trigger done with HTTP Get ('G') or HTTP Post ('P')
	 */
	method: CommandMethod;

	/**
	 * @description What is the username for the response post
	 */
	username: string;

	/**
	 * @description The url to find the icon for this users avatar
	 */
	icon_url: string;

	/**
	 * @description Use auto complete for this command
	 */
	auto_complete: boolean;

	/**
	 * @description The description for this command shown when selecting the command
	 */
	auto_complete_desc: string;

	/**
	 * @description The hint for this command
	 */
	auto_complete_hint: string;

	/**
	 * @description The time in milliseconds the command was created
	 */
	create_at: number;

	/**
	 * @description The time in milliseconds the command was last updated
	 */
	update_at: number;

	/**
	 * @description The time in milliseconds the command was deleted, 0 if never deleted
	 */
	delete_at: number;

	/**
	 * @description The user id for the commands creator
	 */
	creator_id: string;

	/**
	 * @description The team id for which this command is configured
	 */
	team_id: string;
}

export interface CommandArgs {
	channel_id: string;
	team_id?: string;
	root_id?: string;
}
