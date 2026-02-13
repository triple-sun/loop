import type { Dialog, DialogElement } from "loop-types";
import { Builder } from "../../internal/builders";
import { Locale } from "../../internal/locale";
import {
	createDialogElementBuilder,
	type DialogElementBuilder
} from "./dialog-element.builder";

export interface DialogData extends Omit<Required<Dialog>, "elements"> {
	elements: DialogElementBuilder<DialogElement>[];
}

/**
 * Dialog builder
 *
 * @see {@link https://developers.mattermost.com/integrate/plugins/interactive-dialogs/ | Interactive dialogs}
 */
export class DialogBuilder<
	DIALOG_STATE = Record<string, unknown>
> extends Builder<Dialog, "elements", DialogData> {
	constructor(d: Partial<Dialog> = {}) {
		super({
			title: d.title ?? Locale.get("dialogTitle"),
			introduction_text: d.introduction_text ?? "",
			icon_url: d.icon_url ?? "",
			submit_label: d.submit_label ?? Locale.get("submit"),
			notify_on_cancel: d.notify_on_cancel ?? false,
			state: d.state ?? "{}",
			elements: (d.elements ?? [])?.map(createDialogElementBuilder),
			is_multistep: d.is_multistep ?? false
		});
	}

	public readonly state = {
		set: (meta: DIALOG_STATE): this => {
			this.d.state = JSON.stringify(meta);
			return this;
		},
		add: (meta: DIALOG_STATE): this => {
			try {
				this.d.state = JSON.stringify({
					...JSON.parse(this.d.state ?? "{}"),
					...meta
				});
			} catch (error) {
				throw new Error(`Failed to parse dialog state: ${error}`);
			}

			return this;
		}
	} as const;

	override build(): Readonly<Dialog> {
		return Object.freeze({
			...this.d,
			elements: this.d.elements.map(el => el.build())
		});
	}
}

export const createDialogBuilder = <DIALOG_STATE = Record<string, unknown>>(
	d: Partial<Dialog> = {}
): DialogBuilder<DIALOG_STATE> => new DialogBuilder<DIALOG_STATE>(d);
