export interface UploadSession {
	id: string;
	type: string;
	create_at: number;
	path: string;
	file_size: number;
	file_offset: number;
}

/**
 * @description Main file info object
 */
export interface FileInfo {
	id: string;
	user_id: string;
	create_at: number;
	update_at: number;
	delete_at: number;
	name: string;
	extension: string;
	size: number;
	mime_type: string;
	width: number;
	height: number;
	has_preview_image: boolean;
	clientId: string;
	post_id?: string;
	mini_preview?: string;
	archived: boolean;
	link?: string;
}

export interface FileSearchResultItem extends FileInfo {
	channel_id: string;
}
