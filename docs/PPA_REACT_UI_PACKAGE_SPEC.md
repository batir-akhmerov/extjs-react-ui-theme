# `ppa-react-ui` — Shared Custom Component Package

**Status:** intent spec, not yet implemented.
**Implementer:** Sonnet-class model. **Author/reviewer:** Opus.
**Repo:** `c:\work\extjs\classic-app` (Ext JS 8.0.0.43, Classic toolkit, app namespace `ClassicApp`).

---

## 0. START HERE — required reading and lookup rules

1. Read `.github/skills/extjs8-classic/SKILL.md` **before writing any code**. It has the verified
   8.0.0.43 patterns, this app's conventions, and the silent-failure traps.
2. Read `docs/EXTJS_GALLERY_SPEC.md` and `docs/EXTJS_THEME_PARITY_SPEC.md` — they describe how the
   components being extracted here came to exist and what metrics they must hit.
3. Resolve API gaps in this order: **copy working code already in this repo** → **grep
   `node_modules/@sencha/ext-classic/src/**` and `node_modules/@sencha/ext-core/**`** (targeted
   line ranges only) → one specific page of `https://docs.sencha.com/extjs/8.0.0/classic/Ext.html`.

> **HARD RULE — do not crawl the Sencha API site.** Class pages are enormous; fetching several
> will hard-fail the request with `model_max_prompt_tokens_exceeded`. Delegate any large lookup to
> an Explore subagent and ask for a short distilled answer.

---

## 1. Goal

The theme-parity work produced a set of components that Ext JS does not ship — badges, stat tiles,
avatars, status accents, typed toasts, and the whole app-shell chrome (header bar, sidebar, nav
tree, status bar). They currently exist as **loose CSS class names written inline in
`GalleryView.js` and styled inside `theme-react-shadcn`**. That makes them unshareable and
unusable outside this one theme.

This task turns them into a **real, reusable, theme-independent Ext JS code package**:

- a new local package `ppa-react-ui`;
- one Ext JS class per component, `Re`-prefixed, one file each, following Sencha naming rules;
- each component owns its CSS, named after the class (`re-badge-*`, `re-tile-*`, …);
- **styling has zero dependency on `theme-react-shadcn`** and looks identical under material,
  triton, neutral or any future theme, in both light and dark mode;
- themes may *optionally* re-skin the components later, through a documented token layer.

### Non-goals

- No visual redesign. The extracted components must look **pixel-identical to today** when running
  under `theme-react-shadcn`. This is a refactor, not a parity pass.
- No change to native Ext JS component theming (buttons, fields, grid, tabs, menus, windows,
  panels, trees). All of that stays in `theme-react-shadcn` and is out of scope.
- The gallery page itself stays in the app. Only the *components it demonstrates* move.

---

## 2. Inventory — the custom components being extracted

This is the complete list. Every entry was verified against the current source.

### 2.A From the component gallery

| # | Component | CSS classes today | Styled in | React counterpart | New class |
|---|---|---|---|---|---|
| 1 | **Badge** | `.gallery-badge`, `-default`, `-secondary`, `-destructive`, `-outline`, `-ghost` | `theme-react-shadcn/sass/src/Component.scss` L317–355; dark L834–856 | `<Badge>` | `ReBadge` |
| 2 | **Status badge / chip** | `.gallery-status-chip-{open,escalated,replied,closed,send-failed}` | same file L399–402; dark L904–907 | status pill in the React table | `ReBadge` (`status` config) + `ReStatusColumn` |
| 3 | **Stat tile** | `.gallery-tile`, `.gallery-tile-icon`, `.gallery-tile-label`, `.gallery-tile-value` | L419–466; dark L858–870 | `<StatTile>` card | `ReTile` |
| 4 | **Tile edge accent** | `.gallery-tile-accent-{left,top,right}` combined with `.gallery-status-*` | L387–397; dark L892–902 | — (ExtJS-side invention) | `ReTile` `accent` + `status` configs |
| 5 | **Grid row status accent** | `.gallery-row-<status>` (plus the dead `.gallery-row-status`) | L376–378; dark L883–885 | table row accent | `ReStatus.getRowCls()` |
| 6 | **Grid cell status accent / fill** | `.gallery-status-<status>`, `.gallery-cell-fill` (plus the dead `.gallery-status-cell`) | L380–385, L412–414 | tinted table cell | `ReStatus.getCellCls()` |
| 7 | **Avatar** | `.gallery-avatar`, `.gallery-avatar-sm` | L468–487; dark L871–874 | `<Avatar>` | `ReAvatar` |
| 8 | **Typed toast** | `.gallery-toast-{success,error,warning,info,plain}`, `.x-toast .x-title-text` | L489–513 | sonner toast | `ReToast` |
| 9 | Section / row scaffolding | `.gallery-section`, `.gallery-row` | `app/desktop/src/view/gallery/GalleryView.scss` | gallery-only | **stays in the app — not library code** |

`.gallery-status-cell` (`GalleryView.js` L514) and `.gallery-row-status` (L542) have **no CSS rule
anywhere**. They are dead — drop them, do not port them.

### 2.B App-shell chrome (all custom-styled for `theme-react-shadcn`)

