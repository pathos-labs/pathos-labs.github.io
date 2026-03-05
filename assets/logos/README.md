# Pathos Labs Logomarks

## How to generate PNGs

Open each HTML file in a browser and screenshot. Or use a headless browser:

```bash
# Using Chrome/Chromium headless (binary name varies by OS)
# Linux: google-chrome-stable, chromium — macOS: /Applications/Google\ Chrome.app/...
chromium --headless --screenshot=pathos-labs-dark.png --window-size=280,40 --default-background-color=0 logos-render.html
```

## Variants

| File | Context |
|------|---------|
| `*-dark` | Dark text — use on light backgrounds |
| `*-light` | Light text — use on dark backgrounds |
| `*-sienna` | Sienna monochrome — accent contexts |

## Sizes

- **Full wordmark** (`pathos-labs-*`): PATHOS.LABS
- **Short mark** (`pl-mark-*`): P.L
