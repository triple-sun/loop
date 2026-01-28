import type { WebAPICallResult } from "../web-client";

export type MethodWithRequiredArgument<
	METHOD_ARGS,
	METHOD_RESULT_DATA = unknown,
	METHOD_RESULT extends
		WebAPICallResult<METHOD_RESULT_DATA> = WebAPICallResult<METHOD_RESULT_DATA>
> = (options: METHOD_ARGS) => Promise<METHOD_RESULT>;

export type MethodWithOptionalArgument<
	METHOD_ARGS,
	METHOD_RESULT_DATA = unknown,
	METHOD_RESULT extends
		WebAPICallResult<METHOD_RESULT_DATA> = WebAPICallResult<METHOD_RESULT_DATA>
> = (options?: METHOD_ARGS) => Promise<METHOD_RESULT>;
