# Ubillize

Utilize + Bills

## What is this

Ubillize is a bill notification solution for dorm/apartment using LINE Official account as a notification channel.

## Set up

To set Ubillize up for production use, here's what you need.

- Docker
- Node.js v20.18.0 (or as stated in .nvmrc)
- PNPM (recommended)

Here's a step by step to set Ubillize up for production

1. git clone this project or download the sourcecode
2. Create .env file from .env.example, then fill everything up.
3. Run `docker compose up -d` (might need sudo permission on linux) (Traefik is set to run at port 3000 on http by default)
4. When all containers are up and running, run `pnpm i && pnpm firstrun` or `npm i && npm run firstrun` then create your root admin account.
5. After creating your admin account, go to /staff/settings to set up your bank account details