import {
	type Option,
	type PostActionButton,
	type PostActionSelect,
	PostActionType,
	SelectDataSource
} from "loop-types";
import {
	type ActionBuilder,
	createActionBuilder
} from "../builders/post/post-attachment-action.builder";

/** Суб-элементы обьекта Attachments */
export const ActionFactory = {
	/**
	 * Функция создания action-кнопки массива actions обьекта
	 *
	 * {@link https://developers.mattermost.com/integrate/reference/message-attachments/ | Документация attachments}
	 * {@link https://developers.mattermost.com/integrate/reference/message-attachments/ | Документация interactive messages}
	 */
	Button: <CONTEXT = Record<string, unknown>>(
		a: Omit<PostActionButton<CONTEXT>, "type">
	): ActionBuilder<CONTEXT, PostActionButton<CONTEXT>> =>
		createActionBuilder({ ...a, type: PostActionType.BUTTON }),

	Select: {
		/**
		 * Функция создания выпадающего списка с заданным набором опций		 *
		 * {@link https://developers.mattermost.com/integrate/reference/message-attachments/ | Документация attachments}
		 * {@link https://developers.mattermost.com/integrate/reference/message-attachments/ | Документация interactive messages}
		 */
		Static: <CONTEXT = Record<string, unknown>>(
			a: Omit<PostActionSelect<CONTEXT>, "type" | "options" | "data_source"> & {
				options: Option[];
			}
		) =>
			createActionBuilder<CONTEXT, PostActionSelect<CONTEXT>>({
				...a,
				type: PostActionType.SELECT,
				data_source: undefined
			}),

		/**
		 * Функция создания выпадающего списка выбора канала
		 *
		 * {@link https://developers.mattermost.com/integrate/reference/message-attachments/ | Документация attachments}
		 * {@link https://developers.mattermost.com/integrate/reference/message-attachments/ | Документация interactive messages}
		 */
		Channels: <CONTEXT = Record<string, unknown>>(
			a: Omit<PostActionSelect<CONTEXT>, "type" | "options" | "data_source">
		) =>
			createActionBuilder<CONTEXT, PostActionSelect<CONTEXT>>({
				...a,
				type: PostActionType.SELECT,
				options: [],
				data_source: SelectDataSource.CHANNELS
			}),

		/**
		 * Функция создания выпадающего списка выбора пользователя
		 *
		 * {@link https://developers.mattermost.com/integrate/reference/message-attachments/ | Документация attachments}
		 * {@link https://developers.mattermost.com/integrate/reference/message-attachments/ | Документация interactive messages}
		 */
		Users: <CONTEXT = Record<string, unknown>>(
			a: Omit<PostActionSelect<CONTEXT>, "type" | "options" | "data_source">
		) =>
			createActionBuilder<CONTEXT, PostActionSelect<CONTEXT>>({
				...a,
				type: PostActionType.SELECT,
				options: [],
				data_source: SelectDataSource.USERS
			})
	} as const
} as const;
