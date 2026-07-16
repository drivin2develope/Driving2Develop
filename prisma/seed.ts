import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";

const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSQLite3({ url: databaseUrl.replace(/^file:/, "") });
const prisma = new PrismaClient({ adapter });

type HomeownerLine = { stage: string; line: string };

const SCENARIOS: {
  title: string;
  difficulty: "EASY" | "REALISTIC" | "HARD";
  personality: string;
  description: string;
  requiredTalkingPoints: string[];
  estimatedMinutes: number;
  homeownerScript: HomeownerLine[];
  isLocked?: boolean;
}[] = [
  {
    title: "Friendly First Pitch",
    difficulty: "EASY",
    personality: "friendly",
    description: "A warm, curious homeowner who's happy to chat. Great for finding your rhythm on intro, value prop, and close.",
    requiredTalkingPoints: ["introduction", "rapport", "value_prop", "close"],
    estimatedMinutes: 4,
    homeownerScript: [
      { stage: "introduction", line: "Oh hey, come on in off the porch, it's hot out there. What's up?" },
      { stage: "rapport", line: "We've been in this house about six years now, love the neighborhood." },
      { stage: "value_prop", line: "Solar, huh? I've seen a few trucks around here lately. Tell me more." },
      { stage: "close", line: "Okay that actually sounds pretty reasonable. What's the next step?" },
    ],
  },
  {
    title: "Skeptical Retiree",
    difficulty: "EASY",
    personality: "skeptical",
    description: "Polite but doubtful. Wants proof before anything else - respond with credibility, not pressure.",
    requiredTalkingPoints: ["introduction", "value_prop", "objection_handling", "close"],
    estimatedMinutes: 5,
    homeownerScript: [
      { stage: "introduction", line: "I've had three of you folks at my door this month already." },
      { stage: "value_prop", line: "Sure, everyone says I'll save money. I've heard that before." },
      { stage: "objection", line: "Honestly this feels like a scam, no offense." },
      { stage: "close", line: "Alright, if you can actually show me real numbers, I'll listen." },
    ],
  },
  {
    title: "Busy Parent, 5 Minutes",
    difficulty: "REALISTIC",
    personality: "busy",
    description: "Juggling kids and dinner. You have to earn every second - be sharp, be brief, get to the point.",
    requiredTalkingPoints: ["introduction", "value_prop", "close"],
    estimatedMinutes: 3,
    homeownerScript: [
      { stage: "introduction", line: "Sorry, I've literally got two minutes, dinner's on the stove." },
      { stage: "value_prop", line: "Okay, quick version - what does this actually save me?" },
      { stage: "objection", line: "I really don't have time to think about this today." },
      { stage: "close", line: "Fine, can you just text me something instead of scheduling now?" },
    ],
  },
  {
    title: "Price-Focused Negotiator",
    difficulty: "REALISTIC",
    personality: "price-focused",
    description: "Will compare every number against a competitor quote. Anchor on value, not just price.",
    requiredTalkingPoints: ["introduction", "value_prop", "objection_handling", "close"],
    estimatedMinutes: 6,
    homeownerScript: [
      { stage: "introduction", line: "Alright, what's your pitch - I've talked to a lot of solar people." },
      { stage: "value_prop", line: "What's this actually going to cost me a month?" },
      { stage: "objection", line: "That's more than the quote I got from another company already." },
      { stage: "close", line: "If you can beat that number I'll consider signing today." },
    ],
  },
  {
    title: "Defensive Homeowner",
    difficulty: "HARD",
    personality: "defensive",
    description: "Guarded from the first second, assumes you're a scammer. Needs de-escalation before anything else lands.",
    requiredTalkingPoints: ["introduction", "objection_handling", "value_prop", "close"],
    estimatedMinutes: 6,
    homeownerScript: [
      { stage: "introduction", line: "We've got a no soliciting sign right there, did you not see it?" },
      { stage: "objection", line: "Look, I'm not interested, and honestly this feels like a scam." },
      { stage: "objection_2", line: "My neighbor got burned by one of these deals last year." },
      { stage: "value_prop", line: "...okay, thirty seconds. What's actually different about your company?" },
      { stage: "close", line: "I'm still not sure. What would I even need to do next?" },
    ],
  },
  {
    title: "Analytical Engineer",
    difficulty: "HARD",
    personality: "analytical",
    description: "Wants the technical details - panel efficiency, inverter specs, payback period math. No fluff allowed.",
    requiredTalkingPoints: ["introduction", "qualifying", "value_prop", "objection_handling", "close"],
    estimatedMinutes: 7,
    homeownerScript: [
      { stage: "introduction", line: "Sure, come in, but I do want to see actual numbers, not a sales pitch." },
      { stage: "qualifying", line: "What's the roof orientation requirement and average usage you'd base this on?" },
      { stage: "value_prop", line: "What's the degradation rate on the panels over twenty five years?" },
      { stage: "objection", line: "Your payback period math doesn't quite add up with my current bill." },
      { stage: "close", line: "Send me the full spec sheet and I'll consider scheduling an install." },
    ],
  },
];

