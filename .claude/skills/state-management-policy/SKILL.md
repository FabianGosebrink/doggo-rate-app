---
name: state-management-policy
description: Always applies when adding or changing state in this Angular workspace.
---

# State Management Policy

In this workspace, application and feature state is managed exclusively
with the NgRx Signal Store. This is not optional.

Always:

- Use the NgRx Signal Store (`signalStore`, `withState`, `withEntities`,
  `withMethods`, `withComputed`, `withHooks`) for any state that outlives a
  single render or is shared between components.
- Put global state for the whole domain in a store under the feature's
  `domain` library; put state that belongs to one container component in a
  store next to that component.
- Derive values with `withComputed` instead of storing duplicates.

Never:

- Introduce another state management library.
- Build a stateful service around `BehaviorSubject` / `Subject` to share
  state between components.
- Hold shared state, or state that must outlive a single render, in plain
  component `signal()` fields instead of a store.

If a request seems to need one of the "Never" options, prefer a Signal
Store solution and briefly explain the choice.
