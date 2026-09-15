/**
 * @class ppa.react.ReSidebar
 * @extends Ext.panel.Panel
 *
 * The app-shell nav rail surface — separated from the content area by a
 * hairline (`box-shadow`), not an elevation shadow. A consumer view extends
 * this directly (see `NavView`).
 *
 *     @example
 *     Ext.define('MyApp.view.main.nav.NavView', {
 *         extend: 'ppa.react.ReSidebar',
 *         xtype: 'navview',
 *         layout: 'fit',
 *         tbar: { xtype: 'residebarheader' },
 *         items: [{ xtype: 'renavtree' }],
 *         bbar: { xtype: 'residebarfooter' }
 *     });
 *
 * ## Styling
 * Emits `re-sidebar`. Reads `--re-sidebar-border`.
 */
Ext.define('ppa.react.ReSidebar', {
    extend: 'Ext.panel.Panel',
    xtype: 'residebar',

    requires: ['ppa.react.Tokens'],

    cls: 're-sidebar',
    header: false,
    border: false
});
