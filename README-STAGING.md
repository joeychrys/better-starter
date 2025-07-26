# Docker Staging Environment

A simple Docker staging setup for testing your Next.js application in production mode with proper linting and formatting checks.

## Quick Start

### 1. Set up environment variables
```bash
# Edit the staging environment files with your values
.envs/.staging/.next     # Next.js app configuration
.envs/.staging/.postgres # PostgreSQL configuration
```

### 2. Build and start staging
```bash
# Build the staging environment
docker-compose -f docker-compose.staging.yml build

# Start the staging environment
docker-compose -f docker-compose.staging.yml up -d
```

Your app will be available at `http://localhost:3001` (PostgreSQL on `localhost:5433`)

### 3. Stop staging
```bash
docker-compose -f docker-compose.staging.yml down
```

## Manual Commands

Use the `dev-tools` service to run commands manually:

### Fix linting and formatting issues
```bash
# Auto-fix ESLint issues
docker-compose -f docker-compose.staging.yml run --rm dev-tools pnpm run lint:fix

# Auto-fix Prettier formatting
docker-compose -f docker-compose.staging.yml run --rm dev-tools pnpm run format

# Check lint issues (without fixing)
docker-compose -f docker-compose.staging.yml run --rm dev-tools pnpm run lint

# Check formatting (without fixing)
docker-compose -f docker-compose.staging.yml run --rm dev-tools pnpm run format:check
```

### Other useful commands
```bash
# Install new dependencies
docker-compose -f docker-compose.staging.yml run --rm dev-tools pnpm install

# Run custom scripts
docker-compose -f docker-compose.staging.yml run --rm dev-tools pnpm run [script-name]

# Get a shell for debugging
docker-compose -f docker-compose.staging.yml run --rm dev-tools bash
```

## How It Works

- **next-app**: Production build of your Next.js app
- **postgres**: PostgreSQL database for staging
- **dev-tools**: Utility service for running commands (only starts when called with `--rm`)

The staging build will fail if there are linting or formatting issues, ensuring only clean code reaches staging.

## NPM Scripts (from next-app directory)

```bash
cd next-app

# Quick staging commands
pnpm run staging:build    # Build staging
pnpm run staging:up       # Start staging  
pnpm run staging:down     # Stop staging
pnpm run staging:logs     # View logs
```

## Fixing Build Issues

If the staging build fails due to linting:

1. **Fix automatically**:
   ```bash
   docker-compose -f docker-compose.staging.yml run --rm dev-tools pnpm run lint:fix
   docker-compose -f docker-compose.staging.yml run --rm dev-tools pnpm run format
   ```

2. **Check what needs fixing**:
   ```bash
   docker-compose -f docker-compose.staging.yml run --rm dev-tools pnpm run lint
   ```

3. **Rebuild after fixes**:
   ```bash
   docker-compose -f docker-compose.staging.yml build
   ```

This keeps things simple while giving you full control over when and how to fix issues! 