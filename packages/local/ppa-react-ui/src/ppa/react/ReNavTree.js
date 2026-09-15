/**
 * @class ppa.react.ReNavTree
 * @extends Ext.list.Tree
 *
 * The app-shell nav rail, styled as a `<SidebarMenu>` equivalent. **Keeps
 * `ui: 'nav'`** — that `ui` is not just colour, it also carries the
 * toolstrip/collapsed-rail structure `NavView` depends on; removing it would
 * change behaviour, not just appearance. All colour is added on top, scoped
 * under `re-nav-tree` so it never touches the framework's own unscoped
 * default-`ui` treelist CSS.
 *
 *     @example
 *     Ext.define('MyApp.view.main.nav.menu.MenuView', {
 *         extend: 'ppa.react.ReNavTree',
 *         xtype: 'menuview'
 *     });
 *
 * ## Styling
 * Emits `re-nav-tree`. Reads `--re-sidebar`, `--re-sidebar-fg`,
 * `--re-sidebar-accent(-fg)`, `--re-sidebar-primary`, `--re-sidebar-muted-fg`.
 * The expander glyph is a CSS-drawn chevron (no font dependency); override
 * `--re-nav-expander-glyph` with a `mask-image` to restore a font glyph.
 */
Ext.define('ppa.react.ReNavTree', {
    extend: 'Ext.list.Tree',
    xtype: 'renavtree',

    requires: [
        'ppa.react.Tokens',
        'Ext.list.TreeItem',
        'Ext.data.TreeStore'
    ],

    ui: 'nav',
    cls: 're-nav-tree',
    scrollable: true,
    expanderFirst: false,
    expanderOnly: false
});
