import type { AllowedIPRange } from "./config";

export interface CloudInstallation {
	id: string;
	state: string;
	allowed_ip_ranges: AllowedIPRange[];
}

export interface CloudSubscription {
	id: string;
	customer_id: string;
	product_id: string;
	add_ons: string[];
	start_at: number;
	end_at: number;
	create_at: number;
	seats: number;
	last_invoice?: CloudInvoice;
	upcoming_invoice?: CloudInvoice;
	trial_end_at: number;
	is_free_trial: string;
	delinquent_since?: number;
	compliance_blocked?: string;
	billing_type?: string;
	cancel_at?: number;
	will_renew?: string;
	simulated_current_time_ms?: number;
}

export interface CloudProduct {
	id: string;
	name: string;
	description: string;
	price_per_seat: number;
	add_ons: CloudAddOn[];
	product_family: string;
	sku: string;
	billing_scheme: string;
	recurring_interval: string;
	cross_sells_to: string;
}

export interface CloudAddOn {
	id: string;
	name: string;
	display_name: string;
	price_per_seat: number;
}

// Customer model represents a customer on the system.
export interface CloudCustomer {
	id: string;
	creator_id: string;
	create_at: number;
	email: string;
	name: string;
	num_employees: number;
	contact_first_name: string;
	contact_last_name: string;
	billing_address: CloudCustomerAddress;
	company_address: CloudCustomerAddress;
	payment_method: CloudCustomerPaymentMethod;
}

// CustomerPatch model represents a customer patch on the system.
export interface CloudCustomerPatch {
	email?: string;
	name?: string;
	num_employees?: number;
	contact_first_name?: string;
	contact_last_name?: string;
}

// Address model represents a customer's address.
export interface CloudCustomerAddress {
	city: string;
	country: string;
	line1: string;
	line2: string;
	postal_code: string;
	state: string;
}

// PaymentMethod represents methods of payment for a customer.
export interface CloudCustomerPaymentMethod {
	type: string;
	last_four: string;
	exp_month: number;
	exp_year: number;
	card_brand: string;
	name: string;
}

export interface CloudNotifyAdminRequest {
	trial_notification: boolean;
	required_plan: string;
	required_feature: string;
}

// Invoice model represents a invoice on the system.
export interface CloudInvoice {
	id: string;
	number: string;
	create_at: number;
	total: number;
	tax: number;
	status: string;
	description: string;
	period_start: number;
	period_end: number;
	subscription_id: string;
	line_items: CloudInvoiceLineItem[];
	current_product_name: string;
}

// actual string values come from customer-web-server and should be kept in sync with values seen there
export enum CloudInvoiceLineItemType {
	FULL = "full",
	PARTIAL = "partial",
	ON_PREMISE = "onpremise",
	METERED = "metered"
}

// InvoiceLineItem model represents a invoice lineitem tied to an invoice.
export interface CloudInvoiceLineItem {
	price_id: string;
	total: number;
	quantity: number;
	price_per_unit: number;
	description: string;
	type: CloudInvoiceLineItemType;
	metadata: Record<string, string>;
	period_start: number;
	period_end: number;
}

export interface CloudLimits {
	messages?: {
		history?: number;
	};
	files?: {
		total_storage?: number;
	};
	teams?: {
		active?: number;
	};
}

export interface CloudUsage {
	files: {
		totalStorage: number;
		totalStorageLoaded: boolean;
	};
	messages: {
		history: number;
		historyLoaded: boolean;
	};
	teams: CloudTeamsUsage;
}

export interface CloudTeamsUsage {
	active: number;
	cloudArchived: number;
	teamsLoaded: boolean;
}

export interface CloudValidBusinessEmail {
	is_valid: boolean;
}

export interface CloudNewsletterRequestBody {
	email: string;
	subscribed_content: string;
}

export interface CloudFeedback {
	reason: string;
	comments: string;
}
