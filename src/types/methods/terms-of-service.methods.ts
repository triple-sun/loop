/**
 * Arguments for creating terms of service.
 */
export interface TermsOfServiceCreateArguments {
	/** The text of the terms of service */
	text: string;
}

/**
 * Arguments for updating terms of service.
 */
export interface TermsOfServiceUpdateArguments {
	/** The ID of the terms of service */
	id: string;
	/** The new text */
	text: string;
}

/**
 * Arguments for getting terms of service.
 */
export interface TermsOfServiceGetArguments {
	/** The ID of the terms of service (optional, gets latest if not provided) */
	id?: string;
}
