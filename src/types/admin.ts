export enum LogLevel {
	SILLY = "silly",
	DEBUG = "debug",
	INFO = "info",
	WARN = "warn",
	ERROR = "error"
}

export enum AnalyticsVisualizationType {
	COUNT = "count",
	LINE_CHART = "line_chart",
	DOUGHNUT_CHART = "doughnut_chart"
}

export type LogServerNames = string[];
export type LogLevels = LogLevel[];
export type LogDateFrom = string; // epoch
export type LogDateTo = string; // epoch

export type LogObject = {
	caller: string;
	job_id: string;
	level: LogLevel;
	msg: string;
	timestamp: string;
	worker: string;
};

export type LogFilter = {
	serverNames: LogServerNames;
	logLevels: LogLevels;
	dateFrom: LogDateFrom;
	dateTo: LogDateTo;
};

export type LogFilterQuery = {
	server_names: LogServerNames;
	log_levels: LogLevels;
	date_from: LogDateFrom;
	date_to: LogDateTo;
};

export type ClusterInfo = {
	id: string;
	version: string;
	config_hash: string;
	ipaddress: string;
	hostname: string;
	schema_version: string;
};

export type AnalyticsRow = {
	name: string;
	value: number;
};

export type SchemaMigration = {
	version: number;
	name: string;
};

export type SupportPacketContent = {
	id: string;
	translation_id?: string;
	label: string;
	selected: boolean;
	mandatory: boolean;
};
