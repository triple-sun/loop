export enum FieldType {
	TEXT = "text",
	SELECT = "select",
	MULTISELECT = "multiselect",
	DATE = "date",
	USER = "user",
	MULTIUSER = "multiuser"
}
export enum FieldValueType {
	EMAIL = "email",
	URL = "url",
	PHONE = "phone",
	EMPTY = ""
}

export interface PropertyField {
	id: string;
	group_id: string;
	name: string;
	type: FieldType;
	attrs?: {
		subType?: string;
		[key: string]: unknown;
	};
	target_id?: string;
	target_type?: string;
	create_at: number;
	update_at: number;
	delete_at: number;
}

export interface NameMappedPropertyFields {
	[key: PropertyField["name"]]: PropertyField;
}

export interface PropertyValue<T> {
	id: string;
	target_id: string;
	target_type: string;
	group_id: string;
	field_id: string;
	value: T;
	create_at: number;
	update_at: number;
	delete_at: number;
}

export type UserPropertyFieldType =
	| FieldType.TEXT
	| FieldType.SELECT
	| FieldType.MULTISELECT;
export type UserPropertyValueType =
	| FieldValueType.EMAIL
	| FieldValueType.URL
	| FieldValueType.PHONE
	| FieldValueType.EMPTY;

export interface PropertyFieldOption {
	id: string;
	name: string;
	color?: string;
}

export interface UserPropertyField extends PropertyField {
	group_id: "custom_profile_attributes" | string;
	attrs: {
		sort_order: number;
		visibility: "always" | "hidden" | "when_set";
		value_type: FieldValueType;
		options?: PropertyFieldOption[];
		ldap?: string;
		saml?: string;
		managed?: string;
		protected?: boolean;
		source_plugin_id?: string;
		access_mode?: "" | "source_only" | "shared_only";
	};
}

export interface SelectPropertyField extends PropertyField {
	attrs?: {
		editable?: boolean;
		options?: PropertyFieldOption[];
	};
}

export interface UserPropertyFieldPatch
	extends Partial<Pick<UserPropertyField, "name" | "attrs" | "type">> {}