| # | Component | CSS classes / `ui` today | Styled in | React counterpart | New class |
|---|---|---|---|---|---|
| 10 | **App header bar** | `.headerview` (+ its `.x-btn-over` rules) | `Component.scss` L163–182 | site header | `ReHeaderBar` |
| 11 | **Icon button** | `ui: 'toolbutton'` / `'toolbutton-toolbar'`, `ui: 'footerbutton'` | `sass/src/button/Button.scss` L77–95, L141–145 | `<Button variant="ghost" size="icon">` | `ReIconButton` |
| 12 | **Sidebar** | `.navview` | `Component.scss` L240–245; dark L760–762 | `<Sidebar>` | `ReSidebar` |
| 13 | **Sidebar header / avatar strip** | `.topview`, `.imgAll` | L228–238 | `<SidebarHeader>` | `ReSidebarHeader` (avatar via `ReAvatar`) |
| 14 | **Sidebar footer strip** | `.bottomview` | L186–201 | `<SidebarFooter>` | `ReSidebarFooter` |
| 15 | **Sidebar nav tree** | `treelist` `ui: 'nav'` → `.x-treelist-nav …` | L248–290; dark L779–828 | `<SidebarMenu>` | `ReNavTree` |
| 16 | **Status bar / footer** | `.footerview` | L205–226 | page footer | `ReStatusBar` |
| 17 | **Card surface** | `.homeview`, `.detailview` | L300–306; dark L764–770 | `<Card>` | `ReCard` |
| 18 | **Content area** | `.centerview` | L308–310; dark L772–775 | page background | `ReContentArea` *(optional, Phase 4)* |

---

## 3. Styling architecture — options and recommendation

The hard requirement: **a `ppa-react-ui` component must look the same under every theme, must not
reference any `$shadcn-*` variable, and must still be re-skinnable by a theme later.** It also has
to keep working with the app's existing `.dark-mode` body-class toggle.

### Option 1 — Hardcode literal values in the package SCSS
Every colour/radius written as a literal hex in `sass/src/Re*.scss`.

* ✅ Trivially theme-independent, zero moving parts.
* ❌ A theme can only re-skin by writing higher-specificity CSS — fragile, and it fights the
  package rather than configuring it.
* ❌ Dark mode means duplicating every rule by hand inside the package with no way to retint.
* ❌ Fails the "each theme can customize later" requirement in any clean way.

### Option 2 — Package-owned SCSS variables with `dynamic()` literal defaults
`sass/var/Tokens.scss` in the package declares `$re-*` tokens with literal defaults; a theme
overrides by re-assigning them non-dynamically.

* ✅ The native Ext JS mechanism; exactly how Sencha's own packages do it.
* ✅ SCSS colour functions (`mix`, `lighten`, `rgba`) keep working.
* ⚠️ Build-time only — a theme change needs a rebuild (acceptable; theme selection is already
  build-time via `app.json` `builds.desktop.theme`).
* ⚠️ Requires verifying that a theme's `sass/var` really sorts after a code package's `sass/var`.
* ❌ Dark mode still needs a parallel `$re-dark-*` set and a duplicated `.dark-mode` rule block per
  component — the same maintenance tax `theme-react-shadcn` already pays.

### Option 3 — Pure CSS custom properties
Package emits `:root { --re-*: … }` and `.dark-mode { --re-*: … }`; every rule reads `var(--re-*)`.

* ✅ Dark mode is **one** token block — no rule duplication at all.
* ✅ Themes and even runtime code can re-skin without a rebuild.
* ❌ No build-time SCSS colour maths on tokens (`mix($token, …)` is impossible).
* ❌ Values cannot be fed into Ext JS `*-ui` mixins, which take real SCSS values.
* ❌ No compile-time error if a token is misspelled — it just silently falls back.

### Option 4 — **Hybrid: SCSS `dynamic()` token layer that emits CSS custom properties** ← RECOMMENDED

The package declares its tokens **twice over**: once as SCSS `dynamic()` variables (build-time,
overridable by a theme, usable in colour maths), and once emitted into CSS custom properties
(runtime, one-block dark mode). Component rules read the CSS variable with the SCSS value inlined
as the fallback:

```scss
// packages/local/ppa-react-ui/sass/var/Tokens.scss
$re-surface:          dynamic(#ffffff);
$re-surface-dark:     dynamic(#171717);
$re-fg:               dynamic(#0a0a0a);
$re-fg-dark:          dynamic(#98a3af);
// …

// packages/local/ppa-react-ui/sass/src/Tokens.scss
:root {
    --re-surface: #{$re-surface};
    --re-fg:      #{$re-fg};
}

#{$re-dark-scope} {
    --re-surface: #{$re-surface-dark};
    --re-fg:      #{$re-fg-dark};
}

// packages/local/ppa-react-ui/sass/src/ReBadge.scss
.re-badge-secondary {
    background-color: var(--re-secondary, #{$re-secondary});
    color: var(--re-secondary-fg, #{$re-secondary-fg});
}
```

This gives a theme **three** independent override levels, strongest first:

1. **Re-assign the SCSS token** in the theme's `sass/var/` (or the app's `app/desktop/sass/var.scss`)
   — retokenises the whole package at build time, colour maths intact.
2. **Re-declare the CSS custom property** under a scope selector — e.g. a theme can ship
   `.my-theme { --re-surface: #0f172a; }` with no package change and no rebuild.
3. **Plain CSS override** of a `re-*` class, as a last resort.

And it gives the package a **single-block dark mode** — `.dark-mode { --re-*: … }` retints every
component at once, instead of ~90 duplicated rules.

> **Recommendation: Option 4.** It is the only option that satisfies all four constraints
> (theme-independent default, theme-overridable, dark-mode-capable, maintainable) at once.
> Options 1–3 each fail at least one.

### Token layer rules

