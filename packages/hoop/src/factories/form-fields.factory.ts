import {
	type AppFormBooleanField,
	type AppFormChannelsField,
	type AppFormDynamicSelectField,
	AppFormFieldTextSubType,
	AppFormFieldType,
	type AppFormMarkdownField,
	type AppFormStaticSelectField,
	type AppFormTextField,
	type AppFormUsersField
} from "loop-types";
import { createFormFieldBuilder } from "../builders/form/form-field.builder";

export const FormFieldFactory = {
	Checkbox: (params: Omit<AppFormBooleanField, "type">) =>
		createFormFieldBuilder({ type: AppFormFieldType.BOOLEAN, ...params }),

	Markdown: (params: Omit<AppFormMarkdownField, "type">) =>
		createFormFieldBuilder({ type: AppFormFieldType.MARKDOWN, ...params }),

	Divider: (blockId: string) =>
		FormFieldFactory.Markdown({
			name: blockId,
			modal_label: blockId,
			description: `\n\n---\n\n`
		}),

	Select: {
		Static: (params: Omit<AppFormStaticSelectField, "type">) =>
			createFormFieldBuilder({
				type: AppFormFieldType.STATIC_SELECT,
				...params
			}),
		Users: (params: Omit<AppFormUsersField, "type">) =>
			createFormFieldBuilder({ type: AppFormFieldType.USER, ...params }),
		Channels: (params: Omit<AppFormChannelsField, "type">) =>
			createFormFieldBuilder({ type: AppFormFieldType.CHANNEL, ...params }),
		Dynamic: (params: Omit<AppFormDynamicSelectField, "type">) =>
			createFormFieldBuilder({
				type: AppFormFieldType.DYNAMIC_SELECT,
				...params
			})
	} as const,

	Text: {
		Input: (params: Omit<AppFormTextField, "type">) =>
			createFormFieldBuilder({
				type: AppFormFieldType.TEXT,
				subtype: AppFormFieldTextSubType.INPUT,
				...params
			}),
		TextArea: (params: Omit<AppFormTextField, "type">) =>
			createFormFieldBuilder({
				type: AppFormFieldType.TEXT,
				subtype: AppFormFieldTextSubType.TEXT_AREA,
				...params
			}),
		Email: (params: Omit<AppFormTextField, "type">) =>
			createFormFieldBuilder({
				type: AppFormFieldType.TEXT,
				subtype: AppFormFieldTextSubType.EMAIL,
				...params
			}),
		Number: (params: Omit<AppFormTextField, "type">) =>
			createFormFieldBuilder({
				type: AppFormFieldType.TEXT,
				subtype: AppFormFieldTextSubType.NUMBER,
				...params
			}),
		Password: (params: Omit<AppFormTextField, "type">) =>
			createFormFieldBuilder({
				type: AppFormFieldType.TEXT,
				subtype: AppFormFieldTextSubType.PASSWORD,
				...params
			}),
		Telephone: (params: Omit<AppFormTextField, "type">) =>
			createFormFieldBuilder({
				type: AppFormFieldType.TEXT,
				subtype: AppFormFieldTextSubType.TELEPHONE,
				...params
			}),
		Url: (params: Omit<AppFormTextField, "type">) =>
			createFormFieldBuilder({
				type: AppFormFieldType.TEXT,
				subtype: AppFormFieldTextSubType.URL,
				...params
			})
	} as const
} as const;
