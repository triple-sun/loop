import EventEmitter from "eventemitter3";
import type { Stream } from "form-data";
import type {
	ComplianceReport,
	TokenOverridable,
	UserCustomStatus,
	UserID,
	UserProfile,
	UserStatus,
	WebAPICallResult
} from "./types";
import type { AnalyticsRow } from "./types/admin";
import type { Bot } from "./types/bots";
import type {
	Channel,
	ChannelMembership,
	ChannelStats,
	ChannelUnreadResponse,
	ChannelViewResponse
} from "./types/channels";
import type {
	CloudCustomer,
	CloudInvoice,
	CloudLimits,
	CloudProduct,
	CloudSubscription
} from "./types/cloud";
import type { ClientConfig } from "./types/config";
import type { DataRetentionCustomPolicies } from "./types/data-retention";
import type { CustomEmoji } from "./types/emojis";
import type {
	FileInfo,
	FileSearchResponse,
	FileUploadResponse,
	UploadSession
} from "./types/files";
import type {
	Group,
	GroupMembership,
	GroupStats,
	GroupSyncable
} from "./types/groups";
import type {
	Command,
	IncomingWebhook,
	OAuthApp,
	OutgoingWebhook
} from "./types/integrations";
import type { Job } from "./types/jobs";
import type {
	BotsAssignArguments,
	BotsConvertBotToUserArguments,
	BotsConvertUserArguments,
	BotsCreateArguments,
	BotsDeleteIconArguments,
	BotsDisableArguments,
	BotsEnableArguments,
	BotsGetArguments,
	BotsGetIconArguments,
	BotsListArguments,
	BotsPatchArguments,
	BotsSetIconArguments
} from "./types/methods/bots.methods";
import type {
	BrandGetImageArguments,
	BrandUploadImageArguments
} from "./types/methods/brand.methods";
import type {
	ChannelsAutocompleteArguments,
	ChannelsCategoriesCreateArguments,
	ChannelsCategoriesListArguments,
	ChannelsCategoriesOrderGetArguments,
	ChannelsCategoriesOrderUpdateArguments,
	ChannelsCategoriesUpdateAllArguments,
	ChannelsCategoryDeleteArguments,
	ChannelsCategoryGetArguments,
	ChannelsCategoryUpdateArguments,
	ChannelsCountByGroupArguments,
	ChannelsCreateArguments,
	ChannelsCreateDirectArguments,
	ChannelsCreateGroupArguments,
	ChannelsDeleteArguments,
	ChannelsGetAllForUserArguments,
	ChannelsGetByIdArguments,
	ChannelsGetByIdsArguments,
	ChannelsGetByNameArguments,
	ChannelsGetForUserArguments,
	ChannelsGetMembersMinusGroupArguments,
	ChannelsGetPinnedArguments,
	ChannelsGetStatsArguments,
	ChannelsGetTimezonesArguments,
	ChannelsGetUnreadArguments,
	ChannelsListAllArguments,
	ChannelsListDeletedArguments,
	ChannelsListInTeamArguments,
	ChannelsListPrivateArguments,
	ChannelsMemberAddArguments,
	ChannelsMemberArguments,
	ChannelsMemberRemoveArguments,
	ChannelsMembersArguments,
	ChannelsMembersGetByIdsArguments,
	ChannelsMemberUpdateNotifyPropsArguments,
	ChannelsMemberUpdateRolesArguments,
	ChannelsMemberUpdateSchemeRolesArguments,
	ChannelsModerationGetArguments,
	ChannelsModerationUpdateArguments,
	ChannelsMoveArguments,
	ChannelsPatchArguments,
	ChannelsRestoreArguments,
	ChannelsSearchAllArguments,
	ChannelsSearchArchivedArguments,
	ChannelsSearchArguments,
	ChannelsSearchAutocompleteArguments,
	ChannelsSearchGroupsArguments,
	ChannelsSetSchemeArguments,
	ChannelsUpdateArguments,
	ChannelsUpdatePrivacyArguments,
	ChannelsViewArguments,
	SidebarCategory
} from "./types/methods/channel.methods";
import type {
	CloudConfirmCustomerPaymentArguments,
	CloudUpdateAddressArguments,
	CloudUpdateCustomerArguments,
	CloudValidateBusinessEmailArguments
} from "./types/methods/cloud.methods";
import type {
	ComplianceCreateReportArguments,
	ComplianceDownloadReportArguments,
	ComplianceGetReportsArguments
} from "./types/methods/compliance.methods";
import type {
	DataRetentionAddPolicyChannelsArguments,
	DataRetentionAddPolicyTeamsArguments,
	DataRetentionCreatePolicyArguments,
	DataRetentionDeletePolicyArguments,
	DataRetentionGetPoliciesArguments,
	DataRetentionGetPolicyArguments,
	DataRetentionGetPolicyChannelsArguments,
	DataRetentionGetPolicyTeamsArguments,
	DataRetentionGetUserChannelPoliciesArguments,
	DataRetentionGetUserTeamPoliciesArguments,
	DataRetentionPatchPolicyArguments,
	DataRetentionRemovePolicyChannelsArguments,
	DataRetentionRemovePolicyTeamsArguments,
	DataRetentionSearchPolicyChannelsArguments,
	DataRetentionSearchPolicyTeamsArguments,
	DataRetentionUpdatePolicyArguments
} from "./types/methods/data-retention.methods";
import type {
	EmojisAutocompleteArguments,
	EmojisCreateArguments,
	EmojisDeleteArguments,
	EmojisGetArguments,
	EmojisGetByNameArguments,
	EmojisGetImageArguments,
	EmojisGetListArguments,
	EmojisSearchArguments
} from "./types/methods/emoji.methods";
import type {
	FilesGetArguments,
	FilesGetMetadataArguments,
	FilesGetPreviewArguments,
	FilesGetPublicArguments,
	FilesGetPublicLinkArguments,
	FilesGetThumbnailArguments,
	FilesSearchArguments,
	FilesUploadArguments
} from "./types/methods/file.methods";
import type {
	GroupsAddSyncableArguments,
	GroupsChannelsGetArguments,
	GroupsCreateArguments,
	GroupsDeleteArguments,
	GroupsDeleteLdapLinkArguments,
	GroupsGetArguments,
	GroupsGetStatsArguments,
	GroupsListArguments,
	GroupsListForUserArguments,
	GroupsListSyncablesArguments,
	GroupsMembersAddArguments,
	GroupsMembersGetArguments,
	GroupsMembersRemoveArguments,
	GroupsPatchArguments,
	GroupsPatchSyncableArguments,
	GroupsRemoveSyncableArguments,
	GroupsRestoreArguments,
	GroupsTeamsGetArguments,
	GroupsUpdateArguments
} from "./types/methods/groups.methods";
import type {
	CommandsCreateArguments,
	CommandsDeleteArguments,
	CommandsExecuteArguments,
	CommandsListArguments,
	CommandsListAutocompleteArguments,
	CommandsRegenerateTokenArguments,
	CommandsUpdateArguments,
	IncomingWebhooksCreateArguments,
	IncomingWebhooksDeleteArguments,
	IncomingWebhooksGetArguments,
	IncomingWebhooksListArguments,
	IncomingWebhooksUpdateArguments,
	OAuthAppsCreateArguments,
	OAuthAppsDeleteArguments,
	OAuthAppsGetArguments,
	OAuthAppsGetInfoArguments,
	OAuthAppsListArguments,
	OAuthAppsRegenerateSecretArguments,
	OAuthAppsUpdateArguments,
	OutgoingWebhooksCreateArguments,
	OutgoingWebhooksDeleteArguments,
	OutgoingWebhooksGetArguments,
	OutgoingWebhooksListArguments,
	OutgoingWebhooksRegenerateTokenArguments,
	OutgoingWebhooksUpdateArguments
} from "./types/methods/integrations.methods";
import type {
	InteractiveOpenDialogArguments,
	InteractiveSubmitDialogArguments
} from "./types/methods/interactive.methods";
import type {
	MethodWithOptionalArgument,
	MethodWithRequiredArgument
} from "./types/methods/internal.methods";
import type {
	JobsCancelArguments,
	JobsCreateArguments,
	JobsGetArguments,
	JobsListArguments,
	JobsListByTypeArguments
} from "./types/methods/jobs.methods";
import type {
	PlaybookRunsCreateArguments,
	PlaybookRunsGetArguments,
	PlaybookRunsListArguments
} from "./types/methods/playbook-runs.methods";
import type {
	PlaybooksCreateArguments,
	PlaybooksDeleteArguments,
	PlaybooksGetArguments,
	PlaybooksListArguments,
	PlaybooksUpdateArguments
} from "./types/methods/playbooks.methods";
import type {
	PluginsDisableArguments,
	PluginsEnableArguments,
	PluginsGetMarketplaceArguments,
	PluginsGetWebAppArguments,
	PluginsInstallFromMarketplaceArguments,
	PluginsInstallFromUrlArguments,
	PluginsRemoveArguments,
	PluginsUploadArguments
} from "./types/methods/plugins.methods";
import type {
	PostsCreateArguments,
	PostsCreateEphemeralArguments,
	PostsDeleteArguments,
	PostsDoActionArguments,
	PostsGetArguments,
	PostsGetAroundLastUnreadArguments,
	PostsGetByIdsArguments,
	PostsGetFileInfoArguments,
	PostsGetFlaggedArguments,
	PostsGetForChannelArguments,
	PostsGetThreadArguments,
	PostsMarkAsUnreadArguments,
	PostsMoveArguments,
	PostsPatchArguments,
	PostsPinArguments,
	PostsSearchArguments,
	PostsSetReminderArguments,
	PostsUnpinArguments,
	PostsUpdateArguments
} from "./types/methods/post.methods";
import type {
	PreferencesDeleteArguments,
	PreferencesGetArguments,
	PreferencesSaveArguments
} from "./types/methods/preference.methods";
import type {
	ReactionsCreateArguments,
	ReactionsDeleteArguments,
	ReactionsGetBulkArguments,
	ReactionsGetForPostArguments
} from "./types/methods/reaction.methods";
import type {
	RolesGetArguments,
	RolesGetByNameArguments,
	RolesGetByNamesArguments,
	RolesPatchArguments
} from "./types/methods/roles.methods";
import type {
	SchemesCreateArguments,
	SchemesDeleteArguments,
	SchemesGetArguments,
	SchemesGetChannelsArguments,
	SchemesGetTeamsArguments,
	SchemesListArguments,
	SchemesPatchArguments
} from "./types/methods/schemes.methods";
import type {
	SystemCheckDatabaseIntegrityArguments,
	SystemCheckHealthArguments,
	SystemGetAnalyticsArguments,
	SystemGetLogsArguments,
	SystemTestEmailArguments,
	SystemTestS3ConnectionArguments,
	SystemTestSiteURLArguments,
	SystemUpdateConfigArguments,
	SystemUploadLogFileArguments
} from "./types/methods/system.methods";
import type {
	TeamsCheckNameExistsArguments,
	TeamsCreateArguments,
	TeamsDeleteArguments,
	TeamsGetArguments,
	TeamsGetByIdArguments,
	TeamsGetByNameArguments,
	TeamsGetIconArguments,
	TeamsGetStatsArguments,
	TeamsImportArguments,
	TeamsMemberAddArguments,
	TeamsMemberAddBatchArguments,
	TeamsMemberGetArguments,
	TeamsMemberRemoveArguments,
	TeamsMembersGetByIdsArguments,
	TeamsMembersListArguments,
	TeamsMemberUpdateRolesArguments,
	TeamsMemberUpdateSchemeRolesArguments,
	TeamsPatchArguments,
	TeamsRegenerateInviteIdArguments,
	TeamsRemoveIconArguments,
	TeamsSearchArguments,
	TeamsSetIconArguments,
	TeamsUpdateArguments
} from "./types/methods/team.methods";
import type {
	TermsOfServiceCreateArguments,
	TermsOfServiceGetArguments,
	TermsOfServiceUpdateArguments
} from "./types/methods/terms-of-service.methods";
import type {
	UploadsCreateArguments,
	UploadsGetArguments,
	UploadsUploadArguments
} from "./types/methods/uploads.methods";
import type {
	UsersAutocompleteArguments,
	UsersCustomStatusSetArguments,
	UsersCustomStatusUnsetArguments,
	UsersDeleteImageArguments,
	UsersGetByEmailArguments,
	UsersGetByUsernameArguments,
	UsersListArguments,
	UsersProfileGetArguments,
	UsersProfileSetArguments,
	UsersSearchArguments,
	UsersSetImageArguments,
	UsersStatusGetAruments,
	UsersStatusSetAruments,
	UsersUpdateRolesArguments
} from "./types/methods/user.methods";
import type {
	PluginManifest,
	PluginStatus,
	PluginsGetResponse
} from "./types/plugins";
import type { Post } from "./types/posts";
import type { PreferenceType } from "./types/preferences";
import type { Reaction } from "./types/reactions";
import type { StatusOKResponse } from "./types/responses/common.responses";
import type {
	PlaybookRunsCreateResponse,
	PlaybookRunsGetResponse,
	PlaybooksCreateResponse,
	PlaybooksGetResponse,
	PlaybooksListResponse,
	PlaybooksRunsListResponse,
	PlaybooksUpdateResponse
} from "./types/responses/playbooks.responses";
import type {
	PostListResponse,
	PostSearchResponse
} from "./types/responses/posts.responses";
import type {
	SystemCheckDatabaseIntegrityResponse,
	SystemCheckHealthResponse
} from "./types/responses/system.responses";
import type { Role } from "./types/roles";
import type { Scheme } from "./types/schemes";
import type {
	Team,
	TeamMembership,
	TeamMemberWithError,
	TeamStats
} from "./types/teams";
import type { TermsOfService } from "./types/terms-of-service";
import {
	ContentType,
	type WebApiCallConfig,
	type WebClientEvent
} from "./types/web-client";

