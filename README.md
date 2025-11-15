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
4. [Diagrams](#diagrams)
5. [Tech Stack](#tech-stack)
6. [Authentication & Authorization](#authentication--authorization)
7. [API Surface](#api-surface)
8. [Database & Migrations](#database--migrations)
9. [Getting Started](#getting-started)
10. [Environment Variables](#environment-variables)
11. [Project Structure](#project-structure)
12. [Development Workflow](#development-workflow)
13. [Roadmap](#roadmap)
14. [Contributing](#contributing)
15. [License](#license)

---

## Overview

Dentura targets day‑to‑day operations inside dental organisations:

- **Inventory Management**: Monitor consumables, detect low stock, manage suppliers, and manually adjust quantities. Browse product catalog and add items directly to inventory or shopping cart.
- **Procedures**: Define dental procedures with associated inventory items and quantities. Automatically deduct inventory upon procedure completion.
- **Appointments**: Schedule patients with procedure-based appointments, track availability, and manage past appointments that need completion or cancellation.
- **Orders & Cart**: Shopping cart system with checkout functionality. Support for multiple payment methods (Cash on Delivery, Credit/Debit Cards) with saved card management.
- **Dashboard**: Surface KPIs, show recent activity, and display past appointments requiring action.
- **Admin**: Invite staff, assign roles, audit user activity, and manage payment settings.

The application currently ships as a web experience (Next.js App Router) and leverages Supabase for authentication and persistence. Core flows (login, signup, user/session state) operate through Supabase JWT tokens and the `@supabase/supabase-js` client. API endpoints use in-memory data stores for demonstration purposes and are ready for migration to Supabase Postgres.

---

## Solution Modules

| Module | Description |
|--------|-------------|
| **Landing** | Marketing-style page describing product value, CTA to register/sign in. |
| **Authentication** | Supabase email/password auth with JWT sessions, role metadata, protected/admin routes, password toggle, signup wizard. |
| **Dashboard** | Overview of totals (products, alerts, revenue), activity feed, and past appointments requiring action (complete/cancel). |
| **Inventory** | Product catalog with search and pagination, inventory table with stock levels, thresholds, and order amounts. Features update dialogs for quantity/threshold/order amount, manual deduction with reasons, and CSV import capability. |
| **Procedures** | Create and manage dental procedures with associated inventory items and quantities. Complete procedures to automatically deduct inventory. |
| **Appointments** | Calendar view (month/day), procedure-based appointment creation, multi-slot appointments, create/edit modal, status badges. Past appointments can be marked as completed or cancelled from the dashboard. |
| **Orders & Cart** | Shopping cart system with sidebar, product catalog integration, checkout modal with payment method selection (COD, Credit/Debit Card), saved card management, and order tracking. |
| **Payment Methods** | Stripe-like UI for adding credit/debit cards with live preview, validation, and secure storage. Cards can be saved and reused during checkout. |
| **Admin Panel** | User list, invite modal, edit modal, payment management, role guard. |
| **Global Components** | `PageHeader`, `Navbar` with profile dropdown, `CartProvider` for global cart state, shadcn/ui primitives, context hooks, layout wrappers. |

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                        Frontend                          │
│  Next.js 14 (App Router) + React 18 + TypeScript         │
│  • Pages: landing, login, signup, dashboard, modules     │
│  • Components: shadcn/ui based, Tailwind styled          │
│  • State: React Context (AuthProvider, CartProvider)     │
│  • Auth guard: ProtectedRoute, AdminRoute                │
│  • Cart: Global shopping cart state management           │
└───────────────▲──────────────────────────────────────────┘
                │supabase-js (JWT session, RPC, SQL)
┌───────────────┴──────────────────────────────────────────┐
│                        Backend                           │
│  Next.js API Routes (Node runtime)                       │
│  • /api/inventory, /api/orders, /api/appointments        │
│  • /api/products, /api/procedures, /api/dashboard        │
│  • Currently use in-memory data stores                   │
│  • Ready for migration to Supabase Postgres SQL          │
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

## Diagrams

### Use Case Diagram
- **Live diagram**: [Open Use Case Diagram](https://excalidraw.com/#json=hlDiTjCreay34kAk7KU0U,2MRtHYJtk6MAh2YFHMEkWA)
- **Screenshot reference**: ![Dentura Use Case Diagram](public/use-case-diagram.png)

### Entity Relationship Diagram (ERD)
- **Live diagram**: [Open ERD](https://excalidraw.com/#json=1uTEbqB71rqFsY2XjePkS,tSQbpyt4JrC37DQ1POflbQ)
- **Screenshot reference**: ![Dentura ERD](public/entity-relationship-diagram.png)

### Normalized Schema Overview
- **Live diagram**: [Open Normalized Schema](https://lucid.app/lucidchart/fbda5bf2-c2ef-4365-9296-8efd33a22114/edit?viewport_loc=-2544%2C-449%2C5112%2C2744%2C0_0&invitationId=inv_d7d6c1b7-0429-498f-a694-ebca20145628)
- **Screenshot reference**: ![Dentura Normalized Schema](public/normalized-schema-overview.png)

### Sequence Diagram
- **Live diagram**: `[Add Sequence Diagram URL here](https://example.com/sequence-diagram)`
- **Screenshot reference**: ![Dentura Sequence Diagram](public/sequence-diagram.jpeg)

---

### High-Level System Architecture Diagram

```
┌──────────────┐     HTTPS Requests       ┌───────────────────────────────┐
│  User Agent  │ ───────────────────────▶ │  Front-end (Next.js + React)  │
│ (Browser/UI) │                          │  • Tailwind UI Components     │
└──────┬───────┘                          │  • Auth Context (`lib/auth`)  │
       │                                  └───────────────┬───────────────┘
       │                 JWT + Session State              │
       │ ◀────────────────────────────────────────────────┘
       │                                                  │
       │                                  ┌───────────────▼───────────────┐
       │                                  │ Middleware / API Gateway       │
       │                                  │ (Next.js API Routes `/api`)    │
       │                                  │  • AuthN/AuthZ via `lib/jwt`   │
       │                                  │  • Validation & DTO shaping    │
       │                                  └───────────────┬───────────────┘
       │                         SQL Queries (Drizzle ORM)│
       │                                  ┌───────────────▼───────────────┐
       └─────────────────────────────────▶│ Back-end Data Access Layer     │
                                          │ (`lib/db` + Drizzle + SQL)     │
                                          └───────────────┬───────────────┘
                                  Result Sets / CRUD Ops   │
                                          ┌───────────────▼───────────────┐
                                          │  Supabase Postgres Database    │
                                          │  • Users, Inventory, Orders    │
                                          │  • Appointments, Dashboard     │
                                          └────────────────────────────────┘
```

- **Data flow**: The browser issues HTTPS requests to the Next.js front-end, which invokes API routes. Middleware handles authentication with JWT tokens, invokes Drizzle ORM, and persists or reads data from Supabase Postgres. JSON responses bubble back through the API layer to the UI for rendering. External APIs can be introduced at the middleware tier by adding additional connectors before data access.

---

## Tech Stack

| Area | Technology | Notes |
|------|------------|-------|
| Framework | **Next.js 14** | App Router, data fetching, API routes |
| Language | **TypeScript 5** | strict mode, incremental builds |
| Styling | **Tailwind CSS 3** + shadcn/ui | design system + animations, responsive design |
| Auth | **Supabase Auth** | email/password, JWT sessions, metadata roles |
| Database | **Supabase Postgres** | pure SQL (no ORM), `supabase-js` client |
| State Management | **React Context** | AuthProvider, CartProvider for global state |
| Icons | **Lucide React** | consistent iconography |
| Storage | **localStorage** | Cart persistence, saved payment methods |
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

> API routes currently use in-memory data stores for demonstration purposes. The interfaces are stable and ready for migration to Supabase Postgres.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/dashboard` | GET | Dashboard metrics, recent activity, appointments data. |
| `/api/inventory` | GET/POST | Inventory list and add new items to inventory. |
| `/api/inventory/update` | POST | Update quantity, threshold, order amount, or deduct quantity with reason. |
| `/api/inventory/import` | POST | CSV import for bulk inventory updates. |
| `/api/products` | GET | Product catalog list with pagination support. |
| `/api/products/[id]` | GET | Get single product details by ID. |
| `/api/procedures` | GET/POST | Procedure list and create new procedures with inventory items. |
| `/api/procedures/complete` | POST | Complete procedure and automatically deduct inventory items. |
| `/api/appointments` | GET/POST | Appointment list and creation with procedure selection. |
| `/api/appointments/[id]` | PUT/DELETE | Update appointment status (complete/cancel) or delete appointment. |
| `/api/orders` | GET/POST | Orders list and create orders from cart checkout. |
| `/api/orders/update` | POST | Update order status (delivered status updates inventory). |
| `/api/users` | GET/POST | List and invite users. |
| `/api/users/[id]` | PUT/DELETE | Update or delete user. |

**Note**: Payment methods (credit cards) are stored in browser `localStorage` for demo purposes. In production, these should be stored securely via a payment processor API (e.g., Stripe).

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
│   │   ├── appointments/    # Appointment CRUD endpoints
│   │   ├── dashboard/       # Dashboard data endpoint
│   │   ├── inventory/       # Inventory management endpoints
│   │   ├── orders/          # Order management endpoints
│   │   ├── procedures/      # Procedure CRUD endpoints
│   │   ├── products/        # Product catalog endpoints
│   │   └── users/           # User management endpoints
│   ├── appointments/        # Appointments UI & layout
│   ├── dashboard/           # Dashboard pages/components
│   ├── inventory/           # Inventory management pages
│   ├── login/               # Login page
│   ├── orders/              # Orders management & cart
│   ├── payment-methods/     # Payment method management
│   ├── procedures/          # Procedures management
│   ├── signup/              # Signup multi-step form
│   └── layout.tsx           # Root layout with CartProvider
├── components/
│   ├── admin/               # Admin shared UI
│   ├── appointments/        # Calendar components, appointment modals
│   ├── dashboard/           # Overview cards, past appointments, activity feeds
│   ├── inventory/           # Inventory table, product catalog, CSV upload
│   ├── orders/              # Order stats, cart sidebar, checkout modal
│   ├── procedures/          # Procedure table, create procedure modal
│   ├── ui/                  # shadcn/ui component system
│   ├── navbar.tsx           # Navigation with profile dropdown
│   └── page-header.tsx      # Shared header component
├── hooks/                   # Reusable hooks (toast, mobile)
├── lib/
│   ├── auth.tsx             # Auth context & guards
│   ├── cart-context.tsx     # Shopping cart context provider
│   ├── supabase.ts          # Supabase client factory
│   └── utils.ts             # Utility functions
├── public/                  # Static assets (diagrams, images)
└── app/globals.css          # Global CSS with animations
```

---

## Development Workflow

1. **Auth** – Use Supabase dashboard to invite users or test signup locally.
2. **Database changes** – create `.sql` migration, run it against Supabase, commit file.
3. **API updates** – adjust `/app/api/*` to query Supabase via SQL or `supabase-js`.
4. **Testing** – manual UI testing + Supabase auth simulation (automated tests TBD).
5. **Deployment** – push to GitHub → Vercel auto-build (ensure env vars configured).

---

## Key Features

### 🛒 Shopping Cart System
- Add products to cart from product catalog
- Persistent cart state using localStorage
- Cart sidebar with item management
- Checkout with multiple payment options

### 💳 Payment Methods
- Stripe-like UI for adding credit/debit cards
- Live card preview while entering details
- Save and reuse cards for future orders
- Support for Cash on Delivery (COD) and card payments

### 📦 Product Catalog
- Browse dental products with images
- Search and pagination support
- Product details modal with full information
- Add products directly to inventory or cart

### 🔧 Procedures Management
- Create procedures with associated inventory items
- Define quantities for each inventory item
- Automatic inventory deduction upon procedure completion
- Procedure-based appointment scheduling

### 📅 Enhanced Appointments
- Procedure-based appointment creation
- Calendar view with month/day navigation
- Past appointments management from dashboard
- Mark appointments as completed or cancelled

### 📊 Inventory Management
- Update quantity, threshold, and order amount simultaneously
- Manual inventory deduction with reason tracking
- Low stock detection and alerts
- CSV import for bulk updates

### 👤 User Experience
- Profile dropdown in navbar with logout and admin access
- Responsive design for mobile and desktop
- Loading states and animations
- Toast notifications for user feedback

## Roadmap

- [ ] Replace in-memory API responses with real Supabase SQL queries
- [ ] Integrate Stripe or payment processor API for secure card storage
- [ ] Add reporting charts (Recharts integration)
- [ ] Implement audit logging for admin actions
- [ ] Add two-factor authentication via Supabase OTP
- [ ] Build automated migration runner
- [ ] Add real-time inventory updates
- [ ] Expand test coverage (Playwright + Vitest)
- [ ] Add email notifications for low stock and order updates

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