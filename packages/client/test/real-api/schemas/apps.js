"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppFormFieldTextSubType = exports.AppFormFieldType = exports.AppLocation = exports.AppExpandLevel = exports.AppRequestedLocation = exports.AppPermission = void 0;
/**
 * ===============================================
 * @description Apps Manifest type
 * ===============================================
 */
var AppPermission;
(function (AppPermission) {
    AppPermission["USER_JOINED_CHANNEL_NOTIFICATION"] = "user_joined_channel_notification";
    AppPermission["ACT_AS_BOT"] = "act_as_bot";
    AppPermission["ACT_AS_USER"] = "act_as_user";
    AppPermission["ACT_AS_ADMIN"] = "act_as_admin";
    AppPermission["REMOTE_OAUTH2"] = "remote_oauth2";
    AppPermission["REMOTE_WEBHOOKS"] = "remote_webhooks";
})(AppPermission || (exports.AppPermission = AppPermission = {}));
var AppRequestedLocation;
(function (AppRequestedLocation) {
    AppRequestedLocation["POST_MENU"] = "/post_menu";
    AppRequestedLocation["CHANNEL_HEADER"] = "/channel_header";
    AppRequestedLocation["COMMAND"] = "/command";
    AppRequestedLocation["IN_POST"] = "/in_post";
    AppRequestedLocation["EMBEDDED"] = "/embedded";
})(AppRequestedLocation || (exports.AppRequestedLocation = AppRequestedLocation = {}));
/**
 * =======================================
 * @description Apps Context Types
 * =======================================
 */
var AppExpandLevel;
(function (AppExpandLevel) {
    AppExpandLevel["NULL"] = "";
    AppExpandLevel["NONE"] = "none";
    AppExpandLevel["SUMMARY"] = "summary";
    AppExpandLevel["SUMMARY_PLUS"] = "+summary";
    AppExpandLevel["ALL"] = "all";
    AppExpandLevel["ALL_PLUS"] = "+all";
    AppExpandLevel["ID"] = "id";
})(AppExpandLevel || (exports.AppExpandLevel = AppExpandLevel = {}));
/**
 * =======================================
 * @description App Bindings Types
 * =======================================
 */
var AppLocation;
(function (AppLocation) {
    AppLocation["POST_MENU"] = "post_menu";
    AppLocation["CHANNEL_HEADER"] = "channel_header";
    AppLocation["COMMAND"] = "command";
    AppLocation["IN_POST"] = "in_post";
    AppLocation["EMBEDDED"] = "embedded";
})(AppLocation || (exports.AppLocation = AppLocation = {}));
/**
 * =======================================
 * @description App Form Field Internal Types
 * =======================================
 */
/** Тип поля формы  mattermost apps */
var AppFormFieldType;
(function (AppFormFieldType) {
    AppFormFieldType["BOOLEAN"] = "boolean"; /**   A boolean selector represented as a checkbox. */
    AppFormFieldType["CHANNEL"] = "channel"; /**    A dropdown to select channels. */
    AppFormFieldType["DYNAMIC_SELECT"] = "dynamic_select"; /** A dropdown select that loads the elements dynamically. */
    AppFormFieldType["MARKDOWN"] = "markdown"; /**  An arbitrary markdown text; only visible in modal dialogs. Read-only. */
    AppFormFieldType["STATIC_SELECT"] = "static_select"; /**  A dropdown select with static elements. */
    AppFormFieldType["TEXT"] = "text"; /**   A plain text field. */
    AppFormFieldType["USER"] = "user"; /**   A dropdown to select users. */
})(AppFormFieldType || (exports.AppFormFieldType = AppFormFieldType = {}));
/** The text field subtypes, except textarea, map to the types of the HTML input form element */
var AppFormFieldTextSubType;
(function (AppFormFieldTextSubType) {
    AppFormFieldTextSubType["INPUT"] = "input"; /**  A single-line text input field. */
    AppFormFieldTextSubType["TEXT_AREA"] = "textarea"; /** A multi-line text input field; uses the HTML textarea element. */
    AppFormFieldTextSubType["EMAIL"] = "email"; /**  A field for editing an email address. */
    AppFormFieldTextSubType["NUMBER"] = "number"; /** A field for entering a number; includes a spinner component. */
    AppFormFieldTextSubType["PASSWORD"] = "password"; /** A single-line text input field whose value is obscured. */
    AppFormFieldTextSubType["TELEPHONE"] = "tel"; /**  A field for entering a telephone number. */
    AppFormFieldTextSubType["URL"] = "url"; /**  A field for entering a URL. */
})(AppFormFieldTextSubType || (exports.AppFormFieldTextSubType = AppFormFieldTextSubType = {}));
//# sourceMappingURL=apps.js.map