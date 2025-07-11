FROM docker.io/node:22.14-bookworm-slim AS base

# Install pnpm
RUN corepack enable pnpm

# install dependencies only when needed
FROM base AS deps
WORKDIR /app

# install dependencies
COPY ./next-app/package.json ./
COPY ./next-app/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS dev

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ./next-app ./
