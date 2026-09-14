---
name: extjs8-classic
description: "Use for ANY work in the classic-app ExtJS 8.0 Classic Toolkit codebase — creating or editing views, grids, forms, windows, toolbars, stores, controllers, plugins, layouts, or theme SCSS. Contains verified ExtJS 8.0.0.43 patterns, class/xtype names, and the correct way to look up API details without blowing the context window."
---

# ExtJS 8.0 Classic Toolkit — working knowledge

Target: `c:\work\extjs\classic-app`, Ext JS **8.0.0.43**, Classic toolkit, namespace `ClassicApp`.

## 0. CRITICAL — how to look things up

Modern LLMs have poor/outdated knowledge of ExtJS 8 Classic. Resolve gaps in this order:

1. **Copy an existing working example in this repo.** Best option. See `app/desktop/src/view/**`.
2. **Grep the local framework source** — it is the exact shipped version:
   ```powershell
   $C = "c:\work\extjs\classic-app\node_modules\@sencha\ext-classic\src"
   # find a class file
   Get-ChildItem $C -Recurse -Filter "Panel.js" | Select-Object FullName
   # find the xtype for a class
   Select-String -Path "$C\form\field\Tag.js" -Pattern "^\s*(alias|xtype):"
   # list configs of a class (JSDoc @cfg)
   Select-String -Path "$C\grid\Panel.js" -Pattern "@cfg" | Select-Object -First 40
   ```
   Read **targeted line ranges**, never whole files — many exceed 3000 lines.
3. **Last resort: https://docs.sencha.com/extjs/8.0.0/classic/Ext.html** (class tree in left nav).

> **HARD RULE — do not crawl the Sencha API site.** Individual class pages are enormous and the
> tree is thousands of pages. Fetching several *will* exceed the context window and hard-fail the
> request (`model_max_prompt_tokens_exceeded`). If you must use it, fetch **one** specific class
> page, for **one** specific question. Prefer step 2 every time.

If a lookup is still large, delegate it to an **Explore subagent** and ask for a short answer
(e.g. "return only the config names and their defaults") so the bulk never enters main context.

## 1. Class system

```js
Ext.define('ClassicApp.view.gallery.GalleryView', {
    extend: 'Ext.Container',          // superclass
    xtype: 'galleryview',             // registers widget.galleryview
    alias: 'widget.galleryview',      // equivalent to xtype
    requires: ['Ext.grid.Panel'],     // hard deps — see §2
    mixins: ['Ext.mixin.Observable'],
    controller: 'galleryviewcontroller',
    viewModel: { type: 'galleryviewmodel' },
    cls: 'galleryview',               // CSS class on the root element
    config: { myThing: null },        // generates getMyThing/setMyThing/updateMyThing
    items: [ /* children */ ]
});
```

- `initComponent: function() { ... this.callParent(arguments); }` — legacy init hook, still valid.
- `config` blocks auto-generate `getX` / `setX` / `applyX` / `updateX`.
- Instantiate by xtype in `items`, or `Ext.create('ClassicApp.view...', {})`.

## 2. `requires` — the #1 silent failure

Sencha Cmd's dependency analyser resolves `extend`/`requires`/`Ext.create('Full.Class.Name')`.
It **cannot** see a class referenced only by an xtype/ftype/ptype **string**.

Always add explicit `requires` for anything used as a string:

```js
requires: [
    'Ext.grid.Panel',
    'Ext.grid.plugin.filterbar.FilterBar',   // plugins: { gridfilterbar: true }
    'Ext.grid.feature.GroupingSummary',      // features: [{ ftype: 'groupingsummary' }]
    'Ext.grid.feature.Summary',
    'Ext.toolbar.Paging',
    'Ext.form.field.Tag',
    'Ext.ux.form.MultiSelect',
    'Ext.window.Window',
    'Ext.window.Toast'
]
```

Symptom when missing: `Ext.create` / xtype errors at runtime, or a silently empty component.

## 3. Package requires (`app.json`)

Packages must be listed by **Sencha package name**, not npm name:

| npm | Sencha name |
|---|---|
| `@sencha/ext-ux` | `ux` |
| `@sencha/ext-calendar` | `calendar` |
| `@sencha/ext-font-awesome` | `font-awesome` |

```json
"requires": ["font-awesome", "ux", "calendar"]
```

## 4. This app's conventions

### ViewPackage pattern
Each view lives in `app/desktop/src/view/<name>/` with:
`<Name>View.js`, `<Name>View.scss`, `<Name>ViewController.js`, `<Name>ViewModel.js`,
optionally `<Name>ViewStore.js`. Classpath is auto-scanned — **no manual registration**.

