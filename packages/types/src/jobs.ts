export enum JobType {
	DATA_RETENTION = "data_retention",
	ELASTIC_POST_INDEXING = "elasticsearch_post_indexing",
	BLEVE_POST_INDEXING = "bleve_post_indexing",
	LDAP_SYNC = "ldap_sync",
	MESSAGE_EXPORT = "message_export"
}

export enum JobStatus {
	PENDING = "pending",
	IN_PROGRESS = "in_progress",
	SUCCESS = "success",
	ERROR = "error",
	CANCEL_REQUESTED = "cancel_requested",
	CANCELLED = "canceled",
	WARNING = "warning"
}

export interface Job {
	type: JobType;
	id: string;
	priority: number;
	create_at: number;
	start_at: number;
	last_activity_at: number;
	status: JobStatus;
	progress: number;
	data: unknown;
}
