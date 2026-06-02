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
- **Sync Engine** — Maps driver preferences to vehicle capabilities

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

1. **Driver** — Build a 6-layer identity profile (seat, mirrors, climate, infotainment, driving mode, accessibility)
2. **Owner** — Register vehicles and define capabilities
3. **Fleet** — Manage vehicle pools, view sync analytics
4. **Sync** — Engine matches preferences to capabilities, logs sessions
