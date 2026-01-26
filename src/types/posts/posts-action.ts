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


/** Тип поля формы приложений mattermost */
export enum LoopFormFieldType {
	Boolean = "boolean" /**   A boolean selector represented as a checkbox. */,
	Channel = "channel" /**    A dropdown to select channels. */,
	DynamicSelect = "dynamic_select" /** A dropdown select that loads the elements dynamically. */,
	Markdown = "markdown" /**  An arbitrary markdown text; only visible in modal dialogs. Read-only. */,
	StaticSelect = "static_select" /**  A dropdown select with static elements. */,
	Text = "text" /**   A plain text field. */,
	User = "user" /**   A dropdown to select users. */
}
/** The text field subtypes, except textarea, map to the types of the HTML input form element */
export enum LoopFormFieldSubType {
	Input = "input" /**  A single-line text input field. */,
	TextArea = "textarea" /** A multi-line text input field; uses the HTML textarea element. */,
	Email = "email" /**  A field for editing an email address. */,
	Number = "number" /** A field for entering a number; includes a spinner component. */,
	Password = "password" /** A single-line text input field whose value is obscured. */,
	Tel = "tel" /**  A field for entering a telephone number. */,
	Url = "url" /**  A field for entering a URL. */
}

export enum LoopDialogElementType {
	Checkbox = "bool",
	Radio = "radio",
	Select = "select",
	Text = "text",
	TextArea = "textarea"
}

export enum LoopDialogTextSubType {
	Text = "text",
	Email = "email" /**  A field for editing an email address. */,
	Number = "number" /** A field for entering a number; includes a spinner component. */,
	Password = "password" /** A single-line text input field whose value is obscured. */,
	Tel = "tel" /**  A field for entering a telephone number. */,
	Url = "url" /**  A field for entering a URL. */
}

export enum LoopDialogSelectDataSource {
	Channels = "channels",
	Users = "users"
}

/** Действия с кнопками после клика */
export enum LoopActionAfterClick {
	Update = "update",
	Keep = "keep",
	Remove = "remove"
}
