
export type Bot = {
  user_id: string;
  username: string;
  display_name?: string;
  description?: string;
  owner_id: string;
  create_at: number;
  update_at: number;
  delete_at: number;
};

// BotPatch is a description of what fields to update on an existing bot.
export type BotPatch = {
  username: string;
  display_name: string;
  description: string;
};
