# `ppa-react-ui` — Ext JS Component Package Reference

**Audience:** AI coding agents (and humans) deciding whether/how to use, style, or extend the
`ppa.react.Re*` components — in this repo or in another Ext JS app that imports this package.

**Status:** Implemented, verified against the running build. Location:
`packages/local/ppa-react-ui` in `c:\work\extjs\classic-app` (Ext JS 8.0.0.43, Classic Toolkit,
namespace `ppa.react`). Also read `.github/skills/extjs8-classic/SKILL.md` before writing any
Ext JS code — it has the framework-level lookup rules and traps that apply everywhere in this
repo.

---

## 1. What this package is and when to use it

Ext JS Classic ships no equivalent for several UI primitives that are standard in modern
React/shadcn-style design systems: a **badge/pill**, a **stat tile card**, an **avatar**, a
**typed toast**, a themed **app-shell chrome** (header bar, sidebar, nav tree, status bar), and a
consistent **status colour vocabulary** shared across badges/grid rows/grid cells/tiles.

`ppa-react-ui` fills that gap with a small set of `Re*`-prefixed Ext JS classes. They are:

- **Theme-independent.** They read their own `--re-*` CSS custom properties, not the active Ext
  JS theme's variables. Under any theme (`theme-material`, `theme-react-shadcn`, a future theme)
  they render with the *same* colours/metrics; only genuinely native Ext JS chrome (buttons,
  grids, menus, etc.) inherits the active theme's look. This has been verified by temporarily
  switching the app's build theme to `theme-material` and confirming `Re*` components kept their
  own appearance.
- **Configurable, not hardcoded.** Variant lists, the status vocabulary, and icon maps are all
  `config`s or replaceable `statics`, so a consuming app is not locked into this app's specific
  status names (`open`/`escalated`/...).
- **Meant to be extended, not just instantiated**, for the app-shell classes (`ReHeaderBar`,
  `ReSidebar`, `ReCard`, etc.) — a consuming view (`HeaderView`, `NavView`, `HomeView`, ...)
  typically `extend`s one of these rather than using its xtype directly, the same way this app's
  own shell views do (see §6 for the full pattern).

**Use this package when** you need any of: a status/tag pill, a stat/metric card, an
avatar/initials chip, a typed toast notification, an app shell (header/sidebar/nav/footer/card
surfaces), or a grid column that renders a status badge — in an Ext JS Classic 8.x app, under any
theme.

**Do not use this package for** native Ext JS concerns (buttons, plain panels/grids/forms without
a "card" look, windows, menus) — those should stay plain Ext JS components styled by the active
theme; wrapping them in a `Re*` class would fight the "theme-independent" contract for no benefit.

### Package identity

| Property | Value |
|---|---|
| Folder | `packages/local/ppa-react-ui` |
| Namespace | `ppa.react` (folders under `src/ppa/react/**` mirror it exactly, lowercase) |
| Sencha `type` | `code` |
| `toolkit` | `classic` |
| `classpath` | `["${package.dir}/src"]` — **required**; a local code package without this fails with `Unknown definition for dependency` even though `extend`/`requires` look correct |
| `sass` | `{ namespace: "ppa.react", etc: [".../sass/etc/all.scss"], var: [".../sass/var"], src: [".../sass/src"] }` |
| Wired in | root `app.json` → `requires: [..., "ppa-react-ui"]` |
| Adding this package to an app | requires a **full `npm run dev` restart**, not just a hot rebuild, the first time `app.json` gains the `requires` entry |

---

## 2. The token layer — how styling and dark mode work

Every component reads **CSS custom properties** (`--re-*`), not Sass variables, at paint time.
The Sass variables exist only to *generate* those custom properties at build time, giving three
independent override points, from strongest to weakest:

