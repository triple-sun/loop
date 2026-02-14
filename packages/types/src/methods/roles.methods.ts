export interface RolesGetArguments {
	role_id: string;
}

export interface RolesGetByNameArguments {
	name: string;
}

export interface RolesPatchArguments {
	role_id: string;
	permissions: string[];
}

export interface RolesGetByNamesArguments {
	roles: string[];
}
