/* ============================================================
   Thrive 55+ — Content data
   Source: Thrive 55+ Career Direction Workbook, Topic Video
   Curriculum Map, Course Design Blueprint, and program articles.
   ============================================================ */

const BRAND = {
  name: "Thrive 55+",
  tagline: "Name the strain. Capture your value. Investigate your options.",
  founder: "Sue Adair, BSN, RN",
  founderTitle: "Founder, Thrive 55+ Nursing Advantage™",
  copyright: "© 2026 Sue Adair | Thrive 55+ Nursing Advantage™. All rights reserved."
};

/* ---------- The Method ---------- */
const METHOD = [
  {
    key: "strain",
    num: "1",
    title: "Name the Strain",
    question: "What is wearing you down?",
    body: "Score your body load, interruption load, and change load from 1–10. Your highest score does not tell you to panic — it tells you where to look first."
  },
  {
    key: "value",
    num: "2",
    title: "Capture Your Value",
    question: "What do you bring with you?",
    body: "You have learned to read the patient, the family, the room, the shift, the unit. Name the strengths you keep dismissing because they feel ordinary — AI cannot duplicate them."
  },
  {
    key: "options",
    num: "3",
    title: "Investigate Your Options",
    question: "What direction is worth investigating next?",
    body: "Career reconnaissance turns fear into information: study the work, ask people who know it, and compare what you learn — no pressure to apply."
  }
];

/* ---------- Curriculum: 6 weeks · 15 lessons ---------- */
const WEEKS = [
  {
    id: "w0",
    label: "Week 0",
    title: "Orientation",
    theme: "Meet the cohort, see the whole map, set an intention.",
    mission: "Write one intention for what you want to leave the program with.",
    image: "group-sketch.jpg",
    lessons: ["v01"]
  },
  {
    id: "w1",
    label: "Week 1",
    title: "Name the Strain",
    theme: "Read the work before you read the job board.",
    mission: "Score your three strain areas — body, interruption, and change — in your workbook.",
    image: "workshop.jpg",
    lessons: ["v11", "v12", "v13"]
  },
  {
    id: "w2",
    label: "Week 2",
    title: "Capture Your Value",
    theme: "Name what you bring, without shame.",
    mission: "List five strengths you keep dismissing because they feel ordinary.",
    image: "leadership-group.jpg",
    lessons: ["v21", "v22"]
  },
  {
    id: "w34",
    label: "Weeks 3–4",
    title: "Investigate Your Options",
    theme: "Reconnaissance: study, ask, compare.",
    mission: "Set up job alerts, read five postings, talk to three people, and start your tracker.",
    image: "water-stones.jpg",
    lessons: ["v31", "v32", "v33", "v34", "v35"]
  },
  {
    id: "w5",
    label: "Week 5",
    title: "Financial Readiness",
    theme: "The financial side of a work change — with Alyson.",
    mission: "Gather your income, benefit, and timing questions for the financial discussion.",
    image: "setting-goals.jpg",
    lessons: ["v51", "v52"]
  },
  {
    id: "w6",
    label: "Week 6",
    title: "Your Direction",
    theme: "Commit to one step and close with the cohort.",
    mission: "Commit to one informed step and share it with your cohort.",
    image: "bridge.jpg",
    lessons: ["v61", "v62"]
  }
];