- **Semantic names, not shadcn names.** `--re-surface`, `--re-fg`, `--re-muted`,
  `--re-muted-fg`, `--re-accent`, `--re-accent-fg`, `--re-border`, `--re-ring`,
  `--re-primary`, `--re-primary-fg`, `--re-destructive`, `--re-radius-sm|md|lg|xl`,
  `--re-font-size`, plus the status ramp `--re-status-<name>-fg` / `--re-status-<name>-bg`.
  Do **not** name a token after shadcn — another theme must be able to remap it honestly.
- **Defaults are literal values copied from today's compiled output**, so running under
  `theme-react-shadcn` is a visual no-op. Read the current values from
  `theme-react-shadcn/sass/var/Component.scss` L20–69 (light) and L175–220 (dark) and inline them
  as literals in the package. **Never `@import` or reference `$shadcn-*` from the package.**
- **The dark scope selector is a variable**: `$re-dark-scope: dynamic('.dark-mode');` — this app's
  `.dark-mode` class is an app invention, not an Ext JS feature, so another consumer must be able
  to point the package at their own class.
- Optional, default **off**: `$re-dark-follow-system: dynamic(false);` guarding an
  `@media (prefers-color-scheme: dark)` block. This app toggles explicitly, so leave it off.
- **`--re-font-size` defaults to `14px`** and should fall back to the app's existing
  `--ui-font-size` where one is present: `var(--re-font-size, var(--ui-font-size, 14px))`.

### "Neutralize, then paint"

Several components extend framework classes (`ReTile`/`ReCard` → `Ext.panel.Panel`,
`ReHeaderBar` → `Ext.toolbar.Toolbar`, `ReStatusBar` → `Ext.panel.Panel`). Those inherit whatever
chrome the **active** theme paints — material's elevation shadows, triton's borders, etc. For the
component to look identical under every theme, its SCSS must **first reset the inherited chrome**
(`background`, `border`, `border-radius`, `box-shadow`, header colours) and **then** paint its own.
Write this explicitly at the top of each such file; do not assume a neutral starting point.

Specificity: theme rules such as `.x-panel-default` are one class deep, and Fashion's file ordering
between a code package and the active theme is not guaranteed in our favour. Write component rules
that must beat a theme default at **two classes** — `.x-panel.re-tile`, `.x-toolbar.re-header-bar`
— not one.

---

## 4. Package creation

### 4.1 Layout

```
packages/local/ppa-react-ui/
    package.json
    sass/
        etc/all.scss              // mixins only (re-focus-ring, re-truncate, …)
        var/
            Tokens.scss           // the $re-* token layer  (§3)
            ReBadge.scss          // per-component vars, only where one is genuinely needed
            …
        src/
            Tokens.scss           // emits :root + dark-scope custom properties
            ReBadge.scss
            ReTile.scss
            …
    src/
        ppa/
            react/
                Tokens.js
                ReBadge.js
                ReTile.js
                ReAvatar.js
                ReToast.js
                ReStatus.js
                ReCard.js
                ReIconButton.js
                ReHeaderBar.js
                ReSidebar.js
                ReSidebarHeader.js
                ReSidebarFooter.js
                ReNavTree.js
                ReStatusBar.js
                grid/
                    ReStatusColumn.js
```

### 4.2 `package.json`

Copy `packages/local/theme-react-shadcn/package.json` as the starting point and change:

```json
{
    "name": "ppa-react-ui",
    "sencha": {
        "namespace": "ppa.react",
        "type": "code",
        "toolkit": "classic",
        "creator": "anonymous",
        "summary": "Reusable React/shadcn-style custom components for Ext JS Classic",
        "version": "1.0.0",
        "compatVersion": "1.0.0",
        "framework": "ext"
    }
}
```

Remove the theme-only keys (`extend`, and anything theme-specific). Keep `"toolkit": "classic"`.

### 4.3 Wiring

- `workspace.json` already has `${workspace.dir}/packages/local` first on the package path — **no
  change needed**.
- `app.json` → add to `requires`:
  ```json
  "requires": ["font-awesome", "ux", "calendar", "ppa-react-ui"]
  ```
  Use the **Sencha package name**, exactly as in the directory.

### 4.4 Namespace ↔ path mapping (verified)

Sencha Cmd maps a package's `sass/src/**` onto **the package namespace**, not `Ext`. Confirmed
against the shipped `ext-ux` package (namespace `Ext.ux`):

```
node_modules/@sencha/ext-ux/sass/src/rating/Picker.scss        → Ext.ux.rating.Picker
node_modules/@sencha/ext-ux/classic/sass/src/form/ItemSelector.scss → Ext.ux.form.ItemSelector
```

So for namespace `ppa.react`:

```
sass/src/ReBadge.scss              → ppa.react.ReBadge
sass/src/grid/ReStatusColumn.scss  → ppa.react.grid.ReStatusColumn
src/ppa/react/ReBadge.js           → ppa.react.ReBadge
```

The namespace is **lowercase `ppa.react`** and the folders match it exactly (`src/ppa/react/`).
This is a deliberate decision (§10.1) and mirrors Sencha's own `Ext.ux` precedent of a lowercase
namespace segment. Ext JS does not care about case in `Ext.define`, but Sencha Cmd resolves the
file path from the namespace **character for character**, so a case-sensitive CI box would break on
a mismatch. Keep both lowercase everywhere.

> **TRAP (same as theme trap 1):** a `sass/src/*.scss` file whose name does not map to a class
> **actually present in the build** compiles to *nothing*, silently, with no error. That is why the
> token layer needs a real class (`ppa.react.Tokens`) that every component `requires` — see §5.1.
> Verify emission by grepping the compiled CSS, never by eye.

