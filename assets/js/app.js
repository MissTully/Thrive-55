/* ============================================================
   Thrive 55+ App (hash router + views + saved progress)
   All learner data stays in this browser via localStorage.
   ============================================================ */

const STORE_KEY = "thrive55.v1";

const defaultState = () => ({
  name: "",
  completed: {},                 // lessonId -> true
  strain: { body: 5, interruption: 5, change: 5 },
  strainEvidence: "",
  strengths: ["", "", "", "", ""],
  carryStrength: "",
  leaveBehind: "",
  conversations: [
    { person: "", learned: "", suggested: "" },
    { person: "", learned: "", suggested: "" },
    { person: "", learned: "", suggested: "" }
  ],
  tradeoffAccept: "",
  tradeoffReject: "",
  openQuestion: "",
  skillGap: "",
  skillGapPlan: "",
  nextStep: null,                // index into NEXT_STEPS
  nextStepBy: "",
  nextStepLearn: "",
  intention: "",
  webinars: {},                  // weekId -> true once attended
  surveys: {
    pre:  { answers: {}, date: null },
    post: { answers: {}, open: {}, recommend: null, date: null }
  },
  certName: ""
});

let S = load();

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return Object.assign(defaultState(), JSON.parse(raw));
  } catch (e) { /* corrupted storage — start fresh */ }
  return defaultState();
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* private mode */ }
}

const esc = s => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const img = f => `assets/img/${f}`;

