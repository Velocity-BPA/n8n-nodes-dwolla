# n8n-nodes-dwolla

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides seamless integration with Dwolla's payment platform, enabling automated bank transfers, customer management, and payment processing workflows. With support for 6 core resources, it offers comprehensive capabilities for ACH transfers, mass payments, customer onboarding, funding source management, webhook handling, and account operations.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Dwolla API](https://img.shields.io/badge/Dwolla-API%20v2-orange)
![ACH Payments](https://img.shields.io/badge/ACH-Payments-green)
![Bank Transfers](https://img.shields.io/badge/Bank-Transfers-purple)

## Features

- **Customer Management** - Create, update, retrieve, and manage customer profiles with full KYC support
- **Funding Source Operations** - Add, verify, and manage bank accounts and funding sources for customers
- **Transfer Processing** - Initiate, track, and manage ACH transfers between accounts with real-time status updates
- **Mass Payment Capabilities** - Execute bulk payment operations with batch processing and status tracking
- **Webhook Integration** - Receive and process real-time event notifications from Dwolla's platform
- **Account Management** - Access account information, balance details, and account configuration settings
- **Comprehensive Error Handling** - Built-in retry logic and detailed error messages for troubleshooting
- **Production Ready** - Full support for both sandbox and production Dwolla environments

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-dwolla`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-dwolla
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-dwolla.git
cd n8n-nodes-dwolla
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-dwolla
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Dwolla API key for authentication | Yes |
| API Secret | Your Dwolla API secret for authentication | Yes |
| Environment | Select between 'sandbox' and 'production' | Yes |
| Base URL | Dwolla API base URL (auto-configured based on environment) | No |

## Resources & Operations

### 1. Customer

| Operation | Description |
|-----------|-------------|
| Create | Create a new customer with personal or business information |
| Get | Retrieve customer details by customer ID |
| Update | Update existing customer information |
| List | List all customers with optional filtering |
| Suspend | Suspend a customer account |
| Reactivate | Reactivate a suspended customer account |
| Upload Document | Upload verification documents for customer |

### 2. Funding Source

| Operation | Description |
|-----------|-------------|
| Create | Add a new bank account or funding source to a customer |
| Get | Retrieve funding source details by ID |
| Update | Update funding source information |
| List | List all funding sources for a customer |
| Remove | Remove a funding source from a customer |
| Initiate Micro Deposits | Start micro-deposit verification process |
| Verify Micro Deposits | Complete micro-deposit verification |

### 3. Transfer

| Operation | Description |
|-----------|-------------|
| Create | Initiate a new ACH transfer between funding sources |
| Get | Retrieve transfer details and status by transfer ID |
| List | List transfers with filtering by date, status, or customer |
| Cancel | Cancel a pending transfer |
| Get Fees | Calculate fees for a potential transfer |
| Retry | Retry a failed transfer |

### 4. Mass Payment

| Operation | Description |
|-----------|-------------|
| Create | Create a new mass payment job with multiple recipients |
| Get | Retrieve mass payment details and status |
| List | List all mass payments with optional filtering |
| Get Items | Retrieve individual payment items within a mass payment |
| Update | Update mass payment information |
| Cancel | Cancel a pending mass payment |

### 5. Webhook

| Operation | Description |
|-----------|-------------|
| Create Subscription | Create a new webhook subscription for events |
| Get Subscription | Retrieve webhook subscription details |
| List Subscriptions | List all webhook subscriptions |
| Update Subscription | Update webhook subscription settings |
| Delete Subscription | Remove a webhook subscription |
| Pause Subscription | Temporarily pause webhook delivery |
| List Webhooks | List received webhook events |

### 6. Account

| Operation | Description |
|-----------|-------------|
| Get | Retrieve account information and details |
| Update | Update account settings and configuration |
| List Funding Sources | List funding sources associated with the account |
| Get Balance | Retrieve current account balance |
| List Transfers | List transfers associated with the account |
| Get Fees | Retrieve fee schedule for the account |

## Usage Examples

```javascript
// Create a new customer
const customerData = {
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@example.com",
  "type": "personal",
  "address1": "123 Main St",
  "city": "Des Moines",
  "state": "IA",
  "postalCode": "50309",
  "dateOfBirth": "1990-01-01",
  "ssn": "123-45-6789"
};
```

```javascript
// Add a funding source (bank account)
const fundingSourceData = {
  "customerId": "customer-123",
  "routingNumber": "222222226",
  "accountNumber": "123456789",
  "bankAccountType": "checking",
  "name": "John Doe - Checking"
};
```

```javascript
// Initiate an ACH transfer
const transferData = {
  "_links": {
    "source": {
      "href": "https://api.dwolla.com/funding-sources/source-id"
    },
    "destination": {
      "href": "https://api.dwolla.com/funding-sources/dest-id"
    }
  },
  "amount": {
    "currency": "USD",
    "value": "100.00"
  },
  "metadata": {
    "orderId": "12345",
    "description": "Payment for services"
  }
};
```

```javascript
// Create a mass payment
const massPaymentData = {
  "items": [
    {
      "amount": {"currency": "USD", "value": "50.00"},
      "_links": {"destination": {"href": "https://api.dwolla.com/funding-sources/dest1"}},
      "metadata": {"recipientName": "Alice Smith"}
    },
    {
      "amount": {"currency": "USD", "value": "75.00"},
      "_links": {"destination": {"href": "https://api.dwolla.com/funding-sources/dest2"}},
      "metadata": {"recipientName": "Bob Johnson"}
    }
  ],
  "_links": {"source": {"href": "https://api.dwolla.com/funding-sources/source-id"}},
  "metadata": {"batchId": "batch-001", "description": "Weekly payroll"}
};
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API credentials | Authentication failed with provided API key/secret | Verify credentials in node configuration and check environment |
| Insufficient funds | Transfer amount exceeds available balance | Check funding source balance before initiating transfer |
| Invalid routing number | Bank routing number format is incorrect | Validate routing number format and bank information |
| Customer validation failed | Required customer information missing or invalid | Review customer data requirements and provide complete information |
| Transfer limit exceeded | Transfer amount exceeds daily/monthly limits | Check account limits and split large transfers if needed |
| Webhook verification failed | Webhook signature validation failed | Verify webhook secret and signature validation logic |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-dwolla/issues)
- **Dwolla API Documentation**: [Dwolla API Docs](https://docs.dwolla.com/)
- **Dwolla Developer Community**: [Dwolla Community](https://discuss.dwolla.com/)