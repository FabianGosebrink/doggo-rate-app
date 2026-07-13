---
name: state-management
description: Use when adding or changing any state in this Angular workspace — creating a signal store, deciding whether state belongs in a local or root store, or wiring an async load. Always applies when state is introduced, not only when refactoring existing stores.
---

# State management — localize when possible, globalize when needed

NgRx Signals (`signalStore`) is the state tool. The guiding principle:

> **Localize when possible, globalize when needed.** State and derived values live in the
> smallest scope that needs them. Only promote to the root store what is genuinely shared
> across containers.

## Store scopes

- **Local store, per container.** A routed/container component provides its own store
  (`providers: [XStore]` on the component) — **never** `providedIn: 'root'`. It holds that
  container's own state and the derived values **only that container** needs. In this app
  `MyDogsStore`, `DogDetailsStore`, `AddDogStore` and `MainDogStore` are all local stores
  provided on their container component.
- **Root domain store.** `DogsStore` (`dogs/domain`, `providedIn: 'root'`) is the single
  source of truth for the loaded dog collection (`withEntities<Dog>()` → `entities` /
  `entityMap`), the `loading` flag, and the `loadDogs` / `addDog` / `updateDog` / `removeDog`
  methods that maintain it. Every dog container reads from it. Local stores inject it directly
  in their `withComputed` / `withMethods` factory (`dogsStore = inject(DogsStore)`) and build
  on it.
- **Sharing wider than one feature.** If another feature ever needed dog data, you would
  promote only the **read** (the entity collection and its `load…` method) to the widest scope
  that reads it, and keep the writes in the owning feature. In this app the dog collection
  already lives in `dogs/domain` and is read by every dog container, so `DogsStore` is that
  shared read.

## The placement test

Before putting a property in the root `DogsStore`, ask: **is it read or mutated by more than
one container?**

- **Only one container reads it** → it belongs in that container's **local** store — *even if
  it is derived*. Derived-ness does not force it to root; "needed in more than one place" does.
  `MyDogsStore.myDogs`, `DogDetailsStore.detailDog` and `MainDogStore.selectedDog` are all
  derived from `DogsStore` yet consumed by a single container, so they stay local.
- **Shared across containers, or it mutates the shared collection** → the **root** `DogsStore`.
  The dog entities and the load/add/update/remove that maintain them are shared, so they live
  in `DogsStore`.

**Reads and writes don't have to share a scope.** The shared *read* is the entity collection in
`DogsStore`. A local store derives its own view from that collection (`myDogs`, `detailDog`)
without copying it, and writes flow back into the shared collection in one of the two ways below.

## Updating the shared collection from a local container

A local store cannot `patchState` `DogsStore`. It changes the shared collection in one of two
ways, both used in this app:

- **Call a `DogsStore` method directly.** A local store injects `DogsStore` and calls one of its
  entity methods after its own service call. `AddDogStore.addDogWithPicture` uploads the photo,
  posts the dog, then calls `dogsStore.addDog(dog)`; `DogDetailsStore.loadSingleDogIfNotLoaded`
  fetches a single dog that is not in the collection yet and calls `dogsStore.addDog(dog)`.
- **Go through an event.** For a flow that more than one store must react to, dispatch a *user*
  event; the root store handles it and emits an *API* event that any store can react to. Delete
  works this way (see "Coordinating stores with events"): a container dispatches
  `dogUserEvents.deleteDog`, `DogsStore` (via `withDogRemove`) deletes on the server and emits
  `dogAPIEvents.deleteDogSuccess`, and both `DogsStore` and `MyDogsStore` react to that event.

## Worked example — the dogs feature

- **Root `DogsStore`** (`dogs/domain`, `providedIn: 'root'`): `withEntities<Dog>()` (→
  `entities` / `entityMap`), a `loading` flag, `withDogRemove()`, and
  `loadDogs`/`addDog`/`updateDog`/`removeDog`. `loadDogs` runs from `withHooks({ onInit })`, so
  the collection is populated once and every dog container reads it.
