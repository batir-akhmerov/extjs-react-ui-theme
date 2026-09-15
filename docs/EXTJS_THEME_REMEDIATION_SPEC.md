# ExtJS shadcn Theme — Remediation Spec (Phase 2, follow-up)

Follow-up to `docs/EXTJS_THEME_PARITY_SPEC.md`. Read that spec first — especially
**§8 Traps** and **§4 Architecture (LOCKED)**. Also read
`.github/skills/extjs8-classic/SKILL.md`.

This file existed because a manual-testing pass surfaced 16 border/shape/colour defects.
**All 16 are now fixed and verified** — see §2. What is left is listed in §3.

---

## 1. How this was verified without blowing the image budget

The image budget is ~20 images per request, so almost everything was checked with
`getComputedStyle` instead of screenshots. Two things make that work:

- **Disable transitions before measuring.** A hidden/background Playwright page throttles
  style recalc, so any property under a CSS `transition` reads back its *start* value and
  every state override looks like it failed. Inject
  `*,*:before,*:after{transition:none !important;animation:none !important;}` first.
- **Pseudo-elements carry most of the state.** `getComputedStyle(node, '::before')` is the
  only way to see ExtJS's split-button masks, glyph ligatures and separators.

For the few checks that really need eyes, set `zoom: 5` on the `galleryview` element and
drive `.galleryview.x-scroller`'s `scrollTop` — element screenshots ignore `zoom`, and
`scrollIntoView`/`locator.screenshot()` both hang on this page.

---

## 2. Status of the 16 reported issues — all VERIFIED

| # | Issue | Fix location | Measured result |
|---|---|---|---|
| 1 | Focused field doesn't show the full grey ring on all sides | `sass/src/form/field/Text.scss` → `.x-form-trigger-wrap-focus` + `shadcn-focus-ring()`; `sass/src/Component.scss` `overflow: visible` | wrap `box-shadow: rgba(161,161,161,.5) 0 0 0 3px`, border `#a1a1a1`, r10, wrap + body `overflow: visible` |
| 2 | Unchecked checkbox shows an artefact inside the grey square | `sass/src/form/field/Checkbox.scss` | off = transparent bg, `#e5e5e5` border, r4, `background-image: none`, 16×16 |
| 3 | Radio: no white dot when selected; mess when off | `sass/src/form/field/Radio.scss` | off = transparent + `#e5e5e5` ring; on = `#171717` + centred 8px white dot |
| 4 | Combo dropdown has no rounded corners | `sass/src/view/BoundList.scss` | list r10 / pad 4 / ring + shadow-md; item r8 / h32 / pad 0 8 |
| 5 | Split/menu button shows a bad bottom border in the bottom corners | `sass/src/button/Button.scss` (see §3.1) | masks transparent, root tints `#171717 → #2e2e2e` uniformly, separator `rgba(fg,.3)` h20 |
| 6 | Panels often have missing or broken borders | `sass/src/panel/Panel.scss` | `inset 0 0 0 1px rgba(10,10,10,.1)`, r14, continuous |
| 7 | Broken borders inside panel | same as 6 | same |
| 8 | Broken borders in panels/tiles | `app/desktop/src/view/gallery/GalleryView.scss` | `.gallery-tile` r14 + same inset ring |
| 9 | Missing padding in tab content / tab title overlaps grey bar | `sass/src/tab/Bar.scss` | bar h32 / r10 / `margin-bottom: 8px`; tab h26 inset 3px on all sides; body padding 0 — matches shadcn `Tabs gap-2` + unpadded `TabsContent` |
| 10 | Plain tabs: active tab has a rounded bottom border | `sass/src/tab/Tab.scss` | plain bar transparent r0; tab r0 with `border-bottom: 2px #0a0a0a` |
| 11 | Plain vertical (left) tabs: rounded left border on active tab | same rule as 10 | vertical plain bar transparent r0; tab r0 with `border-right: 2px #0a0a0a` |
| 12 | Toast messages are not coloured | `GalleryViewController.js` + `GalleryView.scss` | success `#008a2e`, error `#e60000`, warning `#dc7609`, info `#0a85d1`, plain `#737373` |
| 13 | Load mask has no rounded corners | `sass/src/Component.scss` | `.x-mask-msg` r10 + ring + shadow-md |
| 14 | Datepicker: too wide, no radius, too much padding, day not centred | `sass/src/picker/Date.scss` + `sass/var/picker/Date.scss` | 254px wide, r10, cell 32×32 with `line-height: 32px`, `border-radius: 50%`, `text-align: center` |
| 15 | Dialog icons are not coloured | `sass/var/window/MessageBox.scss` | info `#0a85d1`, warning `#dc7609`, error `#e7000b`, question `#171717`; question glyph restored to `$fa-var-question-circle` (material had swapped it for the Material `warning` ligature) |
| 16 | Window: grey corner artefacts, non-standard min/max tools, no header/body/footer separators | `sass/src/window/Window.scss`, `sass/var/panel/Tool.scss` | r14 + ring + shadow-lg, header hairline `inset 0 -1px 0 #e5e5e5`, tools `minimize`/`crop_square` in `#737373` |

