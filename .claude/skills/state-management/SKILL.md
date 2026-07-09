---
name: state-management
description: Use when adding or changing any state in this Angular workspace — creating a signal store, deciding whether state belongs in a local or root store, or wiring an async load. Always applies when state is introduced, not only when refactoring existing stores.
---

# State management — localize when possible, globalize when needed

NgRx Signals (`signalStore`) is the state tool. The guiding principle:

> **Localize when possible, globalize when needed.** State and derived values live in the
> smallest scope that needs them. Only promote to a root store what is genuinely shared
> across containers.

## Store scopes

- **Local store, per container.** Every routed/container component has its own store if needed, provided
  at component level (`providers: [XStore]` on the component) — **never** `providedIn: 'root'`.
  It holds that container's logic and any derived values **only that container** needs.
- **Root domain store.** A `signalStore({ providedIn: 'root' }, …)` in the feature's `*/domain`
  lib is the single source of truth for state that is **read or mutated by more than one
  container of that feature** (e.g. the loaded entity collection and the load/add/update/delete
  that maintain it). Local stores `inject` it (via `withProps(() => ({ store: inject(RootStore) }))`)
  and build on it.
- **Cross-feature shared store (`shared/feature-*`).** When **another feature** needs your
  data, promote only the **read** — the loaded entity collection (`withEntities` + a
  `load…` method) and nothing else. The **writes stay in the owning feature**: its local
  stores call the service to add/update/delete, then call the shared store's `load…()` to
  refresh. Reference: `GlobalInvestmentStore`, and the shared `InsurancesStore` (read-only,
  consumed by both the `insurances` feature and `MonthlyCostStore`).

## The placement test

Before putting a property in the root store, ask: **is it read or mutated by more than one
container?**

- **Only one container reads it** → it belongs in that container's **local** store — *even if
  it is derived*. Derived-ness does not force it to root; "needed in more than one place" does.
- **Shared across containers, or it mutates shared state** → **root** store.

**Reads and writes don't have to share a scope.** This is the sharpest reading of *localize
when possible, globalize only when needed*: globalize the **read** as far as it is actually
read, but keep the **write** where the entity is owned. Reading data is frequently shared —
another feature wants to display or aggregate it. Writing it (add/update/delete) almost never
is: only the owning feature does that. So promote the read to the widest scope that needs it,
and leave the write local.

A local store cannot `patchState` another store, so a write updates shared collection state
one of two ways: **within a feature**, by calling a method on the feature's root store that
owns it (the `debts` pattern); **across features**, by going through the service and then
refreshing the shared read store via its `load…()` method (the `insurances` pattern). Don't
put add/update/delete on a `shared/feature-*` store — a shared store reads; it does not write.

## Worked example — the `debts` feature

- **Root `DebtsStore`** (`debts/domain`, `providedIn: 'root'`): the shared entity collection
  (`withEntities` → `entities`/`entityMap`) plus `loadDebts`/`addDebt`/`updateDebt`/`deleteDebt`.
  The list page reads `entities`; the form page reads `entityMap`; both mutate the collection —
  so this is genuinely shared.
- **`DebtsListStore`** (local, on the list container): `displayDebts`, `debtCount`, `summary` —
  all derived from `debtsStore.entities()` and consumed only by the list — plus `removeDebt`
  (the `confirm()` gate → `debtsStore.deleteDebt`).
- **`DebtFormStore`** (local, on the form container): reads the edit `id` from the route in
  `onInit` (`inject(ActivatedRoute)` → `editId: number | null` in state), derives the `debt`
  computed (from `debtsStore.entityMap()`), and `submit` (add-vs-update decision → root
  methods). The form itself lives in the presentational `DebtsFormComponent`; the store never
  references it (see the `angular-components` skill's Forms section).

If a derived value like `summary` were ever needed by another container too, *then* promote it
to the root store.

## Worked example — `insurances` shared with `monthly-costs` (read globalized, write local)

`debts` lives in one feature, so its whole store (read + write) sits in `debts/domain`.
`insurances` is different: `MonthlyCostStore` needs to **read** insurances to add their monthly
total into the "fixed expenses (must)" line. So the scopes split:

- **Shared read store** (`shared/feature-insurances`, `providedIn: 'root'`): the `Insurance`
  model, cost utils, `InsurancesService`, and a **read-only** `InsurancesStore` — `withEntities`
  + `loadInsurances` only, no add/update/delete. Both the `insurances` feature *and*
  `MonthlyCostStore` inject it and read `entities()`.
- **Writes stay in the `insurances` feature** (local container stores): `InsuranceFormStore`
  (add/update) and `InsurancesListStore` (delete) call `InsurancesService` directly, then call
  the shared store's `loadInsurances()` to refresh — plus the toast and navigation. Adding or
  updating an insurance is a concern of the `insurances` feature alone; it does not belong in a
  shared store just because the *read* is shared.

The test that decided this: *monthly-costs reads insurances but never writes them.* So only the
read was globalized.

## Async loads and request status

Async flows are `rxMethod` + `tapResponse` (from `@ngrx/operators`), and every mutation goes
through `patchState`. For "is this request in flight?" **do not hand-roll a `loading` boolean** —
compose the shared **`withRequestStatus()`** feature from
`@money-tracker-workspace/shared/util-http`. It adds a `requestStatus`
(`'idle' | 'pending' | 'fulfilled' | { error }`) plus `isPending`, `isFulfilled`, and `error`
computeds, so the whole app models load/error state one consistent way.

Drive it with the exported helpers inside the `rxMethod` (each returns a partial state you hand to
`patchState`):

```ts
loadByQuery: rxMethod<string>(
  switchMap((query) => {
    patchState(store, setPending());

    return service.getByQuery(query).pipe(
      tapResponse({
        next: (results) => patchState(store, { results }, setFulfilled()),
        error: () => patchState(store, setError('Search failed')),
      }),
    );
  }),
),
```

Bind `store.isPending()` in the template for spinners/indicators and `store.error()` for the
message. Reference: `GlobalInvestmentStore`. Why: a single shared status shape means loading/error
UX — and the tests for it — look the same in every feature instead of each store inventing its own
boolean.

## Non-negotiable rules

- **The NgRx Signal Store is the only state management tool in this workspace.** Never
  introduce another state library, and never build a stateful service around a
  `BehaviorSubject`/`Subject` to share state between components — use a store instead, even
  for state that feels too small to justify one.
- **Mutate store state only via `patchState`** (or the NgRx entity updaters
  `addEntity`/`upsertEntity`/`removeEntity`/`setAllEntities`). Never assign to or mutate state
  (or a held object) directly.
- **Never store a `Signal` in store state.** A `signalStore`'s `withState` properties are
  already signals — hold the plain *value* (`editId: number | null`), not a `Signal<T>`. When
  a container store needs a route param, it reads it itself via `inject(ActivatedRoute)` in
  `onInit` and `patchState`es the plain value — do **not** pass a component's `input()` signal
  into the store to hold in state. Reference: `MonthlyCostEntryStore`.
- **Never hold shared state, or state that must outlive a single render, in a plain component
  `signal()` field.** If it's shared or long-lived, it belongs in a store, scoped per the
  placement test above.
- **Components hold no logic.** They bind store signals and forward events; decisions
  (add-vs-update, confirm gates, navigation, derivations) live in a store.

If a request seems to need one of the prohibited options above, prefer a Signal Store
solution instead and briefly explain the choice.

See also the `angular-components` skill (clean component conventions) and the
`create-signal-store` skill (mechanics of building a single store).