const LESSONS = {
  v01: {
    week: "w0", code: "V0.1", mins: 5,
    title: "You're Not Done — Start Here",
    bigIdea: "Career direction is not one decision made in a panic; it is a method you can learn, repeat, and walk with a cohort beside you.",
    objectives: [
      "Describe the three parts of the Career Direction Method™ — name the strain, capture your value, investigate your options — and how the six weeks map to them.",
      "Locate the workbook, the cohort space, and the weekly Learn → Do → Share loop.",
      "Write one intention for what you want to leave the program with."
    ],
    workbook: "The Starting Point",
    image: "group-sketch.jpg"
  },
  v11: {
    week: "w1", code: "V1.1", mins: 5,
    title: "Read the Work Before You Read the Job Board",
    bigIdea: "A career change does not start with a job title; it starts with understanding what the current work is asking of your body, attention, and capacity to adapt.",
    objectives: [
      "Explain why career direction begins with strain rather than with job titles.",
      "Distinguish “I still love nursing” from “this version of the work is sustainable for me.”"
    ],
    workbook: "The Starting Point",
    image: "workshop.jpg"
  },
  v12: {
    week: "w1", code: "V1.2", mins: 7,
    title: "The Three Loads — Body, Interruption, Change",
    bigIdea: "Strain is not weakness or lost competence — it is information, and it arrives in three distinct forms you can name.",
    objectives: [
      "Define body load, interruption load, and change load, and give one example of each from your own shifts.",
      "Sort your current stressors into the three loads."
    ],
    workbook: "Body, Interruption & Change Load",
    image: "workshop.jpg"
  },
  v13: {
    week: "w1", code: "V1.3", mins: 6,
    title: "Score It, Don't Panic",
    bigIdea: "Your highest strain score does not tell you to quit — it tells you where to look first.",
    objectives: [
      "Rate each of the three loads on the 1–10 scale using the scoring guide.",
      "Interpret your highest score to name what the next role most needs to reduce.",
      "Reframe one strain from a fear into a piece of information."
    ],
    workbook: "Strain scores",
    image: "workshop.jpg",
    activity: "strain"
  },
  v21: {
    week: "w2", code: "V2.1", mins: 5,
    title: "Tell the Truth Without the Shame",
    bigIdea: "Naming what is getting harder is honest data, not a personal failing — and it must be kept separate from self-judgment.",
    objectives: [
      "Name what is getting harder in your current role using non-punishing language.",
      "Differentiate an honest limitation from shame-based self-talk."
    ],
    workbook: "What is getting harder",
    image: "leadership-group.jpg"
  },
  v22: {
    week: "w2", code: "V2.2", mins: 8,
    title: "Your Ordinary Isn't Ordinary",
    bigIdea: "The skills experienced nurses dismiss as “just the job” are hard-won, human, and exactly the ones automation cannot replace.",
    objectives: [
      "Identify at least five professional strengths built through years of nursing experience.",
      "Explain why judgment-and-relationship skills keep their value across different roles.",
      "Select one strength to carry into the next role."
    ],
    workbook: "Five strengths",
    image: "leadership-group.jpg",
    activity: "strengths"
  },
  v31: {
    week: "w34", code: "V3.1", mins: 5,
    title: "Reconnaissance Turns Fear Into Information",
    bigIdea: "Investigating options is not choosing a job today — it is gathering information so that fear stops making the decision for you.",
    objectives: [
      "Explain the purpose of reconnaissance versus applying for jobs.",
      "Reframe two personal career fears as questions that can be investigated."
    ],
    workbook: "Options — introduction",
    image: "water-stones.jpg"
  },
  v32: {
    week: "w34", code: "V3.2", mins: 7,
    title: "Study the Work — Read Postings Like a Detective",
    bigIdea: "A job posting hides its real demands in one small paragraph; learning to read for it turns browsing into intelligence-gathering.",
    objectives: [
      "Set up job alerts and collect postings without applying.",
      "Extract the required skills, software, schedule, and physical demands from a posting.",
      "Locate the paragraph that describes what the person actually does all day."
    ],
    workbook: "Study the Work",
    image: "water-stones.jpg"
  },
  v33: {
    week: "w34", code: "V3.3", mins: 6,
    title: "Ask Three People This Week",
    bigIdea: "Three short conversations reveal what no posting can — and most people are glad to be asked.",
    objectives: [
      "Identify three approachable people who know a role or setting of interest.",
      "Use the five reconnaissance questions to learn what a role is really like day to day.",
      "Ask “who else would be useful for me to talk to?” to open the next door."
    ],
    workbook: "Talk to Three People",
    image: "discussion.jpg",
    activity: "conversations"
  },
  v34: {
    week: "w34", code: "V3.4", mins: 5,
    title: "Compare and Re-Score",
    bigIdea: "Better information changes the picture — a role you feared may open up, and a role that sounded easy may reveal red flags.",
    objectives: [
      "Compare a researched role against your strain, value, income, and time needs.",
      "Re-score one strain area using new information and explain what changed."
    ],
    workbook: "Compare What You Learn",
    image: "water-stones.jpg"
  },
  v35: {
    week: "w34", code: "V3.5", mins: 8,
    title: "Role Categories, Red Flags, and Skill Gaps",
    bigIdea: "Categories are starting points, not answers; a red flag means look closer, and “I haven't done this lately” is not “I can't learn this.”",
    objectives: [
      "Name several nursing and nursing-adjacent role categories worth exploring.",
      "Evaluate a role's tradeoffs against your highest strain.",
      "Distinguish a genuine stop sign from a skill gap that can be rebuilt with time and practice."
    ],
    workbook: "Roles, Red Flags & Skill Gaps",
    image: "water-stones.jpg"
  },
  v51: {
    week: "w5", code: "V5.1", mins: 5,
    title: "Why Career and Money Belong Together",
    bigIdea: "A career decision is also a financial decision; readiness on both sides is what makes a change feel safe rather than reckless.",
    objectives: [
      "Explain why income, benefits, savings, and retirement timing belong in the same conversation as career direction.",
      "Identify the financial information to gather before making a change."
    ],
    workbook: "Career-to-Financial Handoff",
    image: "bridge.jpg"
  },
  v52: {
    week: "w5", code: "V5.2", mins: 7,
    title: "What to Gather — Income, Benefits, and Timing",
    bigIdea: "You cannot weigh a new role honestly until you know your real number and how quickly a new role must produce income.",
    objectives: [
      "Determine current income and the minimum income the next role must support.",
      "Inventory the core and additional benefits a change would affect.",
      "Estimate how quickly a new role needs to produce dependable income."
    ],
    workbook: "Career-to-Financial Handoff",
    image: "setting-goals.jpg"
  },
  v61: {
    week: "w6", code: "V6.1", mins: 5,
    title: "Choose One Informed Step",
    bigIdea: "You do not have to solve your whole career today; direction begins with a single, specific, informed step.",
    objectives: [
      "Select one concrete next step from the method (score, alert, five postings, one conversation, five strengths, start a tracker).",
      "Commit to when you will take it and what you expect to learn."
    ],
    workbook: "Your Next Informed Step",
    image: "bridge.jpg",
    activity: "nextstep"
  },
  v62: {
    week: "w6", code: "V6.2", mins: 6,
    title: "Name the Strain. Capture Your Value. Investigate Your Options.",
    bigIdea: "The method is repeatable — you now own a way to turn dread into information and information into your next step, for this decision and the next one.",
    objectives: [
      "Summarize your personal method: highest strain, value to carry forward, direction to investigate, and next step.",
      "Share your committed step with the cohort and name your ongoing support."
    ],
    workbook: "My Career Direction Method",
    image: "bridge.jpg"
  }
};

