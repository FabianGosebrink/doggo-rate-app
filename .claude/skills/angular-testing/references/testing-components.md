# Testing components

## The base shape: fixture in the first `beforeEach`, assert after `whenStable()`

**Always create the fixture in the first `beforeEach`, not inside each test.** Declare
`component`/`fixture` at `describe` scope, and in that first `beforeEach` call
`TestBed.configureTestingModule(...)`, then `TestBed.createComponent(...)`, then read
`fixture.componentInstance` into `component` — every describe block follows this shape, even
if a given test never ends up reading `component`. Each test's own Arrange then only sets
*that test's* inputs on the already-created fixture.

**Trigger and observe rendering with `await fixture.whenStable()`, not `fixture.detectChanges()`.**
Setting a signal input (`componentRef.setInput(...)`) already schedules a change-detection pass
through the same production scheduler the real app uses; `whenStable()` waits for that scheduled
pass — and any other pending async work — to actually run, the zoneless-native way to observe
rendering. Every test whose Act touches rendering is therefore `async`:

```ts
describe('ProgressCardComponent', () => {
  let component: ProgressCardComponent;
  let fixture: ComponentFixture<ProgressCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ProgressCardComponent] });

    fixture = TestBed.createComponent(ProgressCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', async () => {
    // Arrange
    fixture.componentRef.setInput('title', 'Monthly budget');

    // Act
    await fixture.whenStable();

    // Assert
    expect(component).toBeTruthy();
  });

  it('should render a healthy, emerald status below 50% spent', async () => {
    // Arrange
    fixture.componentRef.setInput('title', 'Monthly budget');
    fixture.componentRef.setInput('percentageSpent', 0.3);

    // Act
    await fixture.whenStable();

    // Assert
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Healthy');
  });
});
```

Include a `should create` test as the first test in every describe block — it gives
`component` a real assertion beyond just sitting there for later tests to use.

If a test truly has nothing to arrange beyond what `beforeEach` already set up, drop the
`// Arrange` label rather than leaving it with nothing under it — go straight to `// Act`.

## Testing a debounced reactive input (`FormControl` + `outputFromObservable`)

When the debounce lives in a presentational input (a `FormControl` whose `valueChanges` is
piped through `debounceTime` and exposed via `outputFromObservable`), drive the control and
flush the timer. Subscribe to the output — an `OutputRef` is subscribable like an `output()`.

```ts
describe('SearchInputComponent', () => {
  let component: SearchInputComponent;
  let fixture: ComponentFixture<SearchInputComponent>;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({ imports: [SearchInputComponent] });

    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => vi.useRealTimers());

  it('should emit the debounced value after typing settles', () => {
    // Arrange
    const emitted: string[] = [];
    component.queryChange.subscribe((v) => emitted.push(v));

    // Act
    component.searchControl.setValue('cof');
    component.searchControl.setValue('coffee');
    vi.advanceTimersByTime(300);

    // Assert
    expect(emitted).toEqual(['coffee']); // debounce collapsed the two setValues into one
  });
});
```

`vi.advanceTimersByTime` works because rxjs `debounceTime` schedules on timers that Vitest's
fake timers patch — no Zone required.

## Testing presentational (dumb) components

Set signal inputs with `componentRef.setInput`, `await fixture.whenStable()`, then assert on the
rendered DOM (or subscribe to an `output()`). These components have no injected services, so
`TestBed` needs no extra providers — unless the template pulls in a directive that does (see
`libBlurIf` below). Prefer asserting behavior/rendered text over reaching into the class — a
dumb component's contract is "inputs in → markup out" (one documented exception below).

```ts
describe('SearchResultsListComponent', () => {
  let component: SearchResultsListComponent;
  let fixture: ComponentFixture<SearchResultsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [SearchResultsListComponent] });

    fixture = TestBed.createComponent(SearchResultsListComponent);
    component = fixture.componentInstance;
  });

  it('should render the invoice date', async () => {
    // Arrange
    fixture.componentRef.setInput('items', items);

    // Act
    await fixture.whenStable();

    // Assert
    expect(fixture.nativeElement.textContent).toContain('June 2025');
  });
});
```

### `libBlurIf` needs the HTTP test stack

A component's own inputs may have no HTTP dependency at all, but if its template applies
`libBlurIf` (`BlurIfDirective` from `shared/feature-settings`), the directive injects the root
`SettingsStore`, which fires `loadCategories()` (an HTTP call) in `onInit`. Without HTTP
providers, rendering the component (`await fixture.whenStable()`) throws a `NullInjectorError`
for `HttpClient`/`SERVER_URL`. Provide the same testing HTTP stack as a container test (see below).

### Testing `ng-content` projection

A component that renders part of its template via `<ng-content />` can't be exercised by
setting inputs alone — create a tiny standalone host test component that wraps it, and assert
on the projected content in the *host* fixture:

```ts
@Component({
  imports: [ChartCardComponent],
  template: `
    <lib-chart-card title="Net worth">
      <div data-testid="projected">Projected chart</div>
    </lib-chart-card>
  `,
})
class ChartCardHostComponent {}

it('should project content into the card body', async () => {
  // Arrange
  fixture.componentRef.setInput('title', 'Net worth'); // zoneless CD is global — satisfy the shared fixture's required input too
  const hostFixture = TestBed.createComponent(ChartCardHostComponent);

  // Act
  await hostFixture.whenStable();

  // Assert
  const projected = hostFixture.nativeElement.querySelector(
    '[data-testid="projected"]',
  ) as HTMLElement;
  expect(projected.textContent).toContain('Projected chart');
});
```

**Why that first Arrange line is there even though the test never reads `fixture`:** zoneless
change detection is global — `whenStable()`/`detectChanges()` run through the app's real
scheduler, which can sweep *every* root view currently attached to `ApplicationRef`, not just the
fixture you called it on. The describe's `beforeEach` already created `fixture` for
`ChartCardComponent` with no `title` set; awaiting `hostFixture.whenStable()` can trip that other
fixture's `input.required<...>()` and throw `NG0950`, even though this test only cares about
`hostFixture`. Satisfy every required input on the shared fixture before triggering rendering on
*any* fixture in the test, not just the one under test.

### The one case where reaching into the class is correct

A `computed` that the template only ever reads *inside* an `@if` guard is unreachable through
the DOM when the guard's falsy branch is exactly that computed's "empty" case — Angular's
control flow never evaluates the binding, so no fixture setup can exercise it through rendered
markup. Call the signal directly in that one test instead:

```ts
it('should compute a neutral delta class when there is no delta', async () => {
  // Arrange
  fixture.componentRef.setInput('title', 'Net worth');

  // Act
  await fixture.whenStable();

  // Assert
  expect(component.deltaClassName()).toBe('text-slate-500 dark:text-slate-300');
});
```

This is the only sanctioned exception to "assert markup, don't reach into the class" — reach
for it only after confirming, by reading the template, that the branch truly has no DOM path.

## Testing a container component

A container provides its own store, which injects a service that injects `HttpClient` — so the
test injector must supply HTTP. Provide the testing HTTP stack and the `SERVER_URL` token; a
plain create-and-assert smoke test is usually enough for a container (the real logic lives in
the store and is tested there).

```ts
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SERVER_URL } from '@money-tracker-workspace/shared/util-http';

TestBed.configureTestingModule({
  imports: [SearchComponent],
  providers: [
    provideHttpClient(),
    provideHttpClientTesting(),
    { provide: SERVER_URL, useValue: 'http://localhost/api/' },
  ],
});
```
