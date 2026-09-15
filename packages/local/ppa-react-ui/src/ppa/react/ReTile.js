/**
 * @class ppa.react.ReTile
 * @extends Ext.panel.Panel
 *
 * A small stat card — icon chip, label and value — equivalent to the React
 * gallery's `<StatTile>`. Ext JS ships nothing like it, so this wraps a plain
 * panel body with a fixed `Ext.XTemplate` layout instead of requiring every
 * caller to hand-write markup.
 *
 *     @example
 *     {
 *         xtype: 'retile',
 *         tileIconCls: 'x-fa fa-bell',
 *         label: 'Open',
 *         value: 128
 *     }
 *
 *     // With an edge accent tied to the status ramp:
 *     {
 *         xtype: 'retile',
 *         tileIconCls: 'x-fa fa-triangle-exclamation',
 *         label: 'Failed', value: 3,
 *         accent: 'right', status: 'send-failed'
 *     }
 *
 * ## Styling
 * Emits `re-tile`, `re-tile-accent-<left|top|right>` and
 * `re-tile-status-<name>` on the root, plus `re-tile-icon`, `re-tile-label`,
 * `re-tile-value` on the template parts. Reads `--re-card-ring`,
 * `--re-radius-xl`, `--re-radius-lg`, `--re-muted(-fg)` and the
 * `--re-status-*` ramp.
 *
 * @cfg {String} [tileIconCls] Icon class for the chip, e.g. `'x-fa fa-bell'`.
 * @cfg {String} [label] The small caption under the value.
 * @cfg {Number/String} [value] The large headline figure.
 * @cfg {'left'/'top'/'right'} [accent] Which edge gets a status accent bar.
 * @cfg {String} [status] A name from the status ramp (see
 * {@link ppa.react.ReStatus}); tints the accent bar and the icon chip.
 */
Ext.define('ppa.react.ReTile', {
    extend: 'Ext.panel.Panel',
    xtype: 'retile',

    requires: [
        'ppa.react.Tokens',
        'ppa.react.ReStatus'
    ],

    cls: 're-tile',

    width: 180,
    height: 84,
    bodyPadding: 16,
    border: false,
    header: false,

    config: {
        tileIconCls: null,
        label: null,
        value: null,
        accent: null,
        status: null
    },

    // Mirrors the markup previously produced by GalleryView's statTile() helper.
    tpl: [
        '<div class="re-tile-inner">',
        '<tpl if="tileIconCls">',
        '<span class="re-tile-icon"><span class="{tileIconCls}"></span></span>',
        '</tpl>',
        '<span class="re-tile-text">',
        '<span class="re-tile-label">{label}</span>',
        '<span class="re-tile-value">{value}</span>',
        '</span>',
        '</div>'
    ],

    initComponent: function () {
        var me = this;

        me.data = me.buildData();
        me.callParent();
        me.syncAccentCls();
    },

    buildData: function () {
        var me = this;

        return {
            tileIconCls: me.getTileIconCls() || '',
            label: Ext.String.htmlEncode(me.getLabel() || ''),
            value: Ext.String.htmlEncode(me.getValue() != null ? String(me.getValue()) : '')
        };
    },

    updateTileIconCls: function () {
        this.syncData();
    },

    updateLabel: function () {
        this.syncData();
    },

    updateValue: function () {
        this.syncData();
    },

    updateAccent: function () {
        this.syncAccentCls();
    },

    updateStatus: function () {
        this.syncAccentCls();
    },

    syncData: function () {
        var me = this;

        if (me.rendered) {
            me.update(me.buildData());
        }
    },

    syncAccentCls: function () {
        var me = this,
            accent = me.getAccent(),
            status = me.getStatus(),
            cls = [];

        if (me._appliedAccentCls) {
            me.removeCls(me._appliedAccentCls);
            me._appliedAccentCls = null;
        }

        if (accent) {
            cls.push('re-tile-accent-' + accent);
        }

        if (status) {
            cls.push('re-tile-status-' + status);
        }

        if (cls.length) {
            me._appliedAccentCls = cls;
            me.addCls(cls);
        }
    }
});
