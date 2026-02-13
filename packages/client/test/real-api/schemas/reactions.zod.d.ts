import { z } from "zod";
export declare const reactionSchema: z.ZodObject<{
    user_id: z.ZodString;
    post_id: z.ZodString;
    emoji_name: z.ZodString;
    create_at: z.ZodNumber;
}, z.core.$strip>;
//# sourceMappingURL=reactions.zod.d.ts.map