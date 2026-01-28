import type { TeamMembership } from "./teams";

export type Session = {
	id: string;
	token: string;
	create_at: number;
	expires_at: number;
	last_activity_at: number;
	user_id: string;
	device_id: string;
	roles: string;
	is_oauth: boolean;
	props: Record<string, unknown>;
	team_members: TeamMembership[];
	local: boolean;
};
