
import type { UserProfileResponse } from '../../../src/types/users';

export type UserAutocomplete = {
  users: UserProfileResponse[];

  // out_of_channel contains users that aren't in the given channel. It's only populated when autocompleting users in
  // a given channel ID.
  out_of_channel?: UserProfileResponse[];
};

export type AutocompleteSuggestion = {
  Complete: string;
  Suggestion: string;
  Hint: string;
  Description: string;
  IconData: string;
};
