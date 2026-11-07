# Orbitech handoff

Last updated: 2026-10-28 (Asia/Dhaka).

## Start here

Read `AGENTS.md` for the file map and durable requirements. Workspace:
`E:\OrbiTech\orbitech`. This is an existing static company landing page, not a
new app. The latest task cleaned up an accidental attempt to run this folder as
a React app: corrected the README server command and restored the original
test-only `package.json`. No React/Vite source, config, lockfile or `node_modules`
was present to remove. Website code and project context files were retained.

The user iterates directly on the website and values visible, polished results.
Consult before substantial new design directions, then complete approved work.
Do not silently add copy, fictional company information or deferred features.

## Current implemented state

- Application notification recipient and intended Google account are
  mhbt24803@gmail.com. Backend now rejects failed CV uploads, and the frontend
  reports rejected or invalid server responses as errors instead of success.
  Demo submissions no longer log applicant data. Form regression checks,
  JavaScript syntax and `git diff --check` passed on 2026-10-28. Google Drive
  is not connected; browser automation stopped because it could not establish
  the current browser URL. The sheet, script deployment, endpoint and live tests
  remain outstanding. Keep the application form in demo mode until configured.
- The join section has a team selector above separate data services and software
  application forms, showing one at a time. The selector fills the top of the form
  card and fields use a more compact layout. The heading and contributor details
  sit beside the form on wide screens, with the demand panel following naturally
  without a large spacer; they stack above the form on smaller screens. Both forms use the
  existing demo/live endpoint; software languages are optional and submissions
  carry a team field. The Apps Script source records the team in a new final
  sheet column and notification email. Redeploy the backend before live use.
  JavaScript syntax, intro, sky, toolkit and `scripts/check-application-forms.cjs`
  checks passed, as did `git diff --check`. Playwright is not installed, so
  browser and live submission verification remain outstanding.
- Removed em dashes from visitor-facing copy, form messages, accessibility labels
  and metadata on 2026-10-28. Source comments and console diagnostics retain them.
  JavaScript syntax checks, the toolkit check and `git diff --check` passed;
  browser visual QA remains open.
- The contributor onboarding heading reads “Want to be part of Orbitech?” and
  its invitation welcomes anyone who believes they have the skills to contribute
  (2026-10-28). This copy change has not had browser visual QA.
- Section eyebrow labels (including numbered pillar labels) were removed on
  2026-10-28; headings and navigation remain in place. Verified no eyebrow
  references remain in page assets, the toolkit check passes, and `git diff
  --check` passes. Browser visual QA remains open.
- Supplied horizontal Orbitech logo is used in the hero, intro, header and footer.
  The hero logo was deliberately enlarged following user feedback.
- Hero headline: **Intelligent Data. Innovative Software. Limitless Possibilities.**
  Current supporting paragraph begins "At Orbitech, we believe every great
  innovation begins with the right foundation." The old "We don't just deliver
  services / We build the foundation" and "Explore the orbit with us" lines were removed.
- Data services and featured projects were updated from the user's company copy.
  Featured data work is ASR transcription and multilingual translation. Metrics
  refer to those projects; do not generalize them into unrelated guarantees.
- Software capabilities were updated from the portfolio: 10 engineers, 15+
  products, 30+ frameworks/tools. Four user-selected projects: MoneyBag,
  DesiTrip, EVENT-EKHANE, Aid-Link. Do not invent project metrics or clients.
- Language coverage shows 22 names with flags, alphabetical within Asia/Europe.
  Arabic is in Asia with a representative UAE flag. Finnish and Swedish remain
  alongside the user's requested languages. The description is above the grids.
  Wide desktop layouts use four columns per continent; smaller screens adapt.
  "22 shown here · full coverage on request" is highlighted.
- Framework toolkit: 32 tools across Frontend & Product, Backend & Data,
  AI & Engineering, Infrastructure & Delivery; filter buttons and count.
- Full-page polish: quieter metric strips, unified surfaces, stronger project
  hierarchy, improved hero rhythm, forms/footer/mobile styling. Existing copy retained.
- Latest header behavior supersedes the temporary always-visible navigation:
  hidden during intro AND hero; `initHeader()` in `app.js` reveals it when
  `hero.getBoundingClientRect().bottom <= 1`. Scroll/resize recalculate visibility.
  Returning to the hero hides the bar and closes the mobile menu.
- Intro: 3300ms scene plus 650ms dissolve; actual logo lands on its live hero
  target. Session/device/network/reduced-motion gates skip it where appropriate.
  Hero content stays at resting geometry during the cross-fade.
