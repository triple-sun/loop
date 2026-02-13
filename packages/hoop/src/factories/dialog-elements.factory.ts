import {
	type DialogCheckboxElement,
	DialogElementType,
	type DialogRadioElement,
	type DialogSelectElement,
	type DialogTextAreaElement,
	type DialogTextElement,
	type Option,
	SelectDataSource
} from "loop-types";
import { createDialogElementBuilder } from "../builders/dialog/dialog-element.builder";

export const DialogElementFactory = {
	Text: (params: Omit<DialogTextElement, "type">) =>
		createDialogElementBuilder<DialogTextElement>({
			...params,
			type: DialogElementType.TEXT
		}),

	TextArea: (params: Omit<DialogTextAreaElement, "type">) =>
		createDialogElementBuilder<DialogTextAreaElement>({
			...params,
			type: DialogElementType.TEXT_AREA
		}),

	Select: {
		Static: (
			params: Omit<DialogSelectElement, "type" | "options" | "data_source"> & {
				options: Option[];
			}
		) =>
			createDialogElementBuilder<DialogSelectElement>({
				...params,
				type: DialogElementType.SELECT
			}),

		Channels: (params: Omit<DialogSelectElement, "type" | "options">) =>
			createDialogElementBuilder<DialogSelectElement>({
				...params,
				type: DialogElementType.SELECT,
				data_source: SelectDataSource.CHANNELS
			}),

		Users: (params: Omit<DialogSelectElement, "type" | "options">) =>
			createDialogElementBuilder<DialogSelectElement>({
				...params,
				type: DialogElementType.SELECT,
				data_source: SelectDataSource.USERS
			})
	} as const,

	Checkbox: (params: Omit<DialogCheckboxElement, "type">) =>
		createDialogElementBuilder<DialogCheckboxElement>({
			...params,
			type: DialogElementType.CHECKBOX
		}),

	Radio: (params: Omit<DialogRadioElement, "type">) =>
		createDialogElementBuilder<DialogRadioElement>({
			...params,
			type: DialogElementType.RADIO
		})
} as const;
