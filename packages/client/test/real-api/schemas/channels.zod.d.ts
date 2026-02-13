import { z } from "zod";
import { ChannelBookmarkType, ChannelCategorySorting, ChannelCategoryType, ChannelNotify, ChannelNotifyDesktopSound, ChannelType } from "./channels";
export declare const channelTypeSchema: z.ZodEnum<typeof ChannelType>;
export declare const channelNotifySchema: z.ZodEnum<typeof ChannelNotify>;
export declare const channelNotifyDesktopSoundSchema: z.ZodEnum<typeof ChannelNotifyDesktopSound>;
export declare const channelSchema: z.ZodObject<{
    id: z.ZodString;
    create_at: z.ZodNumber;
    update_at: z.ZodNumber;
    delete_at: z.ZodNumber;
    team_id: z.ZodString;
    type: z.ZodEnum<typeof ChannelType>;
    display_name: z.ZodString;
    name: z.ZodString;
    header: z.ZodString;
    purpose: z.ZodString;
    last_post_at: z.ZodNumber;
    total_msg_count: z.ZodNumber;
    extra_update_at: z.ZodNumber;
    creator_id: z.ZodString;
    scheme_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    props: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    group_constrained: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    shared: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    total_msg_count_root: z.ZodNumber;
    policy_id: z.ZodNullable<z.ZodString>;
    last_root_post_at: z.ZodNumber;
}, z.core.$strip>;
export declare const channelCategoryTypeSchema: z.ZodEnum<typeof ChannelCategoryType>;
export declare const channelCategorySortingSchema: z.ZodEnum<typeof ChannelCategorySorting>;
export declare const channelCategorySchema: z.ZodObject<{
    id: z.ZodString;
    user_id: z.ZodString;
    team_id: z.ZodString;
    type: z.ZodEnum<typeof ChannelCategoryType>;
    display_name: z.ZodString;
    sorting: z.ZodEnum<typeof ChannelCategorySorting>;
    channel_ids: z.ZodArray<z.ZodString>;
    muted: z.ZodBoolean;
    collapsed: z.ZodBoolean;
}, z.core.$strip>;
export declare const orderedChannelCategoriesSchema: z.ZodObject<{
    categories: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        user_id: z.ZodString;
        team_id: z.ZodString;
        type: z.ZodEnum<typeof ChannelCategoryType>;
        display_name: z.ZodString;
        sorting: z.ZodEnum<typeof ChannelCategorySorting>;
        channel_ids: z.ZodArray<z.ZodString>;
        muted: z.ZodBoolean;
        collapsed: z.ZodBoolean;
    }, z.core.$strip>>;
    order: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const channelBookmarkTypeSchema: z.ZodEnum<typeof ChannelBookmarkType>;
