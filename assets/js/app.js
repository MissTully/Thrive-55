/* ============================================================
   Thrive 55+ — App (hash router + views + saved progress)
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
  intention: ""
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
      <a class="logo" href="#/" aria-label="Thrive 55+ home">Thrive&nbsp;<b>55+</b><span class="sprout" aria-hidden="true">❧</span></a>
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
          <a class="logo" href="#/">Thrive&nbsp;<b>55+</b><span class="sprout" aria-hidden="true">❧</span></a>
          <p style="margin-top:14px;font-size:15.5px;max-width:30em">${esc(BRAND.tagline)} A career direction program for experienced nurses deciding what comes next — without treating you as less than.</p>
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
          <a href="#/article/bedside">Beyond the Bedside</a>
        </div>
      </div>
      <div class="fineprint">
        <p style="margin-bottom:6px">The Thrive 55+ Career Direction Method™ is original to Thrive 55+ Nursing Advantage™ and reflects Sue Adair's professional experience, coaching work, and educational design.</p>
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
        <span class="pill coral">For nurses 55+ · Self-paced · Free workbook included</span>
        <h1>You're not done.<br>You're just <em style="color:var(--teal);font-style:normal">evolving</em>.</h1>
        <p class="lede">A short, practical program for experienced nurses deciding what comes next. Turn the dread of the next shift into information — and information into your next informed step.</p>
        <div class="hero-ctas">
          <a class="btn big" href="#/program">${pct > 0 ? "Continue the program" : "Start the program"}</a>
          <a class="btn big ghost" href="#/workbook">Open my workbook</a>
        </div>
        ${pct > 0 ? `
        <div style="margin-top:26px;max-width:420px">
          <div style="display:flex;justify-content:space-between;font-size:14.5px;margin-bottom:6px">
            <span class="muted">Your progress</span><b style="color:var(--teal-deep)">${pct}% · ${doneCount()} of ${allLessonIds.length} lessons</b>
          </div>
          <div class="progress-track"><span style="width:${pct}%"></span></div>
        </div>` : ""}
      </div>
      <div class="hero-img">
        <img src="${img("hero-walking.jpg")}" alt="Two experienced nurses walking and talking outside a healthcare building">
        <div class="hero-badge"><b>The Thrive 55+ Career Direction Method™</b>${esc(BRAND.tagline)}</div>
      </div>
    </div>
  </section>

  <section class="tinted">
    <div class="wrap">
      <div class="center" style="max-width:720px;margin:0 auto 40px">
        <span class="eyebrow">The method</span>
        <h2>Three questions before any job title</h2>
        <p class="muted">The method does not tell you which job to choose. It helps you make a better decision <em>before</em> you choose.</p>
      </div>
      <div class="grid cols-3">
        ${METHOD.map(m => `
        <div class="card pillar">
          <div class="num" aria-hidden="true">${m.num}</div>
          <h3>${esc(m.title)}</h3>
          <div class="q">${esc(m.question)}</div>
          <p>${esc(m.body)}</p>
        </div>`).join("")}
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="feature-row">
        <div>
          <span class="eyebrow">Why this works</span>
          <h2>Career direction doesn't start with a job title</h2>
          <p>It starts by learning how to <b>read the work</b>. You're not asking whether you still love nursing — you do. The harder question is whether your body and mind can keep carrying <em>this version</em> of the work until retirement.</p>
          <p>You still have experience, judgment, value, and income needs. You just need a way of working that no longer leaves you dreading the next shift before the current one is over.</p>
          <a class="btn" href="#/lesson/v01">Start with lesson one</a>
        </div>
        <div class="feature-img"><img src="${img("workshop.jpg")}" alt="Experienced nurses in a supportive workshop discussion"></div>
      </div>

      <div class="feature-row flip">
        <div class="feature-img"><img src="${img("water-stones.jpg")}" alt="Calm water flowing around stepping stones — finding a path"></div>
        <div>
          <span class="eyebrow">Reconnaissance, not job hunting</span>
          <h2>Turn fear into information</h2>
          <p>Fear alone does not give you good information. Reconnaissance does. Study the work through job postings — no applying yet. Ask three people who know the work. Compare what you learn against your strain, your value, and the income you still need.</p>
          <p>A red flag doesn't mean no. It means <b>look closer before you leap</b>.</p>
          <a class="btn ghost" href="#/roles">Explore role categories</a>
        </div>
      </div>
    </div>
  </section>

  <section class="cream2 tight">
    <div class="wrap">
      <div class="stats">
        <div class="card stat"><div class="n">6</div><div class="l">weeks, at your pace</div></div>
        <div class="card stat"><div class="n">15</div><div class="l">short lessons — none over 8 minutes</div></div>
        <div class="card stat"><div class="n">3</div><div class="l">pause-and-do workbook moments</div></div>
        <div class="card stat"><div class="n">1</div><div class="l">informed next step, chosen by you</div></div>
      </div>
    </div>
  </section>

  <section>
    <div class="wrap center">
      <p class="bigquote">“The highest score does not tell you to panic. <em>It tells you where to look first.</em>”</p>
      <p class="quote-attr">— ${esc(BRAND.founder)} · ${esc(BRAND.founderTitle)}</p>
    </div>
  </section>

  <section class="tight">
    <div class="wrap">
      <div class="photo-band">
        <img src="${img("bridge.jpg")}" alt="Two women crossing a bridge together, symbolizing career transition">
        <div class="overlay"><div class="overlay-inner">
          <h2>Walk the bridge with a method beside you</h2>
          <p>Six weeks. One repeatable method. A workbook that saves your answers as you go — and hands you off to the financial side of the decision when you're ready.</p>
          <a class="btn coral" href="#/program">See the six weeks</a>
        </div></div>
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="center" style="max-width:680px;margin:0 auto 36px">
        <span class="eyebrow">From the Thrive 55+ library</span>
        <h2>Read while you decide</h2>
      </div>
      <div class="grid cols-2">
        ${ARTICLES.map(a => `
        <a class="card article-card" href="#/article/${a.id}">
          <div class="a-img"><img src="${img(a.image)}" alt=""></div>
          <div class="body">
            <span class="pill teal">${a.minutes} min read</span>
            <h3 style="margin-top:12px">${esc(a.title)}</h3>
            <p class="muted" style="margin:0">${esc(a.subtitle)}</p>
          </div>
        </a>`).join("")}
      </div>
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
      <h1 style="font-size:clamp(30px,4vw,42px)">Six weeks. Fifteen short lessons.</h1>
      <p class="lede muted" style="max-width:40em">Each week follows the same loop: <b>Learn</b> (short lessons), <b>Do</b> (a workbook mission), <b>Share</b> (bring it to your cohort). Lessons are never longer than about eight minutes.</p>
      <div style="max-width:520px;margin:18px 0 8px">
        <div style="display:flex;justify-content:space-between;font-size:15px;margin-bottom:6px">
          <span class="muted">Overall progress</span>
          <b style="color:var(--teal-deep)">${doneCount()} of ${allLessonIds.length} lessons complete</b>
        </div>
        <div class="progress-track" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Program progress"><span style="width:${pct}%"></span></div>
      </div>
    </div>
  </section>

  <section class="tight" style="padding-top:20px">
    <div class="wrap grid cols-2">
      ${WEEKS.map(w => {
        const total = w.lessons.length, done = weekDone(w);
        return `
        <div class="card week-card">
          <div class="week-img"><img src="${img(w.image)}" alt=""></div>
          <div class="body">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
              <span class="pill teal">${esc(w.label)}</span>
              <span class="muted" style="font-size:14px">${done}/${total} done</span>
            </div>
            <h3>${esc(w.title)}</h3>
            <p class="theme">${esc(w.theme)}</p>
            <div>
              ${w.lessons.map(id => {
                const L = LESSONS[id];
                const done = !!S.completed[id];
                return `
                <a class="lesson-row ${done ? "done" : ""}" href="#/lesson/${id}">
                  <span class="code">${L.code}</span>
                  <span class="t">${esc(L.title)}</span>
                  <span class="mins">~${L.mins} min</span>
                  <span class="check" aria-label="${done ? "Completed" : "Not completed"}">${done ? "✔" : "○"}</span>
                </a>`;
              }).join("")}
            </div>
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
          <p style="margin:0">Three lessons pause and open a workbook step right on the page — your strain scores, your five strengths, and your one informed step. Everything saves automatically in this browser.</p>
        </div>
        <a class="btn coral" href="#/workbook">Open my workbook</a>
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
  const ids = allLessonIds;
  const idx = ids.indexOf(id);
  const prev = idx > 0 ? ids[idx - 1] : null;
  const next = idx < ids.length - 1 ? ids[idx + 1] : null;
  const done = !!S.completed[id];

  return `
  <section class="tight">
    <div class="wrap narrow">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="#/program">The Program</a> · ${esc(W.label)} — ${esc(W.title)}</nav>
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
        <button class="btn ${done ? "ghost" : ""}" onclick="toggleComplete('${id}')">${done ? "✔ Completed — mark as not done" : "Mark lesson complete"}</button>
        <a class="btn ghost" href="#/workbook">Open my workbook</a>
        <a class="btn ghost" href="#/coach">Talk it through with Hope</a>
      </div>

      <div class="lesson-nav">
        ${prev ? `<a class="btn ghost" href="#/lesson/${prev}">← ${esc(LESSONS[prev].title)}</a>` : "<span></span>"}
        ${next ? `<a class="btn" href="#/lesson/${next}">${esc(LESSONS[next].title)} →</a>`
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
      <p class="muted" style="margin-top:2px">They don't have to be perfect contacts — they only need to know something useful. Log each conversation as you have it.</p>
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
  return `Your highest strain is <b>${top.name.toLowerCase()} (${score}/10)</b> — that's where to look first. ${top.advice}`;
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
    <input type="text" style="margin-bottom:9px" placeholder="Strength ${i + 1} — e.g. ${esc(VALUE_SKILLS[(i * 3) % VALUE_SKILLS.length].toLowerCase())}"
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
  const [top, topScore] = highestStrain();
  const strengthsNamed = S.strengths.filter(s => s.trim());
  return `
  <section class="tight">
    <div class="wrap narrow">
      <span class="eyebrow" style="margin-top:20px">My workbook</span>
      <h1 style="font-size:clamp(30px,4vw,42px)">The Career Direction Workbook</h1>
      <p class="lede muted" style="max-width:38em">Everything you capture in a lesson lands here — and everything here travels with you into the next lesson. Answers save automatically in this browser.</p>
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
          <div class="wb-head"><span class="stepnum">Step 1</span><h2 style="margin:0">Strain — what is wearing you down?</h2></div>
          <p class="muted">You may still care about nursing. You may still be fully capable. The question is what the work is asking from your body, attention, recovery, and ability to keep adapting.</p>
          <table class="guide-table">
            <caption class="muted" style="text-align:left;font-size:14px;padding-bottom:6px">Strain scoring guide</caption>
            <tbody>
            ${STRAIN_GUIDE.map(g => `<tr><td>${g.range}</td><td>${esc(g.meaning)}</td></tr>`).join("")}
            </tbody>
          </table>
          <div style="margin-top:22px">${strainSlidersHTML()}</div>
          <label for="wb_sev">Evidence from my work or recovery — what would the next role need to reduce or change?</label>
          <textarea id="wb_sev" oninput="S.strainEvidence=this.value;save()">${esc(S.strainEvidence)}</textarea>
        </div>
      </div>

      <!-- 2 · VALUE -->
      <div class="wb-section" id="wb-value">
        <div class="card">
          <div class="wb-head"><span class="stepnum">Step 2</span><h2 style="margin:0">Value — what do you bring with you?</h2></div>
          <p class="muted">You have spent years reading the patient, the family, the room, the shift, the unit, the workflow, the risk — and the problem before someone else officially names it. These are not compliments. They are evidence of your working value.</p>
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
          <div class="wb-head"><span class="stepnum">Step 3</span><h2 style="margin:0">Options — reconnaissance</h2></div>
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
              <div class="v">${esc(top.name)} — ${topScore}/10</div>
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
          ${S.nextStepBy ? `<p style="font-size:16px"><b style="color:var(--navy)">By:</b> ${esc(S.nextStepBy)}${S.nextStepLearn ? ` — expecting to learn: ${esc(S.nextStepLearn)}` : ""}</p>` : ""}
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
    "THE THRIVE 55+ CAREER DIRECTION METHOD(TM) — MY WORKBOOK",
    "Name the strain. Capture your value. Investigate your options.",
    "",
    "— STRAIN —",
    ...STRAIN_AREAS.map(a => `${a.name}: ${S.strain[a.key]}/10`),
    `Highest strain: ${top.name} (${topScore}/10)`,
    S.strainEvidence ? `Evidence / what the next role must change: ${S.strainEvidence}` : null,
    "",
    "— VALUE —",
    ...S.strengths.filter(s => s.trim()).map((s, i) => `Strength ${i + 1}: ${s}`),
    S.carryStrength ? `Carrying forward: ${S.carryStrength}` : null,
    S.leaveBehind ? `Not carrying forward unchanged: ${S.leaveBehind}` : null,
    "",
    "— OPTIONS: THREE CONVERSATIONS —",
    ...S.conversations.flatMap((c, i) => c.person || c.learned ? [
      `Conversation ${i + 1}: ${c.person}`,
      c.learned ? `  Learned: ${c.learned}` : null,
      c.suggested ? `  Suggested next: ${c.suggested}` : null
    ] : [null]),
    "",
    "— RED FLAGS & TRADEOFFS —",
    S.tradeoffAccept ? `May accept: ${S.tradeoffAccept}` : null,
    S.tradeoffReject ? `Will not accept: ${S.tradeoffReject}` : null,
    S.openQuestion ? `Question to answer first: ${S.openQuestion}` : null,
    "",
    "— SKILL GAP OR STOP SIGN —",
    S.skillGap ? `To evaluate: ${S.skillGap}` : null,
    S.skillGapPlan ? `First learning step: ${S.skillGapPlan}` : null,
    "",
    "— MY NEXT INFORMED STEP —",
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
  return `
  <section class="tight">
    <div class="wrap">
      <span class="eyebrow" style="margin-top:20px">Roles explorer</span>
      <h1 style="font-size:clamp(30px,4vw,42px)">Nursing roles & search titles to explore</h1>
      <p class="lede muted" style="max-width:42em">Categories are starting points, not answers. Each one has tradeoffs — evaluate every role against your highest strain.</p>
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
          <p class="muted">Reconnaissance turns fear into information. Convert a concern into a question you can investigate — and know where you'll get the answer.</p>
          <table class="guide-table" style="background:#fff;border-radius:14px;overflow:hidden">
            <thead><tr><th>Concern</th><th>Better question</th><th>Where to ask</th></tr></thead>
            <tbody>
              ${CQE.map(r => `<tr><td style="white-space:normal;font-weight:600;color:var(--navy)">${esc(r.concern)}</td><td>${esc(r.question)}</td><td class="muted">${esc(r.evidence)}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
        <div>
          <h2>Red flags & tradeoffs</h2>
          <p class="muted">A red flag doesn't mean no — it means look closer before you leap.</p>
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
  return `
  <section class="tight">
    <div class="wrap">
      <span class="eyebrow" style="margin-top:20px">Resources</span>
      <h1 style="font-size:clamp(30px,4vw,42px)">Read while you decide</h1>
      <p class="lede muted" style="max-width:40em">Articles from the Thrive 55+ library, plus the method at a glance.</p>
      <div class="grid cols-2" style="margin-top:26px">
        ${ARTICLES.map(a => `
        <a class="card article-card" href="#/article/${a.id}">
          <div class="a-img"><img src="${img(a.image)}" alt=""></div>
          <div class="body">
            <span class="pill teal">${a.minutes} min read</span>
            <h3 style="margin-top:12px">${esc(a.title)}</h3>
            <p class="muted" style="margin:0">${esc(a.subtitle)}</p>
          </div>
        </a>`).join("")}
      </div>
    </div>
  </section>
  <section class="tight">
    <div class="wrap">
      <h2 class="center" style="margin-bottom:22px">The method at a glance</h2>
      <img class="method-graphic" src="${img("method-graphic.jpg")}"
        alt="Infographic of the Thrive 55+ Career Direction Method: three pillars — name the strain (score body, interruption, and change loads 1–10), capture your value (identify the ordinary skills AI cannot duplicate), investigate your options (study postings, talk to people, extract requirements) — and moving from fear to information.">
    </div>
  </section>`;
}

function articleView(id) {
  const A = ARTICLES.find(a => a.id === id);
  if (!A) return notFoundView();
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
   MY COACH (ElevenLabs conversational agent)
   ============================================================ */
