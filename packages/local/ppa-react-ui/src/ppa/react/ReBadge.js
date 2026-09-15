/**
 * @class ppa.react.ReBadge
 * @extends Ext.Component
 *
 * A small pill-shaped label, a Badge component equivalent. Ext JS ships
 * no badge component, so this fills that gap for status pills, counts and
 * inline tags.
 *
 * Use `variant` for the generic visual weights and `status` for a value from
 * the status ramp (see {@link ppa.react.ReStatus}). The two are mutually
 * exclusive — setting `status` takes priority over `variant`.
 *
 *     @example
 *     {
 *         xtype: 'rebadge',
 *         text: 'Verified',
 *         iconCls: 'x-fa fa-check',
 *         variant: 'secondary'
 *     }
 *
 *     // A status badge, driven by the shared status vocabulary:
 *     { xtype: 'rebadge', text: 'Escalated', status: 'escalated' }
 *
 *     // In a grid column, use the static renderer directly:
 *     { text: 'Status', dataIndex: 'status', renderer: ppa.react.ReBadge.renderStatus }
 *
 * ## Styling
 * Emits `re-badge` plus `re-badge-<variant>` (`default` | `secondary` |
 * `destructive` | `outline` | `ghost`) or `re-badge-status-<status>`.
 * Reads `--re-primary(-fg)`, `--re-secondary(-fg)`, `--re-destructive`,
 * `--re-border`, `--re-fg`, `--re-font-size` and the `--re-status-*-fg`/`-bg`
 * ramp.
 *
 * @cfg {String} [text] The badge label. HTML-encoded before rendering.
 * @cfg {String} [iconCls] Optional leading icon class, e.g. `'x-fa fa-check'`.
 * @cfg {'default'/'secondary'/'destructive'/'outline'/'ghost'} [variant='default']
 * The generic visual weight. Ignored when `status` is set.
 * @cfg {String} [status] A name from the status ramp (see
 * {@link ppa.react.ReStatus#statuses}). Overrides `variant` when set.
 */
Ext.define('ppa.react.ReBadge', {
    extend: 'Ext.Component',
    xtype: 'rebadge',

    requires: [
        'ppa.react.Tokens',
        'ppa.react.ReStatus'
    ],

    baseCls: 're-badge',

    // Ext.Component always appends `baseCls + '-' + ui` (default ui is
    // 'default'), which would collide with our own `re-badge-default`
    // variant class and leak its background/colour into every other
    // variant. Neutralize it — variant/status classes are applied by hand
    // in updateVariant/updateStatus below.
    ui: '',

    config: {
        text: null,
        iconCls: null,
        variant: 'default',
        status: null
    },

    statics: {
        /**
         * Grid column / plain renderer that produces a status badge from a
         * raw status value. HTML-encodes the value.
         * @param {String} value
         * @return {String}
         */
        renderStatus: function (value) {
            return '<span class="' + ppa.react.ReStatus.getBadgeCls(value) + '">' +
                Ext.String.htmlEncode(value) + '</span>';
        }
    },

    initComponent: function () {
        var me = this;

        me.callParent();
        // Config updater methods below already ran during initConfig() (before
        // this point), but they no-op until the component is rendered — do
        // the initial paint here now that config values are final.
        me.html = me.buildHtml();
        me.syncVariantCls();
    },

    buildHtml: function () {
        var me = this,
            iconCls = me.getIconCls(),
            html = '';

        if (iconCls) {
            html += '<span class="re-badge-icon ' + Ext.String.htmlEncode(iconCls) + '"></span>';
        }

        html += '<span class="re-badge-text">' + Ext.String.htmlEncode(me.getText() || '') + '</span>';

        return html;
    },

    updateText: function () {
        this.syncHtml();
    },

    updateIconCls: function () {
        this.syncHtml();
    },

    updateVariant: function () {
        this.syncVariantCls();
    },

    updateStatus: function () {
        this.syncVariantCls();
    },

    syncHtml: function () {
        var me = this;

        if (me.rendered) {
            me.setHtml(me.buildHtml());
        }
    },

    syncVariantCls: function () {
        var me = this,
            status = me.getStatus(),
            variant = me.getVariant(),
            cls = status ? 're-badge-status-' + status : 're-badge-' + (variant || 'default');

        if (me._appliedVariantCls && me._appliedVariantCls !== cls) {
            me.removeCls(me._appliedVariantCls);
        }

        me._appliedVariantCls = cls;
        me.addCls(cls);
    }
});
