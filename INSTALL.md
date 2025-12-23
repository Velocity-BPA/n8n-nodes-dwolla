# Installation & Deployment Guide

## Step-by-Step Local Installation

### 1. Extract and Prepare

```bash
# Extract the zip file
unzip n8n-nodes-dwolla.zip
cd n8n-nodes-dwolla

# Install dependencies
npm install

# Build the project
npm run build

# Run tests to verify everything works
npm test
```

### 2. Link to Local n8n Instance

```bash
# Create a global link to this package
npm link

# Navigate to your n8n installation directory
# For npm global installation:
cd $(npm root -g)/n8n

# For local n8n installation:
cd /path/to/your/n8n

# Link the package to n8n
npm link n8n-nodes-dwolla

# Restart n8n
# If running as a service:
sudo systemctl restart n8n

# If running manually:
# Stop the current process (Ctrl+C) and restart:
n8n start
```

### 3. Alternative: Copy to Custom Nodes Directory

```bash
# Create custom nodes directory if it doesn't exist
mkdir -p ~/.n8n/custom

# Copy the built package
cp -r n8n-nodes-dwolla ~/.n8n/custom/

# Navigate to the copied package
cd ~/.n8n/custom/n8n-nodes-dwolla

# Install production dependencies
npm install --production

# Restart n8n
n8n start
```

### 4. Docker Installation

Add to your docker-compose.yml:

```yaml
services:
  n8n:
    image: n8nio/n8n
    volumes:
      - ./n8n-nodes-dwolla:/home/node/.n8n/custom/n8n-nodes-dwolla
    environment:
      - N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom
```

Or build a custom Docker image:

```dockerfile
FROM n8nio/n8n

# Copy the custom node
COPY n8n-nodes-dwolla /home/node/.n8n/custom/n8n-nodes-dwolla

# Install dependencies
WORKDIR /home/node/.n8n/custom/n8n-nodes-dwolla
RUN npm install --production

# Set custom extensions path
ENV N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom

WORKDIR /home/node
```

## Testing the Node

### 1. Verify Installation

1. Open n8n in your browser (default: http://localhost:5678)
2. Create a new workflow
3. Click the "+" button to add a node
4. Search for "Dwolla"
5. You should see both "Dwolla" and "Dwolla Trigger" nodes

### 2. Configure Credentials

1. Add a Dwolla node to your workflow
2. Click on "Create New Credential"
3. Enter your Dwolla sandbox credentials:
   - **Client ID**: Your Dwolla Application Key
   - **Client Secret**: Your Dwolla Application Secret
   - **Environment**: Select "Sandbox"
4. Click "Test Connection" to verify

### 3. Test Basic Operations

**Test 1: List Customers**
1. Set Resource: Customer
2. Set Operation: Get Many
3. Enable "Return All": No
4. Set Limit: 10
5. Execute the node

**Test 2: Get Account Info**
1. Set Resource: Customer
2. Set Operation: Get
3. Enter a valid Customer ID
4. Execute the node

### 4. Run Automated Tests

```bash
# Run full test suite
npm test

# Run with coverage report
npm run test:coverage

# Run tests in watch mode (for development)
npm run test:watch
```

## Git Commit Structure

When committing to your GitHub repository, use this format:

```bash
# Extract and navigate
unzip n8n-nodes-dwolla.zip
cd n8n-nodes-dwolla

# Initialize and push
git init
git add .
git commit -m "Initial commit: n8n Dwolla ACH payment platform community node

Features:
- Customer: Create, get, list, update, suspend, deactivate, retry verification
- Funding Source: Create (Plaid/micro-deposits), get, list, update, remove, balance
- Transfer: Create ACH transfers, get, list, cancel, get fees
- Mass Payment: Create batch payments, get, list, update status, get items
- Webhook Subscription: Create, get, list, update, delete, pause
- Event: Get, list platform events
- Document: Upload, get, list verification documents
- Beneficial Owner: Create, get, list, update, delete, certify ownership
- Trigger: Webhook trigger with HMAC-SHA256 signature verification"

git remote add origin https://github.com/Velocity-BPA/n8n-nodes-dwolla.git
git branch -M main
git push -u origin main
```

## Troubleshooting

### Node Not Appearing in n8n

1. Verify the build completed successfully:
   ```bash
   ls dist/
   # Should show: credentials/, nodes/, index.js, index.d.js, etc.
   ```

2. Check n8n logs for errors:
   ```bash
   n8n start 2>&1 | grep -i dwolla
   ```

3. Verify the package.json n8n configuration is correct:
   ```bash
   cat package.json | grep -A 10 '"n8n"'
   ```

### Credential Test Fails

1. Verify your Dwolla credentials are correct
2. Ensure you're using the correct environment (sandbox vs production)
3. Check if your Dwolla application is active

### Build Errors

1. Clear and reinstall dependencies:
   ```bash
   rm -rf node_modules dist
   npm install
   npm run build
   ```

2. Verify Node.js version:
   ```bash
   node --version
   # Should be 18.0.0 or higher
   ```

### Test Failures

1. Run tests with verbose output:
   ```bash
   npm test -- --verbose
   ```

2. Check for TypeScript compilation errors:
   ```bash
   npx tsc --noEmit
   ```

## Publishing to npm

When ready to publish:

```bash
# Ensure you're logged in to npm
npm login

# Verify package contents
npm pack --dry-run

# Publish (BUSL-1.1 license)
npm publish
```

## Version Updates

To update the version:

```bash
# Patch update (1.0.0 -> 1.0.1)
npm version patch

# Minor update (1.0.0 -> 1.1.0)
npm version minor

# Major update (1.0.0 -> 2.0.0)
npm version major

# Rebuild and test
npm run build
npm test

# Commit and push
git push && git push --tags
```
