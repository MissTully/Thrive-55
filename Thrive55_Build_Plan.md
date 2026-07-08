# Thrive 55+ Learning Platform — Build Plan

**Prepared for:** Melissa Jo Tully · **Date:** July 8, 2026 · **Version:** 1.0

This is the master plan for building your AI-powered tutoring platform. It is written for you as a first-time software builder: every milestone explains what we are building, why it comes in that order, and what you personally need to do versus what Claude will do in the build sessions. When we start building, this file becomes `PLAN.md` in the root of your GitHub repository, so the plan and the code live together.

---

## 1. What We Are Building

One web application, deployed on your own accounts, with four modules delivered in sequence:

1. **AI Tutor Chat** — students ask questions about the course and get patient, judgment-free answers from Claude (the Anthropic API). This is the heart of the product and the demo that proves your value to Sue.
2. **Survey and Outcomes Engine** — consent capture at signup, pre-course and post-course surveys, and an anonymized aggregate report. This produces the outcome data that your agreement with Sue says is yours.
3. **Student Portal** — registered students sign in to watch course videos, download the ebook, and find the webinar link. This is the "self-service course app" from your original vision.
4. **Voice** — tutor answers read aloud in a warm, natural ElevenLabs voice, designed for learners who prefer listening to reading. A conversational voice agent is a later stretch goal, not part of version 1.

The whole thing runs on **your** accounts (a requirement of the Sue deal): code on GitHub, hosting on Vercel, database and login on Supabase, AI on your Anthropic API key, voice on your ElevenLabs account. Sue's only integration step is pointing a subdomain at it.

## 2. How the Pieces Fit Together

```
Student's browser
      │
      ▼
learn.yourdomain.com  ──  Next.js app hosted on VERCEL
      │                        │
      │  login, data           │  server-side API routes (secrets live here)
      ▼                        ▼
SUPABASE                  ANTHROPIC API (Claude) ──► tutor answers
  · Auth (email sign-in)  ELEVENLABS API ──► spoken audio
  · Postgres database
  · File storage (ebook, cached audio)

GITHUB holds the code. Every push to the main branch automatically
deploys to Vercel. No manual uploading, ever.
```

Key idea for a first-time builder: the student's browser never talks to Anthropic or ElevenLabs directly. All secret keys stay on the server (Vercel's API routes). The browser only ever talks to *your* app, which checks who the student is before doing anything.

**Confirmed accounts this session can already reach:** Supabase organization "Encountive" and Vercel team "misstully's projects" (slug `encountive`). GitHub, Anthropic, and ElevenLabs keys will be added as environment variables during Milestone 0.

## 3. Technology Choices and Why

| Choice | What it is | Why this one |
|---|---|---|
| Next.js (App Router) + TypeScript | The web framework | The default framework for Vercel — zero-configuration deploys, and the largest pool of tutorials and AI-assisted help when you are stuck |
| Tailwind CSS + shadcn/ui | Styling and components | Accessible, professional components out of the box; easy to apply Thrive 55+ brand colors; strong defaults for larger text sizes your audience needs |
| Supabase Auth, email sign-in | Student login | Passwordless "magic link" email sign-in — no passwords to forget, which matters for a 55+ audience; password option can be added later |
| Supabase Postgres + Row Level Security | The database | Row Level Security (RLS) enforces "students can only see their own data" *inside the database itself*, not just in app code — the single most important safety net for a novice-built app |
| Supabase Storage | Files | Holds the ebook (delivered via expiring signed links so only enrolled students can download) and cached voice audio |
| Anthropic API, streaming | The tutor brain | Streaming means answers appear word by word instead of a long silent wait — essential for trust with older learners. Model is a configuration setting: Claude Sonnet class for quality at reasonable cost, Haiku class where speed/cost matters |
| ElevenLabs Text-to-Speech | Voice | Best-in-class natural voices; one warm consistent voice becomes part of the product's personality. Generated audio for repeated content is cached in Storage so you never pay twice for the same sentence |
| Course videos: unlisted Vimeo or YouTube embeds | Video hosting | Video files are huge; professional video hosts handle streaming quality automatically. The portal gates the *pages* behind login and stores only embed links in the database. A dedicated host like Mux is a later upgrade if needed |

## 4. Data Model (the database tables)