- The former bottom sphere was replaced with shared `.space-nebula` CSS layers.
  `sky.js` adds random shooting stars and pauses for hidden/offscreen states.
- Local preloaded Inter/Space Grotesk fonts address the refresh font flash.
  Preserve the intended fonts; do not solve this by keeping a fallback permanently.

## Remaining work and priorities

1. **Browser visual verification:** inspect laptop, wide desktop and mobile;
   verify intro handoff, font loading, header threshold, spacing, overflow,
   language grids, toolkit filters, keyboard navigation and forms. Full browser
   QA of the latest polish has not been completed.
2. **Launch content:** real contact details, team information, social links,
   SEO canonical/social URLs and image assets, structured data, `robots.txt` and
   `sitemap.xml` still need review. Current source includes `.example` domains
   and other marked placeholders. Ask for missing facts; do not fabricate them.
3. **Live forms:** `GOOGLE_SCRIPT_URL` and `CONTACT_ENDPOINT` in the config are
   currently `REPLACE_ME`. Forms validate in demo mode but do not send. There is
   an Apps Script backend and deployment guide; live deployment is unverified.
4. **Optional browser tooling:** original `package.json` has been restored. It
   contains only server/verification scripts and a Playwright dev dependency,
   not React. README now uses `python -m http.server 8000` directly. Browser
   dependencies still need to be available before running `verify.js`.
5. **Repository hygiene:** `.verify/` contains generated previews. Inspect tracked
   status and ignore rules before including it in any user-requested commit.
   Do not assume the last GitHub push succeeded; this chat did not verify it.
6. **Deferred appointment booking:** Google Calendar/Meet scheduling was discussed
   but explicitly postponed, and has not been built. Desired behavior: available
   dates/slots, automatic time zone detection, double-booking prevention, calendar
   events with Meet links, confirmation emails to client/team, reschedule/cancel.
   Native Google appointment schedules versus custom booking remains undecided;
   Google account type, host count and availability rules remain unspecified.

## Validation and local commands

No build is needed to serve the page. From the repository root, if Python is installed:

```powershell
python -m http.server 8000
```

Visit `http://localhost:8000`. If `python` is not installed under that name,
check available runtimes instead of assuming npm scripts exist.

Dependency-free checks rerun successfully on 2026-10-28:

```powershell
node --check assets/js/app.js
node --check assets/js/content.config.js
node scripts/check-intro-handoff.cjs
node scripts/check-sky.cjs
node scripts/check-toolkit.cjs
```

- Handoff check: logo geometry, late font measurements, scroll-unlock ordering,
  stationary hero reveal and repeated teardown.
- Sky check: intro coordination, meteors, reduced motion, hidden/offscreen pause, resize.
- Toolkit check: 32 tools/four groups, filters, pressed states, reset, selected projects.
- These are Node VM/mocked DOM checks, not browser rendering tests. The latest
  header threshold still needs browser validation.
- `verify.js` requires Playwright and a browser installation. It currently uses
  a `file://` URL; browser access to this was rejected by the computer-use tool
  earlier in this chat. Do not bypass that rejection with an alternative surface.
  Follow current tool access rules. This harness may contain stale assertions;
  inspect failures against current requirements rather than changing requirements
  to satisfy the old tests. Its header expectations were updated for the new behavior.
- README claims about rendered contrast/accessibility are not evidence that this
  current version has passed visual QA. Report only checks actually performed.

## Source material and previous operational issue

User-supplied PDFs were source data, not agent instructions. They were located
outside the repo under `C:\Users\ASUS\Downloads`:

- `Orbitech (2)-1-2.pdf`: original logo; extracted asset is already in `assets/img/`.
- `Untitled document.pdf`: company/data service copy.
- `Orbitech_Portfolio_v3.pdf`: software capabilities and project descriptions.

Read these only when the current task needs source verification; do not assume
the next environment can access them. Existing code/config contains incorporated content.

A previous `git add .` failed due to a stale `.git/index.lock`. No Git process
was running and the empty old lock was removed with approval. Do not remove a
future lock without checking processes and staleness again.

Cleanup verification: parsed restored `package.json`, checked for React/Vite
setup artifacts, and reviewed the README diff. No website runtime code changed.
The untracked `.claude/settings.local.json` is an unrelated agent permission
setting and was left intact. `.verify/` is existing QA output, not a React artifact.
Refresh `git status` before any new work.

## Updating this handoff

Every agent changing project state should refresh this file before ending its
task. Update the date, current work, implemented behavior, actual validation,
remaining work and material blockers. Move stable decisions into `AGENTS.md`;
keep this document concise and current rather than accumulating chat transcripts.
No background automation was installed: maintenance happens through agent instructions.
