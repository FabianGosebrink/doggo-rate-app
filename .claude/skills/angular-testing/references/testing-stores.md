# Testing a signalStore

Provide the store in `TestBed` (a local container store takes no `providedIn`, so it is just a
provider), mock the services it injects, drive it through its public methods, and assert on its
signals. The store exposes state as signals, so read them directly.

A local store often builds on the root `DogsStore`, so provide the real `DogsStore` too and mock
the API service underneath it. `MyDogsStore` derives `myDogs` from `DogsStore`:

```ts
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MockProvider } from 'ng-mocks';
import { MyDogsStore } from './my-dogs.store';
import { Dog, DogsApiService, DogsStore } from '@dog-rating/dogs/domain';
import { NotificationService } from '@dog-rating/shared/util-notification';

describe('MyDogsStore', () => {
  let store: InstanceType<typeof MyDogsStore>;
  let dogsApiService: DogsApiService;

  const mockDogs = [{ id: '1', name: 'Buddy' } as Dog];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(DogsApiService, {
          getDogs: () => of(mockDogs),
          getMyDogs: () => of([]),
        }),
        MockProvider(NotificationService, { showError: vi.fn() }),
        DogsStore,
        MyDogsStore,
      ],
    });

    dogsApiService = TestBed.inject(DogsApiService);
    store = TestBed.inject(MyDogsStore);
  });

  it('should load my dogs and expose their ids', () => {
    // Arrange
    vi.spyOn(dogsApiService, 'getMyDogs').mockReturnValue(of(mockDogs));

    // Act
    store.loadMyDogs();

    // Assert
    expect(store.myDogsIds()).toEqual(['1']);
    expect(store.myDogs()).toEqual(mockDogs);
  });
});
```

`DogsStore` loads its collection in `onInit`, so mock `getDogs` too; `myDogs` is looked up from
that loaded collection. The mocked service returns a synchronous `of(...)`, so the `rxMethod`
completes within the same call and the signals are already updated when you assert.

## Flush an `onInit` effect with `TestBed.tick()`

When a store reacts through an Angular `effect` — for example `MainDogStore` navigates in an
`onInit` effect whenever `selectedDog()` changes — nothing runs until effects flush. `TestBed.tick()`
flushes them synchronously, the zoneless replacement for a change-detection cycle:

```ts
it('should navigate to the initially selected dog', () => {
  // Arrange
  const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

  // Act
  TestBed.tick();

  // Assert
  expect(navigateSpy).toHaveBeenCalledWith(['/dogs'], {
    queryParams: { dogId: 'd1' },
  });
});
```

If an `rxMethod` also runs a timer internally (an rxjs `delay`, `setTimeout`), add
`vi.useFakeTimers()` in `beforeEach` and `vi.advanceTimersByTime(ms)` after `TestBed.tick()`.

## Inject the store once, in `beforeEach` — not per test

`store = TestBed.inject(MyDogsStore)` belongs in `beforeEach`, not repeated inside every `it`.
Most tests want the same store instance; re-injecting per test is dead weight.

When a test needs the store's `onInit` to see *different* data than the rest of the suite (e.g. an
empty dog list instead of the shared fixture), use a small factory that builds the module and
returns the services plus the store, call it from `beforeEach` by default, and re-run it after
`TestBed.resetTestingModule()` only in the rare test that truly needs a different initial module.
`MainDogStore`'s spec does exactly this with a `configureMainDogStore(dogs)` helper:

```ts
function configureMainDogStore(dogs: Dog[]) {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      MockProvider(DogsApiService, { getDogs: () => of(dogs) }),
      DogsStore,
      MainDogStore,
    ],
  });

  return { router: TestBed.inject(Router), store: TestBed.inject(MainDogStore) };
}

it('should not navigate when there is no dog to select', () => {
  // Arrange
  TestBed.resetTestingModule();
  ({ router, store } = configureMainDogStore([]));
  const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

  // Act
  TestBed.tick();

  // Assert
  expect(navigateSpy).not.toHaveBeenCalled();
});
```
