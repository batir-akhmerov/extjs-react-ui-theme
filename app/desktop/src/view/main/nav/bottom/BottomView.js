Ext.define('ClassicApp.view.main.nav.bottom.BottomView', {
	extend: 'ppa.react.ReSidebarFooter',
	requires: ['ppa.react.ReIconButton'],
	xtype: 'bottomview',
  defaults: {
    xtype: 'reiconbutton',
    handler:'onToolButtonClicked'
  },
	items: [
    {name:'calendar', iconCls:'x-fa fa-calendar', tooltip:'calendar'},
    {name:'bolt',     iconCls:'x-fa fa-bolt',     tooltip:'bolt'},
    {name:'search',   iconCls:'x-fa fa-search',   tooltip:'search'},
	]
});