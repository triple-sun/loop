import type { ProductScope } from "./products";

/**
 * ===============================================
 * @description Apps Manifest type
 * ===============================================
 */
export enum AppPermission {
	USER_JOINED_CHANNEL_NOTIFICATION = "user_joined_channel_notification",
	ACT_AS_BOT = "act_as_bot",
	ACT_AS_USER = "act_as_user",
	ACT_AS_ADMIN = "act_as_admin",
	REMOTE_OAUTH2 = "remote_oauth2",
	REMOTE_WEBHOOKS = "remote_webhooks"
}

export enum AppRequestedLocation {
	POST_MENU = "/post_menu",
	CHANNEL_HEADER = "/channel_header",
	COMMAND = "/command",
	IN_POST = "/in_post",
	EMBEDDED = "/embedded"
}

export interface AppManifest {
	app_id: string;
	version?: string;
	homepage_url?: string;
	icon?: string;
	display_name: string;
	description?: string;
	requested_permissions?: AppPermission[];
	requested_locations?: AppRequestedLocation[];
}

/**
 * =======================================
 * @description Apps Context Types
 * =======================================
 */

export enum AppExpandLevel {
	NULL = "",
	NONE = "none",
	SUMMARY = "summary",
	SUMMARY_PLUS = "+summary",
	ALL = "all",
	ALL_PLUS = "+all",
	ID = "id"
}

export interface AppContextProps {
	[name: string]: string;
}

export interface AppContext {
	app_id: string;
	location?: string;
	acting_user_id?: string;
	user_id?: string;
	channel_id?: string;
	team_id?: string;
	post_id?: string;
	root_id?: string;
	props?: AppContextProps;
	user_agent?: string;
	track_as_submit?: boolean;
}

export interface AppExpand {
	app?: AppExpandLevel;
	acting_user?: AppExpandLevel;
	acting_user_access_token?: AppExpandLevel;
	channel?: AppExpandLevel;
	config?: AppExpandLevel;
	mentioned?: AppExpandLevel;
	parent_post?: AppExpandLevel;
	post?: AppExpandLevel;
	root_post?: AppExpandLevel;
	team?: AppExpandLevel;
	user?: AppExpandLevel;
	locale?: AppExpandLevel;
}

/**
 * =======================================
 * @description Apps Call Types
 * =======================================
 */

export interface AppCallValues {
	[name: string]: unknown;
}

export interface AppCallMetadataForClient {
	bot_user_id: string;
	bot_username: string;
}

export interface AppCall {
	path: string;
	expand?: AppExpand;
	state?: unknown;
}

export interface AppCallRequest extends AppCall {
	context: AppContext;
	values?: AppCallValues;
	raw_command?: string;
	selected_field?: string;
	query?: string;
}

export interface AppCallResponse {
	type: string;
	text?: string;
	data?: any;
	navigate_to_url?: string;
	use_external_browser?: boolean;
	call?: AppCall;
	form?: AppForm;
	app_metadata?: AppCallMetadataForClient;
}

/**
 * =======================================
 * @description App Bindings Types
 * =======================================
 */
export enum AppLocation {
	POST_MENU = "post_menu",
	CHANNEL_HEADER = "channel_header",
	COMMAND = "command",
	IN_POST = "in_post",
	EMBEDDED = "embedded"
}

export interface AppCommandFormMap extends Record<AppLocation, AppForm> {}

export interface BindingsInfo {
	bindings: AppBinding[];
	forms: AppCommandFormMap;
}

export interface AppBinding {
	app_id: string;
	location?: AppLocation;
	supported_product_ids?: ProductScope;
	icon?: string;

	// Label is the (usually short) primary text to display at the location.
	// - For LocationPostMenu is the menu item text.
	// - For LocationChannelHeader is the dropdown text.
	// - For LocationCommand is the name of the command
	label?: string;

	// Hint is the secondary text to display
	// - LocationPostMenu: not used
	// - LocationChannelHeader: tooltip
	// - LocationCommand: the "Hint" line
	hint?: string;

	// Description is the (optional) extended help text, used in modals and autocomplete
	description?: string;

	role_id?: string;
	depends_on_team?: boolean;
	depends_on_channel?: boolean;
	depends_on_user?: boolean;
	depends_on_post?: boolean;

	// A Binding is either an action (makes a call), a Form, or is a
	// "container" for other locations - i.e. menu sub-items or subcommands.
	bindings?: AppBinding[];
	form?: AppForm;
	submit?: AppCall;
}

/**
 * =======================================
 * @description App Form Types
 * =======================================
 */

export interface AppFormValues {
	[name: string]: string | AppFormSelectOption | boolean | null;
}

export interface AppFormLookupResponse {
	items: AppFormSelectOption[];
}

export interface AppFormResponseData {
	errors?: {
		[field: string]: string;
	};
}

export interface AppFormSelectOption {
	label: string;
	value: string;
	icon_data?: string;
}

export interface AppForm {
	title?: string;
	header?: string;
	footer?: string;
	icon?: string;
	submit_buttons?: string;
	cancel_button?: boolean;
	submit_on_cancel?: boolean;
	fields?: Array<
		| AppFormBooleanField
		| AppFormChannelsField
		| AppFormDynamicSelectField
		| AppFormMarkdownField
		| AppFormStaticSelectField
		| AppFormTextField
		| AppFormUsersField
	>;

	// source is used in 2 cases:
	//   - if submit is not set, it is used to fetch the submittable form from
	//     the app.
	//   - if a select field change triggers a refresh, the form is refreshed
	//     from source.
	source?: AppCall;

