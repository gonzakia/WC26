# WC26 Predictions

WC26 Predictions is a learning-focused full-stack app for the 2026 FIFA World Cup.
Players join private groups, predict match scorelines, earn points for exact picks
or correct outcomes, and compete on a shared leaderboard.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Prisma
- Resend for sign-in emails
- football-data.org for fixture/result sync
- Postgres for production, SQLite was used locally

This repo is scaffolded manually because the current environment does not have
Node.js installed, but the project structure is ready to install and run once
Node is available.

## MVP features

- Create or join a prediction group
- View upcoming World Cup matches
- Submit one prediction per match before kickoff
- Award 3 points for an exact score
- Award 1 point for the correct winner or draw
- Show a leaderboard for each group

## Current auth flow

The app now uses a simple custom session flow backed by Prisma:

- users request a one-time sign-in code with an email
- if Resend is configured, the code is emailed to them
- in local development without email credentials, the verification code is shown on the `/verify` page
- after code verification, the app creates a new user if needed
- a session token is stored in an HTTP-only cookie
- session records and login codes live in the database

## Match data sync

The app can sync World Cup fixtures and final results from football-data.org.
That means you do not have to seed every match or manually update scores for
each group.

- manual sync is available on `/admin/results`
- automatic sync is supported through `/api/cron/sync-world-cup`
- confirmed results automatically recalculate prediction points

## Data model

The initial Prisma schema includes:

- `User`
- `Group`
- `GroupMember`
- `Match`
- `Prediction`

## Local setup

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env`.
3. Install dependencies with `npm install`.
4. Generate Prisma client with `npm run prisma:generate`.
5. Point `DATABASE_URL` at a Postgres database.
6. Seed starter data with `npm run prisma:seed`.
7. Start the app with `npm run dev`.

Set these environment variables if you want production-style behavior:

- `RESEND_API_KEY`
- `EMAIL_FROM`
- `FOOTBALL_DATA_API_TOKEN`
- `WORLD_CUP_SEASON` defaults to `2026`
- `CRON_SECRET`
- `DIRECT_URL` for Prisma schema commands

If you change the Prisma schema after already creating your database, run:

- `prisma db push`
- `npm run prisma:generate`

## Suggested deployment setup

1. Configure Resend and verify a sending domain or use the Resend test sender for development.
2. Add your football-data.org API token.
3. Protect `/api/cron/sync-world-cup` with `CRON_SECRET`.
4. If you deploy on Vercel Hobby, the included `vercel.json` schedules `/api/cron/sync-world-cup` once per day.
5. If you deploy somewhere else, point your scheduler at that same route instead.

## Deployment note

The production database should be Postgres.

Before launching this to friends and family, the recommended next move is:

1. Keep the Neon Postgres integration connected to the project.
2. Add Neon’s direct connection string as `DIRECT_URL`.
3. Deploy the app to Vercel with the production environment variables set.
4. Let the `vercel-build` script run `prisma db push` so the tables are created.

The repo already includes a `vercel-build` script:

- `npm run vercel-build`

That uses:

- `prisma db push`
- `prisma generate`
- `next build`

## Suggested next steps

1. Restrict data sync and manual overrides to app admins or group owners.
2. Add validation and friendly form error states with `useActionState`.
3. Add profile editing so users can change display names.
4. Add a sync history table with provider responses and failure logs.
5. Add richer result handling for extra time and penalty shootouts.