/* ---------- Strain reference ---------- */
const STRAIN_GUIDE = [
  { range: "1–4", meaning: "Not a current problem, or you notice it but can manage it." },
  { range: "5–6", meaning: "This is affecting your work or recovery." },
  { range: "7–8", meaning: "This is changing how you think about your future." },
  { range: "9–10", meaning: "This may be threatening your ability to remain in your current role." }
];

const STRAIN_AREAS = [
  {
    key: "body",
    name: "Body load",
    examples: "Back pain · lifting · standing · bending · reaching · transferring patients · walking quickly · working through pain · needing longer to recover between shifts",
    advice: "Investigate standing and walking requirements, lifting and transfer expectations, shift length, commute and parking demands, recovery time between shifts — and whether the role is truly less physical or simply physical in another way."
  },
  {
    key: "interruption",
    name: "Interruption load",
    examples: "Alarms · call lights · questions · messages · documentation · new orders · unfinished tasks · open mental loops · constant task switching · phone and productivity pressure",
    advice: "Investigate call volume, simultaneous work queues, message volume, task switching, documentation pressure, productivity measures, and how often you are pulled away from unfinished work."
  },
  {
    key: "change",
    name: "Change load",
    examples: "New technology · changing documentation systems · equipment · policies · staffing models · changing expectations · limited onboarding · learning while expected to perform at full speed",
    advice: "Investigate software and technology, formal onboarding, length of orientation, access to practice environments, productivity expectations during training, and how quickly independent performance is expected."
  }
];

/* ---------- Value prompts ---------- */
const VALUE_SKILLS = [
  "Read patient and family cues", "Prioritize competing demands",
  "Explain complex information in plain language", "Recognize what matters most",
  "Organize a messy situation", "Advocate clearly",
  "Notice safety concerns early", "De-escalate difficult situations",
  "Teach without making someone feel small", "Learn new systems with time and structure",
  "Stay steady in difficult conditions", "Coordinate people, information, and next steps",
  "Recognize where workflow is breaking down", "Communicate across roles and departments"
];

/* ---------- Reconnaissance ---------- */
const RECON_QUESTIONS = [
  "What does this job actually look like day to day?",
  "What part is harder than people realize?",
  "What technology do you use most?",
  "What skills mattered when you started? What is measured?",
  "What makes someone successful in this role?",
  "What would you tell an experienced nurse considering this direction?",
  "Who else would be useful for me to talk to?"
];

