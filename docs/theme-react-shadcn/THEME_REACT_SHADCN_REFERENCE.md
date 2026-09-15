# `theme-react-shadcn` — Ext JS Theme Package Reference

**Audience:** AI coding agents (and humans) who need to modify this theme, create a derived
theme from it (e.g. a "dense" data-density variant), or diagnose a visual defect.

**Status:** Implemented, verified against the running build. Location:
`packages/local/theme-react-shadcn` in `c:\work\extjs\classic-app` (Ext JS 8.0.0.43, Classic
Toolkit). Also read `.github/skills/extjs8-classic/SKILL.md` before editing any SCSS here — it
has the framework-level lookup rules and traps that apply to all theming work in this repo.

---

## 1. What this package is

`theme-react-shadcn` is a Sencha **theme-type package** that re-skins the stock
`theme-material` base theme to look like a shadcn/ui (Tailwind) design system: flat surfaces,
1px hairlines instead of elevation shadows, a neutral black/white/grey palette, 10–14px border
radii, Inter font, and a `.dark-mode`-class-driven dark mode. It is the **only** active theme in
this app (`app.json` → `"theme": "theme-react-shadcn"`) and is registered as the default build
theme in `builds.desktop.theme`.

It does **not** style the custom `Re*` app-shell/gallery components (badges, tiles, avatars,
header bar, sidebar, nav tree, status bar, toasts, cards) — those live in the sibling package
`packages/local/ppa-react-ui` and are deliberately theme-independent. See
[`../ppa-react-ui/PPA_REACT_UI_COMPONENTS_REFERENCE.md`](../ppa-react-ui/PPA_REACT_UI_COMPONENTS_REFERENCE.md).
This package only re-themes **native Ext JS Classic components**: buttons, fields, grids, trees,
tabs, menus, panels, windows, message boxes, date pickers, bound lists (combos/multiselect).

### Package identity

| Property | Value |
|---|---|
| Folder | `packages/local/theme-react-shadcn` |
| `package.json` name | `theme-react-shadcn` |
| Sencha `type` | `theme` |
| Sencha `namespace` | `Ext` |
| `extend` | `theme-material` (parent/base theme) |
| `toolkit` | `classic` |
| Theme name at runtime | `Ext.theme.name === 'theme-react-shadcn'` (set in `overrides/init.js`) |
| Wired in | root `app.json`: `"theme": "theme-react-shadcn"`, `builds.desktop.theme` |
| Fashion strictness | root `app.json` → `"fashion": { "missingParameters": "error" }` — an unknown/undeclared SCSS variable is a **hard build failure**, not a warning |

`overrides/init.js`:
```js
Ext.namespace('Ext.theme.is')['theme-react-shadcn'] = true;
Ext.theme.name = 'theme-react-shadcn';
```

---

## 2. How Fashion compiles this package (mental model you need before editing)

Sencha's Fashion SCSS compiler processes three folders, **in this order, across every package
on the classpath**:

1. `sass/etc/**` — mixins only (no selectors emitted). This package's mixin file is
   `sass/etc/all.scss`.
2. `sass/var/**` — variable **declarations** (`$name: dynamic(value);`). No CSS is emitted here.
   Files are ordered by the **class hierarchy** they name-map to (`var/button/Button.scss` maps
   to `Ext.button.Button`, etc.), and a downstream package/theme's var file for the *same* class
   loads **after** an upstream one, so it can win by re-assignment.
3. `sass/src/**` — the actual CSS rules, using the resolved variables. Same class-hierarchy
   ordering rule applies.

Consequences that matter for editing or forking this theme:

- **A `sass/var/X.scss` file only affects visuals if a matching `sass/src/X.scss` (in this
  package or a parent) actually reads that variable.** Declaring a variable with no consumer
  does nothing.
- **A `sass/src/X.scss` file only compiles if `X` maps to a real class present in the build.**
  An unmapped file name silently compiles to nothing — no error. (This is why the package's own
  component classes, in `ppa-react-ui`, needed a dummy `Tokens` class just to give
  `sass/src/Tokens.scss` somewhere to attach.)
- **This theme's own var files win over `theme-material`'s** for the same variable name, because
  this theme is declared as extending `theme-material` and loads after it. But `theme-material`
  bakes several colour ramps (`$base-highlight-color`, `$accent-*`, etc.) via a
  `material-color()` function that **ignores** `$base-color` — those must each be pinned
  explicitly here rather than relying on `$base-color` alone (see §4.1).
- **Dark mode is not a second Fashion build.** There is exactly one compiled stylesheet. Dark
  mode is implemented as ordinary `.dark-mode { ... }` CSS rules living *inside* the same
  `sass/src/*.scss` files as their light counterparts, toggled at runtime by adding/removing a
  `dark-mode` class on `<body>` (`Ext.getBody().toggleCls('dark-mode')`). See §6.