---

## 5. Class specifications

### Conventions that apply to every class

- `Ext.define('ppa.react.ReX', { … })`, `xtype: 'rex'` (all lowercase, no separators — Ext JS
  house style), one class per file, file path mirrors the class name exactly.
- **Every class carries a JSDoc header — this is a hard requirement, see §5.0.**
- **CSS class naming:** `re-<component>` and `re-<component>-<variant>`, kebab-case, derived from
  the class name (`ReBadge` → `re-badge`, `ReSidebarHeader` → `re-sidebar-header`).
- **How the CSS class reaches the DOM — pick by base class:**
  - **Direct `Ext.Component` subclasses** (`ReBadge`, `ReAvatar`): set `baseCls: 're-badge'`.
    Ext JS then also appends `baseCls + '-' + ui` for the `ui` config, which gives the shadcn
    variant model for free: `ui: 'secondary'` → `class="re-badge re-badge-secondary"`.
    **Verify this in 8.0.0.43** by inspecting the rendered element; if `ui` does not emit the
    suffix class, fall back to a `variant` config that pushes the class in `initComponent` via
    `this.addCls()`. Do not guess — check the DOM.
  - **Framework subclasses** (`ReTile`, `ReCard`, `ReHeaderBar`, `ReStatusBar`, `ReSidebar*`,
    `ReNavTree`, `ReIconButton`, `ReToast`): **never override `baseCls`** — it would strip all the
    structural CSS the base class depends on. Add `cls: 're-tile'` and append variant classes from
    config `update*` methods.
- Every component declares `requires: ['ppa.react.Tokens']` so its token block is always in the build.
- **Every component is configurable and data-driven.** Nothing hardcodes a caller's vocabulary:
  variant lists, status names, icon classes and label/value text are all `config`s or replaceable
  `statics` maps. No literal `'open'` / `'escalated'` / `'fa-check'` buried in a method body.
- No `Ext.ux.*` and no FontAwesome dependency inside the package (see §5.13 for the one place this
  bites). Icons are supplied by the consumer via `iconCls`.

---

### 5.0 Documentation standard — REQUIRED on every class

This package is a shared library; the JSDoc block is the only documentation its consumers get.
Every `Re*` class file opens with a header block containing, in this order:

1. `@class` line and a one-paragraph **what it is and why it exists** — specifically, which React /
   shadcn primitive it stands in for and which Ext JS gap it fills.
2. A **runnable usage example** in an `@example` block — real config, not pseudocode.
3. `@cfg` for every public config, with type, default and allowed values.
4. A short **Styling** note listing the CSS classes the component emits and the `--re-*` tokens it
   reads, so a theme author knows what to override without reading the SCSS.

Template:

```js
/**
 * @class ppa.react.ReBadge
 * @extends Ext.Component
 *
 * A small pill-shaped label, equivalent to shadcn/ui's `<Badge>`. Ext JS ships no badge
 * component, so this fills that gap for status pills, counts and inline tags.
 *
 * Use `variant` for the generic visual weights and `status` for a value from the status
 * ramp (see {@link ppa.react.ReStatus}). The two are mutually exclusive.
 *
 *     @example
 *     {
 *         xtype: 'rebadge',
 *         text: 'Verified',
 *         iconCls: 'x-fa fa-check',
 *         variant: 'secondary'
 *     }
 *
 *     // In a grid column:
 *     { text: 'Status', dataIndex: 'status', xtype: 'restatuscolumn', width: 140 }
 *
 * ## Styling
 * Emits `re-badge` plus `re-badge-<variant>` or `re-badge-status-<status>`.
 * Reads `--re-secondary`, `--re-destructive`, `--re-border`, `--re-fg`, `--re-font-size`
 * and the `--re-status-*` ramp.
 *
 * @cfg {String} text The badge label. HTML-encoded before rendering.
 * @cfg {String} [iconCls] Optional leading icon class, e.g. `'x-fa fa-check'`.
 * @cfg {'default'/'secondary'/'destructive'/'outline'/'ghost'} [variant='default']
 * @cfg {String} [status] A status ramp name. Overrides `variant` when set.
 */
```

Apply the same structure to `Tokens`, `ReStatus` and `ReStatusColumn` — for the two singletons the
example shows how to call the helpers and how to replace the built-in maps.

### 5.1 `ppa.react.Tokens`

```js
Ext.define('ppa.react.Tokens', {
    singleton: true
});
```

Exists purely so `sass/src/Tokens.scss` has a class to map onto and is always in the build. Add a
one-line comment saying so. It may later grow runtime helpers (e.g. `setDarkMode()`), but not now.

`sass/src/Tokens.scss` emits the `:root` block and the `#{$re-dark-scope}` block described in §3.

### 5.2 `ReBadge` — `xtype: 'rebadge'`, extends `Ext.Component`

Replaces items 1 and 2.

```js
config: {
    text: null,         // plain text, html-encoded
    iconCls: null,      // optional leading icon
    variant: 'default', // default | secondary | destructive | outline | ghost
    status: null        // open | escalated | replied | closed | send-failed — mutually exclusive with variant
}
```

- `baseCls: 're-badge'`. Variant → `re-badge-<variant>`; status → `re-badge-status-<status>`.
- Metrics to preserve exactly (from `Component.scss` L317–328): `inline-flex`, `gap 4px`,
  `height 20px`, `padding 2px 8px`, `1px solid transparent`, `border-radius 26px`,
  `font-size var(--re-font-size…)`, `font-weight 500`, `white-space nowrap`.
