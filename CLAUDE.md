# CLAUDE.md — Project Context

## What this project is

Thrive 55+ Nursing Advantage™ — online courses and an AI-powered learning platform for nurses aged 55+, built around The Thrive 55+ Career Direction Method™. Melissa Jo Tully (repo owner, first-time software builder) collaborates with Sue Adair (on-camera instructor, content author, sells via her Wix site).

**Read `PLAN.md` first.** It is the master build plan (v1.0, July 8, 2026) for the platform: a Next.js (App Router) + TypeScript app on Vercel, Supabase (auth, Postgres with RLS, storage), the Anthropic API for the tutor, and ElevenLabs for voice. Six milestones (0–5): foundations → AI tutor chat → survey/outcomes engine → student portal → voice → pilot hardening.

## Current state

**No application code exists yet.** The repository currently holds planning documents, course content, brand assets, and HTML prototypes — see `README.md` for the full file map. The build starts at Milestone 0 in `PLAN.md`.

## Constraints that must survive any session

- **Everything runs on Melissa's accounts** (GitHub, Vercel, Supabase, Anthropic, ElevenLabs) — a requirement of the collaboration agreement with Sue. Confirmed reachable: Supabase org "Encountive", Vercel team slug `encountive`.
- **Anonymization is the heart of the deal**: research data keys to random participant codes, never names/emails; aggregate reports enforce a minimum group size of 5. Consent (exact wording preserved) is recorded before any research data collection.
- **Row Level Security on every table from day one.** Secrets only in Vercel environment variables — never in code or the browser.
- **Cost guards are non-negotiable**: Anthropic spend limit, per-student rate limits, and a `usage_events` table tracking tokens/costs per AI call.
- **No health information is ever collected** — this is career education, deliberately outside HIPAA territory.
- **Audience is 55+**: large readable text, strong contrast, keyboard navigation, magic-link (passwordless) sign-in, streaming AI answers. Accessibility is a requirement, not a polish step.
- **Deliberately out of scope for v1**: payments (Sue's Wix handles them), live webinar hosting, conversational voice agent, native mobile apps, multi-tenant support.

## Working with Melissa

She is a first-time software builder. Explain what you're building and why in plain language, keep milestones demoable in a browser, and never assume prior knowledge of developer tooling. Her decisions: naming, content, design choices, testing. Claude's job: the code.
