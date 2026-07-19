# Driving2Develop

Driving2Develop is an AI-flavored sales training platform for door-to-door reps. Reps
run live, mic-on roleplays against a scripted homeowner personality, get a
real scorecard on their pace/tone/filler-words/closing, and drill their
weakest skill. Managers get a team roster, a "needs attention" panel, and can
assign drills.

The app spans ~57 distinct routes across a marketing site, auth, a
step-by-step onboarding flow, the rep app, and a manager cockpit — all built
on one shared, accessible design system (`components/ui/`, Radix UI +
framer-motion, WCAG-AA-minded contrast, keyboard focus rings, reduced-motion
support). Highlights: a mic-check onboarding flow split into real routes, one
industry (Solar) with 6 roleplay scenarios across 3 difficulty levels and 6
homeowner personalities, real-time live practice, session scorecards +
coaching tips, retry-from-weakness, session history, a skill tree,
achievements, a leaderboard, a rule-based AI coach, a seeded objection
library, notifications, and a manager cockpit with a team roster, per-rep
detail, assignments, compliance flags, analytics, a company playbook, and a
rule-based team copilot.

### Design system

All screens share one component library under `components/ui/` (Button, Card,
Badge, Input/Select/Textarea/Checkbox/Radio, Dialog, Toast, Table, Tabs,
Tooltip, Dropdown, Skeleton, EmptyState, ProgressRing, StatCard, Avatar, and a
⌘K command-palette search). Radix UI primitives provide focus-trapping,
keyboard nav, and ARIA; framer-motion drives page transitions, staggered
reveals, modal/toast enter-exit, and micro-interactions (all gated behind
`prefers-reduced-motion`). A skip-to-content link and a global gold
`:focus-visible` ring make the whole app keyboard- and screen-reader-friendly.

## Scope & honesty about what's real vs. simulated

- **Live practice transcript is real.** It uses the browser's native
  `SpeechRecognition` API (Chrome/Edge) - no API key required. Pace, filler
  words, keyword adherence, objection handling, closing strength, tone, and
  volume variation are all computed from that real transcript + real audio
  signal (Web Audio `AnalyserNode`), using the scoring logic in
  `lib/analysis.ts`. Nothing here is a random number.
- **The homeowner is a scripted practice partner**, not a live conversational
  AI voice model. Its lines are pre-written per scenario and read aloud via
  the browser's free `speechSynthesis` API. The UI says this explicitly.
- **Uploaded recordings**: duration, pause detection, and volume come from
  real signal processing (`AudioContext.decodeAudioData` + RMS energy
  envelopes) - genuinely real, not faked. However, there is no bundled
  speech-to-text engine, so transcript-dependent metrics (filler words,
  keyword adherence, exact transcript) are **honestly marked as unavailable**
  in the UI unless you add an `OPENAI_API_KEY`, in which case
  `lib/stt.ts` calls Whisper and the upload pipeline upgrades automatically.
  We never silently fake these numbers.
- **Two deliberately non-functional bits, by design**: a locked "Humor Mode"
  toggle (explicitly future-scoped) and non-Solar industry tabs marked
  "Coming soon." Every other button/link is fully wired.

## Local setup

Requires Node 18+.

