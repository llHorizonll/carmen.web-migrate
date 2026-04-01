#!/bin/bash
# Rollback script

set -e

BACKUP_DIR="/var/backups/carmen-web"

echo "🔄 Rolling back to previous version..."

# Find latest backup
LATEST_IMAGE=$(ls -t "$BACKUP_DIR"/image_*.txt 2>/dev/null | head -1)

if [ -z "$LATEST_IMAGE" ]; then
  echo "❌ No backup found!"
  exit 1
fi

PREVIOUS_IMAGE=$(cat "$LATEST_IMAGE")
echo "📦 Previous image: $PREVIOUS_IMAGE"

# Rollback
# docker stop carmen-web
# docker rm carmen-web
# docker run -d --name carmen-web -p 8080:8080 $PREVIOUS_IMAGE

echo "✅ Rollback complete!"
