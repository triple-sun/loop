import type { PostAction } from "./posts-action";

export enum PostAttachmentColor {
	DarkRed = "#8B0000",
	Green = "#008000",
	Blue = "#0000FF",
	Orange = "#FFA500",
	Gray = "#808080"
}

export type PostAttachment = {
	id: number;
	fallback: string;
	color: PostAttachmentColor | string;
	pretext: string;
	author_name: string;
	author_link: string;
	author_icon: string;
	title: string;
	title_link: string;
	text: string;
	fields: PostAttachmentField[];
	actions?: PostAction[];
	image_url: string;
	thumb_url: string;
	footer: string;
	footer_icon: string;
	timestamp: number | string;
};

export type PostAttachmentField = {
	title: string;
	value: unknown;
	short: boolean;
};