Minimal real example (`view/personnel/PersonnelView.js`):
```js
Ext.define('ClassicApp.view.personnel.PersonnelView', {
    extend: 'Ext.grid.Panel',
    xtype: 'personnelview',
    cls: 'personnelview',
    controller: 'personnelviewcontroller',
    viewModel: { type: 'personnelviewmodel' },
    store: { type: 'personnelviewstore' },
    columns: [
        { text: 'Name', dataIndex: 'name', width: 100, cell: { userCls: 'bold' } },
        { text: 'Email', dataIndex: 'email', width: 230 }
    ],
    listeners: { select: 'onItemSelected' }
});
```

### Routing / navigation
`resources/desktop/menu.json` drives the left nav **and** routing:
```json
{ "text": "Gallery", "iconCls": "x-fa fa-image", "xtype": "galleryview", "leaf": true }
```
`MainViewController.mainRoute(xtype)` does `store.findNode('xtype', xtype)` then
`centerview.add({ xtype: xtype })`.

> Entries **must** use `"xtype"`. An `"href"` entry will render but **will not route**.

### ViewController
```js
Ext.define('ClassicApp.view.gallery.GalleryViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.galleryviewcontroller',
    onSaveClick: function (btn) { /* `this` = controller; this.getView() */ }
});
```
Wire via `handler: 'onSaveClick'` or `listeners: { click: 'onSaveClick' }` — **string names**
resolve against the controller. Use `this.lookup('someRef')` with `reference: 'someRef'` on children.

## 5. Layouts (pick deliberately — wrong layout = invisible components)

| layout | use |
|---|---|
| `vbox` / `hbox` | flex rows/columns; `align: 'stretch'`, `flex: 1` |
| `fit` | single child fills parent |
| `border` | classic regions: `north/south/east/west/center` |
| `card` | one visible child (tab/wizard); `setActiveItem()` |
| `anchor` | `anchor: '100%'` width-relative |
| `form` | label + field rows |
| `column` | `columnWidth: .5` |
| `auto` (default) | natural flow — **use this for a scrolling gallery page** |

Gotcha: a component with no height inside a `vbox` needs `flex` or an explicit `height`.
For a long scrolling page use `scrollable: true` + default auto layout.

## 6. Stores & models

```js
// inline store — fine for demos
store: {
    fields: ['name', 'status', 'region', { name: 'seats', type: 'int' }],
    data: [ { name: 'Silk Road', status: 'open', region: 'Asia', seats: 4 } ],
    groupField: 'region',
    pageSize: 5
}
```
`Ext.data.Store` configs: `fields`/`model`, `data` or `proxy`, `groupField`, `sorters`,
`filters`, `pageSize`, `autoLoad`. For client-side paging of inline data, use
`proxy: { type: 'memory', enablePaging: true }`.

## 7. Grid — the high-value component

```js
{
    xtype: 'grid',
    title: 'Tours',
    store: myStore,
    columns: [
        { text: 'Tour', dataIndex: 'name', flex: 1, filterType: 'string' },
        { text: 'Status', dataIndex: 'status', width: 120, filterType: 'list' },
        { text: 'Seats', dataIndex: 'seats', width: 90, align: 'right',
          filterType: 'number', summaryType: 'sum' },
        { xtype: 'checkcolumn', text: 'Active', dataIndex: 'active', width: 80 },
        { text: 'Conf', dataIndex: 'conf', width: 90,
          renderer: function (v, meta) { meta.tdCls = 'my-accent-high'; return v; } }
    ],
    selModel: { type: 'checkboxmodel' },
    viewConfig: {
        stripeRows: true,
        getRowClass: function (rec) { return 'status-' + rec.get('status'); }
    },
    features: [
        { ftype: 'groupingsummary', groupHeaderTpl: '{name} ({rows.length})' },
        { ftype: 'summary', dock: 'bottom' }
    ],
    plugins: { gridfilterbar: true },
    tbar: [ { xtype: 'textfield', emptyText: 'Search…' }, '->', { text: 'Add' } ],
    bbar: { xtype: 'pagingtoolbar', displayInfo: true }
}
```

- `'->'` in a toolbar = flexible spacer. `'-'` = separator.
- `renderer(value, metaData, record)` — set `metaData.tdCls` for per-cell classes.
- `summaryType`: `'sum' | 'count' | 'min' | 'max' | 'average'`, or a function.
- Grouping requires `groupField` on the store.

### FilterBar — verified details (easy to get wrong)
- Plugin alias is **`gridfilterbar`**, *not* `filterbar`. Class:
  `Ext.grid.plugin.filterbar.FilterBar`, which extends `Ext.grid.plugin.BaseFilterBar`
  (the base lives in **ext-core**, not ext-classic).
- Its only meaningful config is `hidden: true|false`.
- Columns declare filters with **`filterType`**, *not* `filter`:
  `filterType: 'string'` or `filterType: { type: 'string', value: 'star', fieldDefaults: {} }`
