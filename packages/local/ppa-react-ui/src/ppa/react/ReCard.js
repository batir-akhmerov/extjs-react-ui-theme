/**
 * @class ppa.react.ReCard
 * @extends Ext.panel.Panel
 *
 * The plain card surface — a borderless, ring-outlined panel with no
 * header chrome by default. Used for simple content surfaces such as this
 * app's home and detail panes, a Card component equivalent.
 *
 *     @example
 *     { xtype: 'recard', html: 'Welcome!' }
 *
 *     // A consumer view extends it directly:
 *     Ext.define('MyApp.view.home.HomeView', {
 *         extend: 'ppa.react.ReCard',
 *         xtype: 'homeview'
 *     });
 *
 * ## Styling
 * Emits `re-card`. Reads `--re-card`, `--re-card-fg`, `--re-card-ring`,
 * `--re-radius-xl`.
 */
Ext.define('ppa.react.ReCard', {
    extend: 'Ext.panel.Panel',
    xtype: 'recard',

    requires: ['ppa.react.Tokens'],

    cls: 're-card',

    header: false,
    border: false,
    bodyPadding: 15
});
