import type { WritableKeysOf } from "type-fest";
import type { Mutagen } from "../types";
import type { Appendable, AppendableKeysOf, OptionalKeysOf } from "./types";
import { append } from "./utils";

export abstract class Buildable<
	RESULT,
	BUILDABLE_KEYS extends keyof RESULT = never,
	DATA extends Omit<RESULT, BUILDABLE_KEYS> = RESULT
> {
	protected d: DATA;
	constructor(initial: DATA) {
		this.d = initial;
	}
	abstract build(): Readonly<RESULT>;
}

export abstract class Builder<
	RESULT,
	BUILDABLE_KEYS extends keyof RESULT = never,
	DATA extends Omit<RESULT, BUILDABLE_KEYS> = RESULT
> extends Buildable<RESULT, BUILDABLE_KEYS, DATA> {
	/**
	 * Get property value
	 */
	public get<K extends keyof DATA>(k: K): DATA[typeof k] {
		return this.d[k];
	}

	/**
	 * Set property value
	 */
	public set<K extends WritableKeysOf<DATA>>(key: K, value: DATA[K]): this {
		this.d[key] = value;
		return this;
	}

	/**
	 * Mutate property value
	 */
	public mutate<K extends WritableKeysOf<DATA>>(
		key: K,
		mutate: Mutagen<DATA[K]>
	): this {
		this.d[key] = mutate(this.d[key]);
		return this;
	}

	/**
	 * Append to property
	 */
	public append<K extends AppendableKeysOf<DATA>>(
		key: K,
		...data: DATA[K] extends Array<unknown> ? Array<DATA[K][number]> : DATA[K][]
	): this {
		if (
			this.d[key] !== null &&
			this.d[key] !== undefined &&
			(Array.isArray(this.d[key]) ||
				typeof this.d[key] === "string" ||
				typeof this.d[key] === "object")
		) {
			this.d[key] = append(this.d[key] as Appendable, data) as DATA[K];
		}
		return this;
	}

	/**
	 * Remove prop (set undefined)
	 */
	public remove<K extends OptionalKeysOf<DATA>>(k: K): this {
		/** Removeability is guaranteed by OptionalKeys type */
		this.d[k] = undefined as DATA[K];
		return this;
	}
}
