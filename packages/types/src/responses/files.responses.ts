import type { FileInfo, FileSearchResultItem } from "../files";

export interface FilesUsageResponse {
	bytes: number;
}

export interface FileUploadResponse {
	file_infos: FileInfo[];
	client_ids: string[];
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
