/**
 * Canonical V4 information architecture. Single source of truth for the mega
 * nav, hub landing pages, and status labeling — every other component reads
 * from here instead of hard-coding capability lists, so "available" can never
 * drift from what's actually backed by real code.
 *
 * Status is evidence-based against the real Prisma schema (User, Scenario,
 * PracticeSession, Metric, Assignment, Objection, PlaybookEntry) and the
 * existing (app)/(marketing) route tree — not aspirational.
 *
 *   available - real Prisma-backed feature, live in the product today
 *   beta      - real and working, still stabilizing
 *   planned   - scoped, no backend yet
 *   research  - directional, not yet scoped in detail
 */

export type CapabilityStatus = "available" | "beta" | "planned" | "research";

export interface Capability {
  slug: string;
  label: string;
  status: CapabilityStatus;
  blurb: string;
  /** Set once the V4 page exists. Nav only links capabilities that have one. */
  href?: string;
}

export interface Category {
  heading: string;
  items: Capability[];
}

export interface Hub {
  key: string;
  label: string;
  /** Top-level nav href for the hub's own landing page, once built. */
  href?: string;
  categories: Category[];
}

export const STATUS_LABEL: Record<CapabilityStatus, string> = {
  available: "Available now",
  beta: "Beta",
  planned: "Planned",
  research: "Research roadmap",
};

export const PLATFORM_HUB: Hub = {
  key: "platform",
  label: "Platform",
  categories: [
    {
      heading: "Simulation",
      items: [
        { slug: "roleplay", label: "AI Roleplay Simulator", status: "available", blurb: "Live mic practice against an adaptive homeowner personality." },
        { slug: "customer-personalities", label: "AI Customer Personalities", status: "available", blurb: "Difficulty- and disposition-tuned homeowner behavior." },
        { slug: "voice-analysis", label: "Voice & Speech Analysis", status: "available", blurb: "Pace, filler words, and tone from real acoustic signal." },
        { slug: "upload-analysis", label: "Upload Analysis", status: "available", blurb: "Score a real field recording after the fact." },
      ],
    },
    {
      heading: "Coaching",
      items: [
        { slug: "scorecard", label: "Evidence-Based Scorecard", status: "available", blurb: "Every score traces to an exact transcript moment." },
        { slug: "objection-intelligence", label: "Objection Intelligence", status: "available", blurb: "Structured drills against the objections that actually break deals." },
        { slug: "ai-coach", label: "AI Coach", status: "available", blurb: "Rule-based tips targeted at your lowest-scoring metric." },
        { slug: "live-coaching", label: "Live In-Session Coaching", status: "research", blurb: "Real-time prompts during an active conversation." },
        { slug: "script-builder", label: "Script Builder", status: "planned", blurb: "Compose and version team scripts against scored outcomes." },
        { slug: "script-optimization", label: "AI Script Optimization", status: "research", blurb: "Suggest script edits from aggregate performance data." },
        { slug: "certifications", label: "Certifications", status: "planned", blurb: "Formal skill milestones reps progress through." },
      ],
    },
    {
      heading: "For Teams",
      items: [
        { slug: "manager-dashboard", label: "Manager Dashboard", status: "available", blurb: "Roster, needs-attention queue, and team weakness aggregation." },
        { slug: "team-analytics", label: "Team Analytics", status: "available", blurb: "Aggregated skill averages across every scored session." },
        { slug: "assignments-playbooks", label: "Assignments & Playbooks", status: "available", blurb: "Targeted drills assigned from evidence, not guesswork." },
        { slug: "compliance", label: "Compliance Monitoring", status: "available", blurb: "Flags unapproved claims and script deviations automatically." },
        { slug: "manager-copilot", label: "Manager Copilot", status: "available", blurb: "Surfaces what a manager should look at next." },
        { slug: "leaderboard", label: "Leaderboard & Gamification", status: "available", blurb: "Most improved, highest score, and streaks from real session data." },
        { slug: "team-competitions", label: "Team Competitions", status: "planned", blurb: "Structured head-to-head and team-vs-team challenges." },
        { slug: "executive-dashboard", label: "Executive Dashboard", status: "planned", blurb: "Org-wide performance rollup for leadership." },
        { slug: "admin-controls", label: "Admin & Access Controls", status: "available", blurb: "Approve, suspend, and grant roles across the organization." },
      ],
    },
    {
      heading: "Talent",
      items: [
        { slug: "recruiting", label: "Recruiting", status: "research", blurb: "Source and track candidates before they're reps." },
        { slug: "hiring-assessments", label: "Hiring Assessments", status: "planned", blurb: "Roleplay-based evaluation before an offer goes out." },
        { slug: "onboarding", label: "New Hire Onboarding", status: "planned", blurb: "Structured ramp path from hire to first solo pitch." },
        { slug: "knowledge-base", label: "Company Knowledge Base", status: "planned", blurb: "Org-specific product and policy reference, searchable in-app." },
      ],
    },
    {
      heading: "Revenue Operations",
      items: [
        { slug: "crm", label: "CRM", status: "research", blurb: "Contact and account records tied to practice history." },
        { slug: "pipeline", label: "Pipeline", status: "research", blurb: "Deal-stage tracking connected to rep performance." },
        { slug: "territory-intelligence", label: "Territory Intelligence", status: "research", blurb: "Performance patterns mapped to geography." },
        { slug: "mapping", label: "Mapping", status: "research", blurb: "Route and canvassing visualization." },
        { slug: "predictive-analytics", label: "Predictive Analytics", status: "research", blurb: "Forward-looking skill and outcome projections." },
        { slug: "forecasting", label: "Forecasting", status: "research", blurb: "Revenue projections informed by rep readiness." },
        { slug: "revenue-intelligence", label: "Revenue Intelligence", status: "research", blurb: "Connect coaching signal to closed revenue." },
        { slug: "benchmarking", label: "Cross-Org Benchmarking", status: "planned", blurb: "Compare team performance against anonymized industry data." },
      ],
    },
    {
      heading: "Enterprise Infrastructure",
      items: [
        { slug: "enterprise-admin", label: "Enterprise Administration", status: "planned", blurb: "SSO, SCIM, and org-level governance." },
        { slug: "white-label", label: "White Labeling", status: "planned", blurb: "Rebrand the platform for a reseller or franchise network." },
        { slug: "marketplace", label: "Marketplace", status: "research", blurb: "Third-party scenarios, scripts, and drills." },
        { slug: "community", label: "Community", status: "planned", blurb: "Cross-org forum for reps and managers." },
        { slug: "mobile-apps", label: "Mobile Apps", status: "planned", blurb: "Native practice and coaching on iOS and Android." },
        { slug: "integrations", label: "Integrations", status: "planned", blurb: "Connect to the CRMs and tools teams already run." },
        { slug: "api", label: "Developer API", status: "planned", blurb: "Programmatic access to sessions, scores, and rosters." },
        { slug: "security", label: "Security & Compliance", status: "beta", blurb: "Data isolation, encryption, and access controls." },
      ],
    },
  ],
};

