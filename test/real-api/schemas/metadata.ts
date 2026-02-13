export interface OpenGraphMetadataImage {
	secure_url?: string;
	url: string;
	type?: string;
	height?: number;
	width?: number;
}

export interface OpenGraphMetadata {
	type?: string;
	title?: string;
	description?: string;
	site_name?: string;
	url?: string;
	images: OpenGraphMetadataImage[];
}
