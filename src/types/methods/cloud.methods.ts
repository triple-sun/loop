import type { CloudCustomerAddress, CloudCustomerPatch } from "../cloud";

export interface CloudUpdateCustomerArguments extends CloudCustomerPatch {
	customer: CloudCustomerPatch;
}

export interface CloudUpdateAddressArguments {
	address: CloudCustomerAddress;
}

export interface CloudConfirmCustomerPaymentArguments {
	stripe_setup_intent_id: string;
}

export interface CloudValidateBusinessEmailArguments {
	email: string;
}
