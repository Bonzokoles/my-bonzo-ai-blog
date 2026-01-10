#!/bin/bash
# Script to add DASHBOARD_PASSWORD secret to jimbo-like-pumo-api worker
# Run this locally with: ./add-dashboard-password.sh

set -e

echo "🔐 Adding DASHBOARD_PASSWORD to jimbo-like-pumo-api worker..."
echo ""
echo "This will set the password to: #HAOS77#"
echo ""

# Navigate to worker directory
cd "$(dirname "$0")"

# Add the secret using wrangler
echo '#HAOS77#' | npx wrangler secret put DASHBOARD_PASSWORD

echo ""
echo "✅ Password added successfully!"
echo ""
echo "Dashboard is now accessible at:"
echo "  Production: https://jimbo-like-pumo-api.workers.dev/dashboard"
echo "  Local dev:  http://127.0.0.1:8787/dashboard"
echo ""
echo "Login credentials:"
echo "  Username: (any value, e.g., 'admin')"
echo "  Password: #HAOS77#"
