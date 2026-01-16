# Deployment Guide for Expense Tracker

This guide outlines the steps to deploy your Expense Tracker application to Vercel with a PostgreSQL database.

## Prerequisites

- A GitHub account.
- A Vercel account (log in with GitHub).
- A PostgreSQL database provider (we recommend Neon, Supabase, or Vercel Postgres).

## Step 1: Set up a PostgreSQL Database

Since the application uses Prisma with PostgreSQL, you need a hosted database.

### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard.
2. Navigate to "Storage" and create a new Postgres database.
3. Link it to your Vercel project (you'll do this during deployment or in project settings).
4. Copy the environment variables (specifically `POSTGRES_PRISMA_URL` or `DATABASE_URL`).

### Option B: Neon / Supabase
1. Create a free project on [Neon](https://neon.tech/) or [Supabase](https://supabase.com/).
2. Get the **Connection String** (it starts with `postgres://...` or `postgresql://...`).

## Step 2: Configure Environment Variables

You need to set the following environment variables in your Vercel Project Settings > Environment Variables:

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | Connection string for your Postgres DB | `postgres://user:pass@host:port/db` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | From your Clerk Dashboard | `pk_test_...` |
| `CLERK_SECRET_KEY` | From your Clerk Dashboard | `sk_test_...` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | User sign-in path | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | User sign-up path | `/sign-up` |

## Step 3: Deploy to Vercel

1. Push your latest code to a GitHub repository.
2. Go to Vercel and click "Add New..." > "Project".
3. Import your GitHub repository.
4. **Build and Output Settings**: Standard Next.js settings should work automatically.
5. **Environment Variables**: Add the variables listed in Step 2.
6. Click **Deploy**.

## Step 4: Database Migration

During the build process, the `postinstall` script (`prisma generate`) will run. However, to apply the schema to your live database, you might need to run a migration manually locally or via Vercel's console if you haven't pushed the schema yet.

**Recommended:** carefully run this locally **AFTER** updating your local `.env` to point to the **PROD** database (just for one command), or set up a separate prod env override.

```bash
npx prisma db push
```

*Note: This syncs your strictly typed schema with the database schema.*

## Troubleshooting

- **Error: `P1001: Can't reach database server`**: Check if your IP is allowed in your database settings or if the `DATABASE_URL` is correct.
- **Build Fails**: Check the build logs in Vercel. Ensure all environment variables are set correctly *before* deploying.
