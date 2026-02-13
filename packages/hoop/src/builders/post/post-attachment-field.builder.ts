import type { PostAttachmentField } from "loop-types";
import { Builder } from "../../internal/builders";

/**
 * Post attachment field builder
 *
 * {@link https://developers.mattermost.com/integrate/reference/message-attachments/ | Attachments}
 * {@link https://developers.mattermost.com/integrate/plugins/interactive-messages/ | Interactive messages}
 */
export class FieldBuilder extends Builder<PostAttachmentField> {
	constructor(f: Partial<PostAttachmentField> = {}) {
		super({
			short: f.short ?? true,
			title: f.title ?? "",
			value: f.value ?? ""
		});
	}

	public override build(): Readonly<PostAttachmentField> {
		return Object.freeze(this.d);
	}

	public override toString(): Readonly<string> {
		return `${this.d.title ? `[${this.d.title}]:` : ""}\n${this.d.value || ""}`;
	}
}

export const createFieldBuilder = (w: PostAttachmentField) =>
	new FieldBuilder(w);
