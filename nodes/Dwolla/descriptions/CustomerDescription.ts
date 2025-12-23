/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const customerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customer'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new customer',
				action: 'Create a customer',
			},
			{
				name: 'Deactivate',
				value: 'deactivate',
				description: 'Deactivate a customer',
				action: 'Deactivate a customer',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a customer by ID',
				action: 'Get a customer',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many customers',
				action: 'Get many customers',
			},
			{
				name: 'Retry Verification',
				value: 'retryVerification',
				description: 'Retry customer verification',
				action: 'Retry customer verification',
			},
			{
				name: 'Suspend',
				value: 'suspend',
				description: 'Suspend a customer',
				action: 'Suspend a customer',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a customer',
				action: 'Update a customer',
			},
		],
		default: 'create',
	},
];

export const customerFields: INodeProperties[] = [
	// ----------------------------------
	//         customer: create
	// ----------------------------------
	{
		displayName: 'Customer Type',
		name: 'type',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Receive Only',
				value: 'receive-only',
				description: 'Can only receive funds',
			},
			{
				name: 'Unverified',
				value: 'unverified',
				description: 'Basic customer with limited functionality',
			},
			{
				name: 'Personal Verified',
				value: 'personal',
				description: 'Verified individual customer',
			},
			{
				name: 'Business Verified',
				value: 'business',
				description: 'Verified business customer',
			},
		],
		default: 'unverified',
		description: 'The type of customer to create',
	},
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Customer\'s first name',
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Customer\'s last name',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Customer\'s email address',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Address Line 1',
				name: 'address1',
				type: 'string',
				default: '',
				description: 'Street address',
			},
			{
				displayName: 'Address Line 2',
				name: 'address2',
				type: 'string',
				default: '',
				description: 'Apartment, suite, etc.',
			},
			{
				displayName: 'Business Classification',
				name: 'businessClassification',
				type: 'string',
				default: '',
				description: 'The industry classification ID for the business',
			},
			{
				displayName: 'Business Name',
				name: 'businessName',
				type: 'string',
				default: '',
				description: 'Registered business name (required for business type)',
			},
			{
				displayName: 'Business Type',
				name: 'businessType',
				type: 'options',
				options: [
					{ name: 'Corporation', value: 'corporation' },
					{ name: 'LLC', value: 'llc' },
					{ name: 'Partnership', value: 'partnership' },
					{ name: 'Sole Proprietorship', value: 'soleProprietorship' },
				],
				default: 'llc',
				description: 'Type of business entity',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City of residence',
			},
			{
				displayName: 'Correlation ID',
				name: 'correlationId',
				type: 'string',
				default: '',
				description: 'Unique identifier for idempotency',
			},
			{
				displayName: 'Date of Birth',
				name: 'dateOfBirth',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				description: 'Date of birth in YYYY-MM-DD format (required for verified customers)',
			},
			{
				displayName: 'Doing Business As',
				name: 'doingBusinessAs',
				type: 'string',
				default: '',
				description: 'DBA or trade name of the business',
			},
			{
				displayName: 'EIN',
				name: 'ein',
				type: 'string',
				default: '',
				description: 'Employer Identification Number (for business)',
			},
			{
				displayName: 'IP Address',
				name: 'ipAddress',
				type: 'string',
				default: '',
				description: 'Customer\'s IP address',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Customer\'s phone number',
			},
			{
				displayName: 'Postal Code',
				name: 'postalCode',
				type: 'string',
				default: '',
				description: 'ZIP or postal code',
			},
			{
				displayName: 'SSN',
				name: 'ssn',
				type: 'string',
				default: '',
				description: 'Social Security Number (last 4 digits or full, required for verified personal)',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'Two-letter state abbreviation',
			},
			{
				displayName: 'Website',
				name: 'website',
				type: 'string',
				default: '',
				description: 'Business website URL',
			},
		],
	},

	// ----------------------------------
	//         customer: get
	// ----------------------------------
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['get', 'update', 'suspend', 'deactivate', 'retryVerification'],
			},
		},
		default: '',
		description: 'The ID of the customer',
	},

	// ----------------------------------
	//         customer: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 200,
		},
		default: 25,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'Filter by email address',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search by firstName, lastName, email, or businessName',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Deactivated', value: 'deactivated' },
					{ name: 'Document', value: 'document' },
					{ name: 'Retry', value: 'retry' },
					{ name: 'Suspended', value: 'suspended' },
					{ name: 'Unverified', value: 'unverified' },
					{ name: 'Verified', value: 'verified' },
				],
				default: 'verified',
				description: 'Filter by customer status',
			},
		],
	},

	// ----------------------------------
	//         customer: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Address Line 1',
				name: 'address1',
				type: 'string',
				default: '',
				description: 'Street address',
			},
			{
				displayName: 'Address Line 2',
				name: 'address2',
				type: 'string',
				default: '',
				description: 'Apartment, suite, etc.',
			},
			{
				displayName: 'Business Name',
				name: 'businessName',
				type: 'string',
				default: '',
				description: 'Registered business name',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City of residence',
			},
			{
				displayName: 'Doing Business As',
				name: 'doingBusinessAs',
				type: 'string',
				default: '',
				description: 'DBA or trade name',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'Email address',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'First name',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'Last name',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number',
			},
			{
				displayName: 'Postal Code',
				name: 'postalCode',
				type: 'string',
				default: '',
				description: 'ZIP or postal code',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'Two-letter state abbreviation',
			},
			{
				displayName: 'Website',
				name: 'website',
				type: 'string',
				default: '',
				description: 'Website URL',
			},
		],
	},
];
