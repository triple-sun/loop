import type { AppBinding, AppCall } from "loop-types";
import { Builder } from "../../internal/builders";
import type { SelectedKeysOf } from "../../internal/types";
import { createFormBuilder, type FormBuilder } from "../form/form.builder";
import { type AppCallBuilder, createCallBuilder } from "./app-call.builder";

export type BindingBuildableKeys = SelectedKeysOf<
	AppBinding,
	"bindings" | "form" | "submit"
>;

export interface AppBindingData<SUBMIT_STATE = Record<string, unknown>>
	extends Omit<AppBinding<SUBMIT_STATE>, BindingBuildableKeys> {
	bindings: AppBindingBuilder[];
	form?: FormBuilder;
	submit?: AppCallBuilder<SUBMIT_STATE>;
}

export interface AppBindingResult<SUBMIT_STATE = Record<string, unknown>>
	extends AppBinding<SUBMIT_STATE> {
	submit?: AppCall<SUBMIT_STATE>;
}

export class AppBindingBuilder<
	SUBMIT_STATE = Record<string, unknown>
> extends Builder<
	AppBinding<SUBMIT_STATE>,
	BindingBuildableKeys,
	AppBindingData<SUBMIT_STATE>
> {
	constructor(b: AppBindingResult<SUBMIT_STATE>) {
		super({
			...b,
			form: b.form ? createFormBuilder(b.form) : undefined,
			bindings: (b.bindings ?? []).map(createAppBindingBuilder),
			submit: b.submit ? createCallBuilder<SUBMIT_STATE>(b.submit) : undefined
		});
	}

	public override build(): Readonly<AppBinding<SUBMIT_STATE>> {
		return Object.freeze({
			...this.d,
			form: this.d.form?.build(),
			submit: this.d.submit?.build(),
			bindings: this.d.bindings?.map(b => b.build())
		});
	}
}

export const createAppBindingBuilder = <SUBMIT_STATE = Record<string, unknown>>(
	b: AppBindingResult<SUBMIT_STATE>
) => new AppBindingBuilder<SUBMIT_STATE>(b);
