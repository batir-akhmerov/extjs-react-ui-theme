/**
 * @class ppa.react.ReContentArea
 * @extends Ext.Container
 *
 * The main content area background, e.g. this app's `CenterView`. This is a
 * one-declaration wrapper — implemented for completeness (Phase 4, optional
 * per PPA_REACT_UI_PACKAGE_SPEC.md §5.15).
 *
 *     @example
 *     Ext.define('MyApp.view.main.center.CenterView', {
 *         extend: 'ppa.react.ReContentArea',
 *         xtype: 'centerview',
 *         layout: 'card'
 *     });
 *
 * ## Styling
 * Emits `re-content-area`. Reads `--re-surface`.
 */
Ext.define('ppa.react.ReContentArea', {
    extend: 'Ext.container.Container',
    xtype: 'recontentarea',

    requires: ['ppa.react.Tokens'],

    cls: 're-content-area'
});
