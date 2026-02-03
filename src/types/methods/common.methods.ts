// Reusable mixins or extensions that Method Arguments types can extend from

export interface Paginated {
	/** @description Number of items to return per page` */
	per_page?: number;
	/** @description Page number of results to return. */
	page?: number;
}

/**
 * Some API methods allow for overriding the auth token used with a method at runtime.
 */
export interface TokenOverridable {
	/** @description Overridable authentication token bearing required scopes. */
	token?: string;
}

/**
 * Some API methods take a `team_id` - different interfaces here so that we can provide a different JSDoc.
 * Unfortunately some of our APIs don't use a consistent team ID parameter name.
 */

export interface TeamID {
	/** @description The encoded team ID. */
	team_id: string;
}
export interface TeamIDs {
	/** @description A list of team IDs (must include at least one ID). */
	team_ids: [string, ...string[]];
}

export interface OptionalTeamID {
	/** @description If using an org token, `team_id` is required. */
	team_id?: string;
}
export interface TargetTeam {
	/** @description The team or enterprise id of the other party. */
	target_team?: string;
}

// Some APIs require a minimum-1-item channel array

export interface ChannelIDs {
	/** @description An array of channel IDs (must include at least one ID). */
	channel_ids: [string, ...string[]];
}
export interface ChannelID {
	/** @description Encoded channel ID. */
	channel_id: string;
}
export interface OptionalChannelID {
	/** @description Encoded channel ID. */
	channel_id?: string;
}

// Same for user IDs

export interface UserIDs {
	/** @description List of encoded user IDs. */
	user_ids: [string, ...string[]];
}
export interface UserID {
	/** @description Encoded user ID. */
	user_id: string;
}
export interface OptionalUserID {
	/** @description Encoded user ID. */
	user_id?: string;
}

export type ChannelOrUserID = ChannelID | UserID;

export interface UserIDMe {
	/** @description Encoded user ID. @default me - return data for current token */
	user_id?: string | "me";
}
export interface UserIDMe {
	/** @description Encoded user ID. @default me - return data for current token */
	user_id?: string;
}

export interface AppID {
	/** @description The ID of the app. */
	app_id: string;
}

export interface FileID {
	/**
	 * @description The ID of the file to get
	 */
	file_id: string;
}
