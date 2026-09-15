# Ext JS Component Gallery — Page Reference

**Audience:** AI coding agents (and humans) using the gallery page to test, troubleshoot, or
extend theme styling in `theme-react-shadcn` and components in `ppa-react-ui`.

**Status:** Implemented, verified against the running build. Location:
`app/desktop/src/view/gallery/` in `c:\work\extjs\classic-app` (Ext JS 8.0.0.43, Classic
Toolkit, namespace `ClassicApp`). Also read `.github/skills/extjs8-classic/SKILL.md` before
editing this view — it has the framework-level lookup rules and traps that apply everywhere in
this repo.

---

## 1. Purpose

`http://localhost:1962/#galleryview` renders **every themed native Ext JS Classic surface and
every `ppa.react.Re*` custom component** on one scrollable page, in a fixed, addressable
structure (`itemId`s per section and per row). It exists purely as a **visual test/troubleshoot
surface**, not a real app feature:

- When editing `theme-react-shadcn` (native component theming) or `ppa-react-ui` (custom
  component styling), reload this page and screenshot it in both light and dark mode to check
  for regressions across the whole component surface in one pass, instead of hunting through
  real app screens.
- When diagnosing a specific rendering defect, the section/row `itemId` scheme (§3) lets you
  query and screenshot exactly the failing component via `Ext.ComponentQuery`, without needing
  to know its CSS selector in advance.
- When adding a **new** native Ext JS pattern or a new `Re*` component to either package, add a
  matching row here so future theme passes exercise it automatically.

This page is not styled itself beyond layout scaffolding — see §5. All actual colours/metrics
come from the two packages it demonstrates:

- [`../theme-react-shadcn/THEME_REACT_SHADCN_REFERENCE.md`](../theme-react-shadcn/THEME_REACT_SHADCN_REFERENCE.md) — native Ext JS component theming.
- [`../ppa-react-ui/PPA_REACT_UI_COMPONENTS_REFERENCE.md`](../ppa-react-ui/PPA_REACT_UI_COMPONENTS_REFERENCE.md) — the `Re*` custom components used throughout (badges, tiles, avatars, toasts, the whole app shell).

---

## 2. Files and navigation

| File | Role |
|---|---|
| `app/desktop/src/view/gallery/GalleryView.js` | The 16-section view; builds all demo components |
| `app/desktop/src/view/gallery/GalleryViewController.js` | Handlers for toasts, windows, message boxes, tooltips, load mask |
| `app/desktop/src/view/gallery/GalleryView.scss` | Layout-only CSS (`.galleryview`, `.gallery-section`, `.gallery-row`) — **no component colours** |
| `resources/desktop/menu.json` | Left-nav entry: `{ "text": "Gallery", "iconCls": "x-fa fa-image", "xtype": "galleryview", "leaf": true }` |

**Routing:** clicking "Gallery" in the left nav (or loading `#galleryview` directly) goes through
`MainViewController.mainRoute('galleryview')`, which looks up the node by `xtype` in the menu
store and lazily instantiates `{ xtype: 'galleryview' }` inside `CenterView` (a `card`-layout
container). Menu entries route by **`xtype`**, not `href` — an `href`-based entry renders in the
tree but does not route (see the app shell section, §4).

---

## 3. Gallery sections (in page order)

Every section is a `Ext.panel.Panel` with `cls: 'gallery-section'` and `itemId: 'gallery-<id>'`.
Every labelled row inside is `cls: 'gallery-row'` with `itemId: 'row-<slug>'`. Query all section
ids at once with:
```js
Ext.ComponentQuery.query('galleryview')[0].items.items.map(c => c.itemId)
```
which should return all 16 ids below, in this order.

### 3.1 `gallery-tokens` — native theme surfaces
- **row-surfaces:** a default `panel`, a `frame: true` panel, and a `toolbar` — the three
  baseline chrome surfaces (card look, framed look, flat toolbar look).
