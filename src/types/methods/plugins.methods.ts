import type { Stream } from "form-data";

export interface PluginsUploadArguments {
	plugin: Stream | Buffer;
	force?: boolean;
}

export interface PluginsInstallFromUrlArguments {
	plugin_download_url: string;
	force?: boolean;
}

// TODO: Review response types
export type PluginsGetArguments = never;

export type PluginsGetStatusesArguments = never;

export interface PluginsRemoveArguments {
	plugin_id: string;
}

export interface PluginsEnableArguments {
	plugin_id: string;
}

export interface PluginsDisableArguments {
	plugin_id: string;
}

export type PluginsGetWebAppArguments = never

export interface PluginsGetMarketplaceArguments {
	page?: number;
	per_page?: number;
	filter?: string;
	server_version?: string;
	local_only?: boolean;
}

export interface PluginsInstallMarketplaceArguments {
	id: string;
	version: string;
}