/**
 *  Binds a certain `method` and its (required) arguments and result types to the `apiCall` method in `LoopClient`.
 */
function bindApiCall<ARGS, RESULT>(
	self: Methods,
	config: WebApiCallConfig
): MethodWithRequiredArgument<ARGS, RESULT> {
	return self.apiCall.bind(self, config) as MethodWithRequiredArgument<
		ARGS,
		RESULT
	>;
}

/**
 * Binds a certain `method` and its (required) arguments and result types to the `apiCall` method in `LoopClient`.
 * */
function bindApiCallWithOptionalArg<ARGS, RESULT>(
	self: Methods,
	config: WebApiCallConfig
): MethodWithOptionalArgument<ARGS, RESULT> {
	return self.apiCall.bind(self, config) as MethodWithOptionalArgument<
		ARGS,
		RESULT
	>;
}

/**
 * @description A class that defines all Web API methods, their arguments type,
 * their response type, and binds those methods to the `apiCall` class method.
 *
 * Due to irregularities in API some method paths include path params in Express.js notation
 * @example `users/:user_id`
 *
 * Path params are then filled using options object
 * @example { user_id: 'user_id_123456 } with path `users/:user_id/promote` will result in `users/user_id_123456/promote`
 *
 * Loop API reference:
 * @see {@link https://developers.loop.ru/category/loop-api | Loop API}
 */
export abstract class Methods extends EventEmitter<WebClientEvent> {
	protected constructor() {
		super();

		if (new.target.name !== "WebClient") {
			// Check that the class being created extends from `WebClient` rather than this class
			throw new Error(
				"Attempt to inherit from WebClient methods without inheriting from WebClient"
			);
		}
	}

	public abstract apiCall(
		config: WebApiCallConfig,
		options?: Record<string, unknown>
	): Promise<Readonly<WebAPICallResult>>;

	/**
	 * ============================================================================
	 * @description Bots methods
	 * ============================================================================
	 */
	public readonly bots = {
		convert: {
			/**
			 * @description Convert a user to a bot.
			 * Requires `manage_system` permission.
			 */
			fromUser: bindApiCall<BotsConvertUserArguments, StatusOKResponse>(this, {
				method: "POST",
				path: "users/:user_id/convert_to_bot",
				type: ContentType.URLEncoded
			}),
			/**
			 * @description Convert a bot to a user.
			 * Requires `manage_system` permission.
			 */
			toUser: bindApiCall<BotsConvertBotToUserArguments, StatusOKResponse>(
				this,
				{
					method: "POST",

					path: "bots/:bot_user_id/convert_to_user",
					type: ContentType.JSON
				}
			)
		},
		/**
		 * @description Create a new bot.
		 * Requires `create_bot` permission.
		 */
		create: bindApiCall<BotsCreateArguments, Bot>(this, {
			method: "POST",
			path: "bots",
			type: ContentType.JSON
		}),
		get: bindApiCall<BotsGetArguments, Bot>(this, {
			method: "GET",
			path: "bots/:user_id",
			type: ContentType.URLEncoded
		}),
		list: bindApiCallWithOptionalArg<BotsListArguments, Bot[]>(this, {
			method: "GET",
			path: "bots",
			type: ContentType.URLEncoded
		}),
		patch: bindApiCall<BotsPatchArguments, Bot>(this, {
			method: "PUT",
			path: "bots/:user_id",
			type: ContentType.JSON
		}),
		disable: bindApiCall<BotsDisableArguments, StatusOKResponse>(this, {
			method: "POST",
			path: "bots/:bot_user_id/disable",
			type: ContentType.JSON
		}),
		enable: bindApiCall<BotsEnableArguments, StatusOKResponse>(this, {
			method: "POST",
			path: "bots/:bot_user_id/enable",
			type: ContentType.JSON
		}),
		assign: bindApiCall<BotsAssignArguments, StatusOKResponse>(this, {
			method: "POST",
			path: "bots/:bot_user_id/assign/:user_id",
			type: ContentType.JSON
		}),
		icon: {
			get: bindApiCall<BotsGetIconArguments, Blob>(this, {
				method: "GET",
				path: "bots/:bot_user_id/icon",
				type: ContentType.URLEncoded
			}),
			set: bindApiCall<BotsSetIconArguments, StatusOKResponse>(this, {
				method: "POST",
				path: "bots/:bot_user_id/icon",
				type: ContentType.FormData
			}),
			delete: bindApiCall<BotsDeleteIconArguments, StatusOKResponse>(this, {
				method: "DELETE",
				path: "bots/:bot_user_id/icon",
				type: ContentType.JSON
			})
		}
	} as const;

	/**
	 * ============================================================================
	 * @description Brand methods
	 * ============================================================================
	 */
	public readonly brand = {
		image: {
			get: bindApiCall<BrandGetImageArguments, Buffer | Stream>(this, {
				method: "GET",
				path: "brand/image",
				type: ContentType.URLEncoded
			}),
			delete: bindApiCallWithOptionalArg<never, StatusOKResponse>(this, {
				method: "DELETE",
				path: "brand/image",
				type: ContentType.URLEncoded
			}),
			upload: bindApiCall<BrandUploadImageArguments, StatusOKResponse>(this, {
				method: "POST",
				path: "brand/image",
				type: ContentType.FormData
			})
		}
	} as const;

	/**
	 * ============================================================================
	 * Compliance methods
	 * ============================================================================
	 */
	public readonly compliance = {
		createReport: bindApiCall<
			ComplianceCreateReportArguments,
			ComplianceReport
		>(this, {
			method: "POST",
			path: "compliance/reports",
			type: ContentType.JSON
		}),
		downloadReport: bindApiCall<
			ComplianceDownloadReportArguments,
			Buffer | Stream
		>(this, {
			method: "GET",
			path: "compliance/reports/:report_id/download",
			type: ContentType.URLEncoded
		}),
		getReports: bindApiCall<ComplianceGetReportsArguments, ComplianceReport[]>(
			this,
			{
				method: "GET",
				path: "compliance/reports",
				type: ContentType.URLEncoded
			}
		)
	} as const;