const NEXT_STEPS = [
  "Score my three strain areas",
  "Set up one job alert",
  "Read five job postings without applying",
  "Talk to three people this week",
  "List five strengths I keep dismissing",
  "Search three unfamiliar job titles from the role list",
  "Investigate one skill gap",
  "Start my job-research tracker",
  "Bring my income and benefit questions into the financial discussion"
];

/* ---------- Roles explorer ---------- */
const ROLE_GROUPS = [
  {
    title: "Care Management & Coordination",
    blurb: "Guide patients across settings; heavy coordination, lighter lifting.",
    roles: ["Registered Nurse Case Manager", "Care Manager RN", "Complex Care Manager RN", "Transition of Care Nurse", "Population Health Nurse"]
  },
  {
    title: "Utilization & Clinical Review",
    blurb: "Apply clinical judgment to charts and criteria — often remote or office-based.",
    roles: ["Utilization Review Nurse", "Utilization Management Nurse Consultant", "Concurrent Review RN", "Clinical Review Nurse", "Prior Authorization Nurse"]
  },
  {
    title: "Appeals, Claims & Documentation",
    blurb: "Detail-focused chart and records work built on years of clinical pattern recognition.",
    roles: ["Clinical Appeals RN", "Denials Management Nurse", "Clinical Documentation Specialist", "Medical Record Review Nurse", "HEDIS Nurse Reviewer"]
  },
  {
    title: "Navigation & Specialty Coordination",
    blurb: "Walk patients through complex journeys; education and coordination at the center.",
    roles: ["Nurse Navigator", "Oncology Nurse Navigator", "Care Navigator RN", "Transplant Coordinator", "Specialty Clinic Coordinator"]
  },
  {
    title: "Teaching, Pre-Admission & Remote Triage",
    blurb: "Patient-facing work with a steadier rhythm — education, preparation, and phone-based assessment.",
    roles: ["Patient Education Nurse", "Nurse Educator", "Pre-Admission Testing RN", "Remote Triage Nurse", "Telephone Triage RN"]
  },
  {
    title: "Nursing-Adjacent Paths",
    blurb: "Your clinical judgment applied outside direct care — writing, curriculum, consulting, quality.",
    roles: ["Clinical Content Writer", "Curriculum Developer", "Legal Nurse Consultant", "Quality Improvement Nurse", "Clinical Consultant"]
  }
];

const ROLE_HOWTO = "Do not choose a title because it sounds easier. Use the title as a search term. Search several versions and read at least five postings — employers may use different titles for similar work. A title that sounds unfamiliar may describe work you already understand; a familiar title may hide demands you are trying to leave.";

const RED_FLAGS = [
  "Physically easier but cognitively heavier",
  "Less lifting but substantially more screen time",
  "Flexible schedule with tight productivity expectations",
  "Remote work with heavy phone or message volume",
  "Meaningful role with lower income",
  "Strong income but extensive travel",
  "Familiar work with an unpredictable schedule",
  "New technology with limited onboarding",
  "Preserves nursing identity but does not solve my highest strain",
  "Removes bedside work but also removes the part of nursing I value",
  "Requires certification or education I have not evaluated",
  "Income takes too long to replace"
];

/* ---------- Concern → Question → Evidence ---------- */
const CQE = [
  { concern: "I will have to take too much of an income loss.", question: "What is the actual salary range and total benefit package?", evidence: "Posting, recruiter, employee" },
  { concern: "I cannot learn the technology.", question: "What software is used, and what training is provided?", evidence: "Posting, manager, current employee" },
  { concern: "Employers will not value my experience.", question: "What type of experience does the role repeatedly ask for?", evidence: "Five job postings" },
  { concern: "The role will be easier.", question: "What are the physical, cognitive, productivity, and schedule demands?", evidence: "Current employee or manager" },
  { concern: "I will need another degree.", question: "Is additional education required, preferred, or unnecessary?", evidence: "Posting and recruiter" }
];

