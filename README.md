# Thrive 55+ — Career Direction Program (browser app, v1)

A self-contained, browser-based learning app for **The Thrive 55+ Career Direction Method™** — a career direction program for experienced nurses 55+ by Sue Adair, BSN, RN (Thrive 55+ Nursing Advantage™).

> Name the strain. Capture your value. Investigate your options.

## What's in the app

| Page | What it does |
|---|---|
| **Home** | Program overview, the three-part method, and the brand story |
| **The Program** | The six-week curriculum — 15 short lessons with progress tracking and weekly missions |
| **Lessons** | Big idea, learning objectives, and three interactive *pause-and-do* workbook moments (strain scoring, five strengths, one informed step) |
| **My Workbook** | The full interactive Career Direction Workbook — answers save automatically in the browser, printable, and downloadable as a text file |
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
```

Brand palette per the course design blueprint: teal `#187878`, navy `#1B3A5B`, coral `#E38E76` (accent only), warm cream backgrounds; Fraunces (headlines) + Inter (body), sized for readability at 55+.

---

© 2026 Sue Adair | Thrive 55+ Nursing Advantage™. All rights reserved.
