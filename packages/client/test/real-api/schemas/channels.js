"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelBookmarkType = exports.ChannelCategorySorting = exports.ChannelCategoryType = exports.ChannelNotifyDesktopSound = exports.ChannelNotify = exports.ChannelType = void 0;
/**
 * ===============================================
 * @description Channel enums
 * ===============================================
 */
var ChannelType;
(function (ChannelType) {
    ChannelType["OPEN"] = "O";
    ChannelType["PRIVATE"] = "P";
    ChannelType["DIRECT"] = "D";
    ChannelType["GROUP"] = "G";
    ChannelType["THREADS"] = "threads";
})(ChannelType || (exports.ChannelType = ChannelType = {}));
var ChannelNotify;
(function (ChannelNotify) {
    ChannelNotify["DEFAULT"] = "default";
    ChannelNotify["ALL"] = "all";
    ChannelNotify["MENTION"] = "mention";
    ChannelNotify["NONE"] = "none";
})(ChannelNotify || (exports.ChannelNotify = ChannelNotify = {}));
var ChannelNotifyDesktopSound;
(function (ChannelNotifyDesktopSound) {
    ChannelNotifyDesktopSound["BING"] = "Bing";
    ChannelNotifyDesktopSound["CRACKLE"] = "Crackle";
    ChannelNotifyDesktopSound["DOWN"] = "Down";
    ChannelNotifyDesktopSound["HELLO"] = "Hello";
    ChannelNotifyDesktopSound["RIPPLE"] = "Ripple";
    ChannelNotifyDesktopSound["UPSTAIRS"] = "Upstairs";
})(ChannelNotifyDesktopSound || (exports.ChannelNotifyDesktopSound = ChannelNotifyDesktopSound = {}));
/**
 * ===============================================
 * @description Channels category types
 * ===============================================
 */
var ChannelCategoryType;
(function (ChannelCategoryType) {
    ChannelCategoryType["FAVORITES"] = "favorites";
    ChannelCategoryType["CHANNELS"] = "channels";
    ChannelCategoryType["DIRECTT_MESSAGES"] = "direct_messages";
    ChannelCategoryType["CUSTOM"] = "custom";
})(ChannelCategoryType || (exports.ChannelCategoryType = ChannelCategoryType = {}));
var ChannelCategorySorting;
(function (ChannelCategorySorting) {
    ChannelCategorySorting["ALPHABETICAL"] = "alpha";
    ChannelCategorySorting["DEFAULT"] = "";
    ChannelCategorySorting["RECENCY"] = "recent";
    ChannelCategorySorting["MANUAL"] = "manual";
})(ChannelCategorySorting || (exports.ChannelCategorySorting = ChannelCategorySorting = {}));
/**
 * ===============================================
 * @description Channels bookmark types
 * ===============================================
 */
var ChannelBookmarkType;
(function (ChannelBookmarkType) {
    ChannelBookmarkType["LINK"] = "link";
    ChannelBookmarkType["FILE"] = "file";
})(ChannelBookmarkType || (exports.ChannelBookmarkType = ChannelBookmarkType = {}));
//# sourceMappingURL=channels.js.map