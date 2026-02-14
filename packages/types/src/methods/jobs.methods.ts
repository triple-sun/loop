import type { JobType } from "../jobs";

export interface JobsCreateArguments {
	type: JobType;
}

export interface JobsGetArguments {
	job_id: string;
}

export interface JobsListArguments {
	page?: number;
	per_page?: number;
}

export interface JobsListByTypeArguments {
	type: JobType;
	page?: number;
	per_page?: number;
}

export interface JobsCancelArguments {
	job_id: string;
}
