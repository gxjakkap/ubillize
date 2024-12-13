FROM node:20-alpine
WORKDIR /app

COPY ./package.json ./
COPY ./pnpm-lock.yaml ./
COPY ./pnpm-workspace.yaml ./
COPY ./turbo.json ./
COPY ./packages ./packages
COPY ./taskrun ./taskrun

RUN corepack enable pnpm
RUN pnpm i --frozen-lockfile

WORKDIR /app/taskrun

CMD ["tsx", "src/index.ts"]
