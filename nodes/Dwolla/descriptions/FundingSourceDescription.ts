/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const fundingSourceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['fundingSource'],
			},
		},
		options: [
			{
				name: 'Create via Plaid',
				value: 'createPlaid',
				description: 'Create a funding source using Plaid processor token',
				action: 'Create funding source via Plaid',
			},
			{
				name: 'Create via Micro-Deposits',
				value: 'createMicroDeposits',
				description: 'Create a funding source with micro-deposit verification',
				action: 'Create funding source via micro-deposits',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a funding source by ID',
				action: 'Get a funding source',
			},
			{
				name: 'Get Balance',
				value: 'getBalance',
				description: 'Get the balance of a funding source',
				action: 'Get funding source balance',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all funding sources for a customer',
				action: 'Get many funding sources',
			},
			{
				name: 'Initiate Micro-Deposits',
				value: 'initiateMicroDeposits',
				description: 'Initiate micro-deposits for verification',
				action: 'Initiate micro-deposits',
			},
			{
				name: 'Remove',
				value: 'remove',
				description: 'Remove a funding source',
				action: 'Remove a funding source',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a funding source',
				action: 'Update a funding source',
			},
			{
				name: 'Verify Micro-Deposits',
				value: 'verifyMicroDeposits',
				description: 'Verify micro-deposit amounts',
				action: 'Verify micro-deposits',
			},
		],
		default: 'get',
	},
];

export const fundingSourceFields: INodeProperties[] = [
	// ----------------------------------
	//    fundingSource: createPlaid
	// ----------------------------------
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['fundingSource'],
				operation: ['createPlaid', 'createMicroDeposits', 'getAll'],
			},
		},
		default: '',
		description: 'The ID of the customer',
	},
	{
		displayName: 'Plaid Processor Token',
		name: 'plaidToken',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['fundingSource'],
				operation: ['createPlaid'],
			},
		},
		default: '',
		description: 'The processor token from Plaid',
	},
	{
		displayName: 'Account Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['fundingSource'],
				operation: ['createPlaid', 'createMicroDeposits'],
			},
		},
		default: '',
		description: 'A friendly name for the funding source',
	},

	// ----------------------------------
	//    fundingSource: createMicroDeposits
	// ----------------------------------
	{
		displayName: 'Routing Number',
		name: 'routingNumber',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['fundingSource'],
				operation: ['createMicroDeposits'],
			},
		},
		default: '',
		description: 'The bank routing number',
	},
	{
		displayName: 'Account Number',
		name: 'accountNumber',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['fundingSource'],
				operation: ['createMicroDeposits'],
			},
		},
		default: '',
		description: 'The bank account number',
	},
	{
		displayName: 'Bank Account Type',
		name: 'bankAccountType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['fundingSource'],
				operation: ['createMicroDeposits'],
			},
		},
		options: [
			{
				name: 'Checking',
				value: 'checking',
			},
			{
				name: 'Savings',
				value: 'savings',
			},
		],
		default: 'checking',
		description: 'The type of bank account',
	},

	// ----------------------------------
	//    fundingSource: get, update, remove, balance
	// ----------------------------------
	{
		displayName: 'Funding Source ID',
		name: 'fundingSourceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['fundingSource'],
				operation: ['get', 'update', 'remove', 'getBalance', 'initiateMicroDeposits', 'verifyMicroDeposits'],
			},
		},
		default: '',
		description: 'The ID of the funding source',
	},

	// ----------------------------------
	//    fundingSource: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['fundingSource'],
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
				resource: ['fundingSource'],
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
				resource: ['fundingSource'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Removed',
				name: 'removed',
				type: 'boolean',
				default: false,
				description: 'Whether to include removed funding sources',
			},
		],
	},

	// ----------------------------------
	//    fundingSource: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['fundingSource'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'A friendly name for the funding source',
			},
		],
	},

	// ----------------------------------
	//    fundingSource: verifyMicroDeposits
	// ----------------------------------
	{
		displayName: 'Amount 1',
		name: 'amount1',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['fundingSource'],
				operation: ['verifyMicroDeposits'],
			},
		},
		default: '',
		placeholder: '0.03',
		description: 'The first micro-deposit amount',
	},
	{
		displayName: 'Amount 2',
		name: 'amount2',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['fundingSource'],
				operation: ['verifyMicroDeposits'],
			},
		},
		default: '',
		placeholder: '0.09',
		description: 'The second micro-deposit amount',
	},
];
