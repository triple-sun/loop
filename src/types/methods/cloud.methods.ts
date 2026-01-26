import type { Address, CloudCustomerPatch } from "../cloud";

export interface CloudUpdateCustomerArguments extends CloudCustomerPatch {
	customer: CloudCustomerPatch;
}

export interface CloudUpdateAddressArguments {
	address: Address;
}

export interface CloudConfirmCustomerPaymentArguments {
	stripe_setup_intent_id: string;
}

export interface CloudValidateBusinessEmailArguments {
	email: string;
}
