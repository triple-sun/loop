export enum MattermostErrorCode {
	// 400
	API_CONTEXT_INVALID_PARAM = "api.context.invalid_param.app_error",
	// 401
	API_CONTEXT_SESSION_EXPIRED = "api.context.session_expired.app_error",
	// 403
	API_CONTEXT_PERMISSION_DENIED = "api.context.permissions.app_error",
	// 404
	API_CONTEXT_404 = "api.context.404.app_error",
	// 400
	API_USER_CREATE_USERNAME_INVALID = "api.user.create_user.username_invalid.app_error",
	// 400
	API_USER_CREATE_EMAIL_INVALID = "api.user.create_user.email_invalid.app_error",
	// 400
	API_CHANNEL_CREATE_CHANNEL_NAME_INVALID = "api.channel.create_channel.name_invalid.app_error",
	// 500
	APP_ERROR = "app_error"
}
