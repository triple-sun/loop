/**
 * Options to create retry policies.
 */

import type { RetryOptions } from "again-ts";

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


const policies = {
	tenRetriesInAboutThirtyMinutes,
	fiveRetriesInFiveMinutes,
};

export default policies;
