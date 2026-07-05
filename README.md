# Companion — habit tracker with a growing pet (cloud version)

React web app backed by **Supabase** (real accounts + cloud-saved data that
works across devices, plus leaderboard and friends).

## Run it locally

1. Install Node.js 18+ (https://nodejs.org — the "LTS" version).
2. In a terminal in this folder:

   ```bash
   npm install
   npm run dev
   ```

3. Open the URL it prints (usually http://localhost:5173).

Your Supabase project URL and publishable key are already filled in at the top
of `src/supabase.js`.

## Put it online (free)

1. Push this folder to a GitHub repo (GitHub Desktop is the easy way).
2. Import it at https://vercel.com (framework preset: **Vite**) and Deploy.
   You get a public URL in ~2 minutes; future pushes auto-redeploy.

## Accounts & admin

- **Sign up** with email + password + a unique username + a unique pet name.
- Data saves to the cloud, so logging in on another device shows the same pets.
- **Admin console:** sign up (or log in) with `dev@companion.app` — that email
  shows the all-users dashboard instead of the normal app.

## Friends

Friends use a mutual-follow model (Supabase security only lets each user edit
their own row): send a request = you follow them; when they follow back you're
friends. Because it's a database, another person's request appears for you after
a refresh — tap the refresh icon on the Ranks screen (or reopen a tab).

## Notes

- If you left "Confirm email" ON in Supabase, new signups must click the email
  link before logging in. Turn it OFF (Authentication → Sign In / Providers →
  Email) for instant testing.
- Uniqueness: usernames are enforced by the database; pet names auto-adjust with
  a number if the one you pick is already taken.
- To change what's stored, the whole account lives in the `data` jsonb column of
  the `accounts` table — see `loadAllAccounts` / `saveAccountRow` in `src/App.jsx`.
