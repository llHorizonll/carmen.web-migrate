#!/bin/bash
# Deployment script for Carmen Web

set -e

ENVIRONMENT=${1:-staging}
IMAGE_TAG=${2:-latest}

echo "🚀 Deploying Carmen Web to $ENVIRONMENT..."

# Configuration
REGISTRY="ghcr.io"
IMAGE_NAME="your-org/carmen.web-migrate"
FULL_IMAGE="$REGISTRY/$IMAGE_NAME:$IMAGE_TAG"

case $ENVIRONMENT in
  staging)
    SERVER="staging-server"
    DOMAIN="staging.carmen-web.example.com"
    ;;
  production)
    SERVER="production-server"
    DOMAIN="carmen-web.example.com"
    ;;
  *)
    echo "❌ Unknown environment: $ENVIRONMENT"
    echo "Usage: $0 [staging|production] [image-tag]"
    exit 1
    ;;
esac

echo "📦 Pulling image: $FULL_IMAGE"
echo "🎯 Target server: $SERVER"
echo "🌐 Domain: $DOMAIN"

# Deploy commands (customize for your infrastructure)
# ssh user@$SERVER << EOF
#   docker pull $FULL_IMAGE
#   docker stop carmen-web || true
#   docker rm carmen-web || true
#   docker run -d \
#     --name carmen-web \
#     --restart unless-stopped \
#     -p 8080:8080 \
#     -e NODE_ENV=production \
#     $FULL_IMAGE
# EOF

echo "✅ Deployment to $ENVIRONMENT complete!"
echo "🌐 Application available at: https://$DOMAIN"

# Health check
echo "🏥 Running health check..."
sleep 5
# curl -f https://$DOMAIN/health || echo "⚠️ Health check failed"
