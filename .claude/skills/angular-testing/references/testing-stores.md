# Testing a signalStore

Provide the store in `TestBed` (a container-scoped store takes no `providedIn`, so it is just
a provider), mock its injected service, drive it through its public methods, and assert on its
signals. Mutations you can't see any other way — the store exposes state as signals, so read
them directly.

```ts
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SearchStore } from './search.store';
import { SearchService } from '../domain/services/search.service';

describe('SearchStore', () => {
  let store: SearchStore;
  let serviceMock: { search: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    serviceMock = { search: vi.fn().mockReturnValue(of([/* results */])) };
    TestBed.configureTestingModule({
      providers: [
        SearchStore,
        { provide: SearchService, useValue: serviceMock },
      ],
    });

    store = TestBed.inject(SearchStore);
  });

  it('should search when the query signal changes', () => {
    // Act
    store.updateQuery('coffee');
    TestBed.tick(); // flush the rxMethod's signal effect (loadByQuery(store.query))

    // Assert
    expect(serviceMock.search).toHaveBeenCalledWith('coffee');
    expect(store.results()).toEqual([/* results */]);
  });
});
```

Why `TestBed.tick()` here: when an `rxMethod` is wired to a signal in `onInit`
(`store.loadByQuery(store.query)`), it reacts through an Angular `effect`. Setting the signal
schedules that effect; nothing runs until effects flush. `TestBed.tick()` flushes them
synchronously — the zoneless replacement for a change-detection cycle. If the mocked service
returns `of(...)` (synchronous), the whole pipeline then completes within that same tick and
the state signals are already updated when you assert.

If the `rxMethod` also debounces internally (`debounceTime` inside its pipe), add
`vi.useFakeTimers()` in `beforeEach` and `vi.advanceTimersByTime(300)` after `TestBed.tick()`.

## Inject the store once, in `beforeEach` — not per test

`store = TestBed.inject(SearchStore)` belongs in `beforeEach`, not repeated inside every `it`.
Most tests want the same store instance; re-injecting per test is dead weight.

If a test needs the store's `onInit` to see *different* data than the rest of the suite (e.g. an
empty initial list instead of the shared fixture), don't defer injection just for that one case —
re-spy the service and re-invoke the loading method the store already exposes
(`store.loadDogs()`), the same way any other test re-triggers a load after changing a mock. Only
reach for `TestBed.resetTestingModule()` plus a small local factory function (returning the
services + store) when the *construction itself* must differ — e.g. a different provider list —
and even then, call that factory from `beforeEach` by default, falling back to calling it again
mid-test (after `resetTestingModule()`) only in the rare test that truly needs a different
initial module.
