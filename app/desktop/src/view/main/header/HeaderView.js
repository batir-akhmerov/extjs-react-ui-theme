Ext.define('ClassicApp.view.main.header.HeaderView', {
  extend: 'ppa.react.ReHeaderBar',
  requires: ['ppa.react.ReIconButton'],
  height: 50,
  xtype: 'headerview',
  defaults: {
    xtype: 'reiconbutton',
    handler:'onToolButtonClicked'
  },
  items: [
    {
      xtype: 'reiconbutton',
      reference: 'navtoggle',
      handler: 'onHeaderViewNavToggle',
      iconCls: 'x-fa fa-navicon'
    },
    {
      xtype: 'component',
      bind: {html: '{heading}'},
    },
    '->',
    '->',
    {
      xtype: 'reiconbutton',
      reference: 'darkmodetoggle',
      iconCls: 'x-fa fa-moon',
      tooltip: 'toggle dark mode',
      enableToggle: true,
      handler: 'onHeaderViewDarkModeToggle'
    },
    {name:'calendar', iconCls:'x-fa fa-calendar', tooltip:'calendar'},
    {name:'bolt',     iconCls:'x-fa fa-bolt',     tooltip:'bolt'},
    {name:'search',   iconCls:'x-fa fa-search',   tooltip:'search'},
    {
      xtype: 'reiconbutton',
      reference: 'detailtoggle',
      iconCls:'x-fa fa-arrow-left',
      tooltip: 'show and hide detail view',
      handler: 'onHeaderViewDetailToggle'
    }
  ]
});
