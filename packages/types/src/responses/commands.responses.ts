import type { PostAttachment } from "../posts";

export interface CommandExecuteResponse {
	/**
	 * @description
	 */
	response_type: string;
	text: string;
	username: string;
	channel_id: string;
	icon_url: string;
	type: string;
	props: Record<string, unknown>;
	goto_location: string;
	trigger_id: string;
	skip_slack_parsing: boolean;
	attachments: PostAttachment[];
	extra_responses: CommandExecuteResponse[];
}