- Provide a **static renderer** for grid use, replacing the inline HTML at `GalleryView.js` L741:
  ```js
  statics: {
      renderStatus: function (value) { /* returns the <span class="re-badge re-badge-status-…"> */ }
  }
  ```
  It must `Ext.String.htmlEncode` the value — the current inline renderer already does; keep that.

### 5.3 `ReTile` — `xtype: 'retile'`, extends `Ext.panel.Panel`

Replaces items 3 and 4.

```js
config: {
    tileIconCls: null,      // e.g. 'x-fa fa-bell'
    label: null,
    value: null,
    accent: null,           // left | top | right
    status: null            // status ramp name; tints the accent bar and the icon chip
}
```

- `cls: 're-tile'`; accent → `re-tile-accent-<pos>`; status → `re-tile-status-<name>`.
- Renders the icon chip / label / value markup currently produced by the `statTile()` helper in
  `GalleryView.js` L102–110. Move that markup into an `Ext.XTemplate` on the class and **delete the
  helper from the view**. Inline `style="display:block"` in that helper must become real CSS.
- Sub-element classes: `re-tile-icon`, `re-tile-label`, `re-tile-value` (L442–466).
- Keep the `:after` overlay ring trick and the transparent `.x-panel-body` rule (L419–440) — both
  exist for documented reasons; port the comments with them.
- Defaults `width: 180, height: 84, bodyPadding: 16` become class defaults so callers stay terse.

### 5.4 `ReAvatar` — `xtype: 'reavatar'`, extends `Ext.Component`

Replaces items 7 and the `.imgAll` ring at L235–237.

```js
config: {
    initials: null,
    src: null,        // image URL; when set, renders an <img> instead of initials
    scale: 'medium'   // small (24px) | medium (32px)
}
```

`baseCls: 're-avatar'`; scale → `re-avatar-small` / `re-avatar-medium`. Image variant carries the
1px ring currently on `.imgAll`.

### 5.5 `ReToast` — `xtype: 'retoast'`, extends `Ext.window.Toast`

Replaces item 8, and the `GalleryViewController.onToastButtonClick` body (L87–107).

```js
config: {
    toastType: 'plain'   // success | error | warning | info | plain
}
statics: {
    show: function (cfg) { /* Ext.create('ppa.react.ReToast', cfg).show(); */ }
}
```

- Must **append**, not replace, the base `x-toast` class. The current code works around this with
  `cls: 'x-toast gallery-toast-' + type` and a comment explaining why — the subclass should solve it
  properly via `initComponent` + `addCls`, and the workaround comment can then go.
- Default `iconCls` per type (`fa-check` / `fa-xmark` / `fa-triangle-exclamation` /
  `fa-circle-info` / `fa-comment`) — the icon *class strings* stay configurable so the package does
  not hard-depend on FontAwesome; put the map in a `statics.iconClsByType` that a consumer can
  replace.
- Port the per-type header-icon colour rule at its current selector depth (`Component.scss`
  L502–512) — the shorter selector will not win.
- Port `.x-toast .x-title-text { font-size: 14px; font-weight: 500 }` as
  `.re-toast .x-title-text`.

### 5.6 `ReStatus` — singleton, no xtype

Replaces items 5 and 6. Owns the status vocabulary so nothing else has to know it.

**Must be data-driven.** The five names below are manuka's email domain, not a UI concept — they
ship as the *default* ramp, but a consumer must be able to replace the whole set without editing
the package.

```js
Ext.define('ppa.react.ReStatus', {
    singleton: true,

    // Default ramp. Replaceable wholesale via setStatuses(), or extendable per-name via
    // addStatus(). Nothing in the package may reference these names directly.
    statuses: ['open', 'escalated', 'replied', 'closed', 'send-failed'],

    getRowCls: function (status) { return 're-status-row-' + status; },
    getCellCls: function (status, fill) { /* 're-status-cell-<s>' [+ ' re-status-fill'] */ },
    getBadgeCls: function (status) { return 're-badge re-badge-status-' + status; },

    setStatuses: function (names) { /* replaces the ramp */ },
    addStatus: function (name) { /* appends one name */ }
});
```

The SCSS side must be data-driven to match: a **single SCSS map** `$re-status-ramp` drives an
`@each` loop that emits every `re-status-row-*` / `re-status-cell-*` / `re-badge-status-*` rule.
Adding a status is then one map entry plus one `addStatus()` call — no rule duplication. Follow the
shape of the existing loop at `Component.scss` L374–415, but with the light and dark values in one
map so the `.dark-mode` block loops over the same source:

```scss
$re-status-ramp: dynamic((
    open:        (fg: #1e40af, bg: #dbeafe, dark-fg: #93c5fd),
    escalated:   (fg: #854d0e, bg: #fef9c3, dark-fg: #fde047),
    replied:     (fg: #166534, bg: #dcfce7, dark-fg: #86efac),
    closed:      (fg: #4b5563, bg: #f3f4f6, dark-fg: #d4d4d4),
    send-failed: (fg: #991b1b, bg: #fee2e2, dark-fg: #fca5a5)
));
```

A theme re-skins the ramp by re-assigning `$re-status-ramp`; a consumer adding a *new* status
adds a map entry and calls `addStatus()`. Dark backgrounds keep the existing
`mix($color, #171717, 18%)` derivation rather than a hand-written `dark-bg`, so a new entry only
needs `fg` / `bg` / `dark-fg`.

