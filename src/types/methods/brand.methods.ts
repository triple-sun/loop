/**
 * Arguments for getting the brand image.
 */
export interface BrandGetImageArguments {
	/** The ID of the brand image */
	id: string;
}

/**
 * Arguments for uploading the brand image.
 */
export interface BrandUploadImageArguments {
	/** The image data */
	image: File | Blob;
}