const REPS = [
  { name: "Maya Chen", email: "rep1@driven2develop.dev" },
  { name: "Diego Ramirez", email: "rep2@driven2develop.dev" },
  { name: "Aaliyah Brooks", email: "rep3@driven2develop.dev" },
  { name: "Noah Kim", email: "rep4@driven2develop.dev" },
  { name: "Priya Patel", email: "rep5@driven2develop.dev" },
];

const TRANSCRIPT_SAMPLES = [
  `Hi there, I'm with SunPeak Energy, we're doing some work in the neighborhood this week. How's your day going? Yeah so basically what we're doing is helping homeowners around here cut down their electric bill using solar, it's, um, actually a pretty simple process. A lot of your neighbors have already looked into it. Would you say your bill runs pretty high in the summer? Right, that's actually really common around here. So what we'd do is take a look at your usage and your roof and put together a no-obligation quote so you can see the actual numbers. I totally understand wanting to think it over, that's smart. A lot of folks felt the same way until they saw the real savings on paper. Would it be alright if we scheduled a quick fifteen minute walkthrough this week, maybe Thursday or Friday?`,
  `Hey, good afternoon, I know you're busy so I'll be quick. I'm out here talking to folks about solar, basically helping people lower their electric bill without any upfront cost. I hear you, everyone's got a million things going on. Honestly the whole point of stopping by is just to see if it's worth a fifteen minute conversation, that's it. If your bill's under a certain amount it might not even make sense, so, no pressure either way. I understand if today's not good, would tomorrow evening work better for a quick call instead?`,
];

