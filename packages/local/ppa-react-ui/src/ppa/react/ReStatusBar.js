/**
 * @class ppa.react.ReStatusBar
 * @extends Ext.panel.Panel
 *
 * A flat status/footer bar with a titled header used as a version/status
 * strip, e.g. this app's `FooterView`. Cancels the panel "card" ring/radius
 * a titled panel would otherwise pick up.
 *
 *     @example
 *     Ext.define('MyApp.view.main.footer.FooterView', {
 *         extend: 'ppa.react.ReStatusBar',
 *         xtype: 'footerview',
 *         title: 'My App v1.0'
 *     });
 *
 * ## Styling
 * Emits `re-status-bar`. Reads `--re-sidebar`, `--re-sidebar-fg`,
 * `--re-sidebar-border`.
 */
Ext.define('ppa.react.ReStatusBar', {
    extend: 'Ext.panel.Panel',
    xtype: 'restatusbar',

    requires: ['ppa.react.Tokens'],

    cls: 're-status-bar'
});