	// submit is called when one of the submit buttons is pressed, or the
	// command is executed.
	submit?: AppCall;

	depends_on?: string[];
}

/**
 * =======================================
 * @description App Form Field Internal Types
 * =======================================
 */

/** Тип поля формы  mattermost apps */
export enum AppFormFieldType {
	BOOLEAN = "boolean" /**   A boolean selector represented as a checkbox. */,
	CHANNEL = "channel" /**    A dropdown to select channels. */,
	DYNAMIC_SELECT = "dynamic_select" /** A dropdown select that loads the elements dynamically. */,
	MARKDOWN = "markdown" /**  An arbitrary markdown text; only visible in modal dialogs. Read-only. */,
	STATIC_SELECT = "static_select" /**  A dropdown select with static elements. */,
	TEXT = "text" /**   A plain text field. */,
	USER = "user" /**   A dropdown to select users. */
}

/** The text field subtypes, except textarea, map to the types of the HTML input form element */
export enum AppFormFieldSubType {
	INPUT = "input" /**  A single-line text input field. */,
	TEXT_AREA = "textarea" /** A multi-line text input field; uses the HTML textarea element. */,
	EMAIL = "email" /**  A field for editing an email address. */,
	NUMBER = "number" /** A field for entering a number; includes a spinner component. */,
	PASSWORD = "password" /** A single-line text input field whose value is obscured. */,
	TELEPHONE = "tel" /**  A field for entering a telephone number. */,
	URL = "url" /**  A field for entering a URL. */
}

/**
 * @description The basic structure of a form field
 *
 * @see {@link godoc: https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Field | Field}
 */
interface AppFormField {
	/**
	 *  @description The type of the field.
	 */
	type: AppFormFieldType;

	/**
	 * @description Key to use in the values field of the call.
	 * Cannot include spaces or tabs.
	 */
	name: string;

	/**
	 * @description The label of the flag parameter; used with autocomplete.
	 * Ignored for positional parameters.
	 */
	label?: string;

	/**
	 * @description Label of the field in modal dialogs.
	 * Defaults to label if not defined.
	 */
	modal_label?: string;

	/**
	 * @description Short description of the field, displayed beneath the field in modal dialogs
	 */
	description?: string;

	/**
	 * @description The hint text for the field; used with autocomplete.
	 */
	hint?: string;

	/**
	 * @description The field's default value.
	 */
	value?: T;

	/**
	 * @description Whether the field has a mandatory value.
	 */
	is_required?: boolean;

	/**
	 * @description Whether a field's value is read-only.
	 */
	readonly?: boolean;

	/**
	 * @description The index of the positional argument.
	 * A value greater than zero indicates the position this field is in.
	 * A value of -1 indicates the last argument.
	 */
	position?: number;
}

interface Multiselectable {
	/**
	 * @description Whether a select field allows multiple values to be selected.
	 */
	multiselect?: boolean;
}

interface Refreshable {
	/**
	 * @description Allows the form to be refreshed when the value of the field has changed.
	 */
	refresh?: boolean;
}

/**
 * =======================================
 * @description App Form Field Actual Types
 * =======================================
 */

/**
 * @description The data structure of an option in a select field
 */
export interface AppFormFieldOption {
	/**
	 * @description User-facing string.
	 * Defaults to value and must be unique on this field.
	 */
	label?: string;

	/**
	 * @description Machine-facing value. Must be unique on this field.
	 */
	value: string;

	/**
	 * @description Either a fully-qualified URL, or a path for an app's static asset
	 */
	icon_data?: string;
}

/**
 * @description A boolean selector represented as a checkbox.
 */
export interface AppFormBooleanField
	extends AppFormField,
		Multiselectable {
	type: AppFormFieldType.BOOLEAN;
}

/**
 * @description A dropdown to select channels.
 */
export interface AppFormChannelsField
	extends AppFormField,
		Multiselectable {
	type: AppFormFieldType.CHANNEL;
}

/**
 * @description A dropdown to select users.
 */
export interface AppFormUsersField
	extends AppFormField,
		Multiselectable {
	type: AppFormFieldType.USER;
}

/**
 * @description An arbitrary markdown text; only visible in modal dialogs.
 *
 * Read-only.
 */
export interface AppFormMarkdownField
	extends AppFormField,
		Multiselectable {
	type: AppFormFieldType.MARKDOWN;
}

/**
 * @description A dropdown select with static elements.
 */
export interface AppFormStaticSelectField
	extends AppFormField,
		Multiselectable,
		Refreshable {
	type: AppFormFieldType.STATIC_SELECT;
	/**
	 * @description A list of options for static select fields.
	 */
	options?: AppFormFieldOption[];
}

/**
 * @description A dropdown select that loads the elements dynamically.
 */
export interface AppFormDynamicSelectField
	extends AppFormField,
		Multiselectable,
		Refreshable {
	type: AppFormFieldType.DYNAMIC_SELECT;
	/**
	 * @description A call that returns a list of options for dynamic select fields.
	 */
	lookup?: AppCall;
}

/**
 * @description A plain text field.
 */
export interface AppFormTextField  {
	type: AppFormFieldType.TEXT;

	/**
	 * @description The subtype of text field that will be shown.
	 */
	subtype?: AppFormFieldSubType;

	/**
	 * @description The minimum length of text field input.
	 */
	min_length?: number;

	/**
	 * @description The maximum length of text field input.
	 */
	max_length?: number;
}