Plain-English version — the exact SQL comes in Milestone 0.

| Table | What it holds |
|---|---|
| `profiles` | One row per registered student: display name, email, role (student / admin), and a random **participant code** used for research data |
| `courses` | One row per course (starts with one: the AI-confidence course) |
| `lessons` | Ordered lessons in a course: title, description, video embed link, downloadable resources |
| `enrollments` | Which student is in which course, and when they joined |
| `consents` | A timestamped record of each student agreeing (or declining) that their anonymized data may be used for outcomes research — the exact wording they saw is stored with it |
| `surveys` / `survey_questions` | The pre-course and post-course instruments; questions are editable without touching code |
| `survey_responses` | Answers, keyed to the **participant code**, never to name or email |
| `chat_sessions` / `chat_messages` | Each student's tutor conversations (so students can pick up where they left off, and so you can measure usage) |
| `audio_cache` | Fingerprint of text → stored audio file, so repeated read-alouds are free |
| `usage_events` | Token counts and costs per AI call — this powers your cost dashboard and the "cost check-in" clause in the Sue agreement |

**The anonymization design, because it is the heart of your deal:** names and emails live only in `profiles`. Research data (`survey_responses`) is keyed to a random participant code. The aggregate report is built from a database view that (a) joins only on participant codes, and (b) refuses to display any group smaller than 5 people, so no individual can be picked out of a small cohort. This is what lets you honestly tell Sue's students "your name is never attached to your answers."

## 5. Build Sequence

Six milestones. Each one ends with something you can see working in a browser. Estimated calendar time assumes a few build sessions per week; the labor is mostly Claude's — your job is decisions, testing, and content.

### Milestone 0 — Foundations (first build session)
Create the GitHub repository, scaffold the Next.js app, create the Supabase project with the full database schema and RLS policies, connect GitHub to Vercel, set all environment variables, and deploy. **Done when:** you can visit the live URL, sign in with a magic link email, and see an empty dashboard that knows your name.

### Milestone 1 — AI Tutor Chat (sessions 2–4)
The chat interface: large readable text, streaming answers, conversation history that persists. The tutor's system prompt encodes its personality — patient, encouraging, never condescending, grounded in the course content you and Sue write, honest when it does not know. Includes per-student rate limits and a monthly spend guard so a runaway conversation can never surprise you on your Anthropic bill. **Done when:** a test student can hold a natural multi-day conversation about course material, and you can watch cost-per-conversation in the database.

### Milestone 2 — Survey and Outcomes Engine (sessions 5–6)
Consent screen at first sign-in (wording from the Sue agreement, Section 5), pre-course survey gate, post-course survey, and the aggregate results page with the minimum-group-size rule. Exportable as CSV for the white paper. **Done when:** you can run a fake cohort of test accounts end to end and pull an anonymized aggregate report that would satisfy a skeptical reviewer.

### Milestone 3 — Student Portal (sessions 7–9)
Course home with ordered lessons, embedded videos, progress ticks, ebook download via expiring signed links, webinar section (date, description, join link). Admin screens for you: add or edit lessons, upload the ebook, see enrollment. **Done when:** a brand-new student can go from Sue's email link → sign up → consent → pre-survey → watch lesson 1 → ask the tutor a question, with no human help.

### Milestone 4 — Voice (sessions 10–11)
A listen button on every tutor answer and every lesson description, streamed from ElevenLabs with cache-first logic. One voice, chosen by you from ElevenLabs' library, becomes the product voice. **Done when:** answers play in a natural voice with under two seconds of delay, and repeated plays cost zero credits.

### Milestone 5 — Pilot Hardening (sessions 12–13)
Your admin analytics dashboard (active students, tutor usage, costs, survey completion rates), error alerting, a full accessibility pass (font sizes, contrast, keyboard navigation — non-negotiable for this audience), and a dry-run pilot with 3–5 friendly testers before any real student touches it.

