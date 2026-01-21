.PHONY: help install build test lint serve clean dev api frontend

# Default target
help:
	@echo "Five Parsecs - Available commands:"
	@echo ""
	@echo "  make install          - Install all dependencies"
	@echo "  make build            - Build all applications"
	@echo "  make build-api        - Build API application only"
	@echo "  make build-frontend   - Build frontend application only"
	@echo "  make test             - Run all tests"
	@echo "  make test-api         - Run API tests only"
	@echo "  make test-frontend    - Run frontend tests only"
	@echo "  make lint             - Lint all applications"
	@echo "  make lint-api         - Lint API application only"
	@echo "  make lint-frontend    - Lint frontend application only"
	@echo "  make serve            - Serve both API and frontend (development)"
	@echo "  make serve-api        - Serve API only (port 9999)"
	@echo "  make serve-frontend   - Serve frontend only (port 5555)"
	@echo "  make dev              - Alias for 'make serve'"
	@echo "  make api              - Alias for 'make serve-api'"
	@echo "  make frontend         - Alias for 'make serve-frontend'"
	@echo "  make all              - Alias for 'make serve' (start both API and frontend)"
	@echo "  make clean            - Clean all build artifacts and node_modules"
	@echo "  make clean-dist       - Clean only build artifacts (keep node_modules)"
	@echo ""

# Install dependencies
install:
	npm install

# Build commands
build:
	nx build

build-api:
	nx build api

build-frontend:
	nx build frontend

# Test commands
test:
	nx test

test-api:
	nx test api

test-frontend:
	nx test frontend

# Lint commands
lint:
	nx lint

lint-api:
	nx lint api

lint-frontend:
	nx lint frontend

# Serve commands
serve:
	@echo "Starting both API and frontend..."
	@echo "API will be available at http://localhost:9999"
	@echo "Frontend will be available at http://localhost:5555"
	@trap 'kill 0' INT TERM; \
	nx serve api & \
	nx serve frontend & \
	wait

serve-api:
	@echo "Starting API server at http://localhost:9999"
	nx serve api

serve-frontend:
	@echo "Starting frontend server at http://localhost:5555"
	nx serve frontend

# Aliases
dev: serve
api: serve-api
frontend: serve-frontend
all: serve

# Clean commands
clean:
	rm -rf node_modules
	rm -rf dist
	rm -rf .nx
	rm -rf coverage
	find . -name "*.tsbuildinfo" -delete

clean-dist:
	rm -rf dist
	rm -rf .nx
	rm -rf coverage
	find . -name "*.tsbuildinfo" -delete