- **row-emphasis:** buttons demonstrating Primary (default UI), Secondary (`ui:
  'default-toolbar'`), Destructive (`ui: 'decline'`), plus a `displayfield` showing muted text
  colour.

### 3.2 `gallery-buttons`
7 rows: **row-variants** (default / toolbar / confirm / decline UIs), **row-sizes** (small /
medium / large), **row-with-icon** (New, Export), **row-icon-only** (4 icon-only buttons with
tooltips: edit/copy/settings/delete), **row-disabled** (2 disabled buttons), **row-toggle** (2
toggle buttons, one pressed), **row-split-menu** (a `splitbutton` + a menu button), and
**row-buttongroup** (`buttongroup` "Formatting" with Bold/Italic/Underline).

### 3.3 `gallery-badges`
Exercises `ppa.react.ReBadge` directly:
- **row-variants:** 5 badges — default, secondary, destructive, outline, ghost.
- **row-with-icon:** "Verified" (secondary + check icon), "3 new" (outline + bell icon).

### 3.4 `gallery-fields`
8 rows, one per field type, each generated via the file's `fieldStatesRow(itemId, baseCfg)` IIFE
helper into **5 state columns**: Normal / Focused / Invalid / Disabled / Read-only (160px each).
Field types: `textfield`, `textareafield`, `numberfield`, `combobox` (STATUS_ITEMS data),
`datefield`, `checkboxfield`, `radiofield`, `sliderfield`. "Focused" and "Invalid" states are
driven by `GalleryViewController.onFocusFieldAfterRender` / `onInvalidFieldAfterRender` listeners
on `afterrender`.

**Inline mock datasets used across §3.4/§3.5:**
- `STATUS_ITEMS`: open / replied / closed / escalated
- `TAG_ITEMS`: vip / repeat / group / agent / newsletter
- `TOUR_ITEMS`: silkroad / stans / aurora / fjord / lofoten (tour names)

### 3.5 `gallery-fields2`
11 rows covering the less-common field/selection surfaces: toggle buttons, single- and
multi-select `segmentedbutton`, vertical/horizontal `radiogroup`, `checkboxgroup`, a type-ahead
`combobox`, a `tagfield` (2 preselected tags), `multiselect` (`Ext.ux.form.MultiSelect`),
`itemselector` (`Ext.ux.form.ItemSelector`), a preset `datefield`, an inline `datepicker`, and a
`calendar-month` panel (`Ext.calendar.panel.Month`, deliberately **no event store** — inline/sync
data crashes the ext-calendar package, see repo memory).

### 3.6 `gallery-fieldsets` — label-beside-field house style
- **row-label-left:** a `form` with `labelAlign: 'left'`, `labelWidth: 110` — Tour name,
  Status combobox, Confirmed checkbox, Notes textarea, all aligned on one label column.
- **row-label-right:** same pattern with `labelAlign: 'right'` (Agent name/email).
- **row-departure-details:** an `Ext.form.FieldSet` titled "Departure details" (date, seats
  number, confirmed checkbox).

### 3.7 `gallery-card`
- **row-agent-settings:** a titled panel ("Agent settings") containing a nested form (display
  name, auto-reply checkbox) with a `bbar` (Save/Cancel).
- **row-statistics:** a titled panel ("Statistics") with raw `.re-tile-value`/`.re-tile-label`
  HTML (a manual stat display, pre-`ReTile` style — kept as a native-panel comparison point).

### 3.8 `gallery-table`
A single plain `grid` (4 rows: Aurora Trek, Silk Road 19d, Fjord Explorer, Desert Crossing) with
a `checkcolumn`, tour name, status, right-aligned seats, and a `usMoney`-formatted price column —
the simplest possible themed-grid baseline.

### 3.9 `gallery-datagrid` — the "everything at once" grid
One grid combining every advanced grid feature simultaneously:
- **tbar:** search field, status filter combobox, `->` spacer, refresh/columns/export/add icon
  buttons.
