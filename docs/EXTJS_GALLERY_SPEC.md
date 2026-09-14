# ExtJS Component Gallery — Implementation Spec

**Task owner:** mid-tier model (Sonnet-class). **Reviewer:** Opus (theme parity work follows).

## 0. START HERE — required reading & lookup rules

**Read `.github/skills/extjs8-classic/SKILL.md` before writing any code.** It has verified
ExtJS 8.0.0.43 patterns, this app's conventions, and the silent-failure traps. Do not rely on
recalled ExtJS knowledge — it is usually wrong or from an older major version.

Resolve any API gap in this order:

1. **Copy a working example already in this repo** — `app/desktop/src/view/**`, and the seed
   section described in §5.0. This is by far the cheapest and most reliable route.
2. **Grep the local framework source** — `node_modules/@sencha/ext-classic/src/**` is the exact
   shipped 8.0.0.43 source. Read **targeted line ranges**; many files exceed 3000 lines.
   ```powershell
   $C = "c:\work\extjs\classic-app\node_modules\@sencha\ext-classic\src"
   Select-String -Path "$C\grid\Panel.js" -Pattern "@cfg" | Select-Object -First 40
   Select-String -Path "$C\form\field\Tag.js" -Pattern "^\s*(alias|xtype):"
   ```
3. **Last resort:** https://docs.sencha.com/extjs/8.0.0/classic/Ext.html — Classic Toolkit API,
   component classes in the left-hand class tree.

> **HARD RULE — do not crawl the Sencha API site.** Class pages are enormous and the tree is
> thousands of pages. Fetching several *will* exceed the context window and hard-fail the request
> with `model_max_prompt_tokens_exceeded`. This has already happened once on this task. Fetch at
> most **one** class page for **one** specific question, and prefer source-grepping.

> If a lookup might be large, delegate it to an **Explore subagent** and ask for a short distilled
> answer (e.g. "return only the config names and defaults") so the bulk never enters main context.

## 1. Goal

Build an ExtJS Classic view that renders every component surface the React reference gallery
renders, so the two can be screenshot side-by-side during theme development.

**Reference to mirror:** `http://localhost:3000/theme-gallery`
(source: `c:\work\manuka-ai-agent\frontend\src\app\theme-gallery\page.tsx`)

**Target:** `http://localhost:1962/#galleryview`

## 2. Scope boundary — READ THIS FIRST

**This task is "get the components on screen". It is NOT a styling task.**

- Do **not** write any SCSS colour/spacing/font rules to make ExtJS look like React.
- Do **not** edit `packages/local/theme-shadcn/**`.
- Do **not** edit `app/desktop/sass/var.scss` or `app/shared/sass/var.scss`.
- The gallery will look like stock Material. **That is the correct outcome.**

The only CSS you may write is layout scaffolding in `GalleryView.scss` (section spacing,
row wrapping) and the status-accent classes named in §7.10.

## 3. Environment facts (already verified — do not re-investigate)

| Fact | Value |
|---|---|
| Ext JS | 8.0.0.43, Classic toolkit |
| Dev server | `npm run dev` → `http://localhost:1962` (already running) |
| Rebuild | webpack-dev-server hot-rebuilds on `.js`/`.scss` save, ~10s. **No restart needed.** |
| Active theme | `theme-shadcn` (`packages/local/theme-shadcn`) — leave it alone |
| Icons | FontAwesome 7 Free, via `iconCls: 'x-fa fa-<name>'` |
| App namespace | `ClassicApp` |

### Installed packages available to you
`ext-ux` (Sencha name **`ux`**) and `ext-calendar` (Sencha name **`calendar`**) are installed
in `node_modules/@sencha/`, and `workspace.json` already lists them on the package path.

**You must add them to `app.json` `requires`** or their classes will not resolve:

```json
"requires": [
  "font-awesome",
  "ux",
  "calendar"
]
```

Use the **Sencha package names** (`ux`, `calendar`), not the npm names (`ext-ux`, `ext-calendar`).

## 4. Known traps (these have already cost time — do not rediscover them)

1. **`sass/src/*.scss` filenames must map to a real class.** A file named `DarkMode.scss`
   compiles to *nothing*, silently, with no build error. Only relevant if you touch theme SCSS —
   which you shouldn't.
2. **Menu routing is by `xtype`, not `href`.** `MainViewController.mainRoute` does
   `store.findNode('xtype', xtype)`. There is a commented-out Gallery line in `menu.json` that
   uses `"href"` — **do not uncomment it as-is**, it will not route. Use the `xtype` form in §5.
