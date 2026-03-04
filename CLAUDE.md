# Pathos Labs Website

## Design System

Visual identity: **Precision + Humanity**. Light mode with dark hero sections. Warm sienna accent. Type-forward editorial aesthetic.

**Before writing or modifying any UI code:**
1. Use only tokens from `assets/tokens.css` (Layer 1 aliases: `var(--color-*)`, `var(--space-*)`, `var(--font-*)`, etc.)
2. Zero hardcoded color/spacing/font values in `style.css` or HTML

## Token Architecture

- **Layer 0** (`--ds-*`): Raw values in `tokens.css` — never reference in components
- **Layer 1** (`--color-*`, `--font-*`, `--text-*`, `--space-*`, etc.): Semantic aliases — components use ONLY these

## Design Rules

- **No border-radius** — anywhere, ever
- **Warm sienna is the ONLY chromatic color** — oklch(48% 0.145 32) — used sparingly
- **Fonts**: Instrument Serif (display/headlines) + Outfit (UI/body)
- **Dark hero → Light body** — homepage hero and page heroes are dark; content sections are light
- **No text below 12px** at any viewport
- **WCAG AA contrast** on all text
- **Banned words in copy**: journey, unlock, potential (generic), empower, mindset, manifestation, abundance, hustle, grind, 10x, thought leader, disrupt, ecosystem, leverage (jargon), synergy, transformational, holistic, impactful, passionate, excited to share, humbled, proud to announce, limited spots, change your life, strategic (filler), moving the needle
- Testimonials are verbatim — banned words in client quotes are exempt

## File Structure

- `assets/tokens.css` — design tokens (3-layer system)
- `assets/style.css` — component styles (imports tokens.css)
- `assets/main.js` — shared JS (nav, scroll reveals, newsletter, modal, carousel, filters, analytics)
- `assets/og-templates/` — HTML OG image templates (screenshot at 1200x630)

## Integrations

- **Kit (ConvertKit)**: Form ID `9098413`, V3 API at `api.convertkit.com/v3/`
- **Cal.com**: `https://cal.com/pathos-labs/fit-match-30`
- **GoatCounter**: `pathos-labs.goatcounter.com`
- **GitHub Pages**: CNAME `pathoslabs.co`

## Pages

- `index.html` — Homepage (conversion-focused: hero → stats → gap → work → testimonials → CTA → newsletter)
- `about.html` — Bio (photo integrated into bio section, editorial 2-column layout) + methodology
- `writing/index.html` — Unified listing with filter tabs (All/Research/Blog/Articles) + email-gated research decks
- `newsletter.html` — Kit landing page (weekly cadence)
- `404.html` — Error page
- `kit-theme.html` — Email template for Kit (paste into Kit > Settings > Email Templates)

## Research Deck Gate

Research decks on the writing page are email-gated (same pattern as research.pathoslabs.co):
- Cards with `data-gated` attribute intercept clicks
- Gate modal subscribes to Kit via V3 API, sets `localStorage('pathos_access')`
- On success, redirects to `research.pathoslabs.co/[deck]/`
- Already-subscribed users bypass the gate automatically

## Blog Post Template

`writing/post-template.html` — copy and rename to `writing/[slug].html`. Replace all `TITLE`, `EXCERPT`, `SLUG`, `DATE`, `TYPE` placeholders. Write body content inside `.post-body` using standard HTML (`<p>`, `<h2>`, `<h3>`, `<blockquote>`, `<ul>`, `<ol>`). Then add a card linking to it on `writing/index.html`.

## Photos

Photos in `assets/images/`. Key assignments:
- `sam-1-040326.png` — About page bio portrait, integrated into 2-column bio intro (writing at desk, natural light)
- Other images available for future use (session in progress, headshots, candid)

## Slide Decks

On-brand slide deck templates live at `../slide-template.html` with branding guide at `../slide-branding.md`.

To produce a new deck: read `slide-branding.md`, use the `/frontend-slides` skill, skip Phase 2 (style already defined), generate using the brand's colors/fonts/rules. Variants: Research (data-dense, citations), Workshop (sparse, exercise slides), Presentation (minimal text, bold type).

## Writing Page Filters

Filter tabs below hero toggle content visibility via `data-section-type` on sections and `data-type` on cards:
- **All**: Shows both Research and Blog/Article sections
- **Research**: Shows only research section (gated deck cards)
- **Blog/Article**: Shows blog section, filters individual cards by type
- JS logic in `main.js` handles both section-level and card-level filtering
