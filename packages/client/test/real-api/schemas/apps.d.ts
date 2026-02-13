import type { MinMaxLentgh, Option, Options } from "./common";
/**
 * ===============================================
 * @description Apps Manifest type
 * ===============================================
 */
export declare enum AppPermission {
    USER_JOINED_CHANNEL_NOTIFICATION = "user_joined_channel_notification",
    ACT_AS_BOT = "act_as_bot",
    ACT_AS_USER = "act_as_user",
    ACT_AS_ADMIN = "act_as_admin",
    REMOTE_OAUTH2 = "remote_oauth2",
    REMOTE_WEBHOOKS = "remote_webhooks"
}
export declare enum AppRequestedLocation {
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
export declare enum AppExpandLevel {
    NULL = "",
    NONE = "none",
    SUMMARY = "summary",
    SUMMARY_PLUS = "+summary",
    ALL = "all",
    ALL_PLUS = "+all",
    ID = "id"
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
export interface AppContext {
    app_id: string;
    location?: string;
    acting_user_id?: string;
    user_id?: string;
    channel_id?: string;
    team_id?: string;
    post_id?: string;
    root_id?: string;
    props?: any;
    user_agent?: string;
    track_as_submit?: boolean;
}
/**
 * =======================================
 * @description Apps Call Types
 * =======================================
 */
export interface AppCallMetadataForClient {
    bot_user_id: string;
    bot_username: string;
}
export interface AppCall {
    path: string;
    expand?: AppExpand;
    state?: any;
}
export interface AppCallRequest extends AppCall {
    context: AppContext;
    values?: any;
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
export declare enum AppLocation {
    POST_MENU = "post_menu",
    CHANNEL_HEADER = "channel_header",
    COMMAND = "command",
    IN_POST = "in_post",
    EMBEDDED = "embedded"
}
/**
 * - `null` - explicitly Channels
 * - `string` - uuid - any other product
 */
export type ProductIdentifier = null | string;
/** @see {@link ProductIdentifier} */
export type ProductScope = ProductIdentifier | ProductIdentifier[];
export interface AppCommandFormMap extends Record<AppLocation, AppForm> {
}
export interface BindingsInfo {
    bindings: AppBinding[];
    forms: AppCommandFormMap;
}
export interface AppBinding {
    app_id: string;
    location?: AppLocation | string;
    supported_product_ids?: ProductScope;
    icon?: string;
    label?: string;
    hint?: string;
    description?: string;
    role_id?: string;
    depends_on_team?: boolean;
    depends_on_channel?: boolean;
    depends_on_user?: boolean;
    depends_on_post?: boolean;
    bindings?: AppBinding[];
    form?: AppForm;
    submit?: AppCall<any>;
}
/**
 * =======================================
 * @description App Form Types
 * =======================================
 */
export interface AppFormValues {
    [name: string]: string | Option | boolean | null;
}
export interface AppFormLookupResponse {
    items: Option[];
}
export interface AppFormResponseData {
    errors?: {
        [field: string]: string;
    };
}
export interface AppForm {
    title?: string;
    header?: string;
    footer?: string;
    icon?: string;
    submit_buttons?: string;
    cancel_button?: boolean;
    submit_on_cancel?: boolean;
    fields?: Array<AppFormField>;
    source?: AppCall<any>;
    submit?: AppCall<any>;
    depends_on?: string[];
}
/**
 * =======================================
 * @description App Form Field Internal Types
 * =======================================
 */
/** Тип поля формы  mattermost apps */
export declare enum AppFormFieldType {
    BOOLEAN = "boolean" /**   A boolean selector represented as a checkbox. */,
    CHANNEL = "channel" /**    A dropdown to select channels. */,
    DYNAMIC_SELECT = "dynamic_select" /** A dropdown select that loads the elements dynamically. */,
    MARKDOWN = "markdown" /**  An arbitrary markdown text; only visible in modal dialogs. Read-only. */,
    STATIC_SELECT = "static_select" /**  A dropdown select with static elements. */,
    TEXT = "text" /**   A plain text field. */,
    USER = "user" /**   A dropdown to select users. */
}
/** The text field subtypes, except textarea, map to the types of the HTML input form element */
export declare enum AppFormFieldTextSubType {
    INPUT = "input" /**  A single-line text input field. */,
    TEXT_AREA = "textarea" /** A multi-line text input field; uses the HTML textarea element. */,
    EMAIL = "email" /**  A field for editing an email address. */,
    NUMBER = "number" /** A field for entering a number; includes a spinner component. */,
    PASSWORD = "password" /** A single-line text input field whose value is obscured. */,
    TELEPHONE = "tel" /**  A field for entering a telephone number. */,
    URL = "url" /**  A field for entering a URL. */
}
interface Multiselect {
    /**
     * @description Whether a select field allows multiple values to be selected.
     */
    multiselect?: boolean;
}
interface Refresh {
    /**
     * @description Allows the form to be refreshed when the value of the field has changed.
     */
    refresh?: boolean;
}
interface Lookup {
    /**
     * @description A call that returns a list of options for dynamic select fields.
     */
    lookup: AppCall;
}
interface TextSubType {
    /**
     * @description The subtype of text field that will be shown.
     */
    subtype?: AppFormFieldTextSubType;
}
/**
 * @description The basic structure of a form field
 *
 * @see {@link godoc: https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Field | Field}
 */
interface AppFormFieldBase {
    /**
     *  @description The type of the field.
     */
    readonly type: AppFormFieldType;
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
    value?: unknown;
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
/**
 * =======================================
 * @description App Form Field Actual Types
 * =======================================
 */
/**
 * @description A boolean selector represented as a checkbox.
 */
export interface AppFormBooleanField extends AppFormFieldBase {
    readonly type: AppFormFieldType.BOOLEAN;
}
/**
 * @description An arbitrary markdown text; only visible in modal dialogs.
 *
 * Read-only.
 */
export interface AppFormMarkdownField extends AppFormFieldBase {
    readonly type: AppFormFieldType.MARKDOWN;
}
/**
 * @description A dropdown to select channels.
 */
export interface AppFormChannelsField extends AppFormFieldBase, Multiselect, Refresh {
    readonly type: AppFormFieldType.CHANNEL;
}
/**
 * @description A dropdown to select users.
 */
export interface AppFormUsersField extends AppFormFieldBase, Multiselect, Refresh {
    readonly type: AppFormFieldType.USER;
}
/**
 * @description A dropdown select with static elements.
 */
export interface AppFormStaticSelectField extends AppFormFieldBase, Multiselect, Options, Refresh {
    readonly type: AppFormFieldType.STATIC_SELECT;
}
/**
 * @description A dropdown select that loads the elements dynamically.
 */
export interface AppFormDynamicSelectField extends AppFormFieldBase, Multiselect, Lookup, Refresh {
    readonly type: AppFormFieldType.DYNAMIC_SELECT;
}
/**
 * @description A plain text field.
 */
export interface AppFormTextField extends AppFormFieldBase, TextSubType, MinMaxLentgh {
    readonly type: AppFormFieldType.TEXT;
}
export type AppFormField = AppFormBooleanField | AppFormChannelsField | AppFormDynamicSelectField | AppFormMarkdownField | AppFormStaticSelectField | AppFormUsersField | AppFormTextField;
export interface AppFormFieldData extends AppFormFieldBase, Multiselect, MinMaxLentgh, Partial<Lookup>, Refresh, Options {
}
export {};
//# sourceMappingURL=apps.d.ts.map