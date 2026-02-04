export interface SystemCheckHealthResponse {
	/**
	 * @description Latest Android version supported
	 */
	AndroidLatestVersion: string;

	/**
	 * @description Minimum Android version supported
	 */
	AndroidMinVersion: string;

	/**
	 * @description Latest desktop version supported
	 */
	DesktopLatestVersion: string;

	/**
	 * @description Minimum desktop version supported
	 */
	DesktopMinVersion: string;

	/**
	 * @description Latest iOS version supported
	 */
	IosLatestVersion: string;

	/**
	 * @description Minimum iOS version supported
	 */
	IosMinVersion: string;

	/**
	 * @description Status of database ("OK" or "UNHEALTHY").
	 * Included when get_server_status parameter set.
	 */
	database_status?: "OK" | "UNHEALTHY";

	/**
	 * @description Status of filestore ("OK" or "UNHEALTHY").
	 * Included when get_server_status parameter set.
	 */
	filestore_status?: "OK" | "UNHEALTHY";

	/**
	 * @description Status of server ("OK" or "UNHEALTHY").
	 * Included when get_server_status parameter set.
	 */
	status?: "OK" | "UNHEALTHY";

	/**
	 * @description Whether the device id provided can receive notifications ("true", "false" or "unknown").
	 * Included when device_id parameter set.
	 */
	CanReceiveNotifications?: string;
}

export interface SystemCheckDatabaseIntegrityResponse {
	/**
	 * @description an object containing the results of a relational integrity check.
	 */
	data: {
		/**
		 * @description the name of the parent relation (table).
		 */
		parent_name: string;

		/**
		 * @description the name of the child relation (table).
		 */
		child_name: string;

		/**
		 * @description the name of the attribute (column) containing the parent id.
		 */
		parent_id_attr: string;

		/**
		 * @description the name of the attribute (column) containing the child id.
		 */
		child_id_attr: string;

		/**
		 * @description the list of orphaned records found.
		 */
		records: {
			/**
			 * @description the id of the parent relation (table) entry.
			 */
			parent_id: string;

			/**
			 * @description the id of the child relation (table) entry.
			 */
			child_id: string;
		}[];
	};

	/**
	 * @description a string value set in case of error.
	 */
	err: string;
}