3. **Never use `waitUntil: 'networkidle'`** against `localhost:1962`. The dev-server websocket
   never settles; it hangs the page and the tab must be re-navigated to recover.
4. **Classes used only via string xtype need explicit `requires`.** Sencha Cmd's dependency
   analysis will not find `Ext.grid.plugin.filterbar.FilterBar`, `Ext.ux.form.MultiSelect` etc.
   from a plugin/xtype string alone. List them in the view's `requires` array.
5. `app.json` has `"fashion": { "missingParameters": "error" }` — an unknown SCSS variable is a
   hard build failure, not a warning.

## 5. Files to create / edit

### 5.0 The seed section — build by analogy, not from scratch

**These already exist and are verified working in the browser. Read them first.**

- `app/desktop/src/view/gallery/GalleryView.js` — view skeleton, `requires`, and the complete
  `gallery-datagrid` section (§7.8).
- `app/desktop/src/view/gallery/GalleryViewController.js` — empty controller, ready for handlers.
- `app/desktop/src/view/gallery/GalleryView.scss` — layout scaffolding + status-accent classes.
- `resources/desktop/menu.json` — Gallery entry (already wired and routing).
- `app.json` — `requires` already includes `ux` and `calendar`.

Confirmed rendering at `http://localhost:1962/#galleryview` with **zero console errors**:
9 rows, 3 group headers, 1 filter bar, 4 summary rows (3 group + 1 grand), working paging.

Your job is the **remaining 14 sections**. For each, copy the structural pattern of the seed and
swap in the components listed in §7. If you find yourself reading API docs to work out basic
config syntax, stop — the answer is almost certainly in the seed code or in
`.github/skills/extjs8-classic/SKILL.md`.

**Do not modify the seed's `gallery-datagrid` section.** Add new sections as siblings in the
`items` array, in the order given in §6.

### 5.0.1 Non-obvious things the seed already proves

- `plugins: { gridfilterbar: true }` + `filterType: 'string'` on columns.
- Client-side paging of inline data **requires**
  `proxy: { type: 'memory', enablePaging: true, data: [...] }` plus `autoLoad: true`.
  A plain `data: []` store will render but **will not page**.
- `{ ftype: 'groupingsummary' }` and `{ ftype: 'summary', dock: 'bottom' }` coexist.
- Per-row classes via `viewConfig.getRowClass`; per-cell via `renderer(v, meta)` → `meta.tdCls`.
- Grids need an explicit `height` inside the auto-layout gallery container.

### Create `app/desktop/src/view/gallery/GalleryView.js`
Follows the existing ViewPackage pattern — see `app/desktop/src/view/personnel/PersonnelView.js`.

```js
Ext.define('ClassicApp.view.gallery.GalleryView', {
    extend: 'Ext.Container',
    xtype: 'galleryview',
    cls: 'galleryview',
    controller: 'galleryviewcontroller',
    scrollable: true,
    requires: [ /* see §4.4 */ ],
    items: [ /* sections, §7 */ ]
});
```

### Create `app/desktop/src/view/gallery/GalleryViewController.js`
`alias: 'controller.galleryviewcontroller'`. Holds handlers for the toast buttons, window
launchers and message boxes.

### Create `app/desktop/src/view/gallery/GalleryView.scss`
Layout scaffolding + status-accent classes only (§2).

### Edit `resources/desktop/menu.json`
Replace the commented-out line with:
```json
{ "text": "Gallery", "iconCls": "x-fa fa-image", "xtype": "galleryview", "leaf": true }
```

### Edit `app.json`
Add `"ux"` and `"calendar"` to `requires` (§3).

## 6. Structural conventions — REQUIRED

The parity loop screenshots individual components by selector. Get this wrong and the whole
downstream workflow breaks.

- Every section is an `Ext.panel.Panel` with `title` and **`itemId: 'gallery-<id>'`**,
  where `<id>` **exactly matches** the React `data-gallery="<id>"` value.
- Every labelled row inside a section gets **`cls: 'gallery-row'`** and
  **`itemId: 'row-<slug>'`**, matching the React `data-gallery-row="<label>"` value.
- Sections appear in the **same order** as the React page.

### Section id → React source map

| itemId | React `data-gallery` |
|---|---|
| `gallery-tokens` | `tokens` |
| `gallery-buttons` | `buttons` |
| `gallery-badges` | `badges` |
| `gallery-fields` | `fields` |
| `gallery-fields2` | `fields2` |
| `gallery-fieldsets` | `fieldsets` |
| `gallery-card` | `card` |
| `gallery-table` | `table` |
| `gallery-datagrid` | `datagrid` |
| `gallery-tiles` | `tiles` |
| `gallery-tabs` | `tabs` |
| `gallery-overlays` | `overlays` |
| `gallery-windows` | `windows` |
| `gallery-toasts` | `toasts` |
| `gallery-misc` | `misc` |

