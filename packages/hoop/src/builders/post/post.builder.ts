import type { PostsCreateArguments, PostsUpdateArguments } from "loop-client";
import {
	type AppBinding,
	type Post,
	type PostAction,
	type PostActionData,
	type PostAttachment,
	type PostAttachmentField,
	PostType
} from "loop-types";
import type { WritableKeysOf } from "type-fest";
import { Builder } from "../../internal/builders";
import {
	clearCollection,
	find,
	findIndex,
	isSelected,
	mutateCollection
} from "../../internal/utils";
import type {
	Filter,
	Finder,
	IndexOrFinder,
	Mutagen,
	Selector
} from "../../types";
import {
	AppBindingBuilder,
	type AppBindingData,
	createAppBindingBuilder
} from "../app/app-binding.builder";
import {
	AttachmentBuilder,
	type AttachmentData
} from "./post-attachment.builder";
import {
	type ActionBuilder,
	createActionBuilder
} from "./post-attachment-action.builder";
import {
	createFieldBuilder,
	type FieldBuilder
} from "./post-attachment-field.builder";
import {
	createPostPropsBuilder,
	type PostPropsBuilder,
	type PostPropsData,
	type PostPropsResult
} from "./post-props.builder";

export interface PostData<PROPS_METADATA = Record<string, unknown>>
	extends Omit<Post<PROPS_METADATA>, "props"> {
	props: PostPropsBuilder<PROPS_METADATA>;
}

export interface PostResult<PROPS_METADATA = Record<string, unknown>>
	extends Omit<Post<PROPS_METADATA>, "props"> {
	props: PostPropsResult<PROPS_METADATA>;
}

export const createPostBuilder = <PROPS_METADATA = Record<string, unknown>>(
	post: Partial<Post<PROPS_METADATA>> = {}
) => new PostBuilder<PROPS_METADATA>(post);

/**
 * Post builder
 *
 * {@link https://developers.mattermost.com/integrate/reference/message-attachments/ | Attachments}
 * {@link https://developers.mattermost.com/integrate/plugins/interactive-messages/ | Interactive messages}
 */
export class PostBuilder<
	PROPS_METADATA = Record<string, unknown>
> extends Builder<
	PostResult<PROPS_METADATA>,
	"props",
	PostData<PROPS_METADATA>