CSS shapes (from L374–415): row → `inset 3px 0 0 0` on `.x-grid-cell-first`; cell →
`inset -3px 0 0 0` plus text colour; `re-status-fill` adds the tinted background. All colours come
from the ramp via the `--re-status-*` tokens.

### 5.7 `ppa.react.grid.ReStatusColumn` — `xtype: 'restatuscolumn'`, extends `Ext.grid.column.Column`

A column that renders `ReBadge.renderStatus` by default, so grids stop carrying inline renderer
HTML. Used by the gallery's status column (`GalleryView.js` L737–745).

### 5.8 `ReCard` — `xtype: 'recard'`, extends `Ext.panel.Panel`

Replaces item 17 (`.homeview`, `.detailview`). The plain shadcn card surface: `bg --re-card`,
`border-radius --re-radius-xl`, `box-shadow 0 0 0 1px --re-card-ring`, no header chrome by default.
`HomeView` and `DetailView` then `extend: 'ppa.react.ReCard'` and their `.scss` files shrink to
layout-only or disappear.

### 5.9 `ReIconButton` — `xtype: 'reiconbutton'`, extends `Ext.button.Button`

Replaces item 11. Today this is the `toolbutton` / `toolbutton-toolbar` / `footerbutton` `ui`
variants generated in `theme-react-shadcn/sass/src/button/Button.scss` L77–95, plus the hover
overrides duplicated in `.headerview` and `.bottomview`.

- Keep `Ext.button.Button`'s `baseCls`; add `cls: 're-icon-button'`.
- 18px muted-foreground glyph, accent hover at `--re-radius-md`, transparent background, no border.
- Write the hover rule at **two classes** (`.re-icon-button.x-btn-over`) — the theme's generated
  `ui` rule is one class deep and this must outrank it. This is the same specificity problem the
  current `.headerview .x-btn-over` workaround exists to solve; the subclass removes the need for
  the per-container duplicates.
- Once this lands, `toolbutton` / `footerbutton` `ui` generation can be **deleted** from the theme.

### 5.10 `ReHeaderBar` — `xtype: 'reheaderbar'`, extends `Ext.toolbar.Toolbar`

