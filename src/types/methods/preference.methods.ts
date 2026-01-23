import type { PreferenceType } from "../preferences";
import type { TokenOverridable, UserID } from "./common.methods";

export interface Preference {
	user_id: string;
	category: string;
	name: string;
	value: string;
}

export interface PreferencesGetArguments extends TokenOverridable, UserID {
	category?: string;
}

export interface PreferencesSaveArguments extends TokenOverridable, UserID {
	preferences: Preference[];
}

export interface PreferencesDeleteArguments extends TokenOverridable, UserID {
	preferences: Preference[];
}
