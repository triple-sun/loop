import type { LogFilter } from "../admin";
import type { AdminConfig } from "../config";

/**
 * Arguments for getting the server's ping status.
 */
export interface SystemGetPingArguments {
	/** Whether to include server status in the response */
	full?: boolean;
}

/**
 * Arguments for updating the server configuration.
 */
export interface SystemUpdateConfigArguments {
	/** The new configuration */
	config: AdminConfig;
}

/**
 * Arguments for checking database integrity.
 */
export interface SystemCheckIntegrityArguments {
	/** The results of the integrity check */
	results?: boolean;
}

/**
 * Arguments for getting server logs.
 */
export interface SystemGetLogsArguments extends LogFilter {
	/** Page number of logs to return */
	page?: number;
	/** Number of logs per page */
	logs_per_page?: number;
}

/**
 * Arguments for uploading a log file.
 */
export interface SystemUploadLogFileArguments {
	/** The log file to upload */
	file: File; // Depending on environment, might be Blob or Buffer, but File is standard web
}

/**
 * Arguments for testing the site URL.
 */
export interface SystemTestSiteURLArguments {
	/** The site URL to test */
	site_url: string;
}

/**
 * Arguments for testing email configuration.
 */
export interface SystemTestEmailArguments {
	/** The email configuration to test */
	config: AdminConfig;
}

/**
 * Arguments for testing S3 connection.
 */
export interface SystemTestS3ConnectionArguments {
	/** The S3 configuration to test */
	config: AdminConfig;
}

/**
 * Arguments for getting analytics.
 */
export interface SystemGetAnalyticsArguments {
	/** Name of the specific analytic to retrieve */
	name?: string;
	/** Team ID to filter analytics */
	team_id?: string;
}