1. **Re-assign the Sass token** (`$re-*` in `sass/var/Tokens.scss`, or override it from a
   consuming theme's own `sass/var`) — retokenises the whole package at build time, with full
   Sass colour-maths capability (`mix()`, `rgba()`, etc.).
2. **Re-declare the CSS custom property** at runtime or under a scope selector — e.g.
   `document.documentElement.style.setProperty('--re-primary', 'red')` or a theme shipping
   `.my-theme { --re-surface: #0f172a; }` — **no rebuild needed**.
3. **Plain CSS class override** of a `re-*` class, as a last resort.

### 2.1 `ppa.react.Tokens` — why it exists

```js
Ext.define('ppa.react.Tokens', { singleton: true });
```
A near-empty marker class. It exists **only** so `sass/src/Tokens.scss` has a real class to map
onto — an Ext JS Sass file whose name doesn't match a class in the build compiles to nothing,
silently, with no error. Every other `Re*` class declares `requires: ['ppa.react.Tokens']` so the
token block is always present in any build that uses at least one component.

### 2.2 Complete token table (light / dark)

All of these are emitted onto `:root` (light) and re-declared inside the dark scope selector
(`.dark-mode` by default — see §2.3) by `sass/src/Tokens.scss`, from the Sass source of truth in
`sass/var/Tokens.scss`.

| CSS custom property | Light | Dark | Typical consumer |
|---|---|---|---|
| `--re-surface` | `#ffffff` | `#171717` | `ReContentArea`, `ReHeaderBar` background |
| `--re-fg` | `#0a0a0a` | `#98a3af` | Primary text on surface |
| `--re-card` | `#ffffff` | `#171717` | `ReCard`, `ReTile` background |
| `--re-card-fg` | `#0a0a0a` | `#98a3af` | Text on card |
| `--re-card-ring` | `rgba(10,10,10,.1)` | `rgba(255,255,255,.1)` | Card outline (overlay `::after`) |
| `--re-primary` | `#171717` | `#8a8a8a` | `ReBadge` default variant fill |
| `--re-primary-fg` | `#fafafa` | `#171717` | Text on primary |
| `--re-secondary` | `#f5f5f5` | `#262626` | `ReBadge` secondary variant fill |
| `--re-secondary-fg` | `#171717` | `#98a3af` | Text on secondary |
| `--re-muted` | `#f5f5f5` | `#262626` | `ReTile` icon chip, `ReAvatar` background |
| `--re-muted-fg` | `#737373` | `#a1a1a1` | Muted text/icon colour |
| `--re-accent` | `#f5f5f5` | `#262626` | `ReIconButton` hover background |
| `--re-accent-fg` | `#171717` | `#98a3af` | `ReIconButton` hover icon colour |
| `--re-destructive` | `#e7000b` | `#ff6467` | `ReBadge` destructive variant |
| `--re-destructive-fg` | `#ffffff` | `#ffffff` | Text on destructive |
| `--re-border` | `#e5e5e5` | `#262626` | Generic hairlines |
| `--re-ring` | `#a1a1a1` | `#737373` | Focus ring (`re-focus-ring()` mixin) |
| `--re-radius-sm` | `6px` | (same) | Small radii |
| `--re-radius-md` | `8px` | (same) | `ReIconButton` hover radius |
| `--re-radius-lg` | `10px` | (same) | `ReTile` icon chip radius |
| `--re-radius-xl` | `14px` | (same) | `ReCard`/`ReTile` outer radius |
| `--re-font-size` | `14px` | (same) | Falls back to `var(--ui-font-size, 14px)` from the theme package |
| `--re-sidebar` | `#fafafa` | `#171717` | `ReSidebar`, `ReSidebarHeader/Footer`, `ReNavTree`, `ReStatusBar` background |
| `--re-sidebar-fg` | `#0a0a0a` | `#98a3af` | Sidebar text |
| `--re-sidebar-accent` | `#f5f5f5` | `#262626` | `ReNavTree` row hover |
| `--re-sidebar-accent-fg` | `#171717` | `#98a3af` | Nav row hover text |
| `--re-sidebar-primary` | `#171717` | `#8a8a8a` | `ReNavTree` selection indicator (3px bar) |
| `--re-sidebar-primary-fg` | `#fafafa` | `#171717` | Selected row text |
| `--re-sidebar-border` | `#e5e5e5` | `rgba(255,255,255,.1)` | Sidebar hairlines, `ReHeaderBar` bottom border, `ReAvatar` photo ring |
| `--re-sidebar-muted-fg` | `#737373` | `#a1a1a1` | Nav icon/expander colour |
| `--re-status-<name>-fg` | ramp `fg` | ramp `dark-fg` | `ReBadge`/`ReStatus`/`ReTile` status colouring |
| `--re-status-<name>-bg` | ramp `bg` | `mix(dark-fg, #171717, 18%)` (derived) | Status background tint |

### 2.3 The default status ramp (fully replaceable)

`sass/var/Tokens.scss` declares one Sass map, `$re-status-ramp`, which the `@each` loops in both
`Tokens.scss` (custom-property emission) and `ReStatus.scss`/`ReBadge.scss`/`ReTile.scss` (CSS
selector emission) iterate over. Default entries (this app's email/booking domain — **not** part
of the package's contract):

```scss
$re-status-ramp: dynamic((
    open:        (fg: #1e40af, bg: #dbeafe, dark-fg: #93c5fd),
    escalated:   (fg: #854d0e, bg: #fef9c3, dark-fg: #fde047),
    replied:     (fg: #166534, bg: #dcfce7, dark-fg: #86efac),
    closed:      (fg: #4b5563, bg: #f3f4f6, dark-fg: #d4d4d4),
    send-failed: (fg: #991b1b, bg: #fee2e2, dark-fg: #fca5a5)
));
```
Adding a **new** status for a different domain requires two matching edits:
1. Add a map entry here (or in a re-assignment from a consuming theme's `sass/var`).
2. Call `ppa.react.ReStatus.addStatus('your-name')` (or `setStatuses([...])` to replace the whole
   vocabulary) so the JS-side helpers (`getRowCls`, `getCellCls`, `getBadgeCls`) know about it.

Both sides must agree — the CSS rules and the JS class-name helpers are generated from
independent sources that share only the string convention `re-*-status-<name>` /
`--re-status-<name>-*`.

### 2.4 Dark mode

- `$re-dark-scope: dynamic('.dark-mode')` — this app's dark-mode toggle
  (`Ext.getBody().toggleCls('dark-mode')`) is an app-level convention, not an Ext JS feature. A
  different consuming app repoints this one variable to its own class/attribute selector; no
  other change is needed.
- `$re-dark-follow-system: dynamic(false)` — optional, off by default. If set `true`, an
  additional `@media (prefers-color-scheme: dark)` block is emitted, scoped to *not* apply when
  the explicit dark-scope class is already present (so an explicit toggle always wins over the
  OS preference).
- Because every colour is a custom property, dark mode requires **zero rule duplication** inside
  each component's own SCSS — unlike the sibling `theme-react-shadcn` package (which must
  duplicate rules per `.dark-mode` block because it uses compile-time Sass variables for native
  Ext JS components). This is the core reason the token layer exists as CSS custom properties
  and not pure Sass variables (see the "Option 4 hybrid" rationale in
  `docs/PPA_REACT_UI_PACKAGE_SPEC.md` §3 if deeper *why* is needed).

---

## 3. Component catalogue

For every class: what it is, when/where to place it, its configs, the CSS it emits, and the
tokens it reads. Code samples use mocked data.

### 3.1 `ppa.react.ReBadge` — pill / tag / status chip

**xtype:** `rebadge` · **extends:** `Ext.Component` · **UI:** forced `ui: ''` (see trap below)

**What it's for / UX placement:** A small inline label — status pills in grid cells, tag chips
next to a name, inline counts/flags ("3 new"). Use inline within a row, toolbar, or form, not as
a large standalone element.

**Configs:**

| Config | Type | Default | Notes |
|---|---|---|---|
| `text` | String | `null` | HTML-encoded before render |
| `iconCls` | String | `null` | Leading icon, e.g. `'x-fa fa-check'` |
| `variant` | `'default'\|'secondary'\|'destructive'\|'outline'\|'ghost'` | `'default'` | Ignored if `status` is set |
| `status` | String | `null` | A name from the status ramp (§2.3); overrides `variant` |

**Statics:** `ReBadge.renderStatus(value)` → returns the `<span class="re-badge
re-badge-status-<value>">` HTML string, HTML-encoded — the standard grid-column renderer (used
by `ReStatusColumn`, §3.16).

**CSS emitted:** `re-badge`, `re-badge-<variant>`, `re-badge-status-<name>`, `re-badge-icon`,
`re-badge-text`. Metrics: `inline-flex`, `height: 20px`, `padding: 2px 8px`, `border-radius: 26px`
(pill), `font-size: var(--re-font-size)`, `font-weight: 500`.

**Tokens read:** `--re-primary(-fg)`, `--re-secondary(-fg)`, `--re-destructive(-fg)`, `--re-border`,
`--re-fg`, `--re-font-size`, `--re-status-<name>-fg/bg`.

```js
// Standalone
{ xtype: 'rebadge', text: 'Verified', iconCls: 'x-fa fa-check', variant: 'secondary' }

// Status-driven (colour comes from the ramp, not `variant`)
{ xtype: 'rebadge', text: 'Escalated', status: 'escalated' }

// Grid column shortcut — see ReStatusColumn (§3.16) for the no-config version
{
    text: 'Status', dataIndex: 'status', width: 140,
    renderer: function (v) { return ppa.react.ReBadge.renderStatus(v); }
}
```

**Known gotcha (already fixed in this codebase, keep in mind if copying the pattern):**
`Ext.Component` always emits `baseCls + '-' + ui`, and `ui` defaults to `'default'` even when
never set. Because `ReBadge` also names one of its own variants `-default`
(`re-badge-default`), leaving the framework default `ui` would silently apply
`re-badge-default`'s background to *every* instance regardless of the real variant. Fixed by
setting `ui: ''` on the class. If you create a new direct-`Ext.Component` subclass with a
`-default`-named variant, apply the same fix.

---

### 3.2 `ppa.react.ReStatus` — status vocabulary singleton

**No xtype** (singleton, not a widget). This is the shared "backend" for status colouring used
by `ReBadge`, grid row/cell accents, and `ReTile`.

**Property:** `statuses: String[]` — default `['open', 'escalated', 'replied', 'closed',
'send-failed']`, fully replaceable.

**Methods:**

| Method | Signature | Returns | Purpose |
|---|---|---|---|
| `getRowCls` | `(status)` | `'re-status-row-<status>'` | Apply via `viewConfig.getRowClass` on a grid to draw a 3px left-edge accent bar on the row |
| `getCellCls` | `(status, fill?)` | `'re-status-cell-<status>'` (+ `' re-status-fill'`) | Apply via a column `renderer`'s `meta.tdCls` to draw a 3px right-edge accent bar (+ optional tinted background) |
| `getBadgeCls` | `(status)` | `'re-badge re-badge-status-<status>'` | Manual badge class string, if not using `ReBadge`/`ReStatusColumn` directly |
| `setStatuses` | `(names: String[])` | — | Replace the whole vocabulary |
| `addStatus` | `(name: String)` | — | Append one status if not already present |

```js
// Grid row accent — left-edge 3px bar colour-coded by row status
viewConfig: {
    getRowClass: function (record) {
        return ppa.react.ReStatus.getRowCls(record.get('status'));
    }
}

// Grid cell accent — right-edge bar + optional tinted fill on a specific column
{
    text: 'Confidence', dataIndex: 'confidence', align: 'right',
    renderer: function (value, meta, record) {
        meta.tdCls = ppa.react.ReStatus.getCellCls(record.get('status'), /* fill */ true);
        return value;
    }
}

// Extending the vocabulary for a different domain
ppa.react.ReStatus.addStatus('pending-review');
```

---

### 3.3 `ppa.react.ReTile` — stat / metric card

**xtype:** `retile` · **extends:** `Ext.panel.Panel`

**What it's for / UX placement:** A dashboard KPI tile — icon chip + label + large numeric value,
optionally with a coloured edge accent. Place in a row of 3–5 across the top of a dashboard/home
view, or as a small summary strip above a data grid. Fixed footprint: **180×84px**, 16px body
padding — size a row of tiles accordingly rather than stretching them.

**Configs:**

| Config | Type | Default | Notes |
|---|---|---|---|
| `tileIconCls` | String | `null` | e.g. `'x-fa fa-bell'`, rendered in a 36×36 rounded chip |
| `label` | String | `null` | Small caption under the value |
| `value` | Number/String | `null` | Large headline figure |
| `accent` | `'left'\|'top'\|'right'` | `null` | Edge accent bar position |
| `status` | String | `null` | Status name — tints both the accent bar and the icon chip |

**CSS emitted:** `re-tile`, `re-tile-accent-<pos>`, `re-tile-status-<name>`, `re-tile-inner`,
`re-tile-icon`, `re-tile-text`, `re-tile-label` (12px/16px, muted), `re-tile-value` (24px/32px,
weight 600, tabular figures).

**Tokens read:** `--re-card-ring`, `--re-radius-xl/lg`, `--re-muted(-fg)`,
`--re-status-<name>-fg/bg`.

```js
// A dashboard row of 4 KPI tiles
{
    xtype: 'container', layout: 'hbox', defaults: { margin: '0 12 0 0' },
    items: [
        { xtype: 'retile', tileIconCls: 'x-fa fa-bell', label: 'Open', value: 128 },
        { xtype: 'retile', label: 'Escalated', value: 12, accent: 'left', status: 'escalated' },
        { xtype: 'retile', label: 'Replied',   value: 94, accent: 'top',  status: 'replied' },
        { xtype: 'retile', label: 'Failed',    value: 3,  accent: 'right', status: 'send-failed' }
    ]
}
```

Internally extends `Ext.panel.Panel`, so it must **neutralize inherited theme chrome first**
(background/border/box-shadow reset) and then paint its own look — this is why its base rule
sits under a two-class selector, `.x-panel.re-tile`, so it reliably outranks whatever the active
theme paints on plain `.x-panel-default`.

---

### 3.4 `ppa.react.ReAvatar` — circular initials/photo chip

**xtype:** `reavatar` · **extends:** `Ext.Component` · **UI:** forced `ui: ''`

**What it's for / UX placement:** User/agent identity — sidebar header, list rows, comment
threads, "assigned to" indicators. Use `scale: 'small'` (24px) inline in dense rows/lists, and
`scale: 'medium'` (32px, default) or a custom larger size (e.g. the app's sidebar header uses
100×100 via explicit `width`/`height`) for a profile-style header.

**Configs:**

| Config | Type | Default | Notes |
|---|---|---|---|
| `initials` | String | `null` | Shown when no `src` |
| `src` | String | `null` | Image URL; renders `<img>` instead of initials when set |
| `scale` | `'small'\|'medium'` | `'medium'` | 24px / 32px |

**CSS emitted:** `re-avatar`, `re-avatar-small`, `re-avatar-medium`. Photo variant gets a 1px
ring (`--re-sidebar-border`).

```js
{ xtype: 'reavatar', initials: 'JS', scale: 'medium' }
{ xtype: 'reavatar', src: 'resources/desktop/5.jpg', width: 100, height: 100 } // sidebar header usage
```

---

### 3.5 `ppa.react.ReToast` — typed toast notification

**xtype:** `retoast` · **extends:** `Ext.window.Toast`

**What it's for / UX placement:** Transient feedback after an action (save, delete, upload
progress) — top-right or bottom-right corner, auto-dismissing unless persistent. Prefer the
`ReToast.show()` static over manual `Ext.create` + `.show()`.

**Configs:**

| Config | Type | Default | Notes |
|---|---|---|---|
| `toastType` | `'success'\|'error'\|'warning'\|'info'\|'plain'` | `'plain'` | Drives default icon + header icon colour |

**Statics:**
- `ReToast.iconClsByType` — replaceable map, default:
  ```js
  { success: 'x-fa fa-check', error: 'x-fa fa-xmark',
    warning: 'x-fa fa-triangle-exclamation', info: 'x-fa fa-circle-info', plain: 'x-fa fa-comment' }
  ```
  (The package has no hard FontAwesome dependency — replace this map to use a different icon set.)
- `ReToast.show(cfg)` — creates + shows an instance, returns it.

```js
ppa.react.ReToast.show({
    toastType: 'success',
    title: 'Saved',
    html: 'Tour details updated.',
    align: 'tr'
});

// Persistent + custom content (e.g. a progress bar)
ppa.react.ReToast.show({
    toastType: 'plain',
    title: 'Uploading',
    align: 'br',
    autoClose: false,
    items: [{ xtype: 'progressbar', value: 0.6 }]
});
```

**Icon colours are literal, not tokens** (mirrors a "rich colours" convention rather than the
neutral `--re-*` ramp): success `#008a2e`, error `#e60000`, warning `#dc7609`, info `#0a85d1`;
`plain` uses `--re-muted-fg`.

---

### 3.6 `ppa.react.ReCard` — plain content surface

**xtype:** `recard` · **extends:** `Ext.panel.Panel`

**What it's for / UX placement:** A borderless, ring-outlined content surface with no header
chrome — the base for "home"/"detail" content panes. Typically **extended directly** by a
consuming view rather than instantiated by xtype (see `HomeView`/`DetailView` in this app).
Default `bodyPadding: 15`.

**CSS emitted:** `re-card` — background `--re-card`, text `--re-card-fg`, radius
`--re-radius-xl`, outline `box-shadow: 0 0 0 1px --re-card-ring` (no header/border/elevation from
the active theme).

```js
Ext.define('MyApp.view.detail.DetailView', {
    extend: 'ppa.react.ReCard',
    xtype: 'detailview',
    html: 'Detail content goes here'
});
```

---

### 3.7 `ppa.react.ReIconButton` — borderless icon-only button

**xtype:** `reiconbutton` · **extends:** `Ext.button.Button`

**What it's for / UX placement:** Toolbar/chrome actions where a full bordered button would be
too heavy — header bar icons (nav toggle, dark-mode toggle, detail toggle), sidebar footer
icons. Muted glyph by default, accent-tinted background on hover.

**Configs:** inherits all of `Ext.button.Button` — set `iconCls` and `tooltip`.

**CSS emitted:** `re-icon-button` (on top of inherited `.x-btn`). Hover:
`.x-btn.re-icon-button.x-btn-over` → background `--re-accent`, icon colour `--re-accent-fg`,
radius `--re-radius-md`. Written at two-class specificity to reliably outrank theme `ui` rules.

```js
{ xtype: 'reiconbutton', iconCls: 'x-fa fa-gear', tooltip: 'Settings', handler: 'onSettingsClick' }
```

---

### 3.8 `ppa.react.ReHeaderBar` — app-shell top header

**xtype:** `reheaderbar` · **extends:** `Ext.toolbar.Toolbar`

**What it's for / UX placement:** The single top-of-app header bar (north region in a `border`
layout). Flat, hairline bottom border, no elevation shadow, 18px/600 title text. Consumers
`extend` this class (see `HeaderView`, §6) rather than configuring the xtype directly, so
project-specific items (nav toggle, page heading, action icons) live in the subclass.

