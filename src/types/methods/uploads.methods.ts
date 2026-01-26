export interface UploadsCreateArguments {
	channel_id: string;
	filename: string;
	file_size: number;
}

export interface UploadsGetArguments {
	upload_id: string;
}

export interface UploadsUploadArguments {
	upload_id: string;
	data: FormData;
}
