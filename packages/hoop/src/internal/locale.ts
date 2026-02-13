type Locale = "ru" | "en";

let locale: Locale = "ru";

type LocaleDict = {
	submit: string;
	formTitle: string;
	dialogTitle: string;
};

const Dictionary: Record<Locale, LocaleDict> = {
	ru: {
		submit: "Отправить",
		formTitle: "Форма",
		dialogTitle: "Диалог"
	},
	en: {
		submit: "Submit",
		formTitle: "Form",
		dialogTitle: "Dialog"
	}
} as const;

export const Locale = {
	get: (key: keyof LocaleDict): string => {
		return Dictionary[locale][key] ?? "";
	}
};

export const setLocale = (l: Locale): void => {
	locale = l;
};