**Deliberately not in version 1:** payments (Sue's Wix handles them — the deal), live webinar hosting (link out to Zoom), the conversational voice agent, native mobile apps, and multi-tenant "other coaches" support. Every one of these is a natural version 2 candidate; building them now would delay the pilot by months.

## 6. What It Costs Per Month

Estimates at pilot scale (up to ~100 active students), using pricing verified July 8, 2026:

| Service | Pilot cost | Notes |
|---|---|---|
| GitHub | $0 | Free tier is fully sufficient |
| Vercel | $0 – $20 | Free Hobby tier likely covers the pilot; Pro is $20/month if limits are hit |
| Supabase | $0 – $25 | Free tier covers development; Pro at $25/month recommended once real students arrive (daily backups) |
| Anthropic API | ~$5 – $40 | Worked example: a tutor exchange ≈ 3,000 input tokens (mostly cached course context) + 400 output. At Sonnet-class rates ($2/M input, $0.20/M cached, $10/M output) that is roughly $0.007 per exchange → a student chatting 30 times a month costs ≈ $0.20. 100 such students ≈ $20/month |
| ElevenLabs | $6 – $22 | Starter ($6/month, ~30 min of speech) for development; Creator ($22/month, ~121 min) for the pilot. Audio caching stretches these dramatically |
| Domain | ~$1 – $2 | ~$12–20/year for your own domain if you do not already have one |
| **Total** | **~$12 – $110/month** | Scales with real usage — and `usage_events` gives you the per-student number that feeds the cost check-in clause with Sue |

The strategic point for your negotiation: at roughly $0.20–0.50 of AI cost per active student per month, your marginal cost is small — but it is *per student*, which is exactly why the enrollment-threshold clause belongs in the agreement.

## 7. Security and Privacy Commitments

Row Level Security on every table from day one. Secret keys only ever in Vercel environment variables, never in code, never in the browser. Consent recorded before any research data is collected, with the exact wording preserved. Research data keyed to participant codes with a minimum-group-size rule on all reporting. No health information collected, ever — this is career education, and staying clearly outside HIPAA territory keeps your compliance burden sane. Students can request deletion; their profile is erased while their already-anonymized survey rows (which cannot be traced back) survive, and the consent text says exactly that.

## 8. How It Connects to Sue's Wix Site

Sue adds one DNS record (a CNAME) pointing a subdomain — say `learn.suesdomain.com` — at Vercel, or you host it at `learn.yourdomain.com` and she simply links to it from her course page. Either way: her Wix site sells the course and collects payment; the confirmation email contains the sign-up link to your app; your app takes it from there. Nothing installs inside Wix, which keeps the "your software stays on your account" lane of the deal perfectly clean. The simplest enrollment flow for the pilot is a per-cohort invite code students enter at signup (upgrade path: a small automation that provisions accounts from Wix purchase notifications).

## 9. What You Need to Do Before the First Build Session

1. **Anthropic:** confirm your API key works at console.anthropic.com and set a monthly spend limit there (start at $25 — a hard ceiling while we develop).
2. **ElevenLabs:** confirm your account tier; free tier is fine for the first sessions.
3. **GitHub:** know your username and be signed in; we will create the repository together in the session.
4. **Decide two names:** the repository name (suggestion: `thrive55-platform`) and the product name students will see (this can change later).
5. **Domain:** decide whether the app lives on a subdomain of a domain you own, or one of Sue's. Not blocking — Vercel gives a free `.vercel.app` URL until this is decided.
6. **Content (can trail the build):** the course outline and any written material for the tutor's knowledge base, the ebook file, video embed links as they exist, and the pre/post survey questions you want (I can draft research-grade ones for review).

## 10. Risks Worth Naming

**The Sue timeline.** Her foundation course comes first and version 1 here takes roughly 8–13 sessions. Building now is still right — you walk into the collaboration with a working product instead of a promise — but expect weeks where the code is ready and the partnership is not. Milestones 1–2 are exactly the demo that turns "when the timing is right" into a date.

**Scope creep.** Four modules is already ambitious for a first build. The milestone order is designed so that stopping after any milestone still leaves something real: even Milestone 1 alone is a demonstrable AI tutor.

**Cost surprises.** Guarded three ways: the spend limit at Anthropic, the in-app rate limits, and the `usage_events` dashboard. You should never learn about a cost problem from an invoice.

**Single-founder bus factor.** Everything lives in accounts you own, and this plan lives in the repository. Any competent developer (or any Claude session) can pick up where we left off.

---

*Next step when you are ready: say "let's start Milestone 0" in a new session (or this one), and we will go from empty repository to a live, deployed sign-in page in that sitting.*
