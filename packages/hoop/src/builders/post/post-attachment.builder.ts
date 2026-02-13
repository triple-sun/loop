import type {
	PostAction,
	PostAttachment,
	PostAttachmentField
} from "loop-types";
import removeMd from "remove-markdown";
import { Builder } from "../../internal/builders";
import type { DeepRequired, SelectedKeysOf } from "../../internal/types";
import {
	type ActionBuilder,
	createActionBuilder
} from "./post-attachment-action.builder";
import {
	createFieldBuilder,
	type FieldBuilder
} from "./post-attachment-field.builder";

export type AttachmentBuildableKeys = SelectedKeysOf<
	PostAttachment,
	"actions" | "fields"
>;

export interface AttachmentData
	extends Omit<DeepRequired<PostAttachment>, AttachmentBuildableKeys> {
	actions: Array<ActionBuilder>;
	fields: Array<FieldBuilder>;
}

export interface AttachmentResult
	extends Omit<DeepRequired<PostAttachment>, AttachmentBuildableKeys> {
	actions: Array<PostAction>;
	fields: Array<PostAttachmentField>;
}

/**
 * Post attachment builder
 *
 * {@link https://developers.mattermost.com/integrate/reference/message-attachments/ | Attachments}
 * {@link https://developers.mattermost.com/integrate/plugins/interactive-messages/ | Interactive messages}
 */
export class AttachmentBuilder extends Builder<
	AttachmentResult,
	AttachmentBuildableKeys,
	AttachmentData
> {
	constructor(at: Partial<PostAttachment> = {}) {
		super({
			fallback: at.fallback ?? "",
			author_name: at.author_name ?? "",
			author_icon: at.author_icon ?? "",
			author_link: at.author_link ?? "",
			color: at.color ?? "",
			title: at.title ?? "",
			title_link: at.title_link ?? "",
			pretext: at.pretext ?? "",
			text: at.text ?? "",
			image_url: at.image_url ?? "",
			thumb_url: at.thumb_url ?? "",
			actions: (at.actions ?? []).map(createActionBuilder),
			fields: (at.fields ?? []).map(createFieldBuilder),
			footer: at.footer ?? "",
			footer_icon: at.footer_icon ?? "",
			ts: 0
		});

		/** Формируем fallback на основании данных */
		if (this.d.fallback === "") this.d.fallback = this.createFallback();
	}

	public override build(): Readonly<AttachmentResult> {
		return Object.freeze({
			...this.d,
			actions: this.d.actions.map(a => a.build()),
			fields: this.d.fields.map(f => f.build())
		});
	}

	private createFallback(): string {
		return removeMd(
			`${this.getPropsFallback()}\n\n${this.getFieldsFallback()}\n\n${this.getActionsFallback()}`,
			{ separateLinksAndTexts: ": ", useImgAltText: true }
		);
	}

	private getPropsFallback(): Readonly<string> {
		return [this.d.author_name, this.d.title, this.d.pretext, this.d.text]
			.map(p => p || "")
			.join(`\n`);
	}

	private getFieldsFallback(): Readonly<string> {
		if (!this.d.fields || this.d.fields.length === 0) return "";

		return this.d.fields.map(f => f.toString()).join(`\n`);
	}

	private getActionsFallback(): Readonly<string> {
		if (!this.d.actions || this.d.actions.length === 0) return "";

		return this.d.actions.map(a => a.get("name")).join(` | `);
	}
}

export const createAttachmentBuilder = (
	at: PostAttachment
): AttachmentBuilder => new AttachmentBuilder(at);
