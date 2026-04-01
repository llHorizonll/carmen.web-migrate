# Carmen Web - DevOps Makefile
.PHONY: help dev build test lint docker-build docker-run deploy-staging deploy-prod monitoring

# Default target
help:
	@echo "🚀 Carmen Web - DevOps Commands"
	@echo ""
	@echo "Development:"
	@echo "  make dev              Start development server"
	@echo "  make dev-docker       Start development with Docker"
	@echo ""
	@echo "Build & Test:"
	@echo "  make build            Build production bundle"
	@echo "  make test             Run all tests"
	@echo "  make test-coverage    Run tests with coverage"
	@echo "  make lint             Run ESLint"
	@echo "  make type-check       Run TypeScript type check"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build     Build Docker image"
	@echo "  make docker-dev       Run development container"
	@echo "  make docker-prod      Run production container"
	@echo "  make docker-stop      Stop all containers"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy-staging   Deploy to staging"
	@echo "  make deploy-prod      Deploy to production"
	@echo ""
	@echo "Monitoring:"
	@echo "  make monitoring-up    Start monitoring stack"
	@echo "  make monitoring-down  Stop monitoring stack"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean            Clean build artifacts"
	@echo "  make backup           Create backup"
	@echo "  make rollback         Rollback to previous version"

# Development
dev:
	npm run dev

dev-docker:
	docker-compose up app

# Build & Test
build:
	npm run build

test:
	npm run test -- --run

test-coverage:
	npm run test:coverage

test-ui:
	npm run test:ui

lint:
	npm run lint

lint-fix:
	npm run lint:fix

type-check:
	npm run type-check

# Docker
docker-build:
	docker build -t carmen-web:latest .

docker-dev:
	docker-compose up --build app

docker-prod:
	docker-compose -f docker-compose.prod.yml up --build -d

docker-stop:
	docker-compose down
	docker-compose -f docker-compose.prod.yml down

# Deployment
deploy-staging:
	./scripts/deploy.sh staging

deploy-prod:
	./scripts/deploy.sh production

# Monitoring
monitoring-up:
	docker-compose -f docker-compose.monitoring.yml up -d

monitoring-down:
	docker-compose -f docker-compose.monitoring.yml down

monitoring-logs:
	docker-compose -f docker-compose.monitoring.yml logs -f

# Maintenance
clean:
	rm -rf build/
	rm -rf dist/
	rm -rf coverage/
	docker system prune -f

backup:
	./scripts/backup.sh

rollback:
	./scripts/rollback.sh

health-check:
	./scripts/health-check.sh
