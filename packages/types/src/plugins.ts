// Equivalent to MessageDescriptor from react-intl
interface MessageDescriptor {
	id: string;
	defaultMessage: string;
}

export interface PluginsGetResponse {
	active: PluginManifest[];
	inactive: PluginManifest[];
}

export interface PluginManifest {
	id: string;
	name: string;
	description?: string;
	homepage_url?: string;
	support_url?: string;
	release_notes_url?: string;
	icon_path?: string;
	version: string;
	min_server_version?: string;
	translate?: boolean;
	server?: PluginManifestServer;
	backend?: PluginManifestServer;
	webapp?: PluginManifestWebapp;
	settings_schema?: PluginSettingsSchema;
	props?: {
		[key: string]: unknown;
		enterprise: boolean;
		experimental: boolean;
	};
}

export type PluginRedux = PluginManifest & { active: boolean };

export interface PluginManifestServer {
	executables?: {
		"linux-amd64"?: string;
		"darwin-amd64"?: string;
		"windows-amd64"?: string;
	};
	executable: string;
}

export interface PluginManifestWebapp {
	bundle_path: string;
}

export interface PluginSettingsSchema {
	header: string;
	footer: string;
	settings: PluginSetting[];
}

export interface PluginSetting {
	key: string;
	display_name: string;
	type: "text" | "number" | "custom" | string;
	help_text: string | MessageDescriptor;
	regenerate_help_text?: string;
	placeholder: string;
	default: unknown;
	options?: PluginSettingOption[];
	hosting?: "on-prem" | "cloud" | "";
}

export interface PluginSettingOption {
	display_name: string;
	value: string;
}

export interface PluginsResponse {
	active: PluginManifest[];
	inactive: PluginManifest[];
}

export interface PluginStatus {
	plugin_id: string;
	cluster_id: string;
	plugin_path: string;
	state: number;
	name: string;
	description: string;
	version: string;
}

type PluginInstance = {
	cluster_id: string;
	version: string;
	state: number;
};

export interface PluginStatusRedux {
	id: string;
	name: string;
	description: string;
	version: string;
	active: boolean;
	state: number;
	error?: string;
	instances: PluginInstance[];
}

export interface ClientPluginManifest {
	id: string;
	min_server_version?: string;
	version: string;
	webapp: {
		bundle_path: string;
	};
}
