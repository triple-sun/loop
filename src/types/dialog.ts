import type { DataSource, MinMaxLentgh, Options } from "./common";

/**
 * Integrations open dialogs by sending an HTTP POST, containing some data in the request body, to an endpoint on the Mattermost server.
 * Integrations can use this endpoint to open dialogs when users click message buttons or select an option from a menu, or use a custom slash command.
 *
 * Moreover, plugins can trigger a dialog based on user actions. For instance, if a plugin adds a button in the channel header, clicking that button may open a dialog.
 *
 * @see {@link https://developers.mattermost.com/integrate/plugins/interactive-dialogs/ | Interactive dialogs}
 * */
export interface Dialog {
	/**
	 * @description Title of the dialog.
	 *
	 * Maximum 24 characters.
	 */
	title: string;

	/**
	 * @description Markdown-formatted introduction text which is displayed above the dialog elements.
	 */
	introduction_text: string;

	/**
	 * @description Each dialog supports elements for users to enter information.
	 *
	 * text: Single-line plain text field. Use this for inputs such as names, email addresses, or phone numbers.
	 * textarea: Multi-line plain text field. Use this field when the answer is expected to be longer than 150 characters.
	 * select: Message menu. Use this for pre-selected choices. Can either be static menus or dynamic menus generated from users and Public channels of the system.
	 * bool: Checkbox option. Use this for binary selection.
	 * radio: Radio button option. Use this to quickly select an option from pre-selected choices.
	 * date: Date picker field. Use this for selecting dates without time information.
	 * datetime: Date and time picker field. Use this for selecting both date and time with timezone support.
	 *
	 * Each element is required by default, otherwise the client will return an error as shown below.
	 * Note that the error message will appear below the help text, if one is specified. To make an element optional, set the field "optional": "true"
	 */
	elements?: Array<DialogElement>;

	/**
	 * @description The URL of the icon used for your dialog.
	 * If none specified, no icon is displayed.
	 */
	icon_url?: string;

	/**
	 * @description Label of the button to complete the dialog.
	 * @default "Submit"
	 *
	 * @todo verify default value for Loop
	 */
	submit_label?: string;

	/**
	 * @description When true, sends an event back to the integration whenever there's a user-induced dialog cancellation.
	 * No other data is sent back with the event. Default is false.
	 * */
	notify_on_cancel?: boolean;
	/**
	 * @description Provided by the integration that will be echoed back with dialog submission.
	 *
	 * @default ""
	 */
	state?: string;

	/**
	 * Multi-step dialogs enable wizard-like form experiences where users can navigate through multiple steps to complete a complex workflow.
	 * Each step can have different fields, and form values are preserved as users progress through the steps.
	 *
	 * @see {@link https://developers.mattermost.com/integrate/plugins/interactive-dialogs/#multi-step-dialogs | Multi-step workflows}
	 *
	 * @version 11.1+
	 *
	 * @todo ask about Loop multistep support
	 */
	is_multistep?: boolean;
}

/**
 * ===============================================
 * @description Dialog enums
 * ===============================================
 */

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

/**
 * ===============================================
 * @description Dialog elements interfaces
 * ===============================================
 */

interface TextSubType {
	/** One of text, email, number, password (as of v5.14), tel, or url.
	 * @default text. Use this to set which keypad is presented to users on mobile when entering the field. */
	subtype?: DialogTextSubType;
}

interface Placeholder {
	/**
	 * @description A string displayed to help guide users in completing the element.
	 * Maximum 150 characters.
	 */
	placeholder?: string;
}

interface DialogElementBase {
	/**
	 * @description Element type
	 * Set this value to `text` for a text element.
	 */
	type: DialogElementType;

	/**
	 * @description Name of the field element used by the integration.
	 *
	 * Maximum 300 characters.
	 *
	 * You should use unique name fields in the same dialog
	 */
	name: string;

	/**
	 * @description Display name of the field shown to the user in the dialog.
	 *
	 * Maximum 24 characters.
	 */
	display_name: string;

	/**
	 * @description Set to true if this form element is not required.
	 *
	 * @default false
	 */
	optional?: boolean;

	/**
	 * @description Set help text for this form element.
	 *
	 * Maximum 150 characters.
	 */
	help_text?: string;

	/**
	 *  @description Set a default value for this form element.
	 *
	 * Maximum 150 characters.
	 */
	default?: string;
}

/**
 * Text elements
 * @description Text elements are single-line plain text fields. Below is an example of a text element that asks for an email address.
 */
export interface DialogTextElement
	extends DialogElementBase,
		TextSubType,
		MinMaxLentgh,
		Placeholder {
	type: DialogElementType.TEXT;
}

/** Текстовое поле - многострочное */
export interface DialogTextAreaElement
	extends DialogElementBase,
		TextSubType,
		MinMaxLentgh,
		Placeholder {
	type: DialogElementType.TEXT_AREA;
}

/** Выпадающий список */
export interface DialogSelectElement
	extends DialogElementBase,
		DataSource,
		Options,
		Placeholder {
	type: DialogElementType.SELECT;
}

/** Чекбоксы */
export interface DialogCheckboxElement extends DialogElementBase {
	type: DialogElementType.CHECKBOX;
}

/** Радиокнопки */
export interface DialogRadioElement extends DialogElementBase, Options {
	type: DialogElementType.RADIO;
}

export type DialogElement =
	| DialogCheckboxElement
	| DialogTextElement
	| DialogRadioElement
	| DialogSelectElement
	| DialogTextAreaElement;

export interface DialogElementData
	extends DialogElementBase,
		Placeholder,
		Options,
		DataSource,
		TextSubType,
		MinMaxLentgh {}

/**
 * ===============================================
 * @description Dialog submissions
 *
 * @todo ask about {@link https://developers.mattermost.com/integrate/plugins/interactive-dialogs/#multi-step-workflow | multisteps}
 * ===============================================
 */

export interface DialogSubmission {
	type: "dialog_submission";
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
}

/**
 * ===============================================
 * @description Dialog submit response (use it to update dialog)
 * ===============================================
 */
export type SubmitDialogResponse = {
	error?: string;
	errors?: Record<string, string>;
};
