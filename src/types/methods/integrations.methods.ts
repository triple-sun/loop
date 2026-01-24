import type {
	Command,
	IncomingWebhook,
	OAuthApp,
	OutgoingOAuthConnection,
	OutgoingWebhook
} from "../integrations";

// Commands
export interface CommandsCreateArguments {
	command: Command;
}

export interface CommandsUpdateArguments {
	command: Command;
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
export interface IncomingWebhooksCreateArguments {
	hook: IncomingWebhook;
}

export interface IncomingWebhooksUpdateArguments {
	hook: IncomingWebhook;
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
export interface OutgoingWebhooksCreateArguments {
	hook: OutgoingWebhook;
}

export interface OutgoingWebhooksUpdateArguments {
	hook: OutgoingWebhook;
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
export interface OAuthAppsCreateArguments {
	app: OAuthApp;
}

export interface OAuthAppsUpdateArguments {
	app: OAuthApp;
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
