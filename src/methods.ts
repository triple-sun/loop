import EventEmitter from "eventemitter3";
import type { Stream } from "form-data";
import type {
	ComplianceReport,
	UserCustomStatus,
	UserID,
	UserProfile,
	UserStatus
} from "./types";
import type { AnalyticsRow } from "./types/admin";
import type { Bot } from "./types/bots";
import type {
	Channel,
	ChannelMembership,
	ChannelStats,
	ChannelViewResponse
} from "./types/channels/channels";
import type {
	CloudCustomer,
	Invoice,
	Limits,
	Product,
	Subscription
} from "./types/cloud";
import type { ClientConfig } from "./types/config";
import type { DataRetentionCustomPolicies } from "./types/data-retention";
import type { CustomEmoji } from "./types/emojis";
import type { FileInfo, FileUploadResponse } from "./types/files";
import type { Group, GroupStats, GroupSyncable } from "./types/groups";
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
	BrandDeleteImageArguments,
	BrandGetImageArguments,
	BrandUploadImageArguments
} from "./types/methods/brand.methods";
import type {
	ChannelsAutocompleteArguments,
	ChannelsCreateArguments,
	ChannelsCreateDirectArguments,
	ChannelsCreateGroupArguments,
	ChannelsDeleteArguments,
	ChannelsGetByIdArguments,
	ChannelsGetByIdsArguments,
	ChannelsGetStatsArguments,
	ChannelsListArguments,
	ChannelsMemberArguments,
	ChannelsMembersArguments,
	ChannelsPatchArguments,
	ChannelsRestoreArguments,
	ChannelsSearchAllArguments,
	ChannelsSearchArchivedArguments,
	ChannelsSearchArguments,
	ChannelsUpdateArguments,
	ChannelsViewArguments
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
	DataRetentionGetGlobalPolicyArguments,
	DataRetentionGetPoliciesArguments,
	DataRetentionGetPolicyArguments,
	DataRetentionGetPolicyChannelsArguments,
	DataRetentionGetPolicyCountArguments,
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
	FilesGetInfoArguments,
	FilesGetPreviewArguments,
	FilesGetPublicArguments,
	FilesGetPublicLinkArguments,
	FilesGetThumbnailArguments,
	FilesSearchArguments,
	FilesUploadArguments
} from "./types/methods/file.methods";
import type {
	GroupsAddSyncableArguments,
	GroupsCreateArguments,
	GroupsDeleteArguments,
	GroupsDeleteLdapLinkArguments,
	GroupsGetArguments,
	GroupsGetStatsArguments,
	GroupsListArguments,
	GroupsListForUserArguments,
	GroupsListSyncablesArguments,
	GroupsPatchArguments,
	GroupsPatchSyncableArguments,
	GroupsRemoveSyncableArguments,
	GroupsRestoreArguments,
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
	PluginsDisableArguments,
	PluginsEnableArguments,
	PluginsGetMarketplaceArguments,
	PluginsGetWebAppArguments,
	PluginsInstallFromUrlArguments,
	PluginsInstallMarketplaceArguments,
	PluginsRemoveArguments,
	PluginsUploadArguments
} from "./types/methods/plugins.methods";
import type {
	PostsCreateArguments,
	PostsDeleteArguments,
	PostsGetArguments,
	PostsGetForChannelArguments,
	PostsGetThreadArguments,
	PostsMoveArguments,
	PostsPinArguments,
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
	SystemCheckIntegrityArguments,
	SystemGetAnalyticsArguments,
	SystemGetLogsArguments,
	SystemGetPingArguments,
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
	UsersAutocompleteArguments,
	UsersChannelsArguments,
	UsersCustomStatusSetArguments,
	UsersCustomStatusUnsetArguments,
	UsersDeleteImageArguments,
	UsersFindByEmailArguments,
	UsersFindByUsernameArguments,
	UsersListArguments,
	UsersProfileGetArguments,
	UsersProfileSetArguments,
	UsersSetImageArguments,
	UsersStatusGetAruments,
	UsersStatusSetAruments,
	UsersUpdateRolesArguments
} from "./types/methods/user.methods";
import type { PluginManifest, PluginStatus } from "./types/plugins";
import type { Post, PostList } from "./types/posts/posts";
import type { PreferenceType } from "./types/preferences";
import type { Reaction } from "./types/reactions";
import type { Role } from "./types/roles";
import type { Scheme } from "./types/schemes";
import type { Team, TeamStats } from "./types/teams";
import type { TermsOfService } from "./types/terms-of-service";
import {
	ContentType,
	type StatusOK,
	type WebApiCallConfig,
	type WebApiCallResult,
	type WebClientEvent
} from "./types/web-api";
import { WebClient } from "./web-client";

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
 * A class that defines all Web API methods, their arguments type, their response type, and binds those methods to the
 * `apiCall` class method.
 */
