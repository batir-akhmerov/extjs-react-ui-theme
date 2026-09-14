# ExtJS shadcn Theme — Parity Implementation Spec (Phase 2)

**Model:** Opus-class. This phase is visual-judgement work (screenshot compare → adjust → repeat),
which is exactly what a cheaper model cannot do reliably.

**Prerequisite phases are COMPLETE.** Both galleries exist, are structurally paired, and render
with zero console errors.

---

## 1. Goal

Restyle the ExtJS Classic app so it visually matches the React shadcn/ui design system,
with a runtime-switchable light/dark mode.

| | |
|---|---|
| ExtJS gallery | `http://localhost:1962/#galleryview` |
| React reference | `http://localhost:3000/theme-gallery` |
| Theme package | `packages/local/theme-shadcn` (extends `theme-material`) |

---

## 2. Current state

### Done
- `packages/local/theme-shadcn` created, `app.json` `builds.desktop.theme` points at it.
- ExtJS gallery: 15 sections, all `gallery-*` itemIds, 0 console errors.
- React gallery: matching sections with `data-gallery` / `data-gallery-row` hooks.
- Phase 0 spikes all passed (see §4).
- **Task A — token layer.** `sass/var/Component.scss` holds the full shadcn token set;
  per-component tokens live in matching var files (`sass/var/button/Button.scss`,
  `sass/var/form/field/{Base,Text,Checkbox,Radio}.scss`). Inter is loaded from
  `index.html`. `--ui-font-size` / `--form-font-size` are declared in
  `sass/src/Component.scss`.
- **Task C.1 — buttons.** h32/36/40, padding 5-9px × 10-14px, radius 10, fs14/fw500, no
  uppercase, no elevation. `ui: 'confirm'` / `'decline'` are now generated. Focus ring and
  opacity-based disabled state in place.
- **Task C.2 — fields.** Box border on the trigger wrap (h32, radius 10, 1px `#e5e5e5`),
  static labels (14/500), 3px focus and invalid rings, CSS-drawn 16px checkbox/radio,
  chevron/calendar triggers.
