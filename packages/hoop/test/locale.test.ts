import { expect } from "@jest/globals";
import { Locale, setLocale } from "../src/internal/locale";

describe("internal/locale", () => {
	describe("Locale.get", () => {
		it("should return default ru locale values", () => {
			expect(Locale.get("submit")).toBe("Отправить");
			expect(Locale.get("formTitle")).toBe("Форма");
			expect(Locale.get("dialogTitle")).toBe("Диалог");
		});
	});

	describe("setLocale", () => {
		it("should switch to en locale", () => {
			setLocale("en");
			expect(Locale.get("submit")).toBe("Submit");
			expect(Locale.get("formTitle")).toBe("Form");
			expect(Locale.get("dialogTitle")).toBe("Dialog");
		});

		it("should switch back to ru locale", () => {
			setLocale("ru");
			expect(Locale.get("submit")).toBe("Отправить");
		});
	});
});
