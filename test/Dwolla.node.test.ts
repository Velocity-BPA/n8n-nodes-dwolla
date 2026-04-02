/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Dwolla } from '../nodes/Dwolla/Dwolla.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Dwolla Node', () => {
  let node: Dwolla;

  beforeAll(() => {
    node = new Dwolla();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Dwolla');
      expect(node.description.name).toBe('dwolla');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Customer Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        accessToken: 'test-token', 
        baseUrl: 'https://api-sandbox.dwolla.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn().mockResolvedValue({ id: 'customer-123', status: 'verified' })
      },
    };
  });

  it('should create a customer successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createCustomer')
      .mockReturnValueOnce('John')
      .mockReturnValueOnce('Doe')
      .mockReturnValueOnce('john@example.com')
      .mockReturnValueOnce('personal')
      .mockReturnValueOnce({});

    const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://api-sandbox.dwolla.com/customers',
        body: expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          type: 'personal'
        })
      })
    );
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ id: 'customer-123', status: 'verified' });
  });

  it('should get a customer successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCustomer')
      .mockReturnValueOnce('customer-123');

    const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://api-sandbox.dwolla.com/customers/customer-123'
      })
    );
    expect(result).toHaveLength(1);
  });

  it('should list customers successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listCustomers')
      .mockReturnValueOnce(25)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce('');

    const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://api-sandbox.dwolla.com/customers?limit=25&offset=0'
      })
    );
    expect(result).toHaveLength(1);
  });

  it('should handle errors when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getCustomer');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getCustomer');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(
      executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });
});

describe('FundingSource Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://api-sandbox.dwolla.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  describe('createFundingSource operation', () => {
    it('should create funding source successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createFundingSource')
        .mockReturnValueOnce('customer-123')
        .mockReturnValueOnce('123456789')
        .mockReturnValueOnce('9876543210')
        .mockReturnValueOnce('checking')
        .mockReturnValueOnce('My Checking Account')
        .mockReturnValueOnce('');

      const mockResponse = { id: 'funding-source-123', status: 'verified' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFundingSourceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle create funding source error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('createFundingSource');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeFundingSourceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getFundingSource operation', () => {
    it('should get funding source successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getFundingSource')
        .mockReturnValueOnce('funding-source-123');

      const mockResponse = { id: 'funding-source-123', status: 'verified' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFundingSourceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('verifyMicroDeposits operation', () => {
    it('should verify micro deposits successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('verifyMicroDeposits')
        .mockReturnValueOnce('funding-source-123')
        .mockReturnValueOnce('0.03')
        .mockReturnValueOnce('0.09')
        .mockReturnValueOnce('');

      const mockResponse = { status: 'verified' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFundingSourceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Transfer Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://api.dwolla.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  describe('createTransfer', () => {
    it('should create a transfer successfully', async () => {
      const mockResponse = {
        _links: { self: { href: 'https://api.dwolla.com/transfers/test-id' } },
        id: 'test-id',
        status: 'pending',
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createTransfer')
        .mockReturnValueOnce('https://api.dwolla.com/funding-sources/source-id')
        .mockReturnValueOnce('https://api.dwolla.com/funding-sources/dest-id')
        .mockReturnValueOnce('100.00')
        .mockReturnValueOnce('USD')
        .mockReturnValueOnce([])
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransferOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.dwolla.com/transfers',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/vnd.dwolla.v1.hal+json',
          'Accept': 'application/vnd.dwolla.v1.hal+json',
        },
        body: {
          _links: {
            source: { href: 'https://api.dwolla.com/funding-sources/source-id' },
            destination: { href: 'https://api.dwolla.com/funding-sources/dest-id' },
          },
          amount: {
            value: '100.00',
            currency: 'USD',
          },
        },
        json: true,
      });
    });

    it('should handle create transfer error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createTransfer')
        .mockReturnValueOnce('source')
        .mockReturnValueOnce('dest')
        .mockReturnValueOnce('100.00')
        .mockReturnValueOnce('USD')
        .mockReturnValueOnce([])
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTransferOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getTransfer', () => {
    it('should get a transfer successfully', async () => {
      const mockResponse = {
        id: 'test-id',
        status: 'processed',
        amount: { value: '100.00', currency: 'USD' },
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTransfer')
        .mockReturnValueOnce('test-id');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransferOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.dwolla.com/transfers/test-id',
        headers: {
          'Authorization': 'Bearer test-token',
          'Accept': 'application/vnd.dwolla.v1.hal+json',
        },
        json: true,
      });
    });
  });

  describe('listTransfers', () => {
    it('should list transfers successfully', async () => {
      const mockResponse = {
        _embedded: { transfers: [] },
        total: 0,
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listTransfers')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('pending')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(25);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransferOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.dwolla.com/transfers?status=pending&limit=25',
        headers: {
          'Authorization': 'Bearer test-token',
          'Accept': 'application/vnd.dwolla.v1.hal+json',
        },
        json: true,
      });
    });
  });

  describe('cancelTransfer', () => {
    it('should cancel a transfer successfully', async () => {
      const mockResponse = {
        _links: { self: { href: 'https://api.dwolla.com/transfers/test-id' } },
        status: 'cancelled',
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('cancelTransfer')
        .mockReturnValueOnce('test-id');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransferOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.dwolla.com/transfers/test-id/cancel',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/vnd.dwolla.v1.hal+json',
          'Accept': 'application/vnd.dwolla.v1.hal+json',
        },
        json: true,
      });
    });
  });

  describe('getTransferFailure', () => {
    it('should get transfer failure details successfully', async () => {
      const mockResponse = {
        code: 'R01',
        description: 'Insufficient Funds',
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTransferFailure')
        .mockReturnValueOnce('test-id');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransferOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.dwolla.com/transfers/test-id/failure',
        headers: {
          'Authorization': 'Bearer test-token',
          'Accept': 'application/vnd.dwolla.v1.hal+json',
        },
        json: true,
      });
    });
  });
});

