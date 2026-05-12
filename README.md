# Pathy

Project context is available under ./context:

- [Overview](./context/overview.md)
- [Requirements](./context/requirements.md)
- [Architecture](./context/architecture.md)

## Prerequisites

- Node.js `24.x` recommended
- `pnpm` `10.x`

If you use `nvm` on Windows and `pnpm` disappears after switching Node versions, run:

```powershell
corepack enable pnpm
```

## Getting Started

Install dependencies from the repository root:

```powershell
pnpm install
```

Start both frontend and API in development mode:

```powershell
pnpm dev
```

Default local URLs:

- Web: `http://localhost:5173`
- API: `http://localhost:3001`

## Available Scripts

From the repository root:

- `pnpm dev` - run web and API together
- `pnpm dev:web` - run only the frontend
- `pnpm dev:api` - run only the API
- `pnpm build` - build shared, API, and web
- `pnpm typecheck` - run TypeScript checks for all workspaces
- `pnpm --dir packages/api db:generate` - generate a new Drizzle migration from `packages/api/src/db/schema.ts`
- `pnpm --dir packages/api db:migrate` - apply pending database migrations to the Postgres database from `DATABASE_URL`
- `pnpm --dir packages/api db:studio` - open Drizzle Studio for inspecting/editing the database locally
- `pnpm lint` - run ESLint for the repo
- `pnpm lint:fix` - run ESLint with auto-fixes
- `pnpm format` - format the repo with Prettier
- `pnpm format:check` - check formatting without writing changes

## Repository Structure

```text
packages/
  web/      React + Vite frontend
  api/      Fastify + TypeScript backend
  shared/   Shared TypeScript package for common code
```
