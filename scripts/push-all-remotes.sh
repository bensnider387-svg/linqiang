#!/usr/bin/env bash
# Push frontend sync branches to all three GitHub remotes.
# Run from repo root after logging into GitHub with accounts that have push access.

set -euo pipefail

echo "→ Pushing Thomas Forte / qianduan (origin main)..."
git push origin main

echo "→ Pushing Allen Klee (allen-klee sync/allen-klee → main)..."
git push allen-klee sync/allen-klee:main

echo "→ Pushing Ben Snide (xiaoming sync/xiaoming → main)..."
git push xiaoming sync/xiaoming:main

echo "Done. Redeploy each Cloudflare Worker after push:"
echo "  npm run deploy:qianduan"
echo "  npm run deploy:allen"
echo "  npm run deploy:ben-snider"
