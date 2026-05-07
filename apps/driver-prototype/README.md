# Revv — Auto-Care Design System

A complete design system + UI kits for **Revv**, an auto-shop management platform.
The system serves two surfaces:

1. **Shop** — a web product for service advisors and technicians to manage work orders, customers, payments, and settings.
2. **Companion** — a mobile app where car owners can authorize estimates, track progress, and view records.

## What's in this project

```
colors_and_type.css         All design tokens (colors, type, radii, shadows, spacing)
preview/                    Tokens-and-components reference cards (Design System tab)
assets/
  brand/                    Logo lockups, ripple banners, source overview images
  icons/revv/               Bespoke Revv icon set (line, 24px, ~1.5px stroke)
  icons/extra/              Supplementary glyphs (Untitled UI library)
ui_kits/
  shop/                     Hi-fi web product — workbay, customers, settings, dashboard
  companion/                Mobile app — sign-in, home, work-order detail
SKILL.md                    How a future agent should use this system
```

## Design language at a glance

| Token | Value | Used for |
|---|---|---|
| Brand 500 | `#3777FF` | Primary actions, links, focus, status accents |
| Sidebar | `#1B2649` | Shop product chrome, hero gradients |
| Display | DM Sans 700 (-2% tracking) | Page titles, hero numbers |
| Body | DM Sans 400 / 500 | Everything else |
| Mono | JetBrains Mono | IDs, code snippets |
| Radius | 8px (md) default | Buttons, inputs, cards |
| Shadow | `sm` 1px+3px on cards · `lg` for menus · soft cool tint | Elevation |

The visual signature is the **four-diamond ripple mark** — used in the logo, in
hero artwork, and as a watermark in marketing surfaces.

## How to use this kit

- **Building a new shop screen?** Read `ui_kits/shop/shop.css` and reuse `.rv-*` classes. The shell (`Sidebar` + `Topbar` + `.rv-page`) is the standard frame.
- **Building a new mobile screen?** Wrap in `<IOSFrame>` and use `cm-*` classes from `ui_kits/companion/companion.css`. Bottom-nav is fixed; respect 90px page padding.
- **Need a token?** It's in `colors_and_type.css`. Don't re-pick colors by eye.
- **Need an icon?** Look in `assets/icons/revv/` first, then `assets/icons/extra/`. They are mask-friendly and 24px.

## Status

All token cards and component cards live in `preview/` and are registered for
review in the Design System tab. The Shop and Companion artifacts are fully
working, clickable prototypes — open `ui_kits/shop/index.html` or
`ui_kits/companion/index.html`.
