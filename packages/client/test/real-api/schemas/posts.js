"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostActionType = exports.PostActionStyle = exports.PostAttachmentColor = exports.PostType = exports.PostEmbedType = exports.PostPriority = exports.PostState = void 0;
/**
 * ===============================================
 * @description Posts main enums
 * ===============================================
 */
var PostState;
(function (PostState) {
    PostState["DELETED"] = "DELETED";
    PostState["NULL"] = "";
})(PostState || (exports.PostState = PostState = {}));
var PostPriority;
(function (PostPriority) {
    PostPriority["URGENT"] = "urgent";
    PostPriority["IMPORTANT"] = "important";
    PostPriority["NULL"] = "";
})(PostPriority || (exports.PostPriority = PostPriority = {}));
var PostEmbedType;
(function (PostEmbedType) {
    PostEmbedType["IMAGE"] = "image";
    PostEmbedType["LINK"] = "link";
    PostEmbedType["ATTACHMENT"] = "message_attachment";
    PostEmbedType["OPEN_GRAPH"] = "opengraph";
    PostEmbedType["PERMALINK"] = "permalink";
})(PostEmbedType || (exports.PostEmbedType = PostEmbedType = {}));
var PostType;
(function (PostType) {
    PostType["SYSTEM_ADD_REMOVE"] = "system_add_remove";
    PostType["SYSTEM_ADD_TO_CHANNEL"] = "system_add_to_channel";
    PostType["SYSTEM_ADD_TO_TEAM"] = "system_add_to_team";
    PostType["SYSTEM_CHANNEL_DELETED"] = "system_channel_deleted";
    PostType["SYSTEM_CHANNEL_RESTORED"] = "system_channel_restored";
    PostType["SYSTEM_DISPLAY_NAME_CHANGE"] = "system_displayname_change";
    PostType["SYSTEM_CONVERT_CHANNEL"] = "system_convert_channel";
    PostType["SYSTEM_EPHEMERAL"] = "system_ephemeral";
    PostType["SYSTEM_HEADER_CHANGE"] = "system_header_change";
    PostType["SYSTEM_JOIN_CHANNEL"] = "system_join_channel";
    PostType["SYSTEM_JOIN_LEAVE"] = "system_join_leave";
    PostType["SYSTEM_LEAVE_CHANNEL"] = "system_leave_channel";
    PostType["SYSTEM_PURPOSE_CHANGE"] = "system_purpose_change";
    PostType["SYSTEM_REMOVE_FROM_CHANNEL"] = "system_remove_from_channel";
    PostType["SYSTEM_COMBINED_USER_ACTIVITY"] = "system_combined_user_activity";
    PostType["SYSTEM_FAKE_PARENT_DELETED"] = "system_fake_parent_deleted";
    PostType["SYSTEM_GENERIC"] = "system_generic";
    PostType["REMINDER"] = "reminder";
    PostType["SYSTEM_WRANGLER"] = "system_wrangler";
    PostType["NULL"] = "";
})(PostType || (exports.PostType = PostType = {}));
/**
 * ===============================================
 * @description Posts attachments
 * ===============================================
 */
var PostAttachmentColor;
(function (PostAttachmentColor) {
    PostAttachmentColor["DARK_RED"] = "#8B0000";
    PostAttachmentColor["GREEN"] = "#008000";
    PostAttachmentColor["BLUE"] = "#0000FF";
    PostAttachmentColor["ORANGE"] = "#FFA500";
    PostAttachmentColor["GRAY"] = "#808080";
})(PostAttachmentColor || (exports.PostAttachmentColor = PostAttachmentColor = {}));
/**
 * ===============================================
 * @description Posts actions
 * ===============================================
 */
var PostActionStyle;
(function (PostActionStyle) {
    PostActionStyle["GOOD"] = "good";
    PostActionStyle["WARNING"] = "warning";
    PostActionStyle["DANGER"] = "danger";
    PostActionStyle["DEFAULT"] = "default";
    PostActionStyle["PRIMARY"] = "primary";
    PostActionStyle["SUCCESS"] = "success";
})(PostActionStyle || (exports.PostActionStyle = PostActionStyle = {}));
var PostActionType;
(function (PostActionType) {
    PostActionType["SELECT"] = "select";
    PostActionType["BUTTON"] = "button";
})(PostActionType || (exports.PostActionType = PostActionType = {}));
//# sourceMappingURL=posts.js.map