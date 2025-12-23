/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const webhookSubscriptionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['webhookSubscription'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new webhook subscription',
				action: 'Create a webhook subscription',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a webhook subscription',
				action: 'Delete a webhook subscription',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a webhook subscription by ID',
				action: 'Get a webhook subscription',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all webhook subscriptions',
				action: 'Get many webhook subscriptions',
			},
			{
				name: 'Pause',
				value: 'pause',
				description: 'Pause a webhook subscription',
				action: 'Pause a webhook subscription',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a webhook subscription',
				action: 'Update a webhook subscription',
			},
		],
		default: 'create',
	},
];

export const webhookSubscriptionFields: INodeProperties[] = [
	// ----------------------------------
	//    webhookSubscription: create
	// ----------------------------------
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhookSubscription'],
				operation: ['create'],
			},
		},
		default: '',
		placeholder: 'https://example.com/webhooks/dwolla',
		description: 'The URL to receive webhook notifications',
	},
	{
		displayName: 'Secret',
		name: 'secret',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['webhookSubscription'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'A secret key used to sign webhook payloads for verification',
	},

	// ----------------------------------
	//    webhookSubscription: get, delete, pause, update
	// ----------------------------------
	{
		displayName: 'Webhook Subscription ID',
		name: 'webhookSubscriptionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhookSubscription'],
				operation: ['get', 'delete', 'pause', 'update'],
			},
		},
		default: '',
		description: 'The ID of the webhook subscription',
	},

	// ----------------------------------
	//    webhookSubscription: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['webhookSubscription'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Paused',
				name: 'paused',
				type: 'boolean',
				default: false,
				description: 'Whether the webhook subscription is paused',
			},
		],
	},

	// ----------------------------------
	//    webhookSubscription: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['webhookSubscription'],
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
				resource: ['webhookSubscription'],
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
