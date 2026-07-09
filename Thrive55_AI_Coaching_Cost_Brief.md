# Thrive 55+ — AI Coaching Cost Brief (Pilot Cohort)

**Status:** partner-facing summary · prepared for partnership planning · July 2026

This brief covers what the AI coach ("Hope") costs to operate for the pilot cohort, what it costs per learner, how cost scales with cohort size, and what evidence the pilot collects to price future cohorts. It intentionally describes costs and plans only — coaching design, prompts, and implementation details are proprietary and are not included here.

---

## 1. Summary

- **Pilot cohort (10 learners, 6 weeks): approximately $50–70 total, capped at $100.**
- **Per learner: roughly $5–7 for the full program.**
- Rule of thumb for planning: **every 10 minutes a learner spends in live voice conversation with Hope costs about $1.**
- The pilot doubles as an evidence run: actual minutes-per-learner are logged, so cohort 2 is priced on measured usage, not estimates.

## 2. What learners get

Hope is an always-available voice coach inside the Thrive 55+ app. After the Week 0 kickoff, a learner can open the My Coach page any time and talk with Hope — speaking or typing — about whatever the program has surfaced for them. Conversations are on-demand and unlimited during the pilot.

## 3. Pilot budget (10 learners, 6 weeks)

| Line item | Cost |
|---|---|
| Voice AI platform subscription (Creator tier, 2 billing months) | $44 |
| Conversation minutes beyond the included bundle (only if usage runs heavy) | $0–15 |
| Language-model inference (usage-based pass-through) | $2–10 |
| **Expected total** | **$50–70** |
| Planning cap | $100 |

The subscription tier includes 275 conversation minutes per month and supports all 10 learners talking to Hope simultaneously. Overage beyond the bundle bills at $0.08 per minute.

## 4. Usage assumptions behind the estimate

Voice sessions with an AI coach typically run about 5 minutes. Modeled adoption across a cohort:

| Segment | Share of cohort | Minutes over the 6-week program |
|---|---|---|
| Never start a conversation | ~45% | 0 |
| Try it once or twice | ~30% | ~8 |
| Weekly users | ~20% | ~30 |
| Heavy users (2–3 chats/week) | ~5% | ~120 |

Blended average: **~15 minutes per enrolled learner** over the program. For 10 learners that is ~150 total minutes — inside the plan's included bundle, which is why the expected pilot cost is close to the subscription floor.

## 5. Cost at scale (current architecture)

At moderate usage (~20–25 minutes per learner per month), the live-voice architecture costs roughly:

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
- **Budget-tier language model** selected for the agent's reasoning during the pilot.
- **Plan-tier right-sizing**: subscription tier is matched to cohort size and can be downgraded between cohorts.

## 7. Evidence the pilot collects

Every conversation is logged with its duration, giving measured data on:

- Adoption: what share of learners use the coach at all
- Frequency: conversations per learner per week
- Depth: average and peak session length
- Total minutes per learner — the single number that drives all future cost projections

This data directly informs cohort 2 pricing and the go/no-go on the open-source migration described in the companion roadmap document.

---

© 2026 Sue Adair | Thrive 55+ Nursing Advantage. All rights reserved.