export abstract class Methods extends EventEmitter<WebClientEvent> {
	protected constructor() {
		super();

		// Check that the class being created extends from `WebClient` rather than this class
		if (!(new.target.prototype instanceof WebClient)) {
			throw new Error(
				"Attempt to inherit from WebClient methods without inheriting from WebClient"
			);
		}
	}

	public abstract apiCall(
		config: WebApiCallConfig,
		options?: Record<string, unknown>
	): Promise<WebApiCallResult>;

	public readonly bots = {
		/**
		 * @description Convert a user to a bot.
		 * @permissions Requires `manage_system` permission.
		 */
		convertUser: bindApiCall<BotsConvertUserArguments, StatusOK>(this, {
			method: "POST",
			path: "users/:user_id/convert_to_bot",
			type: ContentType.URLEncoded
		}),
		/**
		 * @description Convert a bot to a user.
		 * @permissions Requires `manage_system` permission.
		 */
		convertBotToUser: bindApiCall<BotsConvertBotToUserArguments, StatusOK>(
			this,
			{
				method: "POST",

				path: "bots/:bot_user_id/convert_to_user",
				type: ContentType.JSON
			}
		),
		/**
		 * @description Create a new bot.
		 * @permissions Requires `create_bot` permission.
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
		list: bindApiCall<BotsListArguments, Bot[]>(this, {
			method: "GET",
			path: "bots",
			type: ContentType.URLEncoded
		}),
		patch: bindApiCall<BotsPatchArguments, Bot>(this, {
			method: "PUT",
			path: "bots/:user_id",
			type: ContentType.JSON
		}),
		disable: bindApiCall<BotsDisableArguments, StatusOK>(this, {
			method: "POST",
			path: "bots/:bot_user_id/disable",
			type: ContentType.JSON
		}),
		enable: bindApiCall<BotsEnableArguments, StatusOK>(this, {
			method: "POST",
			path: "bots/:bot_user_id/enable",
			type: ContentType.JSON
		}),
		assign: bindApiCall<BotsAssignArguments, StatusOK>(this, {
			method: "POST",
			path: "bots/:bot_user_id/assign/:user_id",
			type: ContentType.JSON
		}),
		getIcon: bindApiCall<BotsGetIconArguments, Blob>(this, {
			method: "GET",
			path: "bots/:bot_user_id/icon",
			type: ContentType.URLEncoded
		}),
		setIcon: bindApiCall<BotsSetIconArguments, StatusOK>(this, {
			method: "POST",
			path: "bots/:bot_user_id/icon",
			type: ContentType.FormData
		}),
		deleteIcon: bindApiCall<BotsDeleteIconArguments, StatusOK>(this, {
			method: "DELETE",
			path: "bots/:bot_user_id/icon",
			type: ContentType.JSON
		})
	};

	public readonly channels = {
		/**
		 * @description Create a new channel.
		 * If creating a public channel, create_public_channel permission is required.
		 * If creating a private channel, create_private_channel permission is required.
		 */
		create: bindApiCall<ChannelsCreateArguments, Channel>(this, {
			method: "POST",
			path: "channels",
			type: ContentType.JSON
		}),
		createDirect: bindApiCall<ChannelsCreateDirectArguments, Channel>(this, {
			method: "POST",
			path: "channels/direct",
			type: ContentType.JSON
		}),
		createGroup: bindApiCall<ChannelsCreateGroupArguments, Channel>(this, {
			method: "POST",
			path: "channels/group",
			type: ContentType.JSON
		}),
		/**
		 * @description List channels for a team.
		 */
		list: bindApiCall<ChannelsListArguments, Channel[]>(this, {
			method: "GET",
			path: "teams/:team_id/channels",
			type: ContentType.URLEncoded
		}),
		/**
		 * @description Get a channel by ID.
		 */
		getById: bindApiCall<ChannelsGetByIdArguments, Channel>(this, {
			method: "GET",
			path: "channels/:channel_id",
			type: ContentType.URLEncoded
		}),
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
		delete: bindApiCall<ChannelsDeleteArguments, StatusOK>(this, {
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
		search: bindApiCall<ChannelsSearchArguments, Channel[]>(this, {
			method: "POST",
			path: "teams/:team_id/channels/search",
			type: ContentType.JSON
		}),
		autocomplete: bindApiCall<ChannelsAutocompleteArguments, Channel[]>(this, {
			method: "GET",
			path: "teams/:team_id/channels/autocomplete",
			type: ContentType.URLEncoded
		}),
		listByIds: bindApiCall<ChannelsGetByIdsArguments, Channel[]>(this, {
			method: "POST",
			path: "channels/ids",
			type: ContentType.JSON
		}),
		view: bindApiCall<ChannelsViewArguments, ChannelViewResponse>(this, {
			method: "POST",
			path: "channels/members/:channel_id/view",
			type: ContentType.JSON
		}),
		members: {
			get: bindApiCall<ChannelsMembersArguments, ChannelMembership[]>(this, {
				method: "GET",
				path: "channels/:channel_id/members",
				type: ContentType.URLEncoded
			}),
			getById: bindApiCall<ChannelsMemberArguments, ChannelMembership>(this, {
				method: "GET",
				path: "channels/:channel_id/members/:user_id",
				type: ContentType.URLEncoded
			})
		},
		searchAll: bindApiCall<ChannelsSearchAllArguments, Channel[]>(this, {
			method: "POST",
			path: "channels/search_all",
			type: ContentType.JSON
		}),
		searchArchived: bindApiCall<ChannelsSearchArchivedArguments, Channel[]>(
			this,
			{
				method: "POST",
				path: "teams/:team_id/channels/search_archived",
				type: ContentType.JSON
			}
		)
	};
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
				StatusOK
			>(this, {
				method: "POST",
				path: "cloud/validate_business_email",
				type: ContentType.JSON
			}),
			confirmPayment: bindApiCall<
				CloudConfirmCustomerPaymentArguments,
				StatusOK
			>(this, {
				method: "POST",
				path: "cloud/payment/confirm",
				type: ContentType.JSON
			})
		},
		invoices: {
			get: bindApiCallWithOptionalArg<never, Invoice[]>(this, {
				method: "GET",
				path: "cloud/invoices",
				type: ContentType.URLEncoded
			})
		},
		subscription: {
			get: bindApiCallWithOptionalArg<never, Subscription>(this, {
				method: "GET",
				path: "cloud/subscription",
				type: ContentType.URLEncoded
			}),
			update: bindApiCallWithOptionalArg<never, Subscription>(this, {
				method: "PUT",
				path: "cloud/subscription",
				type: ContentType.JSON
			})
		},
		products: {
			get: bindApiCallWithOptionalArg<never, Product[]>(this, {
				method: "GET",
				path: "cloud/products",
				type: ContentType.URLEncoded
			})
		},
		limits: {
			get: bindApiCallWithOptionalArg<never, Limits>(this, {
				method: "GET",
				path: "cloud/limits",
				type: ContentType.URLEncoded
			})
		}
	};

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
			delete: bindApiCall<DataRetentionDeletePolicyArguments, StatusOK>(this, {
				method: "DELETE",
				path: "data_retention/policies/:policy_id",
				type: ContentType.URLEncoded
			}),
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
				add: bindApiCall<DataRetentionAddPolicyTeamsArguments, StatusOK>(this, {
					method: "POST",
					path: "data_retention/policies/:policy_id/teams",
					type: ContentType.JSON
				}),
				remove: bindApiCall<DataRetentionRemovePolicyTeamsArguments, StatusOK>(
					this,
					{
						method: "DELETE",
						path: "data_retention/policies/:policy_id/teams/:team_id",
						type: ContentType.URLEncoded
					}
				),
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
				add: bindApiCall<DataRetentionAddPolicyChannelsArguments, StatusOK>(
					this,
					{
						method: "POST",
						path: "data_retention/policies/:policy_id/channels",
						type: ContentType.JSON
					}
				),
				remove: bindApiCall<
					DataRetentionRemovePolicyChannelsArguments,
					StatusOK
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
			get: bindApiCall<
				DataRetentionGetGlobalPolicyArguments,
				DataRetentionCustomPolicies
			>(this, {
				method: "GET",
				path: "data_retention/policy",
				type: ContentType.URLEncoded
			})
		},
		policiesCount: {
			get: bindApiCall<DataRetentionGetPolicyCountArguments, { count: number }>(
				this,
				{
					method: "GET",
					path: "data_retention/policies_count",
					type: ContentType.URLEncoded
				}
			)
		}
	};

	public readonly emoji = {
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
		get: bindApiCall<EmojisGetArguments, CustomEmoji>(this, {
			method: "GET",
			path: "emoji/:emoji_id",
			type: ContentType.URLEncoded
		}),
		delete: bindApiCall<EmojisDeleteArguments, StatusOK>(this, {
			method: "DELETE",
			path: "emoji/:emoji_id",
			type: ContentType.JSON
		}),
		getByName: bindApiCall<EmojisGetByNameArguments, CustomEmoji>(this, {
			method: "GET",
			path: "emoji/name/:name",
			type: ContentType.URLEncoded
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
		}),
		autocomplete: bindApiCall<EmojisAutocompleteArguments, CustomEmoji[]>(
			this,
			{
				method: "GET",
				path: "emoji/autocomplete",
				type: ContentType.URLEncoded
			}
		)
	};

	public readonly files = {
		upload: bindApiCall<FilesUploadArguments, FileUploadResponse>(this, {
			method: "POST",
			path: "files",
			type: ContentType.FormData
		}),
		get: bindApiCall<FilesGetArguments, Blob>(this, {
			method: "GET",
			path: "files/:file_id",
			type: ContentType.URLEncoded
		}),
		getThumbnail: bindApiCall<FilesGetThumbnailArguments, Blob>(this, {
			method: "GET",
			path: "files/:file_id/thumbnail",
			type: ContentType.URLEncoded
		}),
		getPreview: bindApiCall<FilesGetPreviewArguments, Blob>(this, {
			method: "GET",
			path: "files/:file_id/preview",
			type: ContentType.URLEncoded
		}),
		getPublicLink: bindApiCall<FilesGetPublicLinkArguments, { link: string }>(
			this,
			{
				method: "GET",
				path: "files/:file_id/link",
				type: ContentType.URLEncoded
			}
		),
		getInfo: bindApiCall<FilesGetInfoArguments, FileInfo>(this, {
			method: "GET",
			path: "files/:file_id/info",
			type: ContentType.URLEncoded
		}),
		getPublic: bindApiCall<FilesGetPublicArguments, Blob>(this, {
			method: "GET",
			path: "files/:file_id/public",
			type: ContentType.URLEncoded
		}),
		search: bindApiCall<FilesSearchArguments, FileInfo[]>(this, {
			method: "POST",
			path: "teams/:team_id/files/search",
			type: ContentType.JSON
		})
	};

	public readonly integrations = {
		/**
		 * @description Interactive dialogs for post actions/commands
		 */
		dialogs: {
			/**
			 * @description Open an interactive dialog using a trigger ID provided
			 * by a slash command, or some other action payload.
			 * @see {@link https://docs.loop.ru/developer/interactive-dialogs.html | Interactive Dialogs}
			 * for more information on interactive dialogs.
			 * Minimum server @version 5.6
			 */
			open: bindApiCall<InteractiveOpenDialogArguments, StatusOK>(this, {
				method: "POST",
				path: "actions/dialogs/open",
				type: ContentType.JSON
			}),
			/**
			 * @description Endpoint used by the LOOP clients to submit a dialog.
			 * @see {@link https://docs.loop.ru/developer/interactive-dialogs.html | Interactive Dialogs}
			 * for more information on interactive dialogs.
			 * Minimum server @version 5.6
			 */
			submit: bindApiCall<InteractiveSubmitDialogArguments, StatusOK>(this, {
				method: "POST",
				path: "actions/dialogs/submit",
				type: ContentType.JSON
			})
		},
		/**
		 * @description Commands
		 */
		commands: {
			/**
			 * @description Create a command for a team.
			 * @permissions `manage_slash_commands` for the team the command is in.
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
			delete: bindApiCall<CommandsDeleteArguments, StatusOK>(this, {
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
			execute: bindApiCall<CommandsExecuteArguments, StatusOK>(this, {
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
				delete: bindApiCall<IncomingWebhooksDeleteArguments, StatusOK>(this, {
					method: "DELETE",
					path: "hooks/incoming/:hook_id",
					type: ContentType.URLEncoded
				}),
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
				delete: bindApiCall<OutgoingWebhooksDeleteArguments, StatusOK>(this, {
					method: "DELETE",
					path: "hooks/outgoing/:hook_id",
					type: ContentType.URLEncoded
				}),
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
				delete: bindApiCall<OAuthAppsDeleteArguments, StatusOK>(this, {
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
	};

	public readonly groups = {
		/**
		 * @description Create a new group.
		 * @permissions Requires `manage_system` permission.
		 */
		create: bindApiCall<GroupsCreateArguments, Group>(this, {
			method: "POST",
			path: "groups",
			type: ContentType.JSON
		}),
		/**
		 * @description Retrieve a group by its ID.
		 * @permissions Requires `manage_system` permission.
		 */
		get: bindApiCall<GroupsGetArguments, Group>(this, {
			method: "GET",
			path: "groups/:group_id",
			type: ContentType.URLEncoded
		}),
		/**
		 * @description List all groups.
		 * @permissions Requires `manage_system` permission.
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
		delete: bindApiCall<GroupsDeleteArguments, StatusOK>(this, {
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
			remove: bindApiCall<GroupsRemoveSyncableArguments, StatusOK>(this, {
				method: "DELETE",
				path: "groups/:group_id/syncables/:syncable_id?syncable_type=:syncable_type",
				type: ContentType.URLEncoded
			}),
			patch: bindApiCall<GroupsPatchSyncableArguments, GroupSyncable>(this, {
				method: "PUT",
				path: "groups/:group_id/syncables/:syncable_id/patch",
				type: ContentType.JSON
			})
		},
		members: {
			list: bindApiCall<GroupsListForUserArguments, Group[]>(this, {
				method: "GET",
				path: "users/:user_id/groups",
				type: ContentType.URLEncoded
			})
		},
		deleteLdapLink: bindApiCall<GroupsDeleteLdapLinkArguments, StatusOK>(this, {
			method: "DELETE",
			path: "groups/:group_id/link",
			type: ContentType.URLEncoded
		})
	};

	public readonly jobs = {
		/**
		 * @description Create a new job.
		 * @permissions Requires `manage_jobs` permission.
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
		list: bindApiCall<JobsListArguments, Job[]>(this, {
			method: "GET",
			path: "jobs",
			type: ContentType.URLEncoded
		}),
		/**
		 * @description List jobs by type.
		 */
		listByType: bindApiCall<JobsListByTypeArguments, Job[]>(this, {
			method: "GET",
			path: "jobs/type/:type",
			type: ContentType.URLEncoded
		}),
		/**
		 * @description Cancel a job.
		 */
		cancel: bindApiCall<JobsCancelArguments, StatusOK>(this, {
			method: "POST",
			path: "jobs/:job_id/cancel",
			type: ContentType.JSON
		})
	};

	public readonly plugins = {
		/**
		 * @description Upload a plugin.
		 * @permissions Requires `manage_system` permission.
		 */
		upload: bindApiCall<PluginsUploadArguments, PluginManifest>(this, {
			method: "POST",
			path: "plugins",
			type: ContentType.FormData
		}),
		installFromUrl: bindApiCall<PluginsInstallFromUrlArguments, PluginManifest>(
			this,
			{
				method: "POST",
				path: "plugins/install_from_url",
				type: ContentType.JSON
			}
		),
		installMarketplace: bindApiCall<
			PluginsInstallMarketplaceArguments,
			PluginManifest
		>(this, {
			method: "POST",
			path: "plugins/marketplace",
			type: ContentType.JSON
		}),
		remove: bindApiCall<PluginsRemoveArguments, StatusOK>(this, {
			method: "DELETE",
			path: "plugins/:plugin_id",
			type: ContentType.URLEncoded
		}),
		enable: bindApiCall<PluginsEnableArguments, StatusOK>(this, {
			method: "POST",
			path: "plugins/:plugin_id/enable",
			type: ContentType.URLEncoded
		}),
		disable: bindApiCall<PluginsDisableArguments, StatusOK>(this, {
			method: "POST",
			path: "plugins/:plugin_id/disable",
			type: ContentType.URLEncoded
		}),
		get: bindApiCallWithOptionalArg<never, PluginManifest[]>(this, {
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
	};

	public readonly roles = {
		/**
		 * @description Retrieve a role by its ID.
		 */
		get: bindApiCall<RolesGetArguments, Role>(this, {
			method: "GET",
			path: "roles/:role_id",
			type: ContentType.URLEncoded
		}),
		getByName: bindApiCall<RolesGetByNameArguments, Role>(this, {
			method: "GET",
			path: "roles/name/:role_name",
			type: ContentType.URLEncoded
		}),
		getByNames: bindApiCall<RolesGetByNamesArguments, Role[]>(this, {
			method: "POST",
			path: "roles/names",
			type: ContentType.JSON
		}),
		patch: bindApiCall<RolesPatchArguments, Role>(this, {
			method: "PUT",
			path: "roles/:role_id/patch",
			type: ContentType.JSON
		})
	};

	public readonly schemes = {
		create: bindApiCall<SchemesCreateArguments, Scheme>(this, {
			method: "POST",
			path: "schemes",
			type: ContentType.JSON
		}),
		delete: bindApiCall<SchemesDeleteArguments, StatusOK>(this, {
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
	};

	public readonly teams = {
		create: bindApiCall<TeamsCreateArguments, Team>(this, {
			method: "POST",
			path: "teams",
			type: ContentType.JSON
		}),
		get: bindApiCall<TeamsGetArguments, Team[]>(this, {
			method: "GET",
			path: "teams",
			type: ContentType.URLEncoded
		}),
		getById: bindApiCall<TeamsGetByIdArguments, Team>(this, {
			method: "GET",
			path: "teams/:team_id",
			type: ContentType.URLEncoded
		}),
		getByName: bindApiCall<TeamsGetByNameArguments, Team>(this, {
			method: "GET",
			path: "teams/name/:name",
			type: ContentType.URLEncoded
		}),
		update: bindApiCall<TeamsUpdateArguments, Team>(this, {
			method: "PUT",
			path: "teams/:team_id",
			type: ContentType.JSON
		}),
		delete: bindApiCall<TeamsDeleteArguments, StatusOK>(this, {
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
		checkNameExists: bindApiCall<TeamsCheckNameExistsArguments, boolean>(this, {
			method: "GET",
			path: "teams/name/:name/exists",
			type: ContentType.URLEncoded
		}),
		import: bindApiCall<TeamsImportArguments, { results: string }>(this, {
			method: "POST",
			path: "teams/import",
			type: ContentType.FormData
		}),
		setIcon: bindApiCall<TeamsSetIconArguments, StatusOK>(this, {
			method: "POST",
			path: "teams/:team_id/image",
			type: ContentType.FormData
		}),
		removeIcon: bindApiCall<TeamsRemoveIconArguments, StatusOK>(this, {
			method: "DELETE",
			path: "teams/:team_id/image",
			type: ContentType.URLEncoded
		}),
		getIcon: bindApiCall<TeamsGetIconArguments, Blob>(this, {
			method: "GET",
			path: "teams/:team_id/image",
			type: ContentType.URLEncoded
		})
	};

	public readonly posts = {
		create: bindApiCall<PostsCreateArguments, Post>(this, {
			method: "POST",
			path: "posts",
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
		delete: bindApiCall<PostsDeleteArguments, StatusOK>(this, {
			method: "DELETE",
			path: "posts/:post_id",
			type: ContentType.URLEncoded
		}),
		getThread: bindApiCall<PostsGetThreadArguments, PostList>(this, {
			method: "GET",
			path: "posts/:post_id/thread",
			type: ContentType.URLEncoded
		}),
		getForChannel: bindApiCall<PostsGetForChannelArguments, PostList>(this, {
			method: "GET",
			path: "channels/:channel_id/posts",
			type: ContentType.URLEncoded
		}),
		pin: bindApiCall<PostsPinArguments, StatusOK>(this, {
			method: "POST",
			path: "posts/:post_id/pin",
			type: ContentType.URLEncoded
		}),
		unpin: bindApiCall<PostsUnpinArguments, StatusOK>(this, {
			method: "POST",
			path: "posts/:post_id/unpin",
			type: ContentType.URLEncoded
		}),
		move: bindApiCall<PostsMoveArguments, StatusOK>(this, {
			method: "POST",
			path: "posts/:post_id/move",
			type: ContentType.JSON
		})
	};

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
		delete: bindApiCall<ReactionsDeleteArguments, StatusOK>(this, {
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
	};

	/**
	 * @description Users methods
	 */
	public readonly users = {
		list: bindApiCall<UsersListArguments, UserProfile[]>(this, {
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
		channels: bindApiCall<UsersChannelsArguments, Channel[]>(this, {
			method: "GET",
			path: "users/:user_id/channels",
			type: ContentType.URLEncoded
		}),
		profile: {
			/**
			 * @description Retrieve a user's profile information, including their custom status.
			 */
			me: bindApiCallWithOptionalArg<never, UserProfile>(this, {
				method: "GET",
				path: `users/:user_id`,
				type: ContentType.URLEncoded
			}),
			/**
			 * @description Retrieve a user's profile information, including their custom status.
			 */
			getById: bindApiCallWithOptionalArg<
				UsersProfileGetArguments,
				UserProfile
			>(this, {
				method: "GET",
				path: `users/:user_id`,
				type: ContentType.URLEncoded
			}),
			/**
			 * @description Find a user with an email address.
			 */
			getByEmail: bindApiCall<UsersFindByEmailArguments, UserProfile[]>(this, {
				method: "GET",
				path: `users/email`,
				type: ContentType.URLEncoded
			}),
			/**
			 * @description Find a user with an email address.
			 */
			getByUsername: bindApiCall<UsersFindByUsernameArguments, UserProfile[]>(
				this,
				{
					method: "GET",
					path: `users/username`,
					type: ContentType.URLEncoded
				}
			),
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
			 * @description Set the user profile image.
			 */
			setProfileImage: bindApiCall<UsersSetImageArguments, StatusOK>(this, {
				method: "POST",
				path: `users/:user_id/image`,
				type: ContentType.URLEncoded
			}),
			/**
			 * @description Delete the user profile image.
			 */
			deleteProfileImage: bindApiCallWithOptionalArg<
				UsersDeleteImageArguments,
				StatusOK
			>(this, {
				method: "DELETE",
				path: `users/:user_id/image`,
				type: ContentType.URLEncoded
			})
		},
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
			unsetCustom: bindApiCall<UsersCustomStatusUnsetArguments, StatusOK>(
				this,
				{
					method: "DELETE",
					path: `users/:user_id/status/custom`,
					type: ContentType.URLEncoded
				}
			)
		},
		preferences: {
			get: bindApiCall<PreferencesGetArguments, PreferenceType[]>(this, {
				method: "GET",
				path: "users/:user_id/preferences",
				type: ContentType.URLEncoded
			}),
			save: bindApiCall<PreferencesSaveArguments, StatusOK>(this, {
				method: "PUT",
				path: "users/:user_id/preferences",
				type: ContentType.JSON
			}),
			delete: bindApiCall<PreferencesDeleteArguments, StatusOK>(this, {
				method: "POST",
				path: "users/:user_id/preferences/delete",
				type: ContentType.JSON
			})
		},
		promoteGuestToUser: bindApiCall<UserID, StatusOK>(this, {
			method: "POST",
			path: `users/:user_id/promote`,
			type: ContentType.URLEncoded
		}),

		demoteUserToGuest: bindApiCall<UserID, StatusOK>(this, {
			method: "post",
			path: `users/:user_id/demote`,
			type: ContentType.URLEncoded
		}),
		updateRoles: bindApiCall<UsersUpdateRolesArguments, StatusOK>(this, {
			method: "PUT",
			path: `users/:user_id/roles`,
			type: ContentType.URLEncoded
		})
	};

	public readonly system = {
		checkIntegrity: bindApiCall<
			SystemCheckIntegrityArguments,
			{ results: unknown[] }
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
		getPing: bindApiCall<SystemGetPingArguments, { status: string }>(this, {
			method: "GET",
			path: "system/ping",
			type: ContentType.URLEncoded
		}),
		testEmail: bindApiCall<SystemTestEmailArguments, StatusOK>(this, {
			method: "POST",
			path: "email/test",
			type: ContentType.JSON
		}),
		testS3Connection: bindApiCall<SystemTestS3ConnectionArguments, StatusOK>(
			this,
			{
				method: "POST",
				path: "file/s3_test",
				type: ContentType.JSON
			}
		),
		testSiteURL: bindApiCall<SystemTestSiteURLArguments, StatusOK>(this, {
			method: "POST",
			path: "site_url/test",
			type: ContentType.JSON
		}),
		updateConfig: bindApiCall<SystemUpdateConfigArguments, ClientConfig>(this, {
			method: "PUT",
			path: "config",
			type: ContentType.JSON
		}),
		uploadLogFile: bindApiCall<SystemUploadLogFileArguments, StatusOK>(this, {
			method: "POST",
			path: "logs/upload",
			type: ContentType.FormData
		})
	};

	public readonly brand = {
		deleteImage: bindApiCall<BrandDeleteImageArguments, StatusOK>(this, {
			method: "DELETE",
			path: "brand/image",
			type: ContentType.URLEncoded
		}),
		getImage: bindApiCall<BrandGetImageArguments, Buffer | Stream>(this, {
			method: "GET",
			path: "brand/image",
			type: ContentType.URLEncoded
		}),
		uploadImage: bindApiCall<BrandUploadImageArguments, StatusOK>(this, {
			method: "POST",
			path: "brand/image",
			type: ContentType.FormData
		})
	};

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
	};

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
		update: bindApiCall<TermsOfServiceUpdateArguments, 	TermsOfService>(this, {
			method: "POST", // or PUT? Check if update is same 	as create or distinct.
			path: "terms_of_service/:id", // Usually ID
			type: ContentType.JSON
		})
	};
};