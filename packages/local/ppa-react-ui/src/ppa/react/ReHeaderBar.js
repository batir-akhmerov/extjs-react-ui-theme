/**
 * @class ppa.react.ReHeaderBar
 * @extends Ext.toolbar.Toolbar
 *
 * The app-shell top header bar — a flat toolbar with a hairline bottom
 * border, no elevation shadow, and an 18px/600 title. A consumer view
 * extends this directly (see `HeaderView`).
 *
 *     @example
 *     Ext.define('MyApp.view.main.header.HeaderView', {
 *         extend: 'ppa.react.ReHeaderBar',
 *         xtype: 'headerview',
 *         height: 50,
 *         items: [
 *             { xtype: 'reiconbutton', iconCls: 'x-fa fa-navicon' },
 *             { xtype: 'component', bind: { html: '{heading}' } },
 *             '->'
 *         ]
 *     });
 *
 * ## Styling
 * Emits `re-header-bar`. Reads `--re-surface`, `--re-fg`, `--re-sidebar-border`.
 */
Ext.define('ppa.react.ReHeaderBar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'reheaderbar',

    requires: ['ppa.react.Tokens'],

    cls: 're-header-bar'
});
