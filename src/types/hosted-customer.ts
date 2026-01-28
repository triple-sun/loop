import type { Product } from "./cloud";

export type HostedCustomerState = {
	products: {
		products: Record<string, Product>;
		productsLoaded: boolean;
	};
};
