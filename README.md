# Pato Sacco — Management Information System

Pato SACCO Management Information System (DBT 1304 IS Project): a web application
with a USSD alternative for SACCO management — members, savings, loans, repayments,
withdrawals, reports, audit log, backups, and USSD/SMS reminders.

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS 4. No backend: the prototype stores
its data in the browser (localStorage), seeded with demo data on first load. USSD
(`*384*123#`) and SMS run through a simulator — there is no live Africa's Talking
connection and no live Supabase database in this prototype.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. Sign in with one of the demo logins below.

If `npm install` fails with a JavaScript heap out-of-memory error, raise the heap
first:

```bash
NODE_OPTIONS=--max-old-space-size=4096 npm install
```

## Demo logins

| Role | Username | Password |
| --- | --- | --- |
| Sacco Member (Mary Wanjiru) | ER-0001 | member123 |
| Credit Officer (David Otieno) | officer | officer123 |
| Sacco Administrator (Sarah Njeri) | admin | admin123 |
| System Administrator (Peter Kamau) | sysadmin | sysadmin123 |

Sessions last 8 hours. Demo passwords are stored in plain text in the prototype
store — they are not hashed, and this build must not be used with real member data.

## How it is organised

- `lib/store.ts` — the data layer: seed data, business rules (loan eligibility,
  amortisation, repayment schedule, withdrawal limit), sessions and audit log.
- `types/` — TypeScript interfaces for users, members, loans, savings,
  transactions, withdrawals and policy.
- `services/` — thin wrappers over the store: auth, loans, members, savings,
  withdrawals, transactions, users, policy, notifications.
- `hooks/` — `usePato` (shared database state), `useAuth` (session + role guard),
  `useLoans`, `useMembers`.
- `components/` — forms, tables, charts (plain SVG, no chart library), layout and
  the USSD simulator / SMS panel.
- `app/` — routes by role: `sacco-member`, `credit-officer`, `sacco-admin`,
  `system-admin`, plus the public landing page and `(auth)/login`.

## Credit rules implemented

- Loan eligibility = deposits x 3 minus outstanding loans, capped at the loan
  product ceiling; no new loan while in arrears. Eligibility is re-checked at
  approval.
- Monthly repayment uses the standard amortisation formula; the repayment schedule
  is reducing-balance, with the final balance exactly KES 0.
- Withdrawal limit = 50% of savings, capped at KES 50,000.
- Amounts are stored as integer cents. The audit log is append-only. Backups export
  the full database as JSON.

## Build

```bash
npm run build
npm run start
```