function coachView() {
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
        <img src="${img(COACH_IMAGE)}" alt="${COACH_NAME}, your Thrive 55+ coach — an experienced nurse ready to listen">
      </div>
      <div class="hope-caption">
        <div class="name">${COACH_NAME}</div>
        <div class="role">Your Thrive 55+ career direction coach</div>
      </div>

      <p class="lede muted center" style="max-width:36em;margin:18px auto 0">${COACH_NAME} walks the method with you — and she'll ask more questions than she answers. Bring whatever is on your mind: a strain you can't name, a strength you keep dismissing, a job posting you're unsure about.</p>

      <div class="card pad" style="margin:26px 0;border-top:6px solid var(--teal)">
        <h3 style="margin-bottom:8px">Start the conversation</h3>
        <p class="muted" style="margin-bottom:6px">Tap the round button with ${COACH_NAME}'s picture in the corner of this page. You can <b>speak</b> or <b>type</b> — whichever feels natural. Take your time; ${COACH_NAME} is patient.</p>
        <p class="muted" style="font-size:15px;margin:0">If the button doesn't appear after a moment, check your internet connection and reload the page.</p>
      </div>

      <div class="grid cols-2" style="align-items:start">
        <div class="card pad">
          <h3 style="font-size:19px">Good things to bring</h3>
          <ul style="margin:10px 0 0;font-size:16px">
            <li>“Help me figure out which load is wearing me down most.”</li>
            <li>“I can't think of five strengths — everything feels ordinary.”</li>
            <li>“Here's what a job posting says — what should I look closer at?”</li>
            <li>“Help me practice what to ask a utilization review nurse.”</li>
            <li>“I said I'd read five postings this week. I didn't. Now what?”</li>
          </ul>
        </div>
        <div class="card pad">
          <h3 style="font-size:19px">What ${COACH_NAME} won't do</h3>
          <ul style="margin:10px 0 0;font-size:16px">
            <li>Give financial, legal, or medical advice — income and benefits questions belong in the financial section of the class.</li>
            <li>Tell you to quit, or to stay. The decision is yours — the coach helps you make it <em>informed</em>.</li>
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
      <p class="muted">That page doesn't exist — but your next step does.</p>
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
    case "workbook": return { view: workbookView, nav: "workbook", args: [] };
    case "roles": return { view: rolesView, nav: "roles", args: [] };
    case "resources": return { view: resourcesView, nav: "resources", args: [] };
    case "article": return { view: articleView, nav: "resources", args: [parts[1]] };
    default: return { view: notFoundView, nav: "", args: [] };
  }
}

function render() {
  const r = route();
  document.getElementById("app").innerHTML =
    navHTML(r.nav) +
    `<main id="main" class="fadein">${r.view(...r.args)}</main>` +
    footerHTML();
  mountCoachWidget(r.nav === "coach");
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
