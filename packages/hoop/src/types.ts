export type Filter<T> = (element: T, index?: number) => boolean;
export type Mutagen<T> = (element: T, index?: number) => T;
export type Finder<T extends Array<unknown>> = (
	element: T[number],
	index?: number
) => boolean;
export type Selector<T> = (element: T, index?: number) => boolean;

export type IndexOrFinder<T> = number | ((el: T) => boolean);
