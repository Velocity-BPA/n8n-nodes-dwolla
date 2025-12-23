/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';

import {
	dwollaApiRequest,
	verifyWebhookSignature,
	parseWebhookEvent,
	emitLicensingNotice,
} from './GenericFunctions';

export class DwollaTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Dwolla Trigger',
		name: 'dwollaTrigger',
		icon: 'file:dwolla.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Starts the workflow when Dwolla events occur',
		defaults: {
			name: 'Dwolla Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'dwollaApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Webhook Secret',
				name: 'webhookSecret',
				type: 'string',
				typeOptions: {
					password: true,
				},
				required: true,
				default: '',
				description: 'The secret key used to verify webhook signatures. Must match the secret used when creating the webhook subscription.',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				description: 'The events to listen for',
				options: [
					// Customer Events
					{
						name: 'Customer Bank Transfer Completed',
						value: 'customer_bank_transfer_completed',
					},
					{
						name: 'Customer Bank Transfer Created',
						value: 'customer_bank_transfer_created',
					},
					{
						name: 'Customer Bank Transfer Failed',
						value: 'customer_bank_transfer_failed',
					},
					{
						name: 'Customer Created',
						value: 'customer_created',
					},
					{
						name: 'Customer Deactivated',
						value: 'customer_deactivated',
					},
					{
						name: 'Customer Funding Source Added',
						value: 'customer_funding_source_added',
					},
					{
						name: 'Customer Funding Source Negative',
						value: 'customer_funding_source_negative',
					},
					{
						name: 'Customer Funding Source Removed',
						value: 'customer_funding_source_removed',
					},
					{
						name: 'Customer Funding Source Verified',
						value: 'customer_funding_source_verified',
					},
					{
						name: 'Customer Mass Payment Cancelled',
						value: 'customer_mass_payment_cancelled',
					},
					{
						name: 'Customer Mass Payment Completed',
						value: 'customer_mass_payment_completed',
					},
					{
						name: 'Customer Mass Payment Created',
						value: 'customer_mass_payment_created',
					},
					{
						name: 'Customer Microdeposits Added',
						value: 'customer_microdeposits_added',
					},
					{
						name: 'Customer Microdeposits Completed',
						value: 'customer_microdeposits_completed',
					},
					{
						name: 'Customer Microdeposits Failed',
						value: 'customer_microdeposits_failed',
					},
					{
						name: 'Customer Reversal Created',
						value: 'customer_reversal_created',
					},
					{
						name: 'Customer Suspended',
						value: 'customer_suspended',
					},
					{
						name: 'Customer Transfer Cancelled',
						value: 'customer_transfer_cancelled',
					},
					{
						name: 'Customer Transfer Completed',
						value: 'customer_transfer_completed',
					},
					{
						name: 'Customer Transfer Created',
						value: 'customer_transfer_created',
					},
					{
						name: 'Customer Transfer Failed',
						value: 'customer_transfer_failed',
					},
					{
						name: 'Customer Verification Document Approved',
						value: 'customer_verification_document_approved',
					},
					{
						name: 'Customer Verification Document Failed',
						value: 'customer_verification_document_failed',
					},
					{
						name: 'Customer Verification Document Needed',
						value: 'customer_verification_document_needed',
					},
					{
						name: 'Customer Verification Document Uploaded',
						value: 'customer_verification_document_uploaded',
					},
					{
						name: 'Customer Verified',
						value: 'customer_verified',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');

				try {
					const response = await dwollaApiRequest.call(this, 'GET', '/webhook-subscriptions');
					const embedded = response._embedded as IDataObject;
					const subscriptions = (embedded?.['webhook-subscriptions'] as IDataObject[]) || [];

					for (const subscription of subscriptions) {
						if (subscription.url === webhookUrl) {
							const webhookData = this.getWorkflowStaticData('node');
							webhookData.webhookId = subscription.id;
							return true;
						}
					}
				} catch {
					return false;
				}

				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookSecret = this.getNodeParameter('webhookSecret') as string;

				const body: IDataObject = {
					url: webhookUrl,
					secret: webhookSecret,
				};

				try {
					const response = await dwollaApiRequest.call(this, 'POST', '/webhook-subscriptions', body);

					// Extract webhook ID from response or Location header
					const links = response._links as IDataObject;
					if (links?.self) {
						const self = links.self as IDataObject;
						const href = self.href as string;
						const parts = href.split('/');
						const webhookId = parts[parts.length - 1];

						const webhookData = this.getWorkflowStaticData('node');
						webhookData.webhookId = webhookId;
					}

					return true;
				} catch {
					return false;
				}
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookId = webhookData.webhookId as string;

				if (!webhookId) {
					return true;
				}

				try {
					await dwollaApiRequest.call(this, 'DELETE', `/webhook-subscriptions/${webhookId}`);
				} catch {
					return false;
				}

				delete webhookData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		// Emit licensing notice once per node load
		emitLicensingNotice();

		const req = this.getRequestObject();
		const body = this.getBodyData() as IDataObject;
		const events = this.getNodeParameter('events') as string[];
		const webhookSecret = this.getNodeParameter('webhookSecret') as string;

		// Verify webhook signature
		const signature = req.headers['x-request-signature-sha-256'] as string;
		if (signature && webhookSecret) {
			const rawBody = JSON.stringify(body);
			const isValid = await verifyWebhookSignature(rawBody, signature, webhookSecret);

			if (!isValid) {
				return {
					webhookResponse: {
						status: 401,
						body: { error: 'Invalid signature' },
					},
				};
			}
		}

		// Check if this event is one we're listening for
		const topic = body.topic as string;
		if (!events.includes(topic) && !events.includes('*')) {
			return {
				webhookResponse: {
					status: 200,
					body: { received: true, ignored: true },
				},
			};
		}

		// Parse and return the event data
		const eventData = parseWebhookEvent(body);

		return {
			workflowData: [
				this.helpers.returnJsonArray({
					...eventData,
					rawBody: body,
				}),
			],
		};
	}
}
