# DevOps Guide for Carmen Web

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Make (optional, for convenience commands)

### Development

```bash
# Using npm
npm install
npm run dev

# Using Docker
make dev-docker
# or
docker-compose up app
```

## 📁 DevOps Files Overview

| File | Purpose |
|------|---------|
| `Dockerfile` | Production multi-stage build |
| `Dockerfile.dev` | Development container |
| `docker-compose.yml` | Local development stack |
| `docker-compose.prod.yml` | Production deployment |
| `docker-compose.monitoring.yml` | Monitoring stack |
| `nginx.conf` | Nginx configuration for production |
| `.github/workflows/` | CI/CD pipelines |
| `scripts/` | Deployment & maintenance scripts |
| `monitoring/` | Prometheus, Grafana, Loki configs |

## 🐳 Docker Usage

### Development
```bash
# Start development server with hot reload
docker-compose up app

# Access at http://localhost:5173
```

### Production (Local Testing)
```bash
# Build and run production container
docker-compose --profile prod up nginx

# Access at http://localhost:8080
```

### Production (Server Deployment)
```bash
# On production server
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 CI/CD Pipeline

### GitHub Actions Workflows

1. **CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)
   - Runs on push to `main` and `develop`
   - Jobs: Lint → Test → Build → Docker Build → Deploy

2. **PR Checks** (`.github/workflows/pr-checks.yml`)
   - Runs on pull requests
   - Validates code quality before merge

### Pipeline Stages

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Lint     │───▶│    Test     │───▶│    Build    │
└─────────────┘    └─────────────┘    └──────┬──────┘
                                             │
┌─────────────┐    ┌─────────────┐          │
│   Deploy    │◀───│Docker Build │◀─────────┘
│  (Staging)  │    └─────────────┘
└─────────────┘
       │
       ▼ (on main branch)
┌─────────────┐
│   Deploy    │
│(Production) │
└─────────────┘
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended for Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Option 3: Docker + VPS
```bash
# Build image
docker build -t carmen-web:latest .

# Deploy to server
./scripts/deploy.sh production
```

### Option 4: AWS/GCP/Azure
Use the container image with:
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances

## 📊 Monitoring & Logging

### Start Monitoring Stack
```bash
make monitoring-up
# or
docker-compose -f docker-compose.monitoring.yml up -d
```

### Access Dashboards
- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Loki**: http://localhost:3100

### Services Included
| Service | Port | Purpose |
|---------|------|---------|
| Grafana | 3000 | Visualization dashboards |
| Prometheus | 9090 | Metrics collection |
| Loki | 3100 | Log aggregation |
| Promtail | 9080 | Log shipping |
| Node Exporter | 9100 | System metrics |
| cAdvisor | 8080 | Container metrics |

## 🔐 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |
| `VITE_APP_VERSION` | App version | `4.5.0` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | `false` |

## 🛠️ Maintenance Commands

```bash
# Run all checks
make lint
make type-check
make test

# Build for production
make build

# Docker operations
make docker-build
make docker-stop

# Deployment
make deploy-staging
make deploy-prod

# Backup & Rollback
make backup
make rollback

# Cleanup
make clean
```

## 📈 Performance Optimization

### Build Optimizations (Already Configured)
- Code splitting by vendor (React, Mantine, TanStack)
- Gzip compression enabled
- Static asset caching (1 year)
- Tree shaking for production

### Monitoring Metrics
- Bundle size tracking in CI
- Lighthouse CI (can be added)
- Performance budgets

## 🔒 Security

### Headers Configured
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Docker Security
- Non-root user execution
- Multi-stage builds (smaller attack surface)
- Health checks configured

## 🆘 Troubleshooting

### Docker Issues
```bash
# Clean everything
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Build Issues
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Deployment Issues
```bash
# Check health
curl http://localhost:8080

# View logs
docker-compose logs -f

# Rollback
make rollback
```

## 📝 Additional Notes

- All scripts are in `scripts/` directory
- Monitoring configs are in `monitoring/` directory
- CI/CD configs are in `.github/workflows/` directory
- Use `make help` to see all available commands
