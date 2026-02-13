export enum OAuthGrantType {
	CREDENTIALS = "client_credentials",
	PASSWORD = "password"
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
