import { z } from "zod";
import { type AppBinding, AppExpandLevel, AppFormFieldTextSubType, AppFormFieldType, AppLocation, AppPermission, AppRequestedLocation } from "./apps";
export declare const appPermissionSchema: z.ZodEnum<typeof AppPermission>;
export declare const appRequestedLocationSchema: z.ZodEnum<typeof AppRequestedLocation>;
export declare const appManifestSchema: z.ZodObject<{
    app_id: z.ZodString;
    version: z.ZodOptional<z.ZodString>;
    homepage_url: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    display_name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    requested_permissions: z.ZodOptional<z.ZodArray<z.ZodEnum<typeof AppPermission>>>;
    requested_locations: z.ZodOptional<z.ZodArray<z.ZodEnum<typeof AppRequestedLocation>>>;
}, z.core.$strip>;
export declare const appExpandLevelSchema: z.ZodEnum<typeof AppExpandLevel>;
export declare const appExpandSchema: z.ZodObject<{
    app: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
    acting_user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
    acting_user_access_token: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
    channel: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
    config: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
    mentioned: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
    parent_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
    post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
    root_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
    team: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
    user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
    locale: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
}, z.core.$strip>;
export declare const appContextSchema: z.ZodObject<{
    app_id: z.ZodString;
    location: z.ZodOptional<z.ZodString>;
    acting_user_id: z.ZodOptional<z.ZodString>;
    user_id: z.ZodOptional<z.ZodString>;
    channel_id: z.ZodOptional<z.ZodString>;
    team_id: z.ZodOptional<z.ZodString>;
    post_id: z.ZodOptional<z.ZodString>;
    root_id: z.ZodOptional<z.ZodString>;
    props: z.ZodOptional<z.ZodAny>;
    user_agent: z.ZodOptional<z.ZodString>;
    track_as_submit: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const appCallMetadataForClientSchema: z.ZodObject<{
    bot_user_id: z.ZodString;
    bot_username: z.ZodString;
}, z.core.$strip>;
export declare const appCallSchema: z.ZodObject<{
    path: z.ZodString;
    expand: z.ZodOptional<z.ZodObject<{
        app: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        acting_user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        acting_user_access_token: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        channel: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        config: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        mentioned: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        parent_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        root_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        team: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        locale: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
    }, z.core.$strip>>;
    state: z.ZodOptional<z.ZodAny>;
}, z.core.$strip>;
export declare const appCallRequestSchema: z.ZodObject<{
    path: z.ZodString;
    expand: z.ZodOptional<z.ZodObject<{
        app: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        acting_user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        acting_user_access_token: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        channel: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        config: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        mentioned: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        parent_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        root_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        team: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        locale: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
    }, z.core.$strip>>;
    state: z.ZodOptional<z.ZodAny>;
    context: z.ZodObject<{
        app_id: z.ZodString;
        location: z.ZodOptional<z.ZodString>;
        acting_user_id: z.ZodOptional<z.ZodString>;
        user_id: z.ZodOptional<z.ZodString>;
        channel_id: z.ZodOptional<z.ZodString>;
        team_id: z.ZodOptional<z.ZodString>;
        post_id: z.ZodOptional<z.ZodString>;
        root_id: z.ZodOptional<z.ZodString>;
        props: z.ZodOptional<z.ZodAny>;
        user_agent: z.ZodOptional<z.ZodString>;
        track_as_submit: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
    values: z.ZodOptional<z.ZodAny>;
    raw_command: z.ZodOptional<z.ZodString>;
    selected_field: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const appLocationSchema: z.ZodEnum<typeof AppLocation>;
export declare const productIdentifierSchema: z.ZodNullable<z.ZodString>;
export declare const productScopeSchema: z.ZodUnion<readonly [z.ZodNullable<z.ZodString>, z.ZodArray<z.ZodNullable<z.ZodString>>]>;
export declare const appFormResponseDataSchema: z.ZodObject<{
    errors: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$strip>;
export declare const appFormFieldTypeSchema: z.ZodEnum<typeof AppFormFieldType>;
export declare const appFormFieldTextSubTypeSchema: z.ZodEnum<typeof AppFormFieldTextSubType>;
export declare const appFormBooleanFieldSchema: z.ZodObject<{
    name: z.ZodString;
    label: z.ZodOptional<z.ZodString>;
    modal_label: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    hint: z.ZodOptional<z.ZodString>;
    value: z.ZodOptional<z.ZodUnknown>;
    is_required: z.ZodOptional<z.ZodBoolean>;
    readonly: z.ZodOptional<z.ZodBoolean>;
    position: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<AppFormFieldType.BOOLEAN>;
}, z.core.$strip>;
export declare const appFormMarkdownFieldSchema: z.ZodObject<{
    name: z.ZodString;
    label: z.ZodOptional<z.ZodString>;
    modal_label: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    hint: z.ZodOptional<z.ZodString>;
    value: z.ZodOptional<z.ZodUnknown>;
    is_required: z.ZodOptional<z.ZodBoolean>;
    readonly: z.ZodOptional<z.ZodBoolean>;
    position: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<AppFormFieldType.MARKDOWN>;
}, z.core.$strip>;
export declare const appFormChannelsFieldSchema: z.ZodObject<{
    name: z.ZodString;
    label: z.ZodOptional<z.ZodString>;
    modal_label: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    hint: z.ZodOptional<z.ZodString>;
    value: z.ZodOptional<z.ZodUnknown>;
    is_required: z.ZodOptional<z.ZodBoolean>;
    readonly: z.ZodOptional<z.ZodBoolean>;
    position: z.ZodOptional<z.ZodNumber>;
    multiselect: z.ZodOptional<z.ZodBoolean>;
    refresh: z.ZodOptional<z.ZodBoolean>;
    type: z.ZodLiteral<AppFormFieldType.CHANNEL>;
}, z.core.$strip>;
export declare const appFormUsersFieldSchema: z.ZodObject<{
    name: z.ZodString;
    label: z.ZodOptional<z.ZodString>;
    modal_label: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    hint: z.ZodOptional<z.ZodString>;
    value: z.ZodOptional<z.ZodUnknown>;
    is_required: z.ZodOptional<z.ZodBoolean>;
    readonly: z.ZodOptional<z.ZodBoolean>;
    position: z.ZodOptional<z.ZodNumber>;
    multiselect: z.ZodOptional<z.ZodBoolean>;
    refresh: z.ZodOptional<z.ZodBoolean>;
    type: z.ZodLiteral<AppFormFieldType.USER>;
}, z.core.$strip>;
export declare const appFormDynamicSelectFieldSchema: z.ZodObject<{
    name: z.ZodString;
    label: z.ZodOptional<z.ZodString>;
    modal_label: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    hint: z.ZodOptional<z.ZodString>;
    value: z.ZodOptional<z.ZodUnknown>;
    is_required: z.ZodOptional<z.ZodBoolean>;
    readonly: z.ZodOptional<z.ZodBoolean>;
    position: z.ZodOptional<z.ZodNumber>;
    multiselect: z.ZodOptional<z.ZodBoolean>;
    lookup: z.ZodObject<{
        path: z.ZodString;
        expand: z.ZodOptional<z.ZodObject<{
            app: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            acting_user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            acting_user_access_token: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            channel: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            config: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            mentioned: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            parent_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            root_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            team: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            locale: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        }, z.core.$strip>>;
        state: z.ZodOptional<z.ZodAny>;
    }, z.core.$strip>;
    refresh: z.ZodOptional<z.ZodBoolean>;
    type: z.ZodLiteral<AppFormFieldType.DYNAMIC_SELECT>;
}, z.core.$strip>;
export declare const appFormValuesSchema: z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodUnion<readonly [z.ZodString, z.ZodAny, z.ZodBoolean]>>>;
export declare const appFormLookupResponseSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodAny>;
}, z.core.$strip>;
export declare const appFormStaticSelectFieldSchema: z.ZodObject<{
    [x: string]: any;
    refresh: z.ZodOptional<z.ZodBoolean>;
    type: z.ZodLiteral<AppFormFieldType.STATIC_SELECT>;
}, z.core.$strip>;
export declare const appFormTextFieldSchema: z.ZodObject<{
    [x: string]: any;
    type: z.ZodLiteral<AppFormFieldType.TEXT>;
}, z.core.$strip>;
export declare const appFormFieldSchema: z.ZodUnion<readonly [z.ZodObject<{
    name: z.ZodString;
    label: z.ZodOptional<z.ZodString>;
    modal_label: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    hint: z.ZodOptional<z.ZodString>;
    value: z.ZodOptional<z.ZodUnknown>;
    is_required: z.ZodOptional<z.ZodBoolean>;
    readonly: z.ZodOptional<z.ZodBoolean>;
    position: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<AppFormFieldType.BOOLEAN>;
}, z.core.$strip>, z.ZodObject<{
    name: z.ZodString;
    label: z.ZodOptional<z.ZodString>;
    modal_label: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    hint: z.ZodOptional<z.ZodString>;
    value: z.ZodOptional<z.ZodUnknown>;
    is_required: z.ZodOptional<z.ZodBoolean>;
    readonly: z.ZodOptional<z.ZodBoolean>;
    position: z.ZodOptional<z.ZodNumber>;
    multiselect: z.ZodOptional<z.ZodBoolean>;
    refresh: z.ZodOptional<z.ZodBoolean>;
    type: z.ZodLiteral<AppFormFieldType.CHANNEL>;
}, z.core.$strip>, z.ZodObject<{
    name: z.ZodString;
    label: z.ZodOptional<z.ZodString>;
    modal_label: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    hint: z.ZodOptional<z.ZodString>;
    value: z.ZodOptional<z.ZodUnknown>;
    is_required: z.ZodOptional<z.ZodBoolean>;
    readonly: z.ZodOptional<z.ZodBoolean>;
    position: z.ZodOptional<z.ZodNumber>;
    multiselect: z.ZodOptional<z.ZodBoolean>;
    lookup: z.ZodObject<{
        path: z.ZodString;
        expand: z.ZodOptional<z.ZodObject<{
            app: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            acting_user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            acting_user_access_token: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            channel: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            config: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            mentioned: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            parent_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            root_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            team: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            locale: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        }, z.core.$strip>>;
        state: z.ZodOptional<z.ZodAny>;
    }, z.core.$strip>;
    refresh: z.ZodOptional<z.ZodBoolean>;
    type: z.ZodLiteral<AppFormFieldType.DYNAMIC_SELECT>;
}, z.core.$strip>, z.ZodObject<{
    name: z.ZodString;
    label: z.ZodOptional<z.ZodString>;
    modal_label: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    hint: z.ZodOptional<z.ZodString>;
    value: z.ZodOptional<z.ZodUnknown>;
    is_required: z.ZodOptional<z.ZodBoolean>;
    readonly: z.ZodOptional<z.ZodBoolean>;
    position: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<AppFormFieldType.MARKDOWN>;
}, z.core.$strip>, z.ZodObject<{
    [x: string]: any;
    refresh: z.ZodOptional<z.ZodBoolean>;
    type: z.ZodLiteral<AppFormFieldType.STATIC_SELECT>;
}, z.core.$strip>, z.ZodObject<{
    name: z.ZodString;
    label: z.ZodOptional<z.ZodString>;
    modal_label: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    hint: z.ZodOptional<z.ZodString>;
    value: z.ZodOptional<z.ZodUnknown>;
    is_required: z.ZodOptional<z.ZodBoolean>;
    readonly: z.ZodOptional<z.ZodBoolean>;
    position: z.ZodOptional<z.ZodNumber>;
    multiselect: z.ZodOptional<z.ZodBoolean>;
    refresh: z.ZodOptional<z.ZodBoolean>;
    type: z.ZodLiteral<AppFormFieldType.USER>;
}, z.core.$strip>, z.ZodObject<{
    [x: string]: any;
    type: z.ZodLiteral<AppFormFieldType.TEXT>;
}, z.core.$strip>]>;
export declare const appFormSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    header: z.ZodOptional<z.ZodString>;
    footer: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    submit_buttons: z.ZodOptional<z.ZodString>;
    cancel_button: z.ZodOptional<z.ZodBoolean>;
    submit_on_cancel: z.ZodOptional<z.ZodBoolean>;
    fields: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        modal_label: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        hint: z.ZodOptional<z.ZodString>;
        value: z.ZodOptional<z.ZodUnknown>;
        is_required: z.ZodOptional<z.ZodBoolean>;
        readonly: z.ZodOptional<z.ZodBoolean>;
        position: z.ZodOptional<z.ZodNumber>;
        type: z.ZodLiteral<AppFormFieldType.BOOLEAN>;
    }, z.core.$strip>, z.ZodObject<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        modal_label: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        hint: z.ZodOptional<z.ZodString>;
        value: z.ZodOptional<z.ZodUnknown>;
        is_required: z.ZodOptional<z.ZodBoolean>;
        readonly: z.ZodOptional<z.ZodBoolean>;
        position: z.ZodOptional<z.ZodNumber>;
        multiselect: z.ZodOptional<z.ZodBoolean>;
        refresh: z.ZodOptional<z.ZodBoolean>;
        type: z.ZodLiteral<AppFormFieldType.CHANNEL>;
    }, z.core.$strip>, z.ZodObject<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        modal_label: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        hint: z.ZodOptional<z.ZodString>;
        value: z.ZodOptional<z.ZodUnknown>;
        is_required: z.ZodOptional<z.ZodBoolean>;
        readonly: z.ZodOptional<z.ZodBoolean>;
        position: z.ZodOptional<z.ZodNumber>;
        multiselect: z.ZodOptional<z.ZodBoolean>;
        lookup: z.ZodObject<{
            path: z.ZodString;
            expand: z.ZodOptional<z.ZodObject<{
                app: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                acting_user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                acting_user_access_token: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                channel: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                config: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                mentioned: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                parent_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                root_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                team: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                locale: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            }, z.core.$strip>>;
            state: z.ZodOptional<z.ZodAny>;
        }, z.core.$strip>;
        refresh: z.ZodOptional<z.ZodBoolean>;
        type: z.ZodLiteral<AppFormFieldType.DYNAMIC_SELECT>;
    }, z.core.$strip>, z.ZodObject<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        modal_label: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        hint: z.ZodOptional<z.ZodString>;
        value: z.ZodOptional<z.ZodUnknown>;
        is_required: z.ZodOptional<z.ZodBoolean>;
        readonly: z.ZodOptional<z.ZodBoolean>;
        position: z.ZodOptional<z.ZodNumber>;
        type: z.ZodLiteral<AppFormFieldType.MARKDOWN>;
    }, z.core.$strip>, z.ZodObject<{
        [x: string]: any;
        refresh: z.ZodOptional<z.ZodBoolean>;
        type: z.ZodLiteral<AppFormFieldType.STATIC_SELECT>;
    }, z.core.$strip>, z.ZodObject<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        modal_label: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        hint: z.ZodOptional<z.ZodString>;
        value: z.ZodOptional<z.ZodUnknown>;
        is_required: z.ZodOptional<z.ZodBoolean>;
        readonly: z.ZodOptional<z.ZodBoolean>;
        position: z.ZodOptional<z.ZodNumber>;
        multiselect: z.ZodOptional<z.ZodBoolean>;
        refresh: z.ZodOptional<z.ZodBoolean>;
        type: z.ZodLiteral<AppFormFieldType.USER>;
    }, z.core.$strip>, z.ZodObject<{
        [x: string]: any;
        type: z.ZodLiteral<AppFormFieldType.TEXT>;
    }, z.core.$strip>]>>>;
    source: z.ZodOptional<z.ZodObject<{
        path: z.ZodString;
        expand: z.ZodOptional<z.ZodObject<{
            app: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            acting_user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            acting_user_access_token: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            channel: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            config: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            mentioned: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            parent_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            root_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            team: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            locale: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        }, z.core.$strip>>;
        state: z.ZodOptional<z.ZodAny>;
    }, z.core.$strip>>;
    submit: z.ZodOptional<z.ZodObject<{
        path: z.ZodString;
        expand: z.ZodOptional<z.ZodObject<{
            app: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            acting_user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            acting_user_access_token: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            channel: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            config: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            mentioned: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            parent_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            root_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            team: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            locale: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        }, z.core.$strip>>;
        state: z.ZodOptional<z.ZodAny>;
    }, z.core.$strip>>;
    depends_on: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const appBindingSchema: z.ZodSchema<AppBinding>;
