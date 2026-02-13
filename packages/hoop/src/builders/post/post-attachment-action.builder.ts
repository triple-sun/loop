import { type PostAction, PostActionStyle, SelectDataSource } from "loop-types";
import { Builder } from "../../internal/builders";

/**
 * Post attachment action builder
 *
 * {@link https://developers.mattermost.com/integrate/reference/message-attachments/ | Attachments}
 * {@link https://developers.mattermost.com/integrate/plugins/interactive-messages/ | Interactive messages}
 */
export class ActionBuilder<
	CONTEXT = Record<string, unknown>,
	T extends PostAction<CONTEXT> = PostAction<CONTEXT>
> extends Builder<T> {
	constructor(a: T) {
		super({
			options: [],
			data_source: SelectDataSource.NULL,
			style: PostActionStyle.DEFAULT,
			...a
		});
	}

	public override build(): Readonly<T> {
		return Object.freeze(this.d);
	}
}

/**
 * Mapper for creation from basic objects
 */
export const createActionBuilder = <
	CONTEXT = Record<string, unknown>,
	T extends PostAction<CONTEXT> = PostAction<CONTEXT>
>(
	a: T
): ActionBuilder<CONTEXT, T> => {
	return new ActionBuilder<CONTEXT, T>(a);
};
