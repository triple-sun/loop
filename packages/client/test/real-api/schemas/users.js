"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomStatusDuration = exports.UserStatusValue = exports.UserCallSound = exports.UserNotify = void 0;
/**
 * ===============================================
 * @description Users enums
 * ===============================================
 */
var UserNotify;
(function (UserNotify) {
    UserNotify["DEFAULT"] = "default";
    UserNotify["ALL"] = "all";
    UserNotify["MENTION"] = "mention";
    UserNotify["NONE"] = "none";
})(UserNotify || (exports.UserNotify = UserNotify = {}));
var UserCallSound;
(function (UserCallSound) {
    UserCallSound["DYNAMIC"] = "Dynamic";
    UserCallSound["CALM"] = "Calm";
    UserCallSound["URGENT"] = "Urgent";
    UserCallSound["CHEERFUL"] = "Cheerful";
    UserCallSound["NULL"] = "";
})(UserCallSound || (exports.UserCallSound = UserCallSound = {}));
var UserStatusValue;
(function (UserStatusValue) {
    UserStatusValue["ONLINE"] = "online";
    UserStatusValue["AWAY"] = "away";
    UserStatusValue["OFFLINE"] = "offline";
    UserStatusValue["DND"] = "dnd";
})(UserStatusValue || (exports.UserStatusValue = UserStatusValue = {}));
var CustomStatusDuration;
(function (CustomStatusDuration) {
    CustomStatusDuration["DONT_CLEAR"] = "";
    CustomStatusDuration["THIRTY_MINUTES"] = "thirty_minutes";
    CustomStatusDuration["ONE_HOUR"] = "one_hour";
    CustomStatusDuration["FOUR_HOURS"] = "four_hours";
    CustomStatusDuration["TODAY"] = "today";
    CustomStatusDuration["THIS_WEEK"] = "this_week";
    CustomStatusDuration["DATE_AND_TIME"] = "date_and_time";
    CustomStatusDuration["CUSTOM_DATE_TIME"] = "custom_date_time";
})(CustomStatusDuration || (exports.CustomStatusDuration = CustomStatusDuration = {}));
//# sourceMappingURL=users.js.map