# Design Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved clean/lightweight design refresh — modern neutral palette, Inter typography, semantic `@theme` tokens, generous spacing, pill buttons, ring-1 cards — across all 10 templates.

**Architecture:** Define a small set of brand-identity tokens via Tailwind v4's `@theme` block in `apps/dog-rate-app/src/styles.css`. Load Inter from Google Fonts in `index.html`. Apply the documented component patterns (buttons, inputs, cards, page-headers) by replacing each template with its new version from the spec. One template per commit; build verification after each.

**Tech Stack:** Angular 21, Tailwind v4 with `@tailwindcss/postcss`, Inter font (Google Fonts), Font Awesome (unchanged).

**Spec:** `docs/superpowers/specs/2026-05-28-design-refresh.md`

**Critical scope notes:**
- `dog-form.component.html` contains in-progress signal-forms bindings (`[formRoot]`, `[formField]`, `form.name().touched()`, etc.). These are out of scope; only class names and surrounding markup change. Bindings, directives, and expressions are preserved verbatim.
- `dog-form.component.ts`, all other `.ts` files, and SCSS files other than `dog-rate.component.scss` are untouched.

---

## Task 1: Add design tokens and load Inter

**Files:**
- Modify: `apps/dog-rate-app/src/styles.css`
- Modify: `apps/dog-rate-app/src/index.html`

- [ ] **Step 1: Replace `apps/dog-rate-app/src/styles.css` with:**

```css
/* You can add global styles to this file, and also import other style files */
@import "tailwindcss";
@source "../../../libs";

@theme {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --color-brand: oklch(54.6% 0.245 262.881);
  --color-brand-hover: oklch(48.8% 0.243 264.376);
  --color-brand-soft: oklch(97% 0.014 254.604);
  --color-brand-ink: oklch(45.7% 0.24 277.023);
  --color-ink: oklch(13% 0.028 261.692);
  --color-muted: oklch(55.1% 0.027 264.364);
  --color-line: oklch(92.8% 0.006 264.531);
  --color-surface: #ffffff;
  --color-surface-2: oklch(96.7% 0.003 264.542);
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

- [ ] **Step 2: Replace `apps/dog-rate-app/src/index.html` with:**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Dog Rating App</title>
  <base href="/" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" type="image/x-icon" href="favicon.ico" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
    integrity="sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
</head>
<body>
<app-root></app-root>
<script
  src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/js/all.min.js"
  integrity="sha512-naukR7I+Nk6gp7p5TMA4ycgfxaZBJ7MO5iC3Fp6ySQyKFHOGfpkSZkYVWV5R7u7cfAicxanwYQ5D1e17EfJcMA=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
></script>
</body>
</html>
```

- [ ] **Step 3: Verify the build still works**

Run: `npx nx build dog-rate-app --configuration=development --skip-nx-cache`

Expected: build succeeds. The Inter `<link>` is added; everything else in `index.html` is unchanged from the post-migration baseline.

- [ ] **Step 4: Verify the new tokens generate utility classes**

Run: `grep -cE '\.(bg-brand|text-ink|text-muted|border-line|text-brand-ink)' dist/apps/dog-rate-app/browser/styles.css`

