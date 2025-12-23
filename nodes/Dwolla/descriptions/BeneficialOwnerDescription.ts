/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const beneficialOwnerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['beneficialOwner'],
			},
		},
		options: [
			{
				name: 'Certify Ownership',
				value: 'certify',
				description: 'Certify beneficial ownership for a business customer',
				action: 'Certify beneficial ownership',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a beneficial owner',
				action: 'Create a beneficial owner',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a beneficial owner',
				action: 'Delete a beneficial owner',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a beneficial owner by ID',
				action: 'Get a beneficial owner',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all beneficial owners for a customer',
				action: 'Get many beneficial owners',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a beneficial owner',
				action: 'Update a beneficial owner',
			},
		],
		default: 'create',
	},
];

export const beneficialOwnerFields: INodeProperties[] = [
	// ----------------------------------
	//    beneficialOwner: create
	// ----------------------------------
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['beneficialOwner'],
				operation: ['create', 'getAll', 'certify'],
			},
		},
		default: '',
		description: 'The ID of the business customer',
	},
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['beneficialOwner'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The beneficial owner\'s first name',
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['beneficialOwner'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The beneficial owner\'s last name',
	},
	{
		displayName: 'Date of Birth',
		name: 'dateOfBirth',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['beneficialOwner'],
				operation: ['create'],
			},
		},
		default: '',
		placeholder: 'YYYY-MM-DD',
		description: 'The beneficial owner\'s date of birth',
	},
	{
		displayName: 'SSN',
		name: 'ssn',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['beneficialOwner'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The beneficial owner\'s full SSN',
	},
	{
		displayName: 'Address',
		name: 'address',
		type: 'fixedCollection',
		required: true,
		displayOptions: {
			show: {
				resource: ['beneficialOwner'],
				operation: ['create'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Address Details',
				name: 'addressValues',
				values: [
					{
						displayName: 'Address Line 1',
						name: 'address1',
						type: 'string',
						required: true,
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
						displayName: 'City',
						name: 'city',
						type: 'string',
						required: true,
						default: '',
						description: 'City',
					},
					{
						displayName: 'State/Province/Region',
						name: 'stateProvinceRegion',
						type: 'string',
						required: true,
						default: '',
						description: 'Two-letter state abbreviation (US) or region',
					},
					{
						displayName: 'Postal Code',
						name: 'postalCode',
						type: 'string',
						required: true,
						default: '',
						description: 'ZIP or postal code',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						required: true,
						default: 'US',
						description: 'ISO 3166-1 alpha-2 country code',
					},
				],
			},
		],
		description: 'The beneficial owner\'s address',
	},

	// ----------------------------------
	//    beneficialOwner: get, update, delete
	// ----------------------------------
	{
		displayName: 'Beneficial Owner ID',
		name: 'beneficialOwnerId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['beneficialOwner'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the beneficial owner',
	},

	// ----------------------------------
	//    beneficialOwner: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['beneficialOwner'],
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
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'ISO 3166-1 alpha-2 country code',
			},
			{
				displayName: 'Date of Birth',
				name: 'dateOfBirth',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				description: 'Date of birth',
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
				description: 'Full SSN',
			},
			{
				displayName: 'State/Province/Region',
				name: 'stateProvinceRegion',
				type: 'string',
				default: '',
				description: 'Two-letter state abbreviation (US) or region',
			},
		],
	},

	// ----------------------------------
	//    beneficialOwner: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['beneficialOwner'],
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
				resource: ['beneficialOwner'],
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
];
