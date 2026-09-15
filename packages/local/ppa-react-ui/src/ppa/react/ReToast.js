/**
 * @class ppa.react.ReToast
 * @extends Ext.window.Toast
 *
 * A typed toast notification — success/error/warning/info/plain — equivalent
 * to sonner's typed toasts in the React app. `Ext.window.Toast` already gives
 * the auto-dismiss popup; this adds the per-type header icon colour and a
 * consistent title size, keyed off `toastType` instead of one-off inline
 * `cls`/`iconCls` at every call site.
 *
 *     @example
 *     ppa.react.ReToast.show({
 *         toastType: 'success',
 *         title: 'Success',
 *         html: 'Tour saved'
 *     });
 *
 * ## Styling
 * Emits `re-toast` (in addition to, never replacing, the base `x-toast`
 * class) plus `re-toast-<type>`. Reads `--re-muted-fg` and this class's own
 * literal per-type header-icon colours (success/error/warning/info are not
 * part of the shared token ramp — they mirror sonner's `richColors` palette).
 *
 * @cfg {'success'/'error'/'warning'/'info'/'plain'} [toastType='plain']
 * Selects the header icon (via `statics.iconClsByType`, unless `iconCls` is
 * explicitly set) and the header icon colour.
 */
Ext.define('ppa.react.ReToast', {
    extend: 'Ext.window.Toast',
    xtype: 'retoast',

    requires: ['ppa.react.Tokens'],

    config: {
        toastType: 'plain'
    },

    statics: {
        /**
         * Default icon class per `toastType`. Replace wholesale to change the
         * icon set — the package has no hard FontAwesome dependency, only
         * this default map does.
         */
        iconClsByType: {
            success: 'x-fa fa-check',
            error: 'x-fa fa-xmark',
            warning: 'x-fa fa-triangle-exclamation',
            info: 'x-fa fa-circle-info',
            plain: 'x-fa fa-comment'
        },

        /**
         * Creates and shows a `ReToast`.
         * @param {Object} cfg Standard `Ext.window.Toast` config plus `toastType`.
         * @return {ppa.react.ReToast}
         */
        show: function (cfg) {
            var toast = Ext.create('ppa.react.ReToast', cfg);

            toast.show();

            return toast;
        }
    },

    initComponent: function () {
        var me = this,
            type = me.getToastType();

        if (!me.iconCls) {
            me.iconCls = ppa.react.ReToast.iconClsByType[type] || ppa.react.ReToast.iconClsByType.plain;
        }

        me.callParent();

        // Append to (never replace) the inherited 'x-toast' class — declaring
        // `cls` directly in Ext.define would shadow the base class's own
        // `cls: 'x-toast'` default via prototype inheritance.
        me.addCls('re-toast');
        me.syncTypeCls();
    },

    updateToastType: function () {
        this.syncTypeCls();
    },

    syncTypeCls: function () {
        var me = this,
            cls = 're-toast-' + me.getToastType();

        if (me._appliedTypeCls && me._appliedTypeCls !== cls) {
            me.removeCls(me._appliedTypeCls);
        }

        me._appliedTypeCls = cls;
        me.addCls(cls);
    }
});
