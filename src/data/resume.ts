export const profile = {
  name: "Louie M. Doromal",
  shortName: "Louie Doromal",
  role: "AI Software Engineer",
  location: "Iloilo City, Philippines",
  email: "ldbopz17@gmail.com",
  phone: "0938 130 9230",
  github: "https://github.com/louiemarte10",
  githubHandle: "louiemarte10",
  linkedin: "https://www.linkedin.com/in/louie-doromal-487177226/",
  linkedinHandle: "louie-doromal-487177226",
  tagline:
    "I build production AI features into enterprise systems — and the full-stack web applications around them.",
  summary: [
    "AI Software Engineer with hands-on experience developing and deploying intelligent, production-ready solutions for enterprise platforms.",
    "I build and maintain scalable AI pipelines and full-stack applications with PHP Laravel, React, Vue, Angular and Node.js, using AI-augmented workflows (Claude Code, Cursor) to ship faster without giving up quality.",
    "Day to day that means structuring messy data into queryable systems, wiring CRM automation across HubSpot and Zapier, and working alongside data teams to get AI features into live production — with data privacy and API hygiene taken seriously.",
  ],
} as const;

export const stats = [
  { value: "7+", label: "Years building software" },
  { value: "4", label: "Companies shipped for" },
  { value: "15+", label: "Public repositories" },
  { value: "2022", label: "At Callbox since" },
] as const;

export type SkillGroup = {
  title: string;
  note: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "AI & Machine Learning",
    note: "Shipping AI into live systems",
    items: [
      "Claude Code",
      "Cursor",
      "Vibe Coding methodology",
      "Knowledge engineering",
      "AI model pipelines",
      "API integration",
    ],
  },
  {
    title: "Languages & Frameworks",
    note: "Full-stack, backend-leaning",
    items: [
      "PHP / Laravel",
      "TypeScript",
      "JavaScript (ES6+)",
      "React.js",
      "Vue.js",
      "Angular",
      "Node.js",
      "HTML5 / CSS3",
      "MySQL",
    ],
  },
  {
    title: "Tools & Platforms",
    note: "Automation and delivery",
    items: [
      "HubSpot",
      "Zapier",
      "GitHub",
      "Firebase",
      "Figma",
      "Adobe XD",
      "Elementor",
      "Photoshop / Illustrator",
    ],
  },
  {
    title: "Ways of working",
    note: "How I show up on a team",
    items: [
      "Cross-functional collaboration",
      "Delivery-focused prioritization",
      "Client-facing communication",
      "Data privacy standards",
    ],
  },
];

export type Role = {
  title: string;
  company: string;
  period: string;
  start: string;
  current?: boolean;
  summary: string;
  points: string[];
  tags: string[];
};

export const experience: Role[] = [
  {
    title: "AI Software Engineer",
    company: "Callbox Inc.",
    period: "June 2022 — Present",
    start: "2022",
    current: true,
    summary:
      "Enterprise web applications, plus the AI and automation layer that sits on top of them.",
    points: [
      "Develop and maintain enterprise-level web applications using PHP Laravel and modern JavaScript frameworks (React.js, Vue.js, Angular).",
      "Apply AI-augmented development with Cursor, Claude Code and Vibe Coding methodologies to accelerate feature delivery.",
      "Perform knowledge engineering to structure and manage data intelligently within systems.",
      "Integrate CRM platforms (HubSpot) via Zapier for workflow automation, custom reporting and business logic.",
      "Work closely with developers and data teams to integrate AI features into live production systems.",
      "Contribute to company GitHub repositories, including the Month-to-Date (MTD) Reports system.",
      "Research and apply new AI tools, frameworks and best practices against real business problems.",
    ],
    tags: ["Laravel", "React", "Vue", "Angular", "HubSpot", "Zapier", "Claude Code"],
  },
  {
    title: "Web App Developer",
    company: "Core Global Online Services",
    period: "October 2020 — April 2022",
    start: "2020",
    summary:
      "Built a school portal and public site end-to-end for an Iloilo-based Korean educational institute.",
    points: [
      "Engineered a full-featured school portal and interactive landing page for an Iloilo-based Korean educational institute.",
      "Developed dynamic backend services and frontend interfaces with an eye on performance, responsive design and cross-browser compatibility.",
      "Integrated a secure end-to-end online payment gateway to streamline tuition collection and billing for students and guardians.",
    ],
    tags: ["PHP", "JavaScript", "Payments", "Responsive UI"],
  },
  {
    title: "Research Developer",
    company: "WVSU GTBI Research Building",
    period: "January 2019 — March 2020",
    start: "2019",
    summary:
      "Full-stack systems for university faculty, plus the Arduino hardware that fed them.",
    points: [
      "Architected and deployed full-stack web applications and institutional management systems for WVSU faculty and researchers.",
      "Designed, prototyped and programmed custom Arduino hardware integrated with web dashboards for real-time monitoring and automation.",
      "Worked directly with university professors to turn research requirements into functional software and embedded prototypes.",
    ],
    tags: ["Full-stack", "Arduino", "IoT dashboards", "Research"],
  },
  {
    title: "Research and Development Officer",
    company: "Accentline Inc.",
    period: "June 2018 — January 2019",
    start: "2018",
    summary: "Core HR and attendance systems, from schema design to access control.",
    points: [
      "Engineered and maintained core Human Resource and Daily Time Record (DTR) systems using PHP Laravel and JavaScript.",
      "Designed and optimized MySQL schemas to handle complex attendance tracking, leave requests and records management.",
      "Implemented role-based authentication and secure backend logic to safeguard sensitive employee HR data.",
    ],
    tags: ["Laravel", "MySQL", "RBAC", "HR systems"],
  },
];

