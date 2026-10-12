# Orbitech — landing site

A single-page marketing site for Orbitech: multilingual data solutions and
software engineering. Static HTML, CSS and vanilla JavaScript — no build step,
no framework, no dependencies.

```
orbitech/
├── index.html                          the page
├── assets/
│   ├── css/orbitech.css                design system + all styles
│   └── js/
│       ├── content.config.js           ← ALL placeholder content lives here
│       ├── intro.js                    cinematic opening sequence
│       └── app.js                      rendering, nav, forms
├── backend/
│   ├── Code.gs                         Google Apps Script form backend
│   └── SETUP-GOOGLE-APPS-SCRIPT.md     10-minute deployment guide
├── CONTENT-GUIDE.md                    where every placeholder lives
├── robots.txt · sitemap.xml            update the domain before launch
└── verify.js                           automated render / a11y test suite
```

## Running it

Open `index.html` in a browser. That's it — it works from the filesystem.

For a local server (needed if you want to test the live form endpoint, since
`file://` origins are blocked by CORS):

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Deploying

Upload the whole folder to any static host — Netlify, Vercel, Cloudflare Pages,
GitHub Pages, S3, or plain nginx. There is nothing to build and no server to
run. `backend/` is documentation only; it doesn't need uploading.

Two things to do before launch:

1. **Wire up the forms** — follow `backend/SETUP-GOOGLE-APPS-SCRIPT.md`. Until
   you do, both forms run in demo mode: they validate and confirm, but send
   nothing.
2. **Replace the placeholder content** — follow `CONTENT-GUIDE.md`. Start with
   `grep -rn "🔴 PLACEHOLDER" .`

## How it's put together

**Content vs. structure.** Section headings and the hero live as real HTML so
search engines and no-JS visitors get the full message immediately. Repeating
collections — stats, service cards, case studies, team, languages — render from
`content.config.js`, so adding a fifth case study never touches markup.

**The opening sequence.** Canvas 2D, hand-written, no library: parallax
starfield → orbital traces around the supplied logo → soft nebula emerging →
logo moves into its exact position in the hero. The sequence lasts 3.3 seconds plus a 650ms dissolve (under four seconds total). It refuses to
play when `prefers-reduced-motion` is set, on small or touch-primary devices, on
Save-Data or slow connections, on low-core-and-low-memory hardware, or if it has
already run this browser session. Every one of those paths lands on the hero's
static poster, which is pure CSS and always underneath. Skip control is the
first focusable element and Escape works too — either exits the sequence immediately with a short cross-fade.

**The handoff.** The sequence doesn't cut to the page, it resolves into it.
The intro and hero share the same CSS `.space-nebula` layer, so the diffuse
cyan and violet haze stays in place during the cross-fade. The hero copy stays
in its resting layout and fades in during the dissolve. Scrollbar space stays
reserved, and the intro logo tracks the live hero geometry. `verify.js`
compares the background frames; `node scripts/check-intro-handoff.cjs` checks
logo alignment and scroll-unlock ordering. The base nebula positions and alphas
in `seedNebulae()` and `.hero__backdrop` should still be kept in step.

**Accessibility.** Semantic landmarks, one `h1`, no heading-level skips, a skip
link, visible focus throughout, labelled form controls with `aria-invalid` and
live-region status messages, 44px minimum touch targets, and full
reduced-motion, high-contrast and print stylesheets. Every sampled text/
background pair passes WCAG AA — verified against rendered pixels, not
estimated.

**Performance.** No runtime dependencies. The space scene uses CSS gradients
and a canvas; the supplied logo and language flags are local assets. Inter and
Space Grotesk are self-hosted, preloaded variable WOFF2 fonts (~69 KB combined).
`font-display: block` briefly waits for the preloaded original brand fonts,
rather than permanently keeping a fallback font on a cold load.
The Latin subsets cover the site's English copy and language names. Font
licenses are included in `assets/fonts/`. No Google Fonts request is needed.

## Verifying changes

```bash
npm install          # playwright, dev-only
node verify.js
```

Renders the page at 390 / 834 / 1440 / 1920, plus reduced-motion, no-JS and
first-visit-vs-return passes. Checks console errors, every rendered collection,
heading order, horizontal overflow, WCAG AA contrast on real pixels (including
text over the hero's gradient layers, which a DOM-based check can't see), the
intro→hero frame match, header reveal, scroll-spy, anchor offsets, both forms'
validation and success paths, mobile menu keyboard behaviour, and touch target
sizes. Screenshots land in `.verify/`.

Not needed to run or deploy the site — delete `verify.js`, `package.json` and
`node_modules/` if you don't want them.

## Browser support

Evergreen Chrome, Edge, Firefox and Safari (last 2 versions). Degrades
gracefully further back: no `backdrop-filter` gives a solid header, no
`IntersectionObserver` falls back to scroll listeners, no JavaScript still
renders the hero, headings and prose.
