---
name: angular-components
description: Use when writing or editing an Angular component in this workspace — presentational (ui) or container components. Covers the clean-component rules: dumb ui components, thin containers, and where logic must not go.
---

# Angular components — dumb ui, thin containers, logic in stores

Components hold **no logic**. They bind signals and forward events. Every decision —
data shaping, calculations, `confirm()` gates, navigation, add-vs-update — lives in a
store (see the `state-management` skill), never in a component class or template.

## Presentational (`*/ui`) components

Dumb by construction:

- `standalone`, `ChangeDetectionStrategy.OnPush`.
- Inputs via `input()` / `input.required()`, outputs via `output()`. No `@Input`/`@Output`
  decorators.
- **No injected services, no `HttpClient`, no stores.** A ui component depends only on its
  inputs and emits via its outputs.
- No data fetching, no derivations beyond trivial display formatting (use pipes like
  `CurrencyPipe` / `TitleCasePipe` in the template rather than computing in the class).
- Reactive forms live here (the form is UI), but the submit **payload** is emitted via an
  `output()` — the container/store decides what to do with it.

## Container (`*/container`) components

Thin wiring only:

- `standalone`, `OnPush`, `inject()` (never constructor injection).
- Inject exactly one **local** store (provided via `providers: [XStore]` on the component),
  bind its signals into the template, and forward child outputs to store methods.
- No logic in the class or template beyond binding inputs and forwarding events.
- Don't pass a component `input()` signal into the store. If the store needs a route param
  (e.g. an edit id), the **store** reads it itself via `inject(ActivatedRoute)` in `onInit`
  and holds the plain value — see the Forms section and the `state-management` skill.

## Forms

A form is UI, so it lives **entirely in the presentational component**; what happens *after*
submit is store work. The form and the store never reference each other.

- **The `*/ui` form component owns the whole form:** the `FormGroup`/controls, the validators,
  the prefill from an `input()` (the initial value / entity being edited), and the submit
  guard. On a valid submit it emits the value via an `output()` and does nothing else. It
  imports domain *models* only — never a store or a service.
- **The container store handles the result:** the add-vs-update decision, persistence
  (delegating to the root store), success notifications, and navigation.
- **They communicate only through the form component's `input()` (value in) and `output()`
  (submit payload out).** The store does not know the form exists; the form does not know a
  store exists.
- The container store gets the edit id from the **route itself**
  (`inject(ActivatedRoute)` → `route.snapshot.paramMap.get('id')`) in `onInit` and stores the
  plain value. Reference: `CostFormComponent` + `MonthlyCostEntryStore`; also
  `InsurancesFormComponent`/`InsuranceFormStore` and the `debts` equivalents.

## Everywhere

- `@if` / `@for` (never `*ngIf` / `*ngFor`).
- No `subscribe()` in components.
- `null`, never `undefined`, for optional inputs (`input<T | null>(null)`).
- No comments that restate what the code does.

The `insurances` and `debts` features are the reference examples. See also the
`state-management` and `angular-signals` skills.
