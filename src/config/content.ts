/**
 * Page copy that is shared across routes. Kept factual: no client names, statistics,
 * testimonials, timelines or guarantees. Update freely, but keep that rule.
 */

export type Service = {
  id: string;
  number: string;
  title: string;
  /** One-line summary for the Home preview cards. */
  summary: string;
  /** Longer intro for the Services page. */
  intro: string;
  includes: string[];
  outputs: string[];
  /** A candid note on limits or trade-offs. */
  note: string;
};

export const services: Service[] = [
  {
    id: 'ai-workflow-automation',
    number: '01',
    title: 'AI & Workflow Automation',
    summary:
      'Map how work actually flows, then automate the repetitive parts — with AI where it helps and people kept in the loop where it matters.',
    intro:
      'Most operational friction lives in hand-offs, copy-and-paste and manual checks. We start by mapping the current process with the people who run it, then design automations that fit your existing tools rather than replacing them by default.',
    includes: [
      'Business process mapping of current and proposed workflows',
      'Identifying steps suited to rules-based automation, AI assistance, or neither',
      'AI-assisted workflows such as document handling, triage, summarisation and data extraction, with human review where needed',
      'Integrations between the tools your team already uses',
    ],
    outputs: [
      'A clear process map with agreed automation opportunities',
      'A working automation or prototype for the selected workflow',
      'Documentation and hand-over notes for your team',
    ],
    note: 'Not every process benefits from AI. Part of the work is identifying where a simple rule, an integration, or no change at all is the better answer.',
  },
  {
    id: 'product-design-ux',
    number: '02',
    title: 'Product Design & UX',
    summary:
      'Audits, flows, prototypes and design systems that make products easier to understand, use and extend.',
    intro:
      'Good design reduces the effort it takes to use a product and to keep building it. We work from evidence where it exists, are explicit about assumptions where it does not, and design with engineering constraints in view.',
    includes: [
      'UX audits of existing products and journeys',
      'User flows, information architecture and wireframes',
      'Interactive prototypes for testing ideas before they are built',
      'Design systems: components, tokens and usage guidance',
    ],
    outputs: [
      'Audit findings, prioritised by impact and effort',
      'Clickable prototypes for key journeys',
      'A documented component library ready for development',
    ],
    note: 'A prototype is a way to learn quickly. We will be clear about which decisions have been tested with users and which are still assumptions.',
  },
  {
    id: 'saas-software-engineering',
    number: '03',
    title: 'SaaS & Software Engineering',
    summary:
      'MVPs, web applications and SaaS foundations built to be maintained — not just launched.',
    intro:
      'We build focused software with a clear scope, readable code and sensible infrastructure. For new products, that usually means an intentionally narrow MVP that tests the core idea before more is invested.',
    includes: [
      'MVP scoping and build for new products',
      'Web applications and internal tools',
      'SaaS foundations such as authentication, roles, admin and billing integration',
      'APIs and integrations with third-party services',
    ],
    outputs: [
      'Working software, deployed to an agreed environment',
      'Source code and technical documentation, handed over as agreed',
      'A short list of known limitations and recommended next steps',
    ],
    note: 'An MVP is narrow by design. We agree what is in and out of scope before building, and flag trade-offs as they come up.',
  },
  {
    id: 'product-strategy',
    number: '04',
    title: 'Product Strategy',
    summary:
      'Roadmaps and priorities grounded in what your users need and what your team can realistically deliver.',
    intro:
      'Strategy work connects business goals to concrete product decisions. We help clarify the problem, weigh options — including build, buy or wait — and turn the result into a roadmap your team can act on.',
    includes: [
      'Product discovery and problem definition',
      'Product roadmapping and prioritisation',
      'Requirement definition for upcoming work',
      'Build-versus-buy and technical feasibility assessments',
    ],
    outputs: [
      'A prioritised roadmap with clear rationale',
      'A defined backlog for the next phase of work',
      'Decision notes that record why choices were made',
    ],
    note: 'A roadmap is a plan, not a promise. It should be revisited as you learn more from users and the market.',
  },
];

