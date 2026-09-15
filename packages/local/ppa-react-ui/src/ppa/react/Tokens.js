/**
 * @class ppa.react.Tokens
 * @singleton
 *
 * Marker singleton for the package's `--re-*` CSS custom property token layer.
 * It has no runtime behaviour; it exists only so `sass/src/Tokens.scss` maps
 * onto a real class in the build. A `sass/src/*.scss` file whose name has no
 * matching class compiles to nothing, silently — every `Re*` component
 * `requires: ['ppa.react.Tokens']` so this file is always included.
 *
 *     @example
 *     // Not used directly. Every ppa.react.Re* class requires it:
 *     Ext.define('ppa.react.ReBadge', {
 *         requires: ['ppa.react.Tokens']
 *     });
 *
 * ## Styling
 * Emits the `:root` and dark-scope (`.dark-mode` by default) blocks of
 * `--re-*` custom properties consumed by every other class in this package.
 */
Ext.define('ppa.react.Tokens', {
    singleton: true
});
