import type { ComplianceReport } from "../compliance";

/**
 * Arguments for creating a compliance report.
 */
export interface ComplianceCreateReportArguments {
	/** The compliance report details */
	job: Partial<ComplianceReport>;
}

/**
 * Arguments for getting compliance reports.
 */
export interface ComplianceGetReportsArguments {
	/** Page number */
	page?: number;
	/** Number of reports per page */
	per_page?: number;
}

/**
 * Arguments for getting a specific compliance report.
 */
export interface ComplianceGetReportArguments {
	/** ID of the report */
	report_id: string;
}

/**
 * Arguments for downloading a compliance report.
 */
export interface ComplianceDownloadReportArguments {
	/** ID of the report */
	report_id: string;
}
