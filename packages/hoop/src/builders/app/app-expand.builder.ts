import { AppExpandLevel, type AppExpand as Expand } from "loop-types";
import { Builder } from "../../internal/builders";

export class ExpandBuilder extends Builder<Expand> {
	constructor(e: Expand = {}) {
		super({
			acting_user: e?.acting_user ?? AppExpandLevel.ALL,
			acting_user_access_token:
				e?.acting_user_access_token ?? AppExpandLevel.ALL,
			app: e?.app ?? AppExpandLevel.ALL,
			channel: e?.channel ?? AppExpandLevel.ALL,
			config: e?.config ?? AppExpandLevel.ALL,
			locale: e?.locale ?? AppExpandLevel.ALL,
			mentioned: e?.mentioned ?? AppExpandLevel.ALL,
			parent_post: e?.parent_post ?? AppExpandLevel.ALL,
			post: e?.post ?? AppExpandLevel.ALL,
			root_post: e?.root_post ?? AppExpandLevel.ALL,
			team: e?.team ?? AppExpandLevel.ALL,
			user: e?.user ?? AppExpandLevel.ALL
		});
	}

	public override build(): Readonly<Expand> {
		return Object.freeze(this.d);
	}
}

export const createExpandBuilder = (e: Expand = {}): ExpandBuilder =>
	new ExpandBuilder(e);
