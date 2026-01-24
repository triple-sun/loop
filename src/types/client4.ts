import type { AxiosResponse, GenericAbortSignal } from "axios";

export enum LogLevel {
	Error = "ERROR",
	Warning = "WARNING",
	Info = "INFO",
	Debug = "DEBUG"
}

export type ClientResponse<T> = {
	response?: Response;
	status: number;
	headers: AxiosResponse["headers"];
	data: T;
};

export type Options = {
	headers?: { [x: string]: string };
	method?: string;
	url?: string;
	credentials?: "omit" | "same-origin" | "include";
	body?: any;
	signal?: GenericAbortSignal;
	ignoreStatus?: boolean /** If true, status codes > 300 are ignored and don't cause an error */;
};

export type StatusOK = {
	status: "OK";
};

export type FetchPaginatedThreadOptions = {
	fetchThreads?: boolean;
	collapsedThreads?: boolean;
	collapsedThreadsExtended?: boolean;
	direction?: "up" | "down";
	fetchAll?: boolean;
	perPage?: number;
	fromCreateAt?: number;
	fromPost?: string;
};

export type FileUploadData = {
	file: any;
	channel_id: string;
	filename: string;
};
