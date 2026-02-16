/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: <jesting> */

import { expect } from "@jest/globals";
import {
	AppLocation,
	PostActionType,
	PostPriority,
	PostType
} from "loop-types";
import { AppBindingBuilder } from "../../../src/builders/app/app-binding.builder";
import { PostBuilder } from "../../../src/builders/post/post.builder";
import { PostPropsBuilder } from "../../../src/builders/post/post-props.builder";

describe("builders/post/post.builder", () => {
	describe("PostBuilder", () => {
		describe("constructor", () => {
			it("should construct with default values", () => {
				const builder = new PostBuilder();
				const result = builder.build();

				expect(result.message).toBe("");
				expect(result.root_id).toBe("");
				expect(result.file_ids).toEqual([]);
				expect(result.participants).toBeNull();
				expect(result.id).toBe("");
				expect(result.channel_id).toBe("");
				expect(result.user_id).toBe("");
				expect(result.original_id).toBe("");
				expect(result.pending_post_id).toBe("");
				expect(result.create_at).toBe(0);
				expect(result.update_at).toBe(0);
				expect(result.delete_at).toBe(0);
				expect(result.edit_at).toBe(0);
				expect(result.type).toBe(PostType.NULL);
				expect(result.hashtag).toBe("");
				expect(result.metadata).toEqual({});
				expect(result.reply_count).toBe(0);
				expect(result.last_reply_at).toBe(0);
			});

			it("should construct with partial post data", () => {
				const builder = new PostBuilder({
					message: "Test message",
					channel_id: "channel123",
					user_id: "user456"
				});

				const result = builder.build();
				expect(result.message).toBe("Test message");
				expect(result.channel_id).toBe("channel123");
				expect(result.user_id).toBe("user456");
			});

			it("should construct with full post data", () => {
				const builder = new PostBuilder({
					message: "Full message",
					root_id: "root123",
					file_ids: ["file1", "file2"],
					participants: ["user1", "user2"],
					id: "post123",
					channel_id: "channel123",
					user_id: "user456",
					original_id: "orig123",
					pending_post_id: "pending123",
					create_at: 1000,
					update_at: 2000,
					delete_at: 0,
					edit_at: 1500,
					type: PostType.NULL,
					hashtag: "#test",
					metadata: { priority: { priority: PostPriority.IMPORTANT } },
					reply_count: 5,
					last_reply_at: 3000,
					props: {
						from_bot: "true",
						attachments: []
					}
				});

				const result = builder.build();
				expect(result.message).toBe("Full message");
				expect(result.root_id).toBe("root123");
				expect(result.file_ids).toEqual(["file1", "file2"]);
				expect(result.participants).toEqual(["user1", "user2"]);
				expect(result.id).toBe("post123");
				expect(result.channel_id).toBe("channel123");
				expect(result.user_id).toBe("user456");
				expect(result.reply_count).toBe(5);
			});

			it("should handle custom metadata with generics", () => {
				interface CustomMetadata {
					userId: number;
					source: string;
				}

				const builder = new PostBuilder<CustomMetadata>({
					message: "Typed message",
					props: {
						metadata: {
							userId: 123,
							source: "api"
						}
					}
				});

				const metadata = builder.getPropsMetadata();
				expect(metadata).toBeDefined();
				expect(metadata?.userId).toBe(123);
				expect(metadata?.source).toBe("api");
				expect(metadata?.source).toBe("api");
			});
		});

		describe("build", () => {
			it("should return frozen post object", () => {
				const builder = new PostBuilder({ message: "Test" });
				const result = builder.build();

				expect(Object.isFrozen(result)).toBe(true);
				expect(Object.isFrozen(result.props)).toBe(true);
			});
		});

		describe("getAttachments", () => {
			it("should return empty array when no attachments", () => {
				const builder = new PostBuilder();
				const attachments = builder.getAttachments();

				expect(attachments).toEqual([]);
			});

			it("should return attachments array", () => {
				const builder = new PostBuilder();
				builder.attachments.set([
					{ text: "Attachment 1" },
					{ text: "Attachment 2" }
				]);

				const attachments = builder.getAttachments();
				expect(attachments).toHaveLength(2);
			});
		});

		describe("getFields", () => {
			it("should return undefined when no attachments", () => {
				const builder = new PostBuilder();
				const fields = builder.getFields();

				expect(fields).toBeUndefined();
			});

			it("should return fields from first attachment by default", () => {
				const builder = new PostBuilder();
				builder.attachments.set([{ text: "Attachment 1" }]);
				builder.fields.append(0, { title: "Field 1", value: "Value 1" });

				const fields = builder.getFields();
				expect(fields).toHaveLength(1);
			});

			it("should return fields from specific attachment by index", () => {
				const builder = new PostBuilder();
				builder.attachments.set([
					{ text: "Attachment 1" },
					{ text: "Attachment 2" }
				]);
				builder.fields.append(1, { title: "Field 2", value: "Value 2" });

				const fields = builder.getFields(1);
				expect(fields).toHaveLength(1);
			});

			it("should return fields using finder function", () => {
				const builder = new PostBuilder();
				builder.attachments.set([{ text: "First" }, { text: "Target" }]);
				builder.fields.append(1, { title: "Field", value: "Value" });

				const fields = builder.getFields(a => a.get("text") === "Target");
				expect(fields).toHaveLength(1);
			});

			it("should return undefined for out of bounds index", () => {
				const builder = new PostBuilder();
				builder.attachments.set([{ text: "Attachment 1" }]);

				const fields = builder.getFields(999);
				expect(fields).toBeUndefined();
			});
		});

		describe("getActions", () => {
			it("should return undefined when no attachments", () => {
				const builder = new PostBuilder();
				const actions = builder.getActions();

				expect(actions).toBeUndefined();
			});

			it("should return actions from first attachment by default", () => {
				const builder = new PostBuilder();
				builder.attachments.set([{ text: "Attachment 1" }]);
				builder.actions.append(0, {
					id: "action1",
					name: "Action 1",
					type: PostActionType.BUTTON,
					integration: { url: "/api" }
				});

				const actions = builder.getActions();
				expect(actions).toHaveLength(1);
			});

			it("should return actions from specific attachment by index", () => {
				const builder = new PostBuilder();
				builder.attachments.set([
					{ text: "Attachment 1" },
					{ text: "Attachment 2" }
				]);
				builder.actions.append(1, {
					id: "action2",
					name: "Action 2",
					type: PostActionType.BUTTON,
					integration: { url: "/api2" }
				});

				const actions = builder.getActions(1);
				expect(actions).toHaveLength(1);
			});

			it("should return undefined for out of bounds index", () => {
				const builder = new PostBuilder();
				builder.attachments.set([{ text: "Attachment 1" }]);

				const actions = builder.getActions(999);
				expect(actions).toBeUndefined();
			});
		});

		describe("getAllActions", () => {
			it("should return empty array when no attachments", () => {
				const builder = new PostBuilder();
				const actions = builder.getAllActions();

				expect(actions).toEqual([]);
				expect(Object.isFrozen(actions)).toBe(true);
			});

			it("should flatten all actions from all attachments", () => {
				const builder = new PostBuilder();
				builder.attachments.set([
					{ text: "Attachment 1" },
					{ text: "Attachment 2" }
				]);
				builder.actions.append(0, {
					id: "action1",
					name: "Action 1",
					type: PostActionType.BUTTON,
					integration: { url: "/api1" }
				});
				builder.actions.append(1, {
					id: "action2",
					name: "Action 2",
					type: PostActionType.BUTTON,
					integration: { url: "/api2" }
				});

				const actions = builder.getAllActions();
				expect(actions).toHaveLength(2);
			});
		});

		describe("getAllFields", () => {
			it("should return empty array when no attachments", () => {
				const builder = new PostBuilder();
				const fields = builder.getAllFields();

				expect(fields).toEqual([]);
				expect(Object.isFrozen(fields)).toBe(true);
			});

			it("should flatten all fields from all attachments", () => {
				const builder = new PostBuilder();
				builder.attachments.set([
					{ text: "Attachment 1" },
					{ text: "Attachment 2" }
				]);
				builder.fields.append(0, { title: "Field 1", value: "Value 1" });
				builder.fields.append(1, { title: "Field 2", value: "Value 2" });

				const fields = builder.getAllFields();
				expect(fields).toHaveLength(2);
			});
		});

		describe("getPropsMetadata", () => {
			it("should return undefined by default", () => {
				const builder = new PostBuilder();
				const metadata = builder.getPropsMetadata();

				expect(metadata).toEqual(undefined);
				expect(Object.isFrozen(metadata)).toBe(true);
			});

			it("should return frozen metadata object", () => {
				const builder = new PostBuilder({
					props: { metadata: { userId: 123 } }
				});
				const metadata = builder.getPropsMetadata();

				expect(metadata).toEqual({ userId: 123 });
				expect(Object.isFrozen(metadata)).toBe(true);
			});
		});

		describe("props namespace", () => {
			describe("set", () => {
				it("should replace entire props and return this for chaining", () => {
					const builder = new PostBuilder();
					const newProps = new PostPropsBuilder();

					const result = builder.props.set(newProps);

					expect(result).toBe(builder);
					expect(builder.get("props")).toBe(newProps);
				});
			});

			describe("update", () => {
				it("should update individual prop key and return this", () => {
					const builder = new PostBuilder();
					const result = builder.props.update("attachments", []);

					expect(result).toBe(builder);
					expect(builder.get("props").get("attachments")).toEqual([]);
				});
			});

			describe("metadata", () => {
				describe("add", () => {
					it("should merge metadata and return this", () => {
						const builder = new PostBuilder<{ existing: string; new?: string }>(
							{
								props: { metadata: { existing: "value" } }
							}
						);

						const result = builder.props.metadata.add({
							new: "data",
							existing: ""
						});

						expect(result).toBe(builder);
						expect(builder.get("props").get("metadata")).toEqual({
							existing: "",
							new: "data"
						});
					});

					it("should override existing keys when merging", () => {
						const builder = new PostBuilder<{ key: string }>({
							props: { metadata: { key: "old" } }
						});

						builder.props.metadata.add({ key: "new" });

						expect(builder.get("props").get("metadata")).toEqual({
							key: "new"
						});
					});
				});

				describe("set", () => {
					it("should replace metadata and return this", () => {
						const builder = new PostBuilder<{ old?: string; new?: string }>({
							props: { metadata: { old: "data" } }
						});

						const result = builder.props.metadata.set({ new: "data" });

						expect(result).toBe(builder);
						expect(builder.get("props").get("metadata")).toEqual({
							new: "data"
						});
					});
				});
			});
		});

		describe("bindings namespace", () => {
			describe("set", () => {
				it("should set app bindings and return this", () => {
					const builder = new PostBuilder();
					const result = builder.bindings.set([
						{
							app_id: "app123",
							location: AppLocation.EMBEDDED,
							description: "Test binding",
							bindings: []
						}
					]);

					expect(result).toBe(builder);
					expect(builder.get("props").get("app_bindings")).toHaveLength(1);
				});
			});

			describe("update", () => {
				it("should update binding property by index and return this", () => {
					const builder = new PostBuilder();
					builder.bindings.set([
						{
							app_id: "app123",
							location: AppLocation.EMBEDDED,
							description: "Old description",
							bindings: []
						}
					]);

					const result = builder.bindings.update(
						"description",
						"New description",
						0
					);

					expect(result).toBe(builder);
					expect(
						builder.get("props").get("app_bindings")[0]?.get("description")
					).toBe("New description");
				});

				it("should handle invalid index gracefully", () => {
					const builder = new PostBuilder();
					builder.bindings.set([
						{
							app_id: "app123",
							location: AppLocation.EMBEDDED,
							description: "Description",
							bindings: []
						}
					]);

					const result = builder.bindings.update("description", "New", 999);

					expect(result).toBe(builder);
				});

				it("should update using finder function", () => {
					const builder = new PostBuilder();
					builder.bindings.set([
						{
							app_id: "app123",
							location: AppLocation.EMBEDDED,
							description: "Description",
							bindings: []
						}
					]);

					builder.bindings.update(
						"description",
						"Updated",
						b => b.get("app_id") === "app123"
					);

					expect(
						builder.get("props").get("app_bindings")[0]?.get("description")
					).toBe("Updated");
				});
			});

			describe("filter", () => {
				it("should filter bindings and return this", () => {
					const builder = new PostBuilder();
					builder.bindings.set([
						{
							app_id: "app1",
							location: AppLocation.EMBEDDED,
							description: "Keep",
							bindings: []
						}
					]);
					builder.get("props").append(
						"app_bindings",
						new AppBindingBuilder({
							app_id: "app2",
							location: AppLocation.EMBEDDED,
							description: "Remove",
							bindings: []
						})
					);

					const result = builder.bindings.filter(b => {
						return b.get("description") === "Keep";
					});

					expect(result).toBe(builder);
					expect(builder.get("props").get("app_bindings")).toHaveLength(1);
				});
			});

			describe("clear", () => {
				it("should clear all bindings and return this", () => {
					const builder = new PostBuilder();
					builder.bindings.set([
						{
							app_id: "app123",
							location: AppLocation.EMBEDDED,
							description: "Test",
							bindings: []
						}
					]);

					const result = builder.bindings.clear();

					expect(result).toBe(builder);
					expect(builder.get("props").get("app_bindings")).toEqual([]);
				});
			});

			describe("append", () => {
				it("should append bindings and return this", () => {
					const builder = new PostBuilder();
					builder.bindings.set([
						{
							app_id: "app1",
							location: AppLocation.EMBEDDED,
							description: "First",
							bindings: []
						}
					]);

					const result = builder.bindings.append({
						app_id: "app2",
						location: AppLocation.EMBEDDED,
						description: "Second",
						bindings: []
					});

					expect(result).toBe(builder);
					expect(builder.get("props").get("app_bindings")).toHaveLength(2);
				});
			});
		});

		describe("attachments namespace", () => {
			describe("set", () => {
				it("should set attachments and return this", () => {
					const builder = new PostBuilder();
					const result = builder.attachments.set([
						{ text: "Attachment 1" },
						{ text: "Attachment 2" }
					]);

					expect(result).toBe(builder);
					expect(builder.getAttachments()).toHaveLength(2);
				});

				it("should replace existing attachments", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Old" }]);
					builder.attachments.set([{ text: "New" }]);

					expect(builder.getAttachments()).toHaveLength(1);
					expect(builder.getAttachments()[0]?.get("text")).toBe("New");
				});
			});

			describe("setProp", () => {
				it("should set attachment property by index and return this", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Old" }]);

					const result = builder.attachments.update("text", "New", 0);

					expect(result).toBe(builder);
					expect(builder.getAttachments()[0]?.get("text")).toBe("New");
				});

				it("should handle invalid index gracefully", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Old" }]);

					const result = builder.attachments.update("text", "New", 999);

					expect(result).toBe(builder);
					expect(builder.getAttachments()[0]?.get("text")).toBe("Old");
				});

				it("should work with finder function", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "First" }, { text: "Second" }]);

					builder.attachments.update(
						"title",
						"Updated",
						a => a.get("text") === "Second"
					);

					expect(builder.getAttachments()[1]?.get("title")).toBe("Updated");
				});
			});

			describe("append", () => {
				it("should append attachments and return this", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "First" }]);

					const result = builder.attachments.append({ text: "Second" });

					expect(result).toBe(builder);
					expect(builder.getAttachments()).toHaveLength(2);
				});
			});

			describe("clear", () => {
				it("should clear all attachments and return this", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Attachment" }]);

					const result = builder.attachments.clear();

					expect(result).toBe(builder);
					expect(builder.getAttachments()).toEqual([]);
				});
			});

			describe("filter", () => {
				it("should filter attachments and return this", () => {
					const builder = new PostBuilder();
					builder.attachments.set([
						{ text: "Keep" },
						{ text: "Remove" },
						{ text: "Keep" }
					]);

					const result = builder.attachments.filter(
						a => a.get("text") === "Keep"
					);

					expect(result).toBe(builder);
					expect(builder.getAttachments()).toHaveLength(2);
				});
			});

			describe("fill", () => {
				it("should apply mutation to all attachments and return this", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "First" }, { text: "Second" }]);

					const result = builder.attachments.mutateAll(at =>
						at.set("color", "#FF0000")
					);

					expect(result).toBe(builder);
					expect(builder.getAttachments()[0]?.get("color")).toBe("#FF0000");
					expect(builder.getAttachments()[1]?.get("color")).toBe("#FF0000");
				});
			});
		});

		describe("actions namespace", () => {
			describe("set", () => {
				it("should set actions for attachment and return this", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Attachment" }]);

					const result = builder.actions.set(0, {
						id: "action1",
						name: "Action 1",
						type: PostActionType.BUTTON,
						integration: { url: "/api" }
					});

					expect(result).toBe(builder);
					expect(builder.getActions(0)).toHaveLength(1);
				});

				it("should handle invalid attachment index gracefully", () => {
					const builder = new PostBuilder();

					const result = builder.actions.set(999, {
						id: "action1",
						name: "Action 1",
						type: PostActionType.BUTTON,
						integration: { url: "/api" }
					});

					expect(result).toBe(builder);
				});
			});

			describe("setProp", () => {
				it("should set action property and return this", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Attachment" }]);
					builder.actions.set(0, {
						id: "action1",
						name: "Old Name",
						type: PostActionType.BUTTON,
						integration: { url: "/api" }
					});

					const result = builder.actions.update("name", "New Name", 0, 0);

					expect(result).toBe(builder);
					expect(builder.getActions(0)?.[0]?.get("name")).toBe("New Name");
				});

				it("should handle invalid indices gracefully", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Attachment" }]);

					const result = builder.actions.update("name", "New", 999, 0);

					expect(result).toBe(builder);
				});
			});

			describe("append", () => {
				it("should append actions to attachment and return this", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Attachment" }]);
					builder.actions.set(0, {
						id: "action1",
						name: "Action 1",
						type: PostActionType.BUTTON,
						integration: { url: "/api1" }
					});

					const result = builder.actions.append(0, {
						id: "action2",
						name: "Action 2",
						type: PostActionType.BUTTON,
						integration: { url: "/api2" }
					});

					expect(result).toBe(builder);
					expect(builder.getActions(0)).toHaveLength(2);
				});

				it("should handle invalid attachment index gracefully", () => {
					const builder = new PostBuilder();

					const result = builder.actions.append(999, {
						id: "action1",
						name: "Action 1",
						type: PostActionType.BUTTON,
						integration: { url: "/api" }
					});

					expect(result).toBe(builder);
				});
			});

			describe("clear", () => {
				it("should clear actions from attachment and return this", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Attachment" }]);
					builder.actions.set(0, {
						id: "action1",
						name: "Action 1",
						type: PostActionType.BUTTON,
						integration: { url: "/api" }
					});

					const result = builder.actions.clear(0);

					expect(result).toBe(builder);
					expect(builder.getActions(0)).toEqual([]);
				});

				it("should clear from first attachment by default", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "First" }, { text: "Second" }]);
					builder.actions.set(0, {
						id: "action1",
						name: "Action 1",
						type: PostActionType.BUTTON,
						integration: { url: "/api" }
					});

					builder.actions.clear();

					expect(builder.getActions(0)).toEqual([]);
				});
			});

			describe("mutate", () => {
				it("should mutate action property and return this", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Attachment" }]);
					builder.actions.set(0, {
						id: "action1",
						name: "Action",
						type: PostActionType.BUTTON,
						integration: { url: "/api" }
					});

					const result = builder.actions.mutate(
						old => old.set("name", `${old.get("name")} Updated`),
						0,
						0
					);

					expect(result).toBe(builder);
					expect(builder.getActions(0)?.[0]?.get("name")).toBe(
						"Action Updated"
					);
				});
			});

			describe("filter", () => {
				it("should filter actions in attachment and return this", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Attachment" }]);
					builder.actions.set(
						0,
						{
							id: "keep",
							name: "Keep",
							type: PostActionType.BUTTON,
							integration: { url: "/api1" }
						},
						{
							id: "remove",
							name: "Remove",
							type: PostActionType.BUTTON,
							integration: { url: "/api2" }
						}
					);

					const result = builder.actions.filter(0, a => a.get("id") === "keep");

					expect(result).toBe(builder);
					expect(builder.getActions(0)).toHaveLength(1);
				});
			});

			describe("clearAll", () => {
				it("should clear actions from all attachments and return this", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "First" }, { text: "Second" }]);
					builder.actions.set(0, {
						id: "action1",
						name: "Action 1",
						type: PostActionType.BUTTON,
						integration: { url: "/api1" }
					});
					builder.actions.set(1, {
						id: "action2",
						name: "Action 2",
						type: PostActionType.BUTTON,
						integration: { url: "/api2" }
					});

					const result = builder.actions.clearAll();

					expect(result).toBe(builder);
					expect(builder.getAllActions()).toEqual([]);
				});

				it("should clear actions only from selected attachments", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Clear" }, { text: "Keep" }]);
					builder.actions.append(
						0,
						{
							id: "action1",
							name: "Action 1",
							type: PostActionType.BUTTON,
							integration: { url: "/api1" }
						},
						{
							id: "action2",
							name: "Action 2",
							type: PostActionType.BUTTON,
							integration: { url: "/api2" }
						}
					);

					builder.actions.clearAll(a => a.get("name") === "Action 1");

					expect(builder.getActions(0)?.[0]?.get("name")).toBe("Action 2");
					expect(builder.getActions(0)).toHaveLength(1);
				});
			});

			describe("filterAll", () => {
				it("should filter actions across all attachments and return this", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "First" }, { text: "Second" }]);
					builder.actions.set(
						0,
						{
							id: "keep1",
							name: "Keep",
							type: PostActionType.BUTTON,
							integration: { url: "/api1" }
						},
						{
							id: "remove1",
							name: "Remove",
							type: PostActionType.BUTTON,
							integration: { url: "/api2" }
						}
					);
					builder.actions.set(
						1,
						{
							id: "keep2",
							name: "Keep",
							type: PostActionType.BUTTON,
							integration: { url: "/api3" }
						},
						{
							id: "remove2",
							name: "Remove",
							type: PostActionType.BUTTON,
							integration: { url: "/api4" }
						}
					);

					const result = builder.actions.filterAll(
						a => a.get("name") === "Keep"
					);

					expect(result).toBe(builder);
					expect(builder.getAllActions()).toHaveLength(2);
				});

				it("should filter only in selected attachments", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Target" }, { text: "Skip" }]);
					builder.actions.set(
						0,
						{
							id: "1",
							name: "Keep",
							type: PostActionType.BUTTON,
							integration: { url: "/api1" }
						},
						{
							id: "2",
							name: "Remove",
							type: PostActionType.BUTTON,
							integration: { url: "/api2" }
						}
					);
					builder.actions.set(1, {
						id: "3",
						name: "Remove",
						type: PostActionType.BUTTON,
						integration: { url: "/api3" }
					});

					builder.actions.filterAll(
						a => a.get("name") === "Keep",
						at => at.get("text") === "Target"
					);

					expect(builder.getActions(0)).toHaveLength(1);
					expect(builder.getActions(1)).toHaveLength(1);
				});
			});

			describe("mutateAll", () => {
				it("should mutate all actions across attachments and return this", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "First" }, { text: "Second" }]);
					builder.actions.set(0, {
						id: "action1",
						name: "Action 1",
						type: PostActionType.BUTTON,
						integration: { url: "/api1" }
					});
					builder.actions.set(1, {
						id: "action2",
						name: "Action 2",
						type: PostActionType.BUTTON,
						integration: { url: "/api2" }
					});

					const result = builder.actions.mutateAll(a => {
						a.set("name", `${a.get("name")} Updated`);
						return a;
					});

					expect(result).toBe(builder);
					expect(builder.getActions(0)?.[0]?.get("name")).toBe(
						"Action 1 Updated"
					);
					expect(builder.getActions(1)?.[0]?.get("name")).toBe(
						"Action 2 Updated"
					);
				});

				it("should mutate only selected attachments", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Update" }, { text: "Skip" }]);
					builder.actions.set(0, {
						id: "action1",
						name: "Action 1",
						type: PostActionType.BUTTON,
						integration: { url: "/api1" }
					});
					builder.actions.set(1, {
						id: "action2",
						name: "Action 2",
						type: PostActionType.BUTTON,
						integration: { url: "/api2" }
					});

					builder.actions.mutateAll(
						a => {
							a.set("name", "Updated");
							return a;
						},
						at => at.get("text") === "Update"
					);

					expect(builder.getActions(0)?.[0]?.get("name")).toBe("Updated");
					expect(builder.getActions(1)?.[0]?.get("name")).toBe("Action 2");
				});

				it("should mutate only selected actions", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Attachment" }]);
					builder.actions.set(
						0,
						{
							id: "target",
							name: "Target",
							type: PostActionType.BUTTON,
							integration: { url: "/api1" }
						},
						{
							id: "skip",
							name: "Skip",
							type: PostActionType.BUTTON,
							integration: { url: "/api2" }
						}
					);

					builder.actions.mutateAll(
						a => {
							a.set("name", "Updated");
							return a;
						},
						undefined,
						ac => ac.get("id") === "target"
					);

					expect(builder.getActions(0)?.[0]?.get("name")).toBe("Updated");
					expect(builder.getActions(0)?.[1]?.get("name")).toBe("Skip");
				});
			});
		});

		describe("fields namespace", () => {
			describe("append", () => {
				it("should append fields to attachment and return this", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Attachment" }]);

					const result = builder.fields.append(
						0,
						{ title: "Field 1", value: "Value 1" },
						{ title: "Field 2", value: "Value 2" }
					);

					expect(result).toBe(builder);
					expect(builder.getFields(0)).toHaveLength(2);
				});

				it("should handle invalid attachment index gracefully", () => {
					const builder = new PostBuilder();

					const result = builder.fields.append(999, {
						title: "Field",
						value: "Value"
					});

					expect(result).toBe(builder);
				});
			});

			describe("set", () => {
				it("should set fields for attachment and return this", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Attachment" }]);
					builder.fields.append(0, { title: "Old", value: "Old" });

					const result = builder.fields.set(0, { title: "New", value: "New" });

					expect(result).toBe(builder);
					expect(builder.getFields(0)).toHaveLength(1);
					expect(builder.getFields(0)?.[0]?.get("title")).toBe("New");
				});
			});

			describe("setProp", () => {
				it("should set field property and return this", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Attachment" }]);
					builder.fields.append(0, { title: "Field", value: "Old Value" });

					const result = builder.fields.update("value", "New Value", 0, 0);

					expect(result).toBe(builder);
					expect(builder.getFields(0)?.[0]?.get("value")).toBe("New Value");
				});

				it("should handle invalid indices gracefully", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Attachment" }]);

					const result = builder.fields.update("value", "New", 999, 0);

					expect(result).toBe(builder);
				});
			});

			describe("clear", () => {
				it("should clear fields from attachment and return this", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Attachment" }]);
					builder.fields.append(0, { title: "Field", value: "Value" });

					const result = builder.fields.clear(0);

					expect(result).toBe(builder);
					expect(builder.getFields(0)).toEqual([]);
				});

				it("should clear from first attachment by default", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "First" }, { text: "Second" }]);
					builder.fields.append(0, { title: "Field", value: "Value" });

					builder.fields.clear();

					expect(builder.getFields(0)).toEqual([]);
				});
			});

			describe("mutate", () => {
				it("should mutate field property and return this", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Attachment" }]);
					builder.fields.append(0, { title: "Field", value: "Value" });

					const result = builder.fields.mutate(
						old => old.set("value", `${old.get("value")}!`),
						0,
						0
					);

					expect(result).toBe(builder);
					expect(builder.getFields(0)?.[0]?.get("value")).toBe("Value!");
				});
			});

			describe("filter", () => {
				it("should filter fields in attachment and return this", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Attachment" }]);
					builder.fields.append(
						0,
						{ title: "Keep", value: "Value 1" },
						{ title: "Remove", value: "Value 2" }
					);

					const result = builder.fields.filter(
						0,
						f => f.get("title") === "Keep"
					);

					expect(result).toBe(builder);
					expect(builder.getFields(0)).toHaveLength(1);
				});
			});

			describe("clearAll", () => {
				it("should clear fields from all attachments and return this", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "First" }, { text: "Second" }]);
					builder.fields.append(0, { title: "Field 1", value: "Value 1" });
					builder.fields.append(1, { title: "Field 2", value: "Value 2" });

					const result = builder.fields.clearAll();

					expect(result).toBe(builder);
					expect(builder.getAllFields()).toEqual([]);
				});

				it("should clear fields only from selected attachments", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Clear" }, { text: "Keep" }]);
					builder.fields.append(0, { title: "Field 1", value: "Value 1" });
					builder.fields.append(0, { title: "Field 2", value: "Value 2" });

					builder.fields.clearAll(f => f.get("title") === "Field 1");

					expect(builder.getFields(0)?.[0]?.get("title")).toBe("Field 2");
					expect(builder.getFields(0)).toHaveLength(1);
				});
			});

			describe("filterAll", () => {
				it("should filter fields across all attachments and return this", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "First" }, { text: "Second" }]);
					builder.fields.append(
						0,
						{ title: "Keep", value: "Value 1" },
						{ title: "Remove", value: "Value 2" }
					);
					builder.fields.append(
						1,
						{ title: "Keep", value: "Value 3" },
						{ title: "Remove", value: "Value 4" }
					);

					const result = builder.fields.filterAll(
						f => f.get("title") === "Keep"
					);

					expect(result).toBe(builder);
					expect(builder.getAllFields()).toHaveLength(2);
				});

				it("should filter only in selected attachments", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Target" }, { text: "Skip" }]);
					builder.fields.append(
						0,
						{ title: "Keep", value: "Value 1" },
						{ title: "Remove", value: "Value 2" }
					);
					builder.fields.append(1, { title: "Remove", value: "Value 3" });

					builder.fields.filterAll(
						f => f.get("title") === "Keep",
						at => at.get("text") === "Target"
					);

					expect(builder.getFields(0)).toHaveLength(1);
					expect(builder.getFields(1)).toHaveLength(1);
				});
			});

			describe("mutateAll", () => {
				it("should mutate all fields across attachments and return this", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "First" }, { text: "Second" }]);
					builder.fields.append(0, { title: "Field 1", value: "Value 1" });
					builder.fields.append(1, { title: "Field 2", value: "Value 2" });

					const result = builder.fields.mutateAll(f => {
						f.set("value", `${f.get("value")} Updated`);
						return f;
					});

					expect(result).toBe(builder);
					expect(builder.getFields(0)?.[0]?.get("value")).toBe(
						"Value 1 Updated"
					);
					expect(builder.getFields(1)?.[0]?.get("value")).toBe(
						"Value 2 Updated"
					);
				});

				it("should mutate only selected attachments", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Update" }, { text: "Skip" }]);
					builder.fields.append(0, { title: "Field 1", value: "Value 1" });
					builder.fields.append(1, { title: "Field 2", value: "Value 2" });

					builder.fields.mutateAll(
						f => {
							f.set("value", "Updated");
							return f;
						},
						at => at.get("text") === "Update"
					);

					expect(builder.getFields(0)?.[0]?.get("value")).toBe("Updated");
					expect(builder.getFields(1)?.[0]?.get("value")).toBe("Value 2");
				});

				it("should mutate only selected fields", () => {
					const builder = new PostBuilder();
					builder.attachments.set([{ text: "Attachment" }]);
					builder.fields.append(
						0,
						{ title: "Target", value: "Value 1" },
						{ title: "Skip", value: "Value 2" }
					);

					builder.fields.mutateAll(
						f => {
							f.set("value", "Updated");
							return f;
						},
						undefined,
						fld => fld.get("title") === "Target"
					);

					expect(builder.getFields(0)?.[0]?.get("value")).toBe("Updated");
					expect(builder.getFields(0)?.[1]?.get("value")).toBe("Value 2");
				});
			});
		});

		describe("buildToCreate", () => {
			it("should create channel post arguments", () => {
				const builder = new PostBuilder({ message: "Test message" });
				const args = builder.buildToCreate("channel", "channel123");

				expect(args.message).toBe("Test message");
				if ("channel_id" in args) {
					expect(args["channel_id"]).toBe("channel123");
				} else throw new Error("no channel_id in args!");
				expect(Object.isFrozen(args)).toBe(true);
			});

			it("should create user DM post arguments", () => {
				const builder = new PostBuilder({ message: "Test message" });
				const args = builder.buildToCreate("user", "user456");

				expect(args.message).toBe("Test message");
				// biome-ignore lint/suspicious/noExplicitAny: <jest>
				expect((args as any).to_user_id).toBe("user456");
				expect(Object.isFrozen(args)).toBe(true);
			});
		});

		describe("buildToUpdateArgs", () => {
			it("should create update arguments with id", () => {
				const builder = new PostBuilder({ message: "Updated message" });
				const args = builder.buildToUpdate("post123");

				expect(args.message).toBe("Updated message");
				expect(args.id).toBe("post123");
				expect(Object.isFrozen(args)).toBe(true);
			});
		});

		describe("chaining and complex operations", () => {
			it("should support method chaining", () => {
				const builder = new PostBuilder()
					.set("message", "Test")
					.set("channel_id", "channel123")
					.attachments.set([{ text: "Attachment" }])
					.actions.append(0, {
						id: "action1",
						name: "Action",
						type: PostActionType.BUTTON,
						integration: { url: "/api" }
					})
					.fields.append(0, { title: "Field", value: "Value" });

				const result = builder.build();
				expect(result.message).toBe("Test");
				expect(result.channel_id).toBe("channel123");
				expect(result.props.attachments).toHaveLength(1);
			});

			it("should handle complex nested operations", () => {
				const builder = new PostBuilder();

				builder.attachments.set([
					{ text: "Attachment 1" },
					{ text: "Attachment 2" }
				]);

				builder.actions.append(
					0,
					{
						id: "action1",
						name: "Action 1",
						type: PostActionType.BUTTON,
						integration: { url: "/api1" }
					},
					{
						id: "action2",
						name: "Action 2",
						type: PostActionType.BUTTON,
						integration: { url: "/api2" }
					}
				);

				builder.fields.append(
					1,
					{ title: "Field 1", value: "Value 1" },
					{ title: "Field 2", value: "Value 2" }
				);

				expect(builder.getActions(0)).toHaveLength(2);
				expect(builder.getFields(1)).toHaveLength(2);
				expect(builder.getAllActions()).toHaveLength(2);
				expect(builder.getAllFields()).toHaveLength(2);
			});
		});
	});
});
