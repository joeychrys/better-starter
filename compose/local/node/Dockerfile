FROM docker.io/node:22.14-bookworm-slim AS base

# install dependencies only when needed
FROM base AS deps
WORKDIR /app

# install dependencies
COPY ./next-app/package.json ./
COPY ./next-app/package-lock.json ./
RUN npm ci

FROM base AS dev

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ./next-app ./
