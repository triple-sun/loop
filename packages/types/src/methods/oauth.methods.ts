import type { OAuthApp } from "../oauth";

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
