# Thrive 55+ — AI-First Technology Roadmap

**Status:** partner-facing summary · prepared for partnership planning · July 2026

This document states the company's technology posture and the migration plan for the AI coach across cohorts. It describes strategy, cost trajectory, and decision gates. The coaching persona, prompts, curriculum integration, and implementation architecture are proprietary and are deliberately not described here.

---

## 1. Company posture: AI-first

Thrive 55+ is an **AI-first company**. The product is not a course website with an AI feature attached — it is an **AI-native application**: the coach, the workbook, and the curriculum are designed together so the AI coach can meet each learner where she actually is in the method. Human teaching (live webinars with the founders) anchors the cohort; the AI coach extends that teaching into every moment a learner needs to talk something through.

Two commitments follow from that posture:

- **Model-portable by design.** The coach's intelligence is not welded to any single vendor. The reasoning layer is built to run on **open-source (open-weight) language models**, keeping the company independent of proprietary model pricing and able to serve the coach through whichever host is most cost-effective.
- **Evidence-driven rollout.** Each cohort is instrumented. Technology decisions (including the migration below) are made on measured learner behavior, not projections.

## 2. Current release — pilot cohort

The pilot ships the highest-fidelity coaching experience available: **real-time voice conversation** through a managed voice-AI platform. The learner talks with Hope the way she would talk with a colleague — natural speech, immediate responses, interruptions allowed.

- **Why this first:** the pilot's job is to prove learners *want* an AI coach and to measure how they use one. Real-time voice is the strongest version of the experience, so the evidence it produces is the most decisive.
- **Capacity:** the company holds an enterprise-tier subscription with a very high volume of included conversation minutes, so pilot usage is fully covered with substantial headroom.
- **Cost:** approximately $5–7 per learner in allocated cost for the full program (detailed in the companion Cost Brief).
- **Trade-off accepted:** dependence on a managed platform. Comfortable at pilot scale given the enterprise capacity; the migration below removes the dependence entirely.

## 3. Next release — open-source model stack (cohort 2)

Cohort 2 migrates the coach to an **open-source LLM served through pay-per-use hosting**, with an open-source voice for Hope. Nothing about this requires owning servers: open-weight models are served by usage-priced inference hosts, so cost scales with actual conversations and idles at zero.

| | Pilot (current) | Cohort 2 (open-source stack) |
|---|---|---|
| Conversation style | Real-time voice call | Conversational exchanges with spoken replies |
| Reasoning | Platform-selected model | **Open-source LLM**, host-portable |
| Voice | Managed platform voice | Open-source voice |
| Cost per learner per cohort | ~$5–7 (allocated) | **under $0.10** |
| Vendor lock-in | Managed-platform subscription | None — model weights are open, hosts are interchangeable |

- **One-time migration cost:** a few days of build work, budgeted once and amortized across every future cohort.
- **Voice transition:** Hope's voice changes with the migration. This is introduced to learners deliberately ("Hope's new voice") rather than silently.
- **Deliberately not self-hosted (yet):** running our own GPU infrastructure costs $300–700/month regardless of usage and only pays off at hundreds of concurrent learners. Pay-per-use hosting of open models delivers the open-source cost advantage without that fixed overhead. Self-hosting remains an option on the shelf for scale.

## 4. Decision gates (what the pilot evidence decides)

| Pilot finding | Cohort 2 decision |
|---|---|
| Learners value the coach but rarely use voice | Migrate to text-first coaching on the open-source LLM — cheapest path, near-zero marginal cost |
| Learners actively use and value voice | Migrate to the open-source voice + LLM stack as planned |
| Heavy, sustained voice usage at growing scale | Revisit self-hosting economics with real concurrency numbers |

## 5. What this document does not include

The following are proprietary to Thrive 55+ Nursing Advantage and are not shared in partnership documents: the coach's persona and coaching instructions, the method's integration between coach, workbook, and curriculum, prompt and grounding design, vendor identities and account configuration, and implementation architecture. Vendor agreements and subscription terms are confidential; the company holds an enterprise-tier subscription with a very high volume of included conversation minutes.

---

© 2026 Sue Adair | Thrive 55+ Nursing Advantage. All rights reserved.