**CSS emitted:** `re-header-bar` — background `--re-surface`, text `--re-fg`, `border-bottom: 1px
solid --re-sidebar-border`, `box-shadow: none`.

```js
Ext.define('MyApp.view.main.header.HeaderView', {
    extend: 'ppa.react.ReHeaderBar',
    xtype: 'headerview',
    height: 50,
    requires: ['ppa.react.ReIconButton'],
    items: [
        { xtype: 'reiconbutton', iconCls: 'x-fa fa-navicon', handler: 'onNavToggle' },
        { xtype: 'component', bind: { html: '{heading}' } },
        '->',
        { xtype: 'reiconbutton', iconCls: 'x-fa fa-moon', enableToggle: true, handler: 'onDarkModeToggle' }
    ]
});
```

---

### 3.9 `ppa.react.ReSidebar` — nav rail surface

**xtype:** `residebar` · **extends:** `Ext.panel.Panel`

**What it's for / UX placement:** The west-region container for the whole left navigation
column. Not styled with elevation — separated from the content area by a right-edge hairline
(`box-shadow: 1px 0 0 0 --re-sidebar-border`). Typical composition: `tbar` = a
`ReSidebarHeader`, `items` = a `ReNavTree`, `bbar` = a `ReSidebarFooter`.

```js
Ext.define('MyApp.view.main.nav.NavView', {
    extend: 'ppa.react.ReSidebar',
    xtype: 'navview',
    layout: 'fit',
    tbar: { xtype: 'residebarheader', dock: 'top' },
    items: [{ xtype: 'menuview' /* extends ReNavTree */ }],
    bbar: { xtype: 'residebarfooter', height: 50 }
});
```