/* ---------- Articles ---------- */
const ARTICLES = [
  {
    id: "evolving",
    title: "You're Not Done, You're Just Evolving",
    subtitle: "5 surprising truths for the experienced professional",
    image: "hero-walking.jpg",
    minutes: 6,
    sections: [
      {
        h: "The “dread paradox”",
        p: ["For the seasoned nurse, there is a specific kind of exhaustion that is difficult to name. You might have thirty years of experience and a deep, abiding love for the core of your field, yet you find yourself standing in the hum of the unit, feeling the weight of the clipboard, and dreading the start of your next shift. This “dread paradox” often stems from a conflict between a mind that remains sharp and a body or environment that feels increasingly unsustainable.",
        "Your next chapter isn't about leaving your wisdom behind; it's about finding a container that can hold it without breaking you. A successful career pivot at this stage of life starts with a core reframe: career direction does not begin with searching for a job title. It begins with learning to “read the work.”"]
      },
      {
        h: "Your career isn't broken — your “load” is",
        p: ["When the workday feels overwhelming, it is easy to assume you are losing your edge or that your career has reached its expiration date. Shift instead from a state of panic to a state of information-gathering. The Thrive 55+ Career Direction Method™ defines three specific types of load: body load (lifting, reaching, transferring, longer recovery), interruption load (alarms, call lights, documentation loops, constant task-switching), and change load (adapting to new systems while still expected to perform at full speed).",
        "Identifying which of these loads is highest is a psychological game-changer. It transforms a vague feeling of failure into a concrete map. The highest score does not tell you to panic — it tells you where to look first."]
      },
      {
        h: "Your “ordinary” skills are actually AI-proof",
        p: ["Many veterans dismiss their greatest strengths because those skills feel ordinary, or “just part of the job.” In reality, the senior-level human intelligence you have developed over decades is exactly what modern technology cannot duplicate: reading the room, translating jargon into kind plain language, organizing chaos, mentoring kindly, and spotting risks early because you've seen the pattern a thousand times before.",
        "Your value isn't in how fast you can click through a new software update; it is in the judgment and relationship-building that only experience provides."]
      },
      {
        h: "Become a detective before you become an applicant",
        p: ["The anxiety of a career change is often fueled by pressure to apply immediately. A lower-risk research process — career reconnaissance — gathers intelligence before you ever hit “submit.” Read postings like a detective: look past the title, find the small paragraph that describes the daily rhythm, and note the software, physical demands, and whether the role is phone-, chart-, or meeting-heavy. Then talk to people. The most powerful tool in your kit is the question: “Who else should I talk to?”"]
      },
      {
        h: "Confidence is a repeatable skill, not a personality trait",
        p: ["Entering new digital spaces or interviewing for the first time in twenty years can be intimidating. Nerves are normal and rarely disappear entirely — the goal is calm, conversational authority, not the absence of butterflies. Confidence is built the same way clinical skill was: with structure, repetition, and support."]
      }
    ]
  },
  {
    id: "bedside",
    title: "Beyond the Bedside",
    subtitle: "Rethinking the nursing career after 55",
    image: "bridge.jpg",
    minutes: 7,
    sections: [
      {
        h: "The Caterpillar Phase",
        p: ["If you have spent 20 or 30 years in nursing, you likely know the specific weight of a long career. It is a physical fatigue that lingers in your back and knees, but it is also a mental exhaustion from a “no brakes” environment. Many nurses reaching this stage wonder if they are simply done with the profession entirely.",
        "The reality is rarely a loss of passion for patient care. It is an issue of an unsustainable load. You are not at the end of your career; you are in the “Caterpillar Phase” — a period of necessary professional transformation where the old way of working is left behind to make room for something sustainable. This is not a time to retreat, but a time to strategize. You are the asset."]
      },
      {
        h: "Your Nurse Legacy Value is irreplaceable",
        p: ["It is common for experienced nurses to dismiss their clinical judgment as ordinary. After decades of recognizing patterns and reading rooms before a problem is even named, these skills become second nature. In the modern healthcare market, this lived experience is your greatest competitive leverage — what you do, what you think, and what you say.",
        "Employers in non-bedside roles look for markers you likely already possess: systems coordination, de-escalation, risk management, and advocacy and education. You cannot create a 20–30 year experienced nurse on demand."]
      },
      {
        h: "Stop looking for job titles; start reading the work",
        p: ["The most common mistake in a career change is starting with a job title. Before you look for a “desk job,” identify the specific type of pressure wearing you down — body load, interruption load, or change load — and score each from 1 to 10. A “physically easier” role may introduce a higher interruption load through phone queues and productivity pressure. Your strategy depends on knowing which load you need to shed."]
      },
      {
        h: "The 5-3-1 method for career reconnaissance",
        p: ["Move from uncertainty to action by turning fear into information. Study five postings — set up job alerts, don't apply yet, and find the paragraph that explains what the person actually does all day. Talk to three people — former coworkers, recruiters, nurses in other departments. Track one informed next step — one specific action, such as investigating a skill gap.",
        "When a vague concern surfaces (“I'll have to take too much of an income loss”), turn it into a specific question you can investigate (“What is the actual salary range and total benefit package?”). Moving from concern to question to evidence is how dread becomes direction."]
      }
    ]
  }
];
