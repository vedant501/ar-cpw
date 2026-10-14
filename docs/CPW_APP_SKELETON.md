# CPW App — Architecture & Route Skeleton

Repository: `vedant501/ar-cpw`
Baseline branch: `main`
Implementation branch: `feature/cpw-app-skeleton-v1`
Scope: CRM and showroom operations first; customer storefront remains supported.

## Goals

- Preserve existing records, IDs, routes, and Prisma models wherever possible.
- Improve the internal CRM before adding advanced storefront features.
- Make authorization server-enforced; navigation visibility is not a security boundary.
- Reuse existing components and server actions instead of duplicating business logic.
- Ship incrementally, with no destructive database migrations in the skeleton phase.

## Current architecture observed

- Next.js App Router and TypeScript.
- Prisma with PostgreSQL.
- NextAuth credentials authentication, with Google auth routes also present.
- Server actions in `src/lib/actions`.
- Shared UI and feature components in `src/components`.
- Existing Prisma models include Lead, Quotation, QuotationItem, Product, ShopProduct, ShopReview, User, Transaction, Order, OrderItem, Measurement, Attachment, MonthlyBalance, and WeeklyBankBalance.

These are source-code observations; each route's end-to-end behavior still needs runtime testing.

## Current routes to preserve

### Internal CRM

- `/dashboard`
- `/leads`, `/leads/all`, `/leads/[id]`
- `/measurements`, `/measurements/[id]`
- `/quotations`, `/quotations/new`, `/quotations/[id]`, `/quotations/[id]/edit`
- `/reminders`
- `/products`, `/stock`, `/vendors`
- `/orders`, `/processing-orders`
- `/sales`
- `/transactions`, `/transactions/statement`
- `/settings`, `/settings/users`

### Customer-facing app

- `/`, `/shop`, `/shop/[id]`
- `/checkout`, `/my-orders`
- `/login`, `/signup`
- `/contact`, `/blog`, `/privacy`, `/terms`
- `/ar`

## Target navigation

### CRM and sales
- Dashboard
- Leads
- Customers (new; initially a read-only directory derived from existing leads)
- Customer profile and history (new; only after a data model/relationship audit)
- Measurements
- Quotations
- Follow-up reminders

### Showroom operations
- Online orders
- Order processing
- Installation schedule (new)
- Vendors
- Purchase orders (new)

### Inventory and finance
- Product master
- Storefront catalogue
- Stock management
- Transactions and statements
- Sales and reports (reports hub is new)

### Administration
- Staff management
- Role and permission management (new)
- Activity/audit history (new)
- Business settings

### Customer experience
- Home and product catalogue
- Product details and enquiries
- Checkout and order history
- Customer profile (new)
- AR experience

## Proposed target code organization

This is a gradual target, not a mandate to move existing files immediately.

```
src/
  app/
    (protected)/
      dashboard/
      leads/
      customers/             # new
      measurements/
      quotations/
      reminders/
      orders/
      processing-orders/
      installations/         # new
      products/
      stock/
      vendors/
      purchase-orders/       # new
      transactions/
      reports/               # new
      settings/
    shop/
    checkout/
    my-orders/
    ar/
  components/
    layout/
    leads/
    customers/               # new shared UI
    measurements/
    quotations/
    orders/
    inventory/               # new shared UI where needed
    ui/
  lib/
    actions/                 # existing server actions
    services/                # proposed shared business rules
    validation/              # proposed shared validation schemas
    auth/                    # proposed authorization helpers
    db.ts
  auth.ts
  auth.config.ts
prisma/
  schema.prisma              # preserve current models initially
```

## Role model

Existing role values in the Prisma schema are `admin`, `user`, and `customer`. Proposed business permissions:

- Owner/admin: full operational access; sensitive finance and settings actions.
- Staff: only assigned operational capabilities.
- Customer: only their own account, enquiries and orders.

Do not assume a role is authorized simply because a menu item is hidden. Validate permissions in each server action/data access boundary.

## Priority work plan

1. P0 — Audit and secure every internal route and server action. Review order read/update/create authorization, customer ownership, server-side price calculation, and payment verification.
2. P1 — Verify lead, measurement, quotation, reminder and print workflows.
3. P1 — Reconcile online orders and processing orders into one documented lifecycle without prematurely merging models.
4. P1 — Add a customer directory and then design customer history relationships after auditing current records.
5. P2 — Improve stock movements, vendor purchasing and installation scheduling.
6. P2 — Standardize responsive states, error handling, reporting and PWA installability/offline behavior.

## Data and migration guardrails

- No destructive migration in the skeleton phase.
- Preserve current IDs and relationships.
- Inspect migration history and a database backup/staging copy before schema changes.
- Do not merge `Product` and `ShopProduct` until usages and records are mapped.
- Review monetary `Float` fields before a planned migration to decimal currency types.
- Do not mark features complete until they have been run and tested in the app environment.

## First page: Customers

Route: `/customers`

Version 1 uses existing Lead records so that the page can ship without adding a table or changing the database. It is a read-only list with links to the existing lead detail page. This is intentionally not a canonical customer master; customer records, order records and lead records need a future relationship audit before they can be unified safely.
