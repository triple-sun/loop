import {
	createDialogBuilder,
	createFormBuilder,
	createPostBuilder
} from "../builders";

export const HoopFactory = {
	Dialog: createDialogBuilder,
	Form: createFormBuilder,
	Post: createPostBuilder
} as const;