	/**
	 * ============================================================================
	 * @description Channels methods
	 * ============================================================================
	 */
	public readonly channels = {
		autocomplete: bindApiCall<ChannelsAutocompleteArguments, Channel[]>(this, {
			method: "GET",
			path: "teams/:team_id/channels/autocomplete",
			type: ContentType.URLEncoded
		}),
		/**
		 * @description Create a new channel.
		 * If creating a public channel, create_public_channel permission is required.
		 * If creating a private channel, create_private_channel permission is required.
		 */
		create: {
			regular: bindApiCall<ChannelsCreateArguments, Channel>(this, {
				method: "POST",
				path: "channels",
				type: ContentType.JSON
			}),
			direct: bindApiCall<ChannelsCreateDirectArguments, Channel>(this, {
				method: "POST",
				path: "channels/direct",
				type: ContentType.JSON
			}),
			group: bindApiCall<ChannelsCreateGroupArguments, Channel>(this, {
				method: "POST",
				path: "channels/group",
				type: ContentType.JSON
			})
		},

		list: {
			/**
			 * @description List all channels
			 */
			all: bindApiCallWithOptionalArg<ChannelsListAllArguments, Channel[]>(
				this,
				{
					method: "GET",
					path: "channels",
					type: ContentType.URLEncoded
				}
			),
			/**
			 * @description List channels for a team.
			 */
			inTeam: bindApiCall<ChannelsListInTeamArguments, Channel[]>(this, {
				method: "GET",
				path: "teams/:team_id/channels",
				type: ContentType.URLEncoded
			}),
			byIds: bindApiCall<ChannelsGetByIdsArguments, Channel[]>(this, {
				method: "POST",
				path: "teams/:team_id/channels/ids",
				type: ContentType.JSON
			}),
			/**
			 * @description Get all channels for a user across all teams.
			 */
			forUser: bindApiCall<ChannelsGetAllForUserArguments, Channel[]>(this, {
				method: "GET",
				path: "users/:user_id/channels",
				type: ContentType.URLEncoded
			}),
			/**
			 * @description Get all channels for a user in a specific team.
			 */
			forUserInTeam: bindApiCall<ChannelsGetForUserArguments, Channel[]>(this, {
				method: "GET",
				path: "users/:user_id/teams/:team_id/channels",
				type: ContentType.URLEncoded
			}),
			/**
			 * @description Get private channels for a team.
			 */
			private: bindApiCall<ChannelsListPrivateArguments, Channel[]>(this, {
				method: "GET",
				path: "teams/:team_id/channels/private",
				type: ContentType.URLEncoded
			}),
			/**
			 * @description Get deleted channels for a team.
			 */
			deleted: bindApiCall<ChannelsListDeletedArguments, Channel[]>(this, {
				method: "GET",
				path: "teams/:team_id/channels/deleted",
				type: ContentType.URLEncoded
			})
		},
		search: {
			team: bindApiCall<ChannelsSearchArguments, Channel[]>(this, {
				method: "POST",
				path: "teams/:team_id/channels/search",
				type: ContentType.JSON
			}),
			all: bindApiCall<ChannelsSearchAllArguments, Channel[]>(this, {
				method: "POST",
				path: "channels/search",
				type: ContentType.JSON
			}),
			archived: bindApiCall<ChannelsSearchArchivedArguments, Channel[]>(this, {
				method: "POST",
				path: "teams/:team_id/channels/search_archived",
				type: ContentType.JSON
			}),
			/**
			 * @description Autocomplete channels for search in a team.
			 */
			autocomplete: bindApiCall<ChannelsSearchAutocompleteArguments, Channel[]>(
				this,
				{
					method: "GET",
					path: "teams/:team_id/channels/search_autocomplete",
					type: ContentType.URLEncoded
				}
			),
			/**
			 * @description Search for group message channels.
			 */
			groups: bindApiCall<ChannelsSearchGroupsArguments, Channel[]>(this, {
				method: "POST",
				path: "channels/group/search",
				type: ContentType.JSON
			})
		},
		get: {
			/**
			 * @description Get a channel by ID.
			 */
			byId: bindApiCall<ChannelsGetByIdArguments, Channel>(this, {
				method: "GET",
				path: "channels/:channel_id",
				type: ContentType.URLEncoded
			}),
			/**
			 * @description Get a channel by name.
			 */
			byName: bindApiCall<ChannelsGetByNameArguments, Channel>(this, {
				method: "GET",
				path: "channels/:team_id/channels/:channel_name",
				type: ContentType.URLEncoded
			})
		},

		/**
		 * @description Update a channel.
		 */
		update: bindApiCall<ChannelsUpdateArguments, Channel>(this, {
			method: "PUT",
			path: "channels/:channel_id",
			type: ContentType.JSON
		}),
		/**
		 * @description Delete a channel.
		 */
		delete: bindApiCall<ChannelsDeleteArguments, StatusOKResponse>(this, {
			method: "DELETE",
			path: "channels/:channel_id",
			type: ContentType.URLEncoded
		}),
		patch: bindApiCall<ChannelsPatchArguments, Channel>(this, {
			method: "PUT",
			path: "channels/:channel_id/patch",
			type: ContentType.JSON
		}),
		restore: bindApiCall<ChannelsRestoreArguments, Channel>(this, {
			method: "POST",
			path: "channels/:channel_id/restore",
			type: ContentType.URLEncoded
		}),
		getStats: bindApiCall<ChannelsGetStatsArguments, ChannelStats>(this, {
			method: "GET",
			path: "channels/:channel_id/stats",
			type: ContentType.URLEncoded
		}),
		view: bindApiCall<ChannelsViewArguments, ChannelViewResponse>(this, {
			method: "POST",
			path: "channels/members/:channel_id/view",
			type: ContentType.JSON
		}),
		members: {
			/**
			 * @description Get channel members.
			 */
			get: bindApiCall<ChannelsMembersArguments, ChannelMembership[]>(this, {
				method: "GET",
				path: "channels/:channel_id/members",
				type: ContentType.URLEncoded
			}),
			/**
			 * @description Get a specific channel member.
			 */
			getById: bindApiCall<ChannelsMemberArguments, ChannelMembership>(this, {
				method: "GET",
				path: "channels/:channel_id/members/:user_id",
				type: ContentType.URLEncoded
			}),
			/**
			 * @description Add a user to a channel.
			 * Requires `join_public_channels` for public channels.
			 */
			add: bindApiCall<ChannelsMemberAddArguments, ChannelMembership>(this, {
				method: "POST",
				path: "channels/:channel_id/members",
				type: ContentType.JSON
			}),
			/**
			 * @description Remove a user from a channel.
			 */
			remove: bindApiCall<ChannelsMemberRemoveArguments, StatusOKResponse>(
				this,
				{
					method: "DELETE",
					path: "channels/:channel_id/members/:user_id",
					type: ContentType.URLEncoded
				}
			),
			/**
			 * @description Get channel members by user IDs.
			 */
			getByIds: bindApiCall<
				ChannelsMembersGetByIdsArguments,
				ChannelMembership[]
			>(this, {
				method: "POST",
				path: "channels/:channel_id/members/ids",
				type: ContentType.JSON
			}),
			/**
			 * @description Update the roles of a channel member.
			 */
			updateRoles: bindApiCall<
				ChannelsMemberUpdateRolesArguments,
				StatusOKResponse
			>(this, {
				method: "PUT",
				path: "channels/:channel_id/members/:user_id/roles",
				type: ContentType.JSON
			}),
			/**
			 * @description Update the scheme-derived roles of a channel member.
			 */
			updateSchemeRoles: bindApiCall<
				ChannelsMemberUpdateSchemeRolesArguments,
				StatusOKResponse
			>(this, {
				method: "PUT",
				path: "channels/:channel_id/members/:user_id/scheme_roles",
				type: ContentType.JSON
			}),
			/**
			 * @description Update a user's notification properties for a channel.
			 */
			updateNotifyProps: bindApiCall<
				ChannelsMemberUpdateNotifyPropsArguments,
				StatusOKResponse
			>(this, {
				method: "PUT",
				path: "channels/:channel_id/members/:user_id/notify_props",
				type: ContentType.JSON
			}),
			/**
			 * @description Get channel members minus group members.
			 * @permission Must have manage_system permission.
			 */
			getMinusGroupMembers: bindApiCall<
				ChannelsGetMembersMinusGroupArguments,
				{ users: unknown[]; total_count: number; next_page_id: string }
			>(this, {
				method: "GET",
				path: "channels/:channel_id/members_minus_group_members",
				type: ContentType.URLEncoded
			}),
			/**
			 * @description Get member counts by group for a channel.
			 */
			countByGroup: bindApiCall<
				ChannelsCountByGroupArguments,
				{ group_id: string; channel_member_count: number }[]
			>(this, {
				method: "GET",
				path: "channels/:channel_id/member_counts_by_group",
				type: ContentType.URLEncoded
			})
		},

		/**
		 * @description Update a channel's privacy setting.
		 * Converts a public channel to private or vice-versa.
		 */
		updatePrivacy: bindApiCall<ChannelsUpdatePrivacyArguments, Channel>(this, {
			method: "PUT",
			path: "channels/:channel_id/privacy",
			type: ContentType.JSON
		}),

		/**
		 * @description Move a channel to a different team.
		 */
		move: bindApiCall<ChannelsMoveArguments, Channel>(this, {
			method: "POST",
			path: "channels/:channel_id/move",
			type: ContentType.JSON
		}),

		/**
		 * @description Get pinned posts in a channel.
		 */
		getPinned: bindApiCall<ChannelsGetPinnedArguments, PostListResponse>(this, {
			method: "GET",
			path: "channels/:channel_id/pinned",
			type: ContentType.URLEncoded
		}),

		/**
		 * @description Get timezones of users in a channel.
		 */
		getTimezones: bindApiCall<ChannelsGetTimezonesArguments, string[]>(this, {
			method: "GET",
			path: "channels/:channel_id/timezones",
			type: ContentType.URLEncoded
		}),

		/**
		 * @description Get unread message and mention counts for a user in a channel.
		 */
		getUnread: bindApiCall<ChannelsGetUnreadArguments, ChannelUnreadResponse>(
			this,
			{
				method: "GET",
				path: "users/:user_id/channels/:channel_id/unread",
				type: ContentType.URLEncoded
			}
		),

		/**
		 * @description Set a channel's scheme.
		 */
		setScheme: bindApiCall<ChannelsSetSchemeArguments, StatusOKResponse>(this, {
			method: "PUT",
			path: "channels/:channel_id/scheme",
			type: ContentType.JSON
		}),

		moderation: {
			/**
			 * @description Get moderation settings for a channel.
			 */
			get: bindApiCall<
				ChannelsModerationGetArguments,
				{ name: string; roles: { guests: boolean; members: boolean } }[]
			>(this, {
				method: "GET",
				path: "channels/:channel_id/moderations",
				type: ContentType.URLEncoded
			}),
			/**
			 * @description Update moderation settings for a channel.
			 */
			update: bindApiCall<
				ChannelsModerationUpdateArguments,
				{ name: string; roles: { guests: boolean; members: boolean } }[]
			>(this, {
				method: "PUT",
				path: "channels/:channel_id/moderations/patch",
				type: ContentType.JSON
			})
		}
	} as const;

