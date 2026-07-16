# Driven2Develop

Driven2Develop helps door-to-door teams practice realistic conversations,
understand exactly where trust is gained or lost, and turn every weakness
into the next drill. Reps run live, mic-on roleplays against a reactive
homeowner practice partner, get a real scorecard on their pace/tone/filler
words/closing, and jump straight into a targeted drill for their weakest
skill via **Practice This Moment**. Managers get a team roster, a "needs
attention" panel, and can assign drills.

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
- **The homeowner reacts to what you actually say, behind a swappable adapter**
  (`lib/ai/homeowner.ts`). By default it runs a deterministic rule-based
  adapter: trust/irritation move based on rapport language, questions asked,
  and pushiness detected in your live transcript, and the homeowner can end
  the conversation early if you push too hard. Add an `OPENAI_API_KEY` and it
  automatically upgrades to a real conversational model (OpenAI chat
  completions) for the same role, no code changes needed. The UI always
  discloses which mode is active - never claims a live AI voice when it isn't
  wired up. Lines are still read aloud via the browser's free
  `speechSynthesis` API.
- **Restart Objection** reopens an earlier stage/objection mid-session (the
  homeowner's conversational state rewinds) without discarding anything
  already recorded - audio, transcript, timing, and evidence all stay intact.
- **Practice This Moment** appears next to each coaching tip and the overall
  scorecard action; it launches a scenario matched to that specific weak
  skill, not just a generic "redo the scenario" link.
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
| Manager | manager@driven2develop.dev  | password123   |
| Rep     | rep1@driven2develop.dev     | password123   |
| Rep     | rep2@driven2develop.dev     | password123   |
| Rep     | rep3@driven2develop.dev     | password123   |
| Rep     | rep4@driven2develop.dev     | password123   |
| Rep     | rep5@driven2develop.dev     | password123   |

The seed also creates 6 Solar scenarios, 4-8 historical practice sessions per
rep (mixed live/upload, spread over ~30 days, trending upward), a few
manager-to-rep assignments, a 10-entry objection library, and an 8-entry
company playbook - so nothing is empty on first login.

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

**2. Switch the schema's datasource provider.** In `prisma/schema.prisma`,
   change:
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
   That's the one-line change referenced throughout this repo. `lib/db.ts`
   already picks `@prisma/adapter-pg` automatically whenever `DATABASE_URL`
   doesn't start with `file:`, so no other application code needs to change.
   Also update `prisma.config.ts`'s local `adapter()` if you want CLI commands
   (like `migrate deploy` from your own machine) to target Postgres too -
   swap `PrismaBetterSQLite3` for `PrismaPg` there using the same
   `DATABASE_URL`.

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
   (e.g. `driven2develop.yourcompany.com` or the bare `yourcompany.com`).
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
