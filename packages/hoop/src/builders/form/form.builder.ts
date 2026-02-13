import type {
	AppCall,
	AppForm,
	AppFormField,
	AppForm as Form
} from "loop-types";
import { Builder } from "../../internal/builders";
import { Locale } from "../../internal/locale";
import type { SelectedKeysOf } from "../../internal/types";
import {
	type AppCallBuilder,
	createCallBuilder
} from "../app/app-call.builder";
import {
	createFormFieldBuilder,
	type FormFieldBuilder
} from "./form-field.builder";

type FormBuilderKeys = SelectedKeysOf<AppForm, "fields" | "submit" | "source">;

export interface FormInitial<
	SOURCE_STATE extends Record<string, unknown> = Record<string, unknown>,
	SUBMIT_STATE extends Record<string, unknown> = Record<string, unknown>
> extends Form {
	source?: AppCall<SOURCE_STATE>;
	submit?: AppCall<SUBMIT_STATE>;
}

export interface FormResult<
	SOURCE_STATE extends Record<string, unknown> = Record<string, unknown>,
	SUBMIT_STATE extends Record<string, unknown> = Record<string, unknown>
> extends Omit<Form, FormBuilderKeys> {
	fields: FormFieldBuilder<AppFormField>[];
	source?: AppCallBuilder<SOURCE_STATE>;
	submit?: AppCallBuilder<SUBMIT_STATE>;
}

export class FormBuilder<
	SOURCE_STATE extends Record<string, unknown> = Record<string, unknown>,
	SUBMIT_STATE extends Record<string, unknown> = Record<string, unknown>
> extends Builder<
	AppForm<SOURCE_STATE, SUBMIT_STATE>,
	FormBuilderKeys,
	FormResult<SOURCE_STATE, SUBMIT_STATE>
> {
	constructor(f: FormInitial<SOURCE_STATE, SUBMIT_STATE> = {}) {
		super({
			title: f.title ?? Locale.get("formTitle"),
			header: f.header,
			footer: f.footer,
			icon: f.icon,
			cancel_button: f.cancel_button,
			submit_buttons: f.submit_buttons ?? Locale.get("submit"),
			fields: (f.fields ?? []).map(createFormFieldBuilder)
		});

		if (f.source) this.set("source", createCallBuilder(f.source));
		if (f.submit) this.set("submit", createCallBuilder(f.submit));
	}

	override build(): Readonly<AppForm<SOURCE_STATE, SUBMIT_STATE>> {
		return Object.freeze({
			...this.d,
			source: this.d.source?.build(),
			submit: this.d.submit?.build(),
			fields: this.d.fields.map(f => f.build())
		});
	}
}

export const createFormBuilder = <
	SOURCE_STATE extends Record<string, unknown> = Record<string, unknown>,
	SUBMIT_STATE extends Record<string, unknown> = Record<string, unknown>
>(
	f: FormInitial<SOURCE_STATE, SUBMIT_STATE> = {}
) => new FormBuilder<SOURCE_STATE, SUBMIT_STATE>(f);
