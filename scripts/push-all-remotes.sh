#!/usr/bin/env bash
# Push linqiang frontend to GitHub. Redeploy Cloudflare Worker after push.

set -euo pipefail

echo "→ Pushing linqiang (origin main)..."
git push origin main

echo "Done. Redeploy Cloudflare Worker:"
echo "  npm run deploy:linqiang"
