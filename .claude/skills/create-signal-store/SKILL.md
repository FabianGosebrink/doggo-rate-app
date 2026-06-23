---
name: create-signal-store
description: Use when the user asks to add state management or create a store for a feature in this Angular workspace.
---

# Creating a Signal Store

In this workspace we manage state exclusively with the NgRx Signal Store.
When asked to create a store, follow these rules:

- Create the store with `signalStore` from `@ngrx/signals`.
- A global store that serves the whole domain is `{ providedIn: 'root' }`. A
  store that belongs to one container component is provided in that component
  instead, so its lifetime matches the component.
- Keep collections with `withEntities<T>()`; keep flags and scalar values
  with `withState({ ... })`.
- Implement every asynchronous action as an `rxMethod` and wrap the HTTP
  call in `tapResponse` so success and error are always handled.
- On success, patch the state AND show a success notification through the
  injected `WebNotificationService`. On error, show an error notification.
- Inject services through default parameters of the `withMethods` factory.
- If the store should load its data immediately, call the load method from
  a `withHooks({ onInit })` hook.

## Example

```ts
export const DogsStore = signalStore(
  { providedIn: 'root' },
  withEntities<Dog>(),
  withMethods(
    (
      store,
      notificationService = inject(WebNotificationService),
      dogsApiService = inject(DogsApiService),
    ) => ({
      loadDogs: rxMethod<void>(
        exhaustMap(() =>
          dogsApiService.getDogs().pipe(
            tapResponse({
              next: (dogs) => {
                patchState(store, setAllEntities(dogs));
                notificationService.showSuccess('Dogs Loaded');
              },
              error: () => notificationService.showError(),
            }),
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
