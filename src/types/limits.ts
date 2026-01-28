export type LimitsState = {
	serverLimits: ServerLimits;
};

export type ServerLimits = {
	activeUserCount: number;
	maxUsersLimit: number;
};
