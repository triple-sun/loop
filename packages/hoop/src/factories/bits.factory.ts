import { createCallBuilder, createExpandBuilder } from "../builders";
import { createOptionBuilder } from "../builders/common/option.builder";
import { createFieldBuilder } from "../builders/post/post-attachment-field.builder";
import { createPostPropsBuilder } from "../builders/post/post-props.builder";

export const BitsFactory = {
	Field: createFieldBuilder,
	Option: createOptionBuilder,
	Call: createCallBuilder,
	Expand: createExpandBuilder,
	Props: createPostPropsBuilder
} as const;