```bash
npm install
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

Then open http://localhost:3000.

> **Why `migrate deploy` instead of `migrate dev`?** This project uses
> Prisma's engine-less "client" generator with driver adapters (`@prisma/adapter-better-sqlite3`
> for SQLite locally) so that **no native Rust engine binary needs to be
> downloaded** at install or build time - handy behind restrictive network
> policies (CI, sandboxed builds) and it keeps cold starts fast in
> production. The tradeoff: as of this Prisma version, `prisma migrate dev`'s
> shadow-database bootstrapping has a bug with SQLite driver adapters on a
> brand-new database. The migration is already committed under
> `prisma/migrations/`, so `migrate deploy` (the same command you'd use in
> CI/production) applies it cleanly with no workaround needed. If you change
> `prisma/schema.prisma` yourself, use `npx prisma db push` to sync your local
> `dev.db` while iterating, then hand-write the resulting migration SQL into
> a new folder under `prisma/migrations/` and mark it applied with
> `npx prisma migrate resolve --applied <migration_name>`.

### Seeded login credentials

| Role    | Email                  | Password      |
| ------- | ---------------------- | ------------- |
| Manager | manager@driving2develop.dev  | password123   |
| Rep     | rep1@driving2develop.dev     | password123   |
| Rep     | rep2@driving2develop.dev     | password123   |
| Rep     | rep3@driving2develop.dev     | password123   |
| Rep     | rep4@driving2develop.dev     | password123   |
| Rep     | rep5@driving2develop.dev     | password123   |

The seed also creates 6 Solar scenarios, 4-8 historical practice sessions per
rep (mixed live/upload, spread over ~30 days, trending upward), a few
manager-to-rep assignments, a 10-entry objection library, and an 8-entry
company playbook - so nothing is empty on first login.

## Access control (admin approval, roles, suspension)

Every account has a **role** (`REP`, `MANAGER`, or `ADMIN`) and a **status**
(`PENDING`, `ACTIVE`, or `SUSPENDED`):

- **New signups require admin approval.** Anyone who signs up through
  `/signup` is created with status `PENDING` and cannot sign in until an
  admin approves them - the signup page tells them this explicitly instead
  of silently failing.
- **The very first account on a brand-new database is auto-approved as an
  admin** (there's nobody else yet to approve them). Every signup after that
  goes through the normal approval queue. The seed script also creates a
  ready-to-use `admin@driven2develop.dev` account (see table above).
- **Admins manage everyone** from **Users & Access** (`/admin/users`, linked
  from the sidebar for admin accounts only): approve a pending signup, grant
  or change a role, and suspend/reactivate an account - all in one screen.
  Suspending immediately blocks that account from signing in and from every
  protected page/API (enforced in `getCurrentUser()`, so no per-route changes
  were needed). An admin cannot suspend or demote their own account (a
  guard against accidental lockout).
- **On an existing production deployment without a seeded admin**, promote
  an existing account with:
  ```bash
  npm run make-admin -- someone@company.com
  ```
- `/admin/*` is protected the same way as `/manager/*`: middleware redirects
  anyone without the right role away before the page ever renders.

## Deploying to production (Vercel + Postgres)

SQLite's `dev.db` file won't persist on Vercel's serverless filesystem, so
production needs a real Postgres database.

**1. Provision Postgres.** Easiest options:
   - Vercel Postgres: `vercel postgres create` (from inside your linked
     project), or
   - Neon (free tier): sign up at https://neon.tech, create a project, and
     copy its connection string.

   Either way you'll end up with a connection string shaped like:
   ```
   postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
   ```

**2. Switch the schema's datasource provider.** Run:
   ```bash
   npm run db:use-postgres
   ```
   This edits `prisma/schema.prisma` and immediately runs `prisma validate`
   - if the result doesn't validate, the file is restored automatically and
   nothing broken is left on disk (this replaces the old manual-edit
   instructions after a hand-edit once reached `main` with a syntax error
   that broke every build). Equivalent manual edit, if you prefer:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
   to:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
   That's the one-line change referenced throughout this repo. `lib/db.ts`,
   `prisma/seed.ts`, and `prisma.config.ts` all pick the right adapter
   (`@prisma/adapter-pg` vs. `@prisma/adapter-better-sqlite3`) automatically
   from `DATABASE_URL` via the shared helper in `lib/prisma-adapter.ts` - no
   other file needs a matching manual edit.

   > **If you edit this by hand instead of via `npm run db:use-postgres`,
   > run `npm run prisma:validate` before committing.** A hand-edit that
   > isn't validated before committing is exactly how a single bad keystroke
   > once turned into a broken build on `main` - `prisma validate` catches a
   > malformed schema in under a second, with no database connection
   > required.

**3. Regenerate the client for the new provider:**
   ```bash
   npx prisma generate
   ```

**4. Deploy:**
   ```bash
   npm i -g vercel
   vercel login
   ```
   From the project directory:
   ```bash
   vercel link
   vercel env add DATABASE_URL production
   vercel env add JWT_SECRET production
   ```
   (paste your Postgres connection string and a long random secret when
   prompted - `openssl rand -base64 32` works well for the latter)

**5. Apply migrations to the production database**, then deploy:
   ```bash
   npx prisma migrate deploy
   vercel --prod
   ```
   (`migrate deploy` reads `DATABASE_URL` from your local `.env` - point it at
   the same production connection string temporarily, or run it from a shell
   where that env var is exported, before deploying.)

**6. (Optional) seed production** with `npx prisma db seed` if you want the
   demo accounts/scenarios there too - just make sure `DATABASE_URL` points at
   production when you run it.

## Connecting a GoDaddy domain

1. In your Vercel project, go to **Settings -> Domains** and add your domain
   (e.g. `driving2develop.yourcompany.com` or the bare `yourcompany.com`).
2. In GoDaddy, open **My Products -> DNS -> Manage** for that domain.
3. Add these records (default TTL is fine):
   - **A record**, host `@`, points to `76.76.21.21`
   - **CNAME record**, host `www`, points to `cname.vercel-dns.com`
4. Save. DNS propagation can take up to 48 hours but is often live within
   minutes.
5. Back in Vercel's Domains settings, wait for the domain to show a green
   **"Valid Configuration"** badge - that confirms DNS has propagated and SSL
   has been issued.

## Tech stack

Next.js 14 (App Router) - TypeScript - Tailwind CSS - Prisma ORM (SQLite dev /
Postgres prod via driver adapters) - custom JWT auth (`jose` + `bcryptjs`) -
recharts - lucide-react - Inter (self-hosted via `next/font/local`).

## Scripts

```bash
npm run dev      # local dev server
npm run build    # production build (also runs prisma generate via postinstall)
npm run start    # run the production build
```
