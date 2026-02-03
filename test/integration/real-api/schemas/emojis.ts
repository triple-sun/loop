export enum EmojiCategory {
	RECENT = "recent",
	SEARCH_RESULTS = "searchResults",
	SMILEYS_EMOTION = "smileys-emotion",
	PEOPLE_BODY = "people-body",
	ANIMALS_NATURE = "animals-nature",
	FOOD_DRINK = "food-drink",
	ACTIVITIES = "activities",
	TRAVEL_PLACES = "travel-places",
	OBJECTS = "objects",
	SYMBOLS = "symbols",
	FLAGS = "flags",
	CUSTOM = "custom"
}

export type Emoji = SystemEmoji | CustomEmoji;

export interface RecentEmojiData {
	name: string;
	usageCount: number;
}

export interface CustomEmoji {
	id: string;
	name: string;
	category: EmojiCategory.CUSTOM;
	create_at: number;
	update_at: number;
	delete_at: number;
	creator_id: string;
}

export interface SystemEmoji {
	name: string;
	category: EmojiCategory;
	image: string;
	short_name: string;
	short_names: string[];
	batch: number;
	skins?: string[];
	skin_variations?: Record<string, SystemEmojiVariation>;
	unified: string;
}

export interface SystemEmojiVariation {
	unified: string;
	non_qualified: null;
	image: string;
	sheet_x: number;
	sheet_y: number;
	added_in: string;
	has_img_apple: boolean;
	has_img_google: boolean;
	has_img_twitter: boolean;
	has_img_facebook: boolean;
}
