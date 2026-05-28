# Bootstrap → Tailwind v4 Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Bootstrap 5.2.2 with Tailwind v4 in the `dog-rate-app`, preserving the current visual design.

**Architecture:** Install Tailwind v4 via `@tailwindcss/postcss`, keep Bootstrap loaded while converting templates one by one (so the app stays styled at every commit), then remove the Bootstrap CDN tags last. Pure Tailwind utilities — no daisyUI, no component library on top.

**Tech Stack:** Angular 21, Nx 22, `@angular/build:application` (Vite), Tailwind v4, PostCSS, SCSS for component styles.

**Spec:** `docs/superpowers/specs/2026-05-28-bootstrap-to-tailwind-design.md`

**Critical scope note:** `libs/dogs/ui/src/lib/dog-form/dog-form.component.html` has an in-progress signal-forms migration (`[formField]`, `[formRoot]`, `form.name().touched()`, etc.) that is **out of scope** for this plan. When you edit that file, **only swap Bootstrap class names** — do not touch any binding, directive, expression, or import related to the form.

---

## Task 1: Install Tailwind v4 alongside Bootstrap

**Files:**
- Modify: `package.json` (devDependencies)
- Create: `apps/dog-rate-app/postcss.config.js`
- Modify: `apps/dog-rate-app/src/styles.scss`

- [ ] **Step 1: Install Tailwind v4 + PostCSS plugin**

```bash
npm install -D tailwindcss@^4 @tailwindcss/postcss@^4
```

Expected: `package.json` and `package-lock.json` updated, no errors.

- [ ] **Step 2: Create the PostCSS config for the app**

Create `apps/dog-rate-app/postcss.config.js` with:

```js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

`@angular/build` auto-discovers a `postcss.config.js` next to the project — no `project.json` edit is needed.

- [ ] **Step 3: Add the Tailwind import to the global stylesheet**

Replace the contents of `apps/dog-rate-app/src/styles.scss` with:

```scss
/* You can add global styles to this file, and also import other style files */
@import "tailwindcss";
```

- [ ] **Step 4: Verify the build succeeds with Tailwind active**

Run: `npx nx build dog-rate-app --configuration=development`

Expected: build completes successfully. No `anyComponentStyle` budget warnings.

- [ ] **Step 5: Smoke-test in the browser**

Run: `npm start`

Open `http://localhost:4200`. The app should look **identical to before** (Bootstrap is still loaded). Tailwind base styles will be present but no Tailwind utility classes are used yet.

Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json apps/dog-rate-app/postcss.config.js apps/dog-rate-app/src/styles.scss
git commit -m "Install Tailwind v4 alongside Bootstrap"
```

---

## Task 2: Convert `layout.component.html`

**Files:**
- Modify: `libs/shared/ui-common/src/lib/layout/layout.component.html`

- [ ] **Step 1: Replace the file contents**

Current contents wrap everything in a Bootstrap `container`. Replace the file with:

```html
<div class="container mx-auto px-4">
  <lib-navigation
    (login)="authStore.login()"
    (logout)="authStore.logout()"
    [loggedIn]="authStore.isLoggedIn()"
  ></lib-navigation>

  <router-outlet/>

  <lib-footer
    [backendUrl]="backendUrl"
    [platform]="platform"
    [realTimeConnection]="realTimeStore.connectionStatus()"
    [userEmail]="authStore.userEmail()"
  ></lib-footer>