Expected: output > 0 (at least one of these tokens compiles, even though no template uses them yet — Tailwind v4 emits CSS variables for `@theme` values even when no class consumes them; what we're really checking is that the rebuild ran and the file was regenerated).

- [ ] **Step 5: Commit**

```bash
git add apps/dog-rate-app/src/styles.css apps/dog-rate-app/src/index.html
git commit -m "Add design tokens and load Inter font"
```

---

## Task 2: Convert `layout.component.html`

**Files:**
- Modify: `libs/shared/ui-common/src/lib/layout/layout.component.html`

- [ ] **Step 1: Replace the file with:**

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

- [ ] **Step 2: Verify build**

`npx nx build dog-rate-app --configuration=development --skip-nx-cache` → succeeds.

- [ ] **Step 3: Commit**

```bash
git add libs/shared/ui-common/src/lib/layout/layout.component.html
git commit -m "Polish layout: max-w-6xl, generous padding, sticky footer"
```

---

## Task 3: Convert `navigation.component.html`

**Files:**
- Modify: `libs/shared/ui-common/src/lib/navigation/navigation.component.html`

- [ ] **Step 1: Replace the file with:**

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

- [ ] **Step 2: Verify build** — `npx nx build dog-rate-app --configuration=development --skip-nx-cache` → succeeds.

- [ ] **Step 3: Commit**

```bash
git add libs/shared/ui-common/src/lib/navigation/navigation.component.html
git commit -m "Polish navigation: wordmark, soft pill active state, brand login"
```

---

## Task 4: Convert `footer.component.html`

**Files:**
- Modify: `libs/shared/ui-common/src/lib/footer/footer.component.html`

- [ ] **Step 1: Replace the file with:**

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

- [ ] **Step 2: Verify build** — `npx nx build dog-rate-app --configuration=development --skip-nx-cache` → succeeds.

- [ ] **Step 3: Commit**

```bash
git add libs/shared/ui-common/src/lib/footer/footer.component.html
git commit -m "Polish footer: two-column grid, hairline rule, muted typography"
```

---

## Task 5: Convert `dog-list.component.html` (home grid)

**Files:**
- Modify: `libs/dogs/ui/src/lib/dog-list/dog-list.component.html`

- [ ] **Step 1: Replace the file with:**

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

- [ ] **Step 2: Verify build** — `npx nx build dog-rate-app --configuration=development --skip-nx-cache` → succeeds.

- [ ] **Step 3: Commit**

```bash
git add libs/dogs/ui/src/lib/dog-list/dog-list.component.html
git commit -m "Polish dog-list: eyebrow+h1 header, ring-1 tiles, hover lift"
```

---

## Task 6: Convert `dog-rate.component.html` and update SCSS

**Files:**
- Modify: `libs/dogs/ui/src/lib/dog-rate/dog-rate.component.html`
- Modify: `libs/dogs/ui/src/lib/dog-rate/dog-rate.component.scss`

- [ ] **Step 1: Replace `libs/dogs/ui/src/lib/dog-rate/dog-rate.component.html` with:**

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

- [ ] **Step 2: Replace `libs/dogs/ui/src/lib/dog-rate/dog-rate.component.scss` with:**

```scss
.checked {
  color: var(--color-brand);
}

svg {
  pointer-events: all;
}
```

(Dropped: `.fa-paw { margin-left: 10px; }` — paw spacing now handled by `gap-2` on the parent `flex` row. Dropped: `.fa-star:hover { cursor: pointer; }` — no `.fa-star` element exists in this template; the rating row uses `.fa-paw`, and `cursor` defaults are handled by the `<button>` elements.)

- [ ] **Step 3: Verify build** — `npx nx build dog-rate-app --configuration=development --skip-nx-cache` → succeeds.

- [ ] **Step 4: Commit**

```bash
git add libs/dogs/ui/src/lib/dog-rate/dog-rate.component.html libs/dogs/ui/src/lib/dog-rate/dog-rate.component.scss
git commit -m "Polish dog-rate: hero image, larger paws, brand-colored checked state"
```

---

## Task 7: Convert `single-dog.component.html`

**Files:**
- Modify: `libs/dogs/ui/src/lib/single-dog/single-dog.component.html`

- [ ] **Step 1: Replace the file with:**

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

- [ ] **Step 2: Verify build** — `npx nx build dog-rate-app --configuration=development --skip-nx-cache` → succeeds.

- [ ] **Step 3: Commit**

```bash
git add libs/dogs/ui/src/lib/single-dog/single-dog.component.html
git commit -m "Polish single-dog row: rounded avatar, soft chip actions"
```

---

## Task 8: Convert `my-dogs.component.html`

**Files:**
- Modify: `libs/dogs/feature/src/lib/my-dogs/my-dogs.component.html`

- [ ] **Step 1: Replace the file with:**

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

- [ ] **Step 2: Verify build** — `npx nx build dog-rate-app --configuration=development --skip-nx-cache` → succeeds.

- [ ] **Step 3: Commit**

```bash
git add libs/dogs/feature/src/lib/my-dogs/my-dogs.component.html
git commit -m "Polish my-dogs: eyebrow+h1 header, ring-1 empty state"
```

---

## Task 9: Convert `dog-form.component.html` (classes only; preserve signal-forms bindings)

**Files:**
- Modify: `libs/dogs/ui/src/lib/dog-form/dog-form.component.html`

**CRITICAL:** Every `[formRoot]`, `[formField]`, `form.name().touched()`, `form.name().errors()`, `form.name().invalid()`, `form.breed().*`, `form().valid()`, etc. binding/expression is preserved byte-for-byte. Only classes, surrounding markup, and the spinner/preview/file-input structure change.

- [ ] **Step 1: Replace the file with:**

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

- [ ] **Step 2: Verify build** — `npx nx build dog-rate-app --configuration=development --skip-nx-cache` → succeeds (any pre-existing signal-forms warnings are unchanged).

- [ ] **Step 3: Confirm all signal-forms bindings preserved**

Run:

```bash
for s in '[formRoot]="form"' '[formField]="form.name"' '[formField]="form.breed"' '[formField]="form.comment"' 'form.name().touched()' 'form.name().errors()' 'form.breed().touched()' 'form.breed().errors()' 'form().valid()'; do
  c=$(grep -F "$s" libs/dogs/ui/src/lib/dog-form/dog-form.component.html | wc -l)
  echo "$c × $s"
done
```

Expected: each line shows `1 × …` (the expression appears once).

- [ ] **Step 4: Commit**

```bash
git add libs/dogs/ui/src/lib/dog-form/dog-form.component.html
git commit -m "Polish dog-form: vertical rhythm, dashed photo dropzone, full-width submit"
```

---

## Task 10: Convert `dog-detail.component.html`

**Files:**
- Modify: `libs/dogs/feature/src/lib/dog-detail/dog-detail.component.html`

- [ ] **Step 1: Replace the file with:**

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

- [ ] **Step 2: Verify build** — `npx nx build dog-rate-app --configuration=development --skip-nx-cache` → succeeds.

- [ ] **Step 3: Commit**

```bash
git add libs/dogs/feature/src/lib/dog-detail/dog-detail.component.html
git commit -m "Polish dog-detail: hero image, definition list metadata"
```

---

## Task 11: Convert `about.component.html` (fix broken table)

**Files:**
- Modify: `libs/about/feature/src/lib/about/about.component.html`

- [ ] **Step 1: Replace the file with:**

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

- [ ] **Step 2: Verify build** — `npx nx build dog-rate-app --configuration=development --skip-nx-cache` → succeeds.

- [ ] **Step 3: Commit**

```bash
git add libs/about/feature/src/lib/about/about.component.html
git commit -m "Polish about: definition list replaces broken Bootstrap table"
```

---

## Task 12: Final verification

**Files:** none modified unless regressions are found.

- [ ] **Step 1: Production build**

Run: `npx nx build dog-rate-app --skip-nx-cache`

Expected: build succeeds. The `initial` budget warning may still appear (pre-existing on `main`). No `anyComponentStyle` budget errors. No NEW errors.

- [ ] **Step 2: Confirm new tokens compile into utility classes**

Run:

```bash
for cls in bg-brand bg-brand-soft bg-brand-hover text-brand-ink text-ink text-muted border-line bg-surface-2; do
  c=$(grep -c "\.$cls" dist/apps/dog-rate-app/browser/styles.css)
  echo "  .$cls → $c rule(s)"
done
```

Expected: each token has at least 1 rule (depends on which templates use it; all should be > 0 because every token is referenced somewhere across the new templates).

- [ ] **Step 3: Confirm Inter is loaded by the page**

Run: `grep -nE 'Inter:wght|fonts\.googleapis' apps/dog-rate-app/src/index.html`

Expected: one match for the Inter Google Fonts link. (Browser verification of the actual font network request is deferred to the human walkthrough.)

- [ ] **Step 4: Confirm no Bootstrap-style remnants reintroduced**

Run:

```bash
grep -rnE '\b(d-flex|d-grid|btn-primary|btn-outline-|card-body|list-group|nav-link|text-muted\b(?!.))' libs apps/dog-rate-app/src --include='*.html' 2>/dev/null || echo "clean"
```

(Note: `text-muted` is now a Tailwind utility from our `@theme` token, so a class attribute containing `text-muted` is now correct. The grep regex is designed to error toward false-positives we can review by hand.) Expected: only matches to `text-muted` as a standalone Tailwind class on elements (those are the new design tokens, not Bootstrap remnants).

- [ ] **Step 5: Lint**

Run: `npm run lint`

Expected: passes; only pre-existing warnings.

- [ ] **Step 6: Unit tests**

Run: `npm test`

Expected: same failure set as before this design refresh (pre-existing dog-form signal-forms × 4 and desktop-camera timeout × 1). No NEW failures.

- [ ] **Step 7: Push when ready**

Only after the human controller confirms (which will happen after they walk through the screens in the browser):

```bash
git push
```