export declare const channelBookmarkCreateLinkSchema: z.ZodObject<{
    type: z.ZodLiteral<ChannelBookmarkType.LINK>;
    link_url: z.ZodString;
}, z.core.$strip>;
export declare const channelBookmarkCreateFileSchema: z.ZodObject<{
    type: z.ZodLiteral<ChannelBookmarkType.FILE>;
    file_id: z.ZodString;
}, z.core.$strip>;
export declare const channelBookmarkCreateBaseSchema: z.ZodObject<{
    display_name: z.ZodString;
    image_url: z.ZodOptional<z.ZodString>;
    emoji: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const channelBookmarkCreateSchema: z.ZodIntersection<z.ZodObject<{
    display_name: z.ZodString;
    image_url: z.ZodOptional<z.ZodString>;
    emoji: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodLiteral<ChannelBookmarkType.LINK>;
    link_url: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<ChannelBookmarkType.FILE>;
    file_id: z.ZodString;
}, z.core.$strip>]>>;
export declare const channelBookmarkPatchSchema: z.ZodObject<{
    file_id: z.ZodOptional<z.ZodString>;
    display_name: z.ZodOptional<z.ZodString>;
    sort_order: z.ZodOptional<z.ZodNumber>;
    link_url: z.ZodOptional<z.ZodString>;
    image_url: z.ZodOptional<z.ZodString>;
    emoji: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const channelMessageCountSchema: z.ZodObject<{
    total: z.ZodNumber;
    root: z.ZodNumber;
}, z.core.$strip>;
export declare const channelModerationSchema: z.ZodObject<{
    name: z.ZodString;
    roles: z.ZodObject<{
        guests: z.ZodOptional<z.ZodObject<{
            value: z.ZodBoolean;
            enabled: z.ZodBoolean;
        }, z.core.$strip>>;
        members: z.ZodObject<{
            value: z.ZodBoolean;
            enabled: z.ZodBoolean;
        }, z.core.$strip>;
        admins: z.ZodObject<{
            value: z.ZodBoolean;
            enabled: z.ZodBoolean;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const channelModerationPatchSchema: z.ZodObject<{
    name: z.ZodString;
    roles: z.ZodObject<{
        guests: z.ZodOptional<z.ZodBoolean>;
        members: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const channelWithTeamDataSchema: z.ZodObject<{
    id: z.ZodString;
    create_at: z.ZodNumber;
    update_at: z.ZodNumber;
    delete_at: z.ZodNumber;
    team_id: z.ZodString;
    type: z.ZodEnum<typeof ChannelType>;
    display_name: z.ZodString;
    name: z.ZodString;
    header: z.ZodString;
    purpose: z.ZodString;
    last_post_at: z.ZodNumber;
    total_msg_count: z.ZodNumber;
    extra_update_at: z.ZodNumber;
    creator_id: z.ZodString;
    scheme_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    props: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    group_constrained: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    shared: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    total_msg_count_root: z.ZodNumber;
    policy_id: z.ZodNullable<z.ZodString>;
    last_root_post_at: z.ZodNumber;
    team_display_name: z.ZodString;
    team_name: z.ZodString;
    team_update_at: z.ZodNumber;
}, z.core.$strip>;
export declare const channelsWithTotalCountSchema: z.ZodObject<{
    channels: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        create_at: z.ZodNumber;
        update_at: z.ZodNumber;
        delete_at: z.ZodNumber;
        team_id: z.ZodString;
        type: z.ZodEnum<typeof ChannelType>;
        display_name: z.ZodString;
        name: z.ZodString;
        header: z.ZodString;
        purpose: z.ZodString;
        last_post_at: z.ZodNumber;
        total_msg_count: z.ZodNumber;
        extra_update_at: z.ZodNumber;
        creator_id: z.ZodString;
        scheme_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        props: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        group_constrained: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
        shared: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
        total_msg_count_root: z.ZodNumber;
        policy_id: z.ZodNullable<z.ZodString>;
        last_root_post_at: z.ZodNumber;
        team_display_name: z.ZodString;
        team_name: z.ZodString;
        team_update_at: z.ZodNumber;
    }, z.core.$strip>>;
    total_count: z.ZodNumber;
}, z.core.$strip>;
export declare const channelMemberCountByGroupSchema: z.ZodObject<{
    group_id: z.ZodString;
    channel_member_count: z.ZodNumber;
    channel_member_timezones_count: z.ZodNumber;
}, z.core.$strip>;
export declare const channelMemberCountsByGroupSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    group_id: z.ZodString;
    channel_member_count: z.ZodNumber;
    channel_member_timezones_count: z.ZodNumber;
}, z.core.$strip>>;
export declare const channelViewResponseSchema: z.ZodObject<{
    status: z.ZodString;
    last_viewed_at_times: z.ZodRecord<z.ZodString, z.ZodNumber>;
}, z.core.$strip>;
export declare const channelStatsSchema: z.ZodObject<{
    channel_id: z.ZodString;
    member_count: z.ZodNumber;
    guest_count: z.ZodNumber;
    pinnedpost_count: z.ZodNumber;
    files_count: z.ZodNumber;
}, z.core.$strip>;
export declare const channelNotifyPropsResponseSchema: z.ZodObject<{
    desktop_threads: z.ZodEnum<typeof ChannelNotify>;
    desktop: z.ZodEnum<typeof ChannelNotify>;
    desktop_sound: z.ZodUnion<readonly [z.ZodLiteral<"on">, z.ZodLiteral<"off">]>;
    desktop_notification_sound: z.ZodOptional<z.ZodEnum<typeof ChannelNotifyDesktopSound>>;
    email: z.ZodEnum<typeof ChannelNotify>;
    mark_unread: z.ZodEnum<typeof ChannelNotify>;
    push: z.ZodEnum<typeof ChannelNotify>;
    push_threads: z.ZodEnum<typeof ChannelNotify>;
    ignore_channel_mentions: z.ZodUnion<readonly [z.ZodLiteral<"default">, z.ZodLiteral<"off">, z.ZodLiteral<"on">]>;
    channel_auto_follow_threads: z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"on">]>;
}, z.core.$strip>;
export declare const channelUnreadResponseSchema: z.ZodObject<{
    channel_id: z.ZodString;
    user_id: z.ZodString;
    team_id: z.ZodString;
    msg_count: z.ZodNumber;
    msg_count_root: z.ZodNumber;
    mention_count: z.ZodNumber;
    urgent_mention_count: z.ZodNumber;
    mention_count_root: z.ZodNumber;
    last_viewed_at: z.ZodNumber;
    deltaMsgs: z.ZodNumber;
}, z.core.$strip>;
export declare const serverChannelSchema: z.ZodObject<{
    id: z.ZodString;
    create_at: z.ZodNumber;
    update_at: z.ZodNumber;
    delete_at: z.ZodNumber;
    team_id: z.ZodString;
    type: z.ZodEnum<typeof ChannelType>;
    display_name: z.ZodString;
    name: z.ZodString;
    header: z.ZodString;
    purpose: z.ZodString;
    last_post_at: z.ZodNumber;
    extra_update_at: z.ZodNumber;
    creator_id: z.ZodString;
    scheme_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    props: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    group_constrained: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    shared: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    policy_id: z.ZodNullable<z.ZodString>;
    last_root_post_at: z.ZodNumber;
    total_msg_count: z.ZodNumber;
    total_msg_count_root: z.ZodNumber;
}, z.core.$strip>;
export declare const channelBookmarkSchema: z.ZodObject<{
    id: z.ZodString;
    create_at: z.ZodNumber;
    update_at: z.ZodNumber;
    delete_at: z.ZodNumber;
    channel_id: z.ZodString;
    owner_id: z.ZodString;
    file_id: z.ZodOptional<z.ZodString>;
    file: z.ZodOptional<z.ZodAny>;
    display_name: z.ZodString;
    sort_order: z.ZodNumber;
    link_url: z.ZodOptional<z.ZodString>;
    image_url: z.ZodOptional<z.ZodString>;
    emoji: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<typeof ChannelBookmarkType>;
    original_id: z.ZodOptional<z.ZodString>;
    parent_id: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const channelBookmarkWithFileInfoSchema: z.ZodObject<{
    id: z.ZodString;
    create_at: z.ZodNumber;
    update_at: z.ZodNumber;
    delete_at: z.ZodNumber;
    channel_id: z.ZodString;
    owner_id: z.ZodString;
    file_id: z.ZodOptional<z.ZodString>;
    display_name: z.ZodString;
    sort_order: z.ZodNumber;
    link_url: z.ZodOptional<z.ZodString>;
    image_url: z.ZodOptional<z.ZodString>;
    emoji: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<typeof ChannelBookmarkType>;
    original_id: z.ZodOptional<z.ZodString>;
    parent_id: z.ZodOptional<z.ZodString>;
    file: z.ZodOptional<z.ZodAny>;
}, z.core.$strip>;
export declare const channelMembershipSchema: z.ZodObject<{
    channel_id: z.ZodString;
    user_id: z.ZodString;
    roles: z.ZodString;
    last_viewed_at: z.ZodNumber;
    msg_count: z.ZodNumber;
    msg_count_root: z.ZodNumber;
    mention_count: z.ZodNumber;
    mention_count_root: z.ZodNumber;
    urgent_mention_count: z.ZodNumber;
    notify_props: z.ZodObject<{
        desktop_threads: z.ZodOptional<z.ZodEnum<typeof ChannelNotify>>;
        desktop: z.ZodOptional<z.ZodEnum<typeof ChannelNotify>>;
        desktop_sound: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"on">, z.ZodLiteral<"off">]>>;
        desktop_notification_sound: z.ZodOptional<z.ZodOptional<z.ZodEnum<typeof ChannelNotifyDesktopSound>>>;
        email: z.ZodOptional<z.ZodEnum<typeof ChannelNotify>>;
        mark_unread: z.ZodOptional<z.ZodEnum<typeof ChannelNotify>>;
        push: z.ZodOptional<z.ZodEnum<typeof ChannelNotify>>;
        push_threads: z.ZodOptional<z.ZodEnum<typeof ChannelNotify>>;
        ignore_channel_mentions: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"default">, z.ZodLiteral<"off">, z.ZodLiteral<"on">]>>;
        channel_auto_follow_threads: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"on">]>>;
    }, z.core.$strip>;
    last_update_at: z.ZodNumber;
    scheme_user: z.ZodBoolean;
    scheme_admin: z.ZodBoolean;
    post_root_id: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=channels.zod.d.ts.map