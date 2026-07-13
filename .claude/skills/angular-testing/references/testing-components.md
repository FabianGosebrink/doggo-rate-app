# Testing components

## The base shape: fixture in the first `beforeEach`, assert after `whenStable()`

**Always create the fixture in the first `beforeEach`, not inside each test.** Declare
`component`/`fixture` at `describe` scope, and in that first `beforeEach` call
`TestBed.configureTestingModule(...).compileComponents()`, then `TestBed.createComponent(...)`,
then read `fixture.componentInstance` into `component` — every describe block follows this shape,
even if a given test never ends up reading `component`. Each test's own Arrange then only sets
*that test's* inputs on the already-created fixture.

**Trigger and observe rendering with `await fixture.whenStable()`, not `fixture.detectChanges()`.**
Setting a signal input (`componentRef.setInput(...)`) already schedules a change-detection pass
through the same production scheduler the real app uses; `whenStable()` waits for that scheduled
pass — and any other pending async work — to actually run, the zoneless-native way to observe
rendering. Every test whose Act touches rendering is therefore `async`:

```ts
describe('DogRateComponent', () => {
  let component: DogRateComponent;
  let fixture: ComponentFixture<DogRateComponent>;

  const mockDog = { ratingCount: 10, ratingSum: 40 } as Dog; // average of 4.0

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DogRateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DogRateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should calculate the average rating from the current dog', async () => {
    // Arrange
    fixture.componentRef.setInput('currentDog', mockDog);

    // Act
    await fixture.whenStable();

    // Assert
    expect(component.averageRating()).toBe(4);
  });
});
```

Include a `should create` test as the first test in every describe block — it gives `component` a
real assertion beyond just sitting there for later tests to use.

If a test truly has nothing to arrange beyond what `beforeEach` already set up, drop the
`// Arrange` label rather than leaving it with nothing under it — go straight to `// Act`.

## Testing presentational (dumb) components

Set signal inputs with `componentRef.setInput`, `await fixture.whenStable()`, then assert on the
rendered DOM or on an `output()` emission. These components inject no store and no services, so
`TestBed` needs no extra providers. Prefer asserting rendered markup or emitted outputs over
reaching into the class — a dumb component's contract is "inputs in → markup/outputs out".

An `output()` (and an `outputFromObservable`) is subscribable, so subscribe and assert it fired.
`DogRateComponent` emits `skipped` and `rated`:

```ts
it('should emit skipped when the user skips', () => {
  // Arrange
  const skipSpy = vi.fn();
  component.skipped.subscribe(skipSpy);

  // Act
  component.skipped.emit();

  // Assert
  expect(skipSpy).toHaveBeenCalled();
});
```

`SingleDogComponent` is the same shape with a `dog` input and a `dogDeleted` output: set the
input, `await fixture.whenStable()`, and assert what it renders or emits.

### The one case where reaching into the class is correct

Prefer asserting rendered markup. But when a derived value has no reachable DOM path — a
`computed` the template only reads inside an `@if` guard whose falsy branch is exactly that
computed's "empty" case — Angular's control flow never evaluates the binding, so no fixture setup
can exercise it through markup. Read the signal directly in that one test instead, the way the
`DogRateComponent` spec reads the derived rating:

```ts
it('should return 0 average rating if no dog is provided', async () => {
  // Arrange
  fixture.componentRef.setInput('currentDog', null);

  // Act
  await fixture.whenStable();

  // Assert
  expect(component.averageRating()).toBe(0);
});
```

Reach for this only after confirming, by reading the template, that the branch truly has no DOM
path.

## Testing a container component

A container's real logic lives in its store and its events, which are tested on their own, so the
container test only checks the wiring. Mock the local store (via `overrideComponent`), replace
child components with `MockComponent(...)`, provide the router, and mock the `Dispatcher` — no
HTTP stack is needed, because the store is mocked. `MyDogsComponent` forwards a delete to an event:

```ts
import { MockComponent, MockProvider } from 'ng-mocks';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { MyDogsStore } from './my-dogs.store';
import { SingleDogComponent } from '@dog-rating/dogs/ui';
import { Dog, dogUserEvents } from '@dog-rating/dogs/domain';
import { Dispatcher } from '@ngrx/signals/events';

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [MyDogsComponent, MockComponent(SingleDogComponent)],
    providers: [
      provideRouter([]),
      MockProvider(Dispatcher, { dispatch: vi.fn() }),
    ],
  })
    .overrideComponent(MyDogsComponent, {
      set: { providers: [MockProvider(MyDogsStore, { myDogs: signal([]) })] },
    })
    .compileComponents();

  fixture = TestBed.createComponent(MyDogsComponent);
  component = fixture.componentInstance;
  dispatcher = TestBed.inject(Dispatcher);
});

it('should dispatch a deleteDog event when a dog is deleted', async () => {
  // Arrange
  const mockDog = { id: '123', name: 'Buddy' } as Dog;
  await fixture.whenStable();

  // Act
  component.deleteDog(mockDog);

  // Assert
  expect(dispatcher.dispatch).toHaveBeenCalledWith(dogUserEvents.deleteDog(mockDog));
});
```