describe('Mass Payment Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://api-sandbox.dwolla.com'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn()
			},
		};
	});

	describe('createMassPayment operation', () => {
		it('should create mass payment successfully', async () => {
			const mockResponse = {
				id: 'mp-12345',
				status: 'pending',
				total: { currency: 'USD', value: '500.00' }
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createMassPayment')
				.mockReturnValueOnce('{"funding-source": {"href": "https://api.dwolla.com/funding-sources/12345"}}')
				.mockReturnValueOnce('[{"_links": {"destination": {"href": "https://api.dwolla.com/customers/12345"}}, "amount": {"currency": "USD", "value": "100.00"}}]')
				.mockReturnValueOnce('{"note": "Test mass payment"}');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeMassPaymentOperations.call(mockExecuteFunctions, items);

			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api-sandbox.dwolla.com/mass-payments',
				headers: expect.objectContaining({
					'Authorization': 'Bearer test-token'
				}),
				body: expect.objectContaining({
					_links: { 'funding-source': { href: 'https://api.dwolla.com/funding-sources/12345' } }
				}),
				json: true
			});
		});

		it('should handle create mass payment error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createMassPayment')
				.mockReturnValueOnce('{}')
				.mockReturnValueOnce('[]')
				.mockReturnValueOnce('{}');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const items = [{ json: {} }];
			const result = await executeMassPaymentOperations.call(mockExecuteFunctions, items);

			expect(result[0].json.error).toEqual('API Error');
		});
	});

	describe('getMassPayment operation', () => {
		it('should get mass payment successfully', async () => {
			const mockResponse = {
				id: 'mp-12345',
				status: 'complete',
				total: { currency: 'USD', value: '500.00' }
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getMassPayment')
				.mockReturnValueOnce('mp-12345');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeMassPaymentOperations.call(mockExecuteFunctions, items);

			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api-sandbox.dwolla.com/mass-payments/mp-12345',
				headers: expect.objectContaining({
					'Authorization': 'Bearer test-token'
				}),
				json: true
			});
		});
	});

	describe('listMassPayments operation', () => {
		it('should list mass payments successfully', async () => {
			const mockResponse = {
				_embedded: {
					'mass-payments': [
						{ id: 'mp-1', status: 'complete' },
						{ id: 'mp-2', status: 'pending' }
					]
				}
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listMassPayments')
				.mockReturnValueOnce('test-correlation')
				.mockReturnValueOnce('pending');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeMassPaymentOperations.call(mockExecuteFunctions, items);

			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api-sandbox.dwolla.com/mass-payments?correlationId=test-correlation&status=pending',
				headers: expect.objectContaining({
					'Authorization': 'Bearer test-token'
				}),
				json: true
			});
		});
	});

	describe('getMassPaymentItems operation', () => {
		it('should get mass payment items successfully', async () => {
			const mockResponse = {
				_embedded: {
					items: [
						{ id: 'item-1', status: 'processed' },
						{ id: 'item-2', status: 'failed' }
					]
				}
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getMassPaymentItems')
				.mockReturnValueOnce('mp-12345')
				.mockReturnValueOnce(25)
				.mockReturnValueOnce(0);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeMassPaymentOperations.call(mockExecuteFunctions, items);

			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api-sandbox.dwolla.com/mass-payments/mp-12345/items?limit=25&offset=0',
				headers: expect.objectContaining({
					'Authorization': 'Bearer test-token'
				}),
				json: true
			});
		});
	});
});

