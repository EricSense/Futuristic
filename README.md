# Futuristic

**Your Digital Driving Identity.** The car that knows you is the prototype for the world that knows you.

Futuristic is a TypeScript monorepo — a marketplace connecting drivers (portable digital identities), vehicle owners, and fleet operators through an intelligent sync engine.

## Vision

Your Digital Driving Identity isn't a car feature — it's an early proof of concept for ambient identity. One profile. Any vehicle. Graceful degradation when capabilities differ. Today: driving. Tomorrow: everywhere context matters.

## Stack

- **Web** — Next.js 14, Tailwind CSS
- **API** — Express, JWT auth, role-based access
- **Database** — PostgreSQL + Prisma
- **Shared** — Zod validators, TypeScript types
- **Recognition runtime** — Maps DDI signals to surface capability domains

## Quick start

```bash
# Install dependencies
pnpm install

# Start PostgreSQL + Redis
docker compose up -d

# Copy env and set up database
cp .env.example .env
pnpm db:push
pnpm db:seed

# Run dev servers (API on :4000, Web on :3000)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Driver | alex@driver.futuristic | password123 |
| Owner | morgan@owner.futuristic | password123 |
| Fleet | sam@fleet.futuristic | password123 |

## Project structure

```
futuristic/
  apps/
    api/          Express REST API + sync engine
    web/          Next.js landing + dashboards
  packages/
    db/           Prisma schema, migrations, seed
    shared/       Zod validators, shared types
  docker-compose.yml
```

## Core flows

1. **Driver** — Compose a 3-layer Digital Driving Identity (ergonomic, behavioral, contextual)
2. **Owner** — Register recognition surfaces and enable DDI signal domains
3. **Fleet** — Operate identity recognition at scale across surface pools
4. **Recognition** — Runtime expresses DDI signals on surfaces, logs events

## Deploy to Vercel

`Cannot GET /` means Vercel is serving the **Express API** instead of the **Next.js site**. Fix it in project settings:

1. Open your Vercel project → **Settings** → **General**
2. Set **Root Directory** to `apps/web`
3. Set **Environment Variables**:
   - `NEXT_PUBLIC_API_URL` = your deployed API URL (e.g. `https://your-api.railway.app`)
4. Redeploy

The web app includes `apps/web/vercel.json` with monorepo build commands. The API is a separate Node server — deploy `apps/api` to Railway, Render, or Fly with `DATABASE_URL` set, then point the web app at it.