/* ---------- progress helpers ---------- */
const allLessonIds = Object.keys(LESSONS);
const doneCount = () => allLessonIds.filter(id => S.completed[id]).length;
const pctDone = () => Math.round(100 * doneCount() / allLessonIds.length);
const weekDone = w => w.lessons.filter(id => S.completed[id]).length;
const highestStrain = () => {
  const entries = STRAIN_AREAS.map(a => [a, S.strain[a.key]]);
  entries.sort((x, y) => y[1] - x[1]);
  return entries[0];
};
const surveyDone = kind => !!(S.surveys && S.surveys[kind] && S.surveys[kind].date);
const weekUnlocked = wId => !!(S.webinars && S.webinars[wId]);
const articleWeek = id => WEEKS.find(w => w.reading === id);
const coachUnlocked = () => weekUnlocked("w0");   // Hope joins after the kickoff webinar
function kickoffGateView(title, body) {
  return `
  <section>
    <div class="wrap narrow center" style="padding:48px 0">
      <span class="pill navy">🔒 Opens with your cohort</span>
      <h1 style="margin-top:16px;font-size:clamp(26px,3.6vw,36px)">${title}</h1>
      <p class="lede muted" style="max-width:36em;margin:0 auto 10px">${body}</p>
      <div style="margin-top:24px">
        ${surveyDone("pre")
          ? `<a class="btn big" href="#/program">Go to the program</a>`
          : `<a class="btn big coral" href="#/survey/pre">🔑 Take the starting-point survey</a>`}
      </div>
    </div>
  </section>`;
}
function attendWebinar(wId) {
  if (!surveyDone("pre")) { location.hash = "#/survey/pre"; return; }
  S.webinars[wId] = true; save(); render();
}
const allLessonsDone = () => doneCount() === allLessonIds.length;
const certEarned = () => surveyDone("pre") && surveyDone("post");
const fmtDate = iso => new Date(iso + "T12:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
const todayISO = () => {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
};

/* ============================================================
   Shared chrome
   ============================================================ */
function navHTML(active) {
  const links = [
    ["home", "#/", "Home"],
    ["program", "#/program", "The Program"],
    ["coach", "#/coach", "My Coach"],
    ["workbook", "#/workbook", "My Workbook"],
    ["roles", "#/roles", "Roles Explorer"],
    ["resources", "#/resources", "Resources"]
  ];
  return `
  <a class="skip-link" href="#main">Skip to main content</a>
  <header class="site-header">
    <div class="wrap">
      <a class="logo" href="#/" aria-label="Thrive 55+ home"><svg class="logo-mark" viewBox="0 0 48 48" width="36" height="36" aria-hidden="true"><circle cx="24" cy="24" r="22.5" fill="#187878"/><path d="M24 36V21" stroke="#FBF8F3" stroke-width="2.8" stroke-linecap="round"/><path d="M24 22c-.4-7-5.5-11-12-11 .5 7 5.5 11 12 11z" fill="#8FD4C2"/><path d="M24 18c.4-6 5-9.5 11-9.5-.5 6-5 9.5-11 9.5z" fill="#FBF8F3"/><path d="M15 38q9 5 18 0" stroke="#E38E76" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg><span>Thrive&nbsp;<b>55+</b></span></a>
      <nav class="main-nav" aria-label="Main navigation">
        ${links.map(([k, href, label]) =>
          `<a href="${href}" ${k === active ? 'class="active" aria-current="page"' : ""}>${label}</a>`).join("")}
      </nav>
    </div>
  </header>`;
}

function footerHTML() {
  return `
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid">
        <div>
          <a class="logo" href="#/"><svg class="logo-mark" viewBox="0 0 48 48" width="36" height="36" aria-hidden="true"><circle cx="24" cy="24" r="22.5" fill="#187878"/><path d="M24 36V21" stroke="#FBF8F3" stroke-width="2.8" stroke-linecap="round"/><path d="M24 22c-.4-7-5.5-11-12-11 .5 7 5.5 11 12 11z" fill="#8FD4C2"/><path d="M24 18c.4-6 5-9.5 11-9.5-.5 6-5 9.5-11 9.5z" fill="#FBF8F3"/><path d="M15 38q9 5 18 0" stroke="#E38E76" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg><span>Thrive&nbsp;<b>55+</b></span></a>
          <p style="margin-top:14px;font-size:15.5px;max-width:30em">${esc(BRAND.tagline)} A career direction program for experienced nurses deciding what comes next, without treating you as less than.</p>
        </div>
        <div>
          <h4>Program</h4>
          <a href="#/program">The six-week program</a>
          <a href="#/workbook">My workbook</a>
          <a href="#/roles">Roles explorer</a>
        </div>
        <div>
          <h4>Learn</h4>
          <a href="#/article/evolving">You're Not Done, You're Just Evolving</a>
        </div>
      </div>
      <div class="fineprint">
        <p style="margin-bottom:6px">The Thrive 55+ Career Direction Method is original to Thrive 55+ Nursing Advantage and reflects Sue Adair's professional experience, coaching work, and educational design.</p>
        <p style="margin:0">${esc(BRAND.copyright)}</p>
      </div>
    </div>
  </footer>`;
}

/* ============================================================
   HOME
   ============================================================ */
function homeView() {
  const pct = pctDone();
  return `
  <section class="hero">
    <div class="wrap hero-grid">
      <div>
        <span class="pill coral">For nurses 55+ · Cohort program · Live weekly webinars</span>
        <h1>You're not done.<br>You're just <em style="color:var(--teal);font-style:normal">evolving</em>.</h1>
        <p class="lede">You still love nursing. You also dread the next shift. Both can be true, and there's a name for what you're feeling. In six weeks, with a cohort of nurses like you and live weekly webinars with Sue and Alyson, you'll find it and decide what comes next on your terms.</p>
        ${surveyDone("pre") ? `
        <div class="hero-ctas">
          <a class="btn big" href="#/program">${pct > 0 ? "Continue the program" : "Go to the program"}</a>
          <a class="btn big ghost" href="#/workbook">Open my workbook</a>
        </div>` : `
        <div class="hero-ctas">
          <a class="btn big coral" href="#/survey/pre">🔑 Take the starting-point survey</a>
          <a class="btn big ghost" href="#/program">Peek at the six-week journey</a>
        </div>
        <p class="muted" style="font-size:15px;margin-top:14px;max-width:32em">Five minutes, seven questions. It's your key to the program, and at the end you'll see exactly how far you've come.</p>`}
      </div>
      <div class="hero-img">
        <img src="${img("hero-walking.jpg")}" alt="Two experienced nurses walking and talking outside a healthcare building">
        <div class="hero-badge"><b>The Thrive 55+ Career Direction Method</b>${esc(BRAND.tagline)}</div>
      </div>
    </div>
  </section>

  <section class="tinted">
    <div class="wrap">
      <div class="center" style="max-width:720px;margin:0 auto 40px">
        <span class="eyebrow">Inside the program</span>
        <h2>One method. Three questions. Six weeks.</h2>
        <p class="muted">The answers are yours to find. The method shows you where to look.</p>
      </div>
      <div class="grid cols-3">
        <div class="card pillar">
          <div class="num" aria-hidden="true">1</div>
          <div class="q" style="font-size:19px;font-family:var(--serif);color:var(--navy)">What is wearing you down?</div>
          <p>It's not that you're done. It's something more specific, and it has a name. Naming it is the first thing your cohort does together.</p>
        </div>
        <div class="card pillar">
          <div class="num" aria-hidden="true">2</div>
          <div class="q" style="font-size:19px;font-family:var(--serif);color:var(--navy)">What do you bring with you?</div>
          <p>More than you think. The skills you've been writing off as "just the job" are the ones employers can't teach and AI can't touch.</p>
        </div>
        <div class="card pillar">
          <div class="num" aria-hidden="true">3</div>
          <div class="q" style="font-size:19px;font-family:var(--serif);color:var(--navy)">What comes next?</div>
          <p>There's a way to find out without applying for a single job, and without betting your income on a guess. We'll show you how.</p>
        </div>
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="feature-row">
        <div>
          <span class="eyebrow">Sound familiar?</span>
          <h2>Thirty years of skill. One growing question.</h2>
          <p>Your judgment has never been sharper. Your body keeps a different score. The call lights, the lifting, one more new charting system, and somewhere in there a quiet voice asking: <em>how long can I keep doing it this way?</em></p>
          <p>Most nurses carry that question alone, as dread. In this program you'll carry it with a cohort, and you'll put it down changed: named, measured, and turned into a plan.</p>
          <a class="btn coral" href="#/survey/pre">Start with the five-minute survey</a>
        </div>
        <div class="feature-img"><img src="${img("workshop.jpg")}" alt="Experienced nurses in a supportive workshop discussion"></div>
      </div>

      <div class="feature-row flip">
        <div class="feature-img"><img src="${img("discussion.jpg")}" alt="Experienced nurses in a warm group discussion"></div>
        <div>
          <span class="eyebrow">A cohort, not a course library</span>
          <h2>You won't do this alone</h2>
          <p>Every week starts live: a webinar with Sue and Alyson and a room full of nurses who get it, because they're standing where you're standing. You'll laugh, compare notes, and hear what everyone else is finding out there.</p>
          <p>Each week's materials open after your cohort meets, so everyone walks the same road together, one week at a time.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="cream2 tight">
    <div class="wrap">
      <div class="stats">
        <div class="card stat"><div class="n">6</div><div class="l">live weekly webinars with Sue &amp; Alyson</div></div>
        <div class="card stat"><div class="n">15</div><div class="l">short lessons, none over 8 minutes</div></div>
        <div class="card stat"><div class="n">1</div><div class="l">cohort walking beside you</div></div>
        <div class="card stat"><div class="n">1</div><div class="l">coach named Hope, whenever you need her</div></div>
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="grid cols-2" style="align-items:center;gap:48px">
        <div>
          <span class="eyebrow">What you'll walk away with</span>
          <h2>Six weeks from now, you'll have…</h2>
          <ul style="font-size:17px;line-height:1.7">
            <li>A clear, honest read on what's really wearing you down (it's probably not what you think)</li>
            <li>A named list of strengths you've been dismissing for years</li>
            <li>A shortlist of directions worth investigating, built from real information, not fear</li>
            <li>One committed next step, with a date on it</li>
            <li>Your before-and-after results, and a certificate worth hanging on the wall</li>
          </ul>
        </div>
        <div class="center">
          <p class="bigquote" style="font-size:clamp(22px,2.6vw,28px)">"The highest score does not tell you to panic. <em>It tells you where to look first.</em>"</p>
          <p class="quote-attr">${esc(BRAND.founder)} · ${esc(BRAND.founderTitle)}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="tight">
    <div class="wrap">
      <div class="photo-band">
        <img src="${img("bridge.jpg")}" alt="Two women crossing a bridge together, symbolizing career transition">
        <div class="overlay"><div class="overlay-inner">
          <h2>Your next chapter is a bridge, not a cliff</h2>
          <p>Six weeks. A cohort beside you. Sue and Alyson up front. And you, walking across at your own pace.</p>
          <a class="btn coral" href="${surveyDone("pre") ? "#/program" : "#/survey/pre"}">${surveyDone("pre") ? "Go to the program" : "Take the first step"}</a>
        </div></div>
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="center" style="max-width:680px;margin:0 auto 36px">
        <span class="eyebrow">A free read while you decide</span>
        <h2>Not ready yet? Start here.</h2>
      </div>
      ${(a => `
      <a class="card article-card" href="#/article/${a.id}" style="max-width:560px;margin:0 auto">
        <div class="a-img"><img src="${img(a.image)}" alt=""></div>
        <div class="body">
          <span class="pill teal">${a.minutes} min read</span>
          <h3 style="margin-top:12px">${esc(a.title)}</h3>
          <p class="muted" style="margin:0">${esc(a.subtitle)}</p>
        </div>
      </a>`)(ARTICLES[0])}
    </div>
  </section>`;
}

/* ============================================================
   PROGRAM (curriculum dashboard)
   ============================================================ */
function programView() {
  const pct = pctDone();
  return `
  <section class="tight">
    <div class="wrap">
      <span class="eyebrow" style="margin-top:20px">The program</span>
      <h1 style="font-size:clamp(30px,4vw,42px)">Six weeks, together.</h1>
      <p class="lede muted" style="max-width:42em">Every week begins with a <b>live webinar with Sue and Alyson</b>. Your cohort learns together and shares together. After each webinar, that week's lessons unlock here: <b>Learn</b> (short lessons, none over eight minutes), <b>Do</b> (a workbook mission), <b>Share</b> (bring what you found back to the cohort).</p>
      <div style="max-width:520px;margin:18px 0 8px">
        <div style="display:flex;justify-content:space-between;font-size:15px;margin-bottom:6px">
          <span class="muted">Overall progress</span>
          <b style="color:var(--teal-deep)">${doneCount()} of ${allLessonIds.length} lessons complete</b>
        </div>
        <div class="progress-track" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Program progress"><span style="width:${pct}%"></span></div>
      </div>
      ${!surveyDone("pre") ? `
      <div class="callout-coral" style="margin-top:22px;display:flex;gap:20px;align-items:center;justify-content:space-between;flex-wrap:wrap">
        <div style="max-width:36em">
          <h3 style="font-size:19px">🔑 First: capture your starting point</h3>
          <p style="margin:0">A five-minute survey is the key to the program. It unlocks your workbook and each week's materials, and at the end you'll answer the same questions to see exactly how far you've come.</p>
        </div>
        <a class="btn coral" href="#/survey/pre">Take the starting-point survey</a>
      </div>` : allLessonsDone() && !surveyDone("post") ? `
      <div class="callout-coral" style="margin-top:22px;display:flex;gap:20px;align-items:center;justify-content:space-between;flex-wrap:wrap">
        <div style="max-width:36em">
          <h3 style="font-size:19px">You've finished every lesson 🎉</h3>
          <p style="margin:0">One last step: the final survey. Complete it to see your before-and-after results and receive your certificate of completion.</p>
        </div>
        <a class="btn coral" href="#/survey/post">Take the final survey</a>
      </div>` : certEarned() ? `
      <div class="callout-coral" style="margin-top:22px;display:flex;gap:20px;align-items:center;justify-content:space-between;flex-wrap:wrap">
        <div style="max-width:36em">
          <h3 style="font-size:19px">Certificate earned</h3>
          <p style="margin:0">Your before-and-after results and your certificate are ready whenever you want them.</p>
        </div>
        <a class="btn coral" href="#/certificate">View my certificate</a>
      </div>` : ""}
    </div>
  </section>

  <section class="tight" style="padding-top:20px">
    <div class="wrap grid cols-2">
      ${WEEKS.map(w => {
        const total = w.lessons.length, done = weekDone(w);
        const unlocked = weekUnlocked(w.id);
        return `
        <div class="card week-card">
          <div class="week-img"><img src="${img(w.image)}" alt=""></div>
          <div class="body">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
              <span class="pill teal">${esc(w.label)}</span>
              <span class="muted" style="font-size:14px">${unlocked ? `${done}/${total} done` : "🔒 locked"}</span>
            </div>
            <h3>${esc(w.title)}</h3>
            <p class="theme">${esc(w.theme)}</p>
            <div class="webinar-row ${unlocked ? "attended" : ""}">
              <div class="webinar-info">
                <span class="webinar-live">🎥 LIVE WEBINAR · Sue &amp; Alyson</span>
                <span class="webinar-topic">${esc(w.webinar)}</span>
              </div>
              ${unlocked
                ? `<span class="pill teal" style="flex-shrink:0">✔ Attended</span>`
                : surveyDone("pre")
                  ? `<button class="btn coral sm" style="flex-shrink:0" onclick="attendWebinar('${w.id}')">I attended this webinar</button>`
                  : `<a class="btn coral sm" style="flex-shrink:0" href="#/survey/pre">🔑 Survey first</a>`}
            </div>
            <div>
              ${w.lessons.map(id => {
                const L = LESSONS[id];
                const done = !!S.completed[id];
                return unlocked ? `
                <a class="lesson-row ${done ? "done" : ""}" href="#/lesson/${id}">
                  <span class="code">${L.code}</span>
                  <span class="t">${esc(L.title)}</span>
                  <span class="mins">~${L.mins} min</span>
                  <span class="check" aria-label="${done ? "Completed" : "Not completed"}">${done ? "✔" : "○"}</span>
                </a>` : `
                <div class="lesson-row locked" aria-disabled="true">
                  <span class="code">${L.code}</span>
                  <span class="t">${esc(L.title)}</span>
                  <span class="mins">~${L.mins} min</span>
                  <span class="check">🔒</span>
                </div>`;
              }).join("")}
            </div>
            ${w.reading ? (a => unlocked ? `
            <a class="lesson-row" href="#/article/${a.id}">
              <span class="code" style="background:var(--coral-tint);color:var(--coral-dark)">READ</span>
              <span class="t">${esc(a.title)}</span>
              <span class="mins">${a.minutes} min</span>
              <span class="check">📖</span>
            </a>` : `
            <div class="lesson-row locked" aria-disabled="true">
              <span class="code" style="background:var(--coral-tint);color:var(--coral-dark)">READ</span>
              <span class="t">${esc(a.title)}</span>
              <span class="mins">${a.minutes} min</span>
              <span class="check">🔒</span>
            </div>`)(ARTICLES.find(x => x.id === w.reading)) : ""}
            ${!unlocked ? `<p class="muted" style="font-size:13.5px;margin:2px 0 12px">Materials open after this week's live webinar. Your cohort's meeting day, time, and join link will be emailed to you.</p>` : ""}
            <div class="mission"><b>This week's mission:</b> ${esc(w.mission)}</div>
          </div>
        </div>`;
      }).join("")}
    </div>
  </section>

  <section class="tight">
    <div class="wrap">
      <div class="callout-coral" style="display:flex;gap:24px;align-items:center;flex-wrap:wrap;justify-content:space-between">
        <div style="max-width:38em">
          <h3>Your workbook travels with you</h3>
          <p style="margin:0">Three lessons pause and open a workbook step right on the page: your strain scores, your five strengths, and your one informed step. Everything saves automatically in this browser.${weekUnlocked("w0") ? "" : " The printable PDF edition unlocks with the kickoff webinar."}</p>
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <a class="btn coral" href="#/workbook">Open my workbook</a>
          ${weekUnlocked("w0") ? `<a class="btn ghost" href="assets/downloads/thrive55-career-direction-workbook.pdf" download="Thrive 55+ Career Direction Workbook.pdf">Download the PDF</a>` : ""}
        </div>
      </div>
    </div>
  </section>`;
}

/* ============================================================
   LESSON
   ============================================================ */
function lessonView(id) {
  const L = LESSONS[id];
  if (!L) return notFoundView();
  const W = WEEKS.find(w => w.id === L.week);
  if (!weekUnlocked(W.id)) {
    return `
    <section>
      <div class="wrap narrow center" style="padding:48px 0">
        <span class="pill navy">🔒 Opens after the webinar</span>
        <h1 style="margin-top:16px;font-size:clamp(26px,3.6vw,36px)">This lesson unlocks with your cohort</h1>
        <p class="lede muted" style="max-width:36em;margin:0 auto 10px">${esc(W.label)} begins live: <b style="color:var(--navy)">${esc(W.webinar)}</b>. Attend the webinar with Sue and Alyson, then come back. This week's lessons open right after.</p>
        <p class="muted" style="font-size:15px;margin-bottom:26px">Your cohort's meeting day, time, and join link will be emailed to you.</p>
        <a class="btn big" href="#/program">Back to the program</a>
      </div>
    </section>`;
  }
  const ids = allLessonIds;
  const idx = ids.indexOf(id);
  const prev = idx > 0 ? ids[idx - 1] : null;
  const next = idx < ids.length - 1 ? ids[idx + 1] : null;
  const done = !!S.completed[id];

  return `
  <section class="tight">
    <div class="wrap narrow">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="#/program">The Program</a> · ${esc(W.label)} · ${esc(W.title)}</nav>
      <div style="display:flex;gap:10px;align-items:center;margin-top:16px;flex-wrap:wrap">
        <span class="pill teal">${L.code} · ~${L.mins} min</span>
        ${done ? '<span class="pill coral">✔ Completed</span>' : ""}
      </div>
      <h1 style="font-size:clamp(28px,4vw,40px);margin-top:14px">${esc(L.title)}</h1>

      <div class="lesson-hero">
        <img src="${img(L.image)}" alt="">
        <div class="play-chip"><span><span class="tri" aria-hidden="true">▶</span> Video lesson · coming in version 2</span></div>
      </div>

      <div class="bigidea"><span class="eyebrow" style="margin-bottom:6px">The big idea</span>${esc(L.bigIdea)}</div>

      <h3 style="margin-top:32px">In this lesson, you will be able to…</h3>
      <ul class="objectives">${L.objectives.map(o => `<li>${esc(o)}</li>`).join("")}</ul>

      <p class="muted" style="font-size:15.5px">Connects to your workbook: <b style="color:var(--teal-deep)">${esc(L.workbook)}</b></p>

      ${L.activity ? activityHTML(L.activity) : ""}

      <div style="margin-top:34px;display:flex;gap:12px;flex-wrap:wrap;align-items:center">
        <button class="btn ${done ? "ghost" : ""}" onclick="toggleComplete('${id}')">${done ? "✔ Completed (tap to undo)" : "Mark lesson complete"}</button>
        <a class="btn ghost" href="#/workbook">Open my workbook</a>
        <a class="btn ghost" href="#/coach">Talk it through with Hope</a>
      </div>

      <div class="lesson-nav">
        ${prev ? `<a class="btn ghost" href="#/lesson/${prev}">← ${esc(LESSONS[prev].title)}</a>` : "<span></span>"}
        ${next ? `<a class="btn" href="#/lesson/${next}">${esc(LESSONS[next].title)} →</a>`
               : allLessonsDone() && !surveyDone("post") ? `<a class="btn coral" href="#/survey/post">Take the final survey →</a>`
               : certEarned() ? `<a class="btn coral" href="#/certificate">My results &amp; certificate →</a>`
               : `<a class="btn coral" href="#/workbook#wb-summary">Finish in your workbook →</a>`}
      </div>
    </div>
  </section>`;
}

function toggleComplete(id) {
  if (S.completed[id]) delete S.completed[id]; else S.completed[id] = true;
  save(); render();
}

/* ---------- Pause-and-do activities (shared with workbook) ---------- */
function activityHTML(kind) {
  const inner = {
    strain: () => `
      <p class="muted" style="margin-top:2px">Drag each slider to where it really sits today. Your answers save to your workbook automatically.</p>
      ${strainSlidersHTML()}`,
    strengths: () => `
      <p class="muted" style="margin-top:2px">Name five strengths you keep dismissing because they feel ordinary.</p>
      ${strengthsInputsHTML()}`,
    conversations: () => `
      <p class="muted" style="margin-top:2px">They don't have to be perfect contacts. They only need to know something useful. Log each conversation as you have it.</p>
      ${conversationsHTML()}`,
    nextstep: () => `
      <p class="muted" style="margin-top:2px">Pick just one. That's how career direction begins.</p>
      ${nextStepHTML()}`
  }[kind];
  const titles = {
    strain: "Pause & do · Score your three strain areas",
    strengths: "Pause & do · Five strengths you keep dismissing",
    conversations: "Pause & do · Log your three conversations",
    nextstep: "Pause & do · Choose one informed step"
  };
  return `
  <div class="pausedo">
    <div class="pd-head">
      <span class="pill coral">⏸ Pause & do</span>
      <h3 style="margin:0;font-size:19px">${titles[kind].split("· ")[1]}</h3>
    </div>
    ${inner()}
  </div>`;
}

function strainSlidersHTML() {
  const [top] = highestStrain();
  return `
  ${STRAIN_AREAS.map(a => `
  <div class="slider-row">
    <div class="slider-label">
      <label for="sl_${a.key}" style="margin:0">${esc(a.name)}</label>
      <span class="score" id="sv_${a.key}">${S.strain[a.key]}<span style="font-size:15px;color:var(--muted)">/10</span></span>
    </div>
    <div class="examples">${esc(a.examples)}</div>
    <input type="range" id="sl_${a.key}" min="1" max="10" step="1" value="${S.strain[a.key]}"
      aria-label="${esc(a.name)} score from 1 to 10"
      oninput="setStrain('${a.key}', this.value)">
  </div>`).join("")}
  <div class="hint" id="strainHint">${strainHintText()}</div>`;
}
function strainHintText() {
  const [top, score] = highestStrain();
  return `Your highest strain is <b>${top.name.toLowerCase()} (${score}/10)</b>. That's where to look first. ${top.advice}`;
}
function setStrain(key, val) {
  S.strain[key] = +val; save();
  const sv = document.getElementById("sv_" + key);
  if (sv) sv.innerHTML = `${val}<span style="font-size:15px;color:var(--muted)">/10</span>`;
  document.querySelectorAll("#strainHint").forEach(h => h.innerHTML = strainHintText());
}

