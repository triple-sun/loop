import type { RetryOptions } from "again-ts";

export const HEADER_AUTH = "Authorization";
export const HEADER_BEARER = "BEARER";
export const HEADER_CONTENT_TYPE = "Content-Type";
export const HEADER_REQUESTED_WITH = "X-Requested-With";
export const HEADER_USER_AGENT = "User-Agent";
export const HEADER_X_CLUSTER_ID = "X-Cluster-Id";
export const HEADER_X_CSRF_TOKEN = "X-CSRF-Token";
export const HEADER_X_VERSION_ID = "X-Version-Id";
export const LOGS_PER_PAGE_DEFAULT = 10000;
export const AUTOCOMPLETE_LIMIT_DEFAULT = 25;
export const PER_PAGE_DEFAULT = 60;
export const DEFAULT_LIMIT_BEFORE = 30;
export const DEFAULT_LIMIT_AFTER = 30;
export const DEFAULT_FILE_NAME = "Untitled";
export const DEFAULT_USER_ME = "me";

export const WEBSOCKET_MAX_FAILS = 7;
export const WEBSOCKET_MIN_RETRY_TIME = 3000; // 3 sec
export const WEBSOCKET_MAX_RETRY_TIME = 300000; // 5 mins
export const WEBSOCKET_JITTER_RANGE = 2000; // 2 sec
export const WEBSOCKET_HELLO = "hello";

/**
 * The default retry policy. Retry up to 10 times, over the span of about 30 minutes. It's not exact because
 * randomization has been added to prevent a stampeding herd problem (if all instances in your application are retrying
 * a request at the exact same intervals, they are more likely to cause failures for each other).
 */
export const tenRetriesInAboutThirtyMinutes: RetryOptions = {
	tries: 10,
	factor: 1.96821,
	random: true
};

/**
 * Short & sweet, five retries in five minutes and then bail.
 */
export const fiveRetriesInFiveMinutes: RetryOptions = {
	tries: 5,
	factor: 3.86
};

export const retryPolicies = {
	tenRetriesInAboutThirtyMinutes,
	fiveRetriesInFiveMinutes
};
