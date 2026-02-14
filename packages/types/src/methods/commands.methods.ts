import type { Command, CommandMethod } from "../commands";
import type { TeamID, TokenOverridable } from "./common.methods";

/**
 * @description Create a command for a team.
 *
 * Must have `manage_slash_commands` permission for the team the command is in.
 * @see {@link https://developers.loop.ru/API/4.0.0/create-command|Create command}
 */
export interface CommandsCreateArguments extends TokenOverridable {
	/**
	 * @description Team ID to where the command should be created
	 */
	team_id: string;
	/**
	 * @description `P` for post request, `G` for get request
	 */
	method: CommandMethod;
	/**
	 * @description Activation word to trigger the command
	 */
	trigger: string;
	/**
	 * @description The URL that the command will make the request
	 */
	url: string;
	/**
	 * @description The name of the command
	 */
	display_name?: string;
	/**
	 * @description The description of the command
	 */
	description?: string;
	/**
	 * @description The username that the command will show
	 */
	username?: string;
	/**
	 * @description The icon URL that the command will show
	 */
	icon_url?: string;
	/**
	 * @description Whether to show autocomplete options
	 */
	auto_complete?: boolean;
	/**
	 * @description The description of the autocomplete usage
	 */
	auto_complete_desc?: string;
	/**
	 * @description The hint of the autocomplete usage
	 */
	auto_complete_hint?: string;
}

/**
 * Get a command
 *
 * @description Get a command definition based on command id string.
 *
 * Must have `manage_slash_commands` permission for the team the command is in.
 * @see {@link https://developers.loop.ru/API/4.0.0/get-command-by-id|Get command}
 */
export interface CommandsGetArguments
	extends Partial<Command>,
		TokenOverridable {
	id: string;
}

/**
 * Update a command
 *
 * @description Update a single command based on command id string and Command struct.
 *
 * Must have `manage_slash_commands` permission for the team the command is in.
 */
export interface CommandsUpdateArguments
	extends Partial<Command>,
		TokenOverridable {
	id: string;
}

/**
 * @description List commands for a team.
 *
 * Must have `manage_slash_commands` permisson if need to list custom commands.
 * @see {@link https://developers.loop.ru/API/4.0.0/update-command|Update command}
 */
export interface CommandsUpdateArguments
	extends Partial<Command>,
		TokenOverridable {
	id: string;
}

/**
 * Delete a command
 *
 * @description Delete a command based on command id string.
 *
 * Must have `manage_slash_commands` permission for the team the command is in.
 * @see {@link https://developers.loop.ru/API/4.0.0/delete-command|Delete command}
 */
export interface CommandsDeleteArguments extends TokenOverridable {
	command_id: string;
}

/**
 * Move a command
 * @description Move a command to a different team based on command id string.
 *
 * Must have manage_slash_commands permission for the team the command is currently in and the destination team.
 * @see {@link https://developers.loop.ru/API/4.0.0/move-command|Move command}
 */
export interface CommandsMoveArguments extends TokenOverridable {
	/**
	 * @description ID of the command to move
	 */
	command_id: string;

	/**
	 * @description Destination team ID
	 */
	team_id: string;
}

/**
 * List commands for a team
 *
 * @description List commands for a team.
 *
 * Must have `manage_slash_commands` permission if need to list custom commands.
 * @see {@link https://developers.loop.ru/API/4.0.0/list-commands|List commands}
 */
export interface CommandsListArguments extends TokenOverridable {
	team_id?: string;
	custom_only?: boolean;
}

/**
 * List autocomplete commands in the team.
 *
 * Must have `view_team` permission for the team.
 * @see {@link https://developers.loop.ru/API/4.0.0/list-autocomplete-commands|List autocomplete commands}
 */
export interface CommandsListAutocompleteArguments
	extends TokenOverridable,
		TeamID {}

/**
 * List autocomplete commands
 *
 * @description List autocomplete commands in the team.
 *
 * Must have `view_team` permission for the team.
 * @version 5.24+
 * @see {@link https://developers.loop.ru/API/4.0.0/list-command-autocomplete-suggestions|List autocomplete command data}
 */
export interface CommandsListAutocompleteDataArguments
	extends TokenOverridable,
		TeamID {
	user_input: string;
}

/**
 * Generate a new token
 *
 * @description Generate a new token for the command based on command id string.
 *
 * Must have `manage_slash_commands` permission for the team the command is in.
 * @see {@link https://developers.loop.ru/API/4.0.0/regen-command-token|Regenerate command token}
 */
export interface CommandsRegenerateTokenArguments extends TokenOverridable {
	command_id: string;
}

/**
 * Execute a command
 *
 * @description Execute a command on a team.
 *
 * Must have `use_slash_commands` permission for the team the command is in.
 * @see {@link https://developers.loop.ru/API/4.0.0/execute-command|Execute command}
 */
export interface CommandsExecuteArguments extends TokenOverridable {
	/**
	 * @description Channel Id where the command will execute
	 */
	channel_id: string;

	/**
	 * @description The slash command to execute, including parameters.
	 *
	 * @example '/echo bounces around the room'
	 */
	command: string;
}
