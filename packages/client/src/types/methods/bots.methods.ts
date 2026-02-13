import type { Paginated, TokenOverridable, UserID } from "./common.methods";

export interface BotUserID {
	bot_user_id: string;
}
/**
 * Arguments for creating a bot.
 */
export interface BotsCreateArguments extends TokenOverridable {
	username: string;
	display_name?: string;
	description?: string;
}

/**
 * Arguments for cleaning/updating a bot.
 */
export interface BotsPatchArguments
	extends TokenOverridable,
		Partial<BotsCreateArguments>,
		BotUserID {}

/**
 * Arguments for getting a bot.
 */
export interface BotsGetArguments extends TokenOverridable, UserID {}

/**
 * Arguments for listing bots.
 */
export interface BotsListArguments extends TokenOverridable, Paginated {
	include_deleted?: boolean;
}

/**
 * Arguments for converting a user into a bot.
 */
export interface BotsConvertUserArguments extends TokenOverridable, UserID {}

/**
 * Arguments for converting a bot into a user.
 */
export interface BotsConvertBotToUserArguments
	extends TokenOverridable,
		BotUserID {
	user_data?: Record<string, unknown>;
}

/**
 * Arguments for disabling a bot.
 */
export interface BotsDisableArguments extends TokenOverridable, BotUserID {}

/**
 * Arguments for enabling a bot.
 */
export interface BotsEnableArguments extends TokenOverridable, BotUserID {}

/**
 * Arguments for assigning a bot to a user.
 */
export interface BotsAssignArguments
	extends TokenOverridable,
		BotUserID,
		UserID {}

/**
 * Arguments for getting a bot's icon.
 */
export interface BotsGetIconArguments extends TokenOverridable, BotUserID {}

/**
 * Arguments for setting a bot's icon.
 */
export interface BotsSetIconArguments extends TokenOverridable, BotUserID {
	/** The image data */
	image: File | Blob;
}

/**
 * Arguments for deleting a bot's icon.
 */
export interface BotsDeleteIconArguments extends TokenOverridable, BotUserID {}
