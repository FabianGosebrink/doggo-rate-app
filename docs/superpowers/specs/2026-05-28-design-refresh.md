# Design refresh: clean, lightweight UI on top of Tailwind v4

**Date:** 2026-05-28
**Status:** Approved
**Builds on:** `2026-05-28-bootstrap-to-tailwind-design.md`

## Goal

Bring the dog-rate-app from "stock Tailwind utility port" to a polished, cohesive interface — clean, lightweight, modern-neutral, inspired by Wealthfront's design language. Full polish across every screen.

## Brainstorming choices

- **Palette:** modern neutral. White surfaces, neutral grays, single saturated indigo accent (Tailwind's `indigo-600` family).
- **Dog tile layout:** keep the current photo-as-background with name overlay (refined, not replaced).
- **Typography:** Inter only (one typeface, modern geometric sans).
- **Scope:** all 8 screens + fix the broken About `<table>`.
- **Implementation approach:** small set of semantic `@theme` tokens for brand identity; default Tailwind palette for everything else.

## Design tokens

Replace the contents of `apps/dog-rate-app/src/styles.css` with:

```css
/* You can add global styles to this file, and also import other style files */
@import "tailwindcss";
@source "../../../libs";

@theme {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --color-brand: oklch(54.6% 0.245 262.881);        /* indigo-600 */
  --color-brand-hover: oklch(48.8% 0.243 264.376);  /* indigo-700 */
  --color-brand-soft: oklch(97% 0.014 254.604);     /* indigo-50  */
  --color-brand-ink: oklch(45.7% 0.24 277.023);     /* indigo-700 */
  --color-ink: oklch(13% 0.028 261.692);            /* zinc-950   */
  --color-muted: oklch(55.1% 0.027 264.364);        /* zinc-500   */
  --color-line: oklch(92.8% 0.006 264.531);         /* zinc-200   */
  --color-surface: #ffffff;
  --color-surface-2: oklch(96.7% 0.003 264.542);    /* zinc-100   */
}

@layer base {
  html {
    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
    color: var(--color-ink);
    background: var(--color-surface);
  }
  body { -webkit-font-smoothing: antialiased; }
}
```

These tokens become Tailwind utilities automatically: `bg-brand`, `bg-brand-soft`, `text-brand-ink`, `text-ink`, `text-muted`, `border-line`, `bg-surface-2`, `font-sans`, etc.

In `apps/dog-rate-app/src/index.html`, add Inter via Google Fonts inside `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
/>
```

## Layout & page chrome

- **Container:** `max-w-6xl mx-auto px-6 md:px-8`. Replaces the current `container mx-auto px-4` on `layout.component.html`.
- **Page section spacing:** `py-10 md:py-14` between major sections.
- **Page header pattern** (used on Home, My Dogs, About, etc.):
  ```html
  <header class="mb-8">
    <p class="text-xs uppercase tracking-wider text-muted mb-2">{{ eyebrow }}</p>
    <h1 class="text-3xl font-semibold text-ink">{{ title }}</h1>
  </header>
  ```

## Component patterns

These class strings are the canonical patterns. They appear repeatedly in the screen-by-screen sections below — change them here, change them everywhere.

| Pattern | Class string |
|---|---|
| Primary button (pill) | `inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed` |
| Secondary / outline button | `inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface-2 transition-colors` |
| Soft / chip button | `inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand-ink hover:bg-indigo-100 transition-colors` |
| Destructive outline button | `inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors` |
| Destructive icon-only (small) | `inline-flex items-center justify-center rounded-full border border-red-200 bg-white w-9 h-9 text-red-600 hover:bg-red-50 transition-colors` |
| Card | `rounded-2xl bg-white ring-1 ring-line shadow-sm` |
| Input | `block w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm placeholder:text-muted focus:border-brand focus:outline-none focus:ring-4 focus:ring-indigo-600/15` |
| Label | `block text-sm font-medium text-ink mb-1.5` |
| Eyebrow / metadata | `text-xs uppercase tracking-wider text-muted` |
| Hairline rule | `border-t border-line` |

## Screen-by-screen

### Navigation (`libs/shared/ui-common/src/lib/navigation/navigation.component.html`)

```html
<header class="flex items-center justify-between py-5 border-b border-line">
  <a [routerLink]="'/dogs'" class="text-lg font-semibold text-ink tracking-tight">Doggo</a>

  <nav class="hidden md:flex items-center gap-1">
    <a
      [routerLinkActiveOptions]="isActiveMatchOptions"
      [routerLink]="'/dogs'"
      queryParamsHandling="preserve"
      routerLinkActive="active"
      class="px-3 py-1.5 text-sm font-medium text-muted rounded-full hover:text-ink hover:bg-surface-2 [&.active]:text-brand-ink [&.active]:bg-brand-soft transition-colors"
    >Home</a>

    @if (loggedIn()) {
      <a
        [routerLink]="'/dogs/my'"
        [routerLinkActiveOptions]="isActiveMatchOptions"
        routerLinkActive="active"
        class="px-3 py-1.5 text-sm font-medium text-muted rounded-full hover:text-ink hover:bg-surface-2 [&.active]:text-brand-ink [&.active]:bg-brand-soft transition-colors"
      >My Dogs</a>
    }

    <a
      [routerLinkActiveOptions]="isActiveMatchOptions"
      [routerLink]="'about'"
      routerLinkActive="active"
      class="px-3 py-1.5 text-sm font-medium text-muted rounded-full hover:text-ink hover:bg-surface-2 [&.active]:text-brand-ink [&.active]:bg-brand-soft transition-colors"
    >About</a>
  </nav>

  @if (loggedIn()) {
    <button
      (click)="logout.emit()"
      type="button"
      class="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface-2 transition-colors"
    >
      <i class="fa-solid fa-right-from-bracket"></i> Logout
    </button>
  } @else {
    <button
      (click)="login.emit()"
      type="button"
      class="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-hover transition-colors"
    >
      <i class="fa-solid fa-right-to-bracket"></i> Login
    </button>
  }
</header>
```

The active nav-link pattern (subtle indigo-soft pill) replaces the underline. `navigation.component.scss` stays empty.

### Layout (`libs/shared/ui-common/src/lib/layout/layout.component.html`)

```html
<div class="max-w-6xl mx-auto px-6 md:px-8 min-h-screen flex flex-col">
  <lib-navigation
    (login)="authStore.login()"
    (logout)="authStore.logout()"
    [loggedIn]="authStore.isLoggedIn()"
  ></lib-navigation>

  <main class="flex-1 py-10 md:py-14">
    <router-outlet/>
  </main>

  <lib-footer
    [backendUrl]="backendUrl"
    [platform]="platform"
    [realTimeConnection]="realTimeStore.connectionStatus()"
    [userEmail]="authStore.userEmail()"
  ></lib-footer>
</div>
```

### Footer (`libs/shared/ui-common/src/lib/footer/footer.component.html`)

```html
<footer class="border-t border-line py-8 text-xs text-muted">
  <div class="grid gap-6 md:grid-cols-2">
    <div class="space-y-1.5">
      <div>Backend: <a [href]="backendUrl() + '/swagger/'" target="_blank" class="text-ink hover:text-brand-ink underline-offset-2 hover:underline">{{ backendUrl() }}</a></div>
      <div>RealTime: {{ realTimeConnection() }}</div>
      <div>&copy; {{ currentYear }} made with ♥️ by Fabian Gosebrink</div>
    </div>
    <div class="space-y-1.5 md:text-right">
      <div>Running on platform {{ platform() }}</div>
      @if (userEmail()) {
        <div>Logged in as {{ userEmail() }}</div>
      }
    </div>
  </div>
</footer>
```

### Home / dog-list (`libs/dogs/ui/src/lib/dog-list/dog-list.component.html`)

```html
<header class="mb-8">
  <p class="text-xs uppercase tracking-wider text-muted mb-2">Today's lineup</p>
  <h1 class="text-3xl font-semibold text-ink">Rate the dogs</h1>
</header>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
  @for (dog of dogs(); track dog.id) {
    <div
      class="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface-2 cursor-pointer ring-1 ring-line transition-transform hover:-translate-y-0.5 hover:shadow-md bg-no-repeat bg-center bg-cover"
      style="background-image: url('{{ dog.imageUrl }}');"
      tabindex="0"
      role="button"
      (click)="dogSelected.emit(dog.id)"
      (keydown.enter)="dogSelected.emit(dog.id)"
    >
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
      <div class="absolute inset-x-0 bottom-0 p-5">
        <h3 class="text-2xl font-semibold text-white drop-shadow-md">{{ dog.name }}</h3>
      </div>
    </div>
  }
</div>
```

Note: `dog-list.component.scss` was deleted in the Tailwind migration; no SCSS work needed.

### Rate / dog-rate (`libs/dogs/ui/src/lib/dog-rate/dog-rate.component.html`)

```html
@if (currentDog(); as dog) {
  <article class="max-w-2xl mx-auto">
    <div class="overflow-hidden rounded-3xl ring-1 ring-line">
      <img
        [src]="dog.imageUrl"
        [alt]="dog.name"
        class="w-full aspect-[4/3] object-cover"
        loading="lazy"
      />
    </div>

    <header class="text-center mt-8">
      <h1 class="text-4xl font-semibold text-ink">{{ dog?.name }}</h1>
      <p class="mt-3 text-lg text-muted">{{ dog.breed }} · {{ dog.comment }}</p>
    </header>

    <div class="mt-8 flex items-center justify-center gap-2" role="group" aria-label="Rate this dog">
      @for (rating of [1, 2, 3, 4, 5]; track $index) {
        <button
          (click)="rateDog(rating)"
          type="button"
          class="w-11 h-11 inline-flex items-center justify-center rounded-full text-2xl text-muted hover:bg-surface-2 transition-colors"
          [class.checked]="averageRating() > $index"
          [attr.aria-label]="'Rate ' + rating"
        >
          <i class="fa fa-paw"></i>
        </button>
      }
    </div>

    <p class="text-center mt-4 text-sm text-muted">
      {{ averageRating() | number: '1.2-2' }} / 5
    </p>

    <div class="mt-8 flex justify-center">
      <button
        (click)="skipped.emit()"
        type="button"
        class="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface-2 transition-colors"
      >
        Skip
      </button>
    </div>
  </article>
}
```

`dog-rate.component.scss` keeps its `.checked { color: orange; }` rule — but update it to indigo: `.checked { color: var(--color-brand); }`. The `.fa-paw { margin-left: 10px; }` and `.fa-star:hover { cursor: pointer; }` rules are no longer needed (handled by Tailwind utilities) — delete them. The `svg { pointer-events: all; }` rule stays.

### My Dogs (`libs/dogs/feature/src/lib/my-dogs/my-dogs.component.html`)

```html
<header class="mb-8 flex items-end justify-between gap-4">
  <div>
    <p class="text-xs uppercase tracking-wider text-muted mb-2">Your pack</p>
    <h1 class="text-3xl font-semibold text-ink">My Dogs</h1>
  </div>
  <button
    [routerLink]="['/dogs/my/add']"
    type="button"
    class="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-hover transition-colors"
  >
    <i class="fa-solid fa-plus"></i> Add Dog
  </button>
</header>

<div class="space-y-3">
  @for (dog of store.myDogs(); track dog.id) {
    <lib-single-dog [dog]="dog" (dogDeleted)="deleteDog($event)" />
  } @empty {
    <div class="rounded-2xl ring-1 ring-line bg-white p-10 text-center text-muted">
      No 🐕 added yet. Add one!
    </div>
  }
</div>
```

### Single dog row (`libs/dogs/ui/src/lib/single-dog/single-dog.component.html`)

```html
@if (dog(); as dog) {
  <article class="flex items-center gap-4 rounded-2xl bg-white ring-1 ring-line p-4 hover:shadow-sm transition-shadow">
    <div
      class="w-20 h-20 rounded-2xl bg-surface-2 bg-cover bg-center flex-shrink-0"
      style="background-image: url('{{ dog.imageUrl }}');"
    ></div>

    <div class="flex-1 min-w-0">
      <h3 class="font-semibold text-ink truncate">{{ dog.name }} <span class="text-muted font-normal">· {{ dog.breed }}</span></h3>
      <p class="text-sm text-muted mt-0.5">
        {{ dog.ratingSum / (dog.ratingCount || 1) | number: '1.2-2' }} / 5 · {{ dog.created | date: 'mediumDate' }}
      </p>
      @if (dog.comment) {
        <p class="text-sm text-muted mt-1 truncate">{{ dog.comment }}</p>
      }
    </div>

    <div class="flex items-center gap-2 flex-shrink-0">
      <a
        [routerLink]="['/dogs']"
        [queryParams]="{ dogId: dog.id }"
        class="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand-ink hover:bg-indigo-100 transition-colors"
        title="Rate"
      >
        <i class="fa-solid fa-star"></i> Rate
      </a>
      <a
        [routerLink]="['/dogs/details', dog.id]"
        class="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-ink hover:bg-surface-2 transition-colors"
        title="Go to detail"
      >
        <i class="fa-solid fa-arrow-right"></i>
      </a>
      <button
        type="button"
        (click)="dogDeleted.emit(dog)"
        class="inline-flex items-center justify-center rounded-full border border-red-200 bg-white w-8 h-8 text-red-600 hover:bg-red-50 transition-colors"
        title="Delete"
      >
        <i class="fa-solid fa-trash text-xs"></i>
      </button>
    </div>
  </article>
}
```

### Add dog form (`libs/dogs/ui/src/lib/dog-form/dog-form.component.html`)

**Important:** preserve all signal-forms bindings (`[formRoot]="form"`, `[formField]="…"`, `form.name().touched()`, `form.name().errors()`, etc.) byte-for-byte. Only class names and the surrounding markup change.

```html
<form [formRoot]="form" class="max-w-xl mx-auto space-y-5">
  <div>
    <label class="block text-sm font-medium text-ink mb-1.5" for="dogname">Name</label>
    <input
      class="block w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm placeholder:text-muted focus:border-brand focus:outline-none focus:ring-4 focus:ring-indigo-600/15"
      [formField]="form.name"
      id="dogname"
      type="text"
      placeholder="Bailey"
    />
    @if (form.name().touched() && form.name().invalid()) {
      <ul class="mt-1.5 text-xs text-red-600 space-y-0.5">
        @for (error of form.name().errors(); track error) {
          <li>{{ error.message }}</li>
        }
      </ul>
    }
  </div>

  <div>
    <label class="block text-sm font-medium text-ink mb-1.5" for="dogbreed">Breed</label>
    <input
      class="block w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm placeholder:text-muted focus:border-brand focus:outline-none focus:ring-4 focus:ring-indigo-600/15"
      [formField]="form.breed"
      id="dogbreed"
      type="text"
      placeholder="Golden Retriever"
    />
    @if (form.breed().touched() && form.breed().invalid()) {
      <ul class="mt-1.5 text-xs text-red-600 space-y-0.5">
        @for (error of form.breed().errors(); track error) {
          <li>{{ error.message }}</li>
        }
      </ul>
    }
  </div>

  <div>
    <label class="block text-sm font-medium text-ink mb-1.5" for="dogcomment">Comment</label>
    <input
      class="block w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm placeholder:text-muted focus:border-brand focus:outline-none focus:ring-4 focus:ring-indigo-600/15"
      [formField]="form.comment"
      id="dogcomment"
      type="text"
      placeholder="Loves a good belly rub."
    />
  </div>

  <div>
    <label class="block text-sm font-medium text-ink mb-1.5">Photo</label>
    <div class="rounded-2xl border-2 border-dashed border-line bg-surface-2 p-6 text-center">
      @if (base64()) {
        <img [src]="base64()" alt="preview" class="mx-auto mb-4 max-h-48 rounded-xl ring-1 ring-line" />
      } @else {
        <p class="text-sm text-muted mb-4">No photo yet — take one or choose a file.</p>
      }
      <input
        #fileInput
        (change)="setFormData(fileInput.files)"
        accept="image/*"
        hidden
        id="file"
        type="file"
      />
      <div class="flex items-center justify-center gap-3">
        <button
          (click)="takePhoto()"
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface-2 transition-colors"
        >
          <i class="fa-solid fa-camera"></i> Take picture
        </button>
        <button
          (click)="fileInput.click()"
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface-2 transition-colors"
        >
          <i class="fa-regular fa-file"></i> Choose file
        </button>
      </div>
      @if (filename()) {
        <p class="mt-3 text-xs text-muted truncate">{{ filename() }}</p>
      }
    </div>
  </div>

  <button
    [disabled]="!form().valid() || loading() === true"
    type="submit"
    class="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-medium text-white hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    @if (loading()) {
      <div class="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    }
    <i class="fa-solid fa-plus"></i> Add dog
  </button>
</form>
```

### Dog detail (`libs/dogs/feature/src/lib/dog-detail/dog-detail.component.html`)

```html
@if (store.detailDog(); as dog) {
  <article class="max-w-3xl mx-auto">
    <a
      [routerLink]="['/dogs/my']"
      [queryParams]="{ dogId: dog.id }"
      class="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors mb-6"
    >
      <i class="fa-solid fa-arrow-left"></i> Back to My Dogs
    </a>

    <div class="overflow-hidden rounded-3xl ring-1 ring-line">
      <img
        [ngSrc]="dog.imageUrl"
        width="800"
        height="600"
        alt="{{ dog.name }}"
        class="w-full aspect-[4/3] object-cover"
      />
    </div>

    <header class="mt-8 flex items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-semibold text-ink">{{ dog.name }}</h1>
        <p class="mt-1 text-muted">{{ dog.ratingSum / (dog.ratingCount || 1) | number: '1.2-2' }} / 5 · {{ dog.ratingCount }} ratings</p>
      </div>
      <div class="flex items-center gap-2">
        <a
          [routerLink]="['/dogs']"
          [queryParams]="{ dogId: dog.id }"
          class="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-hover transition-colors"
        >
          <i class="fa-solid fa-star"></i> Rate
        </a>
        <button
          type="button"
          (click)="deleteDog(dog)"
          class="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <i class="fa-solid fa-trash"></i> Delete
        </button>
      </div>
    </header>

    <dl class="mt-8 grid grid-cols-[max-content_1fr] gap-x-8 gap-y-3 text-sm">
      <dt class="text-muted">Breed</dt>
      <dd class="text-ink">{{ dog.breed }}</dd>

      <dt class="text-muted">Comment</dt>
      <dd class="text-ink">{{ dog.comment }}</dd>

      <dt class="text-muted">Added</dt>
      <dd class="text-ink">{{ dog.created | date: 'medium' }}</dd>

      <dt class="text-muted">Ratings received</dt>
      <dd class="text-ink">{{ dog.ratingCount }}</dd>

      <dt class="text-muted">Image URL</dt>
      <dd class="text-ink min-w-0"><a [href]="dog.imageUrl" class="text-brand-ink hover:underline underline-offset-2 break-all">{{ dog.imageUrl }}</a></dd>
    </dl>
  </article>
} @else {
  <p class="text-center text-muted">Loading...</p>
}
```

### About (`libs/about/feature/src/lib/about/about.component.html`)

Fix the broken `<table class="table">`. New template:

```html
<header class="mb-8">
  <p class="text-xs uppercase tracking-wider text-muted mb-2">Diagnostics</p>
  <h1 class="text-3xl font-semibold text-ink">About this device</h1>
</header>

@if (deviceInfo()) {
  <dl class="divide-y divide-line rounded-2xl ring-1 ring-line bg-white">
    <div class="flex items-center justify-between gap-4 px-5 py-3 text-sm">
      <dt class="text-muted">userAgent</dt>
      <dd class="font-mono text-ink text-right break-all">{{ userAgent }}</dd>
    </div>
    @for (item of deviceInfo() | keyvalue; track item.key) {
      <div class="flex items-center justify-between gap-4 px-5 py-3 text-sm">
        <dt class="text-muted">{{ item.key }}</dt>
        <dd class="font-mono text-ink text-right break-all">{{ item.value | json }}</dd>
      </div>
    }
  </dl>
}
```

## Files changed

### Templates (10)

- `libs/shared/ui-common/src/lib/layout/layout.component.html`
- `libs/shared/ui-common/src/lib/navigation/navigation.component.html`
- `libs/shared/ui-common/src/lib/footer/footer.component.html`
- `libs/dogs/ui/src/lib/dog-list/dog-list.component.html`
- `libs/dogs/ui/src/lib/dog-rate/dog-rate.component.html`
- `libs/dogs/ui/src/lib/single-dog/single-dog.component.html`
- `libs/dogs/ui/src/lib/dog-form/dog-form.component.html`
- `libs/dogs/feature/src/lib/my-dogs/my-dogs.component.html`
- `libs/dogs/feature/src/lib/dog-detail/dog-detail.component.html`
- `libs/about/feature/src/lib/about/about.component.html`

### Component SCSS (1 edit)

- `libs/dogs/ui/src/lib/dog-rate/dog-rate.component.scss` — change `.checked { color: orange; }` to `.checked { color: var(--color-brand); }`; delete the `.fa-paw { margin-left }` and `.fa-star:hover { cursor }` rules.

### App-level

- `apps/dog-rate-app/src/styles.css` — add the `@theme` block and `@layer base` for Inter and ink/surface defaults.
- `apps/dog-rate-app/src/index.html` — add the Google Fonts `<link>` for Inter.

## Verification

- `npm run build` succeeds, no new budget warnings beyond pre-existing.
- `npm run lint` and `npm test` show no new failures vs current branch tip.
- The built `styles.css` contains rules for the new tokens: grep for `\.bg-brand`, `\.text-brand-ink`, `\.text-ink`, `\.text-muted`, `\.border-line`.
- Inter loads in the browser (DevTools → Network → fonts → `Inter-*.woff2` 200 OK).
- Manual walkthrough of every screen against the design described above.

## Out of scope

- Logo / wordmark design (a text wordmark "Doggo" is used; replace with a real logo later if desired).
- Dark mode.
- Animations beyond `transition-colors` and `transition-shadow` on hover.
- Photography or illustration changes.
- The signal-forms WIP in `dog-form.component.ts` — bindings preserved; only template classes change.
- Toast styling (ngx-toastr ships its own CSS; left alone).
