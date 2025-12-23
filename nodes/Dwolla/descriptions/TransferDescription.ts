/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const transferOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['transfer'],
			},
		},
		options: [
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a pending transfer',
				action: 'Cancel a transfer',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new transfer',
				action: 'Create a transfer',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a transfer by ID',
				action: 'Get a transfer',
			},
			{
				name: 'Get Fees',
				value: 'getFees',
				description: 'Get fees for a transfer',
				action: 'Get transfer fees',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all transfers for a customer',
				action: 'Get many transfers',
			},
		],
		default: 'create',
	},
];

export const transferFields: INodeProperties[] = [
	// ----------------------------------
	//         transfer: create
	// ----------------------------------
	{
		displayName: 'Source Funding Source ID',
		name: 'sourceFundingSourceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['transfer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The ID of the source funding source',
	},
	{
		displayName: 'Destination Funding Source ID',
		name: 'destinationFundingSourceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['transfer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The ID of the destination funding source',
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['transfer'],
				operation: ['create'],
			},
		},
		default: '',
		placeholder: '10.00',
		description: 'The transfer amount (e.g., "10.00")',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['transfer'],
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
				displayName: 'Clearing Source',
				name: 'clearingSource',
				type: 'options',
				options: [
					{ name: 'Standard', value: 'standard' },
					{ name: 'Next Available', value: 'next-available' },
					{ name: 'Same Day', value: 'same-day' },
				],
				default: 'standard',
				description: 'Clearing speed for source',
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
				description: 'Clearing speed for destination',
			},
			{
				displayName: 'Correlation ID',
				name: 'correlationId',
				type: 'string',
				default: '',
				description: 'Unique identifier for idempotency',
			},
			{
				displayName: 'Facilitator Fee',
				name: 'facilitatorFee',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				options: [
					{
						displayName: 'Fee Details',
						name: 'feeValues',
						values: [
							{
								displayName: 'Amount',
								name: 'amount',
								type: 'string',
								default: '',
								description: 'Fee amount (e.g., "1.00")',
							},
							{
								displayName: 'Funding Source ID',
								name: 'fundingSourceId',
								type: 'string',
								default: '',
								description: 'Funding source ID to receive the fee',
							},
						],
					},
				],
				description: 'Facilitator fee for the transfer',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						displayName: 'Metadata',
						name: 'metadataValues',
						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
								description: 'Metadata key',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Metadata value',
							},
						],
					},
				],
				description: 'Custom metadata for the transfer',
			},
			{
				displayName: 'RTP Details',
				name: 'rtpDetails',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				options: [
					{
						displayName: 'RTP Details',
						name: 'rtpDetailsValues',
						values: [
							{
								displayName: 'Destination',
								name: 'destination',
								type: 'fixedCollection',
								default: {},
								typeOptions: {
									multipleValues: false,
								},
								options: [
									{
										displayName: 'Remittance Data',
										name: 'remittanceData',
										values: [
											{
												displayName: 'Value',
												name: 'value',
												type: 'string',
												default: '',
												description: 'Remittance information (max 140 chars)',
											},
										],
									},
								],
								description: 'RTP destination remittance data',
							},
						],
					},
				],
				description: 'RTP-specific details',
			},
		],
	},

	// ----------------------------------
	//         transfer: get, cancel, getFees
	// ----------------------------------
	{
		displayName: 'Transfer ID',
		name: 'transferId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['transfer'],
				operation: ['get', 'cancel', 'getFees'],
			},
		},
		default: '',
		description: 'The ID of the transfer',
	},

	// ----------------------------------
	//         transfer: getAll
	// ----------------------------------
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['transfer'],
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
				resource: ['transfer'],
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
				resource: ['transfer'],
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
				resource: ['transfer'],
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
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'Filter transfers before this date',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Filter transfers after this date',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Cancelled', value: 'cancelled' },
					{ name: 'Failed', value: 'failed' },
					{ name: 'Pending', value: 'pending' },
					{ name: 'Processed', value: 'processed' },
				],
				default: 'pending',
				description: 'Filter by transfer status',
			},
		],
	},
];