Every row above was also measured with `.dark-mode` on (toggled with a real
`btn.el.dom.click()`), and zero console errors were recorded on a clean load.

---

## 3. What the two open issues actually were

### 3.1 Issue 5 — split/menu button (FIXED)

**Real cause.** ExtJS does not tint a split button as one surface. It paints two
square-cornered, absolutely-positioned masks inside the button and swaps *their* colours per
state:

| element | covers | resting | hover / pressed | menu open |
|---|---|---|---|---|
| `.x-btn-wrap.x-btn-split:before` | everything left of the arrow | `#171717` | `#2e2e2e` | `#171717` |
| `.x-btn-split-right + .x-btn-arrow-el:before` | the arrow segment | `#171717` | `#171717` | `#2e2e2e` |

So hovering only half-lit the control, and at a 10px radius the lit half read as a square
block against the rounded shape — the "bad bottom border in the bottom corners".
`$button-split-border` was a red herring; it only controls the text/arrow separator.

Additionally `.x-btn-button:after` (the separator) was repainted per state in the button's
own background colour and was 60px tall inside a 32px button, so it rendered as a hard black
edge-to-edge bar.

**Fix** — `packages/local/theme-react-shadcn/sass/src/button/Button.scss`:

1. Force both masks to `background-color: transparent !important`. `!important` is required:
   theme-material re-emits these once per state \u00d7 ui at four classes of specificity.
2. `.x-btn.x-split-button { border-radius: 10px; overflow: hidden; }`.
3. New `shadcn-split-tint($ui, $bg-over, $scope)` mixin puts the hover/pressed/menu-active
   colour on the button **root**, which is what now shows through \u2014 otherwise the control
   loses all hover feedback. Invoked for `default`, `confirm`, `decline`,
   `default-toolbar`, `plain-toolbar`, once for light and once with a `.dark-mode ` scope.
4. Separator restated inside `shadcn-button-ui` / `shadcn-button-ui-dark` as
   `top: 0; height: 100%; border-color: rgba($fg, .3)`.

### 3.2 Issue 9 — tab content padding (FIXED / already correct)

Measured on all five gallery tab panels (top, bottom, plain, vertical, vertical-plain):

- bar h32, `border-radius: 10px`, `background #f5f5f5`, `margin` 8px on the body side;
- active tab h26, r8, `padding: 2px 6px`, inset 3px from every bar edge \u2014 **no overlap**;
- tab panel body `padding: 0`.

That is exactly shadcn: `Tabs` is `flex flex-col gap-2` (\u2192 the 8px bar margin) and
`TabsContent` is `flex-1 outline-none` with no padding of its own. Nothing further to add;
adding body padding would have moved *away* from the reference.

The only remaining tab delta is cosmetic and predates this list: the ExtJS bar is full-bleed
where shadcn's `TabsList` is `w-fit`. ExtJS sizes the docked bar from the layout, so it
cannot be shrunk from CSS without breaking the dock.

---

## 4. Reproduction notes (carried over, still true)

- ExtJS dev server: `cd c:\work\extjs\classic-app; npm run dev` → `http://localhost:1962`.
  Wait for **"Fashion build complete"** *and* **"Waiting for changes..."**.
- React reference: manuka frontend on `http://localhost:3000/theme-gallery` (no login).
- After a rebuild, load `http://localhost:1962/?nocache=<timestamp>`, then set
  `location.hash = '#galleryview'` — the `?nocache=` navigation does not fire the hash route.
- Before screenshotting sections, assign ids:
  ```js
  Ext.ComponentQuery.query('galleryview')[0].items.each(c => { c.el.dom.id = c.itemId; });
  ```
