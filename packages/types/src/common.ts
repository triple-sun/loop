export enum SelectDataSource {
	CHANNELS = "channels",
	USERS = "users",
	NULL = ""
}

/**
 * @description Universal option interface
 */
export interface Option {
	/**
	 * @description Machine-facing value. Must be unique on this field.
	 */
	value: string;

	/**
	 * @description Label and text are user-facing strings
	 * They default to value or to each other when undefined and must be unique.
	 */
	label?: string;
	text?: string;

	/**
	 * @description Either a fully-qualified URL, or a path for an app's static asset
	 * Used only in options for app form fields
	 */
	icon_data?: string;
}

export interface DataSource {
	/** One of 'users', or 'channels'. If none specified, assumes a manual list of options is provided by the integration. */
	data_source?: SelectDataSource;
}

export interface Options {
	options?: Option[];
}

export interface MinMaxLentgh {
	/**
	 * @description Minimum input length allowed for an element.
	 *
	 * @default 0
	 */
	min_length?: number;
	/**
	 * @description Maximum input length allowed for an element.
	 *
	 * If you expect the input to be greater 150 characters, consider using a textarea type element instead.
	 *
	 * @default 150.
	 */
	max_length?: number;
}
