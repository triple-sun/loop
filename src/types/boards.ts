export enum BoardType {
	OPEN = "O",
	PRIVATE = "P"
}

export enum BoardCardPropertyType {
	TEXT = "text",
	NUMBER = "number",
	SELECT = "select",
	MULTI_SELECT = "multiSelect",
	DATE = "date",
	PERSON = "person",
	FILE = "file",
	CHECKBOX = "checkbox",
	URL = "url",
	EMAIL = "email",
	PHONE = "phone",
	CREATED_TIME = "createdTime",
	CREATED_BY = "createdBy",
	UPDATED_TIME = "updatedTime",
	UPDATED_BY = "updatedBy",
	UNKNOWN = "unknown"
}

export interface BoardCardPropertyOption {
	id: string;
	value: string;
	color: string;
}

// A template for card properties attached to a board
export interface BoardCardPropertyTemplate {
	id: string;
	name: string;
	type: BoardCardPropertyType;
	options: BoardCardPropertyOption[];
}

export declare type Board = {
	id: string;
	teamId: string;
	channelId?: string;
	createdBy: string;
	modifiedBy: string;
	type: BoardType;
	minimumRole: string;

	title: string;
	description: string;
	icon?: string;
	showDescription: boolean;
	isTemplate: boolean;
	templateVersion: number;
	properties: Record<string, string | string[]>;
	cardProperties: BoardCardPropertyTemplate[];

	createAt: number;
	updateAt: number;
	deleteAt: number;
};

export interface CreateBoardResponse {
	boards: Board[];
}
