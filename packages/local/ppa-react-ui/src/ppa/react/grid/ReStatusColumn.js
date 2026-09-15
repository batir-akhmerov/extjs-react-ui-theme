/**
 * @class ppa.react.grid.ReStatusColumn
 * @extends Ext.grid.column.Column
 *
 * A grid column that renders {@link ppa.react.ReBadge#renderStatus} by
 * default, so grids stop carrying inline renderer HTML for a status badge
 * column.
 *
 *     @example
 *     { text: 'Status', dataIndex: 'status', xtype: 'restatuscolumn', width: 140 }
 *
 * ## Styling
 * Delegates entirely to `ppa.react.ReBadge` — see that class's Styling note.
 */
Ext.define('ppa.react.grid.ReStatusColumn', {
    extend: 'Ext.grid.column.Column',
    xtype: 'restatuscolumn',
    alias: 'widget.restatuscolumn',

    requires: ['ppa.react.ReBadge'],

    renderer: function (value) {
        return ppa.react.ReBadge.renderStatus(value);
    }
});
