import { z } from "zod";
export declare const botSchema: z.ZodObject<{
    user_id: z.ZodString;
    username: z.ZodString;
    display_name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    owner_id: z.ZodString;
    create_at: z.ZodNumber;
    update_at: z.ZodNumber;
    delete_at: z.ZodNumber;
}, z.core.$strip>;
export declare const botPatchSchema: z.ZodObject<{
    username: z.ZodString;
    display_name: z.ZodString;
    description: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=bots.zod.d.ts.map