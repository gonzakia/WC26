# WC26 Predictions

WC26 Predictions is a learning-focused full-stack app for the 2026 FIFA World Cup.
Players join private groups, predict match scorelines, earn points for exact picks
or correct outcomes, and compete on a shared leaderboard.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Prisma
- SQLite for local development

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

- users sign in with an email
- if the email does not exist yet, the app creates a new user
- a session token is stored in an HTTP-only cookie
- session records live in the database

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
5. Create the local database with `npx prisma migrate dev --name init`.
6. Seed starter data with `npm run prisma:seed`.
7. Start the app with `npm run dev`.

If you changed the Prisma schema after already creating your database, run:

- `npx prisma migrate dev --name add_sessions`
- `npm run prisma:generate`

## Suggested next steps

1. Add passwordless email links or an OAuth provider.
2. Restrict admin result entry to group owners or admins.
3. Add validation and friendly form error states with `useActionState`.
4. Add profile editing so users can change display names.
5. Replace starter match data with official World Cup fixtures once the tournament list is available.
