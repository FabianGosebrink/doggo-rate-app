# Bootstrap → Tailwind v4 migration

**Date:** 2026-05-28
**Status:** Approved

## Goal

Remove Bootstrap 5.2.2 from the `dog-rate-app` and replace it with Tailwind v4 utilities. Faithful visual port — the app should look the same after the migration, no redesign.

## Current state

- Bootstrap is loaded via CDN in `apps/dog-rate-app/src/index.html` (CSS link and JS bundle). No npm dependency, no SCSS `@import "bootstrap"`, no Sass variable overrides.
- Bootstrap classes appear as static utility/component classes in 8 templates (grid, spacing, buttons, cards, nav, list-group, display headings).
- No Bootstrap JS interactivity is in use anywhere — no `data-bs-*` attributes, no modals/dropdowns/collapse. The `bootstrap.bundle.min.js` include is dead weight.
- Two component SCSS files reference Bootstrap CSS variables:
  - `libs/shared/ui-common/src/lib/navigation/navigation.component.scss` → `var(--bs-gray-500)`
  - `libs/dogs/ui/src/lib/dog-list/dog-list.component.scss` → `--bs-card-border-color`
- `dog-list.component.scss` also contains a pile of Bootstrap-flavored helper classes (`.bd-placeholder-img`, `.b-example-divider`, `.feature-icon*`, `.icon-link`, `.icon-square`, `.nav-scroller`) that are not referenced by any template — dead code.
- Font Awesome 6.2.0 is also loaded via CDN. **Out of scope** for this migration; it stays.
- Stack: Angular 21.2.14, Nx 22.3.1, `@angular/build:application` executor (Vite under the hood), single global stylesheet at `apps/dog-rate-app/src/styles.scss` (currently empty).

## Approach

Single PR. Install Tailwind v4 alongside Bootstrap, convert all templates and SCSS files, then remove the Bootstrap CDN links in the same change. Pure Tailwind utilities — no daisyUI, no headless component library. Where a small piece of styling is reused (e.g. button variants), keep it inline rather than introducing a wrapper component for now; extract a component only if the same long class list appears 2+ times.

## Setup & dependencies

1. Add devDeps: `tailwindcss@^4`, `@tailwindcss/postcss@^4`.
2. Create `apps/dog-rate-app/postcss.config.js`:
   ```js
   module.exports = { plugins: { '@tailwindcss/postcss': {} } };
   ```
   `@angular/build` auto-discovers PostCSS config next to the project — no `project.json` change required.
3. Replace `apps/dog-rate-app/src/styles.scss` content with:
   ```scss
   @import "tailwindcss";
   ```
4. Remove the two Bootstrap tags from `apps/dog-rate-app/src/index.html`:
   - the `<link>` at line 9 loading `bootstrap.min.css`
   - the `<script>` at line 25 loading `bootstrap.bundle.min.js`

Font Awesome `<link>` and `<script>` stay.

## Class-mapping reference

| Bootstrap | Tailwind v4 |
|---|---|
| `container` | `container mx-auto px-4` |
| `row` (used as flex) | `flex flex-wrap -mx-2` |
| `row-cols-1 row-cols-lg-3 g-4` | `grid grid-cols-1 lg:grid-cols-3 gap-4` |
| `col`, `col-sm-3`, `col-lg-4` / `col-lg-8` | `flex-1`, `sm:w-1/4`, `lg:w-1/3` / `lg:w-2/3` |
| `d-flex`, `d-grid`, `d-sm-flex` | `flex`, `grid`, `sm:flex` |
| `flex-wrap`, `flex-shrink-0`, `flex-column` | `flex-wrap`, `shrink-0`, `flex-col` |
| `justify-content-between` / `justify-content-center` | `justify-between` / `justify-center` |
| `align-items-stretch` | `items-stretch` |
| `mb-*`, `mt-*`, `me-*`, `ms-*`, `py-*`, `px-*`, `gap-*` | same numeric scale: `mb-3`, `mt-6`, `me-1` → `mr-1`, `ms-1` → `ml-1`, `py-5`, `gap-2` |
| `btn btn-primary` | `inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50` |
| `btn btn-outline-primary` | `inline-flex items-center gap-1.5 rounded-md border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50` |
| `btn btn-outline-danger` | same pattern, `border-red-600 text-red-600 hover:bg-red-50` |
| `btn btn-outline-secondary` | same pattern, `border-gray-500 text-gray-700 hover:bg-gray-100` |
| `btn-sm` | `px-3 py-1 text-sm` |
| `btn-group` (used only as a row of clickable paws) | `inline-flex` |
| `card`, `card-body` | `rounded-lg border bg-white shadow-sm`, `p-4` |
| `display-4`, `display-6` | `text-5xl`, `text-3xl` |
| `lh-1`, `fw-bold`, `lead` | `leading-none`, `font-bold`, `text-lg text-gray-600` |
| `text-bg-dark` | `bg-gray-900 text-white` |
| `text-white`, `text-muted` | `text-white`, `text-gray-500` |
| `rounded-3`, `rounded-4`, `rounded-circle` | `rounded-lg`, `rounded-xl`, `rounded-full` |
| `shadow-lg`, `border-bottom` | `shadow-lg`, `border-b` |
| `img-fluid` | `max-w-full h-auto` |
| `list-group`, `list-group-item`, `list-group-item-action` | `divide-y rounded border`, `p-3`, `hover:bg-gray-50` |
| `nav`, `nav-link`, `link-dark` | `flex gap-2`, `px-2 py-1 text-gray-900 hover:underline`, n/a (covered by `text-gray-900`) |
| `overflow-hidden`, `h-100`, `w-100`, `w-auto`, `mx-auto` | `overflow-hidden`, `h-full`, `w-full`, `w-auto`, `mx-auto` |
| `visually-hidden` | `sr-only` |
| `spinner-border spinner-border-sm` | `<div class="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent">` |

