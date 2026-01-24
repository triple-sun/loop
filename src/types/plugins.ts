
// Equivalent to MessageDescriptor from react-intl
type MessageDescriptor = {
  id: string;
  defaultMessage: string;
};

export type PluginManifest = {
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
  props?: Record<string, any>;
};

export type PluginRedux = PluginManifest & { active: boolean };

export type PluginManifestServer = {
  executables?: {
    'linux-amd64'?: string;
    'darwin-amd64'?: string;
    'windows-amd64'?: string;
  };
  executable: string;
};

export type PluginManifestWebapp = {
  bundle_path: string;
};

export type PluginSettingsSchema = {
  header: string;
  footer: string;
  settings: PluginSetting[];
};

export type PluginSetting = {
  key: string;
  display_name: string;
  type: string;
  help_text: string | MessageDescriptor;
  regenerate_help_text?: string;
  placeholder: string;
  default: any;
  options?: PluginSettingOption[];
  hosting?: 'on-prem' | 'cloud';
};

export type PluginSettingOption = {
  display_name: string;
  value: string;
};

export type PluginsResponse = {
  active: PluginManifest[];
  inactive: PluginManifest[];
};

export type PluginStatus = {
  plugin_id: string;
  cluster_id: string;
  plugin_path: string;
  state: number;
  name: string;
  description: string;
  version: string;
};

type PluginInstance = {
  cluster_id: string;
  version: string;
  state: number;
};

export type PluginStatusRedux = {
  id: string;
  name: string;
  description: string;
  version: string;
  active: boolean;
  state: number;
  error?: string;
  instances: PluginInstance[];
};

export type ClientPluginManifest = {
  id: string;
  min_server_version?: string;
  version: string;
  webapp: {
    bundle_path: string;
  };
};
