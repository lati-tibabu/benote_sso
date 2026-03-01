export const flow = [
  { title: "1. User Authenticated", text: "User is already signed in to your primary app." },
  { title: "2. Fetch SSO Config", text: "Frontend calls /api/auth/sso/config to get targetBaseUrl." },
  { title: "3. Request Token", text: "Frontend requests /api/auth/sso/token with Bearer token." },
  { title: "4. Sign JWT", text: "Backend signs HS256 JWT with aud, iss, exp, sub, claims." },
  { title: "5. POST Handoff", text: "triggerSSO submits hidden form to /auth/sso/callback." },
  { title: "6. Verify + Login", text: "External app validates token and starts user session." },
]

export const changelogItems = [
  {
    date: "2026-02-28",
    title: "Launched SSO docs website",
    notes: "Added separate pages for hello, docs, changelogs, and blogs with integration examples.",
  },
  {
    date: "2026-02-25",
    title: "Added framework-agnostic handoff flow",
    notes: "Standardized config endpoint, token endpoint, and hidden-form callback flow for all frontend frameworks.",
  },
  {
    date: "2026-02-20",
    title: "JWT claim contract finalized",
    notes: "Documented aud, iss, exp requirements and payload fields sub, email, name, roles, access_rights.",
  },
]

export const blogItems = [
  {
    title: "How to avoid brittle SSO handoffs",
    summary: "A practical checklist for token TTL, audience controls, callback validation, and rollout safety.",
    readTime: "6 min read",
  },
  {
    title: "Designing partner-ready auth APIs",
    summary: "Why /api/auth/sso/config + /api/auth/sso/token is a stable model across frameworks.",
    readTime: "4 min read",
  },
  {
    title: "Debugging token callback failures",
    summary: "Clock skew, wrong issuer, origin mismatch, and endpoint auth are the top root causes.",
    readTime: "5 min read",
  },
]