	/**
	 * ============================================================================
	 * @description Cloud methods
	 * ============================================================================
	 */
	public readonly cloud = {
		customer: {
			get: bindApiCallWithOptionalArg<never, CloudCustomer>(this, {
				method: "GET",
				path: "cloud/customer",
				type: ContentType.URLEncoded
			}),
			/**
			 * Updates the customer information for the LOOP Cloud customer bound to this installation.
			 * @description Must have manage_system permission and be licensed for Cloud.
			 * Minimum server version: 5.29 Note: This is intended for internal use and is subject to change.
			 */
			update: bindApiCall<CloudUpdateCustomerArguments, CloudCustomer>(this, {
				method: "PUT",
				path: "cloud/customer",
				type: ContentType.JSON
			}),
			/**
			 * @description Updates the company address for the LOOP Cloud customer bound to this installation.
			 * Must have manage_system permission and be licensed for Cloud.
			 * Minimum server version: 5.29 Note: This is intended for internal use and is subject to change.
			 */
			updateAddress: bindApiCall<CloudUpdateAddressArguments, CloudCustomer>(
				this,
				{
					method: "PUT",
					path: "cloud/customer/address",
					type: ContentType.JSON
				}
			),
			validateBusinessEmail: bindApiCall<
				CloudValidateBusinessEmailArguments,
				StatusOKResponse
			>(this, {
				method: "POST",
				path: "cloud/validate_business_email",
				type: ContentType.JSON
			}),
			confirmPayment: bindApiCall<
				CloudConfirmCustomerPaymentArguments,
				StatusOKResponse
			>(this, {
				method: "POST",
				path: "cloud/payment/confirm",
				type: ContentType.JSON
			})
		},
		invoices: {
			get: bindApiCallWithOptionalArg<never, CloudInvoice[]>(this, {
				method: "GET",
				path: "cloud/invoices",
				type: ContentType.URLEncoded
			})
		},
		subscription: {
			get: bindApiCallWithOptionalArg<never, CloudSubscription>(this, {
				method: "GET",
				path: "cloud/subscription",
				type: ContentType.URLEncoded
			}),
			update: bindApiCallWithOptionalArg<never, CloudSubscription>(this, {
				method: "PUT",
				path: "cloud/subscription",
				type: ContentType.JSON
			})
		},
		products: {
			get: bindApiCallWithOptionalArg<never, CloudProduct[]>(this, {
				method: "GET",
				path: "cloud/products",
				type: ContentType.URLEncoded
			})
		},
		limits: {
			get: bindApiCallWithOptionalArg<never, CloudLimits>(this, {
				method: "GET",
				path: "cloud/limits",
				type: ContentType.URLEncoded
			})
		}
	} as const;

	/**
	 * ============================================================================
	 * @description Data retention methods
	 * ============================================================================
	 */
	public readonly dataRetention = {
		policies: {
			create: bindApiCall<
				DataRetentionCreatePolicyArguments,
				DataRetentionCustomPolicies
			>(this, {
				method: "POST",
				path: "data_retention/policies",
				type: ContentType.JSON
			}),
			get: bindApiCall<
				DataRetentionGetPolicyArguments,
				DataRetentionCustomPolicies
			>(this, {
				method: "GET",
				path: "data_retention/policies/:policy_id",
				type: ContentType.URLEncoded
			}),
			delete: bindApiCall<DataRetentionDeletePolicyArguments, StatusOKResponse>(
				this,
				{
					method: "DELETE",
					path: "data_retention/policies/:policy_id",
					type: ContentType.URLEncoded
				}
			),
			update: bindApiCall<
				DataRetentionUpdatePolicyArguments,
				DataRetentionCustomPolicies
			>(this, {
				method: "PUT",
				path: "data_retention/policies/:policy_id",
				type: ContentType.JSON
			}),
			patch: bindApiCall<
				DataRetentionPatchPolicyArguments,
				DataRetentionCustomPolicies
			>(this, {
				method: "PATCH",
				path: "data_retention/policies/:policy_id",
				type: ContentType.JSON
			}),
			list: bindApiCall<
				DataRetentionGetPoliciesArguments,
				DataRetentionCustomPolicies[]
			>(this, {
				method: "GET",
				path: "data_retention/policies",
				type: ContentType.URLEncoded
			}),
			teams: {
				search: bindApiCall<DataRetentionSearchPolicyTeamsArguments, Team[]>(
					this,
					{
						method: "POST",
						path: "data_retention/policies/:policy_id/teams/search",
						type: ContentType.JSON
					}
				),
				add: bindApiCall<
					DataRetentionAddPolicyTeamsArguments,
					StatusOKResponse
				>(this, {
					method: "POST",
					path: "data_retention/policies/:policy_id/teams",
					type: ContentType.JSON
				}),
				remove: bindApiCall<
					DataRetentionRemovePolicyTeamsArguments,
					StatusOKResponse
				>(this, {
					method: "DELETE",
					path: "data_retention/policies/:policy_id/teams/:team_id",
					type: ContentType.URLEncoded
				}),
				get: bindApiCall<DataRetentionGetPolicyTeamsArguments, Team[]>(this, {
					method: "GET",
					path: "data_retention/policies/:policy_id/teams",
					type: ContentType.URLEncoded
				})
			},
			channels: {
				search: bindApiCall<
					DataRetentionSearchPolicyChannelsArguments,
					Channel[]
				>(this, {
					method: "POST",
					path: "data_retention/policies/:policy_id/channels/search",
					type: ContentType.JSON
				}),
				add: bindApiCall<
					DataRetentionAddPolicyChannelsArguments,
					StatusOKResponse
				>(this, {
					method: "POST",
					path: "data_retention/policies/:policy_id/channels",
					type: ContentType.JSON
				}),
				remove: bindApiCall<
					DataRetentionRemovePolicyChannelsArguments,
					StatusOKResponse
				>(this, {
					method: "DELETE",
					path: "data_retention/policies/:policy_id/channels/:channel_id",
					type: ContentType.URLEncoded
				}),
				get: bindApiCall<DataRetentionGetPolicyChannelsArguments, Channel[]>(
					this,
					{
						method: "GET",
						path: "data_retention/policies/:policy_id/channels",
						type: ContentType.URLEncoded
					}
				)
			}
		},
		users: {
			getTeams: bindApiCall<
				DataRetentionGetUserTeamPoliciesArguments,
				DataRetentionCustomPolicies[]
			>(this, {
				method: "GET",
				path: "users/:user_id/teams/data_retention/policies",
				type: ContentType.URLEncoded
			}),
			getChannels: bindApiCall<
				DataRetentionGetUserChannelPoliciesArguments,
				DataRetentionCustomPolicies[]
			>(this, {
				method: "GET",
				path: "users/:user_id/channels/data_retention/policies",
				type: ContentType.URLEncoded
			})
		},
		policy: {
			get: bindApiCallWithOptionalArg<never, DataRetentionCustomPolicies>(
				this,
				{
					method: "GET",
					path: "data_retention/policy",
					type: ContentType.URLEncoded
				}
			)
		},
		policiesCount: {
			get: bindApiCallWithOptionalArg<never, { count: number }>(this, {
				method: "GET",
				path: "data_retention/policies_count",
				type: ContentType.URLEncoded
			})
		}
	} as const;

	/**
	 * ============================================================================
	 * @description Emojis methods
	 * ============================================================================
	 */
	public readonly emojis = {
		autocomplete: bindApiCall<EmojisAutocompleteArguments, CustomEmoji[]>(
			this,
			{
				method: "GET",
				path: "emoji/autocomplete",
				type: ContentType.URLEncoded
			}
		),
		create: bindApiCall<EmojisCreateArguments, CustomEmoji>(this, {
			method: "POST",
			path: "emoji",
			type: ContentType.FormData
		}),
		list: bindApiCall<EmojisGetListArguments, CustomEmoji[]>(this, {
			method: "GET",
			path: "emoji",
			type: ContentType.URLEncoded
		}),
		get: {
			byId: bindApiCall<EmojisGetArguments, CustomEmoji>(this, {
				method: "GET",
				path: "emoji/:emoji_id",
				type: ContentType.URLEncoded
			}),
			byName: bindApiCall<EmojisGetByNameArguments, CustomEmoji>(this, {
				method: "GET",
				path: "emoji/name/:name",
				type: ContentType.URLEncoded
			})
		},
		delete: bindApiCall<EmojisDeleteArguments, StatusOKResponse>(this, {
			method: "DELETE",
			path: "emoji/:emoji_id",
			type: ContentType.JSON
		}),
		getImage: bindApiCall<EmojisGetImageArguments, Blob>(this, {
			method: "GET",
			path: "emoji/:emoji_id/image",
			type: ContentType.URLEncoded
		}),
		search: bindApiCall<EmojisSearchArguments, CustomEmoji[]>(this, {
			method: "POST",
			path: "emoji/search",
			type: ContentType.JSON
		})
	} as const;

	/**
	 * ============================================================================
	 * @description Files methods
	 * ============================================================================
	 */
	public readonly files = {
		/**
		 * Upload a file
		 *
		 * @description Uploads a file that can later be attached to a post.
		 * This request can either be a multipart/form-data request with a channel_id,
		 * files and optional client_ids defined in the FormData, or it can be a request
		 * with the channel_id and filename defined as query parameters with the contents of a single file in the body of the request.
		 *
		 * Only multipart/form-data requests are supported by server versions up to and including 4.7.
		 * Server versions 4.8 and higher support both types of requests.
		 *
		 * Must have upload_file permission.
		 *
		 * @see https://developers.loop.ru/API/4.0.0/upload-file
		 */
		upload: bindApiCall<FilesUploadArguments, FileUploadResponse>(this, {
			method: "POST",
			path: "files",
			type: ContentType.FormData
		}),
		/**
		 * @description Get file and various file-related data
		 */
		get: {
			/**
			 * Get a file
			 *
			 * @description Gets a file that has been uploaded previously.
			 *
			 * Must have read_channel permission or be uploader of the file.
			 */
			file: bindApiCall<FilesGetArguments, Blob>(this, {
				method: "GET",
				path: "files/:file_id",
				type: ContentType.URLEncoded
			}),
			/**
			 * Get metadata for a file
			 *
			 * @description Gets a file's info.
			 *
			 * Must have read_channel permission or be uploader of the file.
			 */
			metadata: bindApiCall<FilesGetMetadataArguments, FileInfo>(this, {
				method: "GET",
				path: "files/:file_id/info",
				type: ContentType.URLEncoded
			}),
			/**
			 * Get a file's preview
			 *
			 * @description Gets a file's preview.
			 *
			 * Must have read_channel permission or be uploader of the file.
			 */
			preview: bindApiCall<FilesGetPreviewArguments, Blob>(this, {
				method: "GET",
				path: "files/:file_id/preview",
				type: ContentType.URLEncoded
			}),
			/**
			 * Get a public file link
			 *
			 * @description Gets a public link for a file that can be accessed without logging into LOOP.
			 *
			 * Must have read_channel permission or be uploader of the file.
			 */
			publicLink: bindApiCall<FilesGetPublicLinkArguments, { link: string }>(
				this,
				{
					method: "GET",
					path: "files/:file_id/link",
					type: ContentType.URLEncoded
				}
			),

			/**
			 * Get a public file
			 *
			 * No permissions required.
			 */
			publicFile: bindApiCall<FilesGetPublicArguments, Blob>(this, {
				method: "GET",
				path: "files/:file_id/public",
				type: ContentType.URLEncoded
			}),

			/**
			 * Get a file's thumbnail
			 *
			 * @description Gets a file's thumbnail.
			 *
			 * Must have read_channel permission or be uploader of the file.
			 */
			thumbnail: bindApiCall<FilesGetThumbnailArguments, Blob>(this, {
				method: "GET",
				path: "files/:file_id/thumbnail",
				type: ContentType.URLEncoded
			})
		},
		/**
		 * Search files in team
		 *
		 * @description Search for files in a team based on file name, extention and file content
		 * (if file content extraction is enabled and supported for the files).
		 * Must be authenticated and have the view_team permission.
		 *
		 * @version 5.34+
		 *
		 * @see https://developers.loop.ru/API/4.0.0/search-files
		 */
		search: bindApiCall<FilesSearchArguments, FileSearchResponse>(this, {
			method: "POST",
			path: "teams/:team_id/files/search",
			type: ContentType.JSON
		})
	} as const;

