import { z } from "zod";
import { EmojiCategory } from "./emojis";
export declare const emojiCategorySchema: z.ZodEnum<typeof EmojiCategory>;
export declare const customEmojiSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    category: z.ZodLiteral<EmojiCategory.CUSTOM>;
    create_at: z.ZodNumber;
    update_at: z.ZodNumber;
    delete_at: z.ZodNumber;
    creator_id: z.ZodString;
}, z.core.$strip>;
export declare const recentEmojiDataSchema: z.ZodObject<{
    name: z.ZodString;
    usageCount: z.ZodNumber;
}, z.core.$strip>;
export declare const systemEmojiVariationSchema: z.ZodObject<{
    unified: z.ZodString;
    non_qualified: z.ZodNull;
    image: z.ZodString;
    sheet_x: z.ZodNumber;
    sheet_y: z.ZodNumber;
    added_in: z.ZodString;
    has_img_apple: z.ZodBoolean;
    has_img_google: z.ZodBoolean;
    has_img_twitter: z.ZodBoolean;
    has_img_facebook: z.ZodBoolean;
}, z.core.$strip>;
export declare const systemEmojiSchema: z.ZodObject<{
    name: z.ZodString;
    category: z.ZodEnum<typeof EmojiCategory>;
    image: z.ZodString;
    short_name: z.ZodString;
    short_names: z.ZodArray<z.ZodString>;
    batch: z.ZodNumber;
    skins: z.ZodOptional<z.ZodArray<z.ZodString>>;
    skin_variations: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        unified: z.ZodString;
        non_qualified: z.ZodNull;
        image: z.ZodString;
        sheet_x: z.ZodNumber;
        sheet_y: z.ZodNumber;
        added_in: z.ZodString;
        has_img_apple: z.ZodBoolean;
        has_img_google: z.ZodBoolean;
        has_img_twitter: z.ZodBoolean;
        has_img_facebook: z.ZodBoolean;
    }, z.core.$strip>>>;
    unified: z.ZodString;
}, z.core.$strip>;
export declare const emojiSchema: z.ZodUnion<readonly [z.ZodObject<{
    name: z.ZodString;
    category: z.ZodEnum<typeof EmojiCategory>;
    image: z.ZodString;
    short_name: z.ZodString;
    short_names: z.ZodArray<z.ZodString>;
    batch: z.ZodNumber;
    skins: z.ZodOptional<z.ZodArray<z.ZodString>>;
    skin_variations: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        unified: z.ZodString;
        non_qualified: z.ZodNull;
        image: z.ZodString;
        sheet_x: z.ZodNumber;
        sheet_y: z.ZodNumber;
        added_in: z.ZodString;
        has_img_apple: z.ZodBoolean;
        has_img_google: z.ZodBoolean;
        has_img_twitter: z.ZodBoolean;
        has_img_facebook: z.ZodBoolean;
    }, z.core.$strip>>>;
    unified: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    category: z.ZodLiteral<EmojiCategory.CUSTOM>;
    create_at: z.ZodNumber;
    update_at: z.ZodNumber;
    delete_at: z.ZodNumber;
    creator_id: z.ZodString;
}, z.core.$strip>]>;
//# sourceMappingURL=emojis.zod.d.ts.map