describe('Webhook Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({ 
				accessToken: 'test-token', 
				baseUrl: 'https://api-sandbox.dwolla.com' 
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
		};
	});

	describe('createWebhookSubscription', () => {
		it('should create webhook subscription successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createWebhookSubscription')
				.mockReturnValueOnce('https://example.com/webhook')
				.mockReturnValueOnce('secret123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'subscription-123',
				url: 'https://example.com/webhook',
				created: '2023-01-01T00:00:00Z'
			});

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe('subscription-123');
		});

		it('should handle createWebhookSubscription error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createWebhookSubscription')
				.mockReturnValueOnce('https://example.com/webhook')
				.mockReturnValueOnce('secret123');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('getWebhookSubscription', () => {
		it('should get webhook subscription successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getWebhookSubscription')
				.mockReturnValueOnce('subscription-123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'subscription-123',
				url: 'https://example.com/webhook'
			});

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe('subscription-123');
		});

		it('should handle getWebhookSubscription error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getWebhookSubscription')
				.mockReturnValueOnce('subscription-123');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('Not found');
		});
	});

	describe('listWebhookSubscriptions', () => {
		it('should list webhook subscriptions successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('listWebhookSubscriptions');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				_embedded: {
					'webhook-subscriptions': [
						{ id: 'subscription-1', url: 'https://example1.com/webhook' },
						{ id: 'subscription-2', url: 'https://example2.com/webhook' }
					]
				}
			});

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json._embedded['webhook-subscriptions']).toHaveLength(2);
		});

		it('should handle listWebhookSubscriptions error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('listWebhookSubscriptions');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('deleteWebhookSubscription', () => {
		it('should delete webhook subscription successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteWebhookSubscription')
				.mockReturnValueOnce('subscription-123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({});

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual({});
		});

		it('should handle deleteWebhookSubscription error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteWebhookSubscription')
				.mockReturnValueOnce('subscription-123');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('Not found');
		});
	});

	describe('listEvents', () => {
		it('should list events successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listEvents')
				.mockReturnValueOnce(10)
				.mockReturnValueOnce(0);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				_embedded: {
					events: [
						{ id: 'event-1', topic: 'customer_created' },
						{ id: 'event-2', topic: 'transfer_completed' }
					]
				}
			});

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json._embedded.events).toHaveLength(2);
		});

		it('should handle listEvents error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listEvents')
				.mockReturnValueOnce(10)
				.mockReturnValueOnce(0);

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('getEvent', () => {
		it('should get event successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getEvent')
				.mockReturnValueOnce('event-123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'event-123',
				topic: 'customer_created',
				created: '2023-01-01T00:00:00Z'
			});

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe('event-123');
		});

		it('should handle getEvent error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getEvent')
				.mockReturnValueOnce('event-123');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('Not found');
		});
	});
});

describe('Account Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://api-sandbox.dwolla.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      }
    };
  });

  test('should get account details successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAccount';
      if (param === 'accountId') return 'account-123';
    });

    const mockResponse = {
      id: 'account-123',
      name: 'Test Account',
      type: 'personal',
      status: 'verified'
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api-sandbox.dwolla.com/accounts/account-123',
      headers: {
        'Authorization': 'Bearer test-token',
        'Accept': 'application/vnd.dwolla.v1.hal+json',
        'Content-Type': 'application/vnd.dwolla.v1.hal+json'
      },
      json: true
    });
  });

  test('should get account funding sources successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAccountFundingSources';
      if (param === 'accountId') return 'account-123';
    });

    const mockResponse = {
      _embedded: {
        'funding-sources': [
          { id: 'fs-1', name: 'Bank Account', type: 'bank' }
        ]
      }
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result[0].json).toEqual(mockResponse);
  });

  test('should get account transfers with date filters successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAccountTransfers';
      if (param === 'accountId') return 'account-123';
      if (param === 'startDate') return '2023-01-01T00:00:00Z';
      if (param === 'endDate') return '2023-12-31T23:59:59Z';
    });

    const mockResponse = {
      _embedded: {
        transfers: [
          { id: 'transfer-1', amount: { value: '100.00', currency: 'USD' } }
        ]
      }
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api-sandbox.dwolla.com/accounts/account-123/transfers?startDate=2023-01-01T00%3A00%3A00Z&endDate=2023-12-31T23%3A59%3A59Z',
      headers: {
        'Authorization': 'Bearer test-token',
        'Accept': 'application/vnd.dwolla.v1.hal+json',
        'Content-Type': 'application/vnd.dwolla.v1.hal+json'
      },
      json: true
    });
  });

  test('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAccount';
      if (param === 'accountId') return 'invalid-id';
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Account not found'));

    await expect(
      executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Account not found');
  });

  test('should continue on fail when configured', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAccount';
      if (param === 'accountId') return 'invalid-id';
    });

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Account not found'));

    const result = await executeAccountOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result[0].json.error).toBe('Account not found');
  });
});
});
