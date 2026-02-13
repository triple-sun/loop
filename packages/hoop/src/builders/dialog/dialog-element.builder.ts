import type { DialogElement, DialogElementType } from "loop-types";
import { Builder } from "../../internal/builders";

/**
 * Dialog element builder
 *
 * {@link https://developers.mattermost.com/integrate/plugins/interactive-dialogs/ | Interactive dialogs}
 */
export class DialogElementBuilder<T extends DialogElement> extends Builder<T> {
	readonly type: DialogElementType;

	constructor(el: T) {
		super(el);
		this.type = el.type;
	}
	override build(): Readonly<T> {
		return Object.freeze(this.d);
	}
}

export const createDialogElementBuilder = <T extends DialogElement>(
	el: T
): DialogElementBuilder<T> => new DialogElementBuilder(el);