---

### 3.10 `ppa.react.ReSidebarHeader` — sidebar header/avatar strip

**xtype:** `residebarheader` · **extends:** `Ext.container.Container`

**What it's for / UX placement:** The chrome-only header strip at the top of the sidebar —
typically holds a `ReAvatar` plus a caption/welcome text. Content is supplied by the consumer
(see `TopView` in §6).

**CSS emitted:** `re-sidebar-header` — background `--re-sidebar`, text `--re-sidebar-fg`.

---

### 3.11 `ppa.react.ReSidebarFooter` — sidebar footer strip

**xtype:** `residebarfooter` · **extends:** `Ext.toolbar.Toolbar`

**What it's for / UX placement:** A docked toolbar strip below the nav tree, typically holding
2–4 `ReIconButton`s (settings, help, etc.). See `BottomView` in §5.

**CSS emitted:** `re-sidebar-footer` — background `--re-sidebar`, text `--re-sidebar-fg`,
`border-top: 1px solid --re-sidebar-border`.

---

### 3.12 `ppa.react.ReNavTree` — sidebar navigation tree

**xtype:** `renavtree` · **extends:** `Ext.list.Tree` · **UI:** `'nav'` (kept deliberately)

**What it's for / UX placement:** The left-nav navigation list itself (the tree of app
sections). **This is the highest-risk class to modify** — read the trap below before touching
it.

