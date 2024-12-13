# syntax=docker.io/docker/dockerfile:1

# Base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Set up pnpm and install Turbo
RUN corepack enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm add -g turbo

# Create a pruned workspace with only the required dependencies
COPY . .
RUN turbo prune ub --docker

# Installer stage
FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Set up pnpm
RUN corepack enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install dependencies from the pruned workspace
COPY --from=deps /app/out/json/ .
COPY --from=deps /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=deps /app/out/full/ .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN pnpm turbo run build --filter=ub...

# Runner stage
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Set required environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy only the necessary files
COPY --from=installer --chown=nextjs:nodejs /app/ub/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/ub/.next/static ./.next/static
COPY --from=installer --chown=nextjs:nodejs /app/ub/public ./public

EXPOSE 3000

CMD ["node", "ub/server.js"]

