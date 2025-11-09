# 🦷 Dentura – Smart Dental Practice Management System

A modern full‑stack web application for dental practices built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Supabase**. Dentura centralises inventory, appointments, orders, analytics, and user management so that dental teams can operate from a single, secure workspace.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E)
![Status](https://img.shields.io/badge/Status-Active-success)

---

## 🔖 Table of Contents

1. [Overview](#overview)
2. [Solution Modules](#solution-modules)
3. [Architecture](#architecture)
4. [Tech Stack](#tech-stack)
5. [Authentication & Authorization](#authentication--authorization)
6. [API Surface](#api-surface)
7. [Database & Migrations](#database--migrations)
8. [Getting Started](#getting-started)
9. [Environment Variables](#environment-variables)
10. [Project Structure](#project-structure)
11. [Development Workflow](#development-workflow)
12. [Roadmap](#roadmap)
13. [Contributing](#contributing)
14. [License](#license)

---

## Overview

Dentura targets day‑to‑day operations inside dental organisations:

- **Inventory**: monitor consumables, detect low stock, manage suppliers.
- **Appointments**: schedule patients, track dentist availability, mark completion.
- **Orders**: follow procurement lifecycle and status updates.
- **Dashboard**: surface KPIs, show recent activity, highlight alerts.
- **Admin**: invite staff, assign roles, audit user activity.

The application currently ships as a web experience (Next.js App Router) and leverages Supabase for authentication and persistence. Core flows (login, signup, user/session state) operate through Supabase JWT tokens and the `@supabase/supabase-js` client; inventory/orders/appointments endpoints are transitioning from mock data to queries executed with pure SQL against Supabase Postgres.

---

## Solution Modules

| Module | Description |
|--------|-------------|
| **Landing** | Marketing-style page describing product value, CTA to register/sign in. |
| **Authentication** | Supabase email/password auth with JWT sessions, role metadata, protected/admin routes, password toggle, signup wizard. |
| **Dashboard** | Overview of totals (products, alerts, revenue), activity feed, low stock summary. |
| **Inventory** | Data table with stock level, threshold, supplier, update dialog, CSV import (API ready for Supabase integration). |
| **Appointments** | Calendar view (month/day), multi-slot appointments, create/edit modal, status badges. |
| **Orders** | Order stats panel, table with status filter, update endpoint placeholder. |
| **Admin Panel** | User list, invite modal, edit modal, payment management stub, role guard. |
| **Global Components** | `PageHeader`, `Navbar`, shadcn/ui primitives, context hooks, layout wrappers. |

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                        Frontend                          │
│  Next.js 14 (App Router) + React 18 + TypeScript         │
│  • Pages: landing, login, signup, dashboard, modules     │
│  • Components: shadcn/ui based, Tailwind styled          │
│  • State: React Context (AuthProvider)                   │
│  • Auth guard: ProtectedRoute, AdminRoute                │
└───────────────▲──────────────────────────────────────────┘
                │supabase-js (JWT session, RPC, SQL)
┌───────────────┴──────────────────────────────────────────┐
│                        Backend                           │
│  Next.js API Routes (Node runtime)                       │
│  • /api/inventory, /api/orders, /api/appointments…       │
│  • Currently return mock data → migrating to SQL         │
│  • Will execute raw SQL against Supabase Postgres        │
└───────────────▲──────────────────────────────────────────┘
                │Postgres connection string (no ORM)
┌───────────────┴──────────────────────────────────────────┐
│                        Database                          │
│  Supabase PostgreSQL                                     │
│  • Tables: inventory_items, orders, appointments, users  │
│  • Auth: Supabase Auth (JWT)                             │
│  • Access: direct SQL via SQL migrations                 │
└──────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Area | Technology | Notes |
|------|------------|-------|
| Framework | **Next.js 14** | App Router, data fetching, API routes |
| Language | **TypeScript 5** | strict mode, incremental builds |
| Styling | **Tailwind CSS 3** + shadcn/ui | design system + animations |
| Auth | **Supabase Auth** | email/password, JWT sessions, metadata roles |
| Database | **Supabase Postgres** | pure SQL (no ORM), `supabase-js` client |
| Icons | **Lucide React** | consistent iconography |
| Tooling | ESLint, Prettier, pnpm/npm scripts |
| Deployment | Vercel (recommended) | zero-config Next.js hosting |

---

## Authentication & Authorization

- **Supabase Client (`lib/supabase.ts`)** – uses public anon key for browser operations (auth, protected routes).
- **Auth Context (`lib/auth.tsx`)** – manages session state, login, signup, logout, role extraction.
- **Role Metadata** – stored in Supabase user metadata. Supported roles: `admin`, `member`, `dentist`, `hygienist`, `assistant`, `office_manager`, `owner`.
- **Route Guards**:
  - `ProtectedRoute` redirects unauthenticated users to `/login`.
  - `AdminRoute` ensures the current user’s role is `admin`.

---

## API Surface

> API routes currently return mocked responses while Supabase tables are being wired in. The interfaces are stable so migrating to real SQL responses will be seamless.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/dashboard` | GET | Dashboard metrics, low stock, recent activity. |
| `/api/inventory` | GET | Inventory list (→ migrate to SQL query). |
| `/api/inventory/update` | POST | Update quantity (→ integrate SQL `UPDATE`). |
| `/api/appointments` | GET/POST | Appointment list & creation (→ SQL). |
| `/api/appointments/complete` | POST | Mark appointment complete. |
| `/api/orders` | GET | Orders list (→ SQL). |
| `/api/orders/update` | POST | Update order status (→ SQL). |
| `/api/users` | GET/POST | List + invite users (mocked). |
| `/api/users/[id]` | PUT/DELETE | Update/delete user (mocked). |

Supabase `supabase-js` can also query tables directly from client components if needed (e.g. realtime features).

---

## Database & Migrations

1. **Provision Supabase** – create a project at [supabase.com](https://supabase.com/).
2. **Track SQL** – store migration files in `database/migrations/*.sql`. Example:
   ```sql
   CREATE TABLE inventory_items (
     id BIGSERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     quantity INTEGER NOT NULL DEFAULT 0,
     threshold INTEGER NOT NULL DEFAULT 0,
     category TEXT,
     supplier TEXT,
     last_updated TIMESTAMPTZ DEFAULT NOW()
   );
   ```
3. **Apply migrations**  
   - Web SQL editor in Supabase dashboard, or  
   - CLI/psql: `psql "$SUPABASE_DB_URL" -f database/migrations/001_init.sql`
4. **Seed data** (optional) with pure SQL inserts.

> No ORM is used. All persistence is handled via SQL statements called through Supabase’s REST/RPC layer or `supabase-js`.

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm, npm, or yarn
- Supabase account (Postgres DB)

### Installation

```bash
git clone https://github.com/connect-abdulbasit/Dental-Inventory-Management-System.git
cd Dental-Inventory-Management-System
npm install
```

Create `.env.local` (see variables below), then run:

```bash
npm run dev
```

Visit `http://localhost:3000`.

---

## Environment Variables

Define these in `.env.local` (never commit this file):

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
SUPABASE_DB_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres  # optional for server-side SQL
```

If you need service-role operations (admin scripts only), use `SUPABASE_SERVICE_ROLE_KEY` **outside** the browser (CLI, Node scripts).

---

## Project Structure

```
.
├── app/
│   ├── admin/               # Admin routes & layout
│   ├── api/                 # Serverless API routes (Next.js)
│   ├── appointments/        # Appointments UI & layout
│   ├── dashboard/           # Dashboard pages/components
│   ├── inventory/           # Inventory management pages
│   ├── login/               # Login page
│   ├── orders/              # Orders management
│   ├── signup/              # Signup multi-step form
│   └── layout.tsx           # Root layout
├── components/
│   ├── admin/               # Admin shared UI
│   ├── appointments/        # Calendar components
│   ├── dashboard/           # Overview cards, alerts, activity feeds
│   ├── inventory/           # Tables, CSV upload
│   ├── orders/              # Order stats/table
│   ├── ui/                  # shadcn/ui system
│   └── page-header.tsx      # Shared header
├── hooks/                   # Reusable hooks (toast, mobile)
├── lib/
│   ├── auth.tsx             # Auth context & guards
│   └── supabase.ts          # Supabase client factory
├── public/                  # Static assets
└── styles/                  # Global CSS
```

---

## Development Workflow

1. **Auth** – Use Supabase dashboard to invite users or test signup locally.
2. **Database changes** – create `.sql` migration, run it against Supabase, commit file.
3. **API updates** – adjust `/app/api/*` to query Supabase via SQL or `supabase-js`.
4. **Testing** – manual UI testing + Supabase auth simulation (automated tests TBD).
5. **Deployment** – push to GitHub → Vercel auto-build (ensure env vars configured).

---

## Roadmap

- [ ] Replace mock API responses with real SQL queries (inventory/orders/appointments/users).
- [ ] Add reporting charts (Recharts integration).
- [ ] Implement audit logging for admin actions.
- [ ] Add two-factor authentication via Supabase OTP.
- [ ] Build automated migration runner.
- [ ] Integrate payment management (Stripe / Supabase Functions).
- [ ] Expand test coverage (Playwright + Vitest).

---

## Contributing

We welcome contributions of any size. Start by forking the repo, creating a feature branch, and opening a pull request.

```bash
git checkout -b feature/your-feature
# make your changes
git commit -m "Add feature"
git push origin feature/your-feature
# open PR on GitHub
```

### Contribution Guidelines
- Follow TypeScript & ESLint best practices.
- Use Tailwind utility classes (or extend the design system if necessary).
- Keep commit messages and PR descriptions clear.
- Update the README or inline docs when behaviour changes.

---

## License

This project is licensed under the MIT License – see [`LICENSE`](LICENSE).

---

If Dentura helps you, please ⭐ the repository. Feedback and feature requests are always appreciated!