import type { LogFilter } from "../admin";
import type { AdminConfig } from "../config";
import type { OptionalTeamID, TokenOverridable } from "./common.methods";

/**
 * Check if the server is up and healthy based on the configuration setting GoRoutineHealthThreshold.
 *
 * @description If GoRoutineHealthThreshold and the number of goroutines on the server exceeds that threshold the server is considered unhealthy.
 * If GoRoutineHealthThreshold is not set or the number of goroutines is below the threshold the server is considered healthy.
 *
 * @version 3.10+
 *
 * If a "device_id" is passed in the query, it will test the Push Notification Proxy in order to discover whether the device is able to receive notifications.
 * The response will have a "CanReceiveNotifications" property with one of the following values:
 * - true: It can receive notifications
 * - false: It cannot receive notifications
 * - unknown: There has been an unknown error, and it is not certain whether it can receive notifications.
 */
export interface SystemCheckHealthArguments extends TokenOverridable {
	/**
	 * @description Check the status of the database and file storage as well
	 */ get_server_status?: boolean;

	/**
	 * @description Check whether this device id can receive push notifications
	 */ device_id?: string;
}

/**
 * Get configuration
 * @description Retrieve the current server configuration
 *
 * Must have manage_system permission.
 */
export interface SystemGetConfigArguments extends TokenOverridable {}

/**
 * Update configuration
 * @description	Submit a new configuration for the server to use.
 *
 * As of server version 4.8, the PluginSettings.EnableUploads setting cannot be modified by this endpoint.
 *
 * Note that the parameters that aren't set in the configuration that you provide will be reset to default values.
 * Therefore, if you want to change a configuration parameter and leave the other ones unchanged, you need to get the existing configuration first,
 * change the field that you want, then put that new configuration.
 *
 * Must have manage_system permission.
 */
export interface SystemUpdateConfigArguments {
	/** The new configuration */
	config: AdminConfig;
}

/**
 * Perform a database integrity check
 * @description Performs a database integrity check.
 *
 * Note: This check may temporarily harm system performance.
 * Local mode only: This endpoint is only available through local mode.
 */
export type SystemCheckDatabaseIntegrityArguments = never;

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
 * Get some analytics data about the system.
 * @description This endpoint uses the old format, the /analytics route is reserved for the new format when it gets implemented.
 * The returned JSON changes based on the name query parameter but is always key/value pairs.
 *
 * Must have manage_system permission.
 */
export interface SystemGetAnalyticsArguments
	extends TokenOverridable,
		OptionalTeamID {
	/**
	 * @description Name of the specific analytic to retrieve
	 */ name?:
		| "standard"
		| "bot_post_counts_day"
		| "post_counts_day"
		| "user_counts_with_posts_day"
		| "extra_counts";
}
