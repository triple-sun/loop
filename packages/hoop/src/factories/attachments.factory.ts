import type { PostAttachment } from "loop-types";
import {
	type AttachmentBuilder,
	createAttachmentBuilder
} from "../builders/post/post-attachment.builder";

export const AttachmentFactory = {
	Create: createAttachmentBuilder,

	Divider: createAttachmentBuilder({
		text: `\n\n---\n\n`
	}),

	AsUser: (
		params: Omit<PostAttachment, "author_link"> & {
			username: string;
			team: string;
			url: string;
		}
	): AttachmentBuilder =>
		createAttachmentBuilder({
			...params,
			author_icon: params.author_icon,
			author_link: params.username
				? `${params.url}/${params.team}/messages/@${params.username}`
				: ""
		}),

	Section: (a: Partial<PostAttachment> = { text: "" }): AttachmentBuilder =>
		createAttachmentBuilder({ ...a, text: a.text ?? "" })
} as const;
