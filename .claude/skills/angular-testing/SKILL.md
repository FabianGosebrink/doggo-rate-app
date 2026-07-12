---
name: angular-testing
description: Use whenever writing, editing, running, or fixing a Vitest spec (`*.spec.ts`) in this workspace — signal stores, `rxMethod`s, `computed`s, presentational/container components, debounced inputs, mocks/spies, or pure utils. ESPECIALLY reach for this the moment a test involves anything async (debounce, `rxMethod`, HTTP) or a signal-driven effect, because this app is zoneless and the usual `fakeAsync`/`tick` recipe silently does not work here. If you find yourself about to import `fakeAsync`, `tick`, or reach for `zone.js`, stop and read this first. Also reach for this when a component uses `libBlurIf`, projects `ng-content`, or you're chasing 100% Vitest coverage.
---

# Testing this workspace — zoneless Vitest

Tests run on **Vitest** (via `@nx/vitest` + AnalogJS), not Karma or Jest, and the app is
**fully zoneless** — there is no `zone.js` dependency and there never will be (deliberate
architectural choice). That single fact changes how every async and effect-driven test is
written, so internalize it before writing assertions.

## The one rule that trips everyone up

**Never use Angular's `fakeAsync` / `tick`, and never add `zone.js`.** They depend on Zone
being patched in; here it is not installed, so `tick()` does nothing and the test either
hangs, times out, or passes vacuously. Adding `zone.js` to make them work fights the whole
architecture and will be reverted. `src/test-setup.ts` stays the zoneless sibling version
(`setupTestBed()` only) — do not swap in `@analogjs/vitest-angular/setup-zone`.

Two zoneless tools replace `fakeAsync`/`tick`:

| You need to flush… | Use |
| --- | --- |
| a timer — `debounceTime`, `setTimeout`, an rxjs `asyncScheduler` delay | **Vitest fake timers**: `vi.useFakeTimers()` / `vi.advanceTimersByTime(ms)` |
| a signal-driven **effect** — an `rxMethod` wired to a store signal, a component `effect()` | **`TestBed.tick()`** (synchronously runs pending effects, zonelessly) |

You often need both in the same test: `TestBed.tick()` to push the signal's value into the
pipeline, then `vi.advanceTimersByTime()` to flush a debounce inside it.

## Arrange-Act-Assert, always

Every test is structured as Arrange → Act → Assert, each phase preceded by a bare comment —
`// Arrange`, `// Act`, `// Assert` — with **no explanation text in the comment**. This is a
narrow, deliberate exception to the workspace's "avoid comments" rule: these three words are
structural labels, not prose explaining what the code does.

Every test name always starts with **"should "** — `it('should render the title', ...)`, not
`it('renders the title', ...)`. This applies to every `it(...)` description in the workspace,
including one-off `it('should create', ...)` smoke tests.

## Testing pure utils

Mapping / calculation logic belongs in a pure function in the lib's `utils/` (e.g.
`toSearchResultViewModels`, `groupEntriesByYear`), not in a component. Those get plain
unit tests with **no `TestBed`** — call the function, assert the return. This is the cheapest,
fastest layer, so push logic here and cover it directly rather than through the DOM.

```ts
import { toSearchResultViewModels } from './search.utils';

it('should add a humanized type label', () => {
  // Arrange
  const result = { /* ... */ };

  // Act
  const [vm] = toSearchResultViewModels([result]);

  // Assert
  expect(vm.typeLabel).toBe('Expense Additional');
});
```

## Recipes for specific test shapes

Read the matching reference file before writing the test — each covers one shape in full,
with a worked example:

- **`references/mocking.md`** — capturing spies into named variables and asserting on the
  variable, not the mock's property (`MockProvider`/`ngMocks.defaultMock`/`vi.spyOn` alike).
- **`references/testing-stores.md`** — testing a `signalStore`: providing it in `TestBed`,
  driving it through its methods, and why `TestBed.tick()` is needed for a signal-wired
  `rxMethod`.
- **`references/testing-components.md`** — the base fixture/`whenStable()` shape, debounced
  reactive inputs, presentational (dumb) components, `libBlurIf`'s HTTP requirement, testing
  `ng-content` projection, the one sanctioned exception for reaching into a component's class,
  and container components.

## Running tests

Project names follow the lib path (`libs/money-tracker/filter/search` →
`money-tracker-filter-search`).

```sh
npx nx test money-tracker-filter-search                       # one project
npx nx test money-tracker-filter-search -- -t "SearchStore"    # one describe/it by name
npx nx test money-tracker-filter-search -- --coverage          # per-file coverage table (v8)
npx nx run-many -t test                                        # everything
```

If Nx can't find a newly created/renamed project, run `npx nx reset` once (clears the daemon
cache) and retry. Keep test output pristine — a stray warning is a finding, not noise.

When asked for full coverage on a lib, run with `--coverage` and iterate until statements,
branches, functions and lines are all 100%. Treat every gap as one of exactly two things: a
missing DOM-reachable test for a real branch, or the unreachable-`computed` exception in
`references/testing-components.md` — never leave an uncovered line unexplained.

## Where to put the logic you're testing (so it's testable)

Testing pain is usually a design smell. Before writing an elaborate DOM/async test, check the
`angular-components`, `angular-signals`, and `state-management` skills — the patterns they
enforce are what make tests small:

- **Logic in the store, not the component.** A `computed` view-model in the store is tested by
  reading a signal; the same mapping in a component template needs a rendered fixture.
- **Pure functions for mapping/calculation** (in `utils/`) are tested without Angular at all.
- **Dumb components** take finished data via `input()` and render — assert the markup, don't
  reconstruct logic in the test.
- **Debounce in one place.** If it's in the input (`outputFromObservable`), test it there; if
  it's in an `rxMethod`, test it in the store. Don't debounce in both.