const OBJECTIONS: {
  slug: string;
  category: string;
  title: string;
  difficulty: "EASY" | "REALISTIC" | "HARD";
  summary: string;
  whyItHappens: string;
  recommendedResponse: string[];
  exampleScript: string;
  relatedTactics: string[];
}[] = [
  {
    slug: "too-expensive",
    category: "Price",
    title: "\"It's too expensive.\"",
    difficulty: "REALISTIC",
    summary: "The homeowner anchors on the sticker cost before they understand the value or the financing.",
    whyItHappens: "Price feels concrete and safe to push back on. Usually it's a stand-in for \"I don't yet see why this is worth it.\"",
    recommendedResponse: [
      "Acknowledge without flinching: \"Totally fair — cost matters.\"",
      "Reframe from price to monthly impact and what they pay today.",
      "Compare against the do-nothing cost (their current bill going up).",
      "Offer the concrete next step, not a discount.",
    ],
    exampleScript: "I hear you — nobody wants another bill. Here's the thing: you're already paying for power every month, it's just going to the utility and creeping up every year. What we do is take that same money and turn it into something you own. Can I show you the actual side-by-side for your usage?",
    relatedTactics: ["Anchor on value", "Feel-felt-found", "Cost of inaction"],
  },
  {
    slug: "not-interested",
    category: "Brush-off",
    title: "\"I'm not interested.\"",
    difficulty: "EASY",
    summary: "A reflex brush-off before the homeowner knows what you're offering.",
    whyItHappens: "It's a pattern-interrupt for door knockers, said before they've actually heard anything.",
    recommendedResponse: [
      "Don't argue — agree and disarm: \"Totally get it, most people say that.\"",
      "Give a one-sentence reason to give you 20 seconds.",
      "Ask a low-commitment question to re-open the conversation.",
    ],
    exampleScript: "Honestly, most of your neighbors said the exact same thing when I first knocked. All I'm doing is seeing if you qualify for the program the county's running this year — takes about twenty seconds. Mind if I ask what you're paying for power right now?",
    relatedTactics: ["Agree and disarm", "Pattern interrupt", "Micro-commitment"],
  },
  {
    slug: "need-to-think",
    category: "Stall",
    title: "\"I need to think about it.\"",
    difficulty: "REALISTIC",
    summary: "A soft stall that usually hides an unspoken concern.",
    whyItHappens: "It feels polite and buys time, but almost always means a specific worry hasn't been surfaced.",
    recommendedResponse: [
      "Validate: \"Smart — this isn't something to rush.\"",
      "Surface the real concern: \"When you say think about it, what's the piece you'd want to be sure of?\"",
      "Address that one thing directly, then propose a specific follow-up time.",
    ],
    exampleScript: "That's smart, I'd think it over too. Just so I leave you with the right info — is it more the numbers, the company, or the timing you'd want to be sure about? … Got it. Let's do this: I'll put together the exact figures and swing back Thursday at 6. Fair?",
    relatedTactics: ["Isolate the objection", "Assumptive follow-up", "Specificity close"],
  },
  {
    slug: "talk-to-spouse",
    category: "Stall",
    title: "\"I need to talk to my spouse.\"",
    difficulty: "REALISTIC",
    summary: "A legitimate decision-maker concern that can also be a polite exit.",
    whyItHappens: "Big household decisions genuinely involve both partners — but it's also an easy way to end a conversation.",
    recommendedResponse: [
      "Respect it fully — never pressure around a partner.",
      "Make it easy to include them: offer a time when both are home.",
      "Leave them equipped to explain it accurately to their spouse.",
    ],
    exampleScript: "Of course — this should be a both-of-you decision. When's your partner usually home? I'd rather show you both the numbers together so you're not stuck playing telephone. Does tomorrow evening work, or is the weekend better?",
    relatedTactics: ["Include the decision-maker", "Schedule the callback", "Equip the champion"],
  },
  {
    slug: "already-have-quotes",
    category: "Competitor",
    title: "\"I already got quotes from other companies.\"",
    difficulty: "HARD",
    summary: "The homeowner is comparison-shopping and may be quote-fatigued.",
    whyItHappens: "They've done homework and want to avoid being sold again — but they haven't committed, which is your opening.",
    recommendedResponse: [
      "Compliment the diligence: \"Good — you should compare.\"",
      "Differentiate on something other than price (install quality, warranty, timeline).",
      "Offer a quick apples-to-apples review of what they already have.",
    ],
    exampleScript: "Perfect, you should get a few — it's a big decision. Most quotes look the same on the front page and totally different on the details that actually cost you later. Want me to look at what you've got and flag the three things people usually miss? No pressure either way.",
    relatedTactics: ["Differentiate beyond price", "Third-party review", "Trusted advisor framing"],
  },
  {
    slug: "feels-like-scam",
    category: "Trust",
    title: "\"This feels like a scam.\"",
    difficulty: "HARD",
    summary: "The homeowner is guarded and skeptical of your legitimacy.",
    whyItHappens: "Door-to-door has a bad reputation and they've likely been burned or warned. Trust must be earned before anything else lands.",
    recommendedResponse: [
      "Don't get defensive — validate the caution: \"Honestly, good. You should be skeptical.\"",
      "Offer proof and transparency (credentials, local references, no-pressure).",
      "Slow down and hand them control of the pace.",
    ],
    exampleScript: "Honestly? Good — you should be careful, there are shady operators out there. Here's my badge and the company license number; you can look us up right now. I'm not here to sign you today. I just want to leave you real numbers you can check on your own time.",
    relatedTactics: ["Validate skepticism", "Proof and transparency", "Lower the pressure"],
  },
  {
    slug: "no-time",
    category: "Brush-off",
    title: "\"I don't have time right now.\"",
    difficulty: "EASY",
    summary: "The homeowner is busy and needs you to respect it.",
    whyItHappens: "Often literally true — dinner, kids, work. Fighting it kills trust.",
    recommendedResponse: [
      "Acknowledge and shrink the ask: \"Totally — I'll be quick or come back.\"",
      "Give a one-line value hook so it's worth a callback.",
      "Lock a specific return time instead of \"later.\"",
    ],
    exampleScript: "No worries, I can tell you're in the middle of something. Ninety seconds or I come back — your call. If it helps, the reason I'm knocking is a lot of folks on this street are cutting their power bill. Want me to swing back at 7 instead?",
    relatedTactics: ["Shrink the ask", "Value hook", "Specificity close"],
  },
  {
    slug: "renting",
    category: "Qualifying",
    title: "\"I'm just renting.\"",
    difficulty: "EASY",
    summary: "A genuine disqualifier for many programs — handle gracefully and mine for referrals.",
    whyItHappens: "Renters usually can't authorize home improvements, so it's often a true stop.",
    recommendedResponse: [
      "Confirm and thank them for saving you both time.",
      "Ask for the owner's contact if appropriate.",
      "Ask for a referral to a homeowner they know.",
    ],
    exampleScript: "Ah, good to know — appreciate you telling me. Two quick things: would your landlord be the person I'd talk to, and do you know any neighbors who own and might want to hear about the program?",
    relatedTactics: ["Graceful disqualify", "Referral ask", "Protect your time"],
  },
  {
    slug: "bad-experience-neighbor",
    category: "Trust",
    title: "\"My neighbor got burned by one of these.\"",
    difficulty: "HARD",
    summary: "Social proof working against you — a cautionary story from someone they trust.",
    whyItHappens: "A local horror story carries more weight than any pitch. You must acknowledge it before reframing.",
    recommendedResponse: [
      "Never dismiss it: \"That's exactly why I do this the way I do.\"",
      "Separate your company/process from whoever burned them.",
      "Offer verifiable local proof of a good outcome.",
    ],
    exampleScript: "I'm really sorry that happened to them — that's the stuff that gives our whole industry a black eye. That's honestly why I don't do high-pressure closes. Want me to show you a couple installs we did two streets over so you can talk to real people, not just take my word?",
    relatedTactics: ["Acknowledge the story", "Separate from bad actors", "Local proof"],
  },
  {
    slug: "roof-too-old",
    category: "Technical",
    title: "\"My roof is too old for this.\"",
    difficulty: "REALISTIC",
    summary: "A technical concern that's often solvable and shows real interest.",
    whyItHappens: "It's a genuine practical worry — and a buying signal, because they're picturing it on their house.",
    recommendedResponse: [
      "Treat it as interest, not rejection.",
      "Explain how roof condition is assessed and worked around.",
      "Move to the free assessment as the next step.",
    ],
    exampleScript: "Great question — and the fact you're thinking about the roof tells me you're actually picturing it. Roof age matters, but it's something our assessment checks for free, and in a lot of cases we coordinate the timing so it works out. Want to get that assessment on the calendar?",
    relatedTactics: ["Reframe as buying signal", "Educate briefly", "Advance to assessment"],
  },
];

