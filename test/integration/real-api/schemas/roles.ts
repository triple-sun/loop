export enum RolePermission {
	EDIT_BOOKMARK_PUBLIC_CHANNEL = "edit_bookmark_public_channel",
	REMOVE_REACTION = "remove_reaction",
	DELETE_PUBLIC_CHANNEL = "delete_public_channel",
	CREATE_POST = "create_post",
	MANAGE_PRIVATE_CHANNEL_PROPERTIES = "manage_private_channel_properties",
	ORDER_BOOKMARK_PRIVATE_CHANNEL = "order_bookmark_private_channel",
	USE_CHANNEL_MENTIONS = "use_channel_mentions",
	DELETE_BOOKMARK_PUBLIC_CHANNEL = "delete_bookmark_public_channel",
	GET_PUBLIC_LINK = "get_public_link",
	EDIT_POST = "edit_post",
	MANAGE_PUBLIC_CHANNEL_PROPERITES = "manage_public_channel_properties",
	EDIT_BOOKMARK_PRIVATE_CHANNEL = "edit_bookmark_private_channel",
	UPLOAD_FILE = "upload_file",
	ADD_REACTION = "add_reaction",
	MANAGE_PUBLIC_CHANNEL_MEMBERS = "manage_public_channel_members",
	DELETE_BOOKMARK_PRIVATE_CHANNEL = "delete_bookmark_private_channel",
	ADD_BOOKMARK_PRIVATE_CHANNEL = "add_bookmark_private_channel",
	READ_PRIVATE_CHANNEL_GROUPS = "read_private_channel_groups",
	MANAGE_PRIVATE_CHANNEL_MEMBERS = "manage_private_channel_members",
	ORDER_BOOKMARK_PUBLIC_CHANNEL = "order_bookmark_public_channel",
	READ_CHANNEL_CONTENT = "read_channel_content",
	READ_PUBLIC_CHANNEL_GROUPS = "read_public_channel_groups",
	READ_CHANNEL = "read_channel",
	DELETE_POST = "delete_post",
	USE_GROUP_MENTIONS = "use_group_mentions",
	DELETE_PRIVATE_CHANNEL = "delete_private_channel"
}

export type Role = {
	id: string;
	name: string;
	display_name: string;
	description: string;
	create_at: number;
	update_at: number;
	delete_at: number;
	permissions: (RolePermission | string)[];
	scheme_managed: boolean;
	built_in: boolean;
};
