/**
 * Design museum registry - the single source of truth for every recovered
 * V4 design version. Built from an actual evidence-first git archaeology
 * pass (git log --follow per file, git show per commit, git fsck for
 * dangling objects, full reflog review) on 2026-07-17, not assumption.
 *
 * git fsck --full --dangling --unreachable found zero orphaned commits -
 * every commit that ever existed is still reachable. There are no stashes.
 * All V4 design work lives on one branch (claude/driven2develop-v4-premium-rebuild)
 * as a linear commit sequence. Most components therefore have exactly one
 * or two real recovered versions, not several - this registry reflects that
 * honestly rather than padding it out.
 */

export type RecoveryType =
  | "exact-historical-recovery"
  | "faithful-reconstruction"
  | "partial-recovery"
  | "screenshot-guided-reconstruction"
  | "unrecoverable";

export const RECOVERY_LABEL: Record<RecoveryType, string> = {
  "exact-historical-recovery": "Exact historical recovery",
  "faithful-reconstruction": "Faithful reconstruction from recoverable source",
  "partial-recovery": "Partial recovery",
  "screenshot-guided-reconstruction": "Screenshot-guided reconstruction",
  unrecoverable: "Unrecoverable",
};

export type DeviceSupport = "desktop-only" | "responsive";

export interface MuseumVersion {
  id: string;
  label: string;
  sequence: number;
  branch: string;
  commit: string;
  commitMessage: string;
  originalPath: string;
  recoveryType: RecoveryType;
  deviceSupport: DeviceSupport;
  hasAnimation: boolean;
  knownIssues: string[];
  description: string;
  /** Key into the componentMap in MuseumRenderer.tsx. Null for unrecoverable entries. */
  componentKey: string | null;
}

export interface MuseumCategory {
  slug: string;
  group: "Public Site" | "Application" | "Visual Systems";
  title: string;
  description: string;
  versions: MuseumVersion[];
}