	/**
	 * ============================================================================
	 * @description Integrations methods
	 * ============================================================================
	 */
	public readonly integrations = {
		/**
		 * ============================================================================
		 * @description Integration interactive dialogs methods
		 * ============================================================================
		 */
		dialogs: {
			/**
			 * @description Open an interactive dialog using a trigger ID provided
			 * by a slash command, or some other action payload.
			 * @see {@link https://docs.loop.ru/developer/interactive-dialogs.html | Interactive Dialogs}
			 * for more information on interactive dialogs.
			 * Minimum server @version 5.6
			 */
			open: bindApiCall<InteractiveOpenDialogArguments, StatusOKResponse>(
				this,
				{
					method: "POST",
					path: "actions/dialogs/open",
					type: ContentType.JSON
				}
			),
			/**
			 * @description Endpoint used by the LOOP clients to submit a dialog.
			 * @see {@link https://docs.loop.ru/developer/interactive-dialogs.html | Interactive Dialogs}
			 * for more information on interactive dialogs.
			 * Minimum server @version 5.6
			 */
			submit: bindApiCall<InteractiveSubmitDialogArguments, StatusOKResponse>(
				this,
				{
					method: "POST",
					path: "actions/dialogs/submit",
					type: ContentType.JSON
				}
			)
		},

		/**
		 * ============================================================================
		 * @description Integration commands methods
		 * ============================================================================
		 */
		commands: {
			/**
			 * @description Create a command for a team.
			 * `manage_slash_commands` for the team the command is in.
			 */
			create: bindApiCall<CommandsCreateArguments, Command>(this, {
				method: "POST",
				path: "commands",
				type: ContentType.JSON
			}),
			/**
			 * @description List commands for a team.
			 * @permission `manage_slash_commands` if need to list custom commands.
			 */
			update: bindApiCall<CommandsUpdateArguments, Command>(this, {
				method: "PUT",
				path: "commands/:id",
				type: ContentType.JSON
			}),
			/**
			 * @description List autocomplete commands in the team.
			 * @permisstion `view_team` for the team.
			 */
			delete: bindApiCall<CommandsDeleteArguments, StatusOKResponse>(this, {
				method: "DELETE",
				path: "commands/:command_id",
				type: ContentType.URLEncoded
			}),
			list: bindApiCall<CommandsListArguments, Command[]>(this, {
				method: "GET",
				path: "commands",
				type: ContentType.URLEncoded
			}),
			regenerateToken: bindApiCall<
				CommandsRegenerateTokenArguments,
				{ token: string }
			>(this, {
				method: "PUT",
				path: "commands/:command_id/regen_token",
				type: ContentType.JSON
			}),
			execute: bindApiCall<CommandsExecuteArguments, StatusOKResponse>(this, {
				method: "POST",
				path: "commands/execute",
				type: ContentType.JSON
			}),
			listAutocomplete: bindApiCall<
				CommandsListAutocompleteArguments,
				Command[]
			>(this, {
				method: "GET",
				path: "teams/:team_id/commands/autocomplete",
				type: ContentType.URLEncoded
			})
		},

		/**
		 * ============================================================================
		 * @description Integration webhooks methods
		 * ============================================================================
		 */
		webhooks: {
			incoming: {
				create: bindApiCall<IncomingWebhooksCreateArguments, IncomingWebhook>(
					this,
					{
						method: "POST",
						path: "hooks/incoming",
						type: ContentType.JSON
					}
				),
				update: bindApiCall<IncomingWebhooksUpdateArguments, IncomingWebhook>(
					this,
					{
						method: "PUT",
						path: "hooks/incoming/:id",
						type: ContentType.JSON
					}
				),
				delete: bindApiCall<IncomingWebhooksDeleteArguments, StatusOKResponse>(
					this,
					{
						method: "DELETE",
						path: "hooks/incoming/:hook_id",
						type: ContentType.URLEncoded
					}
				),
				list: bindApiCall<IncomingWebhooksListArguments, IncomingWebhook[]>(
					this,
					{
						method: "GET",
						path: "hooks/incoming",
						type: ContentType.URLEncoded
					}
				),
				get: bindApiCall<IncomingWebhooksGetArguments, IncomingWebhook>(this, {
					method: "GET",
					path: "hooks/incoming/:hook_id",
					type: ContentType.URLEncoded
				})
			},
			outgoing: {
				create: bindApiCall<OutgoingWebhooksCreateArguments, OutgoingWebhook>(
					this,
					{
						method: "POST",
						path: "hooks/outgoing",
						type: ContentType.JSON
					}
				),
				update: bindApiCall<OutgoingWebhooksUpdateArguments, OutgoingWebhook>(
					this,
					{
						method: "PUT",
						path: "hooks/outgoing/:id",
						type: ContentType.JSON
					}
				),
				delete: bindApiCall<OutgoingWebhooksDeleteArguments, StatusOKResponse>(
					this,
					{
						method: "DELETE",
						path: "hooks/outgoing/:hook_id",
						type: ContentType.URLEncoded
					}
				),
				list: bindApiCall<OutgoingWebhooksListArguments, OutgoingWebhook[]>(
					this,
					{
						method: "GET",
						path: "hooks/outgoing",
						type: ContentType.URLEncoded
					}
				),
				get: bindApiCall<OutgoingWebhooksGetArguments, OutgoingWebhook>(this, {
					method: "GET",
					path: "hooks/outgoing/:hook_id",
					type: ContentType.URLEncoded
				}),
				regenerateToken: bindApiCall<
					OutgoingWebhooksRegenerateTokenArguments,
					{ token: string }
				>(this, {
					method: "POST",
					path: "hooks/outgoing/:hook_id/regen_token",
					type: ContentType.JSON
				})
			}
		},

		/**
		 * ============================================================================
		 * @description OAuth apps methods
		 * ============================================================================
		 */
		oauth: {
			apps: {
				create: bindApiCall<OAuthAppsCreateArguments, OAuthApp>(this, {
					method: "POST",
					path: "oauth/apps",
					type: ContentType.JSON
				}),
				update: bindApiCall<OAuthAppsUpdateArguments, OAuthApp>(this, {
					method: "PUT",
					path: "oauth/apps/:id",
					type: ContentType.JSON
				}),
				delete: bindApiCall<OAuthAppsDeleteArguments, StatusOKResponse>(this, {
					method: "DELETE",
					path: "oauth/apps/:app_id",
					type: ContentType.URLEncoded
				}),
				get: bindApiCall<OAuthAppsGetArguments, OAuthApp>(this, {
					method: "GET",
					path: "oauth/apps/:app_id",
					type: ContentType.URLEncoded
				}),
				getInfo: bindApiCall<OAuthAppsGetInfoArguments, OAuthApp>(this, {
					method: "GET",
					path: "oauth/apps/:app_id/info",
					type: ContentType.URLEncoded
				}),
				list: bindApiCall<OAuthAppsListArguments, OAuthApp[]>(this, {
					method: "GET",
					path: "oauth/apps",
					type: ContentType.URLEncoded
				}),
				regenerateSecret: bindApiCall<
					OAuthAppsRegenerateSecretArguments,
					OAuthApp
				>(this, {
					method: "POST",
					path: "oauth/apps/:app_id/regen_secret",
					type: ContentType.JSON
				})
			}
		}
	} as const;

	/**
	 * ============================================================================
	 * @description Groups methods
	 * ============================================================================
	 */
	public readonly groups = {
		/**
		 * @description Create a new group.
		 * Requires `manage_system` permission.
		 */
		create: bindApiCall<GroupsCreateArguments, Group>(this, {
			method: "POST",
			path: "groups",
			type: ContentType.JSON
		}),
		/**
		 * @description Retrieve a group by its ID.
		 * Requires `manage_system` permission.
		 */
		get: bindApiCall<GroupsGetArguments, Group>(this, {
			method: "GET",
			path: "groups/:group_id",
			type: ContentType.URLEncoded
		}),
		/**
		 * @description List all groups.
		 * Requires `manage_system` permission.
		 */
		list: bindApiCall<GroupsListArguments, Group[]>(this, {
			method: "GET",
			path: "groups",
			type: ContentType.URLEncoded
		}),
		update: bindApiCall<GroupsUpdateArguments, Group>(this, {
			method: "PUT",
			path: "groups/:group_id",
			type: ContentType.JSON
		}),
		delete: bindApiCall<GroupsDeleteArguments, StatusOKResponse>(this, {
			method: "DELETE",
			path: "groups/:group_id",
			type: ContentType.URLEncoded
		}),
		patch: bindApiCall<GroupsPatchArguments, Group>(this, {
			method: "PUT",
			path: "groups/:group_id/patch",
			type: ContentType.JSON
		}),
		restore: bindApiCall<GroupsRestoreArguments, Group>(this, {
			method: "POST",
			path: "groups/:group_id/restore",
			type: ContentType.URLEncoded
		}),
		getStats: bindApiCall<GroupsGetStatsArguments, GroupStats>(this, {
			method: "GET",
			path: "groups/:group_id/stats",
			type: ContentType.URLEncoded
		}),
		syncables: {
			list: bindApiCall<GroupsListSyncablesArguments, GroupSyncable[]>(this, {
				method: "GET",
				path: "groups/:group_id/syncables",
				type: ContentType.URLEncoded
			}),
			add: bindApiCall<GroupsAddSyncableArguments, GroupSyncable>(this, {
				method: "POST",
				path: "groups/:group_id/syncables",
				type: ContentType.JSON
			}),
			remove: bindApiCall<GroupsRemoveSyncableArguments, StatusOKResponse>(
				this,
				{
					method: "DELETE",
					path: "groups/:group_id/syncables/:syncable_id?syncable_type=:syncable_type",
					type: ContentType.URLEncoded
				}
			),
			patch: bindApiCall<GroupsPatchSyncableArguments, GroupSyncable>(this, {
				method: "PUT",
				path: "groups/:group_id/syncables/:syncable_id/patch",
				type: ContentType.JSON
			})
		},

		/**
		 * ============================================================================
		 * @description Group members methods
		 * ============================================================================
		 */
		members: {
			/**
			 * @description Get groups for a user.
			 */
			listForUser: bindApiCall<GroupsListForUserArguments, Group[]>(this, {
				method: "GET",
				path: "users/:user_id/groups",
				type: ContentType.URLEncoded
			}),
			/**
			 * @description Get members of a group.
			 */
			get: bindApiCall<
				GroupsMembersGetArguments,
				{ members: GroupMembership[]; total_member_count: number }
			>(this, {
				method: "GET",
				path: "groups/:group_id/members",
				type: ContentType.URLEncoded
			}),
			/**
			 * @description Add members to a custom group.
			 */
			add: bindApiCall<
				GroupsMembersAddArguments,
				{ members: GroupMembership[] }
			>(this, {
				method: "POST",
				path: "groups/:group_id/members",
				type: ContentType.JSON
			}),
			/**
			 * @description Remove members from a custom group.
			 */
			remove: bindApiCall<GroupsMembersRemoveArguments, StatusOKResponse>(
				this,
				{
					method: "DELETE",
					path: "groups/:group_id/members",
					type: ContentType.JSON
				}
			)
		},
		teams: {
			/**
			 * @description Get a group's teams.
			 */
			get: bindApiCall<GroupsTeamsGetArguments, GroupSyncable[]>(this, {
				method: "GET",
				path: "groups/:group_id/teams",
				type: ContentType.URLEncoded
			})
		},
		channels: {
			/**
			 * @description Get a group's channels.
			 */
			get: bindApiCall<GroupsChannelsGetArguments, GroupSyncable[]>(this, {
				method: "GET",
				path: "groups/:group_id/channels",
				type: ContentType.URLEncoded
			})
		},
		deleteLdapLink: bindApiCall<
			GroupsDeleteLdapLinkArguments,
			StatusOKResponse
		>(this, {
			method: "DELETE",
			path: "groups/:group_id/link",
			type: ContentType.URLEncoded
		})
	} as const;

