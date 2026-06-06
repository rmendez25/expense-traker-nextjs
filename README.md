# Finance Tracker

A full-stack personal finance tracking application built with Next.js. Log income and expenses, organize transactions into categories, visualize spending with charts, and generate monthly/annual reports.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Database | [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) |
| Auth | JWT + bcryptjs |
| Charts | [Recharts](https://recharts.org/) |
| HTTP Client | [Axios](https://axios-http.com/) |
| PWA | Service Worker + Web Manifest |

## Features

- **Dashboard** — Summary cards (balance, monthly income/expenses), expense pie chart, recent transactions
- **Transactions** — Full CRUD with pagination, sorting, and filtering (search, type, category, date range)
- **Categories** — Manage income and expense categories side-by-side
- **Reports** — Monthly breakdown by year and annual multi-year comparison with category breakdown
- **Authentication** — JWT-based registration, login, profile updates
- **PWA** — Installable as a progressive web app

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MongoDB](https://www.mongodb.com/) instance (local or [Atlas](https://www.mongodb.com/atlas))

### Setup

```bash
# Install dependencies
npm install

# Create environment file
# Add your MongoDB URI and a strong JWT secret
# MONGODB_URI=mongodb://localhost:27017/finance-tracker
# JWT_SECRET=your-random-secret-here
# JWT_EXPIRES_IN=45d

# Seed default categories (recommended)
npx tsx lib/seed.ts

# Seed test data (optional, for demo)
npm run seed

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Test Account

After running `npm run seed`:

| Field | Value |
|-------|-------|
| Email | `test@mail.com` |
| Password | `password1` |

## Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run seed` | Seed test user + sample transactions |
| `npx tsx lib/seed.ts` | Seed default categories only |

## Environment Variables

| Variable | Description |
|----------|------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JSON Web Tokens |
| `JWT_EXPIRES_IN` | Token expiration duration (e.g., `45d`) |

## Project Structure

```
app/
  (dashboard)/     # Protected pages (dashboard, transactions, categories, reports, profile)
  api/              # Route handlers (REST API)
  login/            # Login page
  register/         # Registration page
components/         # Reusable UI components
context/            # AuthContext (global auth state)
lib/                # Database connection, models, utilities, seed data
services/           # Axios client with JWT interceptor
public/             # Static assets, manifest, service worker
```

## API Endpoints

All endpoints require JWT authentication except `/api/health`, `/api/auth/register`, and `/api/auth/login`.

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/health` | GET | Health check |
| `/api/auth/register` | POST | Create account |
| `/api/auth/login` | POST | Authenticate |
| `/api/auth/me` | GET | Current user |
| `/api/auth/profile` | PUT | Update profile |
| `/api/transactions` | GET, POST | List / create transactions |
| `/api/transactions/:id` | GET, PUT, DELETE | Single transaction CRUD |
| `/api/categories` | GET, POST | List / create categories |
| `/api/categories/:id` | DELETE | Delete category |
| `/api/dashboard/summary` | GET | Dashboard aggregates |
| `/api/reports/monthly` | GET | Monthly breakdown by year |
| `/api/reports/annual` | GET | Annual report |
| `/api/reports/category-breakdown` | GET | Category spending breakdown |
