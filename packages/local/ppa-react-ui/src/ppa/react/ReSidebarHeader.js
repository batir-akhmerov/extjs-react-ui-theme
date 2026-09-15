/**
 * @class ppa.react.ReSidebarHeader
 * @extends Ext.container.Container
 *
 * The sidebar's header/avatar strip surface. Owns only the chrome (colours);
 * a consumer view supplies its own content, typically a {@link ppa.react.ReAvatar}
 * plus a caption. See `TopView` for the app's usage.
 *
 *     @example
 *     Ext.define('MyApp.view.main.nav.top.TopView', {
 *         extend: 'ppa.react.ReSidebarHeader',
 *         xtype: 'topview',
 *         items: [
 *             { xtype: 'reavatar', src: 'resources/desktop/5.jpg' },
 *             { xtype: 'component', html: 'Welcome John Smith' }
 *         ]
 *     });
 *
 * ## Styling
 * Emits `re-sidebar-header`. Reads `--re-sidebar`, `--re-sidebar-fg`.
 */
Ext.define('ppa.react.ReSidebarHeader', {
    extend: 'Ext.container.Container',
    xtype: 'residebarheader',

    requires: ['ppa.react.Tokens'],

    cls: 're-sidebar-header'
});
