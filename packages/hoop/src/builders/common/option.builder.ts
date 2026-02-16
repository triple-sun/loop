import type { Option } from "loop-types";
import { Builder } from "../../internal/builders";

export interface OptionInitial extends Partial<Option> {
	value: Required<string>;
}

/**
 * Universal option builder
 */
export class OptionBuilder extends Builder<Option> {
	constructor(o: OptionInitial) {
		super({
			value: o.value,
			text: o.text ?? o.label ?? o.value ?? "",
			label: o.label ?? o.text ?? o.value ?? "",
			icon_data: o.icon_data
		});
	}

	public override build(): Readonly<Option> {
		return Object.freeze(this.d);
	}
}

export const createOptionBuilder = (w: Option) => new OptionBuilder(w);
