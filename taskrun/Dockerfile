FROM node:20-alpine

RUN corepack enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY taskrun ./taskrun

RUN pnpm install

WORKDIR /app/taskrun

CMD ["pnpm", "tsx", "src/index.ts"]
