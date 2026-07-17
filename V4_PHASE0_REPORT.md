# Driven2Develop V4 — Phase 0 Report (Evidence & Preservation)

Produced per V4 Master Prompt §1.1 and §17 Phase 0. This is read-only inspection
output only — no redesign, no page rebuilds, no auth changes have been made on
this branch. Everything below is evidence gathered from the actual repository,
not assumption.

## 1. Version-history report

| Ref | Commit | What it is |
|---|---|---|
| `v2-production-backup` (tag) | `3f70a99` | Website V2 — the original pre-rebuild application. This repo's very first commit; there is no earlier state. **Confirmed untouched.** |
| `main` (production branch) | `93eb768` | Currently **byte-identical to V2** (`git diff v2-production-backup main` is empty) — restored via 3 ordinary revert commits in an earlier session, no force-push, no history rewritten. |
| `backup/main-postgres-change` (branch) | `67e3e4f` | Preserves the state `main` was in before the V2 restoration — includes the full V3 merge plus a correct Postgres-provider commit (`3669cf9`) plus one broken commit that had a stray invalid character in `prisma/schema.prisma` (root cause of a prior "0/2 checks failing" incident, already diagnosed and fixed on the V3 branch). |
| `claude/driven2develop-v2` (branch) | `021428b` | Website V3 — full master-prompt rebuild (brand/brightness redesign, AI homeowner adapter, evidence-linked scorecards, admin approval/suspension system) plus a full Postgres-production-readiness pass (shared adapter selection, self-validating schema-switch script, 79 automated tests, full env-var checklist). This is the most-audited, most-tested state in the repository. |
| `claude/driven2develop-v4` (branch) | `021428b` | Created this session as an initial placeholder for V4 work; superseded by the properly-named branch below. Left in place per "do not delete prior branches." |
| **`claude/driven2develop-v4-premium-rebuild`** (branch, **current**) | `021428b` | **Created just now per this document's §1.1.6**, branched from V3 (`claude/driven2develop-v2`) rather than from V2, because V3 is "the last known stable production-*ready*" application state — it carries the working, tested auth/admin system this document's §9.2 requires me to preserve and port forward. Zero content changes yet. |

**Confirmed: production (the live `driven-2-develop.com` domain) is not reliably known to match any of the above.** In a prior session I read your screen recording's Network tab and found the live `/login` response contains V3-only code (a `d2d-theme` script, V3's exact login copy) — meaning production was, at time of recording, serving a stale build from somewhere between the V3 merge and the broken commit, not `main` (V2) and not this repaired V3 branch. I have no Vercel access and could not pin the exact deployed commit (webpack content-hash comparison across separately-built commits was inconclusive). **This remains the single most important open risk carried into V4**: whatever ships from this rebuild must be paired with you confirming in the Vercel dashboard which commit is actually promoted to Production before/after this work lands.

## 2. Authentication forensic report

Per §1.1.4 and §9.1, the full chain was compared across V2 (=`main`=`3f70a99`, the earliest and only pre-V3 state) and V3 (this branch).

**V2's authentication (`3f70a99`):** email/password signup and login, bcrypt password hashing, a custom JWT session (`jose`, `HS256`, 30-day expiry) in an httpOnly cookie, `secure` flag tied to `NODE_ENV`, `sameSite: lax`. Roles: `REP` / `MANAGER` only, no approval workflow — every signup is immediately active and logged in. Middleware protects a fixed list of route prefixes and redirects unauthenticated users to `/login`; a separate check gates `/manager/*` to the `MANAGER` role.

