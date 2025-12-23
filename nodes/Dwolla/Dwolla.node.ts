/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	dwollaApiRequest,
	dwollaApiRequestAllItems,
	formatAmount,
	buildResourceUrl,
	emitLicensingNotice,
} from './GenericFunctions';

import {
	customerOperations,
	customerFields,
	fundingSourceOperations,
	fundingSourceFields,
	transferOperations,
	transferFields,
	massPaymentOperations,
	massPaymentFields,
	webhookSubscriptionOperations,
	webhookSubscriptionFields,
	eventOperations,
	eventFields,
	documentOperations,
	documentFields,
	beneficialOwnerOperations,
	beneficialOwnerFields,
} from './descriptions';

export class Dwolla implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Dwolla',
		name: 'dwolla',
		icon: 'file:dwolla.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Dwolla ACH payment platform',
		defaults: {
			name: 'Dwolla',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'dwollaApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Beneficial Owner', value: 'beneficialOwner' },
					{ name: 'Customer', value: 'customer' },
					{ name: 'Document', value: 'document' },
					{ name: 'Event', value: 'event' },
					{ name: 'Funding Source', value: 'fundingSource' },
					{ name: 'Mass Payment', value: 'massPayment' },
					{ name: 'Transfer', value: 'transfer' },
					{ name: 'Webhook Subscription', value: 'webhookSubscription' },
				],
				default: 'customer',
			},
			...customerOperations,
			...customerFields,
			...fundingSourceOperations,
			...fundingSourceFields,
			...transferOperations,
			...transferFields,
			...massPaymentOperations,
			...massPaymentFields,
			...webhookSubscriptionOperations,
			...webhookSubscriptionFields,
			...eventOperations,
			...eventFields,
			...documentOperations,
			...documentFields,
			...beneficialOwnerOperations,
			...beneficialOwnerFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Emit licensing notice once per node load
		emitLicensingNotice();

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const credentials = await this.getCredentials('dwollaApi');
		const environment = credentials.environment as 'sandbox' | 'production';

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// Customer Operations
				if (resource === 'customer') {
					if (operation === 'create') {
						const body: IDataObject = {
							firstName: this.getNodeParameter('firstName', i) as string,
							lastName: this.getNodeParameter('lastName', i) as string,
							email: this.getNodeParameter('email', i) as string,
							type: this.getNodeParameter('type', i) as string,
							...this.getNodeParameter('additionalFields', i) as IDataObject,
						};
						responseData = await dwollaApiRequest.call(this, 'POST', '/customers', body);
					}
					if (operation === 'get') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						responseData = await dwollaApiRequest.call(this, 'GET', `/customers/${customerId}`);
					}
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						if (returnAll) {
							responseData = await dwollaApiRequestAllItems.call(this, 'customers', 'GET', '/customers', {}, filters);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							filters.limit = limit;
							const response = await dwollaApiRequest.call(this, 'GET', '/customers', {}, filters);
							const embedded = response._embedded as IDataObject;
							responseData = (embedded?.customers as IDataObject[]) || [];
						}
					}
					if (operation === 'update') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						responseData = await dwollaApiRequest.call(this, 'POST', `/customers/${customerId}`, updateFields);
					}
					if (operation === 'suspend') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						responseData = await dwollaApiRequest.call(this, 'POST', `/customers/${customerId}`, { status: 'suspended' });
					}
					if (operation === 'deactivate') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						responseData = await dwollaApiRequest.call(this, 'POST', `/customers/${customerId}`, { status: 'deactivated' });
					}
					if (operation === 'retryVerification') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						responseData = await dwollaApiRequest.call(this, 'POST', `/customers/${customerId}`, { status: 'retry' });
					}
				}

				// Funding Source Operations
				if (resource === 'fundingSource') {
					if (operation === 'createPlaid') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const body: IDataObject = {
							plaidToken: this.getNodeParameter('plaidToken', i) as string,
							name: this.getNodeParameter('name', i) as string,
						};
						responseData = await dwollaApiRequest.call(this, 'POST', `/customers/${customerId}/funding-sources`, body);
					}
					if (operation === 'createMicroDeposits') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const body: IDataObject = {
							routingNumber: this.getNodeParameter('routingNumber', i) as string,
							accountNumber: this.getNodeParameter('accountNumber', i) as string,
							bankAccountType: this.getNodeParameter('bankAccountType', i) as string,
							name: this.getNodeParameter('name', i) as string,
						};
						responseData = await dwollaApiRequest.call(this, 'POST', `/customers/${customerId}/funding-sources`, body);
					}
					if (operation === 'get') {
						const fundingSourceId = this.getNodeParameter('fundingSourceId', i) as string;
						responseData = await dwollaApiRequest.call(this, 'GET', `/funding-sources/${fundingSourceId}`);
					}
					if (operation === 'getAll') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						if (returnAll) {
							responseData = await dwollaApiRequestAllItems.call(this, 'funding-sources', 'GET', `/customers/${customerId}/funding-sources`, {}, filters);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							filters.limit = limit;
							const response = await dwollaApiRequest.call(this, 'GET', `/customers/${customerId}/funding-sources`, {}, filters);
							const embedded = response._embedded as IDataObject;
							responseData = (embedded?.['funding-sources'] as IDataObject[]) || [];
						}
					}
					if (operation === 'update') {
						const fundingSourceId = this.getNodeParameter('fundingSourceId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						responseData = await dwollaApiRequest.call(this, 'POST', `/funding-sources/${fundingSourceId}`, updateFields);
					}
					if (operation === 'remove') {
						const fundingSourceId = this.getNodeParameter('fundingSourceId', i) as string;
						responseData = await dwollaApiRequest.call(this, 'POST', `/funding-sources/${fundingSourceId}`, { removed: true });
					}
					if (operation === 'getBalance') {
						const fundingSourceId = this.getNodeParameter('fundingSourceId', i) as string;
						responseData = await dwollaApiRequest.call(this, 'GET', `/funding-sources/${fundingSourceId}/balance`);
					}
					if (operation === 'initiateMicroDeposits') {
						const fundingSourceId = this.getNodeParameter('fundingSourceId', i) as string;
						responseData = await dwollaApiRequest.call(this, 'POST', `/funding-sources/${fundingSourceId}/micro-deposits`);
					}
					if (operation === 'verifyMicroDeposits') {
						const fundingSourceId = this.getNodeParameter('fundingSourceId', i) as string;
						const body: IDataObject = {
							amount1: { value: this.getNodeParameter('amount1', i) as string, currency: 'USD' },
							amount2: { value: this.getNodeParameter('amount2', i) as string, currency: 'USD' },
						};
						responseData = await dwollaApiRequest.call(this, 'POST', `/funding-sources/${fundingSourceId}/micro-deposits`, body);
					}
				}

				// Transfer Operations
				if (resource === 'transfer') {
					if (operation === 'create') {
						const sourceFundingSourceId = this.getNodeParameter('sourceFundingSourceId', i) as string;
						const destinationFundingSourceId = this.getNodeParameter('destinationFundingSourceId', i) as string;
						const amount = this.getNodeParameter('amount', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							_links: {
								source: { href: buildResourceUrl(environment, 'funding-sources', sourceFundingSourceId) },
								destination: { href: buildResourceUrl(environment, 'funding-sources', destinationFundingSourceId) },
							},
							amount: { value: formatAmount(amount), currency: 'USD' },
						};

						if (additionalFields.clearingSource || additionalFields.clearingDestination) {
							body.clearing = {};
							if (additionalFields.clearingSource) {
								(body.clearing as IDataObject).source = additionalFields.clearingSource;
							}
							if (additionalFields.clearingDestination) {
								(body.clearing as IDataObject).destination = additionalFields.clearingDestination;
							}
						}

						if (additionalFields.correlationId) {
							body.correlationId = additionalFields.correlationId;
						}

						if (additionalFields.metadata) {
							const metadataValues = (additionalFields.metadata as IDataObject).metadataValues as IDataObject[];
							if (metadataValues) {
								const metadata: IDataObject = {};
								for (const item of metadataValues) {
									metadata[item.key as string] = item.value;
								}
								body.metadata = metadata;
							}
						}

						if (additionalFields.facilitatorFee) {
							const feeValues = (additionalFields.facilitatorFee as IDataObject).feeValues as IDataObject;
							if (feeValues?.amount && feeValues?.fundingSourceId) {
								body.fees = [{
									_links: {
										'charge-to': { href: buildResourceUrl(environment, 'funding-sources', feeValues.fundingSourceId as string) },
									},
									amount: { value: formatAmount(feeValues.amount as string), currency: 'USD' },
								}];
							}
						}

						responseData = await dwollaApiRequest.call(this, 'POST', '/transfers', body);
					}
					if (operation === 'get') {
						const transferId = this.getNodeParameter('transferId', i) as string;
						responseData = await dwollaApiRequest.call(this, 'GET', `/transfers/${transferId}`);
					}
					if (operation === 'getAll') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						if (returnAll) {
							responseData = await dwollaApiRequestAllItems.call(this, 'transfers', 'GET', `/customers/${customerId}/transfers`, {}, filters);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							filters.limit = limit;
							const response = await dwollaApiRequest.call(this, 'GET', `/customers/${customerId}/transfers`, {}, filters);
							const embedded = response._embedded as IDataObject;
							responseData = (embedded?.transfers as IDataObject[]) || [];
						}
					}
					if (operation === 'cancel') {
						const transferId = this.getNodeParameter('transferId', i) as string;
						responseData = await dwollaApiRequest.call(this, 'POST', `/transfers/${transferId}`, { status: 'cancelled' });
					}
					if (operation === 'getFees') {
						const transferId = this.getNodeParameter('transferId', i) as string;
						responseData = await dwollaApiRequest.call(this, 'GET', `/transfers/${transferId}/fees`);
					}
				}

				// Mass Payment Operations
				if (resource === 'massPayment') {
					if (operation === 'create') {
						const sourceFundingSourceId = this.getNodeParameter('sourceFundingSourceId', i) as string;
						const itemsInput = this.getNodeParameter('items', i) as IDataObject;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const itemValues = (itemsInput.itemValues as IDataObject[]) || [];
						const items = itemValues.map((item) => ({
							_links: {
								destination: { href: buildResourceUrl(environment, 'funding-sources', item.destinationFundingSourceId as string) },
							},
							amount: { value: formatAmount(item.amount as string), currency: 'USD' },
							metadata: item.metadata ? JSON.parse(item.metadata as string) : undefined,
						}));

						const body: IDataObject = {
							_links: {
								source: { href: buildResourceUrl(environment, 'funding-sources', sourceFundingSourceId) },
							},
							items,
						};

						if (additionalFields.correlationId) body.correlationId = additionalFields.correlationId;
						if (additionalFields.status) body.status = additionalFields.status;
						if (additionalFields.metadata) body.metadata = JSON.parse(additionalFields.metadata as string);

						if (additionalFields.clearingDestination) {
							body.clearing = { destination: additionalFields.clearingDestination };
						}

						responseData = await dwollaApiRequest.call(this, 'POST', '/mass-payments', body);
					}
					if (operation === 'get') {
						const massPaymentId = this.getNodeParameter('massPaymentId', i) as string;
						responseData = await dwollaApiRequest.call(this, 'GET', `/mass-payments/${massPaymentId}`);
					}
					if (operation === 'getAll') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						if (returnAll) {
							responseData = await dwollaApiRequestAllItems.call(this, 'mass-payments', 'GET', `/customers/${customerId}/mass-payments`, {}, filters);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							filters.limit = limit;
							const response = await dwollaApiRequest.call(this, 'GET', `/customers/${customerId}/mass-payments`, {}, filters);
							const embedded = response._embedded as IDataObject;
							responseData = (embedded?.['mass-payments'] as IDataObject[]) || [];
						}
					}
					if (operation === 'update') {
						const massPaymentId = this.getNodeParameter('massPaymentId', i) as string;
						const status = this.getNodeParameter('status', i) as string;
						responseData = await dwollaApiRequest.call(this, 'POST', `/mass-payments/${massPaymentId}`, { status });
					}
					if (operation === 'getItems') {
						const massPaymentId = this.getNodeParameter('massPaymentId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (returnAll) {
							responseData = await dwollaApiRequestAllItems.call(this, 'items', 'GET', `/mass-payments/${massPaymentId}/items`);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await dwollaApiRequest.call(this, 'GET', `/mass-payments/${massPaymentId}/items`, {}, { limit });
							const embedded = response._embedded as IDataObject;
							responseData = (embedded?.items as IDataObject[]) || [];
						}
					}
				}

				// Webhook Subscription Operations
				if (resource === 'webhookSubscription') {
					if (operation === 'create') {
						const body: IDataObject = {
							url: this.getNodeParameter('url', i) as string,
							secret: this.getNodeParameter('secret', i) as string,
						};
						responseData = await dwollaApiRequest.call(this, 'POST', '/webhook-subscriptions', body);
					}
					if (operation === 'get') {
						const webhookSubscriptionId = this.getNodeParameter('webhookSubscriptionId', i) as string;
						responseData = await dwollaApiRequest.call(this, 'GET', `/webhook-subscriptions/${webhookSubscriptionId}`);
					}
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (returnAll) {
							responseData = await dwollaApiRequestAllItems.call(this, 'webhook-subscriptions', 'GET', '/webhook-subscriptions');
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await dwollaApiRequest.call(this, 'GET', '/webhook-subscriptions', {}, { limit });
							const embedded = response._embedded as IDataObject;
							responseData = (embedded?.['webhook-subscriptions'] as IDataObject[]) || [];
						}
					}
					if (operation === 'update') {
						const webhookSubscriptionId = this.getNodeParameter('webhookSubscriptionId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						responseData = await dwollaApiRequest.call(this, 'POST', `/webhook-subscriptions/${webhookSubscriptionId}`, updateFields);
					}
					if (operation === 'delete') {
						const webhookSubscriptionId = this.getNodeParameter('webhookSubscriptionId', i) as string;
						responseData = await dwollaApiRequest.call(this, 'DELETE', `/webhook-subscriptions/${webhookSubscriptionId}`);
					}
					if (operation === 'pause') {
						const webhookSubscriptionId = this.getNodeParameter('webhookSubscriptionId', i) as string;
						responseData = await dwollaApiRequest.call(this, 'POST', `/webhook-subscriptions/${webhookSubscriptionId}`, { paused: true });
					}
				}

				// Event Operations
				if (resource === 'event') {
					if (operation === 'get') {
						const eventId = this.getNodeParameter('eventId', i) as string;
						responseData = await dwollaApiRequest.call(this, 'GET', `/events/${eventId}`);
					}
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (returnAll) {
							responseData = await dwollaApiRequestAllItems.call(this, 'events', 'GET', '/events');
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await dwollaApiRequest.call(this, 'GET', '/events', {}, { limit });
							const embedded = response._embedded as IDataObject;
							responseData = (embedded?.events as IDataObject[]) || [];
						}
					}
				}

				// Document Operations
				if (resource === 'document') {
					if (operation === 'create') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const documentType = this.getNodeParameter('documentType', i) as string;
						const binaryPropertyName = this.getNodeParameter('file', i) as string;
						const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);

						const body: IDataObject = {
							documentType,
							file: {
								value: Buffer.from(binaryData.data, 'base64'),
								options: {
									filename: binaryData.fileName || 'document',
									contentType: binaryData.mimeType,
								},
							},
						};
						responseData = await dwollaApiRequest.call(this, 'POST', `/customers/${customerId}/documents`, body);
					}
					if (operation === 'get') {
						const documentId = this.getNodeParameter('documentId', i) as string;
						responseData = await dwollaApiRequest.call(this, 'GET', `/documents/${documentId}`);
					}
					if (operation === 'getAll') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (returnAll) {
							responseData = await dwollaApiRequestAllItems.call(this, 'documents', 'GET', `/customers/${customerId}/documents`);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await dwollaApiRequest.call(this, 'GET', `/customers/${customerId}/documents`, {}, { limit });
							const embedded = response._embedded as IDataObject;
							responseData = (embedded?.documents as IDataObject[]) || [];
						}
					}
				}

				// Beneficial Owner Operations
				if (resource === 'beneficialOwner') {
					if (operation === 'create') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const addressInput = this.getNodeParameter('address', i) as IDataObject;
						const addressValues = (addressInput.addressValues as IDataObject) || {};

						const body: IDataObject = {
							firstName: this.getNodeParameter('firstName', i) as string,
							lastName: this.getNodeParameter('lastName', i) as string,
							dateOfBirth: this.getNodeParameter('dateOfBirth', i) as string,
							ssn: this.getNodeParameter('ssn', i) as string,
							address: {
								address1: addressValues.address1,
								address2: addressValues.address2,
								city: addressValues.city,
								stateProvinceRegion: addressValues.stateProvinceRegion,
								postalCode: addressValues.postalCode,
								country: addressValues.country || 'US',
							},
						};
						responseData = await dwollaApiRequest.call(this, 'POST', `/customers/${customerId}/beneficial-owners`, body);
					}
					if (operation === 'get') {
						const beneficialOwnerId = this.getNodeParameter('beneficialOwnerId', i) as string;
						responseData = await dwollaApiRequest.call(this, 'GET', `/beneficial-owners/${beneficialOwnerId}`);
					}
					if (operation === 'getAll') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (returnAll) {
							responseData = await dwollaApiRequestAllItems.call(this, 'beneficial-owners', 'GET', `/customers/${customerId}/beneficial-owners`);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await dwollaApiRequest.call(this, 'GET', `/customers/${customerId}/beneficial-owners`, {}, { limit });
							const embedded = response._embedded as IDataObject;
							responseData = (embedded?.['beneficial-owners'] as IDataObject[]) || [];
						}
					}
					if (operation === 'update') {
						const beneficialOwnerId = this.getNodeParameter('beneficialOwnerId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};
						if (updateFields.firstName) body.firstName = updateFields.firstName;
						if (updateFields.lastName) body.lastName = updateFields.lastName;
						if (updateFields.dateOfBirth) body.dateOfBirth = updateFields.dateOfBirth;
						if (updateFields.ssn) body.ssn = updateFields.ssn;

						const addressFields = ['address1', 'address2', 'city', 'stateProvinceRegion', 'postalCode', 'country'];
						const hasAddress = addressFields.some((field) => updateFields[field]);
						if (hasAddress) {
							body.address = {};
							for (const field of addressFields) {
								if (updateFields[field]) {
									(body.address as IDataObject)[field] = updateFields[field];
								}
							}
						}

						responseData = await dwollaApiRequest.call(this, 'POST', `/beneficial-owners/${beneficialOwnerId}`, body);
					}
					if (operation === 'delete') {
						const beneficialOwnerId = this.getNodeParameter('beneficialOwnerId', i) as string;
						responseData = await dwollaApiRequest.call(this, 'DELETE', `/beneficial-owners/${beneficialOwnerId}`);
					}
					if (operation === 'certify') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						responseData = await dwollaApiRequest.call(this, 'POST', `/customers/${customerId}/beneficial-ownership`, { status: 'certified' });
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