- Filter types: `string`, `number`, `date`, `boolean`, `list`, `inlist`, `none`
  (aliases `grid.filterbar.<type>`).
- Some column types imply one via `defaultFilterType` (`numbercolumn`→number,
  `datecolumn`→date, `checkcolumn`/`booleancolumn`→boolean).
- CSS hooks: `.x-grid-filterbar`, `.x-grid-filterbar-filtered-column`.

## 8. Forms — label beside field (this app's house style)

```js
{
    xtype: 'form',
    defaults: { labelAlign: 'left', labelWidth: 110, anchor: '100%', margin: '0 0 8 0' },
    items: [
        { xtype: 'textfield',   fieldLabel: 'Tour name' },
        { xtype: 'combobox',    fieldLabel: 'Status', queryMode: 'local',
          displayField: 'text', valueField: 'value', store: {...} },
        { xtype: 'checkboxfield', fieldLabel: 'Confirmed', boxLabel: '' },
        { xtype: 'textareafield', fieldLabel: 'Notes' }
    ]
}
```

- `labelAlign`: `'left' | 'top' | 'right'`. **Never use `'top'` here** — house style is beside.
- A shared `labelWidth` is what aligns all controls on one x.
- `fieldLabel` renders the label; `boxLabel` is text *after* a checkbox/radio.
- Validation: `allowBlank: false`, `field.markInvalid('msg')`, `field.isValid()`.

Field xtypes: `textfield`, `textareafield`, `numberfield`, `combobox`, `tagfield`,
`datefield`, `timefield`, `checkboxfield`, `radiofield`, `sliderfield`, `filefield`,
`hiddenfield`, `displayfield`.

Containers: `fieldset` (has `title`, `collapsible`), `radiogroup`, `checkboxgroup`
(both take `columns: n`), `fieldcontainer` (`layout: 'hbox'` for side-by-side fields).

## 9. Windows, message boxes, toasts

```js
Ext.create('Ext.window.Window', {
    title: 'Edit tour',
    width: 420,
    closable: true, maximizable: true, minimizable: true,
    modal: false,
    layout: 'fit',
    items: [ { xtype: 'form', ... } ],
    bbar: ['->', { text: 'Close', handler: function (b) { b.up('window').close(); } },
                 { text: 'Save', ui: 'confirm' }]
}).show();

Ext.Msg.confirm('Confirm', 'Delete this tour?', function (btn) {});
Ext.Msg.alert('Done', 'Saved.');

Ext.toast({
    html: 'Tour saved',
    title: 'Success',
    iconCls: 'x-fa fa-check',
    align: 'tr',            // tr | br | bl | tl | t | b | l | r
    autoClose: false        // keep on screen (needed for screenshots)
    // autoCloseDelay: 4000
});
```

## 10. Icons (FontAwesome 7 Free)

`iconCls: 'x-fa fa-home'`. Used on buttons, menu items, tree nodes, tabs, columns.
The theme's `$font-icon-font-family` currently points at Material Icons in stock Material —
this app uses FA. Available: solid (`fa-`), regular (outline), brands.

## 11. Theme SCSS (`packages/local/theme-react-shadcn`)

- `sass/var/*.scss` — variable overrides. Use `dynamic()`: `$base-color: dynamic(#171717);`
- `sass/src/*.scss` — emitted CSS rules.
- `sass/etc/*.scss` — mixins/functions.

> **TRAP:** a file in `sass/src/` is only compiled if its **filename maps to a class in the
> build**. `DarkMode.scss` → maps to nothing → compiles to *nothing*, silently, no error.
> Put global rules in `sass/src/Component.scss` (→ `Ext.Component`, always present).

- `app.json` sets `"fashion": { "missingParameters": "error" }` — an unknown SCSS variable is a
  **hard build failure**.
- Dark mode: this app uses a `.dark-mode` body class (`Ext.getBody().addCls('dark-mode')`) with
  class-scoped SCSS. ExtJS 8 does **not** provide this class — it is ours.
- `$prefix` is `x-`, so write `.#{$prefix}panel-body`.

## 12. Dev loop

- `npm run dev` serves `http://localhost:1962` (usually already running).
- webpack-dev-server **hot-rebuilds on `.js`/`.scss` save (~10s)**. No restart needed, even
  after editing `app.json`.
- Build errors appear in the dev-server terminal.

> **TRAP:** never use Playwright `waitUntil: 'networkidle'` against `localhost:1962` — the
> dev-server websocket never settles, the call hangs and wedges the tab. Use a plain reload plus
> a fixed wait, then verify with `getComputedStyle` on a real element.
> `document.styleSheets` rule enumeration also under-reports Fashion-injected CSS.

Runtime introspection from the browser:
```js
Ext.getVersion().version
Ext.ComponentQuery.query('grid')[0].getStore().getCount()
Ext.ComponentQuery.query('galleryview')[0].items.items.map(c => c.itemId)
```