const PLAYBOOK: {
  slug: string;
  section: string;
  title: string;
  body: string;
  tags: string[];
}[] = [
  {
    slug: "approved-intro-script",
    section: "Approved scripts",
    title: "Standard doorstep intro",
    body: "Hi, I'm [name] with [company] — we're the group doing the solar work you've probably seen around [neighborhood] this week. I'm not here to sell you anything today, I'm just checking which homes qualify for this year's program. Quick question — roughly what are you paying for power right now?",
    tags: ["intro", "compliance-approved", "solar"],
  },
  {
    slug: "value-prop-talk-track",
    section: "Talk tracks",
    title: "Core value proposition",
    body: "The pitch is ownership, not gadgets: 'You're already paying for power every month — that money just disappears to the utility and goes up every year. We redirect that same spend into a system you own, so your money builds equity instead of vanishing.' Keep it to two sentences before you ask a question.",
    tags: ["value-prop", "framing"],
  },
  {
    slug: "objection-first-rule",
    section: "Talk tracks",
    title: "The acknowledge-first rule",
    body: "Never rebut an objection in the first sentence. Always acknowledge first ('Totally fair', 'I hear you', 'Good — you should be careful') before you reframe. Reps who argue immediately lose trust and the door closes. This is scored as Objection Handling on every session.",
    tags: ["objections", "coaching"],
  },
  {
    slug: "closing-checklist",
    section: "Approved scripts",
    title: "Closing checklist",
    body: "A real close ends with a specific next step and a specific time. 'Does Thursday at 6 or Saturday morning work better?' beats 'let me know.' Always confirm the decision-makers are present. Never pressure around a spouse or imply false scarcity — see Compliance.",
    tags: ["close", "compliance-approved"],
  },
  {
    slug: "compliance-no-pressure",
    section: "Compliance",
    title: "No high-pressure / no false scarcity",
    body: "Prohibited: 'today only', 'last chance', 'you'd be stupid not to', or any claim of a deadline that isn't real. Prohibited: implying government affiliation. Always present your badge and license number on request. Violations show up as low trust language in scoring and are grounds for coaching.",
    tags: ["compliance", "required-reading"],
  },
  {
    slug: "compliance-honest-savings",
    section: "Compliance",
    title: "Honest savings claims",
    body: "Only quote savings ranges you can back with the homeowner's actual usage. Never promise a specific dollar figure before an assessment. Frame savings as estimates pending the free assessment. Overpromising is the #1 driver of the 'neighbor got burned' objection.",
    tags: ["compliance", "required-reading"],
  },
  {
    slug: "rapport-openers",
    section: "Talk tracks",
    title: "Rapport openers",
    body: "Genuine beats scripted. Notice something specific: the garden, the truck, the flag, the dog. 'How long have you been in the neighborhood?' opens more doors than any pitch line. Two sentences of real rapport before business.",
    tags: ["rapport", "intro"],
  },
  {
    slug: "referral-ask",
    section: "Talk tracks",
    title: "The referral ask",
    body: "Every conversation — even a no — ends with a referral ask: 'Who on the street should I definitely talk to?' Warm intros convert several times better than cold knocks. Log referrals the same day.",
    tags: ["referrals", "pipeline"],
  },
];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function buildMetric(dayIndex: number, totalDays: number, source: "LIVE" | "UPLOAD") {
  // Slightly improving trend over time (dayIndex 0 = oldest, totalDays-1 = most recent)
  const progress = totalDays <= 1 ? 1 : dayIndex / (totalDays - 1);
  const base = 55 + progress * 25;
  const noise = () => randomBetween(-8, 8);

  const clarity = clampScore(base + noise());
  const keywordAdherence = clampScore(base + noise() + 5);
  const objectionHandled = Math.random() > 0.2 ? clampScore(base + noise()) : null;
  const closingStrength = clampScore(base - 5 + noise());
  const confidence = clampScore(base + noise());
  const overall = clampScore((clarity + keywordAdherence + (objectionHandled ?? base) + closingStrength + confidence) / 5);

  const fillerWordCount = Math.max(0, Math.round(12 - progress * 8 + randomBetween(-2, 2)));
  const wordCount = Math.round(randomBetween(280, 520));
  const durationSeconds = Math.round(randomBetween(150, 340));

  return {
    wordsPerMinute: Math.round((wordCount / durationSeconds) * 60),
    paceVariance: Math.round(clampScore(40 - progress * 20 + noise())),
    fillerWordCount,
    fillerWordRate: Number(((fillerWordCount / wordCount) * 100).toFixed(1)),
    pauseCount: Math.round(randomBetween(3, 12)),
    avgPauseLengthMs: Math.round(randomBetween(600, 1800)),
    volumeVariation: Math.round(clampScore(base + noise())),
    monotoneScore: Math.round(clampScore(60 - progress * 20 + noise())),
    talkListenRatio: Number(randomBetween(1.2, 3.2).toFixed(2)),
    clarityScore: clarity,
    keywordAdherenceScore: keywordAdherence,
    objectionHandledScore: objectionHandled,
    closingStrengthScore: closingStrength,
    confidenceScore: confidence,
    overallScore: overall,
    transcriptConfidence: source === "LIVE" ? ("HIGH" as const) : (Math.random() > 0.5 ? ("MEDIUM" as const) : ("LOW" as const)),
    tipsJson: JSON.stringify(pickTips({ clarity, keywordAdherence, closingStrength, confidence })),
    paceTimelineJson: JSON.stringify(buildPaceTimeline(wordCount, durationSeconds)),
    durationSeconds,
  };
}

