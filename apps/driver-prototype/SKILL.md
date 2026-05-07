# SKILL.md — Revv Design System

> Read this before building anything new in this project.

## What you're working with

**Revv** is an auto-shop management platform. This project contains the canonical
design tokens, icon set, brand assets, and two reference UI kits (web product +
mobile companion). All design work that targets Revv should be rooted here —
**do not re-pick colors, re-define type scales, or invent new components**
without first checking what's already shipped.

## Quick start for a new design

1. **Always import tokens.** Every new HTML file should start with:
   ```html
   <link rel="stylesheet" href="../../colors_and_type.css">
   ```
   (adjust the relative path). This gives you `--color-brand-*`, `--fg-*`,
   `--bg-*`, `--font-sans`, `--shadow-*`, etc.

2. **Pick the right surface.**
   - Web product (technician/advisor) → start from `ui_kits/shop/`. Reuse
     `.rv-sidebar`, `.rv-topbar`, `.rv-page`, `.rv-btn`, `.rv-card`, `.rv-table`.
   - Mobile (car owner) → start from `ui_kits/companion/`. Wrap content in
     `<IOSFrame>` (or `android_frame.jsx`); use `cm-*` classes; budget 90px
     bottom padding for the nav bar.

3. **Pull icons from the kit.** `assets/icons/revv/*.svg` first, then
   `assets/icons/extra/*.svg`. Both are 24px line-style at ~1.5px stroke.
   Don't introduce filled icons — it breaks the visual rhythm.

4. **Use placeholder vehicle/customer data** matching what's in
   `ui_kits/shop/components.jsx` (`SEED_ORDERS`) so screens feel like the same
   product. Sample names like "Daniel Tobiloba", "Chiamaka Mbamalu", and IDs
   like `#0065` are house style.

## Design rules

- **Status colors are semantic, not decorative.**
  Brand blue = primary/in-progress. Amber = needs action. Green = paid/done.
  Red = error/declined. Grey = neutral/no-status. Don't use blue for "success".
- **Cards have a 3px top accent in their status color** — see `WorkOrderCard`.
- **Buttons:** primary (brand fill) + secondary (brand-200 border, brand-600 text)
  + ghost (border-default + fg-primary). Pills are 6px radius, smaller than
  buttons. Both share 8px font weight 500.
- **Spacing follows a 4-pt grid** — use `--space-*` or multiples of 4.
- **Density:** Shop tables 14/18px row padding. Mobile lists 14px. Don't go
  tighter — Revv users are on the floor with greasy hands.
- **Avoid emoji.** The seed data uses 🚗 / 📅 as placeholders; replace with
  Revv icons when finishing a screen.
- **Ripple mark** (`assets/brand/logo-mark.svg`, the 4-diamond glyph) is
  reserved for app-icon and marketing usage. Don't put it inline in UI.

## Common patterns

| Need | Class / component | Where |
|---|---|---|
| Page chrome | `Sidebar`, `Topbar` | `ui_kits/shop/components.jsx` |
| Status card | `.rv-card` + `.accent` | `ui_kits/shop/shop.css` |
| Status pill | `.rv-pill .rv-pill--{success,warning,error,gray}` | shop.css |
| Filter button | `.rv-filter` | shop.css |
| Toast | `.rv-toast` (success template) | shop.css |
| Mobile hero | `.cm-hero` (brand gradient + ripple highlight) | companion.css |
| Mobile bottom nav | `BottomNav` (4 items + center FAB) | companion app.jsx |
| Timeline | `.cm-timeline` (dot + line + body) | companion.css |

## Don'ts

- Don't import Inter, Roboto, or Arial. The system is DM Sans.
- Don't use rounded corners > 16px on UI containers (only the iOS frame goes
  larger).
- Don't add new shadow values; pick from `--shadow-{xs,sm,md,lg,xl}`.
- Don't use gradients except the documented hero gradient on the companion app.
- Don't reach for filled icons or duotone illustrations.

## When in doubt

Open `preview/*.html` cards in the Design System tab — they're the source of
truth for the token values. Open `ui_kits/shop/index.html` and
`ui_kits/companion/index.html` to see the language applied.