	/**
	 * ============================================================================
	 * @description Jobs methods
	 * ============================================================================
	 */
	public readonly jobs = {
		/**
		 * @description Create a new job.
		 * Requires `manage_jobs` permission.
		 */
		create: bindApiCall<JobsCreateArguments, Job>(this, {
			method: "POST",
			path: "jobs",
			type: ContentType.JSON
		}),
		/**
		 * @description Retrieve a job by its ID.
		 */
		get: bindApiCall<JobsGetArguments, Job>(this, {
			method: "GET",
			path: "jobs/:job_id",
			type: ContentType.URLEncoded
		}),
		/**
		 * @description List all jobs.
		 */
		list: {
			all: bindApiCall<JobsListArguments, Job[]>(this, {
				method: "GET",
				path: "jobs",
				type: ContentType.URLEncoded
			}) /**
			 * @description List jobs by type.
			 */,
			byType: bindApiCall<JobsListByTypeArguments, Job[]>(this, {
				method: "GET",
				path: "jobs/type/:type",
				type: ContentType.URLEncoded
			})
		},
		/**
		 * @description Cancel a job.
		 */
		cancel: bindApiCall<JobsCancelArguments, StatusOKResponse>(this, {
			method: "POST",
			path: "jobs/:job_id/cancel",
			type: ContentType.JSON
		})
	} as const;

	/**
	 * ============================================================================
	 * @description Plugins methods
	 * ============================================================================
	 */
	public readonly plugins = {
		/**
		 * @description Upload a plugin.
		 * Requires `manage_system` permission.
		 */
		upload: bindApiCall<PluginsUploadArguments, PluginManifest>(this, {
			method: "POST",
			path: "plugins",
			type: ContentType.FormData
		}),
		install: {
			fromUrl: bindApiCall<PluginsInstallFromUrlArguments, PluginManifest>(
				this,
				{
					method: "POST",
					path: "plugins/install_from_url",
					type: ContentType.JSON
				}
			),
			fromMarketplace: bindApiCall<
				PluginsInstallFromMarketplaceArguments,
				PluginManifest
			>(this, {
				method: "POST",
				path: "plugins/marketplace",
				type: ContentType.JSON
			})
		},
		remove: bindApiCall<PluginsRemoveArguments, StatusOKResponse>(this, {
			method: "DELETE",
			path: "plugins/:plugin_id",
			type: ContentType.URLEncoded
		}),
		enable: bindApiCall<PluginsEnableArguments, StatusOKResponse>(this, {
			method: "POST",
			path: "plugins/:plugin_id/enable",
			type: ContentType.URLEncoded
		}),
		disable: bindApiCall<PluginsDisableArguments, StatusOKResponse>(this, {
			method: "POST",
			path: "plugins/:plugin_id/disable",
			type: ContentType.URLEncoded
		}),
		get: bindApiCallWithOptionalArg<never, PluginsGetResponse>(this, {
			method: "GET",
			path: "plugins",
			type: ContentType.URLEncoded
		}),
		getWebapp: bindApiCallWithOptionalArg<
			PluginsGetWebAppArguments,
			PluginManifest[]
		>(this, {
			method: "GET",
			path: "plugins/webapp",
			type: ContentType.URLEncoded
		}),
		getStatuses: bindApiCallWithOptionalArg<never, PluginStatus[]>(this, {
			method: "GET",
			path: "plugins/statuses",
			type: ContentType.URLEncoded
		}),
		getMarketplace: bindApiCall<
			PluginsGetMarketplaceArguments,
			PluginManifest[]
		>(this, {
			method: "GET",
			path: "plugins/marketplace",
			type: ContentType.URLEncoded
		})
	} as const;

	/**
	 * ============================================================================
	 * @description Roles methods
	 * ============================================================================
	 */
	public readonly roles = {
		get: {
			/**
			 * @description Retrieve a role by its ID.
			 */
			byId: bindApiCall<RolesGetArguments, Role>(this, {
				method: "GET",
				path: "roles/:role_id",
				type: ContentType.URLEncoded
			}),
			byName: bindApiCall<RolesGetByNameArguments, Role>(this, {
				method: "GET",
				path: "roles/name/:name",
				type: ContentType.URLEncoded
			}),
			byNames: bindApiCall<RolesGetByNamesArguments, Role[]>(this, {
				method: "POST",
				path: "roles/names",
				type: ContentType.JSON
			})
		},
		patch: bindApiCall<RolesPatchArguments, Role>(this, {
			method: "PUT",
			path: "roles/:role_id/patch",
			type: ContentType.JSON
		})
	} as const;

	/**
	 * ============================================================================
	 * @description Schemes methods
	 * ============================================================================
	 */
	public readonly schemes = {
		create: bindApiCall<SchemesCreateArguments, Scheme>(this, {
			method: "POST",
			path: "schemes",
			type: ContentType.JSON
		}),
		delete: bindApiCall<SchemesDeleteArguments, StatusOKResponse>(this, {
			method: "DELETE",
			path: "schemes/:scheme_id",
			type: ContentType.URLEncoded
		}),
		get: bindApiCall<SchemesGetArguments, Scheme>(this, {
			method: "GET",
			path: "schemes/:scheme_id",
			type: ContentType.URLEncoded
		}),
		getChannels: bindApiCall<SchemesGetChannelsArguments, Channel[]>(this, {
			method: "GET",
			path: "schemes/:scheme_id/channels",
			type: ContentType.URLEncoded
		}),
		getTeams: bindApiCall<SchemesGetTeamsArguments, Team[]>(this, {
			method: "GET",
			path: "schemes/:scheme_id/teams",
			type: ContentType.URLEncoded
		}),
		list: bindApiCall<SchemesListArguments, Scheme[]>(this, {
			method: "GET",
			path: "schemes",
			type: ContentType.URLEncoded
		}),
		patch: bindApiCall<SchemesPatchArguments, Scheme>(this, {
			method: "PUT",
			path: "schemes/:scheme_id/patch",
			type: ContentType.JSON
		})
	} as const;

	/**
	 * ============================================================================
	 * @description Teams methods
	 * ============================================================================
	 */
	public readonly teams = {
		create: bindApiCall<TeamsCreateArguments, Team>(this, {
			method: "POST",
			path: "teams",
			type: ContentType.JSON
		}),
		list: bindApiCallWithOptionalArg<TeamsGetArguments, Team[]>(this, {
			method: "GET",
			path: "teams",
			type: ContentType.URLEncoded
		}),
		get: {
			byId: bindApiCall<TeamsGetByIdArguments, Team>(this, {
				method: "GET",
				path: "teams/:team_id",
				type: ContentType.URLEncoded
			}),
			byName: bindApiCall<TeamsGetByNameArguments, Team>(this, {
				method: "GET",
				path: "teams/name/:name",
				type: ContentType.URLEncoded
			})
		},
		update: bindApiCall<TeamsUpdateArguments, Team>(this, {
			method: "PUT",
			path: "teams/:id",
			type: ContentType.JSON
		}),
		delete: bindApiCall<TeamsDeleteArguments, StatusOKResponse>(this, {
			method: "DELETE",
			path: "teams/:team_id",
			type: ContentType.URLEncoded
		}),
		patch: bindApiCall<TeamsPatchArguments, Team>(this, {
			method: "PUT",
			path: "teams/:team_id/patch",
			type: ContentType.JSON
		}),
		regenerateInviteId: bindApiCall<TeamsRegenerateInviteIdArguments, Team>(
			this,
			{
				method: "POST",
				path: "teams/:team_id/regenerate_invite_id",
				type: ContentType.URLEncoded
			}
		),
		getStats: bindApiCall<TeamsGetStatsArguments, TeamStats>(this, {
			method: "GET",
			path: "teams/:team_id/stats",
			type: ContentType.URLEncoded
		}),
		search: bindApiCall<TeamsSearchArguments, Team[]>(this, {
			method: "POST",
			path: "teams/search",
			type: ContentType.JSON
		}),
		checkNameExists: bindApiCall<
			TeamsCheckNameExistsArguments,
			{ exists: boolean }
		>(this, {
			method: "GET",
			path: "teams/name/:name/exists",
			type: ContentType.URLEncoded
		}),
		import: bindApiCall<TeamsImportArguments, { results: string }>(this, {
			method: "POST",
			path: "teams/import",
			type: ContentType.FormData
		}),
		icon: {
			set: bindApiCall<TeamsSetIconArguments, StatusOKResponse>(this, {
				method: "POST",
				path: "teams/:team_id/image",
				type: ContentType.FormData
			}),
			remove: bindApiCall<TeamsRemoveIconArguments, StatusOKResponse>(this, {
				method: "DELETE",
				path: "teams/:team_id/image",
				type: ContentType.URLEncoded
			}),
			get: bindApiCall<TeamsGetIconArguments, Blob>(this, {
				method: "GET",
				path: "teams/:team_id/image",
				type: ContentType.URLEncoded
			})
		},
		members: {
			/**
			 * @description Get a page of team members list.
			 * Requires `view_team` permission.
			 */
			list: bindApiCall<TeamsMembersListArguments, TeamMembership[]>(this, {
				method: "GET",
				path: "teams/:team_id/members",
				type: ContentType.URLEncoded
			}),
			/**
			 * @description Add a user to a team.
			 * Requires `add_user_to_team` permission.
			 */
			add: bindApiCall<TeamsMemberAddArguments, TeamMembership>(this, {
				method: "POST",
				path: "teams/:team_id/members",
				type: ContentType.JSON
			}),
			/**
			 * @description Add a number of users to a team.
			 * Requires `add_user_to_team` permission.
			 */
			addBatch: bindApiCall<
				TeamsMemberAddBatchArguments,
				TeamMemberWithError[]
			>(this, {
				method: "POST",
				path: "teams/:team_id/members/batch",
				type: ContentType.JSON
			}),
			/**
			 * @description Get a team member.
			 */
			get: bindApiCall<TeamsMemberGetArguments, TeamMembership>(this, {
				method: "GET",
				path: "teams/:team_id/members/:user_id",
				type: ContentType.URLEncoded
			}),
			/**
			 * @description Remove a user from a team.
			 * Requires `remove_user_from_team` permission.
			 */
			remove: bindApiCall<TeamsMemberRemoveArguments, StatusOKResponse>(this, {
				method: "DELETE",
				path: "teams/:team_id/members/:user_id",
				type: ContentType.URLEncoded
			}),
			/**
			 * @description Get a list of team members based on user IDs.
			 */
			getByIds: bindApiCall<TeamsMembersGetByIdsArguments, TeamMembership[]>(
				this,
				{
					method: "POST",
					path: "teams/:team_id/members/ids",
					type: ContentType.JSON
				}
			),
			/**
			 * @description Update the roles of a team member.
			 */
			updateRoles: bindApiCall<
				TeamsMemberUpdateRolesArguments,
				StatusOKResponse
			>(this, {
				method: "PUT",
				path: "teams/:team_id/members/:user_id/roles",
				type: ContentType.JSON
			}),
			/**
			 * @description Update the scheme-derived roles of a team member.
			 */
			updateSchemeRoles: bindApiCall<
				TeamsMemberUpdateSchemeRolesArguments,
				StatusOKResponse
			>(this, {
				method: "PUT",
				path: "teams/:team_id/members/:user_id/scheme_roles",
				type: ContentType.JSON
			})
		}
	} as const;