- **FilterBar:** `plugins: { gridfilterbar: true }`; columns declare `filterType: 'string'|
  'list'|'number'`.
- **Grouping + group summary:** `groupField: 'region'`, `features: [{ ftype:
  'groupingsummary', groupHeaderTpl: '{name} ({rows.length})' }]`.
- **Grand summary:** `features: [{ ftype: 'summary', dock: 'bottom' }]`, `summaryType: 'sum'`
  on Seats/Price.
- **Paging:** `store.pageSize: 8`, memory proxy with `enablePaging: true`, `bbar: { xtype:
  'pagingtoolbar' }`.
- **Status colouring:** the Status column renderer and `viewConfig.getRowClass` both call into
  `ppa.react.ReStatus` (`getCellCls`/`getRowCls`) — this is the canonical example of wiring a
  native grid to the shared status ramp.
- **Data:** 12 rows across 4 regions (Central Asia, Nordics, Africa, Americas).
- **Selection:** `selModel: { type: 'checkboxmodel' }`.

### 3.10 `gallery-trees`
- **row-treelist:** a default-UI `treelist` (not `ui: 'nav'` — that variant is the sidebar,
  themed separately by `ppa.react.ReNavTree`), 3 levels deep (continent → tour → departure),
  `indent: 16`, icons on, one node selected.
- **row-treelist-states:** a second `treelist`, `singleExpand: true`, all collapsed, no
  `iconCls` — demonstrates the icon-less/collapsed states.
- **row-treegrid:** a `treepanel` ("TreeGrid" — hierarchy + data columns), `rootVisible: false`,
  `useArrows: true`, `lines: false`, columns: Name (`treecolumn`, flex 1), Status (120px),
  Seats (80px, right-aligned).

All three share the same tour-vocabulary dataset (Asia/Europe/Americas → tours → departures) so
this page and the manuka React reference gallery (`frontend/src/app/theme-gallery/page.tsx`,
different repo) read identically for side-by-side comparison.

### 3.11 `gallery-tiles` — `ReTile` + status accents
- **row-stat-tiles:** 4 `xtype: 'retile'` tiles — Open (no accent), Escalated (`accent: 'left'`,
  `status: 'escalated'`), Replied (`accent: 'top'`, `status: 'replied'`), Failed (`accent:
  'right'`, `status: 'send-failed'`).
- **row-status-accent-grid:** a grid whose Status column is `xtype: 'restatuscolumn'` (the
  `ReStatusColumn` wrapper — no inline renderer needed) and whose Confidence column and row class
  both derive their colour from `ppa.react.ReStatus`.

### 3.12 `gallery-tabs`
5 tab-panel rows exercising every position/mode: **row-tabs-top** (4 tabs: plain, closable, icon,
disabled), **row-tabs-bottom** (`tabPosition: 'bottom'`), **row-tabs-plain** (`plain: true`,
underline style), **row-tabs-vertical** (`tabPosition: 'left'`), **row-tabs-vertical-plain**
(left + plain combined).

### 3.13 `gallery-overlays`
- **row-menu-tooltip:** a menu button (standard items, a checkable item, a submenu) plus a
  second button that gets an `Ext.tip.ToolTip` attached in `afterrender`
  (`onTooltipButtonAfterRender`, `anchor: 'top'`).

### 3.14 `gallery-windows`
- **row-window-launchers:** 5 buttons opening: a standard non-modal window (form body + Save/Close
  `bbar`), a window with a `tbar` (3 icon buttons), an `Ext.Msg.confirm` dialog, an
  `Ext.Msg.alert` dialog, and a `maximized: true` window.

### 3.15 `gallery-toasts`
5 rows exercising `ppa.react.ReToast` end-to-end: **row-toast-types** (success/error/warning/
info/plain, via `GalleryViewController.onToastButtonClick`), **row-toast-positions** (`tr` vs
`br` alignment), **row-toast-persistent** (`autoClose: false`, one per type — needed so
screenshots can capture a stable toast), **row-toast-autoclose** (`autoCloseDelay: 4000`), and
**row-toast-progress** (a toast containing an `Ext.ProgressBar`, via
`onProgressToastClick`).

