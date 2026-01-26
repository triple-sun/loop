import EventEmitter from "eventemitter3";
import type { Stream } from "form-data";
import { WebClient } from "./client";
import type {
	UserCustomStatus,
	UserProfile,
	UserStatus
} from "./types";
import type { Bot, BotPatch } from "./types/bots";
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
import type { DataRetentionCustomPolicies } from "./types/data-retention";
import type { CustomEmoji } from "./types/emojis";
import { ContentType } from "./types/enum";
import type { FileInfo, FileUploadResponse } from "./types/files";
import type { Group, GroupStats, GroupSyncable } from "./types/groups";
import type {
	Command,
	IncomingWebhook,
	OAuthApp,
	OutgoingWebhook
} from "./types/integrations";
import type { Job } from "./types/jobs";
import type { AdminUpdateRolesArguments } from "./types/methods/admin.methods";
import type {
	BotsConvertUserArguments,
	BotsCreateArguments,
	BotsGetArguments,
	BotsListArguments,
	BotsPatchArguments
} from "./types/methods/bots.methods";
import type {
	ChannelsCreateArguments,
	ChannelsCreateDirectArguments,
	ChannelsCreateGroupArguments,
	ChannelsDeleteArguments,
	ChannelsGetArguments,
	ChannelsGetByIdArguments,
	ChannelsGetStatsArguments,
	ChannelsMemberArguments,
	ChannelsMembersArguments,
	ChannelsPatchArguments,
	ChannelsRestoreArguments,
	ChannelsSearchArguments,
	ChannelsUpdateArguments,
	ChannelsViewArguments
} from "./types/methods/channel.methods";
import type {
	CloudConfirmCustomerPaymentArguments,
	CloudCreateCustomerPaymentArguments,
	CloudGetCustomerArguments,
	CloudGetCustomerPaymentArguments,
	CloudGetInvoicesArguments,
	CloudGetLimitsArguments,
	CloudGetProductsArguments,
	CloudGetSubscriptionArguments,
	CloudRequestTrialArguments,
	CloudUpdateAddressArguments,
	CloudUpdateCustomerArguments,
	CloudUpdateSubscriptionArguments,
	CloudValidateBusinessEmailArguments
} from "./types/methods/cloud.methods";
import type { UserID } from "./types/methods/common.methods";
import type {
	DataRetentionAddPolicyChannelsArguments,
	DataRetentionAddPolicyTeamsArguments,
	DataRetentionCreatePolicyArguments,
	DataRetentionDeletePolicyArguments,
	DataRetentionGetPoliciesArguments,
	DataRetentionGetPolicyArguments,
	DataRetentionGetPolicyChannelsArguments,
	DataRetentionGetPolicyTeamsArguments,
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
	EmojisGetListArguments,
	EmojisSearchArguments
} from "./types/methods/emoji.methods";
import type {
	FilesGetArguments,
	FilesGetInfoArguments,
	FilesGetLinkArguments,
	FilesGetPublicLinkArguments,
	FilesUploadArguments
} from "./types/methods/file.methods";
import type {
	GroupsAddSyncableArguments,
	GroupsChannelArguments,
	GroupsCreateArguments,
	GroupsDeleteArguments,
	GroupsGetArguments,
	GroupsGetStatsArguments,
	GroupsListArguments,
	GroupsListForUserArguments,
	GroupsListSyncablesArguments,
	GroupsPatchArguments,
	GroupsPatchSyncableArguments,
	GroupsRemoveSyncableArguments,
	GroupsRestoreArguments,
	GroupsSearchArguments,
	GroupsTeamArguments,
	GroupsUpdateArguments
} from "./types/methods/groups.methods";
import type {
	CommandsCreateArguments,
	CommandsDeleteArguments,
	CommandsExecuteArguments,
	CommandsListArguments,
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
	PluginsGetArguments,
	PluginsGetMarketplaceArguments,
	PluginsGetStatusesArguments,
	PluginsGetWebappArguments,
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
import type { ReportsStartUsersBatchExportArguments } from "./types/methods/reports.methods";
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
	TeamsCheckNameExistsArguments,
	TeamsCreateArguments,
	TeamsDeleteArguments,
	TeamsGetArguments,
	TeamsGetByIdArguments,
	TeamsGetByNameArguments,
	TeamsGetStatsArguments,
	TeamsImportArguments,
	TeamsPatchArguments,
	TeamsRegenerateInviteIdArguments,
	TeamsSearchArguments,
	TeamsUpdateArguments
} from "./types/methods/team.methods";
import type {
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
	UsersStatusSetAruments
} from "./types/methods/user.methods";
import type { PluginManifest, PluginStatus } from "./types/plugins";
import type { Post, PostList } from "./types/posts/posts";
import type { PreferenceType } from "./types/preferences";
import type { Reaction } from "./types/reactions";
import type { Team, TeamStats } from "./types/teams";
import type {
	StatusOK,
	WebApiCallConfig,
	WebApiCallResult,
	WebClientEvent
} from "./types/web-api";

