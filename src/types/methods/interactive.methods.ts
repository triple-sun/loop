import type { Dialog } from "../dialog";

/**
 * Arguments for opening a dialog.
 */
export interface InteractiveOpenDialogArguments {
	/**
	 * @description Trigger ID provided by other action
	 */
	trigger_id: string;
	/**
	 * @description Dialog to open
	 */
	dialog: Dialog;
	/**
	 * @description The URL to send the submitted dialog payload to
	 */
	url?: string;
}

/**
 * Arguments for submitting a dialog.
 */
export interface InteractiveSubmitDialogArguments {
	/** The URL to submit the dialog to */
	url: string;
	/** The channel ID where the dialog was triggered */
	channel_id: string;
	/** The team ID where the dialog was triggered */
	team_id: string;
	/** The dialog submission data */
	submission: Record<string, unknown>;
	/** The callback ID of the dialog */
	callback_id?: string;
	/** The state of the dialog */
	state?: string;
	/** Whether the dialog is cancelled */
	cancelled?: boolean;
}