**Critical design note:** `ui: 'nav'` is *kept*, not just for colour — it carries the
toolstrip/collapsed-rail structural behaviour that a consuming `NavView` (micro/collapsed mode)
depends on. All colour is scoped under the compound selector `.x-treelist.re-nav-tree.x-treelist-nav`
so it never leaks onto a plain default-UI `treelist` used elsewhere in the app, and so it beats
`ext-core`'s own unscoped nav-UI CSS (which paints from its own hardcoded palette and always
compiles regardless of what this package does).

**Expander glyph:** CSS-drawn chevron (`::after` with two rotated borders), not a font glyph —
this package has no font/icon dependency. A consumer wanting a font glyph back can override the
mask/border approach in a derived selector.

**CSS emitted:** background `--re-sidebar`, row hover `--re-sidebar-accent(-fg)`, text/icon
colours `--re-sidebar-fg` / `--re-sidebar-muted-fg`, a 3px left-edge selection indicator in
`--re-sidebar-primary`.

```js
Ext.define('MyApp.view.nav.menu.MenuView', {
    extend: 'ppa.react.ReNavTree',
    xtype: 'menuview',
    bind: { store: '{menu}', micro: '{navCollapsed}' },
    listeners: { selectionchange: 'onMenuViewSelectionChange' }
});
```

