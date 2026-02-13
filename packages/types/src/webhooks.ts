export interface IncomingWebhook {
	id: string;
	create_at: number;
	update_at: number;
	delete_at: number;
	user_id: string;
	channel_id: string;
	team_id: string;
	display_name: string;
	description: string;
	username: string;
	icon_url: string;
	channel_locked: boolean;
}

export interface OutgoingWebhook {
	id: string;
	token: string;
	create_at: number;
	update_at: number;
	delete_at: number;
	creator_id: string;
	channel_id: string;
	team_id: string;
	trigger_words: string[];
	trigger_when: number;
	callback_urls: string[];
	display_name: string;
	description: string;
	content_type: string;
	username: string;
	icon_url: string;
}
