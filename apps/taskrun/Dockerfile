FROM node:20-alpine AS base

FROM base AS builder

RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /app

RUN corepack enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN pnpm i -g turbo

COPY . .
RUN turbo prune taskrun --docker

FROM base AS installer
RUN corepack enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=builder /app/out/json/ .
RUN pnpm i

COPY --from=builder /app/out/full/ .

FROM base AS runner
WORKDIR /app

RUN corepack enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN addgroup --system --gid 1001 taskrun
RUN adduser --system --uid 1001 taskrun
USER taskrun
COPY --from=installer /app .

CMD pnpm tsx apps/taskrun/src/index.ts
