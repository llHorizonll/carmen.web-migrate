#!/bin/bash
# Backup script for deployment rollback

set -e

BACKUP_DIR="/var/backups/carmen-web"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "💾 Creating backup..."

mkdir -p "$BACKUP_DIR"

# Backup current deployment info
docker ps --filter "name=carmen-web" --format "table {{.Image}}\t{{.Names}}" > "$BACKUP_DIR/containers_$TIMESTAMP.txt"

# Save current image tag
CURRENT_IMAGE=$(docker inspect --format='{{.Config.Image}}' carmen-web 2>/dev/null || echo "none")
echo "$CURRENT_IMAGE" > "$BACKUP_DIR/image_$TIMESTAMP.txt"

echo "✅ Backup created: $BACKUP_DIR/*_$TIMESTAMP"

# Cleanup old backups (keep last 10)
ls -t "$BACKUP_DIR"/containers_*.txt 2>/dev/null | tail -n +11 | xargs rm -f
ls -t "$BACKUP_DIR"/image_*.txt 2>/dev/null | tail -n +11 | xargs rm -f

echo "🧹 Old backups cleaned up"