- **Never** `waitUntil: 'networkidle'` on `localhost:1962`.
- `getComputedStyle` is unreliable while the Playwright page is hidden (trap 9) — disable
  transitions first (see §1), and sanity-check by writing an inline style and reading it back.
- `locator.screenshot()`, `scrollIntoViewIfNeeded` and `element.scrollIntoView()` all hang or
  mis-land on this page. Scroll `.galleryview.x-scroller`'s `scrollTop` directly instead.

---

## 5. Definition of done — MET

1. ✅ Issues 5 and 9 fixed and measured.
2. ✅ All 16 issues confirmed numerically (and, where shape matters, visually) in light mode
   and dark mode.
3. ✅ No new Fashion build warnings; zero console errors on a clean load.
4. ✅ `docs/EXTJS_THEME_PARITY_SPEC.md` §2 "Still to do" updated.

## 5a. Round 2 — 13 further defects from a second manual pass (all VERIFIED)

| # | Issue | Fix location | Measured result |
|---|---|---|---|
| 1 | Panel body content not aligned with the panel title | `app/desktop/src/view/gallery/GalleryView.js` | `bodyPadding: 16` matches the header's `16px 16px 8px`; title x = body text x = 363 |
| 2 | Pressed and unpressed buttons look identical; "Options" shows two arrows | `sass/src/button/Button.scss`, `GalleryView.js` | off = transparent/`#0a0a0a` text, on = `#f5f5f5`/`#171717`; the redundant `iconCls` is gone, one arrow element |
| 3 | Number field's right corners broken by the spinner | `sass/src/form/field/Text.scss` | `.x-form-spinner*` transparent; wrap radius 10px intact |
| 4 | Month/Year barely visible in the datepicker header | `sass/src/picker/Date.scss` | header button label `rgb(10,10,10)` on a transparent fill |
| 5 | Pressed toggle indistinguishable | same as 2 | segmented items follow the same on/off pair (= shadcn `ToggleGroup`) |
| 6 | Horizontal checkbox/radio options run together; labels wrap | `sass/src/Component.scss` | `.x-form-check-group` (the layout's column `<td>`) `padding-right: 16px`; box labels `nowrap`, single 20px line |
| 7 | Inline datepicker and calendar corners broken | `sass/src/picker/Date.scss`, `sass/src/Component.scss` | datepicker r10 + `overflow: hidden`; the calendar **panel** (not `.x-calendar-weeks`) carries the r10 ring + clip |
| 8 | Fieldset corners square, legend grey | `sass/var/Component.scss`, `sass/src/Component.scss` | r10, border `#e5e5e5`, legend `#0a0a0a` / 600 |
| 9 | Card has no rounded outline; stat label overlaps the number | `sass/src/panel/Panel.scss`, `GalleryView.js` | ring r14 continuous; value 24/32, label 16 line-height |
| 10 | Select-all leaves every checkbox off; filter-bar fields lose their left edge | `sass/src/form/field/Checkbox.scss`, `sass/src/grid/plugin/filterbar/FilterBar.scss` | header + row boxes fill `#171717` with the tick; `.x-grid-filter-base` `padding: 0 4px` gives each field its own rounded box |
| 11/12 | First letter of tab content clipped; tab titles too close | `sass/src/panel/Panel.scss`, `sass/src/tab/{Tab,Bar}.scss`, `sass/var/tab/Tab.scss` | body `line-height: 20px` (text top now 1px inside the body); tab padding `2px 10px`, 6px gap horizontally and vertically, close button `right: 6px` |
| 13 | Submenu arrow not vertically centred | `sass/src/menu/Menu.scss` | arrow centre offset 0 in a 28px item |

### The one finding worth carrying forward

The "broken panel borders" in 6/7/8/9 were all the same bug. ExtJS positions `.x-panel-body`
absolutely, and a positioned descendant paints **above** its parent's `outline` just as it does
over an inset `box-shadow` — so only the rounded corners ever showed. The ring has to be an
overlay pseudo-element:

```scss
&:after {
    content: '';
    position: absolute;
    left: 0; top: 0; right: 0; bottom: 0;
    border: 1px solid $shadcn-card-ring;
    border-radius: inherit;
    pointer-events: none;
}
```

A real `border` on the panel root also renders (ExtJS is `border-box`, so the outer size is
unchanged) but it shifts the body ExtJS has already measured by 1px.

## 6. Still open (not part of the 16)

- ExtJS tab bar is full-bleed; shadcn's `TabsList` is `w-fit`.
- `textareafield` label centres vertically instead of top-aligning.
- ~~`HeaderView`, `FooterView`, `TopView`, `BottomView`, `MenuView` SCSS still derives from
  `$base-color` rather than the token layer.~~ Done — see `EXTJS_THEME_PARITY_SPEC.md` §2
  "App shell re-tokenised".
- `ext-ux` SCSS beyond the calendar surfaces is not assessed.

## 7. Round 3 — dark mode pass (6 reported defects)

Reported from screenshots of the gallery in dark mode. Root cause for each was confirmed with
`getComputedStyle` on the live page (dark mode toggled via the header button) before any fix
was written, per the method in §1. Status is updated in place as each is closed.

| # | Issue | Root cause (verified) | Fix location | Status |
|---|---|---|---|---|
| 1 | Calendar weekday names and day numbers are almost invisible | `.x-calendar-header .x-calendar-header-cell` (`color:#0a0a0a`) and `.x-calendar-weeks .x-calendar-weeks-day-text` (`color:#000`) are baked by `ext-calendar`/`ext-core` at 2-class specificity and compiled **after** our theme package, so our existing `.dark-mode .x-calendar-header-cell` / `.dark-mode .x-calendar-day-number` rules lose the cascade (also: `-day-number` is the wrong class — the real one is `-weeks-day-text`) | `sass/src/Component.scss` | ✅ Fixed — matched selector depth added; measured `color: rgb(152,163,175)` on both the weekday header and day numbers |
| 2 | Scrollbars render as the bright default OS scrollbar in dark mode | No `::-webkit-scrollbar` / `scrollbar-color` rule exists anywhere in the theme package — verified via a full-package grep | `sass/src/Component.scss` (new global rule) | ✅ Fixed — `scrollbar-width: thin` + muted-tone `scrollbar-color`/`::-webkit-scrollbar-thumb`, light and dark; measured `scrollbar-color: rgb(38,38,38)` on `.dark-mode` |
| 3 | Column header trigger (dropdown arrow) shows a bright square on hover/open | `.x-column-header-open .x-column-header-trigger { background-color: #fafafa }` is a theme-neutral rule at 2-class specificity; our dark override only recolours the header cell itself, not this descendant, so the light `#fafafa` box wins | `sass/src/grid/header/Container.scss` | ✅ Fixed — trigger box forced transparent in `.dark-mode`; measured `background-color: rgba(0,0,0,0)` on the open trigger |
| 4 | "Destructive" badge background is barely visible | `$shadcn-dark-destructive-soft: #2a1214` sits too close in luminance to `$shadcn-dark-card: #171717` — confirmed applied (`rgb(42,18,20)`) but not perceptible | `sass/var/Component.scss` | ✅ Fixed — background switched to `rgba($shadcn-dark-destructive, 0.18)`; measured `rgba(255,100,103,0.18)`, dead `$shadcn-dark-destructive-soft` var removed |
| 5 | Tile status accent (coloured edge bar) invisible in dark mode | `.gallery-tile .x-panel-body { background-color: transparent }` is light-mode-only; `.dark-mode .x-panel-body-default { background-color: $shadcn-dark-card }` in `panel/Panel.scss` compiles later at equal (2-class) specificity and repaints the body opaque, hiding the tile root's inset accent box-shadow underneath. Confirmed via computed style: body `background-color: rgb(23,23,23)` (opaque) despite the box-shadow itself being present and correctly coloured | `sass/src/Component.scss` | ✅ Fixed — added a `.dark-mode .gallery-tile .x-panel-body` override (3-class, wins regardless of file order); measured body `background-color: rgba(0,0,0,0)` and confirmed visually — all 4 tiles now show a full-perimeter coloured ring |
| 6 | Tab icons invisible in tab titles | `.x-tab-icon-el` has no dark-mode colour rule at all (only `.x-tab-inner-default` text does); the glyph keeps its light-mode baked colour (`#0a0a0a`) against the dark tab bar | `sass/src/tab/Tab.scss` | ✅ Fixed — mirrored the existing text-colour state rules onto `.x-tab-icon-el`; measured `color: rgb(152,163,175)`, matching the title text |

### Reproduction

Same as §4: `npm run dev` → `http://localhost:1962/?nocache=<n>#galleryview`, toggle dark mode
with `Ext.ComponentQuery.query('headerview')[0].query('button[enableToggle=true]')[0].el.dom.click()`.