---

## 3. Design token catalogue — light mode

All tokens live in **`sass/var/Component.scss`**, wrapped in Sencha's `dynamic(...)` so a
descendant theme (or this app's own `app/desktop/sass/var.scss`, which loads last) can
re-assign any of them without touching this file. Rule of thumb for any new theme forked from
this one: **change values here first**; only touch `sass/src/**` if you need a new rule shape,
not just a new colour/size.

### 3.1 Base palette (shadcn-native names)

| Variable | Value | Used for |
|---|---|---|
| `$shadcn-background` | `#ffffff` | Page / card body surface |
| `$shadcn-foreground` | `#0a0a0a` | Primary text |
| `$shadcn-card` | `#ffffff` | Card / panel background |
| `$shadcn-card-foreground` | `#0a0a0a` | Text on cards |
| `$shadcn-popover` | `#ffffff` | Dropdown / popover background |
| `$shadcn-popover-foreground` | `#0a0a0a` | Text in popovers |
| `$shadcn-primary` | `#171717` | Primary action (filled buttons, selected items) |
| `$shadcn-primary-foreground` | `#fafafa` | Text on primary |
| `$shadcn-primary-hover` | `#2e2e2e` | Primary hover/pressed |
| `$shadcn-secondary` | `#f5f5f5` | Secondary surface |
| `$shadcn-secondary-foreground` | `#171717` | Text on secondary |
| `$shadcn-secondary-hover` | `#ebebeb` | Secondary hover |
| `$shadcn-muted` | `#f5f5f5` | Muted surface (disabled, tab bar, grouping headers) |
| `$shadcn-muted-foreground` | `#737373` | Muted text / glyph colour |
| `$shadcn-accent` | `#f5f5f5` | Hover / active surface |
| `$shadcn-accent-foreground` | `#171717` | Text on accent |
| `$shadcn-destructive` | `#e7000b` | Error / delete action |
| `$shadcn-destructive-foreground` | `#ffffff` | Text on destructive |
| `$shadcn-destructive-hover` | `#cf000a` | Destructive hover |
| `$shadcn-destructive-soft` | `#fee2e2` | Error badge background |
| `$shadcn-border` | `#e5e5e5` | 1px hairlines |
| `$shadcn-input` | `#e5e5e5` | Field border |
| `$shadcn-ring` | `#a1a1a1` | Focus ring colour |

### 3.2 Radius scale — the primary "personality" knob

| Variable | Value | Used for |
|---|---|---|
| `$shadcn-radius-sm` | `6px` | Small badges / tag chips |
| `$shadcn-radius-md` | `8px` | Menu items, tab underlines |
| `$shadcn-radius-lg` | `10px` | Default — buttons, inputs, menus |
| `$shadcn-radius-xl` | `14px` | Cards, panels, popovers, windows |

### 3.3 Focus / card shadows

| Variable | Value | Used for |
|---|---|---|
| `$shadcn-ring-shadow` | `rgba(161,161,161,0.5)` | Focus ring (3px box-shadow, via `shadcn-focus-ring()` mixin) |
| `$shadcn-ring-shadow-invalid` | `rgba(231,0,11,0.2)` | Invalid-field focus ring |
| `$shadcn-card-ring` | `rgba(10,10,10,0.1)` | 1px card outline, drawn as an overlay (see §7 trap 3) |
| `$shadcn-muted-half` | `#fafafa` | `bg-muted/50` (card footers) |

### 3.4 App-shell / sidebar tokens

These exist here for completeness but are **not consumed anywhere in this theme's own
`sass/src/**`** — the app shell (header/sidebar/nav/footer) is themed by the `ppa-react-ui`
package's own `--re-sidebar-*` custom properties instead. They remain declared here as a
historical/available surface, not a live binding — do not assume changing them affects the
sidebar; change the `ppa-react-ui` tokens instead.

| Variable | Value |
|---|---|
| `$shadcn-sidebar` | `#fafafa` |
| `$shadcn-sidebar-foreground` | `#0a0a0a` |
| `$shadcn-sidebar-accent` | `#f5f5f5` |
| `$shadcn-sidebar-accent-foreground` | `#171717` |
| `$shadcn-sidebar-primary` | `#171717` |
| `$shadcn-sidebar-primary-foreground` | `#fafafa` |
| `$shadcn-sidebar-border` | `#e5e5e5` |
| `$shadcn-sidebar-muted-foreground` | `#737373` |

### 3.5 Typography

| Variable | Value |
|---|---|
| `$font-family` | `Inter, 'Inter var', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` |
| `$font-size` | `14px` (base — pinned at build time; box metrics like field/button height derive from it) |
| `$font-size-big` | `14px` |
| `$font-weight` / `$font-weight-normal` | `400` |
| `$font-weight-bold` | `600` |

A **runtime-adjustable** font size custom property also exists (`sass/src/Component.scss`):
```scss
:root {
    --ui-font-size: #{$font-size};
    --form-font-size: var(--ui-font-size, #{$font-size});
}
```
This lets JS do `document.documentElement.style.setProperty('--form-font-size', '13px')` to
resize *text* without a rebuild — but it does **not** resize box metrics (field height, padding),
which remain fixed at their compiled px values. Safe range tested: 12–15px.

### 3.6 Material colour-ramp pins (why they exist)

`theme-material`'s `material-color()` function derives `$base-highlight-color`,
`$base-light/dark-color`, `$base-focused-color`, `$accent-*`, `$confirm-color`, `$alert-color`
from `$base-color-name`, and **ignores** a plain `$base-color` re-assignment. Every one of these
must therefore be pinned individually to a shadcn token, or Material's default blue/teal ramp
leaks through:

| Variable | Value |
|---|---|
| `$base-color` | `$shadcn-primary` |
| `$base-highlight-color` | `$shadcn-primary` |
| `$base-light-color` | `$shadcn-secondary` |
| `$base-dark-color` | `#000000` |
| `$base-pressed-color` / `$base-focused-color` | `$shadcn-primary-hover` |
| `$base-foreground-color` | `$shadcn-primary-foreground` |
| `$accent-color` | `$shadcn-secondary` |
| `$accent-pressed-color` | `$shadcn-secondary-hover` |
| `$accent-foreground-color` | `$shadcn-secondary-foreground` |
| `$confirm-color` / `$confirm-pressed-color` | `$shadcn-primary` / `$shadcn-primary-hover` |
| `$alert-color` / `$alert-pressed-color` | `$shadcn-destructive` / `$shadcn-destructive-hover` |

### 3.7 Generic surface/text aliases consumed across many components

| Variable | Value |
|---|---|
| `$color` | `$shadcn-foreground` |
| `$reverse-color` | `$shadcn-primary-foreground` |
| `$background-color` | `$shadcn-background` |
| `$alt-background-color` | `$shadcn-muted` |
| `$reverse-background-color` | `$shadcn-foreground` |
| `$highlight-color` | `$shadcn-muted-foreground` |
| `$disabled-color` | `rgba(10,10,10,0.5)` |
| `$divider-color` / `$faded-color` | `$shadcn-border` |
| `$selected-background-color` / `$hovered-background-color` | `$shadcn-accent` |
| `$header-background-color` | `$shadcn-background` |
| `$panel-header-color` / `$window-header-color` | `$shadcn-card-foreground` |

### 3.8 Fieldset tokens

| Variable | Value |
|---|---|
| `$fieldset-border-color` | `$shadcn-border` |
| `$fieldset-border-radius` | `$shadcn-radius-lg` (10px) |
| `$fieldset-background-color` | `$shadcn-card` |
| `$fieldset-padding` | `12px 12px 4px` |
| `$fieldset-header-padding` | `0 6px` |
| `$fieldset-header-color` | `$shadcn-foreground` (**not** `$panel-header-color` — Material's default reads as disabled-grey) |
| `$fieldset-header-font-size` / `-weight` / `-line-height` | `14px` / `600` / `20px` |

### 3.9 Spacing primitives

| Variable | Value |
|---|---|
| `$content-padding` | `16px` |
| `$basic-padding` | `8px` |
| `$base-gradient` | `none` (theme is flat — no gradients anywhere) |

---

## 4. Dark mode

### 4.1 Mechanism

There is **one** compiled CSS bundle. Dark mode is a second set of rules, scoped under a
`.dark-mode` class applied to `<body>`:

```js
Ext.getBody().toggleCls('dark-mode');
```
(App wiring: `MainViewController.onHeaderViewDarkModeToggle`, driven by the header's dark-mode
toggle button.)

- **Dark tokens** are declared as `$shadcn-dark-*` in the *same* `sass/var/Component.scss` file
  as the light tokens (§3), not a separate file.
- **Dark rules** live in `.dark-mode { ... }` blocks placed at the bottom of **the same
  `sass/src/*.scss` file** as the component's light rules (e.g. `button/Button.scss`'s dark
  block sits under its own light rules, not centrally). The one exception is generic/global dark
  rules (scrollbars, load mask, fieldset, calendar, containers) which sit in a single trailing
  `.dark-mode { }` block at the very end of `sass/src/Component.scss`.
- **Specificity rule that matters when adding a new dark override:** because Fashion orders
  `sass/src/**` by class hierarchy, a `.dark-mode` block written in `Component.scss` compiles
  **before** a same-specificity light rule in a more specific file like `button/Button.scss` —
  so it can silently lose the cascade. The reliable fix is either (a) put the dark override in
  the *same file* as the rule it's overriding, or (b) give the dark selector **strictly more
  classes** than the light rule it must beat — do not rely on "it's inside `.dark-mode`" alone.

### 4.2 Dark token catalogue

| Variable | Value | Light equivalent |
|---|---|---|
| `$shadcn-dark-background` | `#0a0a0a` | `$shadcn-background` |
| `$shadcn-dark-foreground` | `#98a3af` (blue-grey, **not** near-white) | `$shadcn-foreground` |
| `$shadcn-dark-card` | `#171717` | `$shadcn-card` |
| `$shadcn-dark-card-foreground` | `#98a3af` | `$shadcn-card-foreground` |
| `$shadcn-dark-popover` | `#171717` | `$shadcn-popover` |
| `$shadcn-dark-popover-foreground` | `#98a3af` | `$shadcn-popover-foreground` |
| `$shadcn-dark-primary` | `#8a8a8a` | `$shadcn-primary` |
| `$shadcn-dark-primary-foreground` | `#171717` | `$shadcn-primary-foreground` |
| `$shadcn-dark-primary-hover` | `#cfcfcf` | `$shadcn-primary-hover` |
| `$shadcn-dark-secondary` | `#262626` | `$shadcn-secondary` |
| `$shadcn-dark-secondary-foreground` | `#98a3af` | `$shadcn-secondary-foreground` |
| `$shadcn-dark-secondary-hover` | `#333333` | `$shadcn-secondary-hover` |
| `$shadcn-dark-muted` | `#262626` | `$shadcn-muted` |
| `$shadcn-dark-muted-foreground` | `#a1a1a1` | `$shadcn-muted-foreground` |
| `$shadcn-dark-muted-foreground-dim` | `#586066` | (de-emphasised text, e.g. calendar days outside month) |
| `$shadcn-dark-accent` | `#262626` | `$shadcn-accent` |
| `$shadcn-dark-accent-foreground` | `#98a3af` | `$shadcn-accent-foreground` |
| `$shadcn-dark-tab-active-background` | `#4a4a4a` | (dedicated — see trap below) |
| `$shadcn-dark-destructive` | `#ff6467` | `$shadcn-destructive` |
| `$shadcn-dark-destructive-fill` | `#9c4042` | (button fill) |
| `$shadcn-dark-destructive-fill-hover` | `#b04a4c` | |
| `$shadcn-dark-destructive-foreground` | `#ffffff` | `$shadcn-destructive-foreground` |
| `$shadcn-dark-border` | `rgba(255,255,255,0.1)` | `$shadcn-border` (translucent — glassy hairline look) |
| `$shadcn-dark-border-solid` | `#262626` | Used where a translucent border would be wrong (e.g. opaque filter-field fills) |
| `$shadcn-dark-input` | `rgba(255,255,255,0.15)` | `$shadcn-input` |
| `$shadcn-dark-ring` | `#737373` | `$shadcn-ring` |
| `$shadcn-dark-ring-shadow` | `rgba(115,115,115,0.5)` | `$shadcn-ring-shadow` |
| `$shadcn-dark-ring-shadow-invalid` | `rgba(255,100,103,0.25)` | `$shadcn-ring-shadow-invalid` |
| `$shadcn-dark-card-ring` | `rgba(255,255,255,0.1)` | `$shadcn-card-ring` |
| `$shadcn-dark-muted-half` | `#1f1f1f` | `$shadcn-muted-half` |
| `$shadcn-dark-sidebar*` (8 vars) | mirrors §3.4 | (declared but not consumed here — see §3.4) |

### 4.3 Dark-mode implementation traps (do not relearn these)

1. **Equal-specificity `.dark-mode` overrides can still lose** if the light rule they must beat
   compiles in a file/package that loads *later* (e.g. `ext-calendar`/`ext-core` load after this
   theme; a component's own dark block can even load after `Component.scss`'s generic block).
   A `.dark-mode X` selector only *reliably* wins when it has **strictly more classes** than the
   light rule — count classes, don't assume.
2. **An inset box-shadow "accent" on a panel root can be fully applied yet invisible** if a
   descendant (e.g. `.x-panel-body`) gets its own opaque background from a later-loading dark
   rule — the shadow paints at the bottom of the stack and an opaque in-flow child hides it. Do
   not trust `getComputedStyle` on the shadow-owning element alone.
3. **`$shadcn-dark-foreground` (`#98a3af`) is not "white text."** Assuming it should read as
   near-white will misdiagnose a correctly-implemented rule as broken.
4. **Toggle/segmented buttons:** `Ext.button.Button.toggle(true)` does **not** run the configured
   `handler` — only a genuine click does. Scripting a dark-mode toggle for verification must call
   `btn.el.dom.click()`, not `btn.toggle(true)`.
5. **Dark-mode tab-active contrast:** a generic hover-shade token was originally reused for the
   active-tab background and was too close in luminance to the tab bar background to read as
   "lifted" — this is why a **dedicated** `$shadcn-dark-tab-active-background` token exists
   rather than reusing `$shadcn-dark-secondary-hover`. When forking this theme, keep
   state-specific tokens dedicated rather than aliasing them together — subtle luminance
   collisions are a recurring defect class here.
6. **No scrollbar theming exists in `theme-material`.** Both a light (`html { scrollbar-color:
   $shadcn-border transparent }` + `::-webkit-scrollbar-thumb`) and a `.dark-mode` counterpart
   (using `$shadcn-dark-border-solid`) were added from scratch in `sass/src/Component.scss`.

---

## 5. Component-by-component map (`sass/var/**` ↔ `sass/src/**` ↔ Ext JS class)

Each pair below maps to one native Ext JS Classic component/feature. Use this table to find
where to make a change for a given visual symptom.

| Ext JS class / feature | Var file | Src file | Notable metrics |
|---|---|---|---|
| `Ext.button.Button` | `var/button/Button.scss` | `src/button/Button.scss` | radius 10px, border 1px, padding varies by scale (small/medium/large), no uppercase transform, no shadow. Custom UIs `confirm`/`decline` built here with `extjs-button-small-ui()`. Toggle buttons: off = ghost, on = muted surface. Segmented buttons get pseudo-element dividers. Split-button masks force-transparent (Material paints them opaque per-state, see §7 trap 9) |
| `Ext.form.field.Base`/`Text` | `var/form/field/Base.scss`, `Text.scss` | `src/form/field/Text.scss` | field height 32px, padding 4px 10px, radius 10px, border `$shadcn-input`, focus border `$shadcn-ring` + 3px ring, invalid border `$shadcn-destructive`. Rebuilds the entire Material field box (Material draws an underline + floating label by default) |
| `Ext.form.field.Checkbox` | `var/form/field/Checkbox.scss` | `src/form/field/Checkbox.scss` | 16×16 box, 4px radius, checked = filled `$shadcn-primary` + inline SVG tick, Material's glyph ligature suppressed via `font-size: 0` |
| `Ext.form.field.Radio` | `var/form/field/Radio.scss` | `src/form/field/Radio.scss` | 16×16 circle, same pattern as checkbox with an inline SVG dot |
| `Ext.form.field.Tag` | `var/form/field/Tag.scss` | `src/form/field/Text.scss` (tag rules) | chip items 20px, radius 6px, bg `$shadcn-secondary`, selected = `$shadcn-primary` |
| `Ext.grid.column.Column` / header | `var/grid/column/Column.scss`, `var/grid/header/Container.scss` | `src/grid/header/Container.scss` | header height 40px, no vertical column borders (row/header bottom border carries the grid lines), header divider drawn as inset box-shadow (ExtJS zeroes borders with `!important`) |
| `Ext.grid.feature.Grouping`/`GroupingSummary` | `var/grid/feature/Grouping.scss` | (rules in `src/view/Table.scss`) | group header bg = `mix($shadcn-muted, $shadcn-background, 60%)`, height 36px |
| `Ext.grid.plugin.filterbar.FilterBar` | `var/grid/plugin/filterbar/**` | `src/grid/plugin/filterbar/FilterBar.scss` | filter cell bg `$shadcn-background`, 0-width borders (inset shadow instead), operator button forced transparent |
| `Ext.view.Table` (grid body/rows) | `var/view/Table.scss` | `src/view/Table.scss` | row bg `$shadcn-background` (no zebra striping), hover `$shadcn-muted-half`, selected `$shadcn-muted`, summary row bg `mix($shadcn-muted,$shadcn-background,30%)`, total row bg `$shadcn-muted-half` weight 600 |
| `Ext.list.TreeItem` (`treelist`, default UI) | `var/list/TreeItem.scss` | (dark-only rules in `src/tree/View.scss`) | line-height 32px, icon 24px, FA chevron expander 14px, hover/selected bg `$shadcn-accent`. **Note:** the sidebar nav rail (`ui: 'nav'`) is themed separately in `ppa-react-ui`, not here |
| `Ext.tree.Panel` / `Ext.tree.View` (treegrid) | `var/tree/View.scss` | `src/tree/View.scss` | icon 16px + 8px gap, FA chevron/folder/file glyphs, `$shadcn-muted-foreground` |
| `Ext.menu.Menu` | `var/menu/Menu.scss` | `src/menu/Menu.scss` | bg `$shadcn-popover`, radius 10px, shadow-md, item height 28px, active item bg `$shadcn-accent`, submenu arrow re-centred (Material default sits 2px high) |
| `Ext.panel.Panel` | `var/panel/Panel.scss` | `src/panel/Panel.scss` | radius 0 by default (scaffolding), **titled panels + grids get radius 14px + a 1px ring drawn as an `::after` overlay**, not a border (see §7 trap 3). Body `line-height: 20px` (Inter ascender fix) |
| `Ext.panel.Tool` | `var/panel/Tool.scss` | (inline in Panel.scss dark block) | glyph `$shadcn-muted-foreground`, FA minimize/crop/filter glyphs instead of Material's |
| `Ext.picker.Date` (`datefield` dropdown, `datepicker`) | `var/picker/Date.scss` | `src/picker/Date.scss` | popover bg, 36×36 circular day cells, selected = `$shadcn-primary` fill, month button text `$shadcn-foreground` |
| `Ext.tab.Tab` | `var/tab/Tab.scss` | `src/tab/Tab.scss` | filled variant: base bg `$shadcn-muted`, active bg `$shadcn-background`, radius 8px; line variant (`plain:true`): transparent bg, 2px underline in `$shadcn-foreground`. Padding restated at 2-class specificity (base frame mixin floors it) |
| `Ext.tab.Bar` | `var/tab/Bar.scss` | `src/tab/Bar.scss` | filled bar radius 10px padding 4px; plain bar transparent, no padding |
| `Ext.toolbar.Toolbar` (incl. docked footers) | `var/toolbar/Toolbar.scss` | `src/toolbar/Toolbar.scss` | flat (no shadow), border 1px `$shadcn-border`, footer bg `$shadcn-muted-half` |
| `Ext.view.BoundList` (combo/multiselect/itemselector dropdowns) | (none dedicated) | `src/view/BoundList.scss` | floating popover: radius 10px, ring+shadow; **docked** variant (multiselect/itemselector body): transparent, no shadow, items get 8px radius on hover/select |
| `Ext.window.Window` / `Ext.window.MessageBox` | `var/window/MessageBox.scss` | `src/window/Window.scss` | window ring 1px + shadow-lg; header/body/footer dividers as inset shadows; MessageBox icon glyphs are FontAwesome, not Material (question-circle, warning triangle, etc.) |
| ext-calendar `Ext.calendar.panel.Month` | (none dedicated) | rules in `src/Component.scss` | card ring + radius 14px + overflow hidden; weekday header text `.x-calendar-header-cell`; day number text `.x-calendar-weeks-day-text` (not the more obvious-sounding class names) |

---

## 6. Mixins (`sass/etc/all.scss`)

```scss
@mixin shadcn-focus-ring($color: $shadcn-ring-shadow) {
    box-shadow: 0 0 0 3px $color;
}
```
The only shared mixin; applies the shadcn 3px alpha focus ring to any focusable surface
(fields, buttons, checkboxes). Add new shared mixins here, never inline the ring shadow.

`sass/config.rb` sets `output_style = :nested` for the underlying Compass/Sass compiler — this
is standard Sencha Cmd scaffolding, not something to customise.

---

## 7. Implementation traps — read before touching SCSS here

These are proven defect classes from building this theme; assume they will recur in a fork.

1. **Frame-mixin padding floor.** Ext JS's base "frame" mixin floors button/tab padding at
   `border-radius - border-width`. With a 10px radius, buttons would be forced to 9px padding
   (40px tall) unless padding is explicitly restated in `sass/src` at matching or higher
   specificity.
2. **`ui: 'confirm'` / `'decline'` are not generated by `theme-material`.** They are built here
   with `extjs-button-small-ui($ui: 'confirm', ...)` in `sass/src/button/Button.scss`.
3. **Card outline must be an overlay `::after`, not a border or box-shadow.** Ext JS positions
   `.x-panel-body` absolutely; a real border shifts the already-measured layout box by 1px, an
   outward box-shadow gets clipped by `.x-box-inner`, and an inset shadow paints underneath
   children. Only `&:after { position:absolute; inset:0; border:1px solid; border-radius:
   inherit; pointer-events:none }` reproduces the shadcn card ring correctly. The same pattern is
   reused in `ppa-react-ui`'s `ReTile`/`ReCard`.
4. **Never put a radius on a blanket panel selector.** `.x-panel { overflow: hidden; position:
   relative }` is baked into the framework, so a radius on `.x-panel-default` clips **every**
   panel including layout scaffolding, shearing off corners of any child flush with a panel edge.
   `$panel-border-radius` is pinned to `0`; the 14px card radius is applied only to the
   *card-shaped* selectors (`:has(> .x-panel-header)`, `.x-grid`) in `sass/src/panel/Panel.scss`.
5. **`bodyPadding` does not land on `.x-panel-body`** under layouts with `managePadding`
   (including the default `autocontainer`) — it moves to `.x-autocontainer-innerCt` and the body
   gets `padding: 0` inline. Measure/style the innerCt, not the body, if you need to align text
   with a 16px-padded header.
6. **Split buttons are two separate painted masks.** `.x-btn-wrap.x-btn-split:before` and
   `.x-btn-split-right + .x-btn-arrow-el:before` are recoloured independently by Material per
   state/UI; force both transparent and move all state colour onto the button root, or hover
   only lights half the pill.
7. **`.x-grid-filterbar` also carries `.x-grid-header-ct`** — scope header rules with
   `:not(.x-grid-filterbar)` or you get doubled dividers.
8. **`x-form-check-group`** is the layout `<td>` class for both CheckboxGroup and RadioGroup —
   `padding-right` there is the inter-option gap; box labels need `white-space: nowrap`.
9. **`ext-core`'s TreeList `sass/src/list/TreeItem.scss` unconditionally emits `.x-treelist-nav`
   CSS from its own hardcoded palette**, even though this theme never calls `treelist-ui($ui:
   'nav', ...)` itself — that call now lives in `ppa-react-ui`'s `ReNavTree.scss`, which loads
   later and wins. This is expected, not a bug — if the nav rail ever looks unstyled, check which
   of the two blocks is actually being read, not just that one exists.
10. **Compiled CSS is split across 4 files** (`ClassicApp-all_1.css` .. `_4.css`, imported by
    `ClassicApp-all.css` in order). Framework/base-theme defaults land in `_1`/`_2`; this
    package's own overrides land in `_3` (loads last, wins). **Always grep all four** before
    concluding an override didn't apply — checking only `_1` looks "unthemed" even when `_3` is
    correct.

---

## 8. How to create a derived theme (e.g. a "dense" high-data-density variant)

The recommended approach is a **sibling theme package** that extends this one (or forks its
files), so the base `theme-react-shadcn` stays untouched and reusable.

### 8.1 Scaffold

1. Copy `packages/local/theme-react-shadcn` to e.g. `packages/local/theme-react-shadcn-dense`.
2. In its `package.json`, change `name` to `theme-react-shadcn-dense` and set `"extend":
   "theme-react-shadcn"` (instead of `theme-material`) so it inherits every rule here and only
   needs to *override* metrics, not re-implement them.
3. Update `overrides/init.js`'s theme name string to match.
4. Point the app's `builds.desktop.theme` (or a new build profile) at the new package name to
   build/preview it; keep the original build profile pointing at `theme-react-shadcn` so both
   remain selectable.

### 8.2 What to change for density (spacing/size knobs, not colour)

Density is almost entirely a **`sass/var` metrics problem** — the colour tokens in §3 should
stay as-is so the two themes look like the same design system at different scales. Candidate
variables to re-assign in the dense package (re-declare with new literal values; do **not**
edit the base package's files):

| Concern | Base value | Dense-theme direction |
|---|---|---|
| `$shadcn-radius-lg` / `-xl` | 10px / 14px | Shrink 2–4px — sharper corners read as denser |
| Button padding (`var/button/Button.scss`, small/medium/large) | 5–9px vertical | Reduce vertical padding first; horizontal can stay for tap targets |
| Field height (`var/form/field/Text.scss`) | 32px | 26–28px |
| Field padding (`var/form/field/Text.scss`) | `4px 10px` | `2px 8px` |
| Grid header height (`var/grid/header/Container.scss`) | 40px | 28–32px |
| Grid row height / cell padding (`var/view/Table.scss`) | ~38px / 8px | 28–30px / 4–6px |
| Grouping header height (`var/grid/feature/Grouping.scss`) | 36px | 26–28px |
| Menu item height (`var/menu/Menu.scss`) | 28px | 22–24px |
| Tab height/padding (`var/tab/Tab.scss`) | padding `2px 10px` | `1px 8px` |
| `$content-padding` / `$basic-padding` | 16px / 8px | 10–12px / 4–6px |
| `$font-size` | 14px | Usually **leave at 14px** — shrinking text along with boxes compounds accessibility risk; prefer shrinking only box metrics first |

Do **not** touch anything under §3.1 (base palette) or §4 (dark tokens) for a density variant —
those are the "same design system" contract. If a genuinely different colour scheme is also
wanted, that is a second, independent theme concern — keep the two changes in separate PRs/forks
so a reviewer (human or AI) can tell "denser" apart from "recoloured."

### 8.3 Verification checklist for any derived theme

1. `Get-Item build/development/ClassicApp/desktop/resources/ClassicApp-all_1.css` (or `_3`) —
   confirm a rebuild actually happened (mtime) before trusting a screenshot.
2. Load `http://localhost:1962/#galleryview` (see
   [`../gallery/EXTJS_GALLERY_PAGE_REFERENCE.md`](../gallery/EXTJS_GALLERY_PAGE_REFERENCE.md)) —
   it exercises every themed native component in one page, in both light and dark mode.
3. Toggle dark mode (`Ext.getBody().toggleCls('dark-mode')` or the header button) and re-check —
   a metrics-only dense theme should not need new dark rules, but verify nothing shifted enough
   to break the trap-4/trap-3 patterns (clipped corners, misaligned card rings) at the new sizes.
4. Grep the compiled CSS for the new theme's package name to confirm which files actually
   compiled (`sass/src/*.scss` silently compiling to nothing is the #1 recurring mistake — see
   §2).

---

## 9. Quick verification commands

```powershell
# Confirm this theme's overrides actually reached the compiled CSS
$CSS = "c:\work\extjs\classic-app\build\development\ClassicApp\desktop\resources"
Select-String -Path "$CSS\*.css" -Pattern "shadcn-radius|shadcn-dark-tab-active" | Select-Object -First 10

# Confirm a rebuild actually happened before trusting a screenshot
Get-Item "$CSS\ClassicApp-all_1.css" | Select-Object LastWriteTime
```

In the browser:
```js
Ext.theme.name                              // 'theme-react-shadcn'
Ext.getBody().toggleCls('dark-mode')        // flip dark mode
getComputedStyle(document.querySelector('.x-btn-default')).borderRadius  // '10px'
```

---

## 10. Portability — using this theme in another Ext JS application

This is a normal Sencha `theme`-type package (`extend: theme-material`) with no dependency on
`ppa-react-ui` (grep confirms zero `ppa.react`/`Re*` references anywhere in it), so it can be
copied into another Ext JS app's `packages/local/` and required like any theme. It will render
as intended if:

1. **The target app is Ext JS 8.0.0.43 Classic Toolkit.** A large fraction of `sass/src` rules
   target this exact version's DOM/class output (e.g. `x-form-trigger-wrap-focus`, `x-toast
   .x-title-text`, the two-mask split-button selectors, `x-treelist-item-expander:after` vs
   `:before`). A different Ext JS version is not guaranteed to line up structurally even if the
   theme compiles without error.
2. **The `font-awesome` Sencha package is added to `requires`.** Several files bake `$fa-var-*`
   glyphs into compiled CSS at build time — `panel/Tool.scss` (minimize/maximize/restore),
   `window/MessageBox.scss` (question/warning/error icons), `tree/View.scss` and
   `list/TreeItem.scss` (expander/folder/file glyphs), `picker/Date.scss` and
   `form/field/Base.scss` (field triggers), and the `ext-ux` ItemSelector nav-button glyphs in
   `button/Button.scss`. Without that package present these render blank, not with a fallback
   glyph — there is no graceful degradation.
3. **`ext-ux` / `ext-calendar` are only relevant if the consuming app actually uses those
   xtypes** (`multiselect`, `itemselector`, `calendar-month`) — the theme carries dedicated rules
   for them but they are inert otherwise.
4. **Dark mode must be wired by the consuming app.** The theme does not toggle itself; the app
   needs its own `Ext.getBody().toggleCls('dark-mode')`-style mechanism (a single button handler
   is enough — see `MainViewController.onHeaderViewDarkModeToggle` in this app for the reference
   implementation).

Given those four, the theme has no other external coupling — `packages/local/theme-react-shadcn`
can be copied wholesale, `package.json` name kept or changed, and referenced from the new app's
`app.json` `"theme"` / `builds.*.theme` the same way this app does.

### Verification checklist after integrating into a new app

1. Build once and grep the compiled CSS for `shadcn-radius` / `shadcn-dark-tab-active` (§9) to
   confirm the package actually compiled (not silently dropped due to a missing classpath entry).
2. Load a page that exercises buttons, a themed field, a grid, a menu, a tab panel and a window —
   this repo's own [gallery page](../gallery/EXTJS_GALLERY_PAGE_REFERENCE.md) is the reference
   example of such a page, though it also depends on `ppa-react-ui`, which the new app need not
   have.
3. Confirm every icon-bearing native control (window tools, message box icons, tree
   expanders/folders, date-picker triggers) shows a real glyph, not a blank box — this is the
   single most likely portability defect (missing `font-awesome` requirement, item 2 above).
4. Toggle dark mode and re-check the same surfaces.

---

## 11. Related documents

- [`../ppa-react-ui/PPA_REACT_UI_COMPONENTS_REFERENCE.md`](../ppa-react-ui/PPA_REACT_UI_COMPONENTS_REFERENCE.md) — the theme-independent `Re*` component package (app shell + gallery custom components), styled separately from this theme.
- [`../gallery/EXTJS_GALLERY_PAGE_REFERENCE.md`](../gallery/EXTJS_GALLERY_PAGE_REFERENCE.md) — the on-screen test surface for everything documented above.
- `EXTJS_THEME_PARITY_SPEC.md`, `EXTJS_THEME_REMEDIATION_SPEC.md` — the historical build-out specs for this theme (useful for *why* a rule exists, this document is the *what/where*).
- `.github/skills/extjs8-classic/SKILL.md` — general Ext JS 8 Classic framework knowledge and lookup rules.
