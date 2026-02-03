import type { UserProfile } from "./users";

export interface UserAutocomplete {
	users: UserProfile[];
	// out_of_channel contains users that aren't in the given channel. It's only populated when autocompleting users in
	// a given channel ID.
	out_of_channel?: UserProfile[];
}

export interface AutocompleteSuggestion {
	Complete: string;
	Suggestion: string;
	Hint: string;
	Description: string;
	IconData: string;
}