**V3 (current branch) adds, on top of the identical V2 foundation:**
- `ADMIN` role and a `PENDING` / `ACTIVE` / `SUSPENDED` account-status field.
- Signup creates `PENDING` accounts (no session issued) except the very first account on a fresh database, which is auto-approved as `ADMIN` (bootstrap, so there's always someone able to approve others).
- Login rejects `PENDING` (403, "waiting on admin approval") and `SUSPENDED` (403, "contact an admin") with distinct messages; only `ACTIVE` accounts get a session.
- **`getCurrentUser()` re-checks live account status on every request**, not just at login — a suspended account's existing session cookie stops working immediately, verified directly (issued a session, suspended the account mid-session, confirmed the same cookie then returns 401).
- `/admin/*` protected the same way `/manager/*` already was.
- Admin API (`/api/admin/users`, `/api/admin/users/[id]`) can approve/suspend/reactivate/change-role, with **guards preventing an admin from suspending or demoting their own account** (self-lockout prevention).
- The profile-settings endpoint (`/api/settings`) only ever accepts `role: "REP"|"MANAGER"` from the client — an `ADMIN` value is silently dropped, so **self-promotion to admin through that endpoint is not possible**. Verified with a real request: attempted self-promotion, role unchanged afterward.

**Verified this session, real HTTP requests against a real, freshly migrated + seeded database** (not mocks): signup→pending→blocked login, admin locate+approve, approved login (200, real session cookie), session reuse across requests, non-admin denied `/admin` page (redirect) and API (403), suspend→existing session immediately invalidated, reactivate→same cookie works again, role change, self-promotion blocked, admin self-lockout blocked (both status and role), logout clears the cookie (`Set-Cookie` with past expiry).

**Gap relative to this document's §9.4:** authorization today is enforced correctly but is **not centralized** — every route independently calls `getCurrentUser()` and checks `user.role`/`status` inline rather than through shared `requireUser()` / `requireManager()` / `requireAdmin()` helpers. This is not a security defect (I re-audited every route this session; all are correctly scoped, no IDOR/mass-assignment findings), but it's real technical debt worth addressing in Phase 2 exactly as this document asks.

## 3. Current route inventory (V3, as it exists today)

45 pages, 12 API routes. Grouped:
- **Marketing (13):** `/`, `/about`, `/contact`, `/customers`, `/for-companies`, `/for-managers`, `/for-reps`, `/help`, `/how-it-works`, `/pricing`, `/privacy`, `/product`, `/security`, `/terms`
- **Auth/onboarding (11):** `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email`, `/onboarding/{role,industry,experience,goal,mic-check,self-assessment,first-scenario}`
- **Rep app (13):** `/dashboard`, `/practice`, `/practice/session`, `/scenarios`, `/scenarios/[id]`, `/upload`, `/upload/processing/[id]`, `/history`, `/skills`, `/achievements`, `/leaderboard`, `/coach`, `/objections`, `/objections/[id]`, `/notifications`, `/report/[id]`, `/report/[id]/transcript`
- **Manager (7):** `/manager`, `/manager/team`, `/manager/team/[repId]`, `/manager/assignments`, `/manager/assignments/new`, `/manager/analytics`, `/manager/compliance`, `/manager/playbook`, `/manager/copilot`
- **Admin (2):** `/admin`, `/admin/users`
- **Settings (5):** `/settings/{profile,appearance,microphone,notifications,privacy}`
- **API (12):** `auth/{login,logout,signup,me}`, `admin/users(/[id])`, `assignments(/[id])`, `scenarios`, `sessions(/[id])`, `homeowner/respond`, `settings`

None of the ~60 new routes this document's §5.1 specifies (`/platform/*`, `/solutions/*`, `/intelligence/*`, `/industries/*`, `/resources/*`) exist yet — they are entirely new information architecture, not a rename of existing pages.

## 4. Feature-status registry (§7, honest rollup — not line-by-line)

Using this document's own labels (Available now / Beta / Pilot / Planned / Research-roadmap):

| §7 area | Status today | Evidence |
|---|---|---|
| Text roleplay, difficulty/personality selection, pause/resume, restart-a-specific-objection | **Available now** | `components/PracticeRecorder.tsx`, `lib/ai/homeowner.ts` |
| Voice roleplay (browser speech-to-text) | **Available now**, browser-dependent | Web Speech API in `PracticeRecorder.tsx`; honest capability-detection + upload fallback already in place |
| Reactive homeowner (trust/irritation state machine reacting to what the rep says) | **Available now**, rule-based | `lib/ai/homeowner.ts` — real deterministic logic, not fabricated |
| Live conversational AI homeowner (LLM-generated dialogue) | **Beta**, opt-in via `OPENAI_API_KEY` | Same file, `OpenAIHomeownerAdapter` — falls back honestly to rule-based if unset/failing |
| Uploaded-conversation practice + transcription | **Available now** (acoustic-only) / **Beta** (transcript metrics, needs `OPENAI_API_KEY`) | `lib/stt.ts` |
| Scripted-company-script mode, manager-created scenarios, real-conversation-derived scenarios | **Not started** — no schema/UI for org-authored scenarios | — |
| Filler words, pace, talk/listen ratio, objection recognition/handling, closing strength, tone, confidence, clarity | **Available now**, computed from real transcript + audio signal | `lib/analysis.ts` |
| Evidence-linked scoring (exact transcript excerpt + offset per finding) | **Available now** | `lib/analysis.ts:buildEvidence()`, wired into the report + transcript pages |
| Company-specific score weighting, compliance-claim flags | **Not started** | — |
| Post-session coaching tips + "Practice This Moment" (skill-scoped retry) | **Available now** | `generateTips()`, report page |
| Daily/weekly plan, reinforcement scheduling, certification | **Not started** | — |
| Rep dashboard (drills, weak points, history, skill map, achievements, streak, leaderboard) | **Available now**, real per-session data | `app/(app)/{dashboard,history,skills,achievements,leaderboard}` |
| Manager dashboard (needs-attention, team roster, assignments, compliance flags, playbook, rule-based copilot) | **Available now**, rule-based (not LLM) copilot | `app/(app)/manager/*` |
| Admin approval/suspension/role system | **Available now** | Section 2 above |
| Multi-team hierarchy / offices / regions / SSO / SCIM / API / CRM integrations | **Not started / Planned** | — |
| Recruiting/candidate roleplay, readiness scoring | **Not started** | — |
| Gamification (streaks, achievements, leaderboards) | **Available now**, basic form | `lib/gamification` patterns in dashboard/achievements pages |
| Objection library (searchable, categorized, seeded) | **Available now**, static seed content | `app/(app)/objections`, `prisma/seed.ts` |
| Geographic/market intelligence, company learning network | **Not started — Research/roadmap only**, as this document itself requires | — |

**No customer logos, testimonials, or usage numbers exist anywhere in the current codebase** — the one fabricated-testimonial page found in an earlier session was already rewritten to honest, clearly-labeled illustrative content. This satisfies §1.2 as a starting baseline; V4 must not regress it.

## 5. Proposed V4 sitemap (from §5, cross-referenced against what exists)

I will not fabricate content for ~60 new routes in this Phase 0 report. What I can confirm now: the document's IA (Platform / Solutions / How It Works / Intelligence / Industries / Resources / Company / Pricing) maps cleanly onto the *business logic* already in the codebase (scenarios, scoring, coaching, manager tools, admin) but requires substantially new marketing-layer routes and a mega-menu nav component that doesn't exist yet (current nav is `components/marketing/MarketingNav.tsx`, a simple link list). Per §7 of the Execution Phases, full sitemap content construction belongs in **Phase 1**, after this Phase 0 report is reviewed — not before.

## 6. Risk report

1. **Production/commit uncertainty (highest risk, carried over):** unresolved without your Vercel access — see §1 above.
2. **Scope size:** ~60 new routes + full design system + motion system + Storybook + Playwright + visual regression is a multi-week effort at professional-studio scale. Recommend confirming phased delivery (this document's own Phase 3 gate — prototype 5 sections, evaluate, *then* propagate) rather than building all pages against one unreviewed visual direction.
3. **Tooling additions requested** (GSAP, Rive, Spline, Storybook, Chromatic, Playwright, Axe) are all net-new dependencies with real license/maintenance cost — none currently in `package.json`. I'll add them incrementally, justified per §12, not all at once.
4. **Auth centralization gap** (Section 2 above) should be closed in Phase 2 before layering new UI on top, per this document's own sequencing.
5. **Local Postgres verification remains impossible in this environment** (no local Postgres server, no cloud credentials) — Phase 2's "verify production config" item can only be evidence-gathered by you against the real Vercel/Postgres dashboard.

## 7. Branch safety confirmation

- `v2-production-backup` → `3f70a99`, unmoved.
- `main` → `93eb768`, byte-identical to V2, untouched this session.
- `backup/main-postgres-change` → `67e3e4f`, preserved.
- `claude/driven2develop-v2` (V3) → `021428b`, untouched, fully tested.
- `claude/driven2develop-v4-premium-rebuild` (this branch) → `021428b` (identical to V3 so far) + this report file. No redesign work performed.
- No force-push, no history rewrite, no deleted branches/tags, no merge to `main` attempted.

**Awaiting your review of this Phase 0 report before proceeding to Phase 1 (sitemap/data-model/design-tokens/component-system architecture) or Phase 2 (auth centralization), per this document's own instruction to stop and report before making broad changes.**
