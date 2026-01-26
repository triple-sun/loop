import type { Address, CloudCustomer, CloudCustomerPatch } from "../cloud";

export type CloudGetLimitsArguments = never;

export type CloudGetProductsArguments = never;

export type CloudGetSubscriptionArguments = never;

export type CloudUpdateSubscriptionArguments = never;

export type CloudGetInvoicesArguments = never;

export type CloudGetCustomerArguments = never;

export interface CloudUpdateCustomerArguments extends CloudCustomerPatch {
	customer: CloudCustomerPatch;
}

export interface CloudUpdateAddressArguments {
	address: Address;
}

export type CloudCreateCustomerPaymentArguments = never;

export interface CloudConfirmCustomerPaymentArguments {
	stripe_setup_intent_id: string;
}

export type CloudGetCustomerPaymentArguments = never;

export type CloudRequestTrialArguments = never;

export interface CloudValidateBusinessEmailArguments {
	email: string;
}