</div>
```

- [ ] **Step 2: Verify in the browser**

Run: `npm start`, load `http://localhost:4200`. The page should still be centered with horizontal padding (matches Bootstrap's `container`). Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add libs/shared/ui-common/src/lib/layout/layout.component.html
git commit -m "Convert layout component to Tailwind"
```

---

## Task 3: Convert `navigation` (template + delete `.active` SCSS rule)

**Files:**
- Modify: `libs/shared/ui-common/src/lib/navigation/navigation.component.html`
- Modify: `libs/shared/ui-common/src/lib/navigation/navigation.component.scss`

- [ ] **Step 1: Replace template contents**

Replace the file with:

```html
<header class="flex flex-wrap justify-between py-3 mb-4 border-b">
  <div>
    <ul class="flex w-full md:w-auto mb-2 justify-center md:mb-0">
      <li>
        <a
          [routerLinkActiveOptions]="isActiveMatchOptions"
          [routerLink]="'/dogs'"
          queryParamsHandling="preserve"
          class="px-2 py-1 text-gray-900 hover:underline [&.active]:underline [&.active]:decoration-gray-500 [&.active]:underline-offset-4"
          routerLinkActive="active"
        >Home</a>
      </li>

      @if (loggedIn()) {
        <li>
          <a
            [routerLink]="'/dogs/my'"
            routerLinkActive="active"
            [routerLinkActiveOptions]="isActiveMatchOptions"
            class="px-2 py-1 text-gray-900 hover:underline [&.active]:underline [&.active]:decoration-gray-500 [&.active]:underline-offset-4"
          >My Dogs</a>
        </li>
      }

      <li>
        <a
          [routerLinkActiveOptions]="isActiveMatchOptions"
          [routerLink]="'about'"
          class="px-2 py-1 text-gray-900 hover:underline [&.active]:underline [&.active]:decoration-gray-500 [&.active]:underline-offset-4"
          routerLinkActive="active"
        >About</a>
      </li>
    </ul>
  </div>
  <div>
    @if (loggedIn()) {
      <button
        (click)="logout.emit()"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-md border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50">
        <i class="fa-solid fa-right-from-bracket"></i> Logout
      </button>
    } @else {
      <button
        (click)="login.emit()"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-md border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50">
        <i class="fa-solid fa-right-to-bracket"></i> Login
      </button>
    }
  </div>
</header>
```

- [ ] **Step 2: Replace `navigation.component.scss` with an empty file**

Open `libs/shared/ui-common/src/lib/navigation/navigation.component.scss` and replace its full contents with an empty file (no rules). The `.active` underline now lives inline on each `<a>` via the `[&.active]:…` Tailwind variants.

We're leaving the file in place (empty) so we don't have to touch `styleUrls` in `navigation.component.ts`.

- [ ] **Step 3: Verify in the browser**

Run: `npm start`. Visit `/dogs`, then `/about`, then `/dogs/my` while logged in. The active nav link should be underlined; non-active links should not be. Login/Logout button should be outlined blue. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add libs/shared/ui-common/src/lib/navigation/navigation.component.html libs/shared/ui-common/src/lib/navigation/navigation.component.scss
git commit -m "Convert navigation component to Tailwind"
```

---

## Task 4: Convert `dog-list` (template + delete SCSS file + remove styleUrl)

**Files:**
- Modify: `libs/dogs/ui/src/lib/dog-list/dog-list.component.html`
- Delete: `libs/dogs/ui/src/lib/dog-list/dog-list.component.scss`
- Modify: `libs/dogs/ui/src/lib/dog-list/dog-list.component.ts`

- [ ] **Step 1: Replace template contents**

Replace the file with:

```html
<div class="grid grid-cols-1 lg:grid-cols-3 items-stretch gap-4 py-5">
  @for (dog of dogs(); track dog.id) {
    <div>
      <div
        class="h-full overflow-hidden bg-gray-900 text-white rounded-xl shadow-lg cursor-pointer bg-no-repeat bg-center bg-cover"
        style="background-image: url('{{ dog.imageUrl }}');"
        tabindex="0"
        role="button"
        (click)="dogSelected.emit(dog.id)"
        (keydown.enter)="dogSelected.emit(dog.id)"
      >
        <div class="flex flex-col h-full p-5 pb-3 text-white">
          <h3
            class="pt-5 mt-5 mb-4 text-3xl leading-none font-bold [text-shadow:0_0.25rem_0.5rem_rgba(0,0,0,0.25)]"
          >
            {{ dog.name }}
          </h3>
        </div>
      </div>
    </div>
  }
</div>
```

- [ ] **Step 2: Delete the SCSS file**

