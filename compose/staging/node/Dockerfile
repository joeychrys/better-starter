# Base image
FROM docker.io/node:22.14-bookworm-slim AS base

# Install pnpm
RUN corepack enable pnpm

# 1. Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY ./next-app/package.json ./next-app/pnpm-lock.yaml* ./
RUN pnpm install

# 1.5. Install ALL dependencies (including dev) for development tools
FROM base AS deps-dev
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY ./next-app/package.json ./next-app/pnpm-lock.yaml* ./
RUN pnpm install

# 2. Lint and format check stage
FROM base AS lint-and-format
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ./next-app ./

# Run ESLint and Prettier checks (for CI/build validation)
RUN echo "Running ESLint..." && pnpm run lint
RUN echo "Running Prettier format check..." && pnpm run format:check
RUN echo "All lint and format checks passed!"

# 3. Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ./next-app ./
COPY ./.envs/.staging/.next ./.env.production

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN echo "Building Next.js application..." && pnpm run build

# 4. Staging runtime image
FROM base AS staging
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy package.json for metadata
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"] 