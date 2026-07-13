---
name: angular-components
description: Use when writing or editing an Angular component in this workspace — presentational (ui) or container components. Covers the clean component rules: dumb ui components, thin containers, and where logic must not go.
---

# Angular components — dumb ui, thin containers, logic in stores

Components hold **no logic**. They bind signals and forward events. Every decision —
data shaping, calculations, navigation, add versus update — lives in a store (see the
`state-management` skill), never in a component class or template.

## Presentational (`*/ui`) components

Dumb by construction:

- `standalone`, `ChangeDetectionStrategy.OnPush`.
- Inputs via `input()` / `input.required()`, outputs via `output()`. No `@Input`/`@Output`
  decorators.
- **No injected store and no data services.** A ui component depends only on its inputs and
  emits via its outputs. `SingleDogComponent` (`dog` in, `dogDeleted` out) and
  `DogRateComponent` (`currentDog` in, `rated`/`skipped` out) are the reference dumb components.
- No data fetching, and no derivations beyond trivial display formatting (use pipes like
  `DecimalPipe` / `DatePipe` in the template rather than computing in the class).
- Reactive forms live here (the form is UI), but the submit **payload** is emitted via an
  `output()` — the container store decides what to do with it. Reference: `DogFormComponent`.

## Container (`*/feature`) components

Thin wiring only:

- `standalone`, `OnPush`, `inject()` (never constructor injection).
- Inject exactly one **local** store (provided via `providers: [XStore]` on the component),
  bind its signals into the template, and forward child outputs to store methods or events.
  Reference: `MyDogsComponent`, `MainDogComponent`, `DogDetailComponent`, `AddDogComponent`.
- No logic in the class or template beyond binding inputs and forwarding events.
- A container may pass a route input signal into an `rxMethod` (that is what `rxMethod` is
  for), but the store keeps the resolved plain value, never the signal. `DogDetailComponent`
  binds the route param with `dogId = input('')` and calls
  `store.loadSingleDogIfNotLoaded(this.dogId)`; `DogDetailsStore` stores `dogId: string | null`.

## Forms

A form is UI, so it lives **entirely in the presentational component**; what happens *after*
submit is store work. The form and the store never reference each other.

- **The `*/ui` form component owns the whole form.** The workspace uses signal forms (`form()`
  from `@angular/forms/signals`): the form model, its validators, the photo handling, and the
  submit guard all live in the ui component. On a valid submit it emits the payload via an
  `output()` and does nothing else. It imports domain *models* only — never a store or a
  service. Reference: `DogFormComponent`, which emits an `AddedDogPayload` through its
  `dogAdded` output.
- **The container store handles the result:** persistence (delegating to `DogsStore`), the
  success notification, and navigation. Reference: `AddDogStore.addDogWithPicture`, wired up by
  `AddDogComponent`.
- **They communicate only through the form component's `input()` (value in) and `output()`
  (submit payload out).** The store does not know the form exists; the form does not know a
  store exists.

## Everywhere

- `@if` / `@for` (never `*ngIf` / `*ngFor`).
- No `subscribe()` in components.
- `null`, never `undefined`, for optional inputs (`input<T | null>(null)`).
- No comments that restate what the code does.

The `dogs` feature is the reference example. See also the `state-management` and
`angular-signals` skills.
