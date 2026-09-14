Ext.define('ClassicApp.view.gallery.GalleryView', {
    extend: 'Ext.Container',
    xtype: 'galleryview',
    cls: 'galleryview',
    controller: 'galleryviewcontroller',
    scrollable: true,

    // Anything referenced only by an xtype/ftype/ptype string must be listed here or
    // Sencha Cmd's dependency analyser will not include it.
    requires: [
        'Ext.grid.Panel',
        'Ext.grid.plugin.filterbar.FilterBar',
        'Ext.grid.feature.GroupingSummary',
        'Ext.grid.feature.Summary',
        'Ext.grid.column.Check',
        'Ext.selection.CheckboxModel',
        'Ext.toolbar.Paging',
        'Ext.data.Store',
        'Ext.form.field.Text',
        'Ext.form.field.ComboBox',

        'Ext.form.field.TextArea',
        'Ext.form.field.Number',
        'Ext.form.field.Date',
        'Ext.form.field.Checkbox',
        'Ext.form.field.Radio',
        'Ext.form.field.Tag',
        'Ext.slider.Single',
        'Ext.ux.form.MultiSelect',
        'Ext.ux.form.ItemSelector',
        'Ext.form.RadioGroup',
        'Ext.form.CheckboxGroup',
        'Ext.picker.Date',
        'Ext.calendar.panel.Month',
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Ext.container.ButtonGroup',
        'Ext.button.Split',
        'Ext.button.Segmented',
        'Ext.tab.Panel',
        'Ext.menu.Menu',
        'Ext.menu.CheckItem',
        'Ext.tip.ToolTip',
        'Ext.window.Window',
        'Ext.window.Toast',
        'Ext.ProgressBar',
        'Ext.toolbar.Separator',
        'Ext.list.Tree',
        'Ext.list.TreeItem',
        'Ext.data.TreeStore',
        'Ext.tree.Panel',
        'Ext.tree.Column'
    ],

    items: (function () {
        // Shared inline datasets for the demo fields/combos below.
        var STATUS_ITEMS = [
                { value: 'open', text: 'Open' },
                { value: 'replied', text: 'Replied' },
                { value: 'closed', text: 'Closed' },
                { value: 'escalated', text: 'Escalated' }
            ],
            TAG_ITEMS = [
                { value: 'vip', text: 'VIP' },
                { value: 'repeat', text: 'Repeat' },
                { value: 'group', text: 'Group' },
                { value: 'agent', text: 'Agent' },
                { value: 'newsletter', text: 'Newsletter' }
            ],
            TOUR_ITEMS = [
                { value: 'silkroad', text: 'Silk Road 19d' },
                { value: 'stans', text: '5 Stans Express' },
                { value: 'aurora', text: 'Aurora Trek' },
                { value: 'fjord', text: 'Fjord Explorer' },
                { value: 'lofoten', text: 'Lofoten Circuit' }
            ];

        // Builds a "Normal / Focused / Invalid / Disabled / Read only" row for one field xtype.
        // Deep-clones baseCfg per state so nested configs (e.g. a combobox's store) aren't
        // shared object references across sibling field instances.
        function fieldStatesRow(itemId, baseCfg) {
            function stateCfg(extra) {
                return Ext.apply(Ext.clone(baseCfg), extra);
            }

            return {
                xtype: 'container',
                itemId: itemId,
                cls: 'gallery-row',
                layout: 'hbox',
                defaults: { margin: '0 12 0 0', width: 160, labelAlign: 'top' },
                items: [
                    stateCfg({ fieldLabel: 'Normal' }),
                    stateCfg({ fieldLabel: 'Focused', listeners: { afterrender: 'onFocusFieldAfterRender' } }),
                    stateCfg({ fieldLabel: 'Invalid', listeners: { afterrender: 'onInvalidFieldAfterRender' } }),
                    stateCfg({ fieldLabel: 'Disabled', disabled: true }),
                    stateCfg({ fieldLabel: 'Read only', readOnly: true })
                ]
            };
        }

        // Mirrors the React gallery's <StatTile>: icon chip + 12px label +
        // 24px semibold value on one row.
        function statTile(icon, label, value) {
            return '<div style="display:flex;align-items:center;">' +
                '<span class="gallery-tile-icon"><span class="x-fa ' + icon + '"></span></span>' +
                '<span><span class="gallery-tile-label" style="display:block;">' + label + '</span>' +
                '<span class="gallery-tile-value" style="display:block;">' + value + '</span></span>' +
                '</div>';
        }

        return [
        {
            xtype: 'panel',
            itemId: 'gallery-tokens',
            cls: 'gallery-section',
            title: 'Tokens (native theme surfaces — retokenised in the styling phase)',
            bodyPadding: 16,
            items: [
                {
                    xtype: 'container',
                    itemId: 'row-surfaces',
                    cls: 'gallery-row',
                    layout: 'hbox',
                    defaults: { margin: '0 12 0 0' },
                    items: [
                        // bodyPadding matches the header's 16px inset so body
                        // content starts on the same x as the title.
                        { xtype: 'panel', title: 'Panel', width: 150, height: 90, bodyPadding: 16, html: 'panel body' },
                        { xtype: 'panel', title: 'Framed', frame: true, width: 150, height: 90, bodyPadding: 16, html: 'frame body' },
                        { xtype: 'toolbar', width: 150, items: [{ text: 'Toolbar' }] }
                    ]
                },
                {
                    xtype: 'container',
                    itemId: 'row-emphasis',
                    cls: 'gallery-row',
                    layout: 'hbox',
                    defaults: { margin: '0 12 0 0' },
                    items: [
                        { xtype: 'button', text: 'Primary' },
                        { xtype: 'button', text: 'Secondary', ui: 'default-toolbar' },
                        { xtype: 'button', text: 'Destructive', ui: 'decline' },
                        { xtype: 'displayfield', value: 'Muted text sample', width: 180 }
                    ]
                }
            ]
        },
        {
            xtype: 'panel',
            itemId: 'gallery-buttons',
            cls: 'gallery-section',
            title: 'Buttons',
            bodyPadding: 16,
            items: [
                {
                    xtype: 'container', itemId: 'row-variants', cls: 'gallery-row', layout: 'hbox',
                    defaults: { margin: '0 8 0 0' },
                    items: [
                        { xtype: 'button', text: 'Default' },
                        { xtype: 'button', text: 'Toolbar style', ui: 'default-toolbar' },
                        { xtype: 'button', text: 'Confirm', ui: 'confirm' },
                        { xtype: 'button', text: 'Decline', ui: 'decline' }
                    ]
                },
                {
                    xtype: 'container', itemId: 'row-sizes', cls: 'gallery-row', layout: 'hbox',
                    defaults: { margin: '0 8 0 0' },
                    items: [
                        { xtype: 'button', text: 'Small', scale: 'small' },
                        { xtype: 'button', text: 'Medium', scale: 'medium' },
                        { xtype: 'button', text: 'Large', scale: 'large' }
                    ]
                },
                {
                    xtype: 'container', itemId: 'row-with-icon', cls: 'gallery-row', layout: 'hbox',
                    defaults: { margin: '0 8 0 0' },
                    items: [
                        { xtype: 'button', text: 'New', iconCls: 'x-fa fa-plus', iconAlign: 'left' },
                        { xtype: 'button', text: 'Export', iconCls: 'x-fa fa-download', iconAlign: 'left' }
                    ]
                },
                {
                    xtype: 'container', itemId: 'row-icon-only', cls: 'gallery-row', layout: 'hbox',
                    defaults: { margin: '0 8 0 0' },
                    items: [
                        { xtype: 'button', iconCls: 'x-fa fa-pen', tooltip: 'Edit' },
                        { xtype: 'button', iconCls: 'x-fa fa-copy', tooltip: 'Copy' },
                        { xtype: 'button', iconCls: 'x-fa fa-gear', tooltip: 'Settings' },
                        { xtype: 'button', iconCls: 'x-fa fa-trash', tooltip: 'Delete' }
                    ]
                },
                {
                    xtype: 'container', itemId: 'row-disabled', cls: 'gallery-row', layout: 'hbox',
                    defaults: { margin: '0 8 0 0' },
                    items: [
                        { xtype: 'button', text: 'Default', disabled: true },
                        { xtype: 'button', text: 'Toolbar style', ui: 'default-toolbar', disabled: true }
                    ]
                },
                {
                    xtype: 'container', itemId: 'row-toggle', cls: 'gallery-row', layout: 'hbox',
                    defaults: { margin: '0 8 0 0' },
                    items: [
                        { xtype: 'button', text: 'Pressed', enableToggle: true, pressed: true },
                        { xtype: 'button', text: 'Not pressed', enableToggle: true }
                    ]
                },
                {
                    xtype: 'container', itemId: 'row-split-menu', cls: 'gallery-row', layout: 'hbox',
                    defaults: { margin: '0 8 0 0' },
                    items: [
                        { xtype: 'splitbutton', text: 'Save', menu: [{ text: 'Save as…' }, { text: 'Save a copy' }] },
                        // No iconCls: a button with a menu already renders its own arrow.
                        { xtype: 'button', text: 'Options',
                          menu: [{ text: 'Item one' }, { text: 'Item two' }] }
                    ]
                },
                {
                    xtype: 'buttongroup', itemId: 'row-buttongroup', cls: 'gallery-row', title: 'Formatting', columns: 3,
                    items: [
                        { iconCls: 'x-fa fa-bold' },
                        { iconCls: 'x-fa fa-italic' },
                        { iconCls: 'x-fa fa-underline' }
                    ]
                }
            ]
        },
        {
            xtype: 'panel',
            itemId: 'gallery-badges',
            cls: 'gallery-section',
            title: 'Badges',
            bodyPadding: 16,
            items: [
                {
                    xtype: 'container', itemId: 'row-variants', cls: 'gallery-row', layout: 'hbox',
                    defaults: { margin: '0 8 0 0' },
                    items: [
                        { xtype: 'component', cls: 'gallery-badge gallery-badge-default', html: 'Default' },
                        { xtype: 'component', cls: 'gallery-badge gallery-badge-secondary', html: 'Secondary' },
                        { xtype: 'component', cls: 'gallery-badge gallery-badge-destructive', html: 'Destructive' },
                        { xtype: 'component', cls: 'gallery-badge gallery-badge-outline', html: 'Outline' },
                        { xtype: 'component', cls: 'gallery-badge gallery-badge-ghost', html: 'Ghost' }
                    ]
                },
                {
                    xtype: 'container', itemId: 'row-with-icon', cls: 'gallery-row', layout: 'hbox',
                    defaults: { margin: '0 8 0 0' },
                    items: [
                        { xtype: 'component', cls: 'gallery-badge gallery-badge-secondary', html: '<i class="x-fa fa-check"></i> Verified' },
                        { xtype: 'component', cls: 'gallery-badge gallery-badge-outline', html: '<i class="x-fa fa-bell"></i> 3 new' }
                    ]
                }
            ]
        },
        {
            xtype: 'panel',
            itemId: 'gallery-fields',
            cls: 'gallery-section',
            title: 'Form fields',
            bodyPadding: 16,
            items: [
                fieldStatesRow('row-textfield', { xtype: 'textfield', value: 'Sample text' }),
                fieldStatesRow('row-textareafield', { xtype: 'textareafield', value: 'Multi-line text…', height: 70 }),
                fieldStatesRow('row-numberfield', { xtype: 'numberfield', value: 42 }),
                fieldStatesRow('row-combobox', {
                    xtype: 'combobox', queryMode: 'local', displayField: 'text', valueField: 'value',
                    value: 'open', store: { fields: ['value', 'text'], data: STATUS_ITEMS }
                }),
                fieldStatesRow('row-datefield', { xtype: 'datefield', value: new Date(2027, 4, 1) }),
                fieldStatesRow('row-checkboxfield', { xtype: 'checkboxfield', boxLabel: 'Enabled', checked: true }),
                fieldStatesRow('row-radiofield', { xtype: 'radiofield', boxLabel: 'Selected', name: 'gallery-field-radio-demo', checked: true }),
                fieldStatesRow('row-sliderfield', { xtype: 'sliderfield', value: 40 })
            ]
        },
        {
            xtype: 'panel',
            itemId: 'gallery-fields2',
            cls: 'gallery-section',
            title: 'Form fields (part 2)',
            bodyPadding: 16,
            items: [
                {
                    xtype: 'container', itemId: 'row-toggle-buttons', cls: 'gallery-row', layout: 'hbox',
                    defaults: { margin: '0 8 0 0' },
                    items: [
                        { xtype: 'button', text: 'Pressed', enableToggle: true, pressed: true },
                        { xtype: 'button', text: 'Not pressed', enableToggle: true }
                    ]
                },
                {
                    xtype: 'segmentedbutton', itemId: 'row-segmented-single', cls: 'gallery-row',
                    items: [{ text: 'Day' }, { text: 'Week', pressed: true }, { text: 'Month' }]
                },
                {
                    xtype: 'segmentedbutton', itemId: 'row-segmented-multi', cls: 'gallery-row', allowMultiple: true,
                    items: [{ text: 'Bold', pressed: true }, { text: 'Italic' }, { text: 'Underline', pressed: true }]
                },
                {
                    xtype: 'radiogroup', itemId: 'row-radiogroup-vertical', cls: 'gallery-row',
                    fieldLabel: 'Vertical', labelAlign: 'top', columns: 1,
                    items: [
                        { boxLabel: 'Option A', name: 'gallery-rg-v', inputValue: 'a', checked: true },
                        { boxLabel: 'Option B', name: 'gallery-rg-v', inputValue: 'b' },
                        { boxLabel: 'Option C', name: 'gallery-rg-v', inputValue: 'c' }
                    ]
                },
                {
                    xtype: 'radiogroup', itemId: 'row-radiogroup-horizontal', cls: 'gallery-row',
                    fieldLabel: 'Horizontal', labelAlign: 'top', columns: 3,
                    items: [
                        { boxLabel: 'Option A', name: 'gallery-rg-h', inputValue: 'a', checked: true },
                        { boxLabel: 'Option B', name: 'gallery-rg-h', inputValue: 'b' },
                        { boxLabel: 'Option C', name: 'gallery-rg-h', inputValue: 'c' }
                    ]
                },
                {
                    xtype: 'checkboxgroup', itemId: 'row-checkboxgroup', cls: 'gallery-row',
                    fieldLabel: 'Tags', labelAlign: 'top', columns: 3,
                    items: [
                        { boxLabel: 'VIP', name: 'gallery-cg', inputValue: 'vip', checked: true },
                        { boxLabel: 'Repeat', name: 'gallery-cg', inputValue: 'repeat' },
                        { boxLabel: 'Agent', name: 'gallery-cg', inputValue: 'agent' }
                    ]
                },
                {
                    xtype: 'combobox', itemId: 'row-typeahead-combo', cls: 'gallery-row',
                    fieldLabel: 'Type-ahead', labelAlign: 'top', width: 300,
                    typeAhead: true, queryMode: 'local', displayField: 'text', valueField: 'value',
                    store: { fields: ['value', 'text'], data: STATUS_ITEMS }
                },
                {
                    xtype: 'tagfield', itemId: 'row-tagfield', cls: 'gallery-row',
                    fieldLabel: 'Tag combobox', labelAlign: 'top', width: 400,
                    queryMode: 'local', displayField: 'text', valueField: 'value',
                    store: { fields: ['value', 'text'], data: TAG_ITEMS },
                    value: ['vip', 'repeat']
                },
                {
                    xtype: 'multiselect', itemId: 'row-multiselect', cls: 'gallery-row',
                    fieldLabel: 'Multiselect list', labelAlign: 'top', width: 300, height: 140,
                    displayField: 'text', valueField: 'value',
                    store: { fields: ['value', 'text'], data: TOUR_ITEMS }
                },
                {
                    // Tall enough for all six 24px nav buttons plus their 4px gaps.
                    xtype: 'itemselector', itemId: 'row-itemselector', cls: 'gallery-row',
                    fieldLabel: 'Item selector', labelAlign: 'top', width: 500, height: 220,
                    displayField: 'text', valueField: 'value',
                    store: { fields: ['value', 'text'], data: TOUR_ITEMS },
                    value: ['silkroad']
                },
                {
                    xtype: 'datefield', itemId: 'row-datefield-preset', cls: 'gallery-row',
                    fieldLabel: 'Date picker', labelAlign: 'top', width: 220, value: new Date(2027, 4, 1)
                },
                {
                    xtype: 'datepicker', itemId: 'row-inline-calendar', cls: 'gallery-row',
                    value: new Date(2027, 4, 1)
                },
                {
                    // NOTE: ext-calendar's Events store re-enters loadRange() synchronously when
                    // fed inline event data (memory proxy or nested eventStore data both trigger
                    // a stack overflow in this package version). Render the bare month surface
                    // with no calendar/event records — still demonstrates the component on screen.
                    xtype: 'calendar-month', itemId: 'row-calendar-panel', cls: 'gallery-row',
                    width: 600, height: 400, value: new Date(2027, 4, 1)
                }
            ]
        },
        {
            xtype: 'panel',
            itemId: 'gallery-fieldsets',
            cls: 'gallery-section',
            title: 'Fieldsets (label beside field)',
            bodyPadding: 16,
            items: [
                {
                    xtype: 'form', itemId: 'row-label-left', cls: 'gallery-row', border: false,
                    defaults: { labelAlign: 'left', labelWidth: 110, anchor: '100%', margin: '0 0 8 0' },
                    items: [
                        { xtype: 'textfield', fieldLabel: 'Tour name', value: 'Silk Road 19d' },
                        { xtype: 'combobox', fieldLabel: 'Status', queryMode: 'local', displayField: 'text',
                          valueField: 'value', value: 'open', store: { fields: ['value', 'text'], data: STATUS_ITEMS } },
                        { xtype: 'checkboxfield', fieldLabel: 'Confirmed', boxLabel: '', checked: true },
                        { xtype: 'textareafield', fieldLabel: 'Notes', height: 70 }
                    ]
                },
                {
                    xtype: 'form', itemId: 'row-label-right', cls: 'gallery-row', border: false,
                    defaults: { labelAlign: 'right', labelWidth: 110, anchor: '100%', margin: '0 0 8 0' },
                    items: [
                        { xtype: 'textfield', fieldLabel: 'Agent name', value: 'J. Rivera' },
                        { xtype: 'textfield', fieldLabel: 'Agent email', value: 'agent@example.com' }
                    ]
                },
                {
                    xtype: 'fieldset', itemId: 'row-departure-details', cls: 'gallery-row', title: 'Departure details',
                    defaults: { labelAlign: 'left', labelWidth: 110, anchor: '100%', margin: '0 0 8 0' },
                    items: [
                        { xtype: 'datefield', fieldLabel: 'Departure date', value: new Date(2027, 4, 1) },
                        { xtype: 'numberfield', fieldLabel: 'Seats', value: 4 },
                        { xtype: 'checkboxfield', fieldLabel: 'Confirmed', boxLabel: '', checked: true }
                    ]
                }
            ]
        },
        {
            xtype: 'panel',
            itemId: 'gallery-card',
            cls: 'gallery-section',
            title: 'Card',
            bodyPadding: 16,
            layout: 'hbox',
            defaults: { margin: '0 12 0 0' },
            items: [
                {
                    xtype: 'panel', itemId: 'row-agent-settings', cls: 'gallery-row', width: 320,
                    title: 'Agent settings', bodyPadding: 16,
                    items: [{
                        xtype: 'form', border: false,
                        defaults: { labelAlign: 'left', labelWidth: 100, anchor: '100%', margin: '0 0 8 0' },
                        items: [
                            { xtype: 'textfield', fieldLabel: 'Display name', value: 'Juillet AI' },
                            { xtype: 'checkboxfield', fieldLabel: 'Auto-reply', boxLabel: 'Enabled', checked: true }
                        ]
                    }],
                    bbar: [{ text: 'Save', ui: 'confirm' }, { text: 'Cancel' }]
                },
                {
                    xtype: 'panel', itemId: 'row-statistics', cls: 'gallery-row', width: 220,
                    title: 'Statistics', bodyPadding: 16,
                    html: '<div class="gallery-tile-value">1,284</div>' +
                          '<div class="gallery-tile-label">emails processed</div>'
                }
            ]
        },
        {
            xtype: 'panel',
            itemId: 'gallery-table',
            cls: 'gallery-section',
            title: 'Table',
            items: [
                {
                    xtype: 'grid', itemId: 'row-plain-table', cls: 'gallery-row', height: 200,
                    store: {
                        fields: ['name', 'status', { name: 'active', type: 'boolean' }, { name: 'seats', type: 'int' }, { name: 'price', type: 'int' }],
                        data: [
                            { name: 'Aurora Trek', status: 'open', active: true, seats: 12, price: 4200 },
                            { name: 'Silk Road 19d', status: 'replied', active: true, seats: 4, price: 6890 },
                            { name: 'Fjord Explorer', status: 'closed', active: false, seats: 0, price: 3150 },
                            { name: 'Desert Crossing', status: 'escalated', active: true, seats: 8, price: 5400 }
                        ]
                    },
                    columns: [
                        { xtype: 'checkcolumn', text: '', dataIndex: 'active', width: 50 },
                        { text: 'Tour', dataIndex: 'name', flex: 1 },
                        { text: 'Status', dataIndex: 'status', width: 120 },
                        { text: 'Seats', dataIndex: 'seats', width: 90, align: 'right' },
                        { text: 'Price', dataIndex: 'price', width: 100, align: 'right', renderer: Ext.util.Format.usMoney }
                    ]
                }
            ]
        },
        {
            xtype: 'panel',
            itemId: 'gallery-datagrid',
            cls: 'gallery-section',
            title: 'Data grid (toolbar, filter bar, grouping, summary, paging)',
            items: [
                {
                    xtype: 'grid',
                    itemId: 'row-datagrid',
                    cls: 'gallery-row',
                    height: 620,

                    store: {
                        fields: [
                            'name', 'status', 'region',
                            { name: 'seats', type: 'int' },
                            { name: 'price', type: 'int' }
                        ],
                        groupField: 'region',
                        pageSize: 8,
                        proxy: { type: 'memory', enablePaging: true, data: [
                            { name: 'Silk Road 19d',   status: 'open',        region: 'Central Asia', seats: 4,  price: 6890 },
                            { name: '5 Stans Express', status: 'replied',     region: 'Central Asia', seats: 11, price: 5240 },
                            { name: 'Pamir Highway',   status: 'open',        region: 'Central Asia', seats: 6,  price: 5990 },
                            { name: 'Aurora Trek',     status: 'open',        region: 'Nordics',      seats: 12, price: 4200 },
                            { name: 'Fjord Explorer',  status: 'closed',      region: 'Nordics',      seats: 0,  price: 3150 },
                            { name: 'Lofoten Circuit', status: 'open',        region: 'Nordics',      seats: 6,  price: 3980 },
                            { name: 'Iceland Ring',    status: 'escalated',   region: 'Nordics',      seats: 3,  price: 4750 },
                            { name: 'Atlas Crossing',  status: 'send-failed', region: 'Africa',       seats: 8,  price: 5400 },
                            { name: 'Sahara Nights',   status: 'replied',     region: 'Africa',       seats: 9,  price: 4100 },
                            { name: 'Nile Passage',    status: 'open',        region: 'Africa',       seats: 14, price: 6200 },
                            { name: 'Andes Traverse',  status: 'open',        region: 'Americas',     seats: 7,  price: 7300 },
                            { name: 'Patagonia Wild',  status: 'closed',      region: 'Americas',     seats: 0,  price: 8150 }
                        ]},
                        autoLoad: true
                    },

                    selModel: { type: 'checkboxmodel' },

                    columns: [
                        { text: 'Tour', dataIndex: 'name', flex: 1, filterType: 'string' },
                        {
                            text: 'Status',
                            dataIndex: 'status',
                            width: 130,
                            filterType: 'list',
                            // tdCls drives the per-cell status accent
                            renderer: function (value, meta) {
                                meta.tdCls = 'gallery-status-cell gallery-status-' + value;

                                return value;
                            }
                        },
                        { text: 'Region', dataIndex: 'region', width: 130, filterType: 'string' },
                        {
                            text: 'Seats',
                            dataIndex: 'seats',
                            width: 90,
                            align: 'right',
                            filterType: 'number',
                            summaryType: 'sum'
                        },
                        {
                            text: 'Price',
                            dataIndex: 'price',
                            width: 110,
                            align: 'right',
                            filterType: 'number',
                            summaryType: 'sum',
                            renderer: Ext.util.Format.usMoney
                        }
                    ],

                    viewConfig: {
                        stripeRows: true,
                        getRowClass: function (record) {
                            return 'gallery-row-status gallery-row-' + record.get('status');
                        }
                    },

                    features: [
                        { ftype: 'groupingsummary', groupHeaderTpl: '{name} ({rows.length})' },
                        { ftype: 'summary', dock: 'bottom' }
                    ],

                    plugins: { gridfilterbar: true },

                    tbar: [
                        { xtype: 'textfield', emptyText: 'Search tours…', width: 200 },
                        {
                            xtype: 'combobox',
                            emptyText: 'All statuses',
                            width: 150,
                            queryMode: 'local',
                            displayField: 'text',
                            valueField: 'value',
                            store: {
                                fields: ['value', 'text'],
                                data: [
                                    { value: 'open', text: 'Open' },
                                    { value: 'replied', text: 'Replied' },
                                    { value: 'closed', text: 'Closed' },
                                    { value: 'escalated', text: 'Escalated' }
                                ]
                            }
                        },
                        '->',
                        { iconCls: 'x-fa fa-rotate', tooltip: 'Refresh' },
                        { iconCls: 'x-fa fa-table-columns', tooltip: 'Columns' },
                        { text: 'Export', iconCls: 'x-fa fa-download' },
                        { text: 'Add', iconCls: 'x-fa fa-plus' }
                    ],

                    bbar: { xtype: 'pagingtoolbar', displayInfo: true }
                }
            ]
        },
        {
            xtype: 'panel',
            itemId: 'gallery-trees',
            cls: 'gallery-section',
            title: 'Trees',
            bodyPadding: 16,
            items: [
                {
                    xtype: 'container', itemId: 'row-treelist', cls: 'gallery-row', layout: 'hbox',
                    items: [
                        {
                            xtype: 'treelist',
                            width: 288,
                            indent: 16,
                            expanderFirst: true,
                            expanderOnly: false,
                            ui: null,
                            store: {
                                type: 'tree',
                                root: {
                                    expanded: true,
                                    children: [
                                        { text: 'Asia', iconCls: 'x-fa fa-earth-asia', expanded: true, children: [
                                            { text: 'Silk Road 19d', iconCls: 'x-fa fa-route', expanded: true, children: [
                                                { text: 'Mar 2027 departure', iconCls: 'x-fa fa-calendar', leaf: true }
                                            ] },
                                            { text: 'Mekong Delta', iconCls: 'x-fa fa-route', leaf: true }
                                        ] },
                                        { text: 'Europe', iconCls: 'x-fa fa-earth-europe', children: [
                                            { text: 'Fjord Explorer', iconCls: 'x-fa fa-route', leaf: true },
                                            { text: 'Lofoten Circuit', iconCls: 'x-fa fa-route', leaf: true }
                                        ] },
                                        { text: 'Americas', iconCls: 'x-fa fa-earth-americas', children: [
                                            { text: 'Andes Traverse', iconCls: 'x-fa fa-route', leaf: true },
                                            { text: 'Patagonia Wild', iconCls: 'x-fa fa-route', leaf: true }
                                        ] }
                                    ]
                                }
                            },
                            listeners: {
                                afterrender: function (list) {
                                    var node = list.getStore().findNode('text', 'Mar 2027 departure');
                                    if (node) {
                                        list.setSelection(node);
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'container', itemId: 'row-treelist-states', cls: 'gallery-row', layout: 'hbox',
                    items: [
                        {
                            xtype: 'treelist',
                            width: 288,
                            indent: 16,
                            singleExpand: true,
                            store: {
                                type: 'tree',
                                root: {
                                    expanded: false,
                                    children: [
                                        { text: 'Asia', children: [
                                            { text: 'Silk Road 19d', children: [
                                                { text: 'Mar 2027 departure', leaf: true }
                                            ] },
                                            { text: 'Mekong Delta', leaf: true }
                                        ] },
                                        { text: 'Europe', children: [
                                            { text: 'Fjord Explorer', leaf: true },
                                            { text: 'Lofoten Circuit', leaf: true }
                                        ] },
                                        { text: 'Americas', children: [
                                            { text: 'Andes Traverse', leaf: true },
                                            { text: 'Patagonia Wild', leaf: true }
                                        ] }
                                    ]
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'treepanel',
                    itemId: 'row-treegrid',
                    cls: 'gallery-row',
                    height: 260,
                    rootVisible: false,
                    useArrows: true,
                    lines: false,
                    store: {
                        type: 'tree',
                        fields: ['text', 'status', { name: 'seats', type: 'int' }],
                        root: {
                            expanded: true,
                            children: [
                                { text: 'Asia', expanded: true, children: [
                                    { text: 'Silk Road 19d', status: 'Open', seats: 4, expanded: true, children: [
                                        { text: 'Mar 2027 departure', status: 'Open', seats: 4, leaf: true }
                                    ] },
                                    { text: 'Mekong Delta', status: 'Replied', seats: 11, leaf: true }
                                ] },
                                { text: 'Europe', children: [
                                    { text: 'Fjord Explorer', status: 'Closed', seats: 0, leaf: true },
                                    { text: 'Lofoten Circuit', status: 'Open', seats: 6, leaf: true }
                                ] },
                                { text: 'Americas', children: [
                                    { text: 'Andes Traverse', status: 'Open', seats: 7, leaf: true },
                                    { text: 'Patagonia Wild', status: 'Closed', seats: 0, leaf: true }
                                ] }
                            ]
                        }
                    },
                    columns: [
                        { xtype: 'treecolumn', text: 'Name', dataIndex: 'text', flex: 1 },
                        { text: 'Status', dataIndex: 'status', width: 120 },
                        { text: 'Seats', dataIndex: 'seats', width: 80, align: 'right' }
                    ]
                }
            ]
        },
        {
            xtype: 'panel',
            itemId: 'gallery-tiles',
            cls: 'gallery-section',
            title: 'Tiles & status accents',
            bodyPadding: 16,
            items: [
                {
                    xtype: 'container', itemId: 'row-stat-tiles', cls: 'gallery-row', layout: 'hbox',
                    defaults: { xtype: 'panel', cls: 'gallery-tile', margin: '0 12 0 0', width: 180, height: 84, bodyPadding: 16 },
                    items: [
                        { html: statTile('fa-bell', 'Open', '128') },
                        { cls: 'gallery-tile gallery-tile-accent-left gallery-status-escalated',
                          html: statTile('fa-filter', 'Escalated', '12') },
                        { cls: 'gallery-tile gallery-tile-accent-top gallery-status-replied',
                          html: statTile('fa-reply', 'Replied', '94') },
                        { cls: 'gallery-tile gallery-tile-accent-right gallery-status-send-failed',
                          html: statTile('fa-triangle-exclamation', 'Failed', '3') }
                    ]
                },
                {
                    xtype: 'grid', itemId: 'row-status-accent-grid', cls: 'gallery-row', height: 180,
                    store: {
                        fields: ['name', 'status', { name: 'conf', type: 'int' }],
                        data: [
                            { name: 'Aurora Trek', status: 'open', conf: 92 },
                            { name: 'Silk Road 19d', status: 'escalated', conf: 41 },
                            { name: 'Fjord Explorer', status: 'closed', conf: 77 },
                            { name: 'Desert Crossing', status: 'send-failed', conf: 12 }
                        ]
                    },
                    columns: [
                        { text: 'Tour', dataIndex: 'name', flex: 1 },
                        {
                            text: 'Status', dataIndex: 'status', width: 140,
                            renderer: function (value) {
                                return '<span class="gallery-badge gallery-status-chip-' + value + '">' +
                                    Ext.String.htmlEncode(value) + '</span>';
                            }
                        },
                        {
                            text: 'Confidence', dataIndex: 'conf', width: 120, align: 'right',
                            renderer: function (value, meta) {
                                meta.tdCls = 'gallery-cell-fill gallery-status-' +
                                    (value >= 70 ? 'open' : value >= 40 ? 'escalated' : 'send-failed');

                                return value + '%';
                            }
                        }
                    ],
                    viewConfig: {
                        getRowClass: function (record) {
                            return 'gallery-row-' + record.get('status');
                        }
                    }
                }
            ]
        },
        {
            xtype: 'panel',
            itemId: 'gallery-tabs',
            cls: 'gallery-section',
            title: 'Tabs',
            bodyPadding: 16,
            items: [
                {
                    xtype: 'tabpanel', itemId: 'row-tabs-top', cls: 'gallery-row', height: 220,
                    items: [
                        { title: 'Overview', html: 'Overview tab content' },
                        { title: 'Details', closable: true, html: 'Details tab content' },
                        { title: 'Settings', iconCls: 'x-fa fa-gear', html: 'Settings tab content' },
                        { title: 'Archived', disabled: true, html: 'Archived tab content' }
                    ]
                },
                {
                    xtype: 'tabpanel', itemId: 'row-tabs-bottom', cls: 'gallery-row', height: 220, tabPosition: 'bottom',
                    items: [
                        { title: 'First', html: 'First tab content' },
                        { title: 'Second', html: 'Second tab content' }
                    ]
                },
                {
                    xtype: 'tabpanel', itemId: 'row-tabs-plain', cls: 'gallery-row', height: 220, plain: true,
                    items: [
                        { title: 'Overview', html: 'Overview tab content' },
                        { title: 'Details', html: 'Details tab content' },
                        { title: 'Settings', iconCls: 'x-fa fa-gear', html: 'Settings tab content' }
                    ]
                },
                {
                    xtype: 'tabpanel', itemId: 'row-tabs-vertical', cls: 'gallery-row', height: 220,
                    tabPosition: 'left', tabRotation: 0,
                    items: [
                        { title: 'Overview', html: 'Overview tab content' },
                        { title: 'Details', html: 'Details tab content' },
                        { title: 'Settings', iconCls: 'x-fa fa-gear', html: 'Settings tab content' }
                    ]
                },
                {
                    xtype: 'tabpanel', itemId: 'row-tabs-vertical-plain', cls: 'gallery-row', height: 220,
                    tabPosition: 'left', tabRotation: 0, plain: true,
                    items: [
                        { title: 'Overview', html: 'Overview tab content' },
                        { title: 'Details', html: 'Details tab content' },
                        { title: 'Settings', iconCls: 'x-fa fa-gear', html: 'Settings tab content' }
                    ]
                }
            ]
        },
        {
            xtype: 'panel',
            itemId: 'gallery-overlays',
            cls: 'gallery-section',
            title: 'Overlays',
            bodyPadding: 16,
            items: [
                {
                    xtype: 'container', itemId: 'row-menu-tooltip', cls: 'gallery-row', layout: 'hbox',
                    defaults: { margin: '0 8 0 0' },
                    items: [
                        {
                            xtype: 'button', text: 'Menu', iconCls: 'x-fa fa-bars',
                            menu: {
                                items: [
                                    { text: 'Item one' },
                                    { text: 'Item two' },
                                    { xtype: 'menucheckitem', text: 'Checkable item', checked: true },
                                    '-',
                                    { text: 'Submenu', menu: [{ text: 'Sub item one' }, { text: 'Sub item two' }] }
                                ]
                            }
                        },
                        {
                            xtype: 'button', itemId: 'row-tooltip-target', text: 'Hover for tooltip',
                            listeners: { afterrender: 'onTooltipButtonAfterRender' }
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'panel',
            itemId: 'gallery-windows',
            cls: 'gallery-section',
            title: 'Windows',
            bodyPadding: 16,
            items: [
                {
                    xtype: 'container', itemId: 'row-window-launchers', cls: 'gallery-row', layout: 'hbox',
                    defaults: { margin: '0 8 0 0' },
                    items: [
                        { xtype: 'button', text: 'Standard window', handler: 'onOpenStandardWindow' },
                        { xtype: 'button', text: 'Window with toolbar', handler: 'onOpenTbarWindow' },
                        { xtype: 'button', text: 'Confirm dialog', handler: 'onShowConfirm' },
                        { xtype: 'button', text: 'Alert dialog', handler: 'onShowAlert' },
                        { xtype: 'button', text: 'Maximized window', handler: 'onOpenMaximizedWindow' }
                    ]
                }
            ]
        },
        {
            xtype: 'panel',
            itemId: 'gallery-toasts',
            cls: 'gallery-section',
            title: 'Toasts',
            bodyPadding: 16,
            items: [
                {
                    xtype: 'container', itemId: 'row-toast-types', cls: 'gallery-row', layout: 'hbox',
                    defaults: { margin: '0 8 0 0' },
                    items: [
                        { xtype: 'button', text: 'Success', toastType: 'success', handler: 'onToastButtonClick' },
                        { xtype: 'button', text: 'Error', toastType: 'error', handler: 'onToastButtonClick' },
                        { xtype: 'button', text: 'Warning', toastType: 'warning', handler: 'onToastButtonClick' },
                        { xtype: 'button', text: 'Info', toastType: 'info', handler: 'onToastButtonClick' },
                        { xtype: 'button', text: 'Plain', toastType: 'plain', handler: 'onToastButtonClick' }
                    ]
                },
                {
                    xtype: 'container', itemId: 'row-toast-positions', cls: 'gallery-row', layout: 'hbox',
                    defaults: { margin: '0 8 0 0' },
                    items: [
                        { xtype: 'button', text: 'Top-right', toastType: 'info', toastAlign: 'tr', handler: 'onToastButtonClick' },
                        { xtype: 'button', text: 'Bottom-right', toastType: 'info', toastAlign: 'br', handler: 'onToastButtonClick' }
                    ]
                },
                {
                    xtype: 'container', itemId: 'row-toast-persistent', cls: 'gallery-row', layout: 'hbox',
                    defaults: { margin: '0 8 0 0' },
                    items: [
                        { xtype: 'button', text: 'Persistent success', toastType: 'success', toastPersistent: true, handler: 'onToastButtonClick' },
                        { xtype: 'button', text: 'Persistent error', toastType: 'error', toastPersistent: true, handler: 'onToastButtonClick' },
                        { xtype: 'button', text: 'Persistent warning', toastType: 'warning', toastPersistent: true, handler: 'onToastButtonClick' },
                        { xtype: 'button', text: 'Persistent info', toastType: 'info', toastPersistent: true, handler: 'onToastButtonClick' },
                        { xtype: 'button', text: 'Persistent plain', toastType: 'plain', toastPersistent: true, handler: 'onToastButtonClick' }
                    ]
                },
                {
                    xtype: 'container', itemId: 'row-toast-autoclose', cls: 'gallery-row', layout: 'hbox',
                    defaults: { margin: '0 8 0 0' },
                    items: [
                        { xtype: 'button', text: 'Auto-close (4s)', toastType: 'info', toastAutoCloseDelay: 4000, handler: 'onToastButtonClick' }
                    ]
                },
                {
                    xtype: 'container', itemId: 'row-toast-progress', cls: 'gallery-row', layout: 'hbox',
                    defaults: { margin: '0 8 0 0' },
                    items: [
                        { xtype: 'button', text: 'Progress toast', handler: 'onProgressToastClick' }
                    ]
                }
            ]
        },
        {
            xtype: 'panel',
            itemId: 'gallery-misc',
            cls: 'gallery-section',
            title: 'Misc',
            bodyPadding: 16,
            items: [
                { xtype: 'progressbar', itemId: 'row-progressbar', cls: 'gallery-row', width: 300, value: 0.6, text: '60%' },
                {
                    xtype: 'container', itemId: 'row-loadmask', cls: 'gallery-row', layout: 'hbox',
                    defaults: { margin: '0 12 0 0' },
                    items: [
                        { xtype: 'panel', itemId: 'gallery-loadmask-target', width: 220, height: 100, bodyPadding: 8,
                          html: 'Panel content behind the load mask' },
                        { xtype: 'button', text: 'Toggle load mask', handler: 'onToggleLoadMask' }
                    ]
                },
                {
                    xtype: 'toolbar', itemId: 'row-separator', cls: 'gallery-row', width: 220,
                    items: [{ text: 'Left' }, { xtype: 'tbseparator' }, { text: 'Right' }]
                },
                { xtype: 'component', itemId: 'row-avatar', cls: 'gallery-row',
                  html: '<span class="gallery-avatar">JS</span>' +
                        '<span class="gallery-avatar gallery-avatar-sm" style="margin-left:8px;">AB</span>' }
            ]
        }
        ];
    })()
});