- **Task C.3 — panels/cards + toolbars.** `sass/var/panel/Panel.scss`,
  `sass/var/toolbar/Toolbar.scss` and their `sass/src` counterparts. Header is now white
  with a 16/500 dark title (was Material's near-black bar with invisible text), body `#fff`,
  card outline is `ring-1 foreground/10` at radius 14, docked bbar is a shadcn card footer
  (pad 16, `bg-muted/50`, hairline top). Material's toolbar elevation shadow is off.
- **Task C.4 — grid.** `sass/var/view/Table.scss`, `sass/var/grid/header/Container.scss`,
  `sass/var/grid/column/Column.scss`, `sass/var/grid/feature/Grouping.scss`,
  `sass/var/grid/plugin/filterbar/{filters/Base,Operator}.scss` plus
  `sass/src/view/Table.scss`, `sass/src/grid/header/Container.scss`,
  `sass/src/grid/plugin/filterbar/FilterBar.scss`. Header h40 / 14-500 / no vertical
  rules, rows h37 unstriped with a hairline under each, group headers muted with chevron
  glyphs, summary rows muted-foreground and the docked grand total bold. The checkcolumn
  span also needed `display: inline-block` (it was collapsing to a 2px dot).
- **Task C.5 — tabs.** `sass/var/tab/{Tab,Bar}.scss` + `sass/src/tab/{Tab,Bar}.scss`.
  `plain: false` is the filled pill list (bar h32 / muted / r10 / pad 3, trigger h26 /
  r8 / 14-500, active white + shadow-sm); `plain: true` is the line variant
  (transparent, 2px foreground underline). Uppercase is off.
- **Task C.6 — menus.** `sass/var/menu/Menu.scss` + `sass/src/menu/Menu.scss`. Popup is
  r10 / white / pad 4 / shadow-md / ring-1 foreground/10; items h28 with an r8 accent
  hover. Material pointed `$menu-item-active-background-color` at `$base-highlight-color`,
  which rendered hovered items black-on-black.
- **Task C.7 — windows.** `sass/src/window/Window.scss` + `sass/var/panel/Tool.scss`.
  Windows pick up the card radius/surface from the panel pass and now add the dialog ring
  plus a shadow-lg. Header tools were invisible (`$tool-glyph-color` is `#fff` in neutral
  and the header is now white) — repointed at muted-foreground.
- **Badges.** `app/desktop/src/view/gallery/GalleryView.scss` now carries real shadcn
  `<Badge>` metrics (h20, pill radius, px8/py2, 12/500) for all five variants.
- **Task B — dark layer.** `.dark-mode` is a full second palette compiled into the same
  stylesheet. Dark tokens live in `sass/var/Component.scss` as `$shadcn-dark-*`; the rules
  are split across `sass/src/**` — global surfaces and every component *without* a
  dedicated src file in `sass/src/Component.scss`, and a `.dark-mode` block at the bottom of
  each component file that has one. Splitting is required: Fashion orders src files by class
  hierarchy, so a dark rule written in `Component.scss` sorts *before* the light rule it has
  to beat. A moon/sun toggle sits in `HeaderView` →
  `MainViewController.onHeaderViewDarkModeToggle`.
- **Parity pass 8 — toasts.** Per-type icon colour (sonner richColors) and a 14/500 title.
- **Parity pass 9 — tiles / status accents.** Stat tiles are now shadcn cards (r14, ring-1,
  pad 16) with a 36px tinted icon chip, 12px muted label and 24px semibold value. The grid
  status column renders a badge chip; the confidence cell is tinted as well as barred.
- **Parity pass 10 — misc.** Avatar is a real 32px (and 24px) muted circle.
- **View SCSS re-tokenised.** `CenterView`, `HomeView` and `DetailView` no longer hardcode
  `white`; they use the card tokens and carry their own `.dark-mode` block.
- **App shell re-tokenised.** `HeaderView`, `NavView`, `TopView`, `MenuView`, `BottomView`
  and `FooterView` now use a new `$shadcn-sidebar-*` / `$shadcn-dark-sidebar-*` family in
  `sass/var/Component.scss` instead of `darken($base-color, n%)`. The nav rail is the
  shadcn sidebar surface with an accent hover/active row and a 3px primary indicator; the
  header and the version footer are flat surfaces with hairline dividers (the footer also
  cancels the panel card ring/radius); `NavView`'s drop shadow is now a hairline. The
  shared `toolbutton` icon-button UI in `app/desktop/src/Application.scss` had a hardcoded
  `white` glyph and a 24px font — now muted-foreground at 18px, with hover and `.dark-mode`
  overrides in `HeaderView.scss` / `BottomView.scss` (the generated rule is only one class
  deep, so those overrides must be two).

- **Remediation complete.** The 16 defects from the manual test pass are fixed and verified
  in light and dark mode — see `docs/EXTJS_THEME_REMEDIATION_SPEC.md` for the measured
  results and for the split-button / tab findings.
- **Textarea side labels.** `sass/src/form/field/Text.scss` now top-aligns the label cell
  next to a `textareafield` (`:has(> .x-form-textarea-body)` + `vertical-align: top` +
  9px top pad). Measured: label text top and textarea first-line top both at the same y.
- **`ext-ux` / `ext-calendar` assessed.** `ext-ux` ships SCSS for `gauge` and `rating` only,
  and neither is used by the app or the gallery. The surfaces that *are* used —
  `multiselect` and `itemselector` — are already covered: the bound lists pick up
  `sass/src/view/BoundList.scss` (r10, hairline ring, r8/h32 items) and the six
  ItemSelector nav buttons get their FontAwesome glyphs plus the accent hover from
  `sass/src/button/Button.scss`. Verified in both light and dark mode.

### Still to do
- Known cosmetic gap: the ExtJS tab bar is full-bleed where shadcn's `TabsList` is `w-fit`
  (ExtJS sizes the docked bar from the layout, so CSS alone cannot shrink it).

---

## 3. Reference design system

shadcn/ui, style `base-nova`, base colour `neutral`. Tokens live in
`c:\work\manuka-ai-agent\frontend\src\app\globals.css` (`:root` and `.dark` blocks).

Light tokens (= Tailwind neutral):

| token | value |
|---|---|
| `--background` | `#ffffff` |
| `--foreground` | `#0a0a0a` |
| `--primary` | `#171717` |
| `--primary-foreground` | `#fafafa` |
| `--secondary` / `--muted` / `--accent` | `#f5f5f5` |
| `--muted-foreground` | `#737373` |
| `--border` / `--input` | `#e5e5e5` |
| `--ring` | `#a1a1a1` |
| `--destructive` | `#e7000b` |
| `--radius` | `0.625rem` → lg 10px, md 8px, sm 6px, xl 14px |

Measured component metrics (from the live React gallery):

- **button** h32, pad 0/10, radius 10, fs14, fw500, 1px transparent border
  (xs h24/fs12/r8 · sm h28/r8 · lg h36)
- **input** h32, pad 4/10, radius 10, 1px `#e5e5e5`, transparent bg
  - focus → border `#a1a1a1` **+ `box-shadow: 0 0 0 3px ring/50`**
  - invalid → border destructive + `0 0 0 3px destructive/20`
  - disabled → bg `input/50`, opacity .5
- **textarea** h64, pad 8/10, r10
- **select trigger** h32, pad l10/r8, r10
- **checkbox** 16×16, r4; checked bg+border `#171717`
- **label** fw500
- **card** r14, bg `#fff`, no border, `ring 1px foreground/10`, pad 16, gap 16
- **table** th h40 pad-l8 fw500 left; td pad 8
- **tabs (default)** list h32 bg `#f5f5f5` r10 pad3; trigger h25 r8 pad 2/6 fw500 bg `#fff` + shadow-sm
- **tabs (line)** transparent list, active = 2px underline bar

> ExtJS focus states only change `border-color`. shadcn adds a **3px alpha ring**. This must be
> added via `box-shadow` in the override layer — there is no ExtJS variable for it. It is one of
> the highest-impact differences; do it early.

---

## 4. Architecture — LOCKED, do not revisit

**Single stylesheet + `.dark-mode` body class.** Not dual-build, not `light-dark()`.

- Light values compile normally; dark values compile inside `.dark-mode { }` in the same file.
- Both variants are build-time, so SCSS colour functions (`lighten`/`darken`/`mix`/`adjust-color`)
  keep working. This was the constraint that ruled out a pure CSS-variable theme.
- Toggle at runtime: `Ext.getBody().toggleCls('dark-mode')` — instant, no reload, no FOUC.
- **ExtJS 8.0.0.43 does not provide `.dark-mode`.** It is ours. Verified: zero `.dark-mode`
  selectors across material/neutral/triton/classic/core.
- Do **not** use the `light-dark()` CSS function (user requirement).

Spike results (all passed): custom theme compiles and inherits cleanly · SCSS var overrides reach
compiled CSS · `.dark-mode` class repaints instantly (`.x-panel-body` → `rgb(23,23,23)`).

---

## 5. Task A — token layer

Replace `packages/local/theme-shadcn/sass/var/Component.scss` with the full mapping.

- Use `dynamic()` for every variable so it stays overridable:
  `$base-color: dynamic(#171717);`
- Map §3 tokens onto ExtJS globals first (`$base-color`, `$background-color`, `$color`,
  `$border-color`, `$font-family`, `$font-size`, `$border-radius`), **then** component-level
  variables (`$form-text-field-*`, `$button-*`, `$grid-*`, `$menu-*`, `$panel-*`, `$tab-*`).
- Font: **Inter**.

### Font size — MUST be runtime-configurable

Default **14px** (stock shadcn). Not 12px — that is a manuka-app-specific override.

Two CSS variables, settable at runtime without a rebuild:

```
--ui-font-size    default 14px   general UI text
--form-font-size  default 14px   fields + labels; falls back to --ui-font-size
```

Implementation:

1. Set the SCSS variables to `14px` so **build-time box metrics** (heights, padding, line-height)
   are computed correctly.
2. In the override layer, re-declare `font-size` on text-bearing selectors using the variable:
   ```scss
   .#{$prefix}form-field,
   .#{$prefix}form-item-label,
   .#{$prefix}form-item-label-inner {
       font-size: var(--form-font-size, var(--ui-font-size, 14px));
   }
   .#{$prefix}btn-inner,
   .#{$prefix}grid-cell-inner,
   .#{$prefix}column-header-text,
   .#{$prefix}menu-item-text,
   .#{$prefix}tab-inner {
       font-size: var(--ui-font-size, 14px);
   }
   ```
3. Verify against the React gallery, which has a **12/13/14px toggle** in its header driving the
   same `--form-font-size` variable. Compare like-for-like at 14px.

> **Caveat to respect:** ExtJS computes field/button heights from font size at *build* time. The
> CSS variable changes rendered text size but **not** the compiled box metrics. Small adjustments
> (12–15px) are safe; anything larger needs a rebuild with a different `$font-size`. State this
> limitation in a comment in the SCSS.

---

## 6. Task B — dark layer

Build the real `.dark-mode` layer in `packages/local/theme-shadcn/sass/src/Component.scss`.

- Source dark values from the `.dark` block in manuka's `globals.css`.
- Prefer re-invoking ExtJS `*-ui` mixins with dark parameters inside `.dark-mode { }` over
  hand-writing individual rules — it covers all component states consistently.
- Add a toggle button to the app so it can be exercised.

---

## 7. Task C — the parity loop

Work **component by component**, in this order (highest visual impact first):

1. buttons · 2. fields (incl. focus ring) · 3. panels/cards · 4. grid · 5. tabs ·
6. menus/overlays · 7. windows · 8. toasts · 9. tiles/status accents · 10. misc

For each:

```
1. screenshot React   [data-gallery="<id>"]
2. screenshot ExtJS   #gallery-<id>
3. diff: colour, radius, height, padding, font, border, shadow
4. prefer a theme VARIABLE; fall back to a CSS override only where no variable exists
5. save → wait ~10s for rebuild → re-screenshot → repeat
6. verify numerically with getComputedStyle, not just by eye
```

> Always confirm with `getComputedStyle`. Several bugs this project already hit *looked* correct
> in a screenshot and were only caught by measuring.

Components with **no usable SCSS variables** — these need direct CSS overrides:

| component | theme vars available |
|---|---|
| `feature.Summary` | **0 — no var file exists** |
| `filterbar.FilterBar` | 3 (neutral) / 1 (triton) / 0 (material) |
| `GroupingSummary` | 4 |
| `feature.Grouping` | 18 |
| `filters.Filters` | 7 |

CSS hooks: `.x-grid-filterbar`, `.x-grid-filterbar-filtered-column`, `.x-grid-row-summary`,
`.x-grid-group-hd`.

### Tab mapping (decided)

| ExtJS | React |
|---|---|
| `plain: false` | `TabsList variant="default"` — filled pill container |
| `plain: true` | `TabsList variant="line"` — transparent + underline, **second-level hierarchy** |
| `tabPosition:'left'` + `tabRotation:0` | `orientation="vertical"` |
| `tabPosition:'bottom'` | tabs below content |

Plain tabs must read as **smaller and visually subordinate** to default tabs.

---

## 8. Traps (already paid for — do not rediscover)

1. **`sass/src/*.scss` filenames must map to a class in the build.** `DarkMode.scss` compiles to
   *nothing*, silently, with no error. Use `Component.scss` (→ `Ext.Component`).
2. **`"fashion": { "missingParameters": "error" }`** — an unknown SCSS variable is a hard build
   failure.
3. **Browser caches hard.** After a rebuild, load `http://localhost:1962/?nocache=<timestamp>`.
   Symptom otherwise: empty nav + missing view *even though the build succeeded*.
4. **Never `waitUntil: 'networkidle'`** on `localhost:1962` — the dev-server websocket never
   settles and it wedges the tab.
5. **`document.styleSheets` under-reports** Fashion-injected CSS. Verify with `getComputedStyle`.
6. **The dev server dies on `npm i`.** Restart with `npm run dev`; wait for
   "Fashion build complete" **and** "Waiting for changes...".
7. `page.context().clearCookies()` is unsupported in this browser.
8. FilterBar: alias is **`gridfilterbar`** (not `filterbar`); column config is **`filterType`**
   (not `filter`). Both fail silently.
9. **`getComputedStyle` lies when the Playwright page is not visible.** Style recalc is
   throttled, so CSS transitions report their *start* value and some elements (notably
   `<input>`) freeze outright — an inline `!important` written from JS reads back stale.
   Sanity-check by setting an inline style and reading it back; if that fails, verify
   against the compiled CSS on disk and a screenshot instead.
10. The base theme's frame mixin floors button padding at
    `(border-radius - border-width)`, so a 10px radius silently forces a 40px-tall button.
    Re-state padding in `sass/src/button/Button.scss`.
11. `theme-material` sets `$button-default-color: $base-color` in a **src** file, clobbering
    the var. Per-UI text/icon colours must be restated in CSS at 2+ class specificity.
12. Material derives `$base-highlight-color`, `$base-light/dark-color`, `$accent-*`,
    `$confirm-color`, `$alert-color` from `$base-color-name` via `material-color()` — they
    ignore `$base-color` and must each be pinned explicitly.
13. Material uses `$reverse-color` as "white" for grid rows and column headers. Our token
    layer maps it to `--primary-foreground` (`#fafafa`), so those surfaces need pinning to
    `$shadcn-background` or they come out faintly grey.
14. The gallery sections carry `itemId`, not `id`, so there is no `#gallery-<id>` selector
    until you assign one. Before screenshotting, run
    `Ext.ComponentQuery.query('galleryview')[0].items.each(c => { c.el.dom.id = c.itemId; })`.
    `page.goto` with a `?nocache=` query does not fire the hash route either — set
    `location.hash = '#galleryview'` after the load completes.
15. The React gallery's "Actions" dropdown currently throws
    `MenuGroupRootContext is missing` and takes the whole page down. Use
    `src/components/ui/dropdown-menu.tsx` as the reference for menu tokens instead of
    measuring the live page, and reload after any accidental click.
16. `Ext.grid.feature.Summary` declares the summary-row fill as
    `.x-grid-row-summary .x-grid-cell { background-color: #fff !important }`, and
    `.x-docked-summary` the same way. Any override of those needs `!important` too —
    specificity alone loses. This silently affected light mode as well.
17. `Ext.button.Button.toggle(true)` does **not** invoke the button's `handler`; it only
    sets `pressed` and fires the `toggle` event. Drive the dark-mode toggle with a real
    click (or listen for `toggle`) when scripting it.
18. **A killed dev server can leave its `sencha app watch` behind.** The next `npm run dev`
    then serves normally but never rebuilds — the terminal ends on
    `[ERR] [echo] App watch is already running for this build profile.` Kill the orphaned
    `java -jar ...sencha.jar app watch` pid and restart. Confirm a rebuild by the mtime of
    `build/development/ClassicApp/desktop/resources/ClassicApp-all_1.css`, not by the page.

---

## 9. Definition of done

1. Side-by-side screenshots of all 15 sections are visually near-identical at 14px.
2. `getComputedStyle` on button/input/card/tab matches §3 within ~1px.
3. Focus rings render as a 3px alpha ring, not just a border colour change.
4. `Ext.getBody().toggleCls('dark-mode')` flips the whole UI cleanly, including grids, fields,
   menus and windows.
5. `--form-font-size` / `--ui-font-size` change text size at runtime without a rebuild.
6. Zero console errors; no Fashion build warnings introduced.

---

## 10. Files to attach in a fresh chat

**Attach these four:**

1. `c:\work\extjs\classic-app\docs\EXTJS_THEME_PARITY_SPEC.md` *(this file)*
2. `c:\work\extjs\classic-app\.github\skills\extjs8-classic\SKILL.md`
3. `c:\work\extjs\classic-app\app\desktop\src\view\gallery\GalleryView.js`
4. `c:\work\manuka-ai-agent\frontend\src\app\globals.css`

**Confirm running first** (the agent cannot start these reliably):
- ExtJS dev server → `cd c:\work\extjs\classic-app; npm run dev` → port 1962
- React app → manuka frontend → port 3000 (`/theme-gallery` needs no login)

**Opening message:**

> Implement Phase 2 of the ExtJS shadcn theme per `docs/EXTJS_THEME_PARITY_SPEC.md`.
> Start with Task A (token layer), then the buttons and fields parity passes.
> Both dev servers are running. Use the browser tools to compare
> `http://localhost:1962/#galleryview` against `http://localhost:3000/theme-gallery`.

The agent will pick up `.github/copilot-instructions.md` and the skill automatically — no need to
paste ExtJS API documentation, and it must not crawl the Sencha API site.

---

## 11. Decision record — runtime multi-theme scoping (not yet implemented)

Recorded 2026-09-14. No code changes yet; this is a note for whoever wires up a second
runtime-switchable theme (e.g. multiple theme packages compiled into one bundle and swapped
via a `<body>` class, the same mechanism `.dark-mode` already uses for light/dark).

- **Native ExtJS component/`ui`-variant CSS needs no wrapper.** Rules keyed to framework-owned
  selectors — `.x-btn-confirm-small`, `.x-tab-bar`, `.x-panel-header-default`, the `toolbutton` /
  `footerbutton` / `confirm` / `decline` UIs, the `ui:'nav'` TreeList — only ever render on a
  component actually configured with that class/`ui`, and are namespaced by the `$prefix`/`ui`
  name Sencha Cmd already manages. They cannot collide with another theme's component CSS.
- **This theme's own invented (non-Ext-native) classes are the collision risk.** Anything *we*
  named — `.gallery-badge*`, `.gallery-tile*`, `.gallery-avatar*`, `.gallery-status-*`,
  `.gallery-toast-*`, and the app-shell hook classes (`.headerview`, `.bottomview`,
  `.footerview`, `.topview`, `.navview`, `.centerview`, `.detailview`, `.homeview`, `.imgAll`) —
  uses a generic name that a second theme package could plausibly reuse for its own purposes.
  If two such themes are ever compiled into the same bundle, these need to be scoped under a
  wrapper class on `<body>` (e.g. `.ppaAppReact`, mirrored on `.dark-mode`) so only the active
  theme's custom rules apply — the same pattern `.dark-mode` already establishes for
  light/dark, just one level higher (theme-vs-theme instead of light-vs-dark).
- **Today, this doesn't apply.** Theme selection is still build-time (`app.json`
  `builds.desktop.theme`) — only one theme's CSS is ever compiled into the bundle, so there is
  no live collision to guard against yet. Add the `.ppaAppReact`-style wrapper only when a
  second runtime-switchable theme is actually introduced; doing it preemptively here would just
  be dead selector weight.

