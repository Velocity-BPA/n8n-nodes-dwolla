# n8n-nodes-dwolla

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

[![NPM Version](https://img.shields.io/npm/v/n8n-nodes-dwolla.svg)](https://www.npmjs.com/package/n8n-nodes-dwolla)
[![License: BUSL-1.1](https://img.shields.io/badge/License-BUSL--1.1-blue.svg)](LICENSE)

n8n community node for the **Dwolla ACH payment platform**. Enables workflow automation for ACH transfers, customer management, funding sources, mass payments, and white-label payment operations.

## Author

**Velocity BPA**
- Website: [https://velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Features

### Main Node (Dwolla)

- **Customer Management**: Create, retrieve, update, suspend, deactivate, and retry verification for customers (personal, business, receive-only, unverified)
- **Funding Sources**: Add bank accounts via Plaid or micro-deposits, verify micro-deposits, retrieve balances, manage funding sources
- **Transfers**: Initiate ACH transfers with Same-Day ACH and RTP support, cancel pending transfers, retrieve transfer fees
- **Mass Payments**: Process batch payments to multiple recipients, manage deferred payments, retrieve payment items
- **Webhook Subscriptions**: Create and manage webhook endpoints for real-time event notifications
- **Events**: Retrieve and list Dwolla platform events
- **Documents**: Upload and manage verification documents for customers
- **Beneficial Owners**: Manage beneficial ownership for business customers, certify ownership

### Trigger Node (Dwolla Trigger)

Real-time webhook triggers for:
- Customer lifecycle events (created, verified, suspended, deactivated)
- Funding source events (added, verified, removed)
- Transfer events (created, completed, failed, cancelled)
- Bank transfer events (created, completed, failed)
- Mass payment events (created, completed, cancelled)
- Verification document events (needed, uploaded, approved, failed)
- Micro-deposit events (added, completed, failed)

## Prerequisites

- n8n version 1.0.0 or later
- Dwolla API credentials (sandbox or production)
- Node.js 18.0.0 or later

## Installation

### Community Node (Recommended)

1. Open your n8n instance
2. Navigate to **Settings** > **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-dwolla`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n custom extensions directory
cd ~/.n8n/custom

# Install the package
npm install n8n-nodes-dwolla

# Restart n8n
```

### Docker Installation

Add to your n8n Dockerfile:

```dockerfile
RUN cd /usr/local/lib/node_modules/n8n && npm install n8n-nodes-dwolla
```

Or mount a custom directory:

```yaml
volumes:
  - ./custom-nodes:/home/node/.n8n/custom
```

## Configuration

### Credentials Setup

1. In n8n, go to **Credentials** > **New Credential**
2. Search for "Dwolla API"
3. Enter your credentials:
   - **Client ID**: Your Dwolla Application Key
   - **Client Secret**: Your Dwolla Application Secret
   - **Environment**: Select `sandbox` for testing or `production` for live transactions

### Getting Dwolla API Credentials

1. Sign up at [Dwolla Dashboard](https://dashboard.dwolla.com)
2. Create an application in the sandbox environment
3. Copy the Application Key and Secret
4. For production, complete Dwolla's approval process

## Usage Examples

### Create a Customer

```json
{
  "resource": "customer",
  "operation": "create",
  "type": "personal",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "additionalFields": {
    "address1": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "postalCode": "94105",
    "dateOfBirth": "1990-01-15",
    "ssn": "1234"
  }
}
```

### Create a Transfer

```json
{
  "resource": "transfer",
  "operation": "create",
  "sourceFundingSourceId": "source-funding-id",
  "destinationFundingSourceId": "dest-funding-id",
  "amount": "100.00",
  "additionalFields": {
    "clearingSource": "same-day",
    "clearingDestination": "standard"
  }
}
```

### Create a Mass Payment

```json
{
  "resource": "massPayment",
  "operation": "create",
  "sourceFundingSourceId": "source-funding-id",
  "items": {
    "itemValues": [
      {
        "destinationFundingSourceId": "dest-1",
        "amount": "50.00"
      },
      {
        "destinationFundingSourceId": "dest-2",
        "amount": "75.00"
      }
    ]
  }
}
```

### Webhook Trigger Configuration

1. Add the **Dwolla Trigger** node to your workflow
2. Configure the webhook secret (must match your Dwolla webhook subscription)
3. Select the events you want to listen for
4. Activate the workflow

## API Reference

### Resources

| Resource | Operations |
|----------|------------|
| Customer | Create, Get, Get Many, Update, Suspend, Deactivate, Retry Verification |
| Funding Source | Create (Plaid/Micro-deposits), Get, Get Many, Update, Remove, Get Balance, Initiate/Verify Micro-deposits |
| Transfer | Create, Get, Get Many, Cancel, Get Fees |
| Mass Payment | Create, Get, Get Many, Update, Get Items |
| Webhook Subscription | Create, Get, Get Many, Update, Delete, Pause |
| Event | Get, Get Many |
| Document | Create, Get, Get Many |
| Beneficial Owner | Create, Get, Get Many, Update, Delete, Certify |

### Customer Types

| Type | Description |
|------|-------------|
| receive-only | Can only receive funds |
| unverified | Basic customer with limited functionality |
| personal | Verified individual customer |
| business | Verified business customer |

### Clearing Options

| Option | Description |
|--------|-------------|
| standard | Standard ACH processing (1-3 business days) |
| next-available | Next available processing window |
| same-day | Same-day ACH processing |

## Error Handling

The node includes comprehensive error handling for Dwolla API responses:

- HAL+JSON error parsing from `_embedded.errors`
- OAuth token refresh with 1-minute buffer
- Automatic retry on token expiration
- Detailed error messages for debugging

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-dwolla.git
cd n8n-nodes-dwolla

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Linting

```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lintfix
```

## Licensing

[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for full terms.

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-dwolla/issues)
- **Documentation**: [Dwolla API Docs](https://developers.dwolla.com/)
- **Commercial Support**: licensing@velobpa.com

## Changelog

### 1.0.0

- Initial release
- Full Dwolla API v1 support
- OAuth 2.0 client credentials authentication
- Customer management operations
- Funding source management with Plaid and micro-deposit support
- ACH transfer operations with Same-Day ACH support
- Mass payment batch processing
- Webhook trigger with HMAC-SHA256 verification
- Document upload for customer verification
- Beneficial owner management for business customers
- Comprehensive test suite

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to the GitHub repository.

## Disclaimer

This is an unofficial community node and is not affiliated with, endorsed by, or supported by Dwolla, Inc. Dwolla is a registered trademark of Dwolla, Inc.