function strengthsInputsHTML() {
  return `
  ${S.strengths.map((v, i) => `
    <input type="text" style="margin-bottom:9px" placeholder="Strength ${i + 1}, e.g. ${esc(VALUE_SKILLS[(i * 3) % VALUE_SKILLS.length].toLowerCase())}"
      value="${esc(v)}" aria-label="Strength ${i + 1}" oninput="S.strengths[${i}]=this.value;save()">`).join("")}
  <p class="muted" style="font-size:14.5px;margin:8px 0 0">Need a spark? Tap to add:</p>
  <div class="chips">
    ${VALUE_SKILLS.map(sk => `<button type="button" class="chip" onclick="addStrength(this,'${esc(sk).replace(/'/g, "\\'")}')">${esc(sk)}</button>`).join("")}
  </div>`;
}
function addStrength(btn, text) {
  const i = S.strengths.findIndex(s => !s.trim());
  if (i === -1) return;
  S.strengths[i] = text; save(); render();
}

function conversationsHTML() {
  return S.conversations.map((c, i) => `
  <div class="card" style="padding:18px;margin-bottom:12px;box-shadow:none">
    <b style="color:var(--navy)">Conversation ${i + 1}</b>
    <label for="cv_p${i}">Person or role</label>
    <input type="text" id="cv_p${i}" value="${esc(c.person)}" placeholder="e.g. a former coworker now in case management"
      oninput="S.conversations[${i}].person=this.value;save()">
    <label for="cv_l${i}">What I learned</label>
    <textarea id="cv_l${i}" oninput="S.conversations[${i}].learned=this.value;save()">${esc(c.learned)}</textarea>
    <label for="cv_s${i}">Who else was suggested</label>
    <input type="text" id="cv_s${i}" value="${esc(c.suggested)}" oninput="S.conversations[${i}].suggested=this.value;save()">
  </div>`).join("") + `
  <details style="margin-top:6px">
    <summary style="cursor:pointer;font-weight:600;color:var(--teal-deep)">Questions to bring with you</summary>
    <ul style="margin-top:10px">${RECON_QUESTIONS.map(q => `<li>${esc(q)}</li>`).join("")}</ul>
  </details>`;
}

function nextStepHTML() {
  return `
  <div role="radiogroup" aria-label="Choose one informed next step">
  ${NEXT_STEPS.map((o, i) => `
    <label class="radio-option ${S.nextStep === i ? "selected" : ""}">
      <input type="radio" name="nextstep" ${S.nextStep === i ? "checked" : ""} onchange="S.nextStep=${i};save();render()">
      <span>${esc(o)}</span>
    </label>`).join("")}
  </div>
  <label for="ns_by">I will take it by</label>
  <input type="date" id="ns_by" value="${esc(S.nextStepBy)}" oninput="S.nextStepBy=this.value;save()">
  <label for="ns_learn">What I expect to learn</label>
  <textarea id="ns_learn" oninput="S.nextStepLearn=this.value;save()">${esc(S.nextStepLearn)}</textarea>`;
}

/* ============================================================
   WORKBOOK
   ============================================================ */
function workbookView() {
  if (!surveyDone("pre")) {
    return `
    <section>
      <div class="wrap narrow center" style="padding:48px 0">
        <span class="pill coral">🔑 One step first</span>
        <h1 style="margin-top:16px;font-size:clamp(26px,3.6vw,36px)">Your workbook opens with the starting-point survey</h1>
        <p class="lede muted" style="max-width:36em;margin:0 auto 10px">Five minutes, seven honest statements. It's your baseline. At the end of the program you'll answer the same questions and see exactly how far you've come. It unlocks your workbook and the weekly program materials.</p>
        <div style="margin-top:24px"><a class="btn big coral" href="#/survey/pre">Take the survey and unlock my workbook</a></div>
      </div>
    </section>`;
  }
  const [top, topScore] = highestStrain();
  const strengthsNamed = S.strengths.filter(s => s.trim());
  return `
  <section class="tight">
    <div class="wrap narrow">
      <span class="eyebrow" style="margin-top:20px">My workbook</span>
      <h1 style="font-size:clamp(30px,4vw,42px)">The Career Direction Workbook</h1>
      <p class="lede muted" style="max-width:38em">Everything you capture in a lesson lands here, and everything here travels with you into the next lesson. Answers save automatically in this browser.</p>
      ${weekUnlocked("w0") ? `
      <div class="callout-coral no-print" style="display:flex;gap:20px;align-items:center;flex-wrap:wrap;justify-content:space-between;margin:6px 0 4px">
        <div style="max-width:38em">
          <h3 style="margin-bottom:4px">📄 Your printable workbook</h3>
          <p style="margin:0">The full Career Direction Workbook as a PDF — print it, write in it by hand, and keep it beside you through all six weeks.</p>
        </div>
        <a class="btn coral" href="assets/downloads/thrive55-career-direction-workbook.pdf" download="Thrive 55+ Career Direction Workbook.pdf">Download the workbook (PDF)</a>
      </div>` : `
      <p class="muted no-print" style="font-size:15px">🔒 The printable workbook (PDF) unlocks after the Week 0 kickoff webinar — attend, mark it in <a href="#/program">the program</a>, and the download appears here.</p>`}
      <div class="wb-toc" aria-label="Workbook sections">
        <a href="#wb-strain">1 · Strain</a>
        <a href="#wb-value">2 · Value</a>
        <a href="#wb-options">3 · Options</a>
        <a href="#wb-flags">Red flags</a>
        <a href="#wb-skill">Skill gap</a>
        <a href="#wb-step">Next step</a>
        <a href="#wb-summary">My method</a>
      </div>

      <!-- 1 · STRAIN -->
      <div class="wb-section" id="wb-strain">
        <div class="card">
          <div class="wb-head"><span class="stepnum">Step 1</span><h2 style="margin:0">Strain: what is wearing you down?</h2></div>
          <p class="muted">You may still care about nursing. You may still be fully capable. The question is what the work is asking from your body, attention, recovery, and ability to keep adapting.</p>
          <table class="guide-table">
            <caption class="muted" style="text-align:left;font-size:14px;padding-bottom:6px">Strain scoring guide</caption>
            <tbody>
            ${STRAIN_GUIDE.map(g => `<tr><td>${g.range}</td><td>${esc(g.meaning)}</td></tr>`).join("")}
            </tbody>
          </table>
          <div style="margin-top:22px">${strainSlidersHTML()}</div>
          <label for="wb_sev">Evidence from my work or recovery: what would the next role need to reduce or change?</label>
          <textarea id="wb_sev" oninput="S.strainEvidence=this.value;save()">${esc(S.strainEvidence)}</textarea>
        </div>
      </div>

      <!-- 2 · VALUE -->
      <div class="wb-section" id="wb-value">
        <div class="card">
          <div class="wb-head"><span class="stepnum">Step 2</span><h2 style="margin:0">Value: what do you bring with you?</h2></div>
          <p class="muted">You have spent years reading the patient, the family, the room, the shift, the unit, the workflow, the risk, and the problem before someone else officially names it. These are not compliments. They are evidence of your working value.</p>
          ${strengthsInputsHTML()}
          <label for="wb_carry">One strength I want to carry into my next role</label>
          <input type="text" id="wb_carry" value="${esc(S.carryStrength)}" oninput="S.carryStrength=this.value;save()">
          <label for="wb_leave">One work condition I do not want to carry forward unchanged</label>
          <input type="text" id="wb_leave" value="${esc(S.leaveBehind)}" oninput="S.leaveBehind=this.value;save()">
        </div>
      </div>

      <!-- 3 · OPTIONS -->
      <div class="wb-section" id="wb-options">
        <div class="card">
          <div class="wb-head"><span class="stepnum">Step 3</span><h2 style="margin:0">Options: reconnaissance</h2></div>
          <p class="muted">Investigating options is not choosing a final job today. Study the work, ask people who know it, and compare what you learn. <a href="#/roles">Browse role categories and search titles →</a></p>
          <h3 style="margin-top:18px">Talk to three people this week</h3>
          ${conversationsHTML()}
        </div>
      </div>

      <!-- RED FLAGS -->
      <div class="wb-section" id="wb-flags">
        <div class="card">
          <div class="wb-head"><span class="stepnum">Check</span><h2 style="margin:0">Red flags & tradeoffs</h2></div>
          <p class="muted">A red flag doesn't mean no. It means look closer before you leap.</p>
          <label for="wb_ta">The tradeoff I may be willing to accept</label>
          <input type="text" id="wb_ta" value="${esc(S.tradeoffAccept)}" oninput="S.tradeoffAccept=this.value;save()">
          <label for="wb_tr">The tradeoff I am not willing to accept</label>
          <input type="text" id="wb_tr" value="${esc(S.tradeoffReject)}" oninput="S.tradeoffReject=this.value;save()">
          <label for="wb_oq">The question I need answered before moving forward</label>
          <input type="text" id="wb_oq" value="${esc(S.openQuestion)}" oninput="S.openQuestion=this.value;save()">
          <details style="margin-top:16px">
            <summary style="cursor:pointer;font-weight:600;color:var(--teal-deep)">Common tradeoffs to watch for</summary>
            <div style="margin-top:12px">${RED_FLAGS.map(f => `<div class="flag-item">${esc(f)}</div>`).join("")}</div>
          </details>
        </div>
      </div>

      <!-- SKILL GAP -->
      <div class="wb-section" id="wb-skill">
        <div class="card">
          <div class="wb-head"><span class="stepnum">Check</span><h2 style="margin:0">Skill gap or stop sign?</h2></div>
          <p class="muted">Do not confuse “I have not done this lately” with “I cannot learn this.” Skills can be rebuilt, technology can be learned in pieces, and new terminology becomes familiar. Needing time, repetition, or support is different from being incapable.</p>
          <label for="wb_sg">A skill or technology I need to evaluate</label>
          <input type="text" id="wb_sg" value="${esc(S.skillGap)}" oninput="S.skillGap=this.value;save()">
          <label for="wb_sgp">My first learning step</label>
          <input type="text" id="wb_sgp" value="${esc(S.skillGapPlan)}" oninput="S.skillGapPlan=this.value;save()">
        </div>
      </div>

      <!-- NEXT STEP -->
      <div class="wb-section" id="wb-step">
        <div class="card">
          <div class="wb-head"><span class="stepnum">Commit</span><h2 style="margin:0">Your next informed step</h2></div>
          <p class="muted">You do not have to solve your whole career today. You have to take the next informed step.</p>
          ${nextStepHTML()}
        </div>
      </div>

      <!-- SUMMARY -->
      <div class="wb-section" id="wb-summary">
        <div class="card summary-card">
          <span class="eyebrow">My Career Direction Method</span>
          <h2>Name the strain. Capture your value. Investigate your options.</h2>
          <div class="summary-grid">
            <div class="cell">
              <div class="k">Highest strain</div>
              <div class="v">${esc(top.name)}, ${topScore}/10</div>
            </div>
            <div class="cell">
              <div class="k">Strengths named</div>
              <div class="v">${strengthsNamed.length} of 5${S.carryStrength ? ` · carrying “${esc(S.carryStrength)}”` : ""}</div>
            </div>
            <div class="cell">
              <div class="k">My next informed step</div>
              <div class="v">${S.nextStep !== null ? esc(NEXT_STEPS[S.nextStep]) : "Not chosen yet"}</div>
            </div>
          </div>
          ${strengthsNamed.length ? `<p style="font-size:16px"><b style="color:var(--navy)">My strengths:</b> ${strengthsNamed.map(esc).join(" · ")}</p>` : ""}
          ${S.nextStepBy ? `<p style="font-size:16px"><b style="color:var(--navy)">By:</b> ${esc(S.nextStepBy)}${S.nextStepLearn ? `, expecting to learn: ${esc(S.nextStepLearn)}` : ""}</p>` : ""}
          <p class="serif" style="font-size:20px;color:var(--teal-deep);margin:18px 0 20px">You now have a way to start.</p>
          <div class="wb-actions no-print">
            <a class="btn coral" href="#/coach">Talk it through with Hope</a>
            <button class="btn" onclick="window.print()">Print / save as PDF</button>
            <button class="btn ghost" onclick="downloadWorkbook()">Download my answers (.txt)</button>
            <button class="btn ghost" onclick="resetWorkbook()">Reset workbook</button>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function downloadWorkbook() {
  const [top, topScore] = highestStrain();
  const lines = [
    "THE THRIVE 55+ CAREER DIRECTION METHOD: MY WORKBOOK",
    "Name the strain. Capture your value. Investigate your options.",
    "",
    "STRAIN",
    ...STRAIN_AREAS.map(a => `${a.name}: ${S.strain[a.key]}/10`),
    `Highest strain: ${top.name} (${topScore}/10)`,
    S.strainEvidence ? `Evidence / what the next role must change: ${S.strainEvidence}` : null,
    "",
    "VALUE",
    ...S.strengths.filter(s => s.trim()).map((s, i) => `Strength ${i + 1}: ${s}`),
    S.carryStrength ? `Carrying forward: ${S.carryStrength}` : null,
    S.leaveBehind ? `Not carrying forward unchanged: ${S.leaveBehind}` : null,
    "",
    "OPTIONS: THREE CONVERSATIONS",
    ...S.conversations.flatMap((c, i) => c.person || c.learned ? [
      `Conversation ${i + 1}: ${c.person}`,
      c.learned ? `  Learned: ${c.learned}` : null,
      c.suggested ? `  Suggested next: ${c.suggested}` : null
    ] : [null]),
    "",
    "RED FLAGS & TRADEOFFS",
    S.tradeoffAccept ? `May accept: ${S.tradeoffAccept}` : null,
    S.tradeoffReject ? `Will not accept: ${S.tradeoffReject}` : null,
    S.openQuestion ? `Question to answer first: ${S.openQuestion}` : null,
    "",
    "SKILL GAP OR STOP SIGN",
    S.skillGap ? `To evaluate: ${S.skillGap}` : null,
    S.skillGapPlan ? `First learning step: ${S.skillGapPlan}` : null,
    "",
    "MY NEXT INFORMED STEP",
    S.nextStep !== null ? NEXT_STEPS[S.nextStep] : "(not chosen yet)",
    S.nextStepBy ? `By: ${S.nextStepBy}` : null,
    S.nextStepLearn ? `Expecting to learn: ${S.nextStepLearn}` : null,
    "",
    "You now have a way to start.",
    BRAND.copyright
  ].filter(l => l !== null);
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "thrive55-my-workbook.txt";
  a.click();
  URL.revokeObjectURL(a.href);
}

