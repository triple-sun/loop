import { z } from "zod";
export declare const postsUsageResponseSchema: z.ZodObject<{
    count: z.ZodNumber;
}, z.core.$strip>;
export declare const postNotificationResponseSchema: z.ZodObject<{
    status: z.ZodUnion<readonly [z.ZodLiteral<"error">, z.ZodLiteral<"not_sent">, z.ZodLiteral<"unsupported">, z.ZodLiteral<"success">]>;
    reason: z.ZodOptional<z.ZodString>;
    data: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const postActionResponseSchema: z.ZodIntersection<z.ZodAny, z.ZodObject<{
    integration: z.ZodNever;
}, z.core.$strip>>;
export declare const postAttachmentResponseSchema: z.ZodObject<{
    actions: z.ZodArray<z.ZodIntersection<z.ZodAny, z.ZodObject<{
        integration: z.ZodNever;
    }, z.core.$strip>>>;
    fields: z.ZodNullable<z.ZodArray<z.ZodAny>>;
}, z.core.$strip>;
export declare const postPropsResponseSchema: z.ZodObject<{
    attachments: z.ZodOptional<z.ZodArray<z.ZodAny>>;
}, z.core.$strip>;
export declare const postResponseSchema: z.ZodObject<{
    props: z.ZodAny;
    ts: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
export declare const postListResponseSchema: z.ZodObject<{
    order: z.ZodArray<z.ZodString>;
    posts: z.ZodRecord<z.ZodString, z.ZodObject<{
        props: z.ZodAny;
        ts: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>>;
    next_post_id: z.ZodString;
    prev_post_id: z.ZodString;
    first_inaccessible_post_time: z.ZodNumber;
}, z.core.$strip>;
export declare const paginatedPostListResponseSchema: z.ZodObject<{
    order: z.ZodArray<z.ZodString>;
    posts: z.ZodRecord<z.ZodString, z.ZodObject<{
        props: z.ZodAny;
        ts: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>>;
    next_post_id: z.ZodString;
    prev_post_id: z.ZodString;
    first_inaccessible_post_time: z.ZodNumber;
    has_next: z.ZodBoolean;
}, z.core.$strip>;
export declare const postSearchResponseSchema: z.ZodObject<{
    order: z.ZodArray<z.ZodString>;
    posts: z.ZodRecord<z.ZodString, z.ZodObject<{
        props: z.ZodAny;
        ts: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>>;
    next_post_id: z.ZodString;
    prev_post_id: z.ZodString;
    first_inaccessible_post_time: z.ZodNumber;
    matches: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
//# sourceMappingURL=posts.responses.zod.d.ts.map