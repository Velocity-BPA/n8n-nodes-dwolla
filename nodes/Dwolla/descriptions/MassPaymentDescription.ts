/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const massPaymentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['massPayment'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new mass payment',
				action: 'Create a mass payment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a mass payment by ID',
				action: 'Get a mass payment',
			},
			{
				name: 'Get Items',
				value: 'getItems',
				description: 'Get items for a mass payment',
				action: 'Get mass payment items',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all mass payments for a customer',
				action: 'Get many mass payments',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a mass payment status',
				action: 'Update a mass payment',
			},
		],
		default: 'create',
	},
];

export const massPaymentFields: INodeProperties[] = [
	// ----------------------------------
	//         massPayment: create
	// ----------------------------------
	{
		displayName: 'Source Funding Source ID',
		name: 'sourceFundingSourceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['massPayment'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The ID of the source funding source for the mass payment',
	},
	{
		displayName: 'Items',
		name: 'items',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['massPayment'],
				operation: ['create'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Payment Items',
				name: 'itemValues',
				values: [
					{
						displayName: 'Destination Funding Source ID',
						name: 'destinationFundingSourceId',
						type: 'string',
						required: true,
						default: '',
						description: 'The ID of the destination funding source',
					},
					{
						displayName: 'Amount',
						name: 'amount',
						type: 'string',
						required: true,
						default: '',
						placeholder: '10.00',
						description: 'The payment amount (e.g., "10.00")',
					},
					{
						displayName: 'Metadata',
						name: 'metadata',
						type: 'json',
						default: '{}',
						description: 'Optional metadata for this payment item',
					},
				],
			},
		],
		description: 'The payment items to include in the mass payment',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['massPayment'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'ACH Details',
				name: 'achDetails',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				options: [
					{
						displayName: 'ACH Details',
						name: 'achDetailsValues',
						values: [
							{
								displayName: 'Addenda',
								name: 'addenda',
								type: 'fixedCollection',
								default: {},
								typeOptions: {
									multipleValues: true,
								},
								options: [
									{
										displayName: 'Addenda Records',
										name: 'addendaValues',
										values: [
											{
												displayName: 'Value',
												name: 'value',
												type: 'string',
												default: '',
												description: 'Addenda record value (max 80 chars)',
											},
										],
									},
								],
								description: 'ACH addenda records',
							},
						],
					},
				],
				description: 'ACH-specific details',
			},
			{
				displayName: 'Clearing Destination',
				name: 'clearingDestination',
				type: 'options',
				options: [
					{ name: 'Standard', value: 'standard' },
					{ name: 'Next Available', value: 'next-available' },
					{ name: 'Same Day', value: 'same-day' },
				],
				default: 'standard',
				description: 'Clearing speed for destinations',
			},
			{
				displayName: 'Correlation ID',
				name: 'correlationId',
				type: 'string',
				default: '',
				description: 'Unique identifier for idempotency',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Custom metadata for the mass payment',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Deferred', value: 'deferred' },
				],
				default: 'deferred',
				description: 'Set to deferred to create without processing immediately',
			},
		],
	},

	// ----------------------------------
	//         massPayment: get, getItems, update
	// ----------------------------------
	{
		displayName: 'Mass Payment ID',
		name: 'massPaymentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['massPayment'],
				operation: ['get', 'getItems', 'update'],
			},
		},
		default: '',
		description: 'The ID of the mass payment',
	},

	// ----------------------------------
	//         massPayment: getAll
	// ----------------------------------
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['massPayment'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'The ID of the customer',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['massPayment'],
				operation: ['getAll', 'getItems'],
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
				resource: ['massPayment'],
				operation: ['getAll', 'getItems'],
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
				resource: ['massPayment'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Correlation ID',
				name: 'correlationId',
				type: 'string',
				default: '',
				description: 'Filter by correlation ID',
			},
		],
	},

	// ----------------------------------
	//         massPayment: update
	// ----------------------------------
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['massPayment'],
				operation: ['update'],
			},
		},
		options: [
			{
				name: 'Pending (Process Deferred)',
				value: 'pending',
				description: 'Process a deferred mass payment',
			},
			{
				name: 'Cancelled',
				value: 'cancelled',
				description: 'Cancel a pending mass payment',
			},
		],
		default: 'pending',
		description: 'The new status for the mass payment',
	},
];
