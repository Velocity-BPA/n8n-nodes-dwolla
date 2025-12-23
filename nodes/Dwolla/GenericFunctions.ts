/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
	IWebhookFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

interface IDwollaCredentials {
	clientId: string;
	clientSecret: string;
	environment: 'sandbox' | 'production';
}

interface ITokenCache {
	token: string;
	expiresAt: number;
}

// Token cache per credentials (clientId)
const tokenCache: Map<string, ITokenCache> = new Map();

// Licensing notice flag - ensures notice is logged only once per node load
let licensingNoticeEmitted = false;

/**
 * Emit the Velocity BPA licensing notice (once per node load)
 */
export function emitLicensingNotice(): void {
	if (licensingNoticeEmitted) return;
	licensingNoticeEmitted = true;

	const notice = `
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`;

	console.warn(notice);
}

/**
 * Get the base URL based on environment
 */
export function getBaseUrl(environment: 'sandbox' | 'production'): string {
	return environment === 'production'
		? 'https://api.dwolla.com'
		: 'https://api-sandbox.dwolla.com';
}

/**
 * Get OAuth 2.0 access token using client credentials flow
 * Implements caching with 1-minute buffer before expiry
 */
export async function getAccessToken(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
	credentials: IDwollaCredentials,
): Promise<string> {
	const cacheKey = credentials.clientId;
	const cached = tokenCache.get(cacheKey);
	const now = Date.now();

	// Return cached token if valid (with 1-minute buffer)
	if (cached && cached.expiresAt > now + 60000) {
		return cached.token;
	}

	const baseUrl = getBaseUrl(credentials.environment);
	const options: IRequestOptions = {
		method: 'POST',
		uri: `${baseUrl}/token`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		auth: {
			user: credentials.clientId,
			pass: credentials.clientSecret,
		},
		body: 'grant_type=client_credentials',
		json: true,
	};

	try {
		const response = await this.helpers.request(options);
		const token = response.access_token as string;
		const expiresIn = (response.expires_in as number) || 3600;

		// Cache the token
		tokenCache.set(cacheKey, {
			token,
			expiresAt: now + expiresIn * 1000,
		});

		return token;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: 'Failed to obtain Dwolla access token',
		});
	}
}

/**
 * Make an authenticated request to the Dwolla API
 */
export async function dwollaApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
	uri?: string,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('dwollaApi') as unknown as IDwollaCredentials;
	const token = await getAccessToken.call(this, credentials);
	const baseUrl = getBaseUrl(credentials.environment);

	const options: IRequestOptions = {
		method,
		uri: uri || `${baseUrl}${endpoint}`,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/vnd.dwolla.v1.hal+json',
			Accept: 'application/vnd.dwolla.v1.hal+json',
		},
		qs: query,
		json: true,
	};

	// Only add body for methods that support it
	if (Object.keys(body).length > 0 && ['POST', 'PUT', 'PATCH'].includes(method)) {
		options.body = body;
	}

	try {
		const response = await this.helpers.request(options);
		return response || {};
	} catch (error) {
		const errorData = error as JsonObject;

		// Parse Dwolla error response
		if (errorData.error) {
			const dwollaError = errorData.error as IDataObject;
			const embedded = dwollaError._embedded as IDataObject;

			if (embedded?.errors) {
				const errors = embedded.errors as IDataObject[];
				const errorMessages = errors.map((e) => e.message || e.code).join(', ');
				throw new NodeApiError(this.getNode(), errorData, {
					message: errorMessages,
				});
			}

			if (dwollaError.message) {
				throw new NodeApiError(this.getNode(), errorData, {
					message: dwollaError.message as string,
				});
			}
		}

		throw new NodeApiError(this.getNode(), errorData);
	}
}

/**
 * Make an authenticated request and return all results (handles pagination)
 */
export async function dwollaApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	propertyName: string,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let response: IDataObject;
	query.limit = query.limit || 200;
	query.offset = 0;

	do {
		response = await dwollaApiRequest.call(this, method, endpoint, body, query);

		const embedded = response._embedded as IDataObject;
		if (embedded && embedded[propertyName]) {
			const items = embedded[propertyName] as IDataObject[];
			returnData.push(...items);
		}

		// Check for next page
		const links = response._links as IDataObject;
		if (links?.next) {
			query.offset = (query.offset as number) + (query.limit as number);
		} else {
			break;
		}
	} while (true);

	return returnData;
}

/**
 * Extract resource ID from HAL+JSON self link
 */
export function extractResourceId(resource: IDataObject): string {
	const links = resource._links as IDataObject;
	if (links?.self) {
		const self = links.self as IDataObject;
		const href = self.href as string;
		if (href) {
			const parts = href.split('/');
			return parts[parts.length - 1];
		}
	}
	return '';
}

/**
 * Build Dwolla resource URL
 */
export function buildResourceUrl(
	environment: 'sandbox' | 'production',
	resourceType: string,
	resourceId: string,
): string {
	const baseUrl = getBaseUrl(environment);
	return `${baseUrl}/${resourceType}/${resourceId}`;
}

/**
 * Validate amount format (string with 2 decimal places)
 */
export function formatAmount(amount: number | string): string {
	const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
	return numAmount.toFixed(2);
}

/**
 * Create HMAC-SHA256 signature for webhook verification
 */
export async function verifyWebhookSignature(
	payload: string,
	signature: string,
	secret: string,
): Promise<boolean> {
	const crypto = await import('crypto');
	const expectedSignature = crypto
		.createHmac('sha256', secret)
		.update(payload)
		.digest('hex');
	return signature === expectedSignature;
}

/**
 * Parse webhook event from Dwolla
 */
export function parseWebhookEvent(body: IDataObject): IDataObject {
	return {
		id: body.id,
		resourceId: body.resourceId,
		topic: body.topic,
		timestamp: body.timestamp,
		_links: body._links,
		created: body.created,
	};
}
