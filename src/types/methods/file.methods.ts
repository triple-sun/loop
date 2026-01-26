import type { Stream } from "form-data";
import type {
	ChannelID,
	FileID,
	TokenOverridable
} from "./common.methods";

export interface FilesUploadArguments extends TokenOverridable, ChannelID {
	filename: string;
	files: Buffer | Stream;
	client_ids?: string;
}

export interface FilesGetArguments extends TokenOverridable, FileID {}

export interface FilesGetLinkArguments extends TokenOverridable, FileID {}

export interface FilesGetInfoArguments extends TokenOverridable, FileID {}

export interface FilesGetPublicLinkArguments
	extends TokenOverridable,
		FileID {}