export type Project = {
  name: string;
  context: string;
  blurb: string;
  points: string[];
  stack: string[];
  /** Repository URL, when the code is public. */
  href?: string;
  /** Deployed URL — the card links here in preference to the repository. */
  live?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    name: "louieDevAgent",
    context: "Personal · agentic-ai-using-claude-code",
    blurb:
      "A multi-tenant AI dev agent you talk to over Telegram — each tenant gets its own bot, personality, workspace and memory.",
    points: [
      "Manager bot triages and delegates to specialist agents (Dev, Comms, Content, Ops, Research).",
      "Five-layer memory: session resumption, persistent store, full-text search, consolidation and decay.",
      "Live control dashboard served by Hono with SSE streaming.",
    ],
    stack: ["TypeScript", "Node.js", "SQLite", "Hono", "Grammy", "Claude Code"],
    href: "https://github.com/louiemarte10/agentic-ai-using-claude-code",
    featured: true,
  },
  {
    name: "Month-to-Date (MTD) Reports System",
    context: "Callbox Inc. · company GitHub",
    blurb:
      "A full month-to-date reporting system for the business, maintained across multiple branches with a CI pipeline.",
    points: [
      "API integrations feeding a reporting layer used across the company.",
      "Data visualization and automated report generation.",
      "Codebase managed through GitHub with a branching strategy and CI.",
    ],
    stack: ["PHP Laravel", "JavaScript", "MySQL", "CI"],
    featured: true,
  },
  {
    name: "Mission Control Dashboard",
    context: "Personal · louie-agent-dashboard",
    blurb:
      "Real-time monitoring and control for the agent fleet, reachable from any device without server access.",
    points: [
      "System health overview, agent grid and cross-agent activity feed.",
      "Deployed on Vercel, bridged to a local agent API over Cloudflare Tunnel.",
      "Token-based auth with config kept in browser storage only.",
    ],
    stack: ["Vue 3", "Tailwind CSS", "Vite", "Vercel"],
    href: "https://github.com/louiemarte10/louie-agent-dashboard",
    live: "https://louie-agent-dashboard.vercel.app",
    featured: true,
  },
  {
    name: "Brain Hub",
    context: "Team project · brain-hub.xyz",
    blurb:
      "Enrollment, payments and billing for a multi-branch review center — a live system carrying 6,000+ student records.",
    points: [
      "Student directory filtered by name, school and enrollee type, with remaining balance surfaced per record.",
      "Payment posting and one-click Statement of Account generation per student.",
      "Audit log capturing the actor, entity and API route behind every change.",
    ],
    stack: ["React", "Ant Design", "Tailwind CSS", "Vite", "Netlify"],
    live: "https://brain-hub.xyz/",
    featured: true,
  },
  {
    name: "The Eternals",
    context: "Personal · the-eternals",
    blurb:
      "Autonomous intelligences engineered to outlast the session, the project and the person — The Silicon Lineage.",
    points: [
      "Vue front end deployed on Vercel, released under the MIT license.",
    ],
    stack: ["Vue", "Vercel"],
    href: "https://github.com/louiemarte10/the-eternals",
    live: "https://eternal-vigil-ai.vercel.app",
  },
  {
    name: "AI-Powered Job Search System",
    context: "Personal project",
    blurb:
      "Tooling that turns the job hunt into a pipeline — CV dashboard, PDF generation and batch processing.",
    points: [
      "Built with Claude Code as a practical test of AI-augmented development.",
      "Batch processing across roles and documents rather than one-off edits.",
    ],
    stack: ["Claude Code", "PDF generation", "Batch processing"],
  },
  {
    name: "Self-Coding Typograph & Knowledge Graph",
    context: "Personal project",
    blurb:
      "An AI coding assistant that converts any folder of code, docs, papers or images into a queryable knowledge graph.",
    points: [
      "Built with Claude Code, OpenCode and Factory Droid.",
      "Knowledge engineering applied to unstructured local corpora.",
    ],
    stack: ["Claude Code", "OpenCode", "Knowledge graphs"],
  },
  {
    name: "Revieweer",
    context: "Personal · revieweer",
    blurb:
      "A voice-to-voice mock interview platform: the AI interviewer speaks questions and listens to spoken answers.",
    points: [
      "Topic selection and resume upload drive the interview.",
      "Speech-to-text and text-to-speech wrapped around a Claude interviewer.",
    ],
    stack: ["Next.js", "TypeScript", "Claude", "Groq Whisper", "ElevenLabs"],
    href: "https://github.com/louiemarte10/revieweer",
    live: "https://revieweer.vercel.app",
  },
];

