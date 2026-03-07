---
description: Toggle Maintenance Mode (Take site down or bring it back up)
---

# Maintenance Workflow

This workflow manages the Cloudflare Worker that handles the maintenance page for the portfolio.

### 1. Identify Action

Ask the user whether they want to:

- **ENABLE** Maintenance Mode (Site will be DOWN)
- **DISABLE** Maintenance Mode (Site will be LIVE)

### 2. Update Configuration

Update the `MAINTENANCE_MODE` variable in [.agent/scripts/maintenance/wrangler.toml](file:///.agent/scripts/maintenance/wrangler.toml).

- To ENABLE: Set `MAINTENANCE_MODE = "true"`
- To DISABLE: Set `MAINTENANCE_MODE = "false"`

### 3. Deploy to Cloudflare

// turbo

1. Navigate to `.agent/scripts/maintenance` and run `npx wrangler deploy`.

### 4. Verification

1. Visit [lucasshiota.com](https://lucasshiota.com) to verify the status.
2. Verify the response code is 503 (if enabled) to maintain SEO health.
