import type { IndexOrFinder, Mutagen, Selector } from "../types";
import type { Appendable } from "./types";

/**
 * @internal
 * Finds an array element based on index or finder function
 *
 * @param source - source array
 * @param finder - finder function or index
 * @returns found element
 */
export const find = <T>(
	finder: IndexOrFinder<T>,
	source?: ReadonlyArray<T>
): T | undefined => {
	if (!source) return undefined;
	switch (typeof finder) {
		case "number":
			return source[finder];
		default:
			return source.find(finder);
	}
};

export const findIndex = <T>(
	finder: IndexOrFinder<T>,
	source?: ReadonlyArray<T>
): number => {
	if (!source) return -1;
	switch (typeof finder) {
		case "number":
			return finder >= 0 && finder < source.length ? finder : -1;
		default:
			return source.findIndex(finder);
	}
};

/**
 * @internal
 *
 * Checks anything against appropriate selector function
 *
 * @param source - source object
 * @param selector - selector function
 * @param index - index for array elements
 * @returns true if selected
 */
export const isSelected = <T>(
	source: T,
	selector?: Selector<T>,
	index?: number
): boolean => !(selector && !selector(source, index));

export const append = <A extends Appendable>(
	a: A,
	...rest: A extends Array<unknown> ? A[number][] : A[]
): A => {
	if (typeof a === "string") return (a + rest.join("")) as A;

	if (typeof a === "object" && a !== null) {
		if (Array.isArray(a) && Array.isArray(rest)) {
			return [
				...a,
				...rest.flatMap(item => (Array.isArray(item) ? item : [item]))
			] as A;
		}

		return rest.reduce(
			(acc, item) => ({ ...(acc as object), ...(item as object) }) as A,
			a
		) as A;
	}

	throw new TypeError(
		`Append expects compatible Appendable types, got: ${typeof a} and ${typeof rest[0]}`
	);
};

export const mutateCollection = <T>(
	collection: Array<T>,
	mutagen: Mutagen<T>,
	finder: IndexOrFinder<T>
): Array<T> => {
	const index = findIndex(finder, collection);

	if (index >= 0 && collection[index]) {
		const updated = [...collection];
		updated[index] = mutagen(collection[index]);
		return updated;
	}

	return collection;
};

/**
 *
 * @param collection - source item collection
 * @param selector - optional selector to choose which items to remove
 * @returns
 */
export const clearCollection = <T>(
	collection: Array<T>,
	selector?: Selector<T>
): Array<T> => {
	if (!selector) {
		return [];
	}

	return collection.filter((item, index) => !isSelected(item, selector, index));
};
