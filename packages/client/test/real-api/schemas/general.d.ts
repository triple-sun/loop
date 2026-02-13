import type { PostMetadata, PostPriorityMetadata } from "./posts";
import type { UserProfile } from "./users";
export interface Audit {
    id: string;
    create_at: number;
    user_id: string;
    action: string;
    extra_info: string;
    ip_address: string;
    session_id: string;
}
export interface AutocompleteUser {
    users: UserProfile[];
    out_of_channel?: UserProfile[];
}
export interface AutocompleteSuggestion {
    Complete: string;
    Suggestion: string;
    Hint: string;
    Description: string;
    IconData: string;
}
export interface Bot {
    user_id: string;
    username: string;
    display_name?: string;
    description?: string;
    owner_id: string;
    create_at: number;
    update_at: number;
    delete_at: number;
}
export interface CompleteOnboardingRequest {
    organization: string;
    install_plugins: string[];
}
export type ComplianceReport = {
    id: string;
    create_at: number;
    user_id: string;
    status: string;
    count: number;
    desc: string;
    type: string;
    start_at: number;
    end_at: number;
    keywords: string;
    emails: string;
};
export interface DataRetentionCustomPolicy {
    id: string;
    display_name: string;
    post_duration: number;
    team_count: number;
    channel_count: number;
}
export interface DataRetentionCustomPolicies {
    [policyId: string]: DataRetentionCustomPolicy;
}
export interface Draft {
    create_at: number;
    update_at: number;
    delete_at: number;
    user_id: string;
    channel_id: string;
    root_id: string;
    message: string;
    props: Record<string, unknown>;
    file_ids?: string[];
    metadata?: PostMetadata;
    priority?: PostPriorityMetadata;
}
export interface MFASecret {
    secret: string;
    qr_code: string;
}
export interface Preference {
    user_id: string;
    category: string;
    name: string;
    value: string;
}
export interface ProductNotice {
    /** Unique identifier for this notice. Can be a running number. Used for storing 'viewed' state on the server. */
    id: string;
    /** Notice title. Use {{Mattermost}} instead of plain text to support white-labeling. Text supports Markdown. */
    title: string;
    /** Notice content. Use {{Mattermost}} instead of plain text to support white-labeling. Text supports Markdown. */
    description: string;
    image?: string;
    /** Optional override for the action button text (defaults to OK) */
    actionText?: string;
    /** Optional action to perform on action button click. (defaults to closing the notice) */
    action?: "url" | "";
    /** Optional action parameter.
     * Example: {"action": "url", actionParam: "/console/some-page"}
     */
    actionParam?: string;
    sysAdminOnly: boolean;
    teamAdminOnly: boolean;
}
export interface Reaction {
    user_id: string;
    post_id: string;
    emoji_name: string;
    create_at: number;
}
export interface SamlCertificateStatus {
    idp_certificate_file: string;
    private_key_file: string;
    public_certificate_file: string;
}
export interface SamlMetadataResponse {
    idp_descriptor_url: string;
    idp_url: string;
    idp_public_certificate: string;
}
export interface ServerLimits {
    activeUserCount: number;
    maxUsersLimit: number;
}
export interface Scheme {
    id: string;
    name: string;
    description: string;
    display_name: string;
    create_at: number;
    update_at: number;
    delete_at: number;
    scope: "team" | "channel";
    default_team_admin_role: string;
    default_team_user_role: string;
    default_team_guest_role: string;
    default_channel_admin_role: string;
    default_channel_user_role: string;
    default_channel_guest_role: string;
    default_playbook_admin_role: string;
    default_playbook_member_role: string;
    default_run_member_role: string;
}
export interface Search {
    terms: string;
    isOrSearch: boolean;
}
export interface SearchParameter {
    terms: string;
    is_or_search: boolean;
    time_zone_offset?: number;
    page: number;
    per_page: number;
    include_deleted_channels: boolean;
}
export type TermsOfService = {
    id: string;
    create_at: number;
    user_id: string;
    text: string;
};
export interface Typing {
    [x: string]: {
        [x: string]: number;
    };
}
//# sourceMappingURL=general.d.ts.map