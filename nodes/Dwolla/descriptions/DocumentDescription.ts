/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const documentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['document'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Upload a document for a customer',
				action: 'Create a document',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a document by ID',
				action: 'Get a document',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all documents for a customer',
				action: 'Get many documents',
			},
		],
		default: 'get',
	},
];

export const documentFields: INodeProperties[] = [
	// ----------------------------------
	//         document: create
	// ----------------------------------
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['create', 'getAll'],
			},
		},
		default: '',
		description: 'The ID of the customer',
	},
	{
		displayName: 'Document Type',
		name: 'documentType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Passport',
				value: 'passport',
			},
			{
				name: 'License',
				value: 'license',
				description: 'State-issued driver\'s license',
			},
			{
				name: 'ID Card',
				value: 'idCard',
				description: 'State-issued ID card',
			},
			{
				name: 'Other',
				value: 'other',
				description: 'Other government-issued document',
			},
		],
		default: 'license',
		description: 'The type of document being uploaded',
	},
	{
		displayName: 'File',
		name: 'file',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The binary property name containing the file to upload',
	},

	// ----------------------------------
	//         document: get
	// ----------------------------------
	{
		displayName: 'Document ID',
		name: 'documentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The ID of the document',
	},

	// ----------------------------------
	//         document: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['document'],
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
				resource: ['document'],
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
