import type { Context } from "../context";

export declare enum PostActionStyle {
	Good = "good",
	Warning = "warning",
	Danger = "danger",
	Default = "default",
	Primary = "primary",
	Success = "success"
}
export declare enum PostActionType {
	Select = "select",
	Button = "button"
}

export declare enum PostActionDataSource {
	Channels = "channels",
	Users = "users"
}

export interface PostActionOption {
    text: string;
    value: string;
}
export interface PostActionIntegration {
    url: string;
    context?: Context;
}
export interface PostAction {
    id: string;
    name: string;
    integration: PostActionIntegration;
    type: PostActionType;
    options?: PostActionOption[];
    style?: PostActionStyle;
    data_source?: PostActionDataSource;
}
