# Better Starter

A Next.js 16 starter with authentication, payments, and a production-ready deployment pipeline.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Auth**: Better Auth (email/password, Google OAuth, admin, JWT)
- **Database**: PostgreSQL + Drizzle ORM
- **Payments**: Polar.sh (checkout, portal, usage metering)
- **UI**: shadcn/ui (new-york), Tailwind CSS v4, Radix UI, lucide-react
- **State**: React Query (TanStack Query)
- **Forms**: react-hook-form + Zod
- **Email**: Resend + React Email
- **Deployment**: Docker, GitHub Actions, GitHub Container Registry, Dokploy

## Local Development

Local dev runs two things: the Next.js app on your machine and a PostgreSQL database in Docker.

### 1. Start the database

```bash
docker compose -f docker-compose.local.yml up -d
```

This starts a PostgreSQL 16 container on port 5432 with default credentials (`user` / `password` / `betterstarter`).

### 2. Configure environment variables

```bash
cp next-app/.env.local.example next-app/.env.local
```

Edit `next-app/.env.local` and fill in your keys. The database URL for local dev is:

```
DATABASE_URL=postgresql://user:password@localhost:5432/betterstarter
```

### 3. Set up the database schema

```bash
cd next-app
pnpm install
pnpm db:push    # push schema to the database
```

### 4. Start the dev server

```bash
pnpm dev
```

The app is available at [http://localhost:3000](http://localhost:3000).

### Available Scripts

All scripts run from `next-app/`:

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Run ESLint with auto-fix |
| `pnpm format` | Format with Prettier |
| `pnpm format:check` | Check formatting (CI uses this) |
| `pnpm db:generate` | Generate Drizzle migration files |
| `pnpm db:migrate` | Apply Drizzle migrations |
| `pnpm db:push` | Push schema directly (no migration file) |
| `pnpm db:studio` | Open Drizzle Studio |

### Pre-commit Hook

Husky + lint-staged runs automatically on every commit. It applies ESLint --fix and Prettier --write to staged files so code quality is enforced before anything gets committed.

## Going to Production

Production deployment uses a fully automated pipeline: push a version tag, GitHub Actions builds a Docker image, pushes it to GitHub Container Registry (GHCR), and triggers Dokploy to deploy it.

### How it works

```
git tag v1.0.0 && git push --tags
        |
        v
  GitHub Actions
  (production.yml)
        |
        v
  Build Docker image
  (dokploy/Dockerfile)
        |
        v
  Push to GHCR
  (ghcr.io/<owner>/better-starter)
        |
        v
  Trigger Dokploy deploy
  (via API call)
```

### GitHub Actions Workflows

There are two workflows:

> **Note:** Both workflows use [Blacksmith](https://blacksmith.sh) runners (`blacksmith-2vcpu-ubuntu-2204` and `blacksmith-4vcpu-ubuntu-2404`) for faster CI. To use standard GitHub-hosted runners instead, replace the `runs-on` values with `ubuntu-latest`.

**PR Validation** (`.github/workflows/pr-validation.yml`) -- runs on every PR to `master`:
- ESLint check
- Prettier formatting check
- Docker build validation (builds the image but does not push)

**Production Build and Deploy** (`.github/workflows/production.yml`) -- runs when you push a `v*` tag:
1. Builds a multi-stage Docker image using `dokploy/Dockerfile`
2. Pushes the image to GitHub Container Registry (`ghcr.io/<owner>/better-starter`)
3. Tags the image with the semver version (`v1.2.3`), minor (`1.2`), and `latest`
4. Triggers a deployment on Dokploy via its API

### GitHub Container Registry (GHCR)

Docker images are stored in GHCR, tied to the repository. The workflow authenticates using the built-in `GITHUB_TOKEN` -- no extra credentials needed for pushing images. Dokploy pulls images from GHCR when deploying.

### Dokploy

[Dokploy](https://dokploy.com) is used to host and serve the containers. It pulls the latest image from GHCR and runs it with the production environment variables you configure in its dashboard.

Dokploy handles:
- Running the container
- Environment variable injection (server-side vars override build-time values)
- Health checks, restarts, and logs

### Required GitHub Secrets

Set these in your repository settings under **Settings > Secrets and variables > Actions**:

| Secret | Description |
|---|---|
| `DATABASE_URL` | Production PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Auth secret key |
| `RESEND_API_KEY` | Resend email API key |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `POLAR_ACCESS_TOKEN` | Polar.sh access token |
| `POLAR_WEBHOOK_SECRET` | Polar.sh webhook secret |
| `DOKPLOY_URL` | Dokploy instance hostname |
| `DOKPLOY_API_KEY` | Dokploy API key |
| `DOKPLOY_APP_ID` | Dokploy application ID |

> **Note:** The build-time secrets (`DATABASE_URL`, `RESEND_API_KEY`, etc.) are only used to satisfy module initialization during `next build`. They can be dummy values. Real credentials are injected at runtime by Dokploy.

### NEXT_PUBLIC_* Variables

Client-side environment variables (`NEXT_PUBLIC_*`) are baked into the JavaScript bundle at build time. To avoid rebuilding for every environment, this project uses a placeholder pattern:

1. During build, `NEXT_PUBLIC_BASE_URL` is set to `https://PLACEHOLDER_REPLACE_ME_BASE_URL`
2. At container start, `scripts/entrypoint.sh` replaces the placeholder with the real value from the Dokploy environment
3. The Next.js server then starts with the correct URLs

### Deploying a new version

```bash
# Tag and push
git tag v1.0.0
git push --tags
```

The pipeline handles everything from there. Monitor the build in the **Actions** tab of your GitHub repository.

## Project Structure

```
better-starter/
  .github/workflows/       # CI/CD pipelines
  .husky/                   # Git hooks (pre-commit)
  dokploy/                  # Production Dockerfile and env example
  scripts/                  # Container entrypoint script
  next-app/                 # Next.js application
    src/
      app/                  # App Router pages and layouts
        (auth)/             # Sign-in, sign-up, reset-password
        account/            # Profile, security, billing
        admin/              # Admin dashboard
        api/auth/[...all]/  # Better Auth API route
      components/           # Shared components
        ui/                 # shadcn/ui primitives
        icons/              # SVG icon components
        email-templates/    # React Email templates
        tables/             # Data table compositions
      db/                   # Database connection and schema
      drizzle/              # Migration files (auto-generated)
      hooks/                # Custom React hooks
      lib/                  # Auth, types, schemas, utils
      providers.tsx         # React Query provider
      proxy.ts              # Route protection middleware
```

## License

MIT