Replaces item 10. Background `--re-background`, `border-bottom: 1px solid --re-sidebar-border`,
`box-shadow: none` (kills material's elevation), title text 18/600 — that `font-size/weight` pair
currently lives in `app/desktop/src/view/main/header/HeaderView.scss` and moves here.
`HeaderView` then `extend`s this class.

### 5.11 `ReSidebar` — `xtype: 'residebar'`, extends `Ext.panel.Panel`

Replaces item 12 (`.navview`). Hairline separator via `box-shadow: 1px 0 0 0 --re-sidebar-border`,
explicitly cancelling the theme's drop shadow.

### 5.12 `ReSidebarHeader` / `ReSidebarFooter`

Replaces items 13 and 14. `ReSidebarHeader` extends `Ext.container.Container`
(`.topview` → `re-sidebar-header`); `ReSidebarFooter` extends `Ext.toolbar.Toolbar`
(`.bottomview` → `re-sidebar-footer`, including its top hairline and `ReIconButton` hover colours).

### 5.13 `ReNavTree` — `xtype: 'renavtree'`, extends `Ext.list.Tree`

Replaces item 15. **This is the highest-risk class in the package — read carefully.**

- **Keep `ui: 'nav'`.** It is not just colour: the nav `ui` also carries the toolstrip and
  collapsed/micro-rail structure that `NavView` depends on. Removing it would change behaviour.
- Add `cls: 're-nav-tree'` and write **all colour rules scoped as `.re-nav-tree.x-treelist-nav …`**
  in the package. That scoping is what makes them theme-independent *and* keeps them off the
  unscoped default-`ui` treelist CSS.
- **Do not call the `treelist-ui` mixin from the package.** It is defined in
  `@sencha/ext-core/sass/src/list/TreeItem.scss` (a `src` file, not `etc`), so its visibility from
  another package's `sass/src` is not guaranteed. If a build error says "undefined mixin", that is
  the cause — hand-write the CSS against the `.x-treelist-*` hooks instead.
- **Trap (theme parity spec trap 19):** ext-core emits the default-`ui` treelist CSS *unscoped*,
  which also lands on `.x-treelist`. Any change here can silently regress the nav rail. After this
  class lands, re-verify the sidebar in **both** light and dark mode: 3px primary selection
  indicator, accent hover, correct expander glyph.
- **Expander glyph — no font dependency allowed.** The current theme uses
  `$fa-var-chevron-right … $fontawesome-font-family`, which the package cannot rely on. Replace
  with a CSS-drawn chevron or an inline SVG data-URI `background-image`/`mask-image` so the package
  works without FontAwesome. If a theme wants a font glyph back, it can override the
  `--re-nav-expander-*` tokens. **Verify the glyph renders as a chevron in a screenshot** — a wrong
  codepoint still computes a valid `font-family` (theme parity spec trap 20).

### 5.14 `ReStatusBar` — `xtype: 'restatusbar'`, extends `Ext.panel.Panel`

Replaces item 16 (`.footerview`). A flat bar: cancels the panel card radius/ring, sidebar surface,
top hairline, 12px normal-weight muted title. Port the existing rules at `Component.scss` L205–226
verbatim, retokenised.

### 5.15 `ReContentArea` — `xtype: 'recontentarea'`, extends `Ext.Container` *(optional, Phase 4)*

Replaces item 18 (`.centerview`). This is two declarations (background + colour) and may not earn
its own class. Implement only if Phases 1–3 land cleanly; otherwise leave `.centerview` in the app
and note it.

---

## 6. Implementation phases

Work in this order and verify after each phase — do not batch.

| Phase | Content | Gate |
|---|---|---|
| **1** | Package skeleton (§4), `Tokens` class + token layer (§3, §5.1), `ReBadge` end-to-end | `re-badge` rules present in the compiled CSS; gallery badges pixel-identical to before in light **and** dark |
| **2** | Gallery components: `ReTile`, `ReAvatar`, `ReToast`, `ReStatus`, `ReStatusColumn` | `#gallery-badges`, `#gallery-tiles`, `#gallery-toasts`, `#gallery-misc` unchanged; `GalleryView.js` no longer contains any `gallery-badge/tile/avatar/status/toast` string |
| **3** | App shell: `ReCard`, `ReIconButton`, `ReHeaderBar`, `ReSidebar`, `ReSidebarHeader`, `ReSidebarFooter`, `ReNavTree`, `ReStatusBar` | Full app shell unchanged in both modes; **nav rail verified specifically** |
| **4** | Cleanup: delete migrated rules from `theme-react-shadcn`, add the theme's optional `$re-*` remap, optional `ReContentArea` | `grep -r "gallery-" packages/local/theme-react-shadcn` returns nothing; app visually unchanged |

### App-side migration (Phase 2–3)

- `GalleryView.js` — replace inline `cls: 'gallery-badge …'` components with `xtype: 'rebadge'`;
  replace the tile `defaults`/`html` blocks with `xtype: 'retile'`; delete the `statTile()` helper;
  replace the status column renderer with `restatuscolumn`; replace the avatar HTML with
  `xtype: 'reavatar'`. Add the new classes to the view's `requires` — **xtype strings alone will
  not be resolved by Sencha Cmd** (SKILL §2).
- `GalleryViewController.js` — `onToastButtonClick` / `onProgressToastClick` call
  `ppa.react.ReToast.show({ … })`.
- `GalleryView.scss` — keeps only `.galleryview`, `.gallery-section`, `.gallery-row`.
- `HeaderView.js` → `extend: 'ppa.react.ReHeaderBar'`; `NavView.js` → `ReSidebar`;
  `TopView.js` → `ReSidebarHeader`; `BottomView.js` → `ReSidebarFooter`;
  `MenuView.js` → `ReNavTree`; `FooterView.js` → `ReStatusBar`;
  `HomeView.js` / `DetailView.js` → `ReCard`.
  Each view's `.scss` file then drops to layout-only or is deleted.
- Buttons currently configured `ui: 'toolbutton-toolbar'` become `xtype: 'reiconbutton'`.

### Theme-side cleanup (Phase 4)

Delete from `theme-react-shadcn/sass/src/Component.scss`: L163–245 (shell), L248–290 (nav treelist
`ui` call — **only after `ReNavTree` is verified**), L300–310, L313–513 (gallery), and the matching
`.dark-mode` blocks at L760–828 and L830–918. Delete the `toolbutton` / `footerbutton` `ui`
generation from `sass/src/button/Button.scss`.

Then, **optionally**, add a small `theme-react-shadcn` file that re-points the package tokens at the
theme's own palette:

```scss
$re-surface: $shadcn-card;
$re-fg:      $shadcn-foreground;
// …
```

Since the package's defaults are already the shadcn values, this is a no-op today — but it
documents the override path and proves it works. **Verify which var file actually wins**: a code
package's `sass/var` vs the theme's `sass/var` ordering is not documented reliably. If the theme
loses, move the remap to `app/desktop/sass/var.scss`, which is guaranteed to be processed last.

---

## 7. Traps

Carried forward from `EXTJS_THEME_PARITY_SPEC.md` §8 and `EXTJS_GALLERY_SPEC.md` §4, plus the ones
specific to this task.

1. **`sass/src/*.scss` must map to a class present in the build**, or it compiles to nothing,
   silently. Hence `ppa.react.Tokens`. Verify by grepping the compiled CSS.
2. `app.json` sets `"fashion": { "missingParameters": "error" }` — an unknown SCSS variable is a
   **hard build failure**, not a warning. Expect this while wiring the token layer.
3. **Never reference `$shadcn-*` from the package.** It compiles today only because the theme
   happens to be active; under any other theme it is an instant build failure.
4. **Do not override `baseCls` on a framework subclass.** It strips the structural CSS the base
   class needs. Only the two direct `Ext.Component` subclasses may set it.
5. **Classes used only via an xtype/ptype/ftype string need explicit `requires`.** Sencha Cmd's
   dependency analyser cannot see them.
6. **Browser caches hard.** After a rebuild load `http://localhost:1962/?nocache=<timestamp>`;
   the symptom otherwise is an empty nav and a missing view *despite a successful build*.
7. **Never use Playwright `waitUntil: 'networkidle'` against `localhost:1962`** — the dev-server
   websocket never settles and it wedges the tab.
8. **`document.styleSheets` under-reports Fashion-injected CSS.** Verify with `getComputedStyle`,
   and cross-check against the compiled CSS on disk.
9. **`getComputedStyle` lies when the Playwright page is not visible** — style recalc is throttled.
   Sanity-check by setting an inline style and reading it back.
10. **A killed dev server can leave `sencha app watch` behind.** The next `npm run dev` serves but
    never rebuilds, ending on `[ERR] [echo] App watch is already running for this build profile.`
    Kill the orphaned `java -jar …sencha.jar app watch` pid. Confirm rebuilds by the mtime of
    `build/development/ClassicApp/desktop/resources/ClassicApp-all_1.css`, not by the page.
11. **The default-`ui` TreeList CSS also reaches the nav rail** (§5.13). Re-verify the sidebar in
    both modes after any tree work.
12. **`ext-core` and `theme-material` re-point glyph colours and glyph families** away from what the
    variable name suggests. The package sidesteps this by not using font glyphs at all (§5.13).
13. Gallery sections carry `itemId`, not `id`. Before screenshotting, run
    `Ext.ComponentQuery.query('galleryview')[0].items.each(c => { c.el.dom.id = c.itemId; })`, and
    set `location.hash = '#galleryview'` *after* the load — `page.goto` with a `?nocache=` query
    does not fire the hash route.
14. **Adding a package can require a full rebuild**, not just a watch rebuild. If `ppa-react-ui`
    classes do not resolve after editing `app.json`, restart `npm run dev`.

---

## 8. Definition of done

1. `packages/local/ppa-react-ui` exists as a `code` package with namespace `ppa.react`, listed in
   `app.json` `requires`.
2. Every component in §2.A (except item 9) and §2.B exists as its own `Re*` class in its own file,
   named per §5, with CSS classes named after the class.
3. **Every class carries a §5.0-conformant JSDoc header** — purpose, runnable `@example`, `@cfg`
   for every public config, and a Styling note listing emitted classes and consumed tokens.
4. **Nothing is hardcoded that a consumer might need to change**: the status ramp, toast icon map
   and badge variant list are all replaceable at runtime, and the SCSS status rules are generated
   from the single `$re-status-ramp` map (§5.6).
5. `grep -ri "shadcn" packages/local/ppa-react-ui` returns **nothing**.
6. `grep -r "gallery-badge\|gallery-tile\|gallery-avatar\|gallery-toast\|gallery-status\|gallery-row-\|gallery-cell-fill" app packages/local/theme-react-shadcn`
   returns **nothing**.
7. `http://localhost:1962/#galleryview` renders with **zero console errors**, and all 16 gallery
   sections still resolve in order via
   `Ext.ComponentQuery.query('galleryview')[0].items.items.map(c => c.itemId)`.
8. Side-by-side screenshots (before/after this refactor) of the gallery and the app shell are
   **pixel-identical** in light mode and in dark mode. This is a refactor; any visual delta is a bug.
9. `Ext.getBody().toggleCls('dark-mode')` still flips everything, including all `Re*` components,
   and the nav rail is correct in both modes.
10. **Theme-independence proof:** temporarily set `app.json` `builds.desktop.theme` to
    `theme-material`, rebuild, and confirm every `Re*` component still renders with its own
    colours, radii and metrics (the native Ext components will of course look like material).
    Revert afterwards. **This check is mandatory — it is the whole point of the task.**
11. `--re-*` custom properties are visible on `:root` in DevTools, and overriding one by hand
    (e.g. `document.documentElement.style.setProperty('--re-primary', 'red')`) visibly retints the
    badges without a rebuild.
12. `git status` shows changes limited to: `packages/local/ppa-react-ui/**`,
    `packages/local/theme-react-shadcn/sass/**`, `app/desktop/src/**`, `app.json`.

---

## 9. Verification commands

```powershell
# Did the package's CSS actually emit?
$CSS = "c:\work\extjs\classic-app\build\development\ClassicApp\desktop\resources"
Select-String -Path "$CSS\*.css" -Pattern "re-badge|re-tile|re-avatar|--re-surface" |
    Select-Object -First 10

# Any leftover shadcn coupling in the new package?
Select-String -Path "c:\work\extjs\classic-app\packages\local\ppa-react-ui\**\*" -Pattern "shadcn" -Recurse

# Confirm the build really rebuilt
Get-Item "$CSS\ClassicApp-all_1.css" | Select-Object LastWriteTime
```

In the browser:

```js
Ext.ComponentQuery.query('galleryview')[0].items.items.map(c => c.itemId)
getComputedStyle(document.querySelector('.re-badge')).borderRadius     // 26px
getComputedStyle(document.documentElement).getPropertyValue('--re-surface')
Ext.getBody().toggleCls('dark-mode')
```

---

## 10. Decision record — ANSWERED, do not revisit

Confirmed by the requester 2026-09-14. These are settled; implement them as written.

1. **Namespace and folders are lowercase `ppa.react` / `src/ppa/react/`.** Not `Ppa.react`.
   Sencha Cmd resolves the file path from the namespace character for character, so both must
   match exactly. Classes are therefore `ppa.react.ReBadge`, `ppa.react.grid.ReStatusColumn`, etc.
2. **Class names keep the `Re` prefix** (`ReBadge`, `ReTile`, …) and **xtypes keep it too**
   (`rebadge`, `retile`, …), so they cannot collide with a current or future Sencha xtype.
3. **Migrate the app shell.** `HeaderView` / `NavView` / `TopView` / `BottomView` / `MenuView` /
   `FooterView` / `HomeView` / `DetailView` are rewritten to extend the new classes in Phase 3.
   The point is to prove the components actually work and look right in a real app, not just in
   the gallery. A component that nothing consumes has not been validated.
4. **Everything stays configurable and data-driven** (§5.6 and the conventions in §5), and
   **every class gets a JSDoc header with a usage example** (§5.0). Both are gated in §8.
5. **`.dark-mode` stays** as the default value of `$re-dark-scope`. No change needed in this app;
   other consumers repoint the variable.
6. **Classic toolkit only.** Use the flat `sass/` layout, not the `classic/` + `modern/` split
   `ext-ux` uses. `package.json` declares `"toolkit": "classic"`.