	public readonly playbooks = {
		list: bindApiCall<PlaybooksListArguments, PlaybooksListResponse>(this, {
			method: "GET",
			path: "playbooks",
			type: ContentType.URLEncoded
		}),
		get: bindApiCall<PlaybooksGetArguments, PlaybooksGetResponse>(this, {
			method: "GET",
			path: "/playbooks/:id",
			type: ContentType.URLEncoded
		}),
		create: bindApiCall<PlaybooksCreateArguments, PlaybooksCreateResponse>(
			this,
			{
				method: "POST",
				path: "playbooks",
				type: ContentType.JSON
			}
		),
		update: bindApiCall<PlaybooksUpdateArguments, PlaybooksUpdateResponse>(
			this,
			{
				method: "PUT",
				path: "playbooks",
				type: ContentType.JSON
			}
		),
		delete: bindApiCall<PlaybooksDeleteArguments, never>(this, {
			method: "DELETE",
			path: `playbooks/:id`,
			type: ContentType.URLEncoded
		}),
		runs: {
			get: bindApiCall<PlaybookRunsGetArguments, PlaybookRunsGetResponse>(
				this,
				{
					method: "GET",
					path: "runs/:id",
					type: ContentType.URLEncoded
				}
			),
			create: bindApiCall<
				PlaybookRunsCreateArguments,
				PlaybookRunsCreateResponse
			>(this, {
				method: "POST",
				path: "runs",
				type: ContentType.JSON
			}),
			list: bindApiCall<PlaybookRunsListArguments, PlaybooksRunsListResponse>(
				this,
				{
					method: "GET",
					path: "runs",
					type: ContentType.URLEncoded
				}
			)
		}
	} as const;

	/**
	 * ============================================================================
	 * @description Posts methods
	 * ============================================================================
	 */
	public readonly posts = {
		create: bindApiCall<PostsCreateArguments, Post>(this, {
			method: "POST",
			path: "posts",
			type: ContentType.JSON
		}),
		/**
		 * @description Create an ephemeral post.
		 * Creates a new ephemeral post that is visible only to the specified user.
		 */
		createEphemeral: bindApiCall<PostsCreateEphemeralArguments, Post>(this, {
			method: "POST",
			path: "posts/ephemeral",
			type: ContentType.JSON
		}),
		update: bindApiCall<PostsUpdateArguments, Post>(this, {
			method: "PUT",
			path: "posts/:id",
			type: ContentType.JSON
		}),
		get: bindApiCall<PostsGetArguments, Post>(this, {
			method: "GET",
			path: "posts/:post_id",
			type: ContentType.URLEncoded
		}),
		delete: bindApiCall<PostsDeleteArguments, StatusOKResponse>(this, {
			method: "DELETE",
			path: "posts/:post_id",
			type: ContentType.URLEncoded
		}),
		getThread: bindApiCall<PostsGetThreadArguments, PostListResponse>(this, {
			method: "GET",
			path: "posts/:post_id/thread",
			type: ContentType.URLEncoded
		}),
		getForChannel: bindApiCall<PostsGetForChannelArguments, PostListResponse>(
			this,
			{
				method: "GET",
				path: "channels/:channel_id/posts",
				type: ContentType.URLEncoded
			}
		),
		pin: bindApiCall<PostsPinArguments, StatusOKResponse>(this, {
			method: "POST",
			path: "posts/:post_id/pin",
			type: ContentType.URLEncoded
		}),
		unpin: bindApiCall<PostsUnpinArguments, StatusOKResponse>(this, {
			method: "POST",
			path: "posts/:post_id/unpin",
			type: ContentType.URLEncoded
		}),
		move: bindApiCall<PostsMoveArguments, StatusOKResponse>(this, {
			method: "POST",
			path: "posts/:post_id/move",
			type: ContentType.JSON
		}),

		/**
		 * @description Mark a channel as being unread from a given post.
		 * Sets the last viewed at timestamp for the user's channel to the post's create_at timestamp.
		 */
		setUnread: bindApiCall<PostsMarkAsUnreadArguments, StatusOKResponse>(this, {
			method: "POST",
			path: "users/:user_id/posts/:post_id/set_unread",
			type: ContentType.JSON
		}),

		/**
		 * @description Partially update a post.
		 * Updates a post by providing only the fields that need to change.
		 */
		patch: bindApiCall<PostsPatchArguments, Post>(this, {
			method: "PUT",
			path: "posts/:post_id/patch",
			type: ContentType.JSON
		}),

		/**
		 * @description Get a list of flagged posts for a user.
		 * Retrieves posts that the specified user has flagged/saved.
		 */
		getFlagged: bindApiCall<PostsGetFlaggedArguments, PostListResponse>(this, {
			method: "GET",
			path: "users/:user_id/posts/flagged",
			type: ContentType.URLEncoded
		}),

		/**
		 * @description Get file info for a post.
		 * Gets a list of file information objects for the files attached to a post.
		 */
		getFilesInfo: bindApiCall<PostsGetFileInfoArguments, FileInfo[]>(this, {
			method: "GET",
			path: "posts/:post_id/files/info",
			type: ContentType.URLEncoded
		}),

		/**
		 * @description Get posts around the last unread.
		 * Get the posts around the oldest unread post in a channel for a given user.
		 */
		getAroundUnread: bindApiCall<
			PostsGetAroundLastUnreadArguments,
			PostListResponse
		>(this, {
			method: "GET",
			path: "users/:user_id/channels/:channel_id/posts/unread",
			type: ContentType.URLEncoded
		}),

		/**
		 * @description Search posts in a team.
		 * Search posts in the specified team using the provided terms.
		 */
		search: bindApiCall<PostsSearchArguments, PostSearchResponse>(this, {
			method: "POST",
			path: "teams/:team_id/posts/search",
			type: ContentType.JSON
		}),

		/**
		 * @description Perform a post action.
		 * Perform an action on a post, such as clicking an interactive button.
		 */
		doAction: bindApiCall<PostsDoActionArguments, StatusOKResponse>(this, {
			method: "POST",
			path: "posts/:post_id/actions/:action_id",
			type: ContentType.JSON
		}),

		/**
		 * @description Get posts by IDs.
		 * Get a list of posts based on a provided list of post IDs.
		 */
		getByIds: bindApiCall<PostsGetByIdsArguments, Post[]>(this, {
			method: "POST",
			path: "posts/ids",
			type: ContentType.JSON
		}),

		/**
		 * @description Set a reminder for a post.
		 * Set a reminder for the specified user on the specified post.
		 */
		setReminder: bindApiCall<PostsSetReminderArguments, StatusOKResponse>(
			this,
			{
				method: "POST",
				path: "users/:user_id/posts/:post_id/reminder",
				type: ContentType.JSON
			}
		)
	} as const;

	/**
	 * ============================================================================
	 * @description Reactions methods
	 * ============================================================================
	 */
	public readonly reactions = {
		create: bindApiCall<ReactionsCreateArguments, Reaction>(this, {
			method: "POST",
			path: "reactions",
			type: ContentType.JSON
		}),
		getForPost: bindApiCall<ReactionsGetForPostArguments, Reaction[]>(this, {
			method: "GET",
			path: "posts/:post_id/reactions",
			type: ContentType.URLEncoded
		}),
		delete: bindApiCall<ReactionsDeleteArguments, StatusOKResponse>(this, {
			method: "DELETE",
			path: "users/:user_id/posts/:post_id/reactions/:emoji_name",
			type: ContentType.URLEncoded
		}),
		getBulk: bindApiCall<ReactionsGetBulkArguments, Record<string, Reaction[]>>(
			this,
			{
				method: "POST",
				path: "reactions/bulk",
				type: ContentType.JSON
			}
		)
	} as const;

