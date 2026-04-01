#!/bin/bash
# Health check script

set -e

URL=${1:-http://localhost:8080}
TIMEOUT=30

echo "🏥 Checking health of $URL..."

for i in $(seq 1 $TIMEOUT); do
  if curl -sf "$URL" > /dev/null 2>&1; then
    echo "✅ Application is healthy!"
    exit 0
  fi
  echo "⏳ Attempt $i/$TIMEOUT failed, retrying..."
  sleep 1
done

echo "❌ Health check failed after $TIMEOUT attempts"
exit 1