---

### 3.13 `ppa.react.ReStatusBar` — flat footer/status bar

**xtype:** `restatusbar` · **extends:** `Ext.panel.Panel`

**What it's for / UX placement:** A south-region status/footer strip (e.g. showing an app/build
version). Cancels the card ring/radius a titled `Ext.panel.Panel` would otherwise pick up from
the active theme, so it reads as a flat bar, not a floating card.

```js
Ext.define('MyApp.view.main.footer.FooterView', {
    extend: 'ppa.react.ReStatusBar',
    xtype: 'footerview',
    title: 'App version: 1.4.2'
});
```

---

### 3.14 `ppa.react.ReContentArea` — main content background *(optional)*

**xtype:** `recontentarea` · **extends:** `Ext.container.Container`

**What it's for / UX placement:** The center-region background container that hosts routed
page views (typically `layout: 'card'`). One-declaration wrapper (`background: --re-surface`);
implemented for completeness — a consuming app can skip this and use a plain container if it has
no need for the shared surface token.

---

### 3.15 `ppa.react.grid.ReStatusColumn` — grid status column

**xtype:** `restatuscolumn` · **extends:** `Ext.grid.column.Column`

**What it's for / UX placement:** Drop-in grid column that renders a status badge without any
inline renderer boilerplate at the call site. Prefer this over hand-writing a `renderer` that
calls `ReBadge.renderStatus` directly.

```js
{ text: 'Status', dataIndex: 'status', xtype: 'restatuscolumn', width: 140 }
```

Internally: `renderer: function (value) { return ppa.react.ReBadge.renderStatus(value); }`.

---

## 4. Styling and theme-dependency summary

