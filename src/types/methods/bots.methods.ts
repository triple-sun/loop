import type { BotPatch } from "../bots";
import type { UserID } from "./common.methods";

/**
 * Arguments for creating a bot.
 */
export interface BotsCreateArguments extends BotPatch {}

/**
 * Arguments for cleaning/updating a bot.
 */
export interface BotsPatchArguments extends UserID, Partial<BotPatch> {}

/**
 * Arguments for getting a bot.
 */
export interface BotsGetArguments extends UserID {}

/**
 * Arguments for listing bots.
 */
export interface BotsListArguments {
	page?: number;
	per_page?: number;
	include_deleted?: boolean;
}

/**
 * Arguments for converting a user into a bot.
 */
export interface BotsConvertUserArguments extends UserID {}

/**
 * Arguments for converting a bot into a user.
 */
export interface BotsConvertBotToUserArguments {
	bot_user_id: string;
	user_data?: Record<string, unknown>;
}

/**
 * Arguments for disabling a bot.
 */
export interface BotsDisableArguments {
	bot_user_id: string;
}

/**
 * Arguments for enabling a bot.
 */
export interface BotsEnableArguments {
	bot_user_id: string;
}

/**
 * Arguments for assigning a bot to a user.
 */
export interface BotsAssignArguments {
	bot_user_id: string;
	user_id: string;
}

/**
 * Arguments for getting a bot's icon.
 */
export interface BotsGetIconArguments {
	bot_user_id: string;
}

/**
 * Arguments for setting a bot's icon.
 */
export interface BotsSetIconArguments {
	bot_user_id: string;
	/** The image data */
	image: File | Blob;
}

/**
 * Arguments for deleting a bot's icon.
 */
export interface BotsDeleteIconArguments {
	bot_user_id: string;
}
