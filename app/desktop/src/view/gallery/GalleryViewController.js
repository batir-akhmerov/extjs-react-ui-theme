Ext.define('ClassicApp.view.gallery.GalleryViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.galleryviewcontroller',

    requires: ['ppa.react.ReToast'],

    onFocusFieldAfterRender: function (field) {
        Ext.defer(function () {
            if (!field.isDestroyed) {
                field.focus();
            }
        }, 300);
    },

    onInvalidFieldAfterRender: function (field) {
        field.markInvalid('This field is required');
    },

    onTooltipButtonAfterRender: function (btn) {
        Ext.create('Ext.tip.ToolTip', {
            target: btn.getEl(),
            html: 'This is an Ext.tip.ToolTip',
            anchor: 'top'
        });
    },

    onOpenStandardWindow: function () {
        Ext.create('Ext.window.Window', {
            title: 'Edit tour',
            width: 420,
            modal: false,
            closable: true,
            maximizable: true,
            minimizable: true,
            layout: 'form',
            bodyPadding: 12,
            defaults: { anchor: '100%', labelAlign: 'left', labelWidth: 100 },
            items: [
                { xtype: 'textfield', fieldLabel: 'Tour name', value: 'Silk Road 19d' },
                { xtype: 'textareafield', fieldLabel: 'Notes', height: 80 }
            ],
            bbar: ['->',
                { text: 'Close', handler: function (b) { b.up('window').close(); } },
                { text: 'Save', ui: 'confirm' }
            ]
        }).show();
    },

    onOpenTbarWindow: function () {
        Ext.create('Ext.window.Window', {
            title: 'Window with toolbar',
            width: 420,
            modal: false,
            closable: true,
            maximizable: true,
            minimizable: true,
            tbar: [
                { iconCls: 'x-fa fa-bold' },
                { iconCls: 'x-fa fa-italic' },
                { iconCls: 'x-fa fa-underline' }
            ],
            html: '<div style="padding:12px">Toolbar window body</div>',
            bbar: ['->',
                { text: 'Close', handler: function (b) { b.up('window').close(); } },
                { text: 'Save', ui: 'confirm' }
            ]
        }).show();
    },

    onOpenMaximizedWindow: function () {
        Ext.create('Ext.window.Window', {
            title: 'Maximized window',
            modal: false,
            closable: true,
            maximizable: true,
            minimizable: true,
            maximized: true,
            html: '<div style="padding:12px">Opens maximized.</div>'
        }).show();
    },

    onShowConfirm: function () {
        Ext.Msg.confirm('Confirm', 'Delete this tour?', Ext.emptyFn);
    },

    onShowAlert: function () {
        Ext.Msg.alert('Done', 'Saved.');
    },

    onToastButtonClick: function (btn) {
        var type = btn.toastType || 'plain';

        ppa.react.ReToast.show({
            html: Ext.String.capitalize(type) + ' toast message',
            title: Ext.String.capitalize(type),
            toastType: type,
            align: btn.toastAlign || 'tr',
            autoClose: !btn.toastPersistent,
            autoCloseDelay: btn.toastAutoCloseDelay || 3000
        });
    },

    onProgressToastClick: function () {
        ppa.react.ReToast.show({
            title: 'Uploading',
            toastType: 'plain',
            align: 'br',
            autoClose: false,
            items: [{ xtype: 'progressbar', value: 0.6, text: '60%' }]
        });
    },

    onToggleLoadMask: function () {
        var panel = this.getView().down('#gallery-loadmask-target');

        if (panel.loadMask && panel.loadMask.isVisible()) {
            panel.setLoading(false);
        }
        else {
            panel.setLoading('Loading…');
        }
    }
});
