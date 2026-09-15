/**
 * @class ppa.react.ReStatus
 * @singleton
 *
 * Owns the status vocabulary shared by {@link ppa.react.ReBadge}, grid row/cell
 * accents and {@link ppa.react.grid.ReStatusColumn}, so no other class in this
 * package hardcodes a status name.
 *
 * The default ramp (`open` / `escalated` / `replied` / `closed` /
 * `send-failed`) is manuka's email domain, not a UI concept — it ships only
 * as a default. Replace it wholesale with {@link #setStatuses}, or extend it
 * with {@link #addStatus}. The matching colours live in the SCSS
 * `$re-status-ramp` map (`sass/var/Tokens.scss`); adding a status there and
 * calling `addStatus()` here is the only change needed to add one — no CSS
 * rule duplication.
 *
 *     @example
 *     // Replace the whole vocabulary:
 *     ppa.react.ReStatus.setStatuses(['pending', 'approved', 'rejected']);
 *
 *     // Or extend it with one more name (SCSS must define its colours too):
 *     ppa.react.ReStatus.addStatus('archived');
 *
 *     // Grid usage:
 *     viewConfig: {
 *         getRowClass: function (rec) {
 *             return ppa.react.ReStatus.getRowCls(rec.get('status'));
 *         }
 *     },
 *     columns: [{
 *         text: 'Status', dataIndex: 'status',
 *         renderer: function (value, meta) {
 *             meta.tdCls = ppa.react.ReStatus.getCellCls(value, true);
 *             return value;
 *         }
 *     }]
 *
 * ## Styling
 * Emits `re-status-row-<name>` (left edge accent on the row's first cell),
 * `re-status-cell-<name>` (+ `re-status-fill` for a tinted background) and is
 * consumed by `ppa.react.ReBadge`'s `re-badge-status-<name>` rules. Reads the
 * `--re-status-<name>-fg` / `-bg` custom properties.
 */
Ext.define('ppa.react.ReStatus', {
    singleton: true,

    /**
     * @property {String[]} statuses
     * The current status vocabulary. Replace with {@link #setStatuses}.
     */
    statuses: ['open', 'escalated', 'replied', 'closed', 'send-failed'],

    /**
     * @param {String} status
     * @return {String} The CSS class for a grid row accent.
     */
    getRowCls: function (status) {
        return status ? 're-status-row-' + status : '';
    },

    /**
     * @param {String} status
     * @param {Boolean} [fill=false] Also tint the cell background.
     * @return {String} The CSS class(es) for a grid cell accent.
     */
    getCellCls: function (status, fill) {
        if (!status) {
            return '';
        }

        return 're-status-cell-' + status + (fill ? ' re-status-fill' : '');
    },

    /**
     * @param {String} status
     * @return {String} The CSS class(es) for a status badge (see ReBadge).
     */
    getBadgeCls: function (status) {
        return 're-badge re-badge-status-' + status;
    },

    /**
     * Replaces the whole status vocabulary.
     * @param {String[]} names
     */
    setStatuses: function (names) {
        this.statuses = names || [];
    },

    /**
     * Appends one status name to the vocabulary.
     * @param {String} name
     */
    addStatus: function (name) {
        if (name && !Ext.Array.contains(this.statuses, name)) {
            this.statuses.push(name);
        }
    }
});
