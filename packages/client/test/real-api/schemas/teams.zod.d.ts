import { z } from "zod";
import { TeamType } from "./teams";
export declare const teamTypeSchema: z.ZodEnum<typeof TeamType>;
export declare const teamsUsageResponseSchema: z.ZodObject<{
    active: z.ZodNumber;
    cloud_archived: z.ZodNumber;
}, z.core.$strip>;
export declare const teamUnreadSchema: z.ZodObject<{
    team_id: z.ZodString;
    mention_count: z.ZodNumber;
    mention_count_root: z.ZodNumber;
    msg_count: z.ZodNumber;
    msg_count_root: z.ZodNumber;
    thread_count: z.ZodOptional<z.ZodNumber>;
    thread_mention_count: z.ZodOptional<z.ZodNumber>;
    thread_urgent_mention_count: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const teamMembershipSchema: z.ZodObject<{
    team_id: z.ZodString;
    mention_count: z.ZodNumber;
    mention_count_root: z.ZodNumber;
    msg_count: z.ZodNumber;
    msg_count_root: z.ZodNumber;
    thread_count: z.ZodOptional<z.ZodNumber>;
    thread_mention_count: z.ZodOptional<z.ZodNumber>;
    thread_urgent_mention_count: z.ZodOptional<z.ZodNumber>;
    user_id: z.ZodString;
    roles: z.ZodString;
    delete_at: z.ZodNumber;
    scheme_admin: z.ZodBoolean;
    scheme_guest: z.ZodBoolean;
    scheme_user: z.ZodBoolean;
}, z.core.$strip>;
export declare const teamSchema: z.ZodObject<{
    id: z.ZodString;
    create_at: z.ZodNumber;
    update_at: z.ZodNumber;
    delete_at: z.ZodNumber;
    display_name: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    email: z.ZodString;
    type: z.ZodEnum<typeof TeamType>;
    company_name: z.ZodString;
    allowed_domains: z.ZodString;
    invite_id: z.ZodString;
    allow_open_invite: z.ZodBoolean;
    scheme_id: z.ZodString;
    group_constrained: z.ZodBoolean;
    policy_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    last_team_icon_update: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const getTeamMembersOptsSchema: z.ZodObject<{
    sort: z.ZodOptional<z.ZodLiteral<"Username">>;
    exclude_deleted_users: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const teamsWithCountSchema: z.ZodObject<{
    teams: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        create_at: z.ZodNumber;
        update_at: z.ZodNumber;
        delete_at: z.ZodNumber;
        display_name: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        email: z.ZodString;
        type: z.ZodEnum<typeof TeamType>;
        company_name: z.ZodString;
        allowed_domains: z.ZodString;
        invite_id: z.ZodString;
        allow_open_invite: z.ZodBoolean;
        scheme_id: z.ZodString;
        group_constrained: z.ZodBoolean;
        policy_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        last_team_icon_update: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    total_count: z.ZodNumber;
}, z.core.$strip>;
export declare const teamStatsSchema: z.ZodObject<{
    team_id: z.ZodString;
    total_member_count: z.ZodNumber;
    active_member_count: z.ZodNumber;
}, z.core.$strip>;
export declare const notPagedTeamSearchOptsSchema: z.ZodObject<{
    allow_open_invite: z.ZodOptional<z.ZodBoolean>;
    group_constrained: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const pagedTeamSearchOptsSchema: z.ZodObject<{
    allow_open_invite: z.ZodOptional<z.ZodBoolean>;
    group_constrained: z.ZodOptional<z.ZodBoolean>;
    page: z.ZodNumber;
    per_page: z.ZodNumber;
}, z.core.$strip>;
export declare const teamInviteWithErrorSchema: z.ZodObject<{
    email: z.ZodString;
    error: z.ZodObject<{
        id: z.ZodString;
        message: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const teamSearchOptsSchema: z.ZodUnion<readonly [z.ZodObject<{
    allow_open_invite: z.ZodOptional<z.ZodBoolean>;
    group_constrained: z.ZodOptional<z.ZodBoolean>;
    page: z.ZodNumber;
    per_page: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
    allow_open_invite: z.ZodOptional<z.ZodBoolean>;
    group_constrained: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>]>;
//# sourceMappingURL=teams.zod.d.ts.map