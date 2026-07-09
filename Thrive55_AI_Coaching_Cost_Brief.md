# Thrive 55+ — AI Coaching Cost Brief (Pilot Cohort)

**Status:** partner-facing summary · prepared for partnership planning · July 2026

This brief covers what the AI coach ("Hope") costs to operate for the pilot cohort, what it costs per learner, how cost scales with cohort size, and what evidence the pilot collects to price future cohorts. It intentionally describes costs and plans only — coaching design, prompts, and implementation details are proprietary and are not included here.

---

## 1. Summary

- **Pilot cohort (10 learners, 6 weeks): approximately $50–70 in allocated AI coaching cost, capped at $100.**
- **Per learner: roughly $5–7 for the full program.**
- Rule of thumb for planning: **every 10 minutes a learner spends in live voice conversation with Hope costs about $1.**
- The pilot doubles as an evidence run: actual minutes-per-learner are logged, so cohort 2 is priced on measured usage, not estimates.

## 2. What learners get

Hope is an always-available voice coach inside the Thrive 55+ app. After the Week 0 kickoff, a learner can open the My Coach page any time and talk with Hope — speaking or typing — about whatever the program has surfaced for them. Conversations are on-demand and unlimited during the pilot.

## 3. Pilot budget (10 learners, 6 weeks)

The company holds an **enterprise-tier voice-AI subscription** with a very high volume of included conversation minutes. The pilot cohort's entire expected usage fits comfortably within that existing capacity, so no per-cohort platform purchase is required; the figures below are the pilot's allocated share.

| Line item | Cost |
|---|---|
| Voice platform capacity (allocated share of the enterprise subscription) | $45–60 |
| Language-model inference (usage-based pass-through) | $2–10 |
| **Expected allocated total** | **$50–70** |
| Planning cap | $100 |

Concurrency is not a constraint: the enterprise tier supports far more simultaneous conversations than a 10-learner cohort can generate, so every learner could talk with Hope at once without degradation.

## 4. Usage assumptions behind the estimate

Voice sessions with an AI coach typically run about 5 minutes. Modeled adoption across a cohort:

| Segment | Share of cohort | Minutes over the 6-week program |
|---|---|---|
| Never start a conversation | ~45% | 0 |
| Try it once or twice | ~30% | ~8 |
| Weekly users | ~20% | ~30 |
| Heavy users (2–3 chats/week) | ~5% | ~120 |

Blended average: **~15 minutes per enrolled learner** over the program. For 10 learners that is ~150 total minutes — a small fraction of the enterprise plan's included capacity, which is why the pilot carries no usage-overage risk.

## 5. Cost at scale (current architecture)

At moderate usage (~20–25 minutes per learner per month), the allocated cost of the live-voice architecture is roughly:

| Cohort size | Approx. cost per 6-week cohort |
|---|---|
| 10 learners | $50–70 |
| 25 learners | $85–100 |
| 50 learners | $160–190 |
| 100 learners | $310–375 |

Per-learner cost stays in the **$2–4 per cohort** range at scale under the current architecture. The planned migration to an open-source model stack (see the AI-First Technology Roadmap) reduces this by one to two orders of magnitude.

## 6. Cost controls in place

- **Session length cap** on the coach agent (~10–15 minutes per conversation) so no single session can run up the meter.
- **Inactivity timeout** so an abandoned tab does not continue billing.
- **Cost-managed model selection** for the coach's reasoning during the pilot.
- **Capacity headroom**: the enterprise subscription's included minutes far exceed pilot needs, so even unexpectedly heavy usage creates no overage exposure.

## 7. Evidence the pilot collects

Every conversation is logged with its duration, giving measured data on:

- Adoption: what share of learners use the coach at all
- Frequency: conversations per learner per week
- Depth: average and peak session length
- Total minutes per learner — the single number that drives all future cost projections

This data directly informs cohort 2 pricing and the go/no-go on the open-source migration described in the companion roadmap document.

---

© 2026 Sue Adair | Thrive 55+ Nursing Advantage. All rights reserved.
