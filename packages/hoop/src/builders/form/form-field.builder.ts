import type { AppFormField } from "loop-types";
import { Builder } from "../../internal/builders";

/**
 * @description Form field builder
 *
 * @see {@link https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Field | Field}
 */
export class FormFieldBuilder<T extends AppFormField> extends Builder<T> {
	readonly type: T["type"];

	constructor(f: T) {
		super(f);
		this.type = f.type;
	}

	public override build(): Readonly<T> {
		return Object.freeze(this.d);
	}
}

export const createFormFieldBuilder = <T extends AppFormField>(
	f: T
): FormFieldBuilder<T> => new FormFieldBuilder(f);