### 3.16 `gallery-misc`
**row-progressbar** (a standalone `progressbar` at 60%), **row-loadmask** (a target panel +
toggle button driving `setLoading()`), **row-separator** (a toolbar with a `tbseparator` between
two buttons), **row-avatar** (two `ppa.react.ReAvatar` — one medium "JS", one small "AB").

---

## 4. The surrounding application shell

The gallery lives inside a standard `border`-layout shell built entirely from `ppa-react-ui`
`Re*` base classes (see that package's reference doc §3 for the generic component contracts —
this section covers **this app's specific wiring**).

```
┌─────────────────────────────── HeaderView (north) ───────────────────────────────┐
│ [nav toggle] [page heading, bound to route]     [->][->] [dark] [cal][bolt][search][detail] │
├──────────┬──────────────────────────────────────────────────────────┬────────────┤
│ NavView  │                                                          │            │
│ (west)   │                    CenterView (center)                   │ DetailView │
│          │            card-layout, hosts the routed page            │  (east)    │
│ TopView  │        (Home / Personnel / Gallery — one active)          │            │
│ (avatar) │                                                          │            │
│ MenuView │                                                          │            │
│ (tree)   │                                                          │            │
│ BottomVw │                                                          │            │
│ (icons)  │                                                          │            │
├──────────┴──────────────────────────────────────────────────────────┴────────────┤
│                             FooterView (south) — version string                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.1 `MainView` / `MainViewController`

`ClassicApp.view.main.MainView` (`xtype: 'mainview'`) is a `border`-layout `Ext.Container` with
5 children, each bound `reference`d for the controller: `navview` (west, `weight: -1`),
`headerview` (north, docked top, `weight: -2`), `footerview` (south, docked bottom, `weight:
-2`), `centerview` (center), `detailview` (east, docked right, bound `width`).

`MainViewController` owns the app's single route:
```js
routes: { ':xtype': { action: 'mainRoute' } }
```
- **`mainRoute(xtype)`** — validates the xtype is a real registered widget, finds the matching
  node in the menu store, lazily creates-or-activates that child inside `CenterView`
  (`itemId: xtype`), sets it as the active card, syncs the nav tree's selection, and updates the
  ViewModel's `heading`.
- **`onMenuViewSelectionChange(tree, node)`** — fired by the nav tree's `selectionchange`; calls
  `redirectTo(node.xtype)`, which updates the URL hash and re-enters `mainRoute`.
- **`onHeaderViewNavToggle()`** — toggles the ViewModel's `navCollapsed`, which the sidebar's
  `micro` binding (via `ReNavTree`) reads to switch between full and icon-only rail; also swaps
  `TopView`'s avatar size/caption (100×100 + "Welcome John Smith" ↔ 35×35 + "John Smith").
- **`onHeaderViewDetailToggle()`** — toggles `detailCollapsed` (hides/shows `DetailView`) and
  flips the toggle button's `iconCls` between `fa-arrow-left`/`fa-arrow-right`.
- **`onHeaderViewDarkModeToggle(button)`** — `Ext.getBody().toggleCls('dark-mode', button.pressed)`,
  swapping the icon between `fa-moon`/`fa-sun`. **Note:** `Button.toggle(true)` alone does not
  fire the handler — only a real click does; script this with `btn.el.dom.click()` when
  automating dark-mode verification.
- **`onToolButtonClicked(button)`** — generic handler for the calendar/bolt/search icon buttons
  in both the header and the sidebar footer; shows an info message box naming the button.

### 4.2 Shell view classes and what they extend

| View class | xtype | Extends (`ppa.react.*`) | Region / dock | Content |
|---|---|---|---|---|
| `HeaderView` | `headerview` | `ReHeaderBar` | north, height 50 | nav toggle, bound heading text, spacer, dark-mode toggle, calendar/bolt/search icons, detail toggle |
| `NavView` | `navview` | `ReSidebar` | west | hosts TopView (tbar) + MenuView (items) + BottomView (bbar); exposes `store`/`micro`/`selection` render-configs delegated to its controller |
| `TopView` | `topview` | `ReSidebarHeader` | NavView's `tbar` | a `ReAvatar` (photo, 100×100) + a caption component bound to a welcome string |
| `MenuView` | `menuview` | `ReNavTree` | NavView's `items` | bound to `{menu}` store and `{navCollapsed}` (micro); fires `selectionchange` |
| `BottomView` | `bottomview` | `ReSidebarFooter` | NavView's `bbar`, height 50 | 3 `ReIconButton`s (calendar/bolt/search) |
| `FooterView` | `footerview` | `ReStatusBar` | south | `title: 'Ext JS version: ' + Ext.versions.extjs.version` |
| `CenterView` | `centerview` | `ReContentArea` | center | `layout: 'card'`; routed pages are added here by xtype |
| `DetailView` | `detailview` | `ReCard` | east, docked right, collapsible | placeholder content |
| `HomeView` | `homeview` | `ReCard` | (routed page) | long-form welcome/overview text |
| `PersonnelView` | `personnelview` | `Ext.grid.Panel` (plain, not a `Re*` class) | (routed page) | a real data grid (Name/Email/Phone) — kept as a plain-grid comparison point alongside the gallery's themed grids |

### 4.3 `resources/desktop/menu.json` — the nav tree data

```json
{
  "leaf": false,
  "children": [
    { "text": "Home",      "iconCls": "x-fa fa-home",  "xtype": "homeview",      "leaf": true },
    { "text": "Personnel", "iconCls": "x-fa fa-table", "xtype": "personnelview", "leaf": true },
    { "text": "Gallery",   "iconCls": "x-fa fa-image", "xtype": "galleryview",   "leaf": true }
  ]
}
```
Three top-level, all-leaf entries. **Routing is keyed on `xtype`, not `text` or `href`** — see
§2. Add a new routed page by adding a node here with a real, registered `xtype`.

---

## 5. `GalleryView.scss` — what belongs here (and what doesn't)

```scss
.galleryview { padding: 16px; }
.gallery-section { margin-bottom: 24px; }
.gallery-row { margin-bottom: 12px; }
```
That's the entire intended contents: **layout spacing only**. All component colouring lives in
`packages/local/ppa-react-ui` (for `Re*` components) or `packages/local/theme-react-shadcn` (for
native Ext JS components). If you find yourself adding a colour/font rule here, it belongs in one
of those two packages instead — this file having grown component-specific rules in the past was
itself a past defect, since fixed.

---

## 6. Using this page for AI-driven theme testing/troubleshooting

### 6.1 Standard verification loop after a theme/component change

1. Confirm the rebuild actually happened before trusting anything on screen:
   ```powershell
   Get-Item "c:\work\extjs\classic-app\build\development\ClassicApp\desktop\resources\ClassicApp-all_1.css" | Select-Object LastWriteTime
   ```
2. Navigate to `http://localhost:1962/#galleryview` (append `?nocache=<timestamp>` after a
   rebuild if the browser cache looks stale — but note `page.goto` with a `?nocache=` query does
   **not** itself trigger the hash route; set `location.hash` afterwards, see trap below).
3. Enumerate sections to confirm all 16 resolve:
   ```js
   Ext.ComponentQuery.query('galleryview')[0].items.items.map(c => c.itemId)
   ```
4. Assign real DOM ids before screenshotting a specific section (sections only carry `itemId`,
   not `id`):
   ```js
   Ext.ComponentQuery.query('galleryview')[0].items.each(c => { c.el.dom.id = c.itemId; });
   ```
5. Screenshot in light mode, then toggle dark mode and screenshot again:
   ```js
   Ext.ComponentQuery.query('mainview')[0].down('button[enableToggle=true]').el.dom.click();
   ```
   (Toggling the JS `pressed` state directly does not fire the handler — see §4.1.)

### 6.2 Known traps specific to this page (do not rediscover them)

1. **Never use Playwright `waitUntil: 'networkidle'`** against `localhost:1962` — the
   dev-server websocket never settles and the call hangs, wedging the tab.
2. **Hash-routing race:** setting `location.hash = '#galleryview'` immediately after
   `page.goto` can be overwritten back to `#homeview` by the app's own ready-time routing. Loop
   re-setting the hash and checking `Ext.ComponentQuery.query('galleryview').length` until it
   succeeds; after a `location.reload()`, re-setting the hash to the **same** value it already
   had does not fire `hashchange` at all — call
   `Ext.ComponentQuery.query('mainview')[0].getController().mainRoute('galleryview')` directly
   instead of fighting the hash.
3. **`element.scrollIntoView()` / `scrollIntoViewIfNeeded()` get reverted by the Ext JS
   scroller** — a rect measured in one call is stale by the next. Drive
   `'.galleryview.x-scroller'`'s `scrollTop` in a loop until the target row is in view, and
   measure + screenshot inside the **same** tool call.
4. **The page is normally hidden/backgrounded during automated screenshotting.**
   `getComputedStyle` is unreliable on a hidden page (style recalc throttled; some elements
   freeze entirely) — verify by writing an inline style and reading it back, or trust the
   compiled CSS on disk instead. Screenshots of a hidden page are one frame stale — take two in a
   row and use the second.
5. **Disable CSS transitions before measuring hover/focus states** — inject
   `*,*:before,*:after{transition:none !important;animation:none !important;}` first, or a
   transitioned property reads back its start value and every state override looks broken.
6. **Very small screenshot crops (under ~150px) read misleadingly** in an image viewer — always
   verify a suspected rendering defect with a larger crop before concluding it's real.
7. **A killed dev server can leave `sencha app watch` running**, silently serving stale CSS
   forever after. Confirm rebuilds by the CSS file's mtime (§6.1 step 1), not by the page
   responding 200.

---

## 7. Definition of "the gallery is healthy" (regression checklist)

1. `#galleryview` loads with **zero console errors**.
2. `Ext.ComponentQuery.query('galleryview')[0].items.items.map(c => c.itemId)` returns all 16
   ids from §3, in order.
3. The datagrid section (§3.9) shows tbar + filter bar + group headers + group summary rows +
   grand summary row + a working paging toolbar, simultaneously.
4. Every window launcher (§3.14) opens a functional, non-modal window with working
   minimize/maximize/close tools.
5. Every toast type (§3.15) fires; persistent toasts stay on screen; both `tr` and `br`
   positions work.
6. `gallery-fieldsets` (§3.6) shows labels beside fields, aligned on one shared label column per
   group.
7. The left nav rail (outside the gallery panel itself) is visually unaffected by any gallery- or
   tree-related change — the nav tree shares CSS-loading order concerns with the gallery's
   `treelist`/`treepanel` rows (see the theme reference doc §7 trap 9).

---

## 8. Related documents

- [`../theme-react-shadcn/THEME_REACT_SHADCN_REFERENCE.md`](../theme-react-shadcn/THEME_REACT_SHADCN_REFERENCE.md) — the native-component theme this page's sections 3.1–3.10, 3.12–3.14 exercise.
- [`../ppa-react-ui/PPA_REACT_UI_COMPONENTS_REFERENCE.md`](../ppa-react-ui/PPA_REACT_UI_COMPONENTS_REFERENCE.md) — the `Re*` components this page's sections 3.3, 3.11, 3.15, 3.16, and the entire app shell (§4) exercise.
- `docs/EXTJS_GALLERY_SPEC.md` — the original build-out spec for this page (the *why*/history; this document is the *what's here now*).
- `.github/skills/extjs8-classic/SKILL.md` — general Ext JS 8 Classic framework knowledge and lookup rules.
