import type { Stream } from "form-data";
import type {
	ChannelID,
	FileID,
	Paginated,
	TeamID,
	TokenOverridable
} from "./common.methods";

/**
 * Upload a file
 *
 * @description Uploads a file that can later be attached to a post.
 * This request can either be a multipart/form-data request with a channel_id,
 * files and optional client_ids defined in the FormData, or it can be a request
 * with the channel_id and filename defined as query parameters with the contents of a single file in the body of the request.
 *
 * Only multipart/form-data requests are supported by server versions up to and including 4.7.
 * Server versions 4.8 and higher support both types of requests.
 *
 * Must have upload_file permission.
 *
 * @see https://developers.loop.ru/API/4.0.0/upload-file
 */
export interface FilesUploadArguments extends TokenOverridable, ChannelID {
	/**
	 * @description The ID of the channel that this file will be uploaded to
	 */
	channel_id: string;

	/**
	 * @description The name of the file to be uploaded
	 */
	filename?: string;

	/**
	 * @description A file to be uploaded (binary)
	 */
	files: Buffer | Stream;

	/**
	 * @description A unique identifier for the file that will be returned in the response
	 */
	client_ids?: string;
}

/**
 * Get a file
 *
 * @description Gets a file that has been uploaded previously.
 *
 * Must have read_channel permission or be uploader of the file.
 */
export interface FilesGetArguments extends TokenOverridable, FileID {}

/**
 * Get a file's thumbnail
 *
 * @description Gets a file's thumbnail.
 *
 * Must have read_channel permission or be uploader of the file.
 */
export interface FilesGetThumbnailArguments extends TokenOverridable, FileID {}

/**
 * Get a file's preview
 *
 * @description Gets a file's preview.
 *
 * Must have read_channel permission or be uploader of the file.
 */
export interface FilesGetPreviewArguments extends TokenOverridable, FileID {}

/**
 * Get a public file link
 *
 * @description Gets a public link for a file that can be accessed without logging into LOOP.
 *
 * Must have read_channel permission or be uploader of the file.
 */
export interface FilesGetPublicLinkArguments extends TokenOverridable, FileID {}

/**
 * Get metadata for a file
 *
 * @description Gets a file's info.
 *
 * Must have read_channel permission or be uploader of the file.
 */
export interface FilesGetMetadataArguments extends TokenOverridable, FileID {}

/**
 * Get a public file
 *
 * No permissions required.
 */
export interface FilesGetPublicArguments extends TokenOverridable, FileID {
	/**
	 * @description File hash
	 */
	h: string;
}

/**
 * Search files in team
 *
 * @description Search for files in a team based on file name, extention and file content
 * (if file content extraction is enabled and supported for the files).
 * Must be authenticated and have the view_team permission.
 *
 * @version 5.34+
 *
 * @see https://developers.loop.ru/API/4.0.0/search-files
 */
export interface FilesSearchArguments
	extends TokenOverridable,
		TeamID,
		Paginated {
	/**
	 * @description The search terms as inputed by the user.
	 *
	 * To search for files from a user include from:someusername, using a user's username.
	 * To search in a specific channel include in:somechannel, using the channel name (not the display name).
	 * To search for specific extensions included ext:extension.
	 */
	terms: string;

	/**
	 * @description Set to true if an Or search should be performed vs an And search.
	 */
	is_or_search: boolean;

	/**
	 * @description Offset from UTC of user timezone for date searches.
	 * @default 0
	 */
	time_zone_offset?: number;

	/**
	 * @description Set to true if deleted channels should be included in the search. (archived channels)
	 * @default false
	 */
	include_deleted_channels?: boolean;

	/**
	 * @description The page to select.
	 * Only works with Elasticsearch
	 * @default 0
	 */
	page?: number;

	/**
	 * @description The number of posts per page.
	 * Only works with Elasticsearch
	 * @default 60
	 */
	per_page?: number;
}