function resetWorkbook() {
  if (!confirm("Clear all workbook answers? Lesson progress will be kept.")) return;
  const completed = S.completed;
  S = defaultState();
  S.completed = completed;
  save(); render();
}

/* ============================================================
   ROLES EXPLORER
   ============================================================ */
function rolesView() {
  if (!weekUnlocked("w0")) {
    return kickoffGateView(
      "The Roles Explorer unlocks after your first webinar",
      "Role categories, search titles, and the red-flag checklist are part of the program. Attend the Week 0 kickoff webinar with Sue and Alyson, unlock the week, and this whole explorer opens with it."
    );
  }
  return `
  <section class="tight">
    <div class="wrap">
      <span class="eyebrow" style="margin-top:20px">Roles explorer</span>
      <h1 style="font-size:clamp(30px,4vw,42px)">Nursing roles & search titles to explore</h1>
      <p class="lede muted" style="max-width:42em">Categories are starting points, not answers. Each one has tradeoffs. Evaluate every role against your highest strain.</p>
      <div class="callout-coral" style="margin:22px 0 34px">
        <h3 style="font-size:18px">How to use this list</h3>
        <p style="margin:0">${esc(ROLE_HOWTO)}</p>
      </div>
      <div class="grid cols-3">
        ${ROLE_GROUPS.map(g => `
        <div class="card role-card">
          <h3>${esc(g.title)}</h3>
          <p class="blurb">${esc(g.blurb)}</p>
          <ul>${g.roles.map(r => `<li>${esc(r)}</li>`).join("")}</ul>
        </div>`).join("")}
      </div>
    </div>
  </section>

  <section class="tinted tight">
    <div class="wrap">
      <div class="grid cols-2" style="align-items:start">
        <div>
          <h2>Concern → Question → Evidence</h2>
          <p class="muted">Reconnaissance turns fear into information. Convert a concern into a question you can investigate, and know where you'll get the answer.</p>
          <table class="guide-table" style="background:#fff;border-radius:14px;overflow:hidden">
            <thead><tr><th>Concern</th><th>Better question</th><th>Where to ask</th></tr></thead>
            <tbody>
              ${CQE.map(r => `<tr><td style="white-space:normal;font-weight:600;color:var(--navy)">${esc(r.concern)}</td><td>${esc(r.question)}</td><td class="muted">${esc(r.evidence)}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
        <div>
          <h2>Red flags & tradeoffs</h2>
          <p class="muted">A red flag doesn't mean no. It means look closer before you leap.</p>
          ${RED_FLAGS.map(f => `<div class="flag-item">${esc(f)}</div>`).join("")}
        </div>
      </div>
    </div>
  </section>

  <section class="tight">
    <div class="wrap center">
      <p class="bigquote">“A title that sounds unfamiliar may describe work you already understand. <em>A familiar title may hide demands you are trying to leave.</em>”</p>
      <div style="margin-top:26px"><a class="btn" href="#/workbook#wb-options">Log what you learn in my workbook</a></div>
    </div>
  </section>`;
}

/* ============================================================
   RESOURCES & ARTICLES
   ============================================================ */
function resourcesView() {
  if (!weekUnlocked("w0")) {
    return kickoffGateView(
      "Your reconnaissance toolkit unlocks after your first webinar",
      "The job research, interview preparation, and AI upskilling resources are part of the program. Attend the Week 0 kickoff webinar with Sue and Alyson, unlock the week, and the toolkit opens with it."
    );
  }
  return `
  <section class="tight">
    <div class="wrap">
      <span class="eyebrow" style="margin-top:20px">Resources</span>
      <h1 style="font-size:clamp(30px,4vw,42px)">Your reconnaissance toolkit</h1>
      <p class="lede muted" style="max-width:42em">Trusted places to research roles, practice for interviews, and build tech confidence, chosen for experienced nurses. Every link opens in a new tab so you never lose your place here.</p>

      <div class="grid cols-3" style="margin-top:26px;align-items:start">
        ${RESOURCE_GROUPS.map(g => `
        <div class="card role-card">
          <h3>${g.icon} ${esc(g.title)}</h3>
          <p class="blurb">${esc(g.blurb)}</p>
          <ul class="res-list">
            ${g.items.map(it => `
            <li>
              <a href="${it.url}" ${it.internal ? "" : 'target="_blank" rel="noopener"'}>
                <b>${esc(it.name)}</b>${it.internal ? "" : ' <span class="ext" aria-hidden="true">↗</span>'}
              </a>
              <span class="res-note">${esc(it.note)}</span>
            </li>`).join("")}
          </ul>
        </div>`).join("")}
      </div>
      <p class="muted" style="font-size:14px;margin-top:18px">Outside websites change and are not run by Thrive 55+. A listing is a starting point for your own reconnaissance, not an endorsement.</p>
    </div>
  </section>

  <section class="tinted tight">
    <div class="wrap">
      <div class="grid cols-2" style="align-items:start">
        <div>
          <h2 style="font-size:26px">Put the toolkit to work</h2>
          <p class="muted">These resources are the raw material for the method's missions: set up one job alert, read five postings without applying, check the real salary data, and rehearse your three-people questions before a real conversation.</p>
          <a class="btn" href="#/program">Open the program</a>
        </div>
        <div>
          <h2 style="font-size:26px">From the Thrive 55+ library</h2>
          <div style="margin-top:14px">
          ${ARTICLES.map(a => {
            const w = articleWeek(a.id);
            if (w && !weekUnlocked(w.id)) return `
            <div class="lesson-row locked" aria-disabled="true">
              <span class="code" style="background:var(--coral-tint);color:var(--coral-dark)">READ</span>
              <span class="t">${esc(a.title)}</span>
              <span class="mins">${esc(w.label)}</span>
              <span class="check">🔒</span>
            </div>`;
            return `
            <a class="lesson-row" href="#/article/${a.id}">
              <span class="code" style="background:var(--coral-tint);color:var(--coral-dark)">READ</span>
              <span class="t">${esc(a.title)}</span>
              <span class="mins">${a.minutes} min</span>
              <span class="check">📖</span>
            </a>`;
          }).join("")}
          </div>
        </div>
      </div>
    </div>
  </section>

  ${surveyDone("pre") ? `
  <section class="tight">
    <div class="wrap">
      <h2 class="center" style="margin-bottom:22px">The method at a glance</h2>
      <img class="method-graphic" src="${img("method-graphic.jpg")}"
        alt="Infographic of the Thrive 55+ Career Direction Method: three pillars: name the strain (score body, interruption, and change loads 1–10), capture your value (identify the ordinary skills AI cannot duplicate), and investigate your options (study postings, talk to people, extract requirements), plus moving from fear to information.">
    </div>
  </section>` : ""}`;
}

function articleView(id) {
  const A = ARTICLES.find(a => a.id === id);
  if (!A) return notFoundView();
  const W = articleWeek(id);
  if (W && !weekUnlocked(W.id)) {
    return `
    <section>
      <div class="wrap narrow center" style="padding:48px 0">
        <span class="pill navy">🔒 Program reading</span>
        <h1 style="margin-top:16px;font-size:clamp(26px,3.6vw,36px)">This reading unlocks with your cohort</h1>
        <p class="lede muted" style="max-width:36em;margin:0 auto 10px">"${esc(A.title)}" is part of ${esc(W.label)} · ${esc(W.title)}. Attend the webinar with Sue and Alyson, then come back. It opens with the rest of the week's materials.</p>
        <div style="margin-top:24px"><a class="btn big" href="#/program">Go to the program</a></div>
      </div>
    </section>`;
  }
  return `
  <section class="tight">
    <div class="wrap narrow">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="#/resources">Resources</a> · Article</nav>
      <span class="pill teal" style="margin-top:18px">${A.minutes} min read</span>
      <h1 style="margin-top:14px">${esc(A.title)}</h1>
      <p class="lede muted">${esc(A.subtitle)}</p>
      <div class="article-hero"><img src="${img(A.image)}" alt=""></div>
      <div class="article-body">
        ${A.sections.map(s => `<h2>${esc(s.h)}</h2>${s.p.map(p => `<p>${esc(p)}</p>`).join("")}`).join("")}
      </div>
      <div class="card pad" style="margin-top:36px;display:flex;gap:20px;align-items:center;justify-content:space-between;flex-wrap:wrap">
        <div>
          <h3 style="margin-bottom:4px">Ready to put it to work?</h3>
          <p class="muted" style="margin:0">The six-week program turns these ideas into your next informed step.</p>
        </div>
        <a class="btn" href="#/program">Start the program</a>
      </div>
    </div>
  </section>`;
}

/* ============================================================
   OUTCOMES SURVEYS (pre / post)
   ============================================================ */
function surveyView(kind) {
  if (kind !== "pre" && kind !== "post") return notFoundView();
  const isPre = kind === "pre";
  if (surveyDone(kind)) {
    return `
    <section>
      <div class="wrap narrow center" style="padding:40px 0">
        <span class="pill teal">✔ Completed ${fmtDate(S.surveys[kind].date)}</span>
        <h1 style="margin-top:16px">${isPre ? "You're in! The program is unlocked" : "Thank you! Your final survey is in"}</h1>
        <p class="lede muted" style="max-width:34em;margin:0 auto 24px">${isPre
          ? "Your starting point is saved, and your workbook and program materials are now open. When you finish the program, the final survey will show how far you've come."
          : "Your before-and-after results are ready, and so is your certificate."}</p>
        ${isPre
          ? `<a class="btn big" href="#/program">Go to the program</a> <a class="btn big ghost" href="#/workbook">Open my workbook</a>`
          : `<a class="btn big coral" href="#/certificate">See my results &amp; certificate</a>`}
      </div>
    </section>`;
  }
  if (!isPre && !allLessonsDone()) {
    return `
    <section>
      <div class="wrap narrow center" style="padding:40px 0">
        <span class="pill navy">🔒 Not yet</span>
        <h1 style="margin-top:16px">Finish the program first</h1>
        <p class="lede muted" style="max-width:34em;margin:0 auto 24px">The final survey opens after your last lesson. You've completed ${doneCount()} of ${allLessonIds.length}. That's what makes your before-and-after comparison honest.</p>
        <a class="btn big" href="#/program">Back to the program</a>
      </div>
    </section>`;
  }
  const saved = S.surveys[kind].answers || {};
  return `
  <section class="tight">
    <div class="wrap narrow">
      <span class="eyebrow" style="margin-top:20px">${isPre ? "Before you begin" : "The final step"}</span>
      <h1 style="font-size:clamp(28px,4vw,40px)">${isPre ? "Where are you starting from?" : "How far have you come?"}</h1>
      <p class="lede muted" style="max-width:40em">${isPre
        ? "Seven statements, about five minutes. Answer honestly. This is your baseline, and no answer is wrong. You'll answer the same statements at the end of the program to see what changed. Finishing unlocks your workbook and the program materials."
        : "The same seven statements you answered at the start. Answer for how things are today, then we'll show you the before and after, and your certificate."}</p>
      <p class="muted" style="font-size:14.5px">Your answers stay in this browser. We never ask about your health; this is career education only.</p>

      <form id="surveyForm" onsubmit="return submitSurvey('${kind}')">
        ${SURVEY_ITEMS.map((it, n) => `
        <fieldset class="card survey-item">
          <legend>${n + 1}. ${esc(it.text)}</legend>
          <div class="likert" role="radiogroup">
            ${LIKERT.map((lab, i) => `
            <label class="likert-opt ${saved[it.id] === i + 1 ? "selected" : ""}">
              <input type="radio" name="q_${it.id}" value="${i + 1}" ${saved[it.id] === i + 1 ? "checked" : ""} required
                onchange="S.surveys['${kind}'].answers['${it.id}']=${i + 1};save();this.closest('.likert').querySelectorAll('.likert-opt').forEach(o=>o.classList.remove('selected'));this.closest('.likert-opt').classList.add('selected')">
              <span class="num">${i + 1}</span>
              <span class="lab">${lab}</span>
            </label>`).join("")}
          </div>
        </fieldset>`).join("")}

        ${!isPre ? `
        <fieldset class="card survey-item">
          <legend>How likely are you to recommend this program to another experienced nurse?</legend>
          <div class="likert nps" role="radiogroup">
            ${Array.from({ length: 11 }, (_, i) => `
            <label class="likert-opt ${S.surveys.post.recommend === i ? "selected" : ""}">
              <input type="radio" name="q_recommend" value="${i}" ${S.surveys.post.recommend === i ? "checked" : ""} required
                onchange="S.surveys.post.recommend=${i};save();this.closest('.likert').querySelectorAll('.likert-opt').forEach(o=>o.classList.remove('selected'));this.closest('.likert-opt').classList.add('selected')">
              <span class="num">${i}</span>
            </label>`).join("")}
          </div>
          <div style="display:flex;justify-content:space-between;font-size:13.5px;color:var(--muted);margin-top:4px"><span>Not at all likely</span><span>Extremely likely</span></div>
        </fieldset>
        ${SURVEY_POST_OPEN.map(q => `
        <div class="card survey-item">
          <label for="open_${q.id}" style="margin-top:0;font-size:17px">${esc(q.label)}</label>
          <textarea id="open_${q.id}" oninput="S.surveys.post.open['${q.id}']=this.value;save()">${esc(S.surveys.post.open[q.id] || "")}</textarea>
        </div>`).join("")}` : ""}

        <div class="center" style="margin-top:26px">
          <button class="btn big ${isPre ? "" : "coral"}" type="submit">${isPre ? "Save my starting point" : "Finish and show my results"}</button>
          <p class="muted" id="surveyWarn" style="font-size:14.5px;margin-top:10px"></p>
        </div>
      </form>
    </div>
  </section>`;
}

function submitSurvey(kind) {
  const answers = S.surveys[kind].answers || {};
  const missing = SURVEY_ITEMS.filter(it => !answers[it.id]);
  const needRec = kind === "post" && S.surveys.post.recommend === null;
  if (missing.length || needRec) {
    const w = document.getElementById("surveyWarn");
    if (w) w.innerHTML = `<b style="color:var(--coral-dark)">Almost there: ${missing.length + (needRec ? 1 : 0)} question${missing.length + (needRec ? 1 : 0) > 1 ? "s" : ""} still unanswered.</b>`;
    return false;
  }
  S.surveys[kind].date = todayISO();
  save();
  location.hash = kind === "pre" ? "#/program" : "#/certificate";
  return false;
}

/* ============================================================
   RESULTS + CERTIFICATE
   ============================================================ */
function resultsHTML() {
  const pre = S.surveys.pre.answers, post = S.surveys.post.answers;
  const rows = SURVEY_ITEMS.map(it => {
    let a = pre[it.id], b = post[it.id];
    if (it.reverse) { a = 6 - a; b = 6 - b; }   // reverse-scored: higher = better
    const delta = b - a;
    const arrow = delta > 0 ? `<b style="color:var(--teal-deep)">▲ +${delta}</b>` : delta < 0 ? `<b style="color:var(--coral-dark)">▼ ${delta}</b>` : `<span class="muted">no change</span>`;
    return `<tr><td style="white-space:normal;font-weight:600;color:var(--navy)">${esc(it.maps)}</td><td>${a}/5</td><td>${b}/5</td><td>${arrow}</td></tr>`;
  }).join("");
  const avg = arr => arr.reduce((s, x) => s + x, 0) / arr.length;
  const preAvg = avg(SURVEY_ITEMS.map(it => it.reverse ? 6 - pre[it.id] : pre[it.id]));
  const postAvg = avg(SURVEY_ITEMS.map(it => it.reverse ? 6 - post[it.id] : post[it.id]));
  return `
  <div class="card pad" style="margin-bottom:30px">
    <span class="eyebrow">Your outcomes</span>
    <h2 style="font-size:26px">Before and after</h2>
    <p class="muted">Your self-assessment across the program's objectives (higher is better; the fear item is scored so that less fear-driven = higher).</p>
    <table class="guide-table">
      <thead><tr><th>Area</th><th>Before</th><th>After</th><th>Change</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="hint" style="margin-top:16px">Overall: <b>${preAvg.toFixed(1)} → ${postAvg.toFixed(1)} out of 5</b>${postAvg > preAvg ? ". That movement is yours. You earned it." : ""}</div>
  </div>`;
}

function certificateView() {
  if (!certEarned()) {
    const canPost = allLessonsDone() && surveyDone("pre");
    return `
    <section>
      <div class="wrap narrow center" style="padding:40px 0">
        <span class="pill navy">🔒 Almost there</span>
        <h1 style="margin-top:16px">Your certificate is waiting</h1>
        <p class="lede muted" style="max-width:36em;margin:0 auto 24px">
          ${!surveyDone("pre") ? "Take the pre-program survey, complete all fifteen lessons, then take the final survey, and this page becomes yours."
          : !allLessonsDone() ? `Complete the remaining lessons (${doneCount()} of ${allLessonIds.length} done), then take the final survey.`
          : "One step left: the final survey."}
        </p>
        ${canPost ? `<a class="btn big coral" href="#/survey/post">Take the final survey</a>` : `<a class="btn big" href="#/program">Back to the program</a>`}
        <div style="margin-top:18px"><button class="btn ghost sm" onclick="document.getElementById('certSample').style.display='block';this.style.display='none'">Peek at a sample certificate</button></div>
      </div>
      <div id="certSample" style="display:none">${certHTML("A Thrive 55+ Graduate", todayISO(), true)}</div>
    </section>`;
  }
  const name = S.certName || "";
  return `
  <section class="tight">
    <div class="wrap narrow no-cert-print">
      <span class="eyebrow" style="margin-top:20px">Congratulations</span>
      <h1 style="font-size:clamp(28px,4vw,40px)">You finished. This is yours.</h1>
      ${resultsHTML()}
      <div class="card pad" style="margin-bottom:26px">
        <label for="certName" style="margin-top:0">Your name as you'd like it on the certificate</label>
        <input type="text" id="certName" value="${esc(name)}" placeholder="e.g. Karen R. Mitchell, RN"
          oninput="S.certName=this.value;save();document.getElementById('certNameLine').textContent=this.value||'Your Name'">
        <div class="wb-actions" style="margin-top:14px">
          <button class="btn coral" onclick="window.print()">🖨 Print my certificate</button>
          <span class="muted" style="font-size:14px;align-self:center">Choose <b>Landscape</b> in the print dialog for best results.</span>
        </div>
      </div>
    </div>
    ${certHTML(name || "Your Name", S.surveys.post.date, false)}
  </section>`;
}

function certHTML(name, dateISO, sample) {
  return `
  <div class="cert-stage${sample ? " cert-sample" : ""}">
    <div class="certificate" role="img" aria-label="Certificate of completion for ${esc(name)}">
      <div class="cert-inner">
        ${sample ? '<div class="cert-ribbon">SAMPLE</div>' : ""}
        <div class="cert-brand">Thrive <b>55+</b> <span class="cert-sprout">❧</span></div>
        <div class="cert-sub">Nursing Advantage · The Career Direction Program</div>
        <h2 class="cert-title">${esc(CERT.title)}</h2>
        <div class="cert-rule"><span>✦</span></div>
        <p class="cert-presented">${esc(CERT.presented)}</p>
        <div class="cert-name" id="${sample ? "" : "certNameLine"}">${esc(name)}</div>
        <p class="cert-presented">${esc(CERT.forCompleting)}</p>
        <p class="cert-program">${esc(CERT.program)}</p>
        <p class="cert-detail">${esc(CERT.detail)}</p>
        <p class="cert-message">“${esc(CERT.message)}”</p>
        <div class="cert-tagline">${esc(CERT.tagline)}</div>
        <div class="cert-footer">
          <div class="cert-sig">
            <div class="cert-line"></div>
            <b>${esc(CERT.signer)}</b>
            <span>${esc(CERT.signerTitle)}</span>
          </div>
          <div class="cert-seal" aria-hidden="true"><span>55<i>+</i></span><em>❧</em></div>
          <div class="cert-sig">
            <div class="cert-line"></div>
            <b>${dateISO ? esc(fmtDate(dateISO)) : ""}</b>
            <span>Date of completion</span>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

/* ============================================================
   MY COACH (ElevenLabs conversational agent)
   ============================================================ */
function coachView() {
  if (!coachUnlocked()) {
    return `
    <section class="tight">
      <div class="wrap narrow center" style="padding:40px 0">
        <div class="hope-orb-wrap" style="width:min(220px,50vw);opacity:.85">
          <div class="hope-glow" aria-hidden="true" style="animation:none;opacity:.5"></div>
          <div class="hope-ring" aria-hidden="true" style="animation:none"></div>
          <img src="${img(COACH_IMAGE)}" alt="${COACH_NAME}, your Thrive 55+ coach">
        </div>
        <span class="pill navy">🔒 Meet her at the kickoff</span>
        <h1 style="margin-top:16px;font-size:clamp(26px,3.6vw,36px)">${COACH_NAME} joins you after your first webinar</h1>
        <p class="lede muted" style="max-width:34em;margin:0 auto 10px">Your coach is part of the cohort experience. Attend the Week 0 kickoff webinar with Sue and Alyson, unlock the week, and ${COACH_NAME} will be here whenever you need to talk something through.</p>
        <div style="margin-top:24px">
          ${surveyDone("pre")
            ? `<a class="btn big" href="#/program">Go to the program</a>`
            : `<a class="btn big coral" href="#/survey/pre">🔑 Take the starting-point survey</a>`}
        </div>
      </div>
    </section>`;
  }
  const [top, topScore] = highestStrain();
  const step = S.nextStep !== null ? NEXT_STEPS[S.nextStep] : null;
  return `
  <section class="tight">
    <div class="wrap narrow">
      <div class="center">
        <span class="eyebrow" style="margin-top:20px">My coach</span>
        <h1 style="font-size:clamp(30px,4vw,42px)">Talk it through with ${COACH_NAME}</h1>
      </div>

      <div class="hope-orb-wrap">
        <div class="hope-glow" aria-hidden="true"></div>
        <div class="hope-ring" aria-hidden="true"></div>
        <img src="${img(COACH_IMAGE)}" alt="${COACH_NAME}, your Thrive 55+ coach, an experienced nurse ready to listen">
      </div>
      <div class="hope-caption">
        <div class="name">${COACH_NAME}</div>
        <div class="role">Your Thrive 55+ career direction coach</div>
      </div>

      <p class="lede muted center" style="max-width:36em;margin:18px auto 0">${COACH_NAME} walks the method with you, and she'll ask more questions than she answers. Bring whatever is on your mind: a strain you can't name, a strength you keep dismissing, a job posting you're unsure about.</p>

      <div class="card pad" style="margin:26px 0;border-top:6px solid var(--teal)">
        <h3 style="margin-bottom:8px">Start the conversation</h3>
        <p class="muted" style="margin-bottom:6px">Tap the round button with ${COACH_NAME}'s picture in the corner of this page. You can <b>speak</b> or <b>type</b>, whichever feels natural. Take your time; ${COACH_NAME} is patient.</p>
        <p class="muted" style="font-size:15px;margin:0">If the button doesn't appear after a moment, check your internet connection and reload the page.</p>
      </div>

      <div class="grid cols-2" style="align-items:start">
        <div class="card pad">
          <h3 style="font-size:19px">Good things to bring</h3>
          <ul style="margin:10px 0 0;font-size:16px">
            <li>“Help me figure out which load is wearing me down most.”</li>
            <li>“I can't think of five strengths. Everything feels ordinary.”</li>
            <li>“Here's what a job posting says. What should I look closer at?”</li>
            <li>“Help me practice what to ask a utilization review nurse.”</li>
            <li>“I said I'd read five postings this week. I didn't. Now what?”</li>
          </ul>
        </div>
        <div class="card pad">
          <h3 style="font-size:19px">What ${COACH_NAME} won't do</h3>
          <ul style="margin:10px 0 0;font-size:16px">
            <li>Give financial, legal, or medical advice. Income and benefits questions belong in the financial section of the class.</li>
            <li>Tell you to quit, or to stay. The decision is yours. Hope helps you make it <em>informed</em>.</li>
            <li>Make up facts about employers or salaries. Real numbers come from your reconnaissance.</li>
          </ul>
        </div>
      </div>

      ${topScore > 5 || step ? `
      <div class="hint" style="margin-top:22px">
        <b>From your workbook:</b> your highest strain is ${esc(top.name.toLowerCase())} (${topScore}/10)${step ? `, and your committed next step is “${esc(step)}”` : ""}. Mentioning these helps ${COACH_NAME} pick up where you left off.
      </div>` : ""}

      <p class="muted" style="font-size:14.5px;margin-top:22px">Conversations are handled by our voice partner and are not saved to your workbook. Your workbook answers stay in this browser. The conversation ends if you leave this page.</p>
    </div>
  </section>`;
}

function mountCoachWidget(active) {
  const holder = document.getElementById("coach-widget");
  if (!holder) return;
  if (active) {
    if (!holder.querySelector("elevenlabs-convai")) {
      const el = document.createElement("elevenlabs-convai");
      el.setAttribute("agent-id", COACH_AGENT_ID);
      // Hope's portrait replaces the stock orb in the call widget;
      // brand colors remain as the fallback if the image can't load.
      const base = location.origin + location.pathname.replace(/index\.html$/, "");
      el.setAttribute("avatar-image-url", base + "assets/img/" + COACH_IMAGE);
      el.setAttribute("avatar-orb-color-1", "#187878");
      el.setAttribute("avatar-orb-color-2", "#E38E76");
      el.setAttribute("action-text", "Talk with " + COACH_NAME);
      holder.appendChild(el);
    }
  } else {
    holder.innerHTML = "";
  }
}

function notFoundView() {
  return `
  <section>
    <div class="wrap narrow center" style="padding:60px 0">
      <h1>Page not found</h1>
      <p class="muted">That page doesn't exist, but your next step does.</p>
      <a class="btn" href="#/">Back to home</a>
    </div>
  </section>`;
}

/* ============================================================
   Router
   ============================================================ */
function route() {
  // hash may carry an in-page anchor: "#/workbook#wb-options"
  const hash = (location.hash || "#/").split("#")[1] || "/";
  const parts = hash.replace(/^\//, "").split("/");
  switch (parts[0]) {
    case "": return { view: homeView, nav: "home", args: [] };
    case "program": return { view: programView, nav: "program", args: [] };
    case "lesson": return { view: lessonView, nav: "program", args: [parts[1]] };
    case "coach": return { view: coachView, nav: "coach", args: [] };
    case "survey": return { view: surveyView, nav: "program", args: [parts[1]] };
    case "certificate": return { view: certificateView, nav: "program", args: [] };
    case "workbook": return { view: workbookView, nav: "workbook", args: [] };
    case "roles": return { view: rolesView, nav: "roles", args: [] };
    case "resources": return { view: resourcesView, nav: "resources", args: [] };
    case "article": return { view: articleView, nav: "resources", args: [parts[1]] };
    default: return { view: notFoundView, nav: "", args: [] };
  }
}

function render() {
  const r = route();
  const hash = (location.hash || "#/").split("#")[1] || "/";
  document.body.dataset.route = hash.startsWith("/certificate") ? "certificate" : r.nav;
  // Landscape page setup only while on the certificate route
  let ps = document.getElementById("cert-print-style");
  if (hash.startsWith("/certificate")) {
    if (!ps) {
      ps = document.createElement("style");
      ps.id = "cert-print-style";
      ps.textContent = "@page { size: Letter landscape; margin: 0.35in; }";
      document.head.appendChild(ps);
    }
  } else if (ps) {
    ps.remove();
  }
  document.getElementById("app").innerHTML =
    navHTML(r.nav) +
    `<main id="main" class="fadein">${r.view(...r.args)}</main>` +
    footerHTML();
  mountCoachWidget(r.nav === "coach" && coachUnlocked());
}

let lastRoute = (location.hash || "#/").split("#")[1] || "/";

window.addEventListener("hashchange", () => {
  const current = (location.hash || "#/").split("#")[1] || "/";
  const anchor = location.hash.split("#")[2];
  // Plain in-page anchors like "#wb-strain" keep the current view.
  if (!location.hash.startsWith("#/")) {
    const el = document.getElementById(location.hash.slice(1));
    if (el) el.scrollIntoView();
    return;
  }
  if (current !== lastRoute) {
    lastRoute = current;
    render();
  }
  if (anchor) {
    const el = document.getElementById(anchor);
    if (el) el.scrollIntoView();
  } else {
    window.scrollTo(0, 0);
  }
});

render();
