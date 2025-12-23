/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { Dwolla } from '../nodes/Dwolla/Dwolla.node';
import { DwollaTrigger } from '../nodes/Dwolla/DwollaTrigger.node';
import { DwollaApi } from '../credentials/DwollaApi.credentials';

describe('Dwolla Node', () => {
	let dwolla: Dwolla;

	beforeEach(() => {
		dwolla = new Dwolla();
	});

	describe('Node Description', () => {
		it('should have correct display name', () => {
			expect(dwolla.description.displayName).toBe('Dwolla');
		});

		it('should have correct name', () => {
			expect(dwolla.description.name).toBe('dwolla');
		});

		it('should have correct version', () => {
			expect(dwolla.description.version).toBe(1);
		});

		it('should have required credentials', () => {
			expect(dwolla.description.credentials).toEqual([
				{ name: 'dwollaApi', required: true },
			]);
		});

		it('should have all expected resources', () => {
			const resourceProperty = dwolla.description.properties.find(
				(p) => p.name === 'resource'
			);
			expect(resourceProperty).toBeDefined();

			const options = resourceProperty?.options as { value: string }[];
			const resourceValues = options?.map((o) => o.value);

			expect(resourceValues).toContain('customer');
			expect(resourceValues).toContain('fundingSource');
			expect(resourceValues).toContain('transfer');
			expect(resourceValues).toContain('massPayment');
			expect(resourceValues).toContain('webhookSubscription');
			expect(resourceValues).toContain('event');
			expect(resourceValues).toContain('document');
			expect(resourceValues).toContain('beneficialOwner');
		});
	});

	describe('Customer Operations', () => {
		it('should have all customer operations', () => {
			const operationProperty = dwolla.description.properties.find(
				(p) => p.name === 'operation' && p.displayOptions?.show?.resource?.[0] === 'customer'
			);
			expect(operationProperty).toBeDefined();

			const options = operationProperty?.options as { value: string }[];
			const operationValues = options?.map((o) => o.value);

			expect(operationValues).toContain('create');
			expect(operationValues).toContain('get');
			expect(operationValues).toContain('getAll');
			expect(operationValues).toContain('update');
			expect(operationValues).toContain('suspend');
			expect(operationValues).toContain('deactivate');
			expect(operationValues).toContain('retryVerification');
		});
	});

	describe('Transfer Operations', () => {
		it('should have all transfer operations', () => {
			const operationProperty = dwolla.description.properties.find(
				(p) => p.name === 'operation' && p.displayOptions?.show?.resource?.[0] === 'transfer'
			);
			expect(operationProperty).toBeDefined();

			const options = operationProperty?.options as { value: string }[];
			const operationValues = options?.map((o) => o.value);

			expect(operationValues).toContain('create');
			expect(operationValues).toContain('get');
			expect(operationValues).toContain('getAll');
			expect(operationValues).toContain('cancel');
			expect(operationValues).toContain('getFees');
		});
	});

	describe('Mass Payment Operations', () => {
		it('should have all mass payment operations', () => {
			const operationProperty = dwolla.description.properties.find(
				(p) => p.name === 'operation' && p.displayOptions?.show?.resource?.[0] === 'massPayment'
			);
			expect(operationProperty).toBeDefined();

			const options = operationProperty?.options as { value: string }[];
			const operationValues = options?.map((o) => o.value);

			expect(operationValues).toContain('create');
			expect(operationValues).toContain('get');
			expect(operationValues).toContain('getAll');
			expect(operationValues).toContain('update');
			expect(operationValues).toContain('getItems');
		});
	});
});

describe('Dwolla Trigger Node', () => {
	let dwollaTrigger: DwollaTrigger;

	beforeEach(() => {
		dwollaTrigger = new DwollaTrigger();
	});

	describe('Node Description', () => {
		it('should have correct display name', () => {
			expect(dwollaTrigger.description.displayName).toBe('Dwolla Trigger');
		});

		it('should have correct name', () => {
			expect(dwollaTrigger.description.name).toBe('dwollaTrigger');
		});

		it('should be a trigger node', () => {
			expect(dwollaTrigger.description.group).toContain('trigger');
		});

		it('should have webhook configuration', () => {
			expect(dwollaTrigger.description.webhooks).toBeDefined();
			expect(dwollaTrigger.description.webhooks?.length).toBeGreaterThan(0);
		});

		it('should have all expected events', () => {
			const eventsProperty = dwollaTrigger.description.properties.find(
				(p) => p.name === 'events'
			);
			expect(eventsProperty).toBeDefined();

			const options = eventsProperty?.options as { value: string }[];
			const eventValues = options?.map((o) => o.value);

			// Customer events
			expect(eventValues).toContain('customer_created');
			expect(eventValues).toContain('customer_verified');
			expect(eventValues).toContain('customer_suspended');

			// Transfer events
			expect(eventValues).toContain('customer_transfer_created');
			expect(eventValues).toContain('customer_transfer_completed');
			expect(eventValues).toContain('customer_transfer_failed');

			// Bank transfer events
			expect(eventValues).toContain('customer_bank_transfer_created');
			expect(eventValues).toContain('customer_bank_transfer_completed');

			// Mass payment events
			expect(eventValues).toContain('customer_mass_payment_created');
			expect(eventValues).toContain('customer_mass_payment_completed');
		});
	});
});

describe('Dwolla API Credentials', () => {
	let credentials: DwollaApi;

	beforeEach(() => {
		credentials = new DwollaApi();
	});

	it('should have correct name', () => {
		expect(credentials.name).toBe('dwollaApi');
	});

	it('should have correct display name', () => {
		expect(credentials.displayName).toBe('Dwolla API');
	});

	it('should have required properties', () => {
		const propertyNames = credentials.properties.map((p) => p.name);

		expect(propertyNames).toContain('clientId');
		expect(propertyNames).toContain('clientSecret');
		expect(propertyNames).toContain('environment');
	});

	it('should have environment options', () => {
		const envProperty = credentials.properties.find((p) => p.name === 'environment');
		expect(envProperty).toBeDefined();

		const options = envProperty?.options as { value: string }[];
		const envValues = options?.map((o) => o.value);

		expect(envValues).toContain('sandbox');
		expect(envValues).toContain('production');
	});

	it('should have credential test defined', () => {
		expect(credentials.test).toBeDefined();
	});
});