export declare const appCallResponseSchema: z.ZodObject<{
    type: z.ZodString;
    text: z.ZodOptional<z.ZodString>;
    data: z.ZodOptional<z.ZodAny>;
    navigate_to_url: z.ZodOptional<z.ZodString>;
    use_external_browser: z.ZodOptional<z.ZodBoolean>;
    call: z.ZodOptional<z.ZodObject<{
        path: z.ZodString;
        expand: z.ZodOptional<z.ZodObject<{
            app: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            acting_user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            acting_user_access_token: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            channel: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            config: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            mentioned: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            parent_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            root_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            team: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            locale: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
        }, z.core.$strip>>;
        state: z.ZodOptional<z.ZodAny>;
    }, z.core.$strip>>;
    form: z.ZodOptional<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        header: z.ZodOptional<z.ZodString>;
        footer: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        submit_buttons: z.ZodOptional<z.ZodString>;
        cancel_button: z.ZodOptional<z.ZodBoolean>;
        submit_on_cancel: z.ZodOptional<z.ZodBoolean>;
        fields: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            modal_label: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            hint: z.ZodOptional<z.ZodString>;
            value: z.ZodOptional<z.ZodUnknown>;
            is_required: z.ZodOptional<z.ZodBoolean>;
            readonly: z.ZodOptional<z.ZodBoolean>;
            position: z.ZodOptional<z.ZodNumber>;
            type: z.ZodLiteral<AppFormFieldType.BOOLEAN>;
        }, z.core.$strip>, z.ZodObject<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            modal_label: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            hint: z.ZodOptional<z.ZodString>;
            value: z.ZodOptional<z.ZodUnknown>;
            is_required: z.ZodOptional<z.ZodBoolean>;
            readonly: z.ZodOptional<z.ZodBoolean>;
            position: z.ZodOptional<z.ZodNumber>;
            multiselect: z.ZodOptional<z.ZodBoolean>;
            refresh: z.ZodOptional<z.ZodBoolean>;
            type: z.ZodLiteral<AppFormFieldType.CHANNEL>;
        }, z.core.$strip>, z.ZodObject<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            modal_label: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            hint: z.ZodOptional<z.ZodString>;
            value: z.ZodOptional<z.ZodUnknown>;
            is_required: z.ZodOptional<z.ZodBoolean>;
            readonly: z.ZodOptional<z.ZodBoolean>;
            position: z.ZodOptional<z.ZodNumber>;
            multiselect: z.ZodOptional<z.ZodBoolean>;
            lookup: z.ZodObject<{
                path: z.ZodString;
                expand: z.ZodOptional<z.ZodObject<{
                    app: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                    acting_user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                    acting_user_access_token: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                    channel: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                    config: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                    mentioned: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                    parent_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                    post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                    root_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                    team: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                    user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                    locale: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                }, z.core.$strip>>;
                state: z.ZodOptional<z.ZodAny>;
            }, z.core.$strip>;
            refresh: z.ZodOptional<z.ZodBoolean>;
            type: z.ZodLiteral<AppFormFieldType.DYNAMIC_SELECT>;
        }, z.core.$strip>, z.ZodObject<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            modal_label: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            hint: z.ZodOptional<z.ZodString>;
            value: z.ZodOptional<z.ZodUnknown>;
            is_required: z.ZodOptional<z.ZodBoolean>;
            readonly: z.ZodOptional<z.ZodBoolean>;
            position: z.ZodOptional<z.ZodNumber>;
            type: z.ZodLiteral<AppFormFieldType.MARKDOWN>;
        }, z.core.$strip>, z.ZodObject<{
            [x: string]: any;
            refresh: z.ZodOptional<z.ZodBoolean>;
            type: z.ZodLiteral<AppFormFieldType.STATIC_SELECT>;
        }, z.core.$strip>, z.ZodObject<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            modal_label: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            hint: z.ZodOptional<z.ZodString>;
            value: z.ZodOptional<z.ZodUnknown>;
            is_required: z.ZodOptional<z.ZodBoolean>;
            readonly: z.ZodOptional<z.ZodBoolean>;
            position: z.ZodOptional<z.ZodNumber>;
            multiselect: z.ZodOptional<z.ZodBoolean>;
            refresh: z.ZodOptional<z.ZodBoolean>;
            type: z.ZodLiteral<AppFormFieldType.USER>;
        }, z.core.$strip>, z.ZodObject<{
            [x: string]: any;
            type: z.ZodLiteral<AppFormFieldType.TEXT>;
        }, z.core.$strip>]>>>;
        source: z.ZodOptional<z.ZodObject<{
            path: z.ZodString;
            expand: z.ZodOptional<z.ZodObject<{
                app: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                acting_user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                acting_user_access_token: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                channel: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                config: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                mentioned: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                parent_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                root_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                team: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                locale: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            }, z.core.$strip>>;
            state: z.ZodOptional<z.ZodAny>;
        }, z.core.$strip>>;
        submit: z.ZodOptional<z.ZodObject<{
            path: z.ZodString;
            expand: z.ZodOptional<z.ZodObject<{
                app: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                acting_user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                acting_user_access_token: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                channel: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                config: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                mentioned: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                parent_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                root_post: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                team: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                user: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
                locale: z.ZodOptional<z.ZodEnum<typeof AppExpandLevel>>;
            }, z.core.$strip>>;
            state: z.ZodOptional<z.ZodAny>;
        }, z.core.$strip>>;
        depends_on: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    app_metadata: z.ZodOptional<z.ZodObject<{
        bot_user_id: z.ZodString;
        bot_username: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
//# sourceMappingURL=apps.zod.d.ts.map