- **`MyDogsStore`** (local, on the my-dogs container): holds `myDogsIds: string[]`, derives
  `myDogs` from `dogsStore.entityMap()`, loads the ids with `loadMyDogs`, and reacts to
  `dogAPIEvents.deleteDogSuccess` via `withReducer` to drop a deleted id. Only the my-dogs page
  needs `myDogs`, so it stays local.
- **`DogDetailsStore`** (local, on the detail container): holds `dogId: string | null`, derives
  `detailDog` from `dogsStore.entityMap()`, and `loadSingleDogIfNotLoaded` fetches the dog only
  when it is not already in the collection and adds it with `dogsStore.addDog`. The container
  passes the route id in; the store keeps the plain value, never a signal.

If a derived value like `detailDog` were ever needed by another container too, *then* promote it
to `DogsStore`.

## Coordinating stores with events

Cross-store flows use `@ngrx/signals/events`, not one store reaching into another. Events come in
two groups: **user** events (an intent from the UI) and **API** events (the result of the work).

```ts
export const dogUserEvents = eventGroup({
  source: 'Dogs User',
  events: { deleteDog: type<Dog>() },
});

export const dogAPIEvents = eventGroup({
  source: 'Dogs API',
  events: { deleteDogSuccess: type<Dog>() },
});
```

- A container **dispatches** the user event:
  `inject(Dispatcher).dispatch(dogUserEvents.deleteDog(dog))`.
- The owning store **handles** it and emits the API event. `DogsStore` composes `withDogRemove()`,
  which uses `withEventHandlers` to call `dogsApiService.deleteDog`, navigate, and return
  `dogAPIEvents.deleteDogSuccess(dog)`.
- Any store **reacts** to the API event with `withReducer(on(...))`: `DogsStore` removes the
  entity, and `MyDogsStore` drops the id from `myDogsIds`.

Reach for an event when a single user action must update state in more than one store. For a plain
write that only touches the shared collection, call the `DogsStore` method directly instead.

## Async loads and request status

Async flows are `rxMethod` + `tapResponse` (from `@ngrx/operators`), and every mutation goes
through `patchState`. For "is this request in flight?" keep a plain `loading` flag in the store's
`withState({ loading: false })`. Set it in a leading `tap` before the call and clear it when the
data arrives, so every store models load state the same simple way:

```ts
loadDogs: rxMethod<void>(
  pipe(
    tap(() => patchState(store, { loading: true })),
    exhaustMap(() =>
      dogsApiService.getDogs().pipe(
        tapResponse({
          next: (dogs) => {
            patchState(store, setAllEntities(dogs), { loading: false });
            notificationService.showSuccess('Dogs Loaded');
          },
          error: () => notificationService.showError(),
        }),
      ),
    ),
  ),
),
```

Bind `store.loading()` in the template for spinners/indicators. Reference: `DogsStore`. Why: one
shared `loading` shape means loading UX — and the tests for it — look the same in every store
instead of each one inventing its own flag.

## Non-negotiable rules

- **The NgRx Signal Store is the only state management tool in this workspace.** Never
  introduce another state library, and never build a stateful service around a
  `BehaviorSubject`/`Subject` to share state between components — use a store instead, even
  for state that feels too small to justify one.
- **Mutate store state only via `patchState`** (or the NgRx entity updaters
  `addEntity`/`upsertEntity`/`removeEntity`/`setAllEntities`). Never assign to or mutate state
  (or a held object) directly.
- **Never store a `Signal` in store state.** A `signalStore`'s `withState` properties are
  already signals — hold the plain *value* (`dogId: string | null`), not a `Signal<T>`. A
  container may pass a route input signal into an `rxMethod` (that is what `rxMethod` is for —
  see `DogDetailsStore.loadSingleDogIfNotLoaded`), but the state the store keeps is the
  resolved plain value.
- **Never hold shared state, or state that must outlive a single render, in a plain component
  `signal()` field.** If it's shared or long-lived, it belongs in a store, scoped per the
  placement test above.
- **Components hold no logic.** They bind store signals and forward events; the decisions
  (what is selected, when to fetch, add versus update, navigation, derivations) live in a store.

If a request seems to need one of the prohibited options above, prefer a Signal Store
solution instead and briefly explain the choice.

See also the `angular-components` skill (clean component conventions) and the
`create-signal-store` skill (mechanics of building a single store).
