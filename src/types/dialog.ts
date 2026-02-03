export enum DialogElementType {
	CHECKBOX = "bool",
	RADIO = "radio",
	SELECT = "select",
	TEXT = "text",
	TEXT_AREA = "textarea"
}

export enum DialogTextSubType {
	TEXT = "text",
	EMAIL = "email" /**  A field for editing an email address. */,
	NUMBER = "number" /** A field for entering a number; includes a spinner component. */,
	PASSWORD = "password" /** A single-line text input field whose value is obscured. */,
	TELEPHONE = "tel" /**  A field for entering a telephone number. */,
	URL = "url" /**  A field for entering a URL. */
}

export enum DialogSelectDataSource {
	CHANNELS = "channels",
	USERS = "users"
}

export type Dialog = {
	callback_id?: string;
	elements?: DialogElement[];
	title: string;
	introduction_text?: string;
	icon_url?: string;
	submit_label?: string;
	notify_on_cancel?: boolean;
	state?: string;
};

export type DialogSubmission = {
	url?: string;
	callback_id: string;
	state: string;
	user_id: string;
	channel_id: string;
	team_id: string;
	submission: {
		[x: string]: string;
	};
	cancelled: boolean;
};

export type DialogElement = {
	display_name: string;
	name: string;
	type: DialogElementType;
	subtype?: DialogTextSubType;
	default?: string;
	placeholder?: string;
	help_text?: string;
	optional?: boolean;
	min_length?: number;
	max_length?: number;
	data_source?: DialogSelectDataSource;
	options?: Array<{
		text: string;
		value: unknown;
	}>;
};

export type SubmitDialogResponse = {
	error?: string;
	errors?: Record<string, string>;
};
