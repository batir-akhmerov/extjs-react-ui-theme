Ext.define('ClassicApp.view.main.nav.top.TopView', {
  extend: 'ppa.react.ReSidebarHeader',
  requires: ['ppa.react.ReAvatar'],
  xtype: 'topview',
  layout: { type: 'vbox', align: 'center' },
  items: [
    {
      xtype: 'reavatar',
      itemId: 'topAvatar',
      id: 'topAvatar',
      margin: '15 0 0 0',
      src: 'resources/desktop/5.jpg',
      width: 100,
      height: 100
    },
    {
      xtype: 'component',
      data: { caption: 'Welcome John Smith' },
      reference: 'topPic',
      id: 'topPic',
      tpl: new Ext.XTemplate(
        '<div style="text-align:center;padding:15px 5px 15px 5px;">{caption}</div>'
      )
    }
  ]
});
