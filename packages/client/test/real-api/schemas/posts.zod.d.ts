import { z } from "zod";
import { type Post, type PostActionResponsePayload, PostActionStyle, PostActionType, PostAttachmentColor, type PostEmbed, PostEmbedType, type PostMetadata, type PostPreviewMetadata, PostPriority, PostState, PostType } from "./posts";
export declare const postStateSchema: z.ZodEnum<typeof PostState>;
export declare const postPrioritySchema: z.ZodEnum<typeof PostPriority>;
export declare const postEmbedTypeSchema: z.ZodEnum<typeof PostEmbedType>;
export declare const postTypeSchema: z.ZodEnum<typeof PostType>;
export declare const postPriorityMetadataSchema: z.ZodObject<{
    priority: z.ZodEnum<typeof PostPriority>;
    requested_ack: z.ZodOptional<z.ZodBoolean>;
    persistent_notifications: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const postImageSchema: z.ZodObject<{
    format: z.ZodString;
    frameCount: z.ZodNumber;
    height: z.ZodNumber;
    width: z.ZodNumber;
}, z.core.$strip>;
export declare const postAcknowledgementSchema: z.ZodObject<{
    post_id: z.ZodString;
    user_id: z.ZodString;
    acknowledged_at: z.ZodNumber;
}, z.core.$strip>;
export declare const postAttachmentColorSchema: z.ZodEnum<typeof PostAttachmentColor>;
export declare const postAttachmentFieldSchema: z.ZodObject<{
    title: z.ZodString;
    value: z.ZodString;
    short: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const postActionStyleSchema: z.ZodEnum<typeof PostActionStyle>;
export declare const postActionTypeSchema: z.ZodEnum<typeof PostActionType>;
export declare const postActionButtonSchema: any;
export declare const postActionPayloadSchema: z.ZodObject<{
    post_id: z.ZodString;
    channel_id: z.ZodString;
    user_id: z.ZodString;
    team_id: z.ZodOptional<z.ZodString>;
    context: z.ZodUnknown;
}, z.core.$strip>;
export declare const postAnalyticsSchema: z.ZodObject<{
    channel_id: z.ZodString;
    post_id: z.ZodString;
    user_actual_id: z.ZodString;
    root_id: z.ZodString;
    priority: z.ZodOptional<z.ZodEnum<typeof PostPriority>>;
    requested_ack: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodUndefined]>>;
    persistent_notifications: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodUndefined]>>;
}, z.core.$strip>;
export declare const postOrderBlockSchema: z.ZodObject<{
    order: z.ZodArray<z.ZodString>;
    recent: z.ZodOptional<z.ZodBoolean>;
    oldest: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const messageHistorySchema: z.ZodObject<{
    messages: z.ZodArray<z.ZodString>;
    index: z.ZodObject<{
        post: z.ZodNumber;
        comment: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const postActivityEntrySchema: z.ZodObject<{
    postType: z.ZodEnum<typeof PostType>;
    actorId: z.ZodArray<z.ZodString>;
    userIds: z.ZodArray<z.ZodString>;
    usernames: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const postInfoSchema: z.ZodObject<{
    channel_id: z.ZodString;
    channel_type: z.ZodString;
    channel_display_name: z.ZodString;
    has_joined_channel: z.ZodBoolean;
    team_id: z.ZodString;
    team_type: z.ZodString;
    team_display_name: z.ZodString;
    has_joined_team: z.ZodBoolean;
}, z.core.$strip>;
export declare const postActionSelectSchema: any;
export declare const postActionSchema: z.ZodUnion<readonly [any, any]>;
export declare const postAttachmentSchema: z.ZodObject<{
    fallback: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<typeof PostAttachmentColor>, z.ZodString]>>;
    pretext: z.ZodOptional<z.ZodString>;
    text: z.ZodString;
    author_name: z.ZodOptional<z.ZodString>;
    author_link: z.ZodOptional<z.ZodString>;
    author_icon: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    title_link: z.ZodOptional<z.ZodString>;
    fields: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        value: z.ZodString;
        short: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>>;
    actions: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [any, any]>>>;
    image_url: z.ZodOptional<z.ZodString>;
    thumb_url: z.ZodOptional<z.ZodString>;
    footer: z.ZodOptional<z.ZodString>;
    footer_icon: z.ZodOptional<z.ZodString>;
    ts: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export declare const postPropsSchema: z.ZodObject<{
    app_bindings: z.ZodOptional<z.ZodArray<z.ZodAny>>;
    attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        fallback: z.ZodOptional<z.ZodString>;
        color: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<typeof PostAttachmentColor>, z.ZodString]>>;
        pretext: z.ZodOptional<z.ZodString>;
        text: z.ZodString;
        author_name: z.ZodOptional<z.ZodString>;
        author_link: z.ZodOptional<z.ZodString>;
        author_icon: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        title_link: z.ZodOptional<z.ZodString>;
        fields: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
            title: z.ZodString;
            value: z.ZodString;
            short: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>>>;
        actions: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [any, any]>>>;
        image_url: z.ZodOptional<z.ZodString>;
        thumb_url: z.ZodOptional<z.ZodString>;
        footer: z.ZodOptional<z.ZodString>;
        footer_icon: z.ZodOptional<z.ZodString>;
        ts: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    }, z.core.$strip>>>;
    from_bot: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"true">, z.ZodLiteral<"false">]>>;
    metadata: z.ZodOptional<z.ZodUnknown>;
    disable_group_highlight: z.ZodOptional<z.ZodBoolean>;
    locationReplyMessage: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"CENTER">, z.ZodString]>>;
    replyMessage: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const postSchema: z.ZodSchema<Post>;
export declare const postMetadataSchema: z.ZodSchema<PostMetadata>;
export declare const postEmbedSchema: z.ZodSchema<PostEmbed>;
export declare const postPreviewMetadataSchema: z.ZodSchema<PostPreviewMetadata>;
export declare const postActionResponsePayloadSchema: z.ZodSchema<PostActionResponsePayload>;
//# sourceMappingURL=posts.zod.d.ts.map