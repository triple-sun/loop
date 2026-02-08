import type { Preference } from "../general";
import type { TokenOverridable, UserID } from "./common.methods";

export interface PreferencesGetArguments extends TokenOverridable, UserID {
	category?: string;
}

export interface PreferencesSaveArguments extends TokenOverridable, UserID {
	preferences: Preference[];
}

export interface PreferencesDeleteArguments extends TokenOverridable, UserID {
	preferences: Preference[];
}
