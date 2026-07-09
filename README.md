# Thrive 55+ — Career Direction Program (browser app, v1)

A self-contained, browser-based learning app for **The Thrive 55+ Career Direction Method** — a career direction program for experienced nurses 55+ by Sue Adair, BSN, RN (Thrive 55+ Nursing Advantage).

> Name the strain. Capture your value. Investigate your options.

## What's in the app

| Page | What it does |
|---|---|
| **Home** | Program overview, the three-part method, and the brand story |
| **The Program** | The six-week cohort journey — each week anchored by a live webinar with Sue and Alyson; the week's 15 short lessons unlock after attending, with progress tracking and weekly missions |
| **Lessons** | Big idea, learning objectives, and three interactive *pause-and-do* workbook moments (strain scoring, five strengths, one informed step) |
| **My Workbook** | The full interactive Career Direction Workbook — answers save automatically in the browser, printable, and downloadable as a text file. After the kickoff webinar, the printable PDF edition of the workbook unlocks for download |
| **Roles Explorer** | Nursing and nursing-adjacent role categories with search titles, red flags & tradeoffs, and the Concern → Question → Evidence tool |
| **Resources** | Two program articles and the method-at-a-glance infographic |

## Running it

No build step and no server-side code — it's plain HTML/CSS/JS.

- **Locally:** open `index.html` in any modern browser, or serve the folder (`python3 -m http.server`) and visit `http://localhost:8000`.
- **Hosted:** the repo works as-is on GitHub Pages, Vercel, or Netlify (static site, root directory).

All learner data (lesson progress and workbook answers) is stored in the browser's `localStorage` — nothing is sent anywhere. This is the version-1 foundation; accounts, video hosting, the AI tutor, surveys, and voice are the platform milestones described in `Thrive55_Build_Plan.md`.

## Structure

```
index.html            app shell
assets/css/style.css  design system (brand palette, type, components)
assets/js/data.js     all program content (curriculum, workbook, roles, articles)
assets/js/app.js      hash router, views, localStorage persistence
assets/img/           web-optimized program imagery
assets/downloads/     learner downloads (workbook PDF, unlocked by kickoff attendance)
webinars/             presenter slide decks for the live webinars
```

## Webinar slide decks

`webinars/week0-kickoff-slides.html` is the presenter deck for the one-hour Week 0 kickoff webinar (cohort building, learning goals, program structure, and discussion prompts throughout). Open it in a browser and present full-screen: arrow keys / space / click to navigate, **N** toggles presenter notes with facilitation cues, **?** shows all shortcuts, and printing gives one slide per page. Each slide carries its slot in the 60-minute run of show.

`webinars/Thrive55_Week0_Kickoff_Zoom.pptx` is the same kickoff deck as a PowerPoint for presenting over **Zoom** (also imports directly into Google Slides via File → Import slides). Every slide's speaker notes carry the run-of-show cue plus the exact Zoom steps for that moment — launching and sharing polls, opening 8-minute breakout rooms with auto-assign and countdown, running chat storms, Raise Hand for discussion, and screen-share swaps for the app tour. Slide 1 is a facilitator setup checklist (polls to pre-create, co-host duties) — hide it before presenting.

Brand palette per the course design blueprint: teal `#187878`, navy `#1B3A5B`, coral `#E38E76` (accent only), warm cream backgrounds; Fraunces (headlines) + Inter (body), sized for readability at 55+.

---

© 2026 Sue Adair | Thrive 55+ Nursing Advantage. All rights reserved.
