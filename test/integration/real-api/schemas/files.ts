export interface FilesUsageResponse {
	bytes: number;
}

export interface FileUploadResponse {
	file_infos: FileInfo[];
	client_ids: string[];
}

export interface FileSearchResultItem extends FileInfo {
	channel_id: string;
}

export interface FileSearchResponse {
	order: Array<FileInfo["id"]>;
	file_infos: Map<string, FileSearchResultItem>;

	/**
	 * @description The ID of next file info. Not omitted when empty or not relevant.
	 */
	next_file_id: string;

	/**
	 * @description The ID of previous file info. Not omitted when empty or not relevant.
	 */
	prev_file_id: string;
}

export type UploadSession = {
	id: string;
	type: string;
	create_at: number;
	path: string;
	file_size: number;
	file_offset: number;
};

/**
 * @description Main file info object
 */
export type FileInfo = {
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
};
