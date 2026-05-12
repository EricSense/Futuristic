# Futuristic - Digital Driving Identity Platform

> "The car doesn't define you. You define the car."

Futuristic separates your driving identity from any physical vehicle. Your preferences, comfort settings, and accessibility needs follow you into every car you enter.

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm 10+

### Setup

```bash
# 1. Start databases
docker compose up -d

# 2. Install dependencies
npm install

# 3. Generate Prisma client
npm run db:generate

# 4. Push schema to database
npm run db:push

# 5. Seed demo data
npm run db:seed

# 6. Start development servers
npm run dev
```

The web app runs on `http://localhost:3000` and the API on `http://localhost:4000`.

### Demo Accounts

| Role            | Email                  | Password      |
|-----------------|------------------------|---------------|
| Driver          | driver@futuristic.dev  | password123   |
| Vehicle Owner   | owner@futuristic.dev   | password123   |
| Fleet Operator  | fleet@futuristic.dev   | password123   |

## Architecture

```
futuristic/
├── apps/
│   ├── api/          # Express REST API (port 4000)
│   └── web/          # Next.js 14 App Router (port 3000)
├── packages/
│   ├── db/           # Prisma schema, client, migrations, seed
│   └── shared/       # Zod validators & TypeScript types
├── docker-compose.yml
└── turbo.json
```

## API Endpoints

| Method | Path                              | Auth   | Description                |
|--------|-----------------------------------|--------|----------------------------|
| POST   | `/api/auth/register`              | No     | Create account             |
| POST   | `/api/auth/login`                 | No     | Login                      |
| POST   | `/api/auth/refresh`               | No     | Refresh access token       |
| GET    | `/api/profile`                    | Driver | Get driver profile         |
| PUT    | `/api/profile`                    | Driver | Update preferences         |
| GET    | `/api/vehicles`                   | Owner  | List own vehicles          |
| POST   | `/api/vehicles`                   | Owner  | Register vehicle           |
| POST   | `/api/vehicles/:id/capabilities`  | Owner  | Add capability             |
| GET    | `/api/fleets`                     | Fleet  | List fleets                |
| POST   | `/api/fleets`                     | Fleet  | Create fleet               |
| POST   | `/api/fleets/:id/vehicles`        | Fleet  | Add vehicle to fleet       |
| GET    | `/api/fleets/:id/analytics`       | Fleet  | Get fleet analytics        |
| POST   | `/api/sync/start`                 | Driver | Start sync session         |
| POST   | `/api/sync/:id/end`               | Driver | End sync session           |
| GET    | `/api/sync/history`               | Driver | Get session history        |

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Lucide Icons
- **API**: Express, JWT auth, Zod validation
- **Database**: PostgreSQL 16, Prisma ORM
- **Cache**: Redis 7
- **Build**: Turborepo, npm workspaces
- **Language**: TypeScript 5