| Question | Answer |
|---|---|
| Does this package depend on the active Ext JS theme? | **No.** It reads only its own `--re-*` custom properties. It has been verified to look identical under `theme-react-shadcn` and `theme-material`. |
| Does it depend on FontAwesome? | No hard dependency. Icon classes (`iconCls`, `tileIconCls`, `ReToast.iconClsByType`) are always consumer-supplied strings; the nav tree expander is CSS-drawn, not a font glyph. |
| How do I retint one component at runtime, no rebuild? | `document.documentElement.style.setProperty('--re-primary', '#2563eb')` — every `Re*` component reading that token repaints immediately. |
| How do I retint the whole package at build time? | Re-assign the matching `$re-*` variable(s) in `sass/var/Tokens.scss`, or from a consumer's own `sass/var` file that loads after this package (see the theme override-path note in `docs/PPA_REACT_UI_PACKAGE_SPEC.md` §4/§6 — this app deliberately did **not** add a remap file in `theme-react-shadcn`, since the package's literal defaults already equal that theme's compiled values; a future visually-different theme would add one). |
| How do I add a class-level CSS override? | Target the documented `re-*` class names (§3) directly; they are stable public contracts, not incidental. |
| How does dark mode toggle? | `Ext.getBody().toggleCls('dark-mode')` (or repoint `$re-dark-scope` for a different app-level convention). No per-component rule duplication is needed — see §2.4. |
| Can I add a new status/colour to the ramp? | Yes — add a `$re-status-ramp` map entry (SCSS) **and** call `ppa.react.ReStatus.addStatus('name')` (JS) — both halves are required (§2.3). |
| Are `Re*` app-shell classes meant to be used standalone or subclassed? | The 8 app-shell classes (`ReHeaderBar`, `ReSidebar`, `ReSidebarHeader/Footer`, `ReNavTree`, `ReStatusBar`, `ReCard`, `ReContentArea`) are designed to be **extended** by a project's own view classes, which then add project-specific `items`/bindings/configs. The 6 "leaf" components (`ReBadge`, `ReTile`, `ReAvatar`, `ReToast`, `ReIconButton`, `ReStatusColumn`) are used directly by xtype. |

### The "neutralize, then paint" pattern (why several components look the way they do in SCSS)

Every `Re*` class that extends a framework container (`Ext.panel.Panel`, `Ext.toolbar.Toolbar`)
inherits whatever chrome the **currently active Ext JS theme** paints — Material's elevation
shadows, a different theme's borders, etc. To guarantee identical appearance under any theme,
each such component's SCSS first **resets** the inherited chrome (background, border,
border-radius, box-shadow) and only then paints its own look, at **two-class specificity**
(e.g. `.x-panel.re-card`, `.x-toolbar.re-header-bar`) so it reliably outranks the one-class theme
rule it must beat (`.x-panel-default`, `.x-toolbar-default`). When extending this package with a
new `Re*` class that wraps a framework container, follow the same two steps in that order.

---

## 5. Portability — using this package without `theme-react-shadcn`

**Verified independent of the active Ext JS theme.** `grep -ri shadcn packages/local/ppa-react-ui`
returns nothing — no `Re*` class or SCSS file references any `$shadcn-*` variable or
`theme-react-shadcn` construct. Every component paints exclusively from its own `--re-*` custom
properties (§2), each with a literal fallback value already inlined
(`var(--re-primary, #171717)`), so it renders correctly even if the token layer's own `:root`
block somehow failed to load. This was proven in this repo's own build-out (not just asserted):
the app's build theme was temporarily switched to `theme-material`, rebuilt, and every `Re*`
component (badges, tiles, avatars, the whole app shell) kept its intended shadcn-style
appearance while native Ext JS controls picked up Material's look, as expected.

### What a consuming app needs to provide

1. **Ext JS 8.0.0.43 Classic Toolkit** (or a close 8.x Classic release). The `Re*` classes rely
   only on stable, long-standing framework APIs (`config`/`update*`/`apply*` lifecycle,
   `Ext.panel.Panel`, `Ext.toolbar.Toolbar`, `Ext.button.Button`, `Ext.window.Toast`,
   `Ext.list.Tree`, `Ext.grid.column.Column`) — not this specific theme — but the package has
   only been exercised against this exact version.
