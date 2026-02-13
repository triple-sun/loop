import { z } from "zod";
import { RolePermission } from "./roles";
export declare const rolePermissionSchema: z.ZodEnum<typeof RolePermission>;
export declare const roleSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    display_name: z.ZodString;
    description: z.ZodString;
    create_at: z.ZodNumber;
    update_at: z.ZodNumber;
    delete_at: z.ZodNumber;
    permissions: z.ZodArray<z.ZodUnion<readonly [z.ZodEnum<typeof RolePermission>, z.ZodString]>>;
    scheme_managed: z.ZodBoolean;
    built_in: z.ZodBoolean;
}, z.core.$strip>;
//# sourceMappingURL=roles.zod.d.ts.map