## 7. Section contents

Open the React gallery and mirror each section. Where ExtJS has no equivalent, use the stated
fallback. **Match the set of states shown, not just the happy path** — states are where ExtJS
and shadcn diverge most, so they matter more than breadth.

### 7.1 `gallery-buttons`
- Variants via `ui`: `default`, `default-toolbar`, plus `ui: 'confirm'` / `'decline'`.
- Sizes: `scale: 'small' | 'medium' | 'large'`.
- With icon (`iconCls: 'x-fa fa-plus'`, `iconAlign: 'left'`), icon-only (`text: null`).
- `disabled: true`.
- `enableToggle: true` with `pressed: true`.
- Split button (`Ext.button.Split`) and a menu button (`menu: [...]`).
- A `Ext.container.ButtonGroup` row.

### 7.2 `gallery-badges`
ExtJS has no Badge. Render `Ext.Component` items with
`cls: 'gallery-badge gallery-badge-<variant>'` and plain text, variants
`default | secondary | destructive | outline | ghost`. Styling comes later.

### 7.3 `gallery-fields`
`textfield`, `textareafield`, `numberfield`, `combobox`, `datefield`, `checkboxfield`,
`radiofield`, `sliderfield`.

Each in **all five states**: normal, focused, invalid, disabled, readOnly.
- invalid → call `field.markInvalid('Error message')` in the controller's `afterrender`.
- focused → one field with `focusCls` applied, or focus it programmatically after render.

### 7.4 `gallery-fields2`
- Toggle buttons: `enableToggle: true`, both pressed and unpressed.
- `Ext.button.Segmented` (`xtype: 'segmentedbutton'`), single- and multi-select.
- `Ext.form.RadioGroup` — vertical (`columns: 1`) and horizontal (`columns: 3`).
- `Ext.form.CheckboxGroup`.
- `combobox` with `typeAhead: true`, `queryMode: 'local'`.
- **Tag combobox:** `xtype: 'tagfield'` with 2 values preselected.
- **Multiselect list:** `Ext.ux.form.MultiSelect` (`xtype: 'multiselect'`).
- **Item selector:** `Ext.ux.form.ItemSelector` (`xtype: 'itemselector'`).
- **Date picker:** `datefield` with `value: new Date(2027, 4, 1)`.
- **Inline calendar:** `Ext.picker.Date` (`xtype: 'datepicker'`).
- **Calendar panel:** `xtype: 'calendar-month'` from the `calendar` package, sized ~600×400,
  with a small in-memory event store.

### 7.5 `gallery-fieldsets`
This mirrors a specific user requirement — **label beside field, never above**.

- `Ext.form.Panel` with `defaults: { labelAlign: 'left', labelWidth: 110, anchor: '100%' }`.
- A group of `textfield` + `combobox` + `checkboxfield` + `textareafield` sharing that
  `labelWidth`, so **every control starts at the same x**.
- A second group demonstrating `labelAlign: 'right'`.
- An `Ext.form.FieldSet` with `title: 'Departure details'` containing 3 fields, one a checkbox.
- **The checkbox/radio must sit at the control column's left edge**, in line with the text
  fields above it — not floated right.

### 7.6 `gallery-card`
`Ext.panel.Panel` with `title`, body content, and `bbar` containing Save / Cancel.
Second panel: a stat-style panel with a large number.

### 7.7 `gallery-table`
Plain `Ext.grid.Panel`, ~4 rows, in-memory store, `columns` with one `checkcolumn`.

### 7.8 `gallery-datagrid` — the important one
A single `Ext.grid.Panel` combining **all** of:

- **`tbar`** — search `textfield`, a filter `combobox`, `->` spacer, refresh/columns/export/add
  buttons with `x-fa` icons.
- **FilterBar** — `plugins: { gridfilterbar: true }`,
  requires `Ext.grid.plugin.filterbar.FilterBar`. Give columns a `filterType` config
  (`'string'`, `'list'`, `'number'`). Note: the alias is `gridfilterbar` and the column config
  is `filterType` — `filterbar` / `filter` are both wrong and fail silently.
- **Grouping + group summary** —
  `features: [{ ftype: 'groupingsummary', groupHeaderTpl: '{name} ({rows.length})' }]`,
  store grouped by a `region` field.