function buildPaceTimeline(wordCount: number, durationSeconds: number) {
  const buckets = 6;
  const baseWpm = Math.round((wordCount / durationSeconds) * 60);
  return new Array(buckets).fill(0).map((_, i) => ({
    t: `${Math.round((i * durationSeconds) / buckets / 60)}:${String(Math.round(((i * durationSeconds) / buckets) % 60)).padStart(2, "0")}`,
    wpm: Math.max(60, Math.round(baseWpm + randomBetween(-25, 25))),
  }));
}

function clampScore(n: number) {
  return Math.max(10, Math.min(98, Math.round(n)));
}

function pickTips(scores: Record<string, number>) {
  const dict: Record<string, string> = {
    clarity: "Slow down and cut filler words - pause instead of filling silence.",
    keywordAdherence: "Make sure you hit every stage: intro, value prop, objection handling, and close.",
    closingStrength: "End with a specific, concrete next step like a date/time on the calendar.",
    confidence: "Use more declarative language instead of hedging.",
  };
  const entries = Object.entries(scores).sort((a, b) => a[1] - b[1]);
  return entries.slice(0, 2).map(([k]) => dict[k]);
}

async function main() {
  console.log("Seeding Driven2Develop...");

  const passwordHash = await bcrypt.hash("password123", 10);

  const manager = await prisma.user.upsert({
    where: { email: "manager@driven2develop.dev" },
    update: {},
    create: {
      email: "manager@driven2develop.dev",
      name: "Alex Rivera",
      passwordHash,
      role: "MANAGER",
      industry: "solar",
      experienceLevel: "veteran",
      goal: "onboard_team",
    },
  });

  const reps = [];
  for (const rep of REPS) {
    const created = await prisma.user.upsert({
      where: { email: rep.email },
      update: {},
      create: {
        email: rep.email,
        name: rep.name,
        passwordHash,
        role: "REP",
        industry: "solar",
        experienceLevel: ["new", "developing", "experienced"][Math.floor(Math.random() * 3)],
        goal: ["close_more", "handle_objections", "reduce_fillers"][Math.floor(Math.random() * 3)],
        managerId: manager.id,
      },
    });
    reps.push(created);
  }

  const scenarios = [];
  for (const s of SCENARIOS) {
    const existing = await prisma.scenario.findFirst({ where: { title: s.title } });
    const scenario = existing
      ? existing
      : await prisma.scenario.create({
          data: {
            title: s.title,
            industry: "solar",
            difficulty: s.difficulty,
            personality: s.personality,
            description: s.description,
            requiredTalkingPoints: JSON.stringify(s.requiredTalkingPoints),
            homeownerScript: JSON.stringify(s.homeownerScript),
            estimatedMinutes: s.estimatedMinutes,
            isLocked: false,
          },
        });
    scenarios.push(scenario);
  }

  // A locked "Humor Mode" scenario shown in the library as a static locked card.
  const humorExists = await prisma.scenario.findFirst({ where: { title: "Humor Mode: The Comedian" } });
  if (!humorExists) {
    await prisma.scenario.create({
      data: {
        title: "Humor Mode: The Comedian",
        industry: "solar",
        difficulty: "HARD",
        personality: "comedic",
        description: "A future scenario mode where the homeowner throws curveball humor at you. Complete 35 more drills to unlock.",
        requiredTalkingPoints: JSON.stringify(["introduction", "value_prop", "close"]),
        homeownerScript: JSON.stringify([]),
        estimatedMinutes: 5,
        isLocked: true,
      },
    });
  }

  // Objection library (idempotent upsert by slug)
  for (let i = 0; i < OBJECTIONS.length; i++) {
    const o = OBJECTIONS[i];
    await prisma.objection.upsert({
      where: { slug: o.slug },
      update: {},
      create: {
        slug: o.slug,
        category: o.category,
        title: o.title,
        difficulty: o.difficulty,
        summary: o.summary,
        whyItHappens: o.whyItHappens,
        recommendedResponse: JSON.stringify(o.recommendedResponse),
        exampleScript: o.exampleScript,
        relatedTactics: JSON.stringify(o.relatedTactics),
        order: i,
      },
    });
  }

  // Company playbook (idempotent upsert by slug)
  for (let i = 0; i < PLAYBOOK.length; i++) {
    const p = PLAYBOOK[i];
    await prisma.playbookEntry.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        section: p.section,
        title: p.title,
        body: p.body,
        tags: JSON.stringify(p.tags),
        order: i,
      },
    });
  }

  // Historical sessions per rep
  const now = Date.now();
  for (const rep of reps) {
    const sessionCount = 4 + Math.floor(Math.random() * 5); // 4-8
    for (let i = 0; i < sessionCount; i++) {
      const daysAgo = Math.round(((sessionCount - i) / sessionCount) * 28) + Math.floor(Math.random() * 2);
      const createdAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
      const source: "LIVE" | "UPLOAD" = Math.random() > 0.35 ? "LIVE" : "UPLOAD";
      const scenario = source === "LIVE" ? scenarios[Math.floor(Math.random() * scenarios.length)] : null;
      const metric = buildMetric(i, sessionCount, source);
      const transcript =
        source === "LIVE" && Math.random() > 0.4
          ? TRANSCRIPT_SAMPLES[Math.floor(Math.random() * TRANSCRIPT_SAMPLES.length)]
          : null;

      await prisma.practiceSession.create({
        data: {
          userId: rep.id,
          scenarioId: scenario?.id ?? null,
          source,
          status: "COMPLETE",
          durationSeconds: metric.durationSeconds,
          transcript,
          createdAt,
          metric: {
            create: {
              wordsPerMinute: metric.wordsPerMinute,
              paceVariance: metric.paceVariance,
              fillerWordCount: metric.fillerWordCount,
              fillerWordRate: metric.fillerWordRate,
              pauseCount: metric.pauseCount,
              avgPauseLengthMs: metric.avgPauseLengthMs,
              volumeVariation: metric.volumeVariation,
              monotoneScore: metric.monotoneScore,
              talkListenRatio: metric.talkListenRatio,
              clarityScore: metric.clarityScore,
              keywordAdherenceScore: metric.keywordAdherenceScore,
              objectionHandledScore: metric.objectionHandledScore,
              closingStrengthScore: metric.closingStrengthScore,
              confidenceScore: metric.confidenceScore,
              overallScore: metric.overallScore,
              transcriptConfidence: metric.transcriptConfidence,
              tipsJson: metric.tipsJson,
              paceTimelineJson: metric.paceTimelineJson,
            },
          },
        },
      });
    }
  }

  // A few assignments from manager to reps
  const dueSoon = new Date(now + 3 * 24 * 60 * 60 * 1000);
  const dueLater = new Date(now + 9 * 24 * 60 * 60 * 1000);

  const existingAssignments = await prisma.assignment.count();
  if (existingAssignments === 0) {
    await prisma.assignment.create({
      data: {
        managerId: manager.id,
        repId: reps[0].id,
        scenarioId: scenarios[4].id,
        note: "Focus on staying calm through the first objection before pitching value.",
        dueDate: dueSoon,
        status: "PENDING",
      },
    });
    await prisma.assignment.create({
      data: {
        managerId: manager.id,
        repId: reps[1].id,
        scenarioId: scenarios[3].id,
        note: "Practice anchoring on value before dropping price.",
        dueDate: dueLater,
        status: "PENDING",
      },
    });
    await prisma.assignment.create({
      data: {
        managerId: manager.id,
        repId: reps[2].id,
        scenarioId: scenarios[0].id,
        note: "Nice work last week - keep sharpening your close.",
        dueDate: null,
        status: "DONE",
      },
    });
  }

  console.log("Seed complete.");
  console.log(`Manager: manager@driven2develop.dev / password123`);
  console.log(`Reps: rep1@driven2develop.dev ... rep5@driven2develop.dev / password123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