	/**
	 * ============================================================================
	 * @description System methods
	 * ============================================================================
	 */
	public readonly system = {
		checkHealth: bindApiCallWithOptionalArg<
			SystemCheckHealthArguments,
			SystemCheckHealthResponse
		>(this, {
			method: "GET",
			path: "system/ping",
			type: ContentType.URLEncoded
		}),
		checkDatabaseIntegrity: bindApiCallWithOptionalArg<
			SystemCheckDatabaseIntegrityArguments,
			SystemCheckDatabaseIntegrityResponse
		>(this, {
			method: "POST",
			path: "system/check_integrity",
			type: ContentType.JSON
		}),
		getAnalytics: bindApiCall<SystemGetAnalyticsArguments, AnalyticsRow[]>(
			this,
			{
				method: "GET",
				path: "analytics/old",
				type: ContentType.URLEncoded
			}
		),
		getLogs: bindApiCall<SystemGetLogsArguments, string[]>(this, {
			method: "GET",
			path: "logs",
			type: ContentType.URLEncoded
		}),
		testEmail: bindApiCall<SystemTestEmailArguments, StatusOKResponse>(this, {
			method: "POST",
			path: "email/test",
			type: ContentType.JSON
		}),
		testS3Connection: bindApiCall<
			SystemTestS3ConnectionArguments,
			StatusOKResponse
		>(this, {
			method: "POST",
			path: "file/s3_test",
			type: ContentType.JSON
		}),
		testSiteURL: bindApiCall<SystemTestSiteURLArguments, StatusOKResponse>(
			this,
			{
				method: "POST",
				path: "site_url/test",
				type: ContentType.JSON
			}
		),
		updateConfig: bindApiCall<SystemUpdateConfigArguments, ClientConfig>(this, {
			method: "PUT",
			path: "config",
			type: ContentType.JSON
		}),
		uploadLogFile: bindApiCall<SystemUploadLogFileArguments, StatusOKResponse>(
			this,
			{
				method: "POST",
				path: "logs/upload",
				type: ContentType.FormData
			}
		)
	} as const;

	public readonly termsOfService = {
		create: bindApiCall<TermsOfServiceCreateArguments, TermsOfService>(this, {
			method: "POST",
			path: "terms_of_service",
			type: ContentType.JSON
		}),
		get: bindApiCall<TermsOfServiceGetArguments, TermsOfService>(this, {
			method: "GET",
			path: "terms_of_service",
			type: ContentType.URLEncoded
		}),
		update: bindApiCall<TermsOfServiceUpdateArguments, TermsOfService>(this, {
			method: "POST", // or PUT? Check if update is same as create or distinct.
			path: "terms_of_service/:term_id", // Usually ID
			type: ContentType.JSON
		})
	} as const;

	/**
	 * ============================================================================
	 * @description Uploads profile methods
	 * ============================================================================
	 */
	public readonly uploads = {
		create: bindApiCall<UploadsCreateArguments, UploadSession>(this, {
			method: "POST",
			path: "uploads",
			type: ContentType.JSON
		}),
		get: bindApiCall<UploadsGetArguments, UploadSession>(this, {
			method: "GET",
			path: "uploads/:upload_id",
			type: ContentType.URLEncoded
		}),
		upload: bindApiCall<UploadsUploadArguments, FileInfo>(this, {
			method: "POST",
			path: "uploads/:upload_id",
			type: ContentType.FormData
		})
	} as const;

	/**
	 * ============================================================================
	 * @description User methods
	 * ============================================================================
	 */
	public readonly users = {
		list: bindApiCallWithOptionalArg<UsersListArguments, UserProfile[]>(this, {
			method: "GET",
			path: "users",
			type: ContentType.URLEncoded
		}),
		autocomplete: bindApiCall<
			UsersAutocompleteArguments,
			{ users: UserProfile[]; out_of_channel?: UserProfile[] }
		>(this, {
			method: "GET",
			path: "users/autocomplete",
			type: ContentType.URLEncoded
		}),
		channels: {
			list: {
				inTeam: this.channels.list.forUserInTeam,
				all: this.channels.list.forUser
			},
			sidebar: {
				categories: {
					/**
					 * @description Get sidebar categories for a user in a team.
					 */
					list: bindApiCall<
						ChannelsCategoriesListArguments,
						{ order: string[]; categories: SidebarCategory[] }
					>(this, {
						method: "GET",
						path: "users/:user_id/teams/:team_id/channels/categories",
						type: ContentType.URLEncoded
					}),
					/**
					 * @description Create a new sidebar category.
					 */
					create: bindApiCall<
						ChannelsCategoriesCreateArguments,
						SidebarCategory
					>(this, {
						method: "POST",
						path: "users/:user_id/teams/:team_id/channels/categories",
						type: ContentType.JSON
					}),
					/**
					 * @description Update all sidebar categories for a user.
					 */
					updateAll: bindApiCall<
						ChannelsCategoriesUpdateAllArguments,
						SidebarCategory[]
					>(this, {
						method: "PUT",
						path: "users/:user_id/teams/:team_id/channels/categories",
						type: ContentType.JSON
					}),
					/**
					 * @description Get a specific sidebar category.
					 */
					get: bindApiCall<ChannelsCategoryGetArguments, SidebarCategory>(
						this,
						{
							method: "GET",
							path: "users/:user_id/teams/:team_id/channels/categories/:category_id",
							type: ContentType.URLEncoded
						}
					),
					/**
					 * @description Update a specific sidebar category.
					 */
					update: bindApiCall<ChannelsCategoryUpdateArguments, SidebarCategory>(
						this,
						{
							method: "PUT",
							path: "users/:user_id/teams/:team_id/channels/categories/:category_id",
							type: ContentType.JSON
						}
					),
					/**
					 * @description Delete a sidebar category.
					 */
					delete: bindApiCall<
						ChannelsCategoryDeleteArguments,
						StatusOKResponse
					>(this, {
						method: "DELETE",
						path: "users/:user_id/teams/:team_id/channels/categories/:category_id",
						type: ContentType.URLEncoded
					}),
					/**
					 * @description Get sidebar category order.
					 */
					getOrder: bindApiCall<ChannelsCategoriesOrderGetArguments, string[]>(
						this,
						{
							method: "GET",
							path: "users/:user_id/teams/:team_id/channels/categories/order",
							type: ContentType.URLEncoded
						}
					),
					/**
					 * @description Update sidebar category order.
					 */
					updateOrder: bindApiCall<
						ChannelsCategoriesOrderUpdateArguments,
						string[]
					>(this, {
						method: "PUT",
						path: "users/:user_id/teams/:team_id/channels/categories/order",
						type: ContentType.JSON
					})
				}
			}
		},

		getGroups: this.groups.members.listForUser,

		/**
		 * ============================================================================
		 * @description Guest methods
		 * ============================================================================
		 */
		guest: {
			toUser: bindApiCall<UserID, StatusOKResponse>(this, {
				method: "POST",
				path: `users/:user_id/promote`,
				type: ContentType.URLEncoded
			}),
			fromUser: bindApiCall<UserID, StatusOKResponse>(this, {
				method: "post",
				path: `users/:user_id/demote`,
				type: ContentType.URLEncoded
			})
		},

		/**
		 * ============================================================================
		 * @description User profile methods
		 * ============================================================================
		 */
		profile: {
			get: {
				/**
				 * @description Retrieve a user's profile information, including their custom status.
				 */
				me: bindApiCallWithOptionalArg<TokenOverridable, UserProfile>(this, {
					method: "GET",
					path: `users/:user_id`,
					type: ContentType.URLEncoded
				}),

				/**
				 * @description Retrieve a user's profile information, including their custom status.
				 */
				byId: bindApiCallWithOptionalArg<UsersProfileGetArguments, UserProfile>(
					this,
					{
						method: "GET",
						path: `users/:user_id`,
						type: ContentType.URLEncoded
					}
				),

				/**
				 * @description Find a user with an email address.
				 */
				byEmail: bindApiCall<UsersGetByEmailArguments, UserProfile>(this, {
					method: "GET",
					path: `users/email/:email`,
					type: ContentType.URLEncoded
				}),

				/**
				 * @description Find a user with an email address.
				 */
				byUsername: bindApiCall<UsersGetByUsernameArguments, UserProfile>(
					this,
					{
						method: "GET",
						path: `users/username/:username`,
						type: ContentType.URLEncoded
					}
				)
			},

			/**
			 * @description Set a user's profile information, including custom status.
			 * @see {@link https://docs.slack.dev/reference/methods/users.profile.set `users.profile.set` API reference}.
			 */
			patch: bindApiCall<UsersProfileSetArguments, UserProfile>(this, {
				method: "PUT",
				path: `users/:user_id`,
				type: ContentType.JSON
			}),
			/**
			 * @description Profile image methods
			 */
			image: {
				/**
				 * @description Set the user profile image.
				 */
				set: bindApiCall<UsersSetImageArguments, StatusOKResponse>(this, {
					method: "POST",
					path: `users/:user_id/image`,
					type: ContentType.URLEncoded
				}) /**
				 * @description Delete the user profile image.
				 */,
				delete: bindApiCallWithOptionalArg<
					UsersDeleteImageArguments,
					StatusOKResponse
				>(this, {
					method: "DELETE",
					path: `users/:user_id/image`,
					type: ContentType.URLEncoded
				})
			}
		},
		search: bindApiCall<UsersSearchArguments, UserProfile[]>(this, {
			method: "POST",
			path: "users/search",
			type: ContentType.JSON
		}),
		status: {
			/**
			 * @description Gets status for user
			 */
			get: bindApiCall<UsersStatusGetAruments, UserStatus>(this, {
				method: "GET",
				path: `users/:user_id/status`,
				type: ContentType.URLEncoded
			}),
			/**
			 * @description Update users status by id
			 * Must have edit_other_users permission for the team.
			 */
			set: bindApiCall<UsersStatusSetAruments, UserStatus>(this, {
				method: "PUT",
				path: `users/:user_id/status`,
				type: ContentType.JSON
			}),
			setCustom: bindApiCall<UsersCustomStatusSetArguments, UserCustomStatus>(
				this,
				{
					method: "PUT",
					path: `users/:user_id/status/custom`,
					type: ContentType.JSON
				}
			),
			unsetCustom: bindApiCall<
				UsersCustomStatusUnsetArguments,
				StatusOKResponse
			>(this, {
				method: "DELETE",
				path: `users/:user_id/status/custom`,
				type: ContentType.URLEncoded
			})
		},
		preferences: {
			get: bindApiCall<PreferencesGetArguments, PreferenceType[]>(this, {
				method: "GET",
				path: "users/:user_id/preferences",
				type: ContentType.URLEncoded
			}),
			save: bindApiCall<PreferencesSaveArguments, StatusOKResponse>(this, {
				method: "PUT",
				path: "users/:user_id/preferences",
				type: ContentType.JSON
			}),
			delete: bindApiCall<PreferencesDeleteArguments, StatusOKResponse>(this, {
				method: "POST",
				path: "users/:user_id/preferences/delete",
				type: ContentType.JSON
			})
		},

		updateRoles: bindApiCall<UsersUpdateRolesArguments, StatusOKResponse>(
			this,
			{
				method: "PUT",
				path: `users/:user_id/roles`,
				type: ContentType.URLEncoded
			}
		)
	} as const;
}