- **Grand summary** — `features: [{ ftype: 'summary', dock: 'bottom' }]` with
  `summaryType: 'sum'` / `'count'` on numeric columns.
- **Paging** — `bbar: { xtype: 'pagingtoolbar', displayInfo: true }`, store `pageSize: 5`.

Dataset: ~12 rows, fields `name`, `status`, `region`, `seats`, `price`. Group by `region`.

### 7.9 `gallery-tabs`
`Ext.tab.Panel` — plain tabs, a closable tab, an icon tab, a disabled tab.
Second instance with `tabPosition: 'bottom'`.

### 7.10 `gallery-tiles`
Dashboard tiles + status accents.

- Row of 4 stat tiles: `Ext.panel.Panel`, icon + label + large number.
- Accent variants via `cls`: `gallery-tile-accent-left|top|right` combined with
  `gallery-status-open|escalated|replied|send-failed`.
- In `GalleryView.scss`, define those classes with a 3px border on the relevant edge. Use plain
  placeholder colours; Opus retokenises them later.
- **Grid row status accent:** grid with `viewConfig: { getRowClass: function(rec) { return 'gallery-status-' + rec.get('status'); } }`.
- **Grid cell status accent:** column with
  `renderer: function(v, meta) { meta.tdCls = 'gallery-conf-' + level; return v; }`.

### 7.11 `gallery-overlays`
Menu button with `Ext.menu.Menu` (items, checkitem, separator, submenu), and an
`Ext.tip.ToolTip` attached to a button.

### 7.12 `gallery-windows`
Buttons that launch:
1. **Standard window** — `Ext.window.Window`, `title`, `maximizable: true`,
   `minimizable: true`, `closable: true`, form body, `bbar` with **Save** and **Close**.
2. **Window with `tbar`** — same plus a docked top toolbar.
3. **Message box** — `Ext.Msg.confirm(...)` and `Ext.Msg.alert(...)`.
4. **Maximized window** — opens with `maximized: true`.

Windows must be **non-modal where possible** so they can be screenshotted alongside the page.

### 7.13 `gallery-toasts`
Buttons firing `Ext.toast({ html, title, align })`:
- Types: success / error / warning / info / plain. Distinguish via
  `iconCls: 'x-fa fa-check|fa-xmark|fa-triangle-exclamation|fa-circle-info'` and
  `cls: 'gallery-toast-<type>'`.
- Positions: `align: 'tr'` (top-right) and `align: 'br'` (bottom-right).
- A **persistent** toast (`autoClose: false`) per type — needed for screenshots.
- An auto-closing toast (`autoCloseDelay: 4000`) to demo self-dismiss.
- A progress toast: `Ext.ProgressBar` inside a toast, or `Ext.MessageBox.progress`.

### 7.14 `gallery-misc`
`Ext.ProgressBar`, `Ext.LoadMask` on a panel, a separator (`Ext.toolbar.Separator`),
and an avatar substitute (`Ext.Component` with `cls: 'gallery-avatar'` + initials).

## 8. Definition of done

1. `http://localhost:1962/#galleryview` loads with **zero console errors**.
2. "Gallery" appears in the left nav and routes correctly when clicked **and** on direct
   URL load / refresh.
3. All 15 sections render, in React order, with the `itemId`s from §6.
4. The datagrid shows tbar, filter bar, group headers, group summary rows, grand summary
   row, and a working paging toolbar **simultaneously**.
5. Every window tool (minimize / maximize / close) is present and functional.
6. Each toast type fires, persistent toasts stay on screen, and both `tr` and `br`
   positions work.
7. Form groups in `gallery-fieldsets` show labels beside fields with a shared label width
   and controls aligned on a common x.
8. `git status` shows changes limited to:
   `app/desktop/src/view/gallery/*`, `resources/desktop/menu.json`, `app.json`,
   and `package.json` / `package-lock.json` from the package installs.

## 9. Verification

```powershell
# build errors surface in the dev-server terminal; also check:
Get-Content c:\work\extjs\classic-app\build\development\ClassicApp\desktop\resources\*.css |
  Select-String 'galleryview' | Select-Object -First 3
```

In the browser, confirm no errors and that sections resolve:

```js
Ext.ComponentQuery.query('galleryview')[0].items.items.map(c => c.itemId)
```

Should list all 15 `gallery-*` ids in order.

## 10. Out of scope — do not do these

- Any colour / font / spacing work to match React. That is the next phase.
- Editing `packages/local/theme-shadcn/**`.
- Editing the React gallery.
- Re-tokenising the 14 existing view SCSS files under `app/desktop/src/view/**`.
- Deleting or modifying `HomeView` / `PersonnelView`.
