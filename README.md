# Futuristic

**Futuristic builds portable digital identity infrastructure for vehicles, autonomous systems, and the connected world.**

This TypeScript monorepo connects identity holders, vehicle owners, and fleet operators through a **Futuristic ID bind runtime**. Your identity travels with you: credentials, fleet authorization, autonomy contract, compliance posture, and EV energy profile — validated every time you enter a new vehicle.

## Vision

As vehicles become shared, electric, and self-driving, drivers need a **portable identity layer** — not settings trapped inside one car. Futuristic validates who you are, what you're authorized to operate, and how you expect autonomy and charging to work at bind time, on any surface.

## Stack

- **Web** — Next.js 14, Tailwind CSS
- **API** — Express, JWT auth, role-based access
- **Database** — PostgreSQL + Prisma
- **Shared** — Zod validators, portable identity domain types
- **Bind runtime** — Validates portable identity claims against EV surface policies

## Quick start

```bash
pnpm install
docker compose up -d
cp .env.example .env
pnpm db:push
pnpm db:seed
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Driver | alex@driver.futuristic | password123 |
| Owner | morgan@owner.futuristic | password123 |
| Fleet | sam@fleet.futuristic | password123 |

## Identity domains

| Layer | Domains | What it covers |
|-------|---------|----------------|
| Trust root | credentials, authorization | License, insurance, fleet membership, access tier |
| Operating posture | autonomy, compliance | Autonomy level, handoff policy, safety score, training |
| Infrastructure field | operational, energy | Mobility needs, charging connector, SOC targets |

## Core flows

1. **Identity holder** — Compose portable Futuristic ID across three layers
2. **Owner** — Register EV surfaces and configure policy domains
3. **Fleet** — Operate identity binds at scale across shared EV pools
4. **Bind** — Present Futuristic ID to a vehicle; runtime grants or denies claims with audit trail

## Deploy

Web: `apps/web` on Vercel with `NEXT_PUBLIC_API_URL` pointing to the API.  
API: repo root on Vercel (or Railway/Render) with `DATABASE_URL` set.
