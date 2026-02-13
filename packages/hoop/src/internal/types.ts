type KeysOfType<T, U> = {
	[K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type ArrayKeysOf<TYPE> = KeysOfType<TYPE, Array<unknown>>;

export type DeepReadonly<T> = T extends (infer U)[]
	? ReadonlyArray<DeepReadonly<U>>
	: T extends object
		? { readonly [K in keyof T]: DeepReadonly<T[K]> }
		: T;

export type DeepRequired<T> = {
	[K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K];
};

export type SelectedKeysOf<T, V extends keyof T> = V;

export type OptionalKeysOf<T> = {
	[P in keyof T]: undefined extends T[P] ? P : never;
}[keyof T];

export type Appendable = Array<unknown> | Record<string, unknown> | string;

export type AppendableKeysOf<T> = KeysOfType<T, Appendable>;
