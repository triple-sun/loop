import type { Stream } from "form-data";
import type { ChannelID, FileID, TokenOverridable } from "./common.methods";

export interface FilesUploadArguments extends TokenOverridable, ChannelID {
	filename?: string;
	files: Buffer | Stream;
	client_ids?: string;
}

export interface FilesGetArguments extends TokenOverridable, FileID {}

export interface FilesGetLinkArguments extends TokenOverridable, FileID {}

export interface FilesGetInfoArguments extends TokenOverridable, FileID {}

export interface FilesGetPublicLinkArguments extends TokenOverridable, FileID {}

export interface FilesGetThumbnailArguments extends TokenOverridable, FileID {}

export interface FilesGetPreviewArguments extends TokenOverridable, FileID {}

export interface FilesGetPublicArguments extends TokenOverridable, FileID {}

export interface FilesSearchArguments extends TokenOverridable {
	team_id: string;
	terms: string;
	is_or_search: boolean;
	time_zone_offset?: number;
	include_deleted_channels?: boolean;
	page?: number;
	per_page?: number;
}