export type ProcessStep = {
  number: string;
  title: string;
  summary: string;
  activities: string[];
  outputs: string[];
  expectation: string;
};

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    summary: 'Understand the problem, the people involved and the constraints before proposing a solution.',
    activities: [
      'Conversations with the people who own and use the process or product',
      'Review of existing tools, data and documentation',
      'Agreement on goals, constraints and what success looks like',
    ],
    outputs: ['A written problem statement and scope', 'Key risks and open questions', 'An estimate for the next phase'],
    expectation:
      'Discovery can be short for well-understood problems and longer for complex ones. Estimates are given after this step, not before it.',
  },
  {
    number: '02',
    title: 'Design',
    summary: 'Shape the solution — workflows, interfaces and architecture — and test it before committing to build.',
    activities: [
      'Workflow, interface and system design',
      'Prototypes for the riskiest or least certain parts',
      'Review sessions with you and, where possible, with users',
    ],
    outputs: ['Flows, wireframes or prototypes', 'A technical approach and agreed scope for the build'],
    expectation: 'Designs often change after feedback. That is the point of this step — it is cheaper to change a design than finished software.',
  },
  {
    number: '03',
    title: 'Build',
    summary: 'Develop in small, reviewable increments so progress is visible and course corrections are cheap.',
    activities: [
      'Iterative development with regular check-ins',
      'Testing throughout, not only at the end',
      'Deployment to an agreed environment',
    ],
    outputs: ['Working software or automations', 'Documentation and hand-over notes'],
    expectation:
      'Timelines depend on scope and complexity. If something changes, we will tell you early and agree how to adjust scope, time or budget.',
  },
  {
    number: '04',
    title: 'Improve',
    summary: 'Measure how the solution performs in real use and refine it based on evidence.',
    activities: [
      'Review of usage, feedback and issues after launch',
      'Prioritised fixes and improvements',
      'Recommendations for what to do next — including when to stop',
    ],
    outputs: ['A short review of what is working and what is not', 'A prioritised list of next steps'],
    expectation: 'Real-world use always reveals something new. Planning for a period of refinement leads to better outcomes than treating launch as the finish line.',
  },
];

export const principles: { title: string; body: string }[] = [
  {
    title: 'Clarity before code',
    body: 'We agree the problem, scope and success criteria in writing before anything is built.',
  },
  {
    title: 'Honest estimates',
    body: 'Estimates come after discovery, and we flag changes as soon as we see them.',
  },
  {
    title: 'Small, visible steps',
    body: 'Work is delivered in increments you can review, so there are no surprises at the end.',
  },
  {
    title: 'Built to hand over',
    body: 'Documentation and clear structure, so your team can understand and extend what we build.',
  },
];

export const values: { title: string; body: string }[] = [
  { title: 'Clarity', body: 'Plain language, clear scope and decisions that are written down.' },
  { title: 'Craft', body: 'Careful design and engineering, built to last beyond launch.' },
  { title: 'Integrity', body: 'No inflated claims. We say what we can do, and what we cannot.' },
  { title: 'Curiosity', body: 'Understanding the problem deeply before deciding on the solution.' },
];

export const projectTypes: string[] = [...services.map((s) => s.title), 'Something else'];

/**
 * Question-and-answer copy. Written answer-first so search engines and AI assistants can quote a
 * complete answer from one paragraph. Every answer restates facts already on the site — keep it
 * that way (no prices, timelines, client names or claims that have not been verified).
 * Each set appears on one page only, and the same text feeds that page's FAQPage structured data.
 */
export type Faq = { question: string; answer: string };

export const companyFaqs: Faq[] = [
  {
    question: 'What is JP & Co.?',
    answer:
      'JP & Co. is a founder-led technology company led by Lakshmi Narayana (Ram), CEO & Founder. It works with businesses on AI and workflow automation, product design and UX, SaaS and software engineering, and product strategy.',
  },
  {
    question: 'What services does JP & Co. offer?',
    answer:
      'JP & Co. offers four services: AI and workflow automation, product design and UX, SaaS and software engineering, and product strategy. They can be used together or on their own, depending on what the problem needs.',
  },
  {
    question: 'Who founded JP & Co.?',
    answer: 'JP & Co. was founded by Lakshmi Narayana (Ram), who leads the company as CEO & Founder.',
  },
  {
    question: 'Does JP & Co. build its own products?',
    answer:
      'Not yet. Today JP & Co. works with businesses on client projects. Over time it plans to build its own B2B SaaS products, shaped by the problems it sees in that work.',
  },
  {
    question: 'How do I start a project with JP & Co.?',
    answer:
      'Every project starts with a scoping call. Email ram@jpandcotech.com, call 9573319095 or use the enquiry form on the Contact page. If it looks like a good fit, JP & Co. follows up with a written outline of scope and next steps.',
  },
];

export const engagementFaqs: Faq[] = [
  {
    question: 'How much does a project cost, and how long does it take?',
    answer:
      'It depends on scope and complexity, so JP & Co. gives estimates after a discovery step, once the problem is properly understood, rather than before it. If scope changes during a project, you are told early and the adjustment to scope, time or budget is agreed together.',
  },
  {
    question: 'Should every business process use AI?',
    answer:
      'No. Not every process benefits from AI. Part of the automation work is identifying where AI helps, where a simple rule or an integration is the better answer, and where no change is needed at all. Where AI is used, people stay in the loop for review.',
  },
  {
    question: 'What is an MVP and what does it include?',
    answer:
      'An MVP (minimum viable product) is an intentionally narrow first version of a product that tests the core idea before more is invested. JP & Co. agrees in writing what is in and out of scope before building, and flags trade-offs as they come up.',
  },
  {
    question: 'Will we receive the source code and documentation?',
    answer:
      'Yes. Engineering work is handed over with source code and technical documentation as agreed, plus a short list of known limitations and recommended next steps, so your team can understand and extend what was built.',
  },
  {
    question: 'Can JP & Co. work with the tools we already use?',
    answer:
      'Yes. Automations are designed to fit your existing tools rather than replace them by default, and integrations between the tools your team already uses are part of the AI and workflow automation service.',
  },
];