export const education = [
  {
    school: "PHINMA — University of Iloilo",
    degree: "BS Information Technology",
    detail: "Rizal St., Iloilo City Proper",
    period: "2014 — 2018",
  },
  {
    school: "Iloilo City National High School",
    degree: "Secondary Education",
    detail: "M.H. Del Pilar St., Iloilo City",
    period: "2009 — 2014",
  },
  {
    school: "Baluarte Elementary School",
    degree: "Elementary Education",
    detail: "Lopez Jaena St., Iloilo City",
    period: "2003 — 2009",
  },
] as const;

export const awards = [
  {
    title: "2nd Place — Hackathon",
    issuer: "PHINMA — University of Iloilo",
    date: "March 2018",
  },
  {
    title: "Big Data University Certificate",
    issuer: "PHINMA — University of Iloilo",
    date: "May 2017",
  },
  {
    title: "NC II — Computer Hardware Servicing",
    issuer: "PHINMA — University of Iloilo",
    date: "April 2015",
  },
] as const;

export type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  pushed_at: string;
  html_url: string;
  stargazers_count: number;
};

/** Used when the GitHub API is unreachable while the page is being rendered. */
export const repoFallback: Repo[] = [
  {
    name: "github-landpage-instruction",
    description:
      "GitRef — a Next.js Git CLI documentation platform with searchable command reference and workflow guides.",
    language: "TypeScript",
    pushed_at: "2026-05-15T03:54:13Z",
    html_url: "https://github.com/louiemarte10/github-landpage-instruction",
    stargazers_count: 0,
  },
  {
    name: "revieweer",
    description: "AI-powered voice-to-voice mock interview platform.",
    language: "TypeScript",
    pushed_at: "2026-05-01T08:24:27Z",
    html_url: "https://github.com/louiemarte10/revieweer",
    stargazers_count: 0,
  },
  {
    name: "louie-agent-dashboard",
    description: "Vue.js Mission Control Dashboard for the louieDevAgent system.",
    language: "Vue",
    pushed_at: "2026-04-27T02:15:48Z",
    html_url: "https://github.com/louiemarte10/louie-agent-dashboard",
    stargazers_count: 0,
  },
  {
    name: "agentic-ai-using-claude-code",
    description:
      "louieDevAgent — a personal AI dev agent powered by Claude Code, accessible via Telegram.",
    language: "TypeScript",
    pushed_at: "2026-04-27T02:15:35Z",
    html_url: "https://github.com/louiemarte10/agentic-ai-using-claude-code",
    stargazers_count: 0,
  },
  {
    name: "the-eternals",
    description:
      "The Eternals — autonomous intelligences engineered to outlast the session, the project, and the person.",
    language: "Vue",
    pushed_at: "2026-04-24T08:37:07Z",
    html_url: "https://github.com/louiemarte10/the-eternals",
    stargazers_count: 0,
  },
  {
    name: "claude-code-installation-guide",
    description: "Step-by-step guide on how to install and use the Claude Code CLI.",
    language: "Markdown",
    pushed_at: "2026-04-23T01:49:49Z",
    html_url: "https://github.com/louiemarte10/claude-code-installation-guide",
    stargazers_count: 0,
  },
];

export type Reference = {
  name: string;
  title: string;
  phone: string;
};

/** Shown on the resume only, not on the landing page. */
export const references: Reference[] = [
  {
    name: "Rey Guidoriagao Jr.",
    title: "Full Stack React Developer — Satellite Office Solutions",
    phone: "091822554329",
  },
  {
    name: "Emmanuel Katipunan",
    title: "Software Developer / AI Engineer",
    phone: "09162400105",
  },
  {
    name: "Lucky John Faderon",
    title: "Head of AI Engineer",
    phone: "09499967617",
  },
];

export const certification =
  "I hereby certify that the above information is true and correct to the best of my knowledge and ability.";
