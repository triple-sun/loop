import { z } from "zod";
export declare const openGraphMetadataImageSchema: z.ZodObject<{
    secure_url: z.ZodOptional<z.ZodString>;
    url: z.ZodString;
    type: z.ZodOptional<z.ZodString>;
    height: z.ZodOptional<z.ZodNumber>;
    width: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const openGraphMetadataSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    site_name: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    images: z.ZodArray<z.ZodObject<{
        secure_url: z.ZodOptional<z.ZodString>;
        url: z.ZodString;
        type: z.ZodOptional<z.ZodString>;
        height: z.ZodOptional<z.ZodNumber>;
        width: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
//# sourceMappingURL=metadata.zod.d.ts.map