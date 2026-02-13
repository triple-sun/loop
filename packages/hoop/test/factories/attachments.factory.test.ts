import { expect } from "@jest/globals";
import { AttachmentBuilder } from "../../src/builders/post/post-attachment.builder";
import { AttachmentFactory } from "../../src/factories/attachments.factory";

describe("factories/attachment", () => {
	describe("AttachmentFactory", () => {
		describe("Divider", () => {
			it("should create a divider attachment", () => {
				const divider = AttachmentFactory.Divider;

				expect(divider).toBeInstanceOf(AttachmentBuilder);
				expect(divider.get("text")).toBe("\n\n---\n\n");
			});
		});

		describe("AsUser", () => {
			it("should create a user attribution attachment", () => {
				const attachment = AttachmentFactory.AsUser({
					text: "User message",
					username: "john.doe",
					team: "myteam",
					url: "https://mattermost.example.com"
				});

				expect(attachment).toBeInstanceOf(AttachmentBuilder);
				expect(attachment.get("text")).toBe("User message");
				expect(attachment.get("author_link")).toBe(
					"https://mattermost.example.com/myteam/messages/@john.doe"
				);
			});

			it("should handle empty username", () => {
				const attachment = AttachmentFactory.AsUser({
					text: "Message",
					username: "",
					team: "team",
					url: "https://example.com"
				});

				expect(attachment.get("author_link")).toBe("");
			});

			it("should preserve author_icon if provided", () => {
				const attachment = AttachmentFactory.AsUser({
					text: "Message",
					username: "user",
					team: "team",
					url: "https://example.com",
					author_icon: "https://example.com/icon.png"
				});

				expect(attachment.get("author_icon")).toBe(
					"https://example.com/icon.png"
				);
			});
		});

		describe("Section", () => {
			it("should create a section attachment with default text", () => {
				const section = AttachmentFactory.Section();

				expect(section).toBeInstanceOf(AttachmentBuilder);
				expect(section.get("text")).toBe("");
			});

			it("should create a section with provided text", () => {
				const section = AttachmentFactory.Section({ text: "Section content" });

				expect(section.get("text")).toBe("Section content");
			});

			it("should handle all attachment properties", () => {
				const section = AttachmentFactory.Section({
					text: "Content",
					color: "#FF0000",
					pretext: "Pretext",
					author_name: "Author"
				});

				expect(section.get("color")).toBe("#FF0000");
				expect(section.get("pretext")).toBe("Pretext");
				expect(section.get("author_name")).toBe("Author");
			});
		});
	});
});
