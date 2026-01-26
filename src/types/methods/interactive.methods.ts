import type { OpenDialogParams } from "../dialog";

/**
 * Arguments for opening a dialog.
 */
export interface InteractiveOpenDialogArguments {
	/** The dialog parameters */
	dialog: OpenDialogParams;
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