2. **Correct package wiring**: copy `packages/local/ppa-react-ui` in whole, add `"ppa-react-ui"`
   to the consuming app's `app.json` `requires`, and do a **full dev-server restart** the first
   time (a hot rebuild alone will not pick up a brand-new package's classpath). Confirm
   `package.json`'s `sencha.classpath` (`["${package.dir}/src"]`) survived the copy — a package
   without it fails with `Unknown definition for dependency: ppa.react.*` even though the class
   code itself is correct.
3. **No FontAwesome (or any icon font) requirement.** Every icon-bearing config (`iconCls`,
   `tileIconCls`, `ReToast.iconClsByType`) is consumer-supplied; the `ReNavTree` expander chevron
   is CSS-drawn (rotated borders), not a font glyph. Any icon set, or none, works.
4. **Dark mode must be wired by the consuming app** the same way as the theme package (§2.4) —
   toggle a class (default `.dark-mode`) on whatever element the app chooses, or re-point
   `$re-dark-scope` at build time to match an existing convention.

### The one real caveat — framework-chrome neutralization under an unfamiliar theme

The six classes that extend a framework container and use the "neutralize, then paint" pattern
(§4) — `ReCard`, `ReTile`, `ReHeaderBar`, `ReSidebar`, `ReSidebarFooter`, `ReStatusBar` — reset
inherited theme chrome at **two-class specificity** (e.g. `.x-panel.re-card`). This was proven
sufficient to beat `theme-material`'s specificity and `!important` usage (§4 verification), but
has **not** been proven against every possible third-party theme. A theme that paints panel/
toolbar chrome with higher specificity or additional `!important` declarations could
theoretically let a sliver of its own border/shadow/background show through on these six classes
specifically. The remaining ten classes (`ReBadge`, `ReStatus`, `ReAvatar`, `ReToast`,
`ReIconButton`, `ReNavTree`, `ReContentArea`, `ReSidebarHeader`, `ReStatusColumn`, `Tokens`) have
no such risk — they either own their `baseCls` outright or only add colour to a structural UI
(`ReNavTree`'s `ui: 'nav'`) that ext-core, not the active theme, controls.

**Verification after integrating into a new app:** render one instance of each of the six
panel/toolbar-based classes and visually confirm no residual border, shadow, or background colour
from the host app's own theme is visible. If one leaks through, the fix is to strengthen that
class's neutralization rule (add `!important` or a third class) in
`packages/local/ppa-react-ui/sass/src/Re<Name>.scss` — never in the consuming app's own theme.

---

## 6. Composition example — a full app shell built from these components

This mirrors how this app's own `MainView`/`HeaderView`/`NavView`/etc. are wired (see
[`../gallery/EXTJS_GALLERY_PAGE_REFERENCE.md`](../gallery/EXTJS_GALLERY_PAGE_REFERENCE.md) Part B
for the as-built version with routing/ViewModel details):

```js
// MainView.js — border layout hosting the shell
Ext.define('MyApp.view.main.MainView', {
    extend: 'Ext.Container',
    xtype: 'mainview',
    layout: 'border',
    items: [
        { xtype: 'headerview', region: 'north', docked: 'top' },   // extends ReHeaderBar
        { xtype: 'navview',    region: 'west' },                    // extends ReSidebar
        { xtype: 'centerview', region: 'center' },                  // extends ReContentArea
        { xtype: 'detailview', region: 'east', docked: 'right' },   // extends ReCard
        { xtype: 'footerview', region: 'south', docked: 'bottom' }  // extends ReStatusBar
    ]
});

// NavView.js — sidebar composition
Ext.define('MyApp.view.main.nav.NavView', {
    extend: 'ppa.react.ReSidebar',
    xtype: 'navview',
    layout: 'fit',
    tbar: { xtype: 'topview',    dock: 'top' },   // extends ReSidebarHeader
    items: [{ xtype: 'menuview' }],                // extends ReNavTree
    bbar:  { xtype: 'bottomview', height: 50 }      // extends ReSidebarFooter
});
```

---

## 7. Extending the package with a new component

If a future modern-UI primitive is needed (e.g. a "progress ring" or "combo card"), follow the
established conventions so it composes correctly with the rest of the package:

1. File at `src/ppa/react/Re<Name>.js`, class `ppa.react.Re<Name>`, xtype `re<name>` (all
   lowercase, no separators).
2. `requires: ['ppa.react.Tokens']`.
3. JSDoc header with purpose, a runnable `@example`, `@cfg` for every public config, and a
   "Styling" note listing emitted classes + consumed tokens (mirrors this document's per-class
   sections — see `docs/PPA_REACT_UI_PACKAGE_SPEC.md` §5.0 for the exact template).
4. If it's a direct `Ext.Component` subclass: set `baseCls: 're-<name>'`, and if any variant is
   named `-default`, set `ui: ''` (§3.1 gotcha).
5. If it wraps a framework container (`Ext.panel.Panel`/`Ext.toolbar.Toolbar`/etc.): apply
   "neutralize, then paint" (§4) at two-class specificity; never override `baseCls`.
6. Add new tokens to `sass/var/Tokens.scss` (Sass) and mirror them in `sass/src/Tokens.scss`
   (`:root` + dark scope) rather than hardcoding literals in the new component's own SCSS file —
   keeps the single-source-of-truth/one-block-dark-mode property intact.
7. Add the new class to this document's §3 catalogue.

---

## 8. Related documents

- [`../theme-react-shadcn/THEME_REACT_SHADCN_REFERENCE.md`](../theme-react-shadcn/THEME_REACT_SHADCN_REFERENCE.md) — the native Ext JS theme this package deliberately does **not** depend on.
- [`../gallery/EXTJS_GALLERY_PAGE_REFERENCE.md`](../gallery/EXTJS_GALLERY_PAGE_REFERENCE.md) — on-screen test surface; the `gallery-badges`, `gallery-tiles` and app-shell chrome sections exercise every component in this document.
- `docs/PPA_REACT_UI_PACKAGE_SPEC.md` — the original build-out spec (useful for *why* a design decision was made; this document is the *what/how to use*).
- `.github/skills/extjs8-classic/SKILL.md` — general Ext JS 8 Classic framework knowledge and lookup rules.