export const CATEGORIES: MuseumCategory[] = [
  {
    slug: "navigation",
    group: "Public Site",
    title: "Navigation",
    description: "The sticky header and mega menu used across every V4 page.",
    versions: [
      {
        id: "nav-v1",
        label: "Nav V1 — Hand-written mega menu",
        sequence: 1,
        branch: "claude/driven2develop-v4-premium-rebuild",
        commit: "568518a",
        commitMessage: "V4 Phase 3: design prototype (5 screens, Graphite Precision palette)",
        originalPath: "components/v4/V4Nav.tsx",
        recoveryType: "exact-historical-recovery",
        deviceSupport: "responsive",
        hasAnimation: false,
        knownIssues: ["Mobile hamburger and desktop nav had mismatched breakpoints in the very first commit of this file (fixed same-session before this snapshot)."],
        description: "The original Phase 3 mega menu: a hand-written 3-column PLATFORM_COLUMNS list (Simulation / Coaching / For Teams), no status badges, no scroll cap on the dropdown.",
        componentKey: "nav-v1",
      },
      {
        id: "nav-v2",
        label: "Nav V2 — Site-map-driven mega menu",
        sequence: 2,
        branch: "claude/driven2develop-v4-premium-rebuild",
        commit: "3537a8c",
        commitMessage: "V4 Phase 1: finalize design system (tokens, primitives, IA, nav)",
        originalPath: "components/v4/V4Nav.tsx",
        recoveryType: "exact-historical-recovery",
        deviceSupport: "responsive",
        hasAnimation: false,
        knownIssues: ["No open/close transition yet (added in V3).", "No focus management on open (added in V3)."],
        description: "Rebuilt to read from lib/v4/site-map.ts: 6 real categories, per-item status badges (Available now / Planned / Research), scrollable dropdown, '+N more' overflow indicator.",
        componentKey: "nav-v2",
      },
      {
        id: "nav-v3",
        label: "Nav V3 — Current (animated + keyboard-accessible)",
        sequence: 3,
        branch: "claude/driven2develop-v4-premium-rebuild",
        commit: "26c6371",
        commitMessage: "V4 quality pass: real Lighthouse audit, a11y fixes, keyboard nav",
        originalPath: "components/v4/V4Nav.tsx",
        recoveryType: "exact-historical-recovery",
        deviceSupport: "responsive",
        hasAnimation: true,
        knownIssues: [],
        description: "Adds an open/close motion transition, hover states on every item, and keyboard focus management (focus moves into the menu on open, returns to the trigger on Escape).",
        componentKey: "live-nav",
      },
    ],
  },
  {
    slug: "hero",
    group: "Public Site",
    title: "Homepage Hero",
    description: "The first section of the homepage.",
    versions: [
      {
        id: "hero-v1",
        label: "Hero V1 — Plain metrics list",
        sequence: 1,
        branch: "claude/driven2develop-v4-premium-rebuild",
        commit: "55718d6",
        commitMessage: "V4 Phase 2: five flagship pages on the finalized design system",
        originalPath: "components/v4/V4Hero.tsx",
        recoveryType: "exact-historical-recovery",
        deviceSupport: "responsive",
        hasAnimation: true,
        knownIssues: [],
        description: "The demo panel shows four plain CountUpMetric stats (Pace, Filler Words, Objection Handling, Trust) with no gauge visualization.",
        componentKey: "hero-v1",
      },
      {
        id: "hero-v2",
        label: "Hero V2 — Current (trust/irritation arc gauge)",
        sequence: 2,
        branch: "claude/driven2develop-v4-premium-rebuild",
        commit: "65324c4",
        commitMessage: "V4 design polish: signature motif + systematic motion pass",
        originalPath: "components/v4/V4Hero.tsx",
        recoveryType: "exact-historical-recovery",
        deviceSupport: "responsive",
        hasAnimation: true,
        knownIssues: [],
        description: "Trust and Irritation replaced with the signature dual-arc gauge (V4TrustGauge); Filler Words dropped, Pace and Objection Handling remain as plain stats beside the gauge.",
        componentKey: "live-hero",
      },
    ],
  },
  {
    slug: "platform-overview",
    group: "Public Site",
    title: "Platform Overview",
    description: "The capability-breadth strip on the homepage (\"A growing system, not a single feature\").",
    versions: [
      {
        id: "platform-v1",
        label: "Platform Overview V1 — Current (only recovered version)",
        sequence: 1,
        branch: "claude/driven2develop-v4-premium-rebuild",
        commit: "65324c4",
        commitMessage: "V4 design polish: signature motif + systematic motion pass",
        originalPath: "components/v4/V4CapabilityStrip.tsx",
        recoveryType: "exact-historical-recovery",
        deviceSupport: "responsive",
        hasAnimation: true,
        knownIssues: [],
        description: "8-card capability grid with per-item status badges, hover-lift, and staggered scroll reveal. The content has been stable since creation (55718d6) - hover/reveal was added once, not iterated further.",
        componentKey: "live-platform-strip",
      },
    ],
  },
  {
    slug: "organization-roles",
    group: "Public Site",
    title: "Organization Roles",
    description: "The \"Built for the whole organization\" audience cards.",
    versions: [
      {
        id: "orgroles-v1",
        label: "Org Roles V1 — Static cards",
        sequence: 1,
        branch: "claude/driven2develop-v4-premium-rebuild",
        commit: "8eb300f",
        commitMessage: "V4: reconcile against the 6 approved reference screenshots",
        originalPath: "app/v4-preview/page.tsx",
        recoveryType: "exact-historical-recovery",
        deviceSupport: "responsive",
        hasAnimation: false,
        knownIssues: ["No entrance animation - this was the actual gap found during the most recent audit."],
        description: "Three audience cards (For reps / For managers / For organizations), fully static - no reveal, no hover treatment.",
        componentKey: "orgroles-v1",
      },
      {
        id: "orgroles-v2",
        label: "Org Roles V2 — Current (animated)",
        sequence: 2,
        branch: "claude/driven2develop-v4-premium-rebuild",
        commit: "a602a21",
        commitMessage: "V4: close a real animation-consistency gap (Sections 3 and 6)",
        originalPath: "app/v4-preview/page.tsx",
        recoveryType: "exact-historical-recovery",
        deviceSupport: "responsive",
        hasAnimation: true,
        knownIssues: [],
        description: "Same three cards, now with staggered V4Reveal entrance and gold hover-lift, matching the rest of the homepage's motion language.",
        componentKey: "live-orgroles",
      },
    ],
  },
  {
    slug: "conversation-intelligence",
    group: "Public Site",
    title: "Conversation Intelligence",
    description: "The evidence panel: click a transcript line to see the finding behind it.",
    versions: [
      {
        id: "ci-v1",
        label: "Conversation Intelligence V1 — Plain-text score",
        sequence: 1,
        branch: "claude/driven2develop-v4-premium-rebuild",
        commit: "65324c4",
        commitMessage: "V4 design polish: signature motif + systematic motion pass",
        originalPath: "components/v4/V4PlatformSection.tsx",
        recoveryType: "exact-historical-recovery",
        deviceSupport: "responsive",
        hasAnimation: true,
        knownIssues: [],
        description: "Click-to-inspect transcript with a cross-fading evidence panel showing the active finding's score as plain text (no gauge).",
        componentKey: "ci-v1",
      },
      {
        id: "ci-v2",
        label: "Conversation Intelligence V2 — Arc-gauge score",
        sequence: 2,
        branch: "claude/driven2develop-v4-premium-rebuild",
        commit: "18d5845",
        commitMessage: "V4: propagate the arc-gauge visual signature to the remaining pages",
        originalPath: "components/v4/V4PlatformSection.tsx",
        recoveryType: "exact-historical-recovery",
        deviceSupport: "responsive",
        hasAnimation: true,
        knownIssues: [],
        description: "Same interaction, plain score number replaced with V4ScoreGauge so the finding's score reads as an arc, matching the Hero and Manager Dashboard's gauge language.",
        componentKey: "live-ci",
      },
      {
        id: "ci-v3",
        label: "Conversation Intelligence V3 — Current (+ raw signal strip)",
        sequence: 3,
        branch: "claude/driven2develop-v4-premium-rebuild",
        commit: "8eb300f",
        commitMessage: "V4: reconcile against the 6 approved reference screenshots",
        originalPath: "app/v4-preview/platform/conversation-intelligence/page.tsx",
        recoveryType: "exact-historical-recovery",
        deviceSupport: "responsive",
        hasAnimation: true,
        knownIssues: [],
        description: "Adds a V4SignalStrip section above the evidence panel: waveform + trust/irritation gauge + pace/objection stats, framed as \"the raw signal every score traces back to.\"",
        componentKey: "live-ci-page",
      },
    ],
  },
  {
    slug: "manager-dashboard",
    group: "Application",
    title: "Manager Dashboard",
    description: "Needs-attention queue and team skill heat-map.",
    versions: [
      {
        id: "dashboard-v1",
        label: "Manager Dashboard V1 — Current (only recovered version)",
        sequence: 1,
        branch: "claude/driven2develop-v4-premium-rebuild",
        commit: "568518a",
        commitMessage: "V4 Phase 3: design prototype (5 screens, Graphite Precision palette)",
        originalPath: "components/v4/V4ManagerDashboard.tsx",
        recoveryType: "exact-historical-recovery",
        deviceSupport: "responsive",
        hasAnimation: false,
        knownIssues: ["Heat-map overflowed on mobile in early iteration - fixed before this component was ever committed, so the committed version is already correct."],
        description: "A needs-attention queue (3 flagged reps) beside a 4x6 skill heat-map, color-coded by score band. Built and refined in one continuous pass before its single commit - no separate historical version exists in git.",
        componentKey: "live-manager-dashboard",
      },
    ],
  },
  {
    slug: "manager-intelligence-map",
    group: "Application",
    title: "Manager Intelligence Map",
    description: "Radial team map with per-rep score rings.",
    versions: [
      {
        id: "intelmap-v1",
        label: "Intelligence Map V1 — Current (only recovered version)",
        sequence: 1,
        branch: "claude/driven2develop-v4-premium-rebuild",
        commit: "92d00d4",
        commitMessage: "V4: signatures #4 and #5 - Intelligence Map + Performance Graph",
        originalPath: "components/v4/V4IntelligenceMap.tsx",
        recoveryType: "exact-historical-recovery",
        deviceSupport: "responsive",
        hasAnimation: true,
        knownIssues: [],
        description: "Team avg at center, 6 rep nodes with conic-gradient score rings around it, scroll-drawn connecting lines, click-to-inspect side panel. Built once as a signature interaction - no earlier version exists.",
        componentKey: "live-intelligence-map",
      },
    ],
  },
  {
    slug: "performance-graph",
    group: "Application",
    title: "Organization Performance Graph",
    description: "Scroll-drawn team trend line vs. benchmark.",
    versions: [
      {
        id: "perfgraph-v1",
        label: "Performance Graph V1 — Current (only recovered version)",
        sequence: 1,
        branch: "claude/driven2develop-v4-premium-rebuild",
        commit: "92d00d4",
        commitMessage: "V4: signatures #4 and #5 - Intelligence Map + Performance Graph",
        originalPath: "components/v4/V4PerformanceGraph.tsx",
        recoveryType: "exact-historical-recovery",
        deviceSupport: "responsive",
        hasAnimation: true,
        knownIssues: [],
        description: "Two-series line (team avg vs. benchmark) that draws in on scroll, with hover/focus tooltips per data point. Built once - no earlier version exists.",
        componentKey: "live-performance-graph",
      },
    ],
  },
  {
    slug: "loop-section",
    group: "Public Site",
    title: "The Core Loop",
    description: "Scroll-scrubbed cycle diagram (practice → conversation → evidence → coaching → improvement → org intelligence).",
    versions: [
      {
        id: "loop-v1",
        label: "Loop V1 — Current (only recovered version)",
        sequence: 1,
        branch: "claude/driven2develop-v4-premium-rebuild",
        commit: "27ada6c",
        commitMessage: "V4: add the signature scroll-driven Loop visualization",
        originalPath: "components/v4/V4LoopSection.tsx",
        recoveryType: "exact-historical-recovery",
        deviceSupport: "responsive",
        hasAnimation: true,
        knownIssues: [],
        description: "A closed-loop SVG path that draws itself in as the user scrolls, with 6 stage nodes lighting up in sequence. Built once - no earlier version exists.",
        componentKey: "live-loop",
      },
    ],
  },
  {
    slug: "transformation-sequence",
    group: "Public Site",
    title: "Transformation Sequence",
    description: "One concrete before/after case: a flagged moment carried through to a measured score improvement.",
    versions: [
      {
        id: "transform-v1",
        label: "Transformation Sequence V1 — Current (only recovered version)",
        sequence: 1,
        branch: "claude/driven2develop-v4-premium-rebuild",
        commit: "450b5d1",
        commitMessage: "V4: signatures #2 and #3 - conversation replay scrubber + transformation sequence",
        originalPath: "components/v4/V4TransformationSequence.tsx",
        recoveryType: "exact-historical-recovery",
        deviceSupport: "responsive",
        hasAnimation: true,
        knownIssues: [],
        description: "Four-step reveal: flagged moment -> evidence extracted -> drill assigned -> side-by-side 62->84 score gauge comparison. Built once - no earlier version exists.",
        componentKey: "live-transformation",
      },
    ],
  },
  {
    slug: "conversation-replay",
    group: "Application",
    title: "Conversation Replay (Roleplay scrubber)",
    description: "Scrubbable timeline synced to transcript, speaker, and trust/irritation gauge.",
    versions: [
      {
        id: "replay-v1",
        label: "Conversation Replay V1 — Current (only recovered version)",
        sequence: 1,
        branch: "claude/driven2develop-v4-premium-rebuild",
        commit: "450b5d1",
        commitMessage: "V4: signatures #2 and #3 - conversation replay scrubber + transformation sequence",
        originalPath: "components/v4/V4ConversationReplay.tsx",
        recoveryType: "exact-historical-recovery",
        deviceSupport: "responsive",
        hasAnimation: true,
        knownIssues: [],
        description: "A native range-input timeline drives 4 keyframes, each updating the transcript, speaker label, and trust/irritation gauge together. Built once - no earlier version exists.",
        componentKey: "live-replay",
      },
    ],
  },
  {
    slug: "final-cta",
    group: "Public Site",
    title: "Final CTA",
    description: "The closing section used on every page, before the footer.",
    versions: [
      {
        id: "cta-v1",
        label: "Final CTA V1 — Headline-only animation",
        sequence: 1,
        branch: "claude/driven2develop-v4-premium-rebuild",
        commit: "8eb300f",
        commitMessage: "V4: reconcile against the 6 approved reference screenshots",
        originalPath: "components/v4/V4FinalCTA.tsx",
        recoveryType: "exact-historical-recovery",
        deviceSupport: "responsive",
        hasAnimation: true,
        knownIssues: ["Only the H2 headline animates - the subtitle, button, and 3-fact strip are static every time this component renders."],
        description: "Headline, subtitle, gold CTA button, and a 3-fact strip. Only the headline fades/slides in on scroll.",
        componentKey: "cta-v1",
      },
      {
        id: "cta-v2",
        label: "Final CTA V2 — Current (fully animated)",
        sequence: 2,
        branch: "claude/driven2develop-v4-premium-rebuild",
        commit: "a602a21",
        commitMessage: "V4: close a real animation-consistency gap (Sections 3 and 6)",
        originalPath: "components/v4/V4FinalCTA.tsx",
        recoveryType: "exact-historical-recovery",
        deviceSupport: "responsive",
        hasAnimation: true,
        knownIssues: [],
        description: "Same layout and copy; subtitle and button now reveal in sequence after the headline, and each fact-strip item reveals individually with a stagger.",
        componentKey: "live-final-cta",
      },
    ],
  },
  {
    slug: "footer",
    group: "Public Site",
    title: "Footer",
    description: "A site-wide footer.",
    versions: [
      {
        id: "footer-none",
        label: "Footer — Never built",
        sequence: 1,
        branch: "n/a",
        commit: "n/a",
        commitMessage: "n/a",
        originalPath: "n/a",
        recoveryType: "unrecoverable",
        deviceSupport: "responsive",
        hasAnimation: false,
        knownIssues: ["No V4 footer component exists in any commit on any branch. This is not a loss - it was never created. Listed here rather than omitted, so the category isn't silently missing from the museum."],
        description: "No V4 page in this project has ever had a distinct footer section - every page ends at the Final CTA. Nothing to recover.",
        componentKey: null,
      },
    ],
  },
];

export function findCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function findVersion(categorySlug: string, versionId: string) {
  return findCategory(categorySlug)?.versions.find((v) => v.id === versionId);
}

export function allRecoverableVersions() {
  return CATEGORIES.flatMap((c) => c.versions.filter((v) => v.componentKey !== null));
}
