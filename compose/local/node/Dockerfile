FROM docker.io/node:22.14-bookworm-slim AS base

# install dependencies only when needed
FROM base AS deps
WORKDIR /app

# install dependencies
COPY ./next-app/package.json ./
COPY ./next-app/package-lock.json ./
RUN npm ci

FROM base as dev

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ./next-app ./

#rebuild the source code only when needed
FROM base AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ./next-app ./

#disable telemetry
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build