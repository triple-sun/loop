import { ContentType } from "../enum";
import type { Command, IncomingWebhook, OAuthApp } from "../integrations";
import type {
	ChannelID,
	OptionalUserID,
	TeamID,
	TokenOverridable
} from "./common.methods";

// Commands
export interface CommandsCreateArguments extends Omit<Command, "id"> {}

export interface CommandsUpdateArguments extends Partial<Command> {
	id: string;
}

export interface CommandsDeleteArguments {
	command_id: string;
}

export interface CommandsListArguments {
	team_id?: string;
	custom_only?: boolean;
}

export interface CommandsRegenerateTokenArguments {
	command_id: string;
}

export interface CommandsExecuteArguments {
	command: string;
	team_id: string;
	channel_id: string;
	root_id?: string;
}

// Incoming Webhooks
export interface IncomingWebhooksCreateArguments
	extends TokenOverridable,
		ChannelID,
		OptionalUserID {
	/**
	 * @description The display name for this incoming webhook
	 */
	display_name?: string;
	/**
	 * @description The description for this incoming webhook
	 */
	description?: string;
	/**
	 * @description The username this incoming webhook will post as.
	 */
	username?: string;
	/**
	 * @description The profile picture this incoming webhook will use when posting.
	 */
	icon_url?: string;
}

export interface IncomingWebhooksUpdateArguments
	extends IncomingWebhooksCreateArguments {
	id: string;
}

export interface IncomingWebhooksDeleteArguments {
	hook_id: string;
}

export interface IncomingWebhooksListArguments {
	team_id?: string;
	page?: number;
	per_page?: number;
}

export interface IncomingWebhooksGetArguments {
	hook_id: string;
}

// Outgoing Webhooks
export interface OutgoingWebhooksCreateArguments
	extends TokenOverridable,
		ChannelID,
		TeamID {
	/**
	 * @description The ID of the owner of the webhook if different than the requester. Required in local mode.
	 */
	creator_id?: string;
	/**
	 * @description The description for this outgoing webhook
	 */
	description?: string;
	/**
	 * @description The display name for this outgoing webhook
	 */
	display_name: string;
	/**
	 * @description When to trigger the webhook, 0 when a trigger word is present at all and 1 if the message starts with a trigger word
	 */
	trigger_when: 0 | 1;
	/**
	 * @description List of words for the webhook to trigger on
	 */
	trigger_words: string[];
	/**
	 * @description The URLs to POST the payloads to when the webhook is triggered
	 */
	callback_urls: string[];

	/**
	 * @default application/x-www-form-urlencoded
	 * The format to POST the data in, either application/json or application/x-www-form-urlencoded
	 */
	content_type?: ContentType.JSON | ContentType.URLEncoded;
}

export interface OutgoingWebhooksUpdateArguments
	extends TokenOverridable,
		ChannelID {
	/**
	 * @description The description for this outgoing webhook
	 */
	description?: string;
	/**
	 * @description The display name for this outgoing webhook
	 */
	display_name: string;
}

export interface OutgoingWebhooksDeleteArguments {
	hook_id: string;
}

export interface OutgoingWebhooksListArguments {
	channel_id?: string;
	team_id?: string;
	page?: number;
	per_page?: number;
}

export interface OutgoingWebhooksGetArguments {
	hook_id: string;
}

export interface OutgoingWebhooksRegenerateTokenArguments {
	hook_id: string;
}

// OAuth
export interface OAuthAppsCreateArguments extends Omit<OAuthApp, "id"> {}

export interface OAuthAppsUpdateArguments extends Partial<OAuthApp> {
	id: string;
}

export interface OAuthAppsDeleteArguments {
	app_id: string;
}

export interface OAuthAppsGetArguments {
	app_id: string;
}

export interface OAuthAppsGetInfoArguments {
	app_id: string;
}

export interface OAuthAppsListArguments {
	page?: number;
	per_page?: number;
}

export interface OAuthAppsRegenerateSecretArguments {
	app_id: string;
}
