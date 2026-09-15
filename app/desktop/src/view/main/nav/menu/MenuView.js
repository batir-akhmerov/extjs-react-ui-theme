Ext.define('ClassicApp.view.nav.menu.MenuView', {
	extend: 'ppa.react.ReNavTree',
	xtype: 'menuview',
	bind: { 
		store: '{menu}',
		micro: '{navCollapsed}' 
	},
	listeners: {
		selectionchange: 'onMenuViewSelectionChange'
	},
});
