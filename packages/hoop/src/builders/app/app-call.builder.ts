import type { AppCall } from "loop-types";
import { Builder } from "../../internal/builders";
import { createExpandBuilder, type ExpandBuilder } from "./app-expand.builder";

export interface AppCallData<STATE = Record<string, unknown>>
	extends Omit<AppCall<STATE>, "expand"> {
	state: STATE | undefined;
	expand: ExpandBuilder;
}

export class AppCallBuilder<STATE = Record<string, unknown>> extends Builder<
	AppCall<STATE>,
	"expand" | "state",
	AppCallData<STATE>
> {
	constructor(c: AppCall<STATE>) {
		super({
			path: c.path,
			state: c.state,
			expand: createExpandBuilder(c.expand ?? {})
		});
	}

	override build(): Readonly<AppCall<STATE>> {
		return Object.freeze({
			path: this.d.path,
			state: this.d.state,
			expand: this.d.expand.build()
		});
	}
}

export const createCallBuilder = <STATE = Record<string, unknown>>(
	c: AppCall<STATE>
): AppCallBuilder<STATE> => new AppCallBuilder<STATE>(c);