export const SOLUTIONS_HUB: Hub = {
  key: "solutions",
  label: "Solutions",
  categories: [
    {
      heading: "By role",
      items: [
        { slug: "for-reps", label: "For Reps", status: "available", blurb: "Practice on your own time, see exactly what to fix." },
        { slug: "for-managers", label: "For Managers", status: "available", blurb: "See every rep's real skill gaps, not just activity." },
        { slug: "for-companies", label: "For Organizations", status: "available", blurb: "Standardize coaching quality across every team." },
      ],
    },
  ],
};

export const INDUSTRIES_HUB: Hub = {
  key: "industries",
  label: "Industries",
  categories: [
    {
      heading: "Field sales verticals",
      items: [
        { slug: "solar", label: "Solar", status: "available", blurb: "Objection-heavy, high-consideration door-to-door sales." },
        { slug: "roofing", label: "Roofing", status: "planned", blurb: "Storm-season canvassing and inspection scheduling." },
        { slug: "pest-control", label: "Pest Control", status: "planned", blurb: "Recurring-service door-to-door sales." },
        { slug: "home-security", label: "Home Security", status: "planned", blurb: "Trust-building for in-home technology sales." },
        { slug: "telecom", label: "Telecom & Utilities", status: "research", blurb: "Regulated-market door-to-door sales." },
      ],
    },
  ],
};

export const RESOURCES_HUB: Hub = {
  key: "resources",
  label: "Resources",
  categories: [
    {
      heading: "Learn",
      items: [
        { slug: "how-it-works", label: "How It Works", status: "available", blurb: "The mechanics behind the scorecard and the coach." },
        { slug: "help", label: "Help Center", status: "available", blurb: "Answers for reps, managers, and admins." },
        { slug: "guides", label: "Guides", status: "planned", blurb: "Deeper walkthroughs of specific workflows." },
        { slug: "docs", label: "Documentation", status: "planned", blurb: "Reference for every feature and setting." },
      ],
    },
  ],
};

export const COMPANY_HUB: Hub = {
  key: "company",
  label: "Company",
  categories: [
    {
      heading: "About",
      items: [
        { slug: "about", label: "About", status: "available", blurb: "Why this exists and who's building it." },
        { slug: "customers", label: "How Teams Use It", status: "available", blurb: "Real usage patterns, not invented case studies." },
        { slug: "pricing", label: "Pricing", status: "available", blurb: "Straightforward, per-seat pricing." },
        { slug: "contact", label: "Contact", status: "available", blurb: "Talk to us directly." },
        { slug: "careers", label: "Careers", status: "planned", blurb: "Open roles as the team grows." },
      ],
    },
  ],
};

export const ENTERPRISE_HUB: Hub = {
  key: "enterprise",
  label: "Enterprise",
  categories: [
    {
      heading: "For large organizations",
      items: [
        { slug: "enterprise-overview", label: "Enterprise Overview", status: "planned", blurb: "Multi-team rollout, governance, and support." },
        { slug: "security", label: "Security & Trust", status: "beta", blurb: "How data is isolated, encrypted, and controlled." },
        { slug: "sso", label: "SSO & SCIM", status: "planned", blurb: "Identity provider integration and automated provisioning." },
      ],
    },
  ],
};

export const DEVELOPERS_HUB: Hub = {
  key: "developers",
  label: "Developers",
  categories: [
    {
      heading: "Build on the platform",
      items: [
        { slug: "api-overview", label: "API Overview", status: "planned", blurb: "Programmatic access to platform data." },
        { slug: "webhooks", label: "Webhooks", status: "research", blurb: "React to sessions and scores in real time." },
        { slug: "sdks", label: "SDKs", status: "research", blurb: "Typed clients for common languages." },
      ],
    },
  ],
};

export const HUBS: Hub[] = [
  PLATFORM_HUB,
  SOLUTIONS_HUB,
  INDUSTRIES_HUB,
  RESOURCES_HUB,
  ENTERPRISE_HUB,
  DEVELOPERS_HUB,
  COMPANY_HUB,
];

export function allCapabilities(): Capability[] {
  return HUBS.flatMap((hub) => hub.categories.flatMap((cat) => cat.items));
}

export function countByStatus() {
  const counts: Record<CapabilityStatus, number> = { available: 0, beta: 0, planned: 0, research: 0 };
  for (const cap of allCapabilities()) counts[cap.status]++;
  return counts;
}
