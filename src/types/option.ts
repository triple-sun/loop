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
