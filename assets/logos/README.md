# Pathos Labs Logomarks

## SVG Details

All SVGs have the Outfit font embedded as a base64 woff2 subset (~2.4KB). No external font dependencies — safe for offline use, print, Figma, Illustrator, etc.

All SVGs have **transparent backgrounds**. Place on any surface. Use the variant that provides sufficient contrast.

## How to generate PNGs

Open `logos-render.html` in a browser and use Chrome DevTools > right-click a `.logo-box` > "Capture node screenshot". Or use headless:

```bash
chromium --headless --screenshot=pathos-labs-dark.png --window-size=400,80 --default-background-color=0 pathos-labs-dark.svg
```

## Variants

| File | Context |
|------|---------|
| `*-dark` | Dark text — use on light backgrounds |
| `*-light` | Light text — use on dark backgrounds |
| `*-sienna` | Sienna monochrome — accent contexts |
| `*-white` | White text with sienna dot — overlays, video |

## Sizes

- **Full wordmark** (`pathos-labs-*`): PATHOS.LABS — 400×80
- **Short mark** (`pl-mark-*`): P.L — 128×80

## PNG Exports

Pre-rendered PNGs at multiple sizes:
- `*-lg.png` — large (for print, presentations)
- `*-md.png` — medium (for web, email)
- `*-sm.png` — small marks only (favicons, avatars)
- `company-logo-*.png` — LinkedIn company page format
