# Orbitech agent guide

Applies to this entire repository. Read this file and `HANDOFF.md` before working.
Use these as the starting map; inspect the specific implementation you change,
rather than rediscovering the entire codebase. Current user instructions take priority.

## Project and architecture

Orbitech's single-page company website promotes multilingual data services and
software engineering. It is static HTML, CSS, and vanilla JavaScript with no
runtime framework or build step. Do not introduce a framework without a reason
and user agreement. Google Apps Script is provided separately for form handling.

- `index.html`: page structure, hero text, section headings, static prose, forms,
  SEO/social metadata, intro bootstrap and script loading.
- `assets/css/orbitech.css`: all styling, tokens, responsive rules and accessibility.
- `assets/js/content.config.js`: `ORBITECH` configuration, repeated content,
  languages/flags, services, stats, projects, team, links and form endpoints.
- `assets/js/app.js`: config rendering, navigation, scroll spy, toolkit filtering,
  reveal effects, form validation and submission.
- `assets/js/intro.js`: opening canvas animation and logo landing/handoff.
- `assets/js/sky.js`: hero starfield, shooting stars and animation pause rules.
- `assets/img/`: supplied company logo and local flag SVGs.
- `assets/fonts/`: local Inter and Space Grotesk WOFF2 files and licenses.
- `backend/Code.gs`, `backend/SETUP-GOOGLE-APPS-SCRIPT.md`: form backend and setup.
- `CONTENT-GUIDE.md`: placeholder map; verify it against the current source.
- `scripts/check-*.cjs`: small dependency-free Node regression checks.
- `package.json`: optional local server/test scripts and Playwright dev dependency;
  it is not a React app manifest. No npm install is needed to serve the site.
- `verify.js`: Playwright browser harness; `.verify/` holds generated artifacts.

## User decisions to preserve

- Keep the supplied logo, dark space background, cyan/violet accents and original
  Space Grotesk/Inter typography. Keep assets/fonts local.
- Discuss substantial new design directions first. Design-only requests must not
  change wording or introduce company claims. Never invent proof, metrics or bios.
- Use natural, human-sounding site copy without em dashes, including form messages
  and metadata.
- Header stays hidden throughout the opening and hero; appears only after the
  hero scrolls out of view, and hides again on return to the hero.
- Opening lasts about 3–4 seconds including its fade. Avoid layout shifts,
  font flashes and a second movement when the logo lands. Keep live target
  measurements, stable scrollbar space and opacity-only hero entrance.
- Keep the diffuse nebula and shooting stars; preserve motion/accessibility gates.
- Languages: description above, continents side by side on desktop, alphabetical
  names within Asia/Europe, local flags, compact four-column grids on wide screens.
  Keep description text consistent with body copy and the coverage badge highlighted.
- Software projects are MoneyBag, DesiTrip, EVENT-EKHANE and Aid-Link. Consult
  before changing that selection. Framework toolkit has four filterable disciplines.
- Appointment booking is explicitly deferred. Do not implement it without a new request.

## Working and validation

- Preserve unrelated edits and deletions; check `git status --short` first.
- Read `HANDOFF.md` for current commands, known gaps and validation status.
- Run checks relevant to changed behavior. Do not equate Node mock checks with
  browser visual QA or repeat README claims as evidence of current verification.
- Keep secrets and real customer/submission data out of source and these documents.
- Do not stage, commit, push, deploy, or remove Git locks just to tidy the project.
  Follow the user's task scope; confirm a lock is stale before removing it.

## Maintain this context automatically during agent work

- Before ending any task that changes code, configuration, decisions or project
  status, update `HANDOFF.md` with the date, result, actual checks and remaining work.
- Update this file when architecture, file locations, commands or durable user
  preferences change. Keep transient status in `HANDOFF.md` instead.
- Record newly discovered blockers promptly, especially before handing off.
- Replace outdated statements rather than appending an endless session log.
  Separate implemented, verified, planned and unknown states explicitly.
- These are agent-maintained instructions, not a background file watcher. If an
  agent/tool does not load this guide, updates are not guaranteed.
