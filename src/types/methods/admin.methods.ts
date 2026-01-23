import type { UserID } from "./common.methods";

export interface AdminUpdateRolesArguments extends UserID {
    roles: string[];
}