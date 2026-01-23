import type { Stream } from "form-data";
import type {
	ChannelID,
	FileArgument,
	TokenOverridable
} from "./common.methods";

export interface FilesUploadArguments extends TokenOverridable, ChannelID {
	files: (Buffer | Stream)[];
	client_ids?: string[];
}

export interface FilesGetArguments extends TokenOverridable, FileArgument {}

export interface FilesGetLinkArguments extends TokenOverridable, FileArgument {}

export interface FilesGetInfoArguments extends TokenOverridable, FileArgument {}

export interface FilesGetPublicLinkArguments
	extends TokenOverridable,
		FileArgument {}
