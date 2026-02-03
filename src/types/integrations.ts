import type { PostAttachment } from "./posts";

export enum CommandMethod {
	P = "P",
	G = "G",
	NULL = ""
}

export enum OAuthGrantType {
	CREDENTIALS = "client_credentials",
	PASSWORD = "password"
}

export interface IncomingWebhook {
	id: string;
	create_at: number;
	update_at: number;
	delete_at: number;
	user_id: string;
	channel_id: string;
	team_id: string;
	display_name: string;
	description: string;
	username: string;
	icon_url: string;
	channel_locked: boolean;
}

export interface OutgoingWebhook {
	id: string;
	token: string;
	create_at: number;
	update_at: number;
	delete_at: number;
	creator_id: string;
	channel_id: string;
	team_id: string;
	trigger_words: string[];
	trigger_when: number;
	callback_urls: string[];
	display_name: string;
	description: string;
	content_type: string;
	username: string;
	icon_url: string;
}

export interface Command {
	id: string;
	token: string;
	create_at: number;
	update_at: number;
	delete_at: number;
	creator_id: string;
	team_id: string;
	trigger: string;
	method: CommandMethod;
	username: string;
	icon_url: string;
	auto_complete: boolean;
	auto_complete_desc: string;
	auto_complete_hint: string;
	display_name: string;
	description: string;
	url: string;
}

export interface CommandArgs {
	channel_id: string;
	team_id?: string;
	root_id?: string;
}

export interface CommandResponse {
	response_type: string;
	text: string;
	username: string;
	channel_id: string;
	icon_url: string;
	type: string;
	props: Record<string, unknown>;
	goto_location: string;
	trigger_id: string;
	skip_slack_parsing: boolean;
	attachments: PostAttachment[];
	extra_responses: CommandResponse[];
}

export interface OAuthApp {
	id: string;
	creator_id: string;
	create_at: number;
	update_at: number;
	client_secret: string;
	name: string;
	description: string;
	icon_url: string;
	callback_urls: string[];
	homepage: string;
	is_trusted: boolean;
}

export interface OutgoingOAuthConnection {
	id: string;
	name: string;
	creator_id: string;
	create_at: number;
	update_at: number;
	client_id: string;
	client_secret?: string;
	credentials_username?: string;
	credentials_password?: string;
	oauth_token_url: string;
	grant_type: OAuthGrantType;
	audiences: string[];
}
