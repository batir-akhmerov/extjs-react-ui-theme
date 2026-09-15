/**
 * @class ppa.react.ReAvatar
 * @extends Ext.Component
 *
 * A circular initials/photo avatar, an Avatar component equivalent. Ext
 * JS ships no avatar component; this fills that gap for user/agent chips in
 * headers, sidebars and grids.
 *
 *     @example
 *     { xtype: 'reavatar', initials: 'JS' }
 *
 *     // Photo avatar, small scale (used by ReSidebarHeader):
 *     { xtype: 'reavatar', src: 'resources/desktop/5.jpg', scale: 'small' }
 *
 * ## Styling
 * Emits `re-avatar` plus `re-avatar-small` or `re-avatar-medium`. Reads
 * `--re-muted(-fg)` and, for the photo variant, `--re-sidebar-border`.
 *
 * @cfg {String} [initials] Text shown when no `src` is set. Not HTML-escaped
 * beyond `Ext.String.htmlEncode`.
 * @cfg {String} [src] Image URL. When set, renders an `<img>` instead of
 * `initials`.
 * @cfg {'small'/'medium'} [scale='medium'] `small` is 24px, `medium` 32px.
 */
Ext.define('ppa.react.ReAvatar', {
    extend: 'Ext.Component',
    xtype: 'reavatar',

    requires: ['ppa.react.Tokens'],

    baseCls: 're-avatar',

    // See ppa.react.ReBadge for why this neutralizes Ext.Component's
    // automatic baseCls+'-'+ui suffix class.
    ui: '',

    config: {
        initials: null,
        src: null,
        scale: 'medium'
    },

    initComponent: function () {
        var me = this;

        me.callParent();
        me.setHtml(me.buildHtml());
        me.syncScaleCls();
    },

    buildHtml: function () {
        var me = this,
            src = me.getSrc();

        if (src) {
            return '<img class="re-avatar-img" src="' + Ext.String.htmlEncode(src) + '" alt="" />';
        }

        return Ext.String.htmlEncode(me.getInitials() || '');
    },

    updateSrc: function () {
        this.syncHtml();
    },

    updateInitials: function () {
        this.syncHtml();
    },

    updateScale: function () {
        this.syncScaleCls();
    },

    syncHtml: function () {
        var me = this;

        me.setHtml(me.buildHtml());
    },

    syncScaleCls: function () {
        var me = this,
            cls = 're-avatar-' + (me.getScale() === 'small' ? 'small' : 'medium');

        if (me._appliedScaleCls && me._appliedScaleCls !== cls) {
            me.removeCls(me._appliedScaleCls);
        }

        me._appliedScaleCls = cls;
        me.addCls(cls);
    }
});