> {
	constructor(post: Partial<Post<PROPS_METADATA>> = {}) {
		super({
			message: post.message ?? "",
			root_id: post.root_id ?? "",
			file_ids: post.file_ids ?? [],
			props: createPostPropsBuilder<PROPS_METADATA>(post.props ?? {}),
			participants: post.participants || null,

			id: post.id ?? "",
			channel_id: post.channel_id ?? "",
			user_id: post.user_id ?? "",
			original_id: post.original_id ?? "",
			pending_post_id: post.pending_post_id ?? "",
			create_at: post.create_at ?? 0,
			update_at: post.update_at ?? 0,
			delete_at: post.delete_at ?? 0,
			edit_at: post.edit_at ?? 0,
			type: post.type || PostType.NULL,
			hashtag: post.hashtag || "",
			metadata: post.metadata || {},
			reply_count: post.reply_count || 0,
			last_reply_at: post.last_reply_at || 0
		});
	}

	public override build(): Readonly<PostResult<PROPS_METADATA>> {
		return Object.freeze({ ...this.d, props: this.d.props.build() });
	}

	public buildToCreate(
		type: "channel" | "user",
		id: string
	): Readonly<PostsCreateArguments<PROPS_METADATA>> {
		switch (type) {
			case "channel":
				return Object.freeze({ ...this.build(), channel_id: id });
			case "user":
				return Object.freeze({ ...this.build(), to_user_id: id });
		}
	}

	public buildToUpdate(
		id: string
	): Readonly<PostsUpdateArguments<PROPS_METADATA>> {
		return Object.freeze({ ...this.build(), id });
	}

	public getAttachments(): ReadonlyArray<AttachmentBuilder> {
		return this.d.props.get("attachments");
	}

	public getFields(
		fi: IndexOrFinder<AttachmentBuilder> = 0
	): ReadonlyArray<FieldBuilder> | undefined {
		return find(fi, this.d.props.get("attachments"))?.get("fields");
	}

	public getActions(
		fi: IndexOrFinder<AttachmentBuilder> = 0
	): ReadonlyArray<ActionBuilder> | undefined {
		return find(fi, this.d.props.get("attachments"))?.get("actions");
	}

	public getAllActions(): ReadonlyArray<ActionBuilder> {
		return Object.freeze(
			this.d.props.get("attachments").flatMap(a => a.get("actions"))
		);
	}

	public getAllFields(): ReadonlyArray<FieldBuilder> {
		return Object.freeze(
			this.d.props.get("attachments").flatMap(a => a.get("fields"))
		);
	}

	public getPropsMetadata(): Readonly<PROPS_METADATA> | undefined {
		const metadata = this.d.props.get("metadata");
		return metadata ? Object.freeze({ ...metadata }) : undefined;
	}

	public readonly props = {
		set: (props: typeof this.d.props): this => {
			this.d.props = props;

			return this;
		},

		update: <K extends keyof PostPropsData<PROPS_METADATA>>(
			key: K,
			value: PostPropsData<PROPS_METADATA>[K]
		): this => {
			this.d.props.set(key, value);

			return this;
		},

		/**
		 * @description Props metadata mutation methods
		 */
		metadata: {
			add: (metadata: PROPS_METADATA): this => {
				this.d.props.set("metadata", {
					...this.d.props.get("metadata"),
					...metadata
				});

				return this;
			},
			set: (metadata: PROPS_METADATA): this => {
				this.d.props.set("metadata", metadata);

				return this;
			}
		} as const
	} as const;

	/**
	 * @description Props bindings mutation methods
	 */
	public readonly bindings = {
		set: (bindings: AppBinding[]): this => {
			this.d.props.set("app_bindings", bindings.map(createAppBindingBuilder));

			return this;
		},

		update: <K extends keyof AppBindingData>(
			key: K,
			value: AppBindingData[K],
			finder: IndexOrFinder<AppBindingBuilder> = 0
		): this => {
			const ab = find(finder, this.d.props.get("app_bindings"));

			if (ab) {
				ab.set(key, value);
			}

			return this;
		},

		append: (...bindings: AppBinding[]): this => {
			this.d.props.append(
				"app_bindings",
				...bindings.map(a => new AppBindingBuilder(a))
			);

			return this;
		},

		filter: (filter: Filter<AppBindingBuilder>): this => {
			this.d.props.set(
				"app_bindings",
				this.d.props.get("app_bindings").filter(filter)
			);
			return this;
		},

		clear: (): this => {
			this.d.props.set("app_bindings", []);
			return this;
		},

		mutate: (
			finder: Finder<AppBindingBuilder[]>,
			mutagen: Mutagen<AppBindingBuilder>
		): this => {
			this.d.props.set(
				"app_bindings",
				mutateCollection(this.d.props.get("app_bindings"), mutagen, finder)
			);

			return this;
		}
	} as const;

	/**
	 * @description attachment mutation methods
	 */
	public readonly attachments = {
		set: (attachments: PostAttachment[]): this => {
			this.d.props.set(
				"attachments",
				attachments.map(a => new AttachmentBuilder(a))
			);
			return this;
		},

		update: (
			key: keyof AttachmentData,
			value: AttachmentData[typeof key],
			finder: IndexOrFinder<AttachmentBuilder> = 0
		): this => {
			const at = find(finder, this.d.props.get("attachments"));

			if (at) {
				at.set(key, value);
			}

			return this;
		},

		append: (...attachments: PostAttachment[]): this => {
			this.d.props.append(
				"attachments",
				...attachments.map(a => new AttachmentBuilder(a))
			);

			return this;
		},

		clear: (): this => {
			this.d.props.set("attachments", []);

			return this;
		},

		filter: (filter: Filter<AttachmentBuilder>): this => {
			this.d.props.set(
				"attachments",
				this.d.props.get("attachments").filter(filter)
			);

			return this;
		},

		mutate: (
			mutagen: Mutagen<AttachmentBuilder>,
			finder: IndexOrFinder<AttachmentBuilder> = 0
		): this => {
			const attachments = this.d.props.get("attachments");
			const index = findIndex(finder, attachments);

			if (index >= 0 && attachments[index]) {
				const updated = [...attachments];
				updated[index] = mutagen(attachments[index]);
				this.d.props.set("attachments", updated);
			}

			return this;
		},

		mutateAll: (
			mutagen: Mutagen<AttachmentBuilder>,
			selector?: Finder<AttachmentBuilder[]>
		): this => {
			this.d.props.set(
				"attachments",
				this.d.props.get("attachments").map((at, i) => {
					if (isSelected(at, selector)) {
						return mutagen(at, i);
					} else return at;
				})
			);

			return this;
		}
	} as const;

	/**
	 * @description Props attachment actions mutation methods
	 */
	public readonly actions = {
		set: (
			finder: IndexOrFinder<AttachmentBuilder>,
			...actions: PostAction[]
		): this => {
			const at = find(finder, this.d.props.get("attachments"));

			if (at) {
				at.set("actions", actions.map(createActionBuilder));
			}

			return this;
		},

		update: (
			key: WritableKeysOf<PostActionData>,
			value: PostActionData[typeof key],
			attachmentFinder: IndexOrFinder<AttachmentBuilder> = 0,
			attachmentActionFinder: IndexOrFinder<ActionBuilder> = 0
		): this => {
			const at = find(attachmentFinder, this.d.props.get("attachments"));

			if (at) {
				const ac = find(attachmentActionFinder, at.get("actions"));

				if (ac) {
					ac.set(key, value);
				}
			}

			return this;
		},

		find: (
			attachmentFinder: IndexOrFinder<AttachmentBuilder> = 0,
			attachmentActionFinder: IndexOrFinder<ActionBuilder> = 0
		): ActionBuilder | undefined => {
			const at = find(attachmentFinder, this.d.props.get("attachments"));

			if (at) {
				return find(attachmentActionFinder, at.get("actions"));
			}

			return undefined;
		},

		/** Добавление actions у найденного аттача или по индексу */
		append: (
			finder: IndexOrFinder<AttachmentBuilder>,
			...actions: PostAction[]
		): this => {
			const at = find(finder, this.d.props.get("attachments"));

			if (at) {
				at.append("actions", ...actions.map(createActionBuilder));
			}

			return this;
		},

		/** Удаление actions у первого аттача или по индексу */
		clear: (finder: IndexOrFinder<AttachmentBuilder> = 0): this => {
			const at = find(finder, this.d.props.get("attachments"));

			if (at) {
				at.set("actions", []);
			}

			return this;
		},

		mutate: (
			mutagen: Mutagen<ActionBuilder>,
			attachmentFinder: IndexOrFinder<AttachmentBuilder> = 0,
			attachmentActionFinder: IndexOrFinder<ActionBuilder> = 0
		): this => {
			const at = find(attachmentFinder, this.d.props.get("attachments"));

			if (at) {
				at.set(
					"actions",
					mutateCollection(at.get("actions"), mutagen, attachmentActionFinder)
				);
			}

			return this;
		},

		filter: (
			finder: IndexOrFinder<AttachmentBuilder>,
			filter: Filter<ActionBuilder>
		): this => {
			const at = find(finder, this.d.props.get("attachments"));

			if (at) {
				at.set("actions", at.get("actions").filter(filter));
			}

			return this;
		},

		clearAll: (selector?: Selector<ActionBuilder>): this => {
			this.d.props.set(
				"attachments",
				this.d.props.get("attachments").map(at => {
					at.set("actions", clearCollection(at.get("actions"), selector));
					return at;
				})
			);

			return this;
		},

		filterAll: (
			filter: Filter<ActionBuilder>,
			selector?: Selector<AttachmentBuilder>
		): this => {
			this.d.props.set(
				"attachments",
				this.d.props.get("attachments").map((at, i) => {
					if (isSelected(at, selector, i)) {
						at.set("actions", at.get("actions").filter(filter));
					}

					return at;
				})
			);

			return this;
		},

		mutateAll: (
			mutagen: Mutagen<ActionBuilder>,
			attachmentSelector?: Selector<AttachmentBuilder>,
			attachmentActionSelector?: Selector<ActionBuilder>
		): this => {
			this.d.props.set(
				"attachments",
				this.d.props.get("attachments").map((at, i) => {
					if (isSelected(at, attachmentSelector, i)) {
						at.set(
							"actions",
							at.get("actions").map((ac, i) => {
								if (isSelected(ac, attachmentActionSelector, i)) {
									return mutagen(ac);
								}

								return ac;
							})
						);
					}

					return at;
				})
			);

			return this;
		}
	} as const;

	/**
	 * @description Props attachment fields mutation methods
	 */
	public readonly fields = {
		set: (
			finder: IndexOrFinder<AttachmentBuilder>,
			...fields: PostAttachmentField[]
		): this => {
			const at = find(finder, this.d.props.get("attachments"));

			if (at) {
				at.set("fields", fields.map(createFieldBuilder));
			}

			return this;
		},

		update: (
			key: WritableKeysOf<PostAttachmentField>,
			value: PostAttachmentField[typeof key],
			attachmentFinder: IndexOrFinder<AttachmentBuilder> = 0,
			attachmentFieldFinder: IndexOrFinder<FieldBuilder> = 0
		): this => {
			const at = find(attachmentFinder, this.d.props.get("attachments"));

			if (at) {
				const af = find(attachmentFieldFinder, at.get("fields"));

				if (af) {
					af.set(key, value);
				}
			}

			return this;
		},

		append: (
			finder: IndexOrFinder<AttachmentBuilder>,
			...fields: PostAttachmentField[]
		): this => {
			const at = find(finder, this.d.props.get("attachments"));

			if (at) {
				at.append("fields", ...fields.map(createFieldBuilder));
			}

			return this;
		},

		/** Удаление fields у первого аттача или по индексу */
		clear: (fi: IndexOrFinder<AttachmentBuilder> = 0): this => {
			const at = find(fi, this.d.props.get("attachments"));

			if (at) {
				at.set("fields", []);
			}

			return this;
		},

		mutate: (
			mutagen: Mutagen<FieldBuilder>,
			attachmentFinder: IndexOrFinder<AttachmentBuilder> = 0,
			attachmentFieldFinder: IndexOrFinder<FieldBuilder> = 0
		): this => {
			const at = find(attachmentFinder, this.d.props.get("attachments"));

			if (at) {
				at.set(
					"fields",
					mutateCollection(at.get("fields"), mutagen, attachmentFieldFinder)
				);
			}

			return this;
		},

		filter: (
			finder: IndexOrFinder<AttachmentBuilder>,
			filter: Filter<FieldBuilder>
		): this => {
			const at = find(finder, this.d.props.get("attachments"));

			if (at) {
				at.set("fields", at.get("fields").filter(filter));
			}

			return this;
		},

		/** Удаление всех fields у всех аттачей c опциональным фильтром */
		clearAll: (selector?: Selector<FieldBuilder>): this => {
			this.d.props.set(
				"attachments",
				this.d.props.get("attachments").map(at => {
					at.set("fields", clearCollection(at.get("fields"), selector));
					return at;
				})
			);

			return this;
		},

		/** Фильтрация всех fields у всех аттачей */
		filterAll: (
			filter: Filter<FieldBuilder>,
			selector?: Selector<AttachmentBuilder>
		): this => {
			this.d.props.set(
				"attachments",
				this.d.props.get("attachments").map((at, i) => {
					if (isSelected(at, selector, i)) {
						at.set("fields", at.get("fields").filter(filter));
					}

					return at;
				})
			);

			return this;
		},

		mutateAll: (
			mutagen: Mutagen<FieldBuilder>,
			attachmentSelector?: Selector<AttachmentBuilder>,
			attachmentActionSelector?: Selector<FieldBuilder>
		): this => {
			this.d.props.set(
				"attachments",
				this.d.props.get("attachments").map((at, i) => {
					if (isSelected(at, attachmentSelector, i)) {
						at.set(
							"fields",
							at.get("fields").map((ac, i) => {
								if (isSelected(ac, attachmentActionSelector, i)) {
									return mutagen(ac);
								}

								return ac;
							})
						);
					}

					return at;
				})
			);

			return this;
		}
	} as const;
}
