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

export interface LogObject {
	caller: string;
	job_id: string;
	level: LogLevel;
	msg: string;
	timestamp: string;
	worker: string;
}

export interface LogFilter {
	serverNames: string[];
	logLevels: LogLevel[];
	dateFrom: string; // epoch
	dateTo: string;
}

export interface LogFilterQuery {
	server_names: string[];
	log_levels: LogLevel[];
	date_from: string;
	date_to: string; // epoch
}

export interface ClusterInfo {
	id: string;
	version: string;
	config_hash: string;
	ipaddress: string;
	hostname: string;
	schema_version: string;
}

export interface AnalyticsRow {
	name: string;
	value: number;
}

export interface SchemaMigration {
	version: number;
	name: string;
}

export interface SupportPacketContent {
	id: string;
	translation_id?: string;
	label: string;
	selected: boolean;
	mandatory: boolean;
}
