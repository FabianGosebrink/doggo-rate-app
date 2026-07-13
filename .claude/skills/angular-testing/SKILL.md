---
name: angular-testing
description: Use whenever writing, editing, running, or fixing a Vitest spec (`*.spec.ts`) in this workspace — signal stores, `rxMethod`s, `computed`s, presentational and container components, mocks/spies, or pure utils. ESPECIALLY reach for this the moment a test involves anything async (`rxMethod`, HTTP, a timer) or a signal-driven effect, because this app is zoneless and the usual `fakeAsync`/`tick` recipe silently does not work here. If you find yourself about to import `fakeAsync`, `tick`, or reach for `zone.js`, stop and read this first. Also reach for this when you're chasing 100% Vitest coverage.
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
| a timer — `setTimeout`, an rxjs `delay`/`asyncScheduler` delay | **Vitest fake timers**: `vi.useFakeTimers()` / `vi.advanceTimersByTime(ms)` |
| a signal-driven **effect** — an `rxMethod` wired to a signal, a component/store `effect()` | **`TestBed.tick()`** (synchronously runs pending effects, zonelessly) |

You sometimes need both in the same test: `TestBed.tick()` to push the signal's value into the
pipeline, then `vi.advanceTimersByTime()` to flush a timer inside it.

## Arrange-Act-Assert, always

Every test is structured as Arrange → Act → Assert, each phase preceded by a bare comment —
`// Arrange`, `// Act`, `// Assert` — with **no explanation text in the comment**. This is a
narrow, deliberate exception to the workspace's "avoid comments" rule: these three words are
structural labels, not prose explaining what the code does.

Every test name always starts with **"should "** — `it('should rate the selected dog', ...)`,
not `it('rates the selected dog', ...)`. This applies to every `it(...)` description in the
workspace, including one-off `it('should create', ...)` smoke tests.

## Testing pure utils

Calculation or mapping logic belongs in a pure function in the lib's `utils/` (e.g. a rating or
grouping helper), not in a component. Those get plain unit tests with **no `TestBed`** — call the
function, assert the return. This is the cheapest, fastest layer, so push logic here and cover it
directly rather than through the DOM.

```ts
import { getAverageRating } from './rating.utils';

it('should average the rating sum over the count', () => {
  // Act
  const average = getAverageRating({ ratingSum: 40, ratingCount: 10 } as Dog);

  // Assert
  expect(average).toBe(4);
});
```

## Recipes for specific test shapes

Read the matching reference file before writing the test — each covers one shape in full,
with a worked example:

- **`references/mocking.md`** — mocking services inline in `MockProvider` (not
  `ngMocks.defaultMock`), and capturing spies into named variables and asserting on the
  variable, not the mock's property (`MockProvider`/`vi.spyOn` alike).
- **`references/testing-stores.md`** — testing a `signalStore`: providing it in `TestBed`,
  driving it through its methods, why `TestBed.tick()` is needed to flush an `onInit` effect,
  and using a small factory plus `TestBed.resetTestingModule()` when a test needs a different
  initial module.
- **`references/testing-components.md`** — the base fixture/`whenStable()` shape, presentational
  (dumb) components, asserting on `output()` emissions, the one sanctioned exception for reaching
  into a component's class, and container components (mock the store and the children).

## Running tests

Project names follow the lib path (`libs/dogs/feature` → `dogs-feature`).

```sh
npx nx test dogs-feature                       # one project
npx nx test dogs-feature -- -t "MyDogsStore"    # one describe/it by name
npx nx test dogs-feature -- --coverage          # per-file coverage table (v8)
npx nx run-many -t test                         # everything
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
- **Dumb components** take finished data via `input()` and render — assert the markup or the
  `output()`, don't reconstruct logic in the test.
- **Coordinate stores with events, test each side on its own.** A store that dispatches an event
  and a store that reacts to it (`withReducer(on(...))`) are each tested in isolation.
