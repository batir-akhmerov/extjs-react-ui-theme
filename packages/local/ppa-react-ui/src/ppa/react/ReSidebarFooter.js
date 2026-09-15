/**
 * @class ppa.react.ReSidebarFooter
 * @extends Ext.toolbar.Toolbar
 *
 * The sidebar's footer toolbar strip (icon buttons docked below the nav
 * tree). See `BottomView` for the app's usage.
 *
 *     @example
 *     Ext.define('MyApp.view.main.nav.bottom.BottomView', {
 *         extend: 'ppa.react.ReSidebarFooter',
 *         xtype: 'bottomview',
 *         items: [{ xtype: 'reiconbutton', iconCls: 'x-fa fa-calendar' }]
 *     });
 *
 * ## Styling
 * Emits `re-sidebar-footer`. Reads `--re-sidebar`, `--re-sidebar-fg`,
 * `--re-sidebar-border`.
 */
Ext.define('ppa.react.ReSidebarFooter', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'residebarfooter',

    requires: ['ppa.react.Tokens'],

    cls: 're-sidebar-footer'
});
