import { type AppBinding, AppLocation, type Option } from "loop-types";
import { createAppBindingBuilder } from "../builders/app/app-binding.builder";

export const BindingFactory = {
	Basic: (a: AppBinding) => createAppBindingBuilder(a),

	Embed: {
		/**
		 * @description Post embed button
		 *
		 * @see {@link https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#hdr-In_post_Bindings-Binding | In-post bindings } */
		Button: (b: Omit<AppBinding, "location">) =>
			createAppBindingBuilder({ ...b, location: AppLocation.EMBEDDED }),

		/**
		 * @description Post embed select
		 *
		 * @see {@link https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#hdr-In_post_Bindings-Binding | In-post bindings } */
		Select: ({
			options,
			submit,
			...b
		}: Omit<AppBinding, "location"> & {
			options: Option[];
		}) =>
			createAppBindingBuilder({
				...b,
				location: AppLocation.EMBEDDED,
				bindings: options.map(o => ({
					app_id: b.app_id,
					location: o.value,
					label: o.label,
					submit: submit
				}))
			})
	} as const
} as const;