/**
 *  Binds a certain `method` and its (required) arguments and result types to the `apiCall` method in `LoopClient`.
 */
function bindApiCall<ARGS, RESULT>(
	self: Methods,
	config: WebApiCallConfig
): MethodWithRequiredArgument<ARGS, WebApiCallResult<RESULT>> {
	return self.apiCall.bind(self, config) as MethodWithRequiredArgument<
		ARGS,
		WebApiCallResult<RESULT>
	>;
}

/**
 * Binds a certain `method` and its (required) arguments and result types to the `apiCall` method in `LoopClient`.
 * */
function bindApiCallWithOptionalArg<ARGS, RESULT>(
	self: Methods,
	config: WebApiCallConfig
): MethodWithOptionalArgument<ARGS, WebApiCallResult<RESULT>> {
	return self.apiCall.bind(self, config) as MethodWithOptionalArgument<
		ARGS,
		WebApiCallResult<RESULT>
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

	/**
	 * Admin methods
	 */
	public readonly admin = {
		users: {
			promoteGuestToUser: bindApiCall<UserID, StatusOK>(this, {
				method: "POST",
				path: `/users/:user_id/promote`,
				type: ContentType.URLEncoded
			}),

			demoteUserToGuest: bindApiCall<UserID, StatusOK>(this, {
				method: "post",
				path: `/users/:user_id/demote`,
				type: ContentType.URLEncoded
			}),
			updateRoles: bindApiCall<AdminUpdateRolesArguments, StatusOK>(this, {
				method: "PUT",
				path: `/users/:user_id/roles`,
				type: ContentType.URLEncoded
			}),
			/**
			 * @description Update users status by id
			 * Must have edit_other_users permission for the team.
			 */
			setStatus: bindApiCall<UsersStatusSetAruments, UserStatus>(this, {
				method: "PUT",
				path: `/users/:user_id/status`,
				type: ContentType.JSON
			})
		}
	};

	public readonly teams = {
		create: bindApiCall<TeamsCreateArguments, Team>(this, {
			method: "POST",
			path: "/teams",
			type: ContentType.JSON
		}),
		get: bindApiCall<TeamsGetArguments, Team[]>(this, {
			method: "GET",
			path: "/teams",
			type: ContentType.URLEncoded
		}),
		getById: bindApiCall<TeamsGetByIdArguments, Team>(this, {
			method: "GET",
			path: "/teams/:team_id",
			type: ContentType.URLEncoded
		}),
		getByName: bindApiCall<TeamsGetByNameArguments, Team>(this, {
			method: "GET",
			path: "/teams/name/:name",
			type: ContentType.URLEncoded
		}),
		update: bindApiCall<TeamsUpdateArguments, Team>(this, {
			method: "PUT",
			path: "/teams/:team_id",
			type: ContentType.JSON
		}),
		delete: bindApiCall<TeamsDeleteArguments, StatusOK>(this, {
			method: "DELETE",
			path: "/teams/:team_id",
			type: ContentType.URLEncoded
		}),
		patch: bindApiCall<TeamsPatchArguments, Team>(this, {
			method: "PUT",
			path: "/teams/:team_id/patch",
			type: ContentType.JSON
		}),
		regenerateInviteId: bindApiCall<TeamsRegenerateInviteIdArguments, Team>(
			this,
			{
				method: "POST",
				path: "/teams/:team_id/regenerate_invite_id",
				type: ContentType.URLEncoded
			}
		),
		getStats: bindApiCall<TeamsGetStatsArguments, TeamStats>(this, {
			method: "GET",
			path: "/teams/:team_id/stats",
			type: ContentType.URLEncoded
		}),
		search: bindApiCall<TeamsSearchArguments, Team[]>(this, {
			method: "POST",
			path: "/teams/search",
			type: ContentType.JSON
		}),
		checkNameExists: bindApiCall<TeamsCheckNameExistsArguments, boolean>(this, {
			method: "GET",
			path: "/teams/name/:name/exists",
			type: ContentType.URLEncoded
		}),
		import: bindApiCall<TeamsImportArguments, { results: string }>(this, {
			method: "POST",
			path: "/teams/import",
			type: ContentType.FormData
		})
	};

	public readonly channels = {
		create: bindApiCall<ChannelsCreateArguments, Channel>(this, {
			method: "POST",
			path: "/channels",
			type: ContentType.JSON
		}),
		createDirect: bindApiCall<ChannelsCreateDirectArguments, Channel>(this, {
			method: "POST",
			path: "/channels/direct",
			type: ContentType.JSON
		}),
		createGroup: bindApiCall<ChannelsCreateGroupArguments, Channel>(this, {
			method: "POST",
			path: "/channels/group",
			type: ContentType.JSON
		}),
		get: bindApiCall<ChannelsGetArguments, Channel[]>(this, {
			method: "GET",
			path: "/teams/:team_id/channels",
			type: ContentType.URLEncoded
		}),
		getById: bindApiCall<ChannelsGetByIdArguments, Channel>(this, {
			method: "GET",
			path: "/channels/:channel_id",
			type: ContentType.URLEncoded
		}),
		update: bindApiCall<ChannelsUpdateArguments, Channel>(this, {
			method: "PUT",
			path: "/channels/:channel_id",
			type: ContentType.JSON
		}),
		delete: bindApiCall<ChannelsDeleteArguments, StatusOK>(this, {
			method: "DELETE",
			path: "/channels/:channel_id",
			type: ContentType.URLEncoded
		}),
		patch: bindApiCall<ChannelsPatchArguments, Channel>(this, {
			method: "PUT",
			path: "/channels/:channel_id/patch",
			type: ContentType.JSON
		}),
		restore: bindApiCall<ChannelsRestoreArguments, Channel>(this, {
			method: "POST",
			path: "/channels/:channel_id/restore",
			type: ContentType.URLEncoded
		}),
		getStats: bindApiCall<ChannelsGetStatsArguments, ChannelStats>(this, {
			method: "GET",
			path: "/channels/:channel_id/stats",
			type: ContentType.URLEncoded
		}),
		search: bindApiCall<ChannelsSearchArguments, Channel[]>(this, {
			method: "POST",
			path: "/teams/:team_id/channels/search",
			type: ContentType.JSON
		}),
		view: bindApiCall<ChannelsViewArguments, ChannelViewResponse>(this, {
			method: "POST",
			path: "/channels/members/:channel_id/view",
			type: ContentType.JSON
		}),
		members: {
			get: bindApiCall<ChannelsMembersArguments, ChannelMembership[]>(this, {
				method: "GET",
				path: "/channels/:channel_id/members",
				type: ContentType.URLEncoded
			}),
			getById: bindApiCall<ChannelsMemberArguments, ChannelMembership>(this, {
				method: "GET",
				path: "/channels/:channel_id/members/:user_id",
				type: ContentType.URLEncoded
			})
		}
	};

	public readonly posts = {
		create: bindApiCall<PostsCreateArguments, Post>(this, {
			method: "POST",
			path: "/posts",
			type: ContentType.JSON
		}),
		update: bindApiCall<PostsUpdateArguments, Post>(this, {
			method: "PUT",
			path: "/posts/:id",
			type: ContentType.JSON
		}),
		get: bindApiCall<PostsGetArguments, Post>(this, {
			method: "GET",
			path: "/posts/:post_id",
			type: ContentType.URLEncoded
		}),
		delete: bindApiCall<PostsDeleteArguments, StatusOK>(this, {
			method: "DELETE",
			path: "/posts/:post_id",
			type: ContentType.URLEncoded
		}),
		getThread: bindApiCall<PostsGetThreadArguments, PostList>(this, {
			method: "GET",
			path: "/posts/:post_id/thread",
			type: ContentType.URLEncoded
		}),
		getForChannel: bindApiCall<PostsGetForChannelArguments, PostList>(this, {
			method: "GET",
			path: "/channels/:channel_id/posts",
			type: ContentType.URLEncoded
		}),
		pin: bindApiCall<PostsPinArguments, StatusOK>(this, {
			method: "POST",
			path: "/posts/:post_id/pin",
			type: ContentType.URLEncoded
		}),
		unpin: bindApiCall<PostsUnpinArguments, StatusOK>(this, {
			method: "POST",
			path: "/posts/:post_id/unpin",
			type: ContentType.URLEncoded
		})
	};

	public readonly files = {
		upload: bindApiCall<FilesUploadArguments, FileUploadResponse>(this, {
			method: "POST",
			path: "/files",
			type: ContentType.FormData
		}),
		get: bindApiCall<FilesGetArguments, Buffer | Stream>(this, {
			method: "GET",
			path: "/files/:file_id",
			type: ContentType.URLEncoded
		}),
		getLink: bindApiCall<FilesGetLinkArguments, { link: string }>(this, {
			method: "GET",
			path: "/files/:file_id/link",
			type: ContentType.URLEncoded
		}),
		getInfo: bindApiCall<FilesGetInfoArguments, FileInfo>(this, {
			method: "GET",
			path: "/files/:file_id/info",
			type: ContentType.URLEncoded
		}),
		getPublicLink: bindApiCall<FilesGetPublicLinkArguments, { link: string }>(
			this,
			{
				method: "GET",
				path: "/files/:file_id/public",
				type: ContentType.URLEncoded
			}
		)
	};

	public readonly preferences = {
		get: bindApiCall<PreferencesGetArguments, PreferenceType[]>(this, {
			method: "GET",
			path: "/users/:user_id/preferences",
			type: ContentType.URLEncoded
		}),
		save: bindApiCall<PreferencesSaveArguments, StatusOK>(this, {
			method: "PUT",
			path: "/users/:user_id/preferences",
			type: ContentType.JSON
		}),
		delete: bindApiCall<PreferencesDeleteArguments, StatusOK>(this, {
			method: "POST",
			path: "/users/:user_id/preferences/delete",
			type: ContentType.JSON
		})
	};

	public readonly emojis = {
		create: bindApiCall<EmojisCreateArguments, CustomEmoji>(this, {
			method: "POST",
			path: "/emoji",
			type: ContentType.FormData
		}),
		getList: bindApiCall<EmojisGetListArguments, CustomEmoji[]>(this, {
			method: "GET",
			path: "/emoji",
			type: ContentType.URLEncoded
		}),
		get: bindApiCall<EmojisGetArguments, CustomEmoji>(this, {
			method: "GET",
			path: "/emoji/:emoji_id",
			type: ContentType.URLEncoded
		}),
		delete: bindApiCall<EmojisDeleteArguments, StatusOK>(this, {
			method: "DELETE",
			path: "/emoji/:emoji_id",
			type: ContentType.URLEncoded
		}),
		search: bindApiCall<EmojisSearchArguments, CustomEmoji[]>(this, {
			method: "POST",
			path: "/emoji/search",
			type: ContentType.JSON
		}),
		autocomplete: bindApiCall<EmojisAutocompleteArguments, CustomEmoji[]>(
			this,
			{
				method: "GET",
				path: "/emoji/autocomplete",
				type: ContentType.URLEncoded
			}
		)
	};

	public readonly reactions = {
		create: bindApiCall<ReactionsCreateArguments, Reaction>(this, {
			method: "POST",
			path: "/reactions",
			type: ContentType.JSON
		}),
		getForPost: bindApiCall<ReactionsGetForPostArguments, Reaction[]>(this, {
			method: "GET",
			path: "/posts/:post_id/reactions",
			type: ContentType.URLEncoded
		}),
		delete: bindApiCall<ReactionsDeleteArguments, StatusOK>(this, {
			method: "DELETE",
			path: "/users/:user_id/posts/:post_id/reactions/:emoji_name",
			type: ContentType.URLEncoded
		}),
		getBulk: bindApiCall<ReactionsGetBulkArguments, Record<string, Reaction[]>>(
			this,
			{
				method: "POST",
				path: "/reactions/bulk",
				type: ContentType.JSON
			}
		)
	};

	/**
	 * Users methods
	 */
	public readonly users = {
		/**
		 * @description List channels the calling user may access.
		 */
		channels: bindApiCall<UsersChannelsArguments, Channel[]>(this, {
			method: "GET",
			path: `/users/:user_id/teams/:team_id/channels`,
			type: ContentType.URLEncoded
		}),
		/**
		 * @description Lists all users in a team.
		 */
		list: bindApiCall<UsersListArguments, UserProfile[]>(this, {
			method: "GET",
			path: `/users`,
			type: ContentType.URLEncoded
		}),
		/**
		 * @description Search team.
		 */
		search: bindApiCall<UsersListArguments, UserProfile[]>(this, {
			method: "GET",
			path: `/users/search`,
			type: ContentType.JSON
		}),
		known: bindApiCall<undefined, UserProfile["id"][]>(this, {
			method: "GET",
			path: `/users/known`,
			type: ContentType.URLEncoded
		}),
		profile: {
			/**
			 * @description Retrieve a user's profile information, including their custom status.
			 * @see {@link https://docs.slack.dev/reference/methods/users.profile.get `users.profile.get` API reference}.
			 */
			getById: bindApiCall<UsersProfileGetArguments, UserProfile>(this, {
				method: "GET",
				path: `/users/:user_id`,
				type: ContentType.URLEncoded
			}),
			/**
			 * @description Find a user with an email address.
			 * @see {@link https://docs.slack.dev/reference/methods/users.lookupByEmail `users.lookupByEmail` API reference}.
			 */
			getByEmail: bindApiCall<UsersFindByEmailArguments, UserProfile[]>(this, {
				method: "GET",
				path: `/users/email`,
				type: ContentType.URLEncoded
			}),
			/**
			 * @description Find a user with an email address.
			 * @see {@link https://docs.slack.dev/reference/methods/users.lookupByEmail `users.lookupByEmail` API reference}.
			 */
			getByUsername: bindApiCall<UsersFindByUsernameArguments, UserProfile[]>(
				this,
				{
					method: "GET",
					path: `/users/username`,
					type: ContentType.URLEncoded
				}
			),
			/**
			 * @description Set a user's profile information, including custom status.
			 * @see {@link https://docs.slack.dev/reference/methods/users.profile.set `users.profile.set` API reference}.
			 */
			patch: bindApiCall<UsersProfileSetArguments, UserProfile>(this, {
				method: "PUT",
				path: `/users/:user_id`,
				type: ContentType.JSON
			}),
			/**
			 * @description Set the user profile image.
			 */
			setProfileImage: bindApiCall<UsersSetImageArguments, StatusOK>(this, {
				method: "POST",
				path: `/users/:user_id/image`,
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
				path: `/users/:user_id/image`,
				type: ContentType.URLEncoded
			})
		},
		status: {
			/**
			 * @description Gets status for user
			 */
			get: bindApiCall<UsersStatusGetAruments, UserStatus>(this, {
				method: "GET",
				path: `/users/:user_id/status`,
				type: ContentType.URLEncoded
			}),
			setCustom: bindApiCall<UsersCustomStatusSetArguments, UserCustomStatus>(
				this,
				{
					method: "PUT",
					path: `/users/:user_id/status/custom`,
					type: ContentType.JSON
				}
			),
			unsetCustom: bindApiCall<UsersCustomStatusUnsetArguments, StatusOK>(
				this,
				{
					method: "DELETE",
					path: `/users/:user_id/status/custom`,
					type: ContentType.URLEncoded
				}
			)
		}
	};
}
