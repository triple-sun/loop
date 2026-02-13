import { z } from "zod";
export declare const auditSchema: z.ZodObject<{
    id: z.ZodString;
    create_at: z.ZodNumber;
    user_id: z.ZodString;
    action: z.ZodString;
    extra_info: z.ZodString;
    ip_address: z.ZodString;
    session_id: z.ZodString;
}, z.core.$strip>;
export declare const autocompleteSuggestionSchema: z.ZodObject<{
    Complete: z.ZodString;
    Suggestion: z.ZodString;
    Hint: z.ZodString;
    Description: z.ZodString;
    IconData: z.ZodString;
}, z.core.$strip>;
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
export declare const completeOnboardingRequestSchema: z.ZodObject<{
    organization: z.ZodString;
    install_plugins: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const complianceReportSchema: z.ZodObject<{
    id: z.ZodString;
    create_at: z.ZodNumber;
    user_id: z.ZodString;
    status: z.ZodString;
    count: z.ZodNumber;
    desc: z.ZodString;
    type: z.ZodString;
    start_at: z.ZodNumber;
    end_at: z.ZodNumber;
    keywords: z.ZodString;
    emails: z.ZodString;
}, z.core.$strip>;
export declare const dataRetentionCustomPolicySchema: z.ZodObject<{
    id: z.ZodString;
    display_name: z.ZodString;
    post_duration: z.ZodNumber;
    team_count: z.ZodNumber;
    channel_count: z.ZodNumber;
}, z.core.$strip>;
export declare const dataRetentionCustomPoliciesSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    id: z.ZodString;
    display_name: z.ZodString;
    post_duration: z.ZodNumber;
    team_count: z.ZodNumber;
    channel_count: z.ZodNumber;
}, z.core.$strip>>;
export declare const mfaSecretSchema: z.ZodObject<{
    secret: z.ZodString;
    qr_code: z.ZodString;
}, z.core.$strip>;
export declare const preferenceSchema: z.ZodObject<{
    user_id: z.ZodString;
    category: z.ZodString;
    name: z.ZodString;
    value: z.ZodString;
}, z.core.$strip>;
export declare const productNoticeSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
    actionText: z.ZodOptional<z.ZodString>;
    action: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"url">, z.ZodLiteral<"">]>>;
    actionParam: z.ZodOptional<z.ZodString>;
    sysAdminOnly: z.ZodBoolean;
    teamAdminOnly: z.ZodBoolean;
}, z.core.$strip>;
export declare const reactionSchema: z.ZodObject<{
    user_id: z.ZodString;
    post_id: z.ZodString;
    emoji_name: z.ZodString;
    create_at: z.ZodNumber;
}, z.core.$strip>;
export declare const samlCertificateStatusSchema: z.ZodObject<{
    idp_certificate_file: z.ZodString;
    private_key_file: z.ZodString;
    public_certificate_file: z.ZodString;
}, z.core.$strip>;
export declare const samlMetadataResponseSchema: z.ZodObject<{
    idp_descriptor_url: z.ZodString;
    idp_url: z.ZodString;
    idp_public_certificate: z.ZodString;
}, z.core.$strip>;
export declare const serverLimitsSchema: z.ZodObject<{
    activeUserCount: z.ZodNumber;
    maxUsersLimit: z.ZodNumber;
}, z.core.$strip>;
export declare const schemeSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    display_name: z.ZodString;
    create_at: z.ZodNumber;
    update_at: z.ZodNumber;
    delete_at: z.ZodNumber;
    scope: z.ZodUnion<readonly [z.ZodLiteral<"team">, z.ZodLiteral<"channel">]>;
    default_team_admin_role: z.ZodString;
    default_team_user_role: z.ZodString;
    default_team_guest_role: z.ZodString;
    default_channel_admin_role: z.ZodString;
    default_channel_user_role: z.ZodString;
    default_channel_guest_role: z.ZodString;
    default_playbook_admin_role: z.ZodString;
    default_playbook_member_role: z.ZodString;
    default_run_member_role: z.ZodString;
}, z.core.$strip>;
export declare const searchSchema: z.ZodObject<{
    terms: z.ZodString;
    isOrSearch: z.ZodBoolean;
}, z.core.$strip>;
export declare const searchParameterSchema: z.ZodObject<{
    terms: z.ZodString;
    is_or_search: z.ZodBoolean;
    time_zone_offset: z.ZodOptional<z.ZodNumber>;
    page: z.ZodNumber;
    per_page: z.ZodNumber;
    include_deleted_channels: z.ZodBoolean;
}, z.core.$strip>;
export declare const termsOfServiceSchema: z.ZodObject<{
    id: z.ZodString;
    create_at: z.ZodNumber;
    user_id: z.ZodString;
    text: z.ZodString;
}, z.core.$strip>;
export declare const typingSchema: z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodNumber>>;
export declare const autocompleteUserSchema: z.ZodObject<{
    users: z.ZodArray<z.ZodAny>;
    out_of_channel: z.ZodOptional<z.ZodArray<z.ZodAny>>;
}, z.core.$strip>;
export declare const draftSchema: z.ZodObject<{
    create_at: z.ZodNumber;
    update_at: z.ZodNumber;
    delete_at: z.ZodNumber;
    user_id: z.ZodString;
    channel_id: z.ZodString;
    root_id: z.ZodString;
    message: z.ZodString;
    props: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    file_ids: z.ZodOptional<z.ZodArray<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodAny>;
    priority: z.ZodOptional<z.ZodAny>;
}, z.core.$strip>;
//# sourceMappingURL=general.zod.d.ts.map