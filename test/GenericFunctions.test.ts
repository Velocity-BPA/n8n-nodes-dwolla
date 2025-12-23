/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	getBaseUrl,
	formatAmount,
	buildResourceUrl,
	extractResourceId,
	parseWebhookEvent,
	emitLicensingNotice,
} from '../nodes/Dwolla/GenericFunctions';

describe('GenericFunctions', () => {
	describe('emitLicensingNotice', () => {
		it('should emit licensing notice without error', () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
			emitLicensingNotice();
			expect(consoleSpy).toHaveBeenCalled();
			const callArg = consoleSpy.mock.calls[0][0];
			expect(callArg).toContain('[Velocity BPA Licensing Notice]');
			expect(callArg).toContain('Business Source License 1.1');
			expect(callArg).toContain('velobpa.com/licensing');
			consoleSpy.mockRestore();
		});
	});

	describe('getBaseUrl', () => {
		it('should return sandbox URL for sandbox environment', () => {
			const url = getBaseUrl('sandbox');
			expect(url).toBe('https://api-sandbox.dwolla.com');
		});

		it('should return production URL for production environment', () => {
			const url = getBaseUrl('production');
			expect(url).toBe('https://api.dwolla.com');
		});
	});

	describe('formatAmount', () => {
		it('should format number to 2 decimal places', () => {
			expect(formatAmount(10)).toBe('10.00');
			expect(formatAmount(10.5)).toBe('10.50');
			expect(formatAmount(10.556)).toBe('10.56');
		});

		it('should format string number to 2 decimal places', () => {
			expect(formatAmount('10')).toBe('10.00');
			expect(formatAmount('10.5')).toBe('10.50');
			expect(formatAmount('10.556')).toBe('10.56');
		});
	});

	describe('buildResourceUrl', () => {
		it('should build correct sandbox URL', () => {
			const url = buildResourceUrl('sandbox', 'funding-sources', 'abc123');
			expect(url).toBe('https://api-sandbox.dwolla.com/funding-sources/abc123');
		});

		it('should build correct production URL', () => {
			const url = buildResourceUrl('production', 'customers', 'xyz789');
			expect(url).toBe('https://api.dwolla.com/customers/xyz789');
		});
	});

	describe('extractResourceId', () => {
		it('should extract ID from HAL+JSON resource', () => {
			const resource = {
				_links: {
					self: {
						href: 'https://api-sandbox.dwolla.com/customers/abc123',
					},
				},
			};
			expect(extractResourceId(resource)).toBe('abc123');
		});

		it('should return empty string if no self link', () => {
			const resource = {
				_links: {},
			};
			expect(extractResourceId(resource)).toBe('');
		});

		it('should return empty string if no links', () => {
			const resource = {};
			expect(extractResourceId(resource)).toBe('');
		});
	});

	describe('parseWebhookEvent', () => {
		it('should parse webhook event correctly', () => {
			const body = {
				id: 'event-123',
				resourceId: 'resource-456',
				topic: 'customer_created',
				timestamp: '2024-01-15T12:00:00.000Z',
				created: '2024-01-15T12:00:00.000Z',
				_links: {
					self: { href: 'https://api.dwolla.com/events/event-123' },
				},
			};

			const result = parseWebhookEvent(body);

			expect(result.id).toBe('event-123');
			expect(result.resourceId).toBe('resource-456');
			expect(result.topic).toBe('customer_created');
			expect(result.timestamp).toBe('2024-01-15T12:00:00.000Z');
		});
	});
});

describe('Webhook Signature Verification', () => {
	it('should be importable', async () => {
		const { verifyWebhookSignature } = await import('../nodes/Dwolla/GenericFunctions');
		expect(typeof verifyWebhookSignature).toBe('function');
	});
});
