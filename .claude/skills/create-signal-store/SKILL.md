---
name: create-signal-store
description: Use when the user asks to add state management or create a store for a feature in this Angular workspace.
---

# Creating a Signal Store

In this workspace we manage state exclusively with the NgRx Signal Store.
When asked to create a store, follow these rules:

- Create the store with `signalStore` from `@ngrx/signals`.
- Decide `providedIn: 'root'` vs. component-provided scope using the
  placement test in the `state-management` skill — don't default to root.
- Keep collections with `withEntities<T>()`; keep flags and scalar values
  with `withState({ ... })`.
- Implement every asynchronous action as an `rxMethod` and wrap the HTTP
  call in `tapResponse`. Track loading with a `loading` flag kept in
  `withState({ loading: false })`: set it to `true` before the call in a
  leading `tap`, and back to `false` when the data arrives.
- On success, patch the state AND show a success notification through the
  injected `NotificationService`. On error, show an error notification.
- Inject services through default parameters of the `withMethods` factory.
- If the store should load its data immediately, call the load method from
  a `withHooks({ onInit })` hook.

## Example

```ts
export const DogsStore = signalStore(
  { providedIn: 'root' },
  withEntities<Dog>(),
  withState({ loading: false }),
  withMethods(
    (
      store,
      notificationService = inject(NotificationService),
      dogsApiService = inject(DogsApiService),
    ) => ({
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
    }),
  ),
  withHooks({
    onInit(store) {
      store.loadDogs();
    },
  }),
);
```