For the `routerLinkActive="active"` underline in `navigation`, inline the underline as `[&.active]:underline [&.active]:decoration-gray-500 [&.active]:underline-offset-4` on the `<a>` and delete the `.active` SCSS rule (along with the `var(--bs-gray-500)` reference).

## Files changed

### Templates (8)

- `libs/dogs/ui/src/lib/dog-list/dog-list.component.html`
- `libs/dogs/ui/src/lib/dog-rate/dog-rate.component.html`
- `libs/dogs/ui/src/lib/single-dog/single-dog.component.html`
- `libs/dogs/ui/src/lib/dog-form/dog-form.component.html`
- `libs/dogs/feature/src/lib/dog-detail/dog-detail.component.html`
- `libs/dogs/feature/src/lib/my-dogs/my-dogs.component.html`
- `libs/shared/ui-common/src/lib/layout/layout.component.html`
- `libs/shared/ui-common/src/lib/navigation/navigation.component.html`

### Component SCSS (2)

- `libs/dogs/ui/src/lib/dog-list/dog-list.component.scss`
  - Delete the entire file. The three actually-used helpers are inlined into `dog-list.component.html` as Tailwind utilities:
    - `.card-cover` → `bg-no-repeat bg-center bg-cover` on the card div (the inline `style="background-image: url(...)"` stays).
    - `.card-hover` → `cursor-pointer`.
    - `.text-shadow-2` → `[text-shadow:0_0.25rem_0.5rem_rgba(0,0,0,0.25)]` arbitrary value on the `<h3>`.
  - Remove the `styleUrl: './dog-list.component.scss'` reference from `dog-list.component.ts`.
- `libs/shared/ui-common/src/lib/navigation/navigation.component.scss`
  - Replace `var(--bs-gray-500)` with a literal color, or inline the underline as a Tailwind utility on the `<a>` and delete the rule.

### App config (2)

- `apps/dog-rate-app/src/index.html` — remove Bootstrap CDN `<link>` and `<script>`.
- `apps/dog-rate-app/src/styles.scss` — add `@import "tailwindcss";`.

### Build config (2)

- `apps/dog-rate-app/postcss.config.js` — new file with `@tailwindcss/postcss` plugin.
- `package.json` — add `tailwindcss` and `@tailwindcss/postcss` to `devDependencies`; `package-lock.json` updated accordingly.

### Untouched

- `libs/dogs/ui/src/lib/dog-rate/dog-rate.component.scss` — no Bootstrap dependency.
- All other component SCSS files (empty or unrelated).
- All Font Awesome usage in templates and `index.html`.

## Verification

- `npm run build` succeeds with no `anyComponentStyle` budget warnings (Tailwind purge keeps bundles small).
- `npm run lint` passes.
- `npm test` passes.
- `npm start`, then walk through each screen in the browser and compare against the current Bootstrap rendering:
  - `/dogs` (list)
  - `/dogs` with a dog selected (rate)
  - `/dogs/my` (my-dogs list, single-dog tiles)
  - `/dogs/my/add` (dog-form)
  - `/dogs/details/<id>` (dog-detail)
  - `/about`
  - Navigation header in logged-in + logged-out states
  - Footer
- Take before/after screenshots of the three layout-dense screens (`dog-list`, `dog-detail`, `dog-rate`) to spot regressions.

## Out of scope

- Font Awesome migration or replacement.
- Any redesign, theming, or dark-mode work.
- Backend or other workspace changes.
- Touching component SCSS files that have no Bootstrap dependency.
