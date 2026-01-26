import type { BotPatch } from "../bots";
import type { UserID } from "./common.methods";

export interface BotsCreateArguments {
	bot: BotPatch;
}

export interface BotsPatchArguments extends UserID {
	bot: BotPatch;
}

export interface BotsGetArguments extends UserID {}

export interface BotsListArguments {
	page?: number;
	per_page?: number;
	include_deleted?: boolean;
}

export interface BotsConvertUserArguments extends UserID {}
