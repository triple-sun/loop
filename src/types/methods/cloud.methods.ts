import type { Address, CloudCustomer, CloudCustomerPatch } from "../cloud";

export type CloudGetLimitsArguments = {};

export type CloudGetProductsArguments = {};

export type CloudGetSubscriptionArguments = {};

export type CloudUpdateSubscriptionArguments = {};

export type CloudGetInvoicesArguments = {};

export type CloudGetCustomerArguments = {};

export interface CloudUpdateCustomerArguments {
	customer: CloudCustomerPatch;
}

export interface CloudUpdateAddressArguments {
	address: Address;
}

export type CloudCreateCustomerPaymentArguments = {};

export interface CloudConfirmCustomerPaymentArguments {
	stripe_setup_intent_id: string;
}

export type CloudGetCustomerPaymentArguments = {};

export type CloudRequestTrialArguments = {};

export interface CloudValidateBusinessEmailArguments {
	email: string;
}