Run: `rm libs/dogs/ui/src/lib/dog-list/dog-list.component.scss`

- [ ] **Step 3: Remove the `styleUrls` reference from the component**

In `libs/dogs/ui/src/lib/dog-list/dog-list.component.ts`, change the `@Component` decorator from:

```ts
@Component({
  selector: 'lib-dog-list',
  templateUrl: './dog-list.component.html',
  styleUrls: ['./dog-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

to:

```ts
@Component({
  selector: 'lib-dog-list',
  templateUrl: './dog-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

- [ ] **Step 4: Verify build still works**

Run: `npx nx build dog-rate-app --configuration=development`

Expected: build succeeds.

- [ ] **Step 5: Verify in the browser**

Run: `npm start`. Visit `/dogs` (logged in or not). The dog tiles should be a 1-column grid on mobile, 3 columns on `lg` (≥1024px), with the dog photo as background, dark overlay, name in bold white text with a soft shadow at the bottom. Clicking a tile should still navigate. Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add libs/dogs/ui/src/lib/dog-list
git commit -m "Convert dog-list component to Tailwind"
```

---

## Task 5: Convert `dog-rate.component.html`

**Files:**
- Modify: `libs/dogs/ui/src/lib/dog-rate/dog-rate.component.html`

Leaves `dog-rate.component.scss` (`.checked`, `.fa-paw`, `.fa-star:hover`, `svg`) untouched — no Bootstrap dependency.

- [ ] **Step 1: Replace template contents**

Replace the file with:

```html
@if (currentDog(); as dog) {
  <div class="px-4 my-5 text-center border-b">
    <h1 class="text-5xl font-bold">{{ dog?.name }}</h1>
    <div class="lg:w-1/2 mx-auto">
      <p class="text-lg text-gray-600 mb-4">{{ dog.breed }}. {{ dog.comment }}</p>
    </div>
    <div class="grid gap-2 sm:flex sm:justify-center mb-3">
      <div class="inline-flex" role="group">
        @for (rating of [1, 2, 3, 4, 5]; track $index) {
          <div
            (click)="rateDog(rating)"
            [class]="{ checked: averageRating() > $index }"
            aria-hidden="true"
          >
            <i class="fa fa-paw fa-xl"></i>
          </div>
        }
      </div>
    </div>

    <h3>{{ averageRating() | number: '1.2-2' }} / 5</h3>

    <div class="grid gap-2 sm:flex sm:justify-center mb-5">
      <button
        (click)="skipped.emit()"
        class="inline-flex items-center gap-1.5 rounded-md border border-gray-500 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
        type="button"
      >
        Skip
      </button>
    </div>

    <div class="overflow-hidden">
      <div class="container mx-auto px-5">
        <img
          [src]="dog.imageUrl"
          alt="Example image"
          class="max-w-full h-auto border rounded-lg mb-4"
          height="500"
          loading="lazy"
          width="700"
        />
      </div>
    </div>
  </div>
}
```

- [ ] **Step 2: Verify in the browser**

Run: `npm start`. Visit `/dogs` and click a dog to land on the rate view. Confirm: centered layout, big dog name, lead paragraph, paw row, skip button (small outlined gray), and centered image with a rounded border. The `.checked` orange paw highlighting should still work. Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add libs/dogs/ui/src/lib/dog-rate/dog-rate.component.html
git commit -m "Convert dog-rate component to Tailwind"
```

---

## Task 6: Convert `single-dog.component.html`

**Files:**
- Modify: `libs/dogs/ui/src/lib/single-dog/single-dog.component.html`

- [ ] **Step 1: Replace template contents**

Replace the file with:

```html
@if (dog(); as dog) {
  <div
    class="flex gap-3 py-3 px-3 hover:bg-gray-50"
    aria-current="true"
  >
    <div
      class="rounded-full shrink-0"
      style="
        background-image: url('{{ dog.imageUrl }}');
        width: 80px;
        height: 80px;
        background-size: 90px;
        background-position: center;
      "
    ></div>
    <div class="flex gap-2 w-full justify-between">
      <div>
        <h6 class="mb-0 font-semibold">{{ dog.name }} ({{ dog.breed }})</h6>
        <p class="mb-0 opacity-75">
          {{ dog.ratingSum / (dog.ratingCount || 1) | number: '1.2-2' }}/5
        </p>
        <p class="mb-0 opacity-75">
          {{ dog.comment }}
        </p>
        <p class="mb-0 opacity-75">{{ dog.created | date: 'medium' }}</p>
      </div>
      <div>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-md border border-blue-600 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 mr-1"
          [routerLink]="['/dogs']"
          [queryParams]="{ dogId: dog.id }"
        >
          <i class="fa-solid fa-star"></i> Rate
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-md border border-blue-600 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 mr-1"
          [routerLink]="['/dogs/details', dog.id]"
        >
          <i class="fa-solid fa-arrow-right"></i> Go to
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-md border border-red-600 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
          (click)="dogDeleted.emit(dog)"
        >
          <i class="fa-solid fa-trash"></i> Delete
        </button>
      </div>
    </div>
  </div>
}
```

- [ ] **Step 2: Verify in the browser**

Run: `npm start`, log in, visit `/dogs/my`. Each row should show a round dog avatar (80px), text on the left, three small outlined buttons (blue, blue, red) on the right. Hover row highlight should be subtle gray. Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add libs/dogs/ui/src/lib/single-dog/single-dog.component.html
git commit -m "Convert single-dog component to Tailwind"
```

---

## Task 7: Convert `my-dogs.component.html`

**Files:**
- Modify: `libs/dogs/feature/src/lib/my-dogs/my-dogs.component.html`

- [ ] **Step 1: Replace template contents**

Replace the file with:

```html
<div class="flex justify-between">
  <h2>Your Dogs</h2>
  <button
    [routerLink]="['/dogs/my/add']"
    class="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 mt-6"
    type="button"
  >
    <i class="fa-solid fa-plus"></i> Add Dog
  </button>
</div>

<div class="divide-y rounded border w-auto mt-5">
  @for (dog of store.myDogs(); track dog.id) {
    <lib-single-dog [dog]="dog" (dogDeleted)="deleteDog($event)" />
  } @empty {
    <div>No 🐕 added yet. Add one!</div>
  }
</div>
```

- [ ] **Step 2: Verify in the browser**

Run: `npm start`, log in, visit `/dogs/my`. The header row should have the title left and a blue "Add Dog" button right; the list should be inside a bordered box with dividers between rows. Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add libs/dogs/feature/src/lib/my-dogs/my-dogs.component.html
git commit -m "Convert my-dogs component to Tailwind"
```

---

## Task 8: Convert `dog-detail.component.html`

**Files:**
- Modify: `libs/dogs/feature/src/lib/dog-detail/dog-detail.component.html`

- [ ] **Step 1: Replace template contents**

Replace the file with:

```html
@if (store.detailDog(); as dog) {
  <div class="flex justify-between mb-3">
    <button
      type="button"
      class="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      [routerLink]="['/dogs/my']"
      [queryParams]="{ dogId: dog.id }"
    >
      <i class="fa-solid fa-arrow-left"></i> Back
    </button>
  </div>

  <div class="flex flex-wrap -mx-2">
    <div class="w-full lg:w-1/3 px-2">
      <div class="rounded-lg border bg-white shadow-sm mb-4">
        <div class="p-4 text-center">
          <img
            [ngSrc]="dog.imageUrl"
            width="100"
            height="100"
            alt="avatar"
            class="max-w-full h-auto"
            style="width: 350px"
          />
          <h5 class="my-3">{{ dog.name }}</h5>
          <p class="text-gray-500 mb-3">
            {{ dog.ratingSum / (dog.ratingCount || 1) | number: '1.2-2' }}/5
          </p>
          <div class="flex justify-center mb-2">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              [routerLink]="['/dogs']"
              [queryParams]="{ dogId: dog.id }"
            >
              <i class="fa-solid fa-star"></i> Rate
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-md border border-red-600 px-4 py-2 text-red-600 hover:bg-red-50 ml-1"
              (click)="deleteDog(dog)"
            >
              <i class="fa-solid fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full lg:w-2/3 px-2">
      <div class="rounded-lg border bg-white shadow-sm mb-4">
        <div class="p-4">
          <div class="flex flex-wrap -mx-2">
            <div class="w-1/4 px-2">
              <p class="mb-0">Breed</p>
            </div>
            <div class="w-3/4 px-2">
              <p class="text-gray-500 mb-0">{{ dog.breed }}</p>
            </div>
          </div>
          <hr />
          <div class="flex flex-wrap -mx-2">
            <div class="w-1/4 px-2">
              <p class="mb-0">Comment</p>
            </div>
            <div class="w-3/4 px-2">
              <p class="text-gray-500 mb-0">{{ dog.comment }}</p>
            </div>
          </div>
          <hr />
          <div class="flex flex-wrap -mx-2">
            <div class="w-1/4 px-2">
              <p class="mb-0">Added</p>
            </div>
            <div class="w-3/4 px-2">
              <p class="text-gray-500 mb-0">
                {{ dog.created | date: 'medium' }}
              </p>
            </div>
          </div>
          <hr />
          <div class="flex flex-wrap -mx-2">
            <div class="w-1/4 px-2">
              <p class="mb-0">Rates Received</p>
            </div>
            <div class="w-3/4 px-2">
              <p class="text-gray-500 mb-0">{{ dog.ratingCount }}</p>
            </div>
          </div>
          <hr />
          <div class="flex flex-wrap -mx-2">
            <div class="w-1/4 px-2">
              <p class="mb-0">Image Url</p>
            </div>
            <div class="w-3/4 px-2">
              <p class="text-gray-500 mb-0">
                <a [href]="dog.imageUrl">{{ dog.imageUrl }}</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
} @else {
  Loading...
}
```

- [ ] **Step 2: Verify in the browser**

Run: `npm start`, log in, navigate to a dog detail page via `/dogs/my` → "Go to". Confirm: top "Back" button (blue), left card with image + name + rating + Rate/Delete buttons, right card with key/value rows (1/4 / 3/4 split) separated by `<hr>`. On narrow viewports the two cards should stack. Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add libs/dogs/feature/src/lib/dog-detail/dog-detail.component.html
git commit -m "Convert dog-detail component to Tailwind"
```

---

## Task 9: Convert `dog-form.component.html` (Bootstrap classes only)

**Files:**
- Modify: `libs/dogs/ui/src/lib/dog-form/dog-form.component.html`

**Important:** This template has an in-progress signal-forms migration (`[formField]`, `[formRoot]`, `form.name().touched()`, `form.name().errors()`, etc.) that is **out of scope**. Preserve every attribute, binding, control-flow block, and expression exactly as it is. Only change CSS class names.

- [ ] **Step 1: Replace template contents**

Replace the file with:

```html
<form [formRoot]="form">
  <div class="mb-3">
    <label class="block mb-2 text-sm font-medium text-gray-700" for="dogname">Name</label>
    <input
      class="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
      [formField]="form.name"
      id="dogname"
      type="text"
    />
    @if (form.name().touched() && form.name().invalid()) {
      <ul class="error-list">
        @for (error of form.name().errors(); track error) {
          <li>{{ error.message }}</li>
        }
      </ul>
    }
  </div>
  <div class="mb-3">
    <label class="block mb-2 text-sm font-medium text-gray-700" for="dogreed">Breed</label>
    <input
      class="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
      [formField]="form.breed"
      id="dogbreed"
      type="text"
    />
    @if (form.breed().touched() && form.breed().invalid()) {
      <ul class="error-list">
        @for (error of form.breed().errors(); track error) {
          <li>{{ error.message }}</li>
        }
      </ul>
    }
  </div>
  <div class="mb-3">
    <label class="block mb-2 text-sm font-medium text-gray-700" for="dogcomment">Comment</label>
    <input
      class="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
      [formField]="form.comment"
      id="dogcomment"
      type="text"
    />
  </div>

  <input
    #fileInput
    (change)="setFormData(fileInput.files)"
    accept="image/*"
    hidden
    id="file"
    type="file"
  />

  <div>
    <img [src]="base64()" alt="preview" />
  </div>

  <span>{{ filename() }} </span>

  <div class="flex justify-between mt-3">
    <div class="mb-10">
      <button
        (click)="takePhoto()"
        class="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 mr-2"
        type="button"
      >
        <i class="fa-solid fa-camera"></i> Take picture
      </button>
      <button
        (click)="fileInput.click()"
        class="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        type="button"
      >
        <i class="fa-regular fa-file"></i> Choose File
      </button>
    </div>

    <button
      [disabled]="!form().valid() || loading() === true"
      class="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 mt-6"
      type="submit"
    >
      @if (loading()) {
        <div class="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      }
      <i class="fa-solid fa-plus"></i> Add Dog
    </button>
  </div>
</form>
```

- [ ] **Step 2: Verify the build still works**

Run: `npx nx build dog-rate-app --configuration=development`

Expected: build succeeds (any pre-existing signal-forms warnings should remain unchanged — neither newly introduced nor resolved by this plan).

- [ ] **Step 3: Verify in the browser**

Run: `npm start`, log in, navigate to `/dogs/my/add`. The three text inputs should be full-width with rounded borders and a blue focus ring. The two image buttons should be solid blue with a small gap, and the submit button should be solid blue on the right. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add libs/dogs/ui/src/lib/dog-form/dog-form.component.html
git commit -m "Convert dog-form component to Tailwind"
```

---

## Task 10: Remove Bootstrap CDN tags from `index.html`

**Files:**
- Modify: `apps/dog-rate-app/src/index.html`

- [ ] **Step 1: Replace the file contents**

Replace `apps/dog-rate-app/src/index.html` with:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Dog Rating App</title>
  <base href="/" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" type="image/x-icon" href="favicon.ico" />
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

(Removed: the Bootstrap `<link>` and `<script>`. Kept: Font Awesome `<link>` and `<script>`.)

- [ ] **Step 2: Verify in the browser**

Run: `npm start`. Walk through every screen and check the look matches what you saw after each previous task:
- `/dogs` (list)
- `/dogs` with a dog selected (rate)
- `/dogs/my` (my-dogs + single-dog tiles), logged in
- `/dogs/my/add` (dog-form)
- `/dogs/details/<id>` (dog-detail)
- `/about`
- Nav header in logged-in and logged-out states
- Footer

If anything visibly regressed, fix the offending template before committing.

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add apps/dog-rate-app/src/index.html
git commit -m "Remove Bootstrap CDN tags"
```

---

## Task 11: Final verification

**Files:** none modified unless regressions are found.

- [ ] **Step 1: Production build**

Run: `npx nx build dog-rate-app`

Expected: build succeeds. No `initial` budget errors. No `anyComponentStyle` budget errors.

- [ ] **Step 2: Lint**

Run: `npm run lint`

Expected: passes (or the same set of pre-existing warnings as before this work — no new errors introduced).

- [ ] **Step 3: Unit tests**

Run: `npm test`

Expected: all tests that passed on `main` before this work still pass. No new failures.

- [ ] **Step 4: Confirm Bootstrap is completely gone**

Run: `grep -rn 'bootstrap\|bs-toggle\|data-bs-' apps/dog-rate-app/src libs --include='*.html' --include='*.ts' --include='*.scss'`

Expected: no matches (the only acceptable remaining reference would be in unrelated comments — none are expected).

- [ ] **Step 5: Confirm Tailwind classes are present**

Run: `grep -rn 'class="[^"]*flex' libs --include='*.html' | head`

Expected: shows the converted templates (sanity check that Tailwind utilities are wired up).

- [ ] **Step 6: Push when satisfied**

If everything looks good, push the branch:

```bash
git push -u origin HEAD
```

(Only after the user confirms they want to push.)
