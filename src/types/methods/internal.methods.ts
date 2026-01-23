import type { WebApiCallResult } from "../web-api";

export type MethodWithRequiredArgument<
	METHOD_ARGS,
	METHOD_RESULT_DATA = unknown,
	METHOD_RESULT extends
		WebApiCallResult<METHOD_RESULT_DATA> = WebApiCallResult<METHOD_RESULT_DATA>,
> = (options: METHOD_ARGS) => Promise<METHOD_RESULT>;

export type MethodWithOptionalArgument<
	METHOD_ARGS,
	METHOD_RESULT_DATA = unknown,
	METHOD_RESULT extends
		WebApiCallResult<METHOD_RESULT_DATA> = WebApiCallResult<METHOD_RESULT_DATA>,
> = (options?: METHOD_ARGS) => Promise<METHOD_RESULT>;
