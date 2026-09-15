/**
 * @class ppa.react.ReIconButton
 * @extends Ext.button.Button
 *
 * A borderless, icon-only button with a muted glyph and an accent hover
 * state — a ghost icon-button variant equivalent.
 * Used throughout the app-shell chrome (header bar, sidebar footer, status
 * bar) in place of one-off `ui` variants.
 *
 *     @example
 *     { xtype: 'reiconbutton', iconCls: 'x-fa fa-bell', tooltip: 'Notifications' }
 *
 * ## Styling
 * Never overrides `baseCls` (still a real `Ext.button.Button`); adds
 * `re-icon-button`. Reads `--re-muted-fg`, `--re-accent(-fg)`, `--re-radius-md`.
 *
 * @cfg {String} iconCls
 * @inheritdoc Ext.button.Button#cfg-iconCls
 */
Ext.define('ppa.react.ReIconButton', {
    extend: 'Ext.button.Button',
    xtype: 'reiconbutton',

    requires: ['ppa.react.Tokens'],

    cls: 're-icon-button'
});
