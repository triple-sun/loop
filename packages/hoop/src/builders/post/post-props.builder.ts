import type { PostProps } from "loop-types";
import { Builder } from "../../internal/builders";
import type { SelectedKeysOf } from "../../internal/types";
import {
	type AppBindingBuilder,
	type AppBindingResult,
	createAppBindingBuilder
} from "../app/app-binding.builder";
import {
	type AttachmentBuilder,
	type AttachmentResult,
	createAttachmentBuilder
} from "./post-attachment.builder";

export type PostPropsWrappedKeys = SelectedKeysOf<
	PostProps,
	"app_bindings" | "attachments"
>;

export interface PostPropsData<METADATA = Record<string, unknown>>
	extends Omit<PostProps<METADATA>, PostPropsWrappedKeys> {
	attachments: AttachmentBuilder[];
	app_bindings: AppBindingBuilder[];
}

export interface PostPropsResult<METADATA = Record<string, unknown>>
	extends Omit<PostProps<METADATA>, PostPropsWrappedKeys> {
	attachments: AttachmentResult[];
	app_bindings?: AppBindingResult[];
	metadata?: Readonly<METADATA>;
}

export class PostPropsBuilder<
	METADATA = Record<string, unknown>
> extends Builder<
	PostPropsResult<METADATA>,
	PostPropsWrappedKeys,
	PostPropsData<METADATA>
> {
	constructor(p: Partial<PostProps<METADATA>> = {}) {
		super({
			from_bot: p.from_bot ?? "false",
			metadata: p.metadata,
			attachments: (p.attachments ?? []).map(createAttachmentBuilder),
			app_bindings: (p.app_bindings ?? []).map(createAppBindingBuilder)
		});
	}

	public override build(): Readonly<PostPropsResult<METADATA>> {
		return Object.freeze({
			...this.d,
			attachments: this.d.attachments.map(at => at.build()),
			app_bindings: this.d.app_bindings.map(ab => ab.build()),
			metadata: Object.freeze(this.d.metadata)
		});
	}
}

export const createPostPropsBuilder = <METADATA = Record<string, unknown>>(
	pp: Partial<PostProps<METADATA>>
): PostPropsBuilder<METADATA> => new PostPropsBuilder<METADATA>(pp);
