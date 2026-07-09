---
name: angular-signals
description: Use whenever writing or editing an Angular `computed()` or `effect()` — including signal-based derivations inside `signalStore` (`withComputed`), component `computed`s, and any `effect`. Applies even for one-line derivations.
---

# Angular signals — read your dependencies first

When you write a `computed()` or an `effect()`, **read every signal the callback
depends on into a `const` on the first lines of the callback, then work from those
locals below.** Do not call signal getters inline in the middle of the logic.

```ts
// Do this
readonly summary = computed(() => {
  const entries = this.entries();
  const rate = this.rate();

  return entries.reduce((sum, e) => sum + e.amount * rate, 0);
});
```

```ts
// Not this
readonly summary = computed(() =>
  this.entries().reduce((sum, e) => sum + e.amount * this.rate(), 0),
);
```

The same rule applies to `effect()`:

```ts
effect(() => {
  const isOpen = this.isOpen();
  const id = this.itemKey();

  this.sync(id, isOpen);
});
```

## Why this matters

- **Dependencies are visible at a glance.** The reader sees exactly what the
  `computed`/`effect` reacts to by reading the top of the block — no scanning the
  whole body to reconstruct the reactive graph.
- **Tracking is unconditional and predictable.** A signal becomes a dependency only
  if it is *read during execution*. Reading a signal inside a branch (`if`, `&&`, a
  ternary, an early `return`) means it is **not tracked** when that branch is
  skipped — a classic "why didn't this recompute?" bug. Reading everything up front
  guarantees a stable dependency set on every run.
- **One consistent value per run.** Each signal is read once into a local, so the
  whole computation sees a single snapshot and you avoid repeated getter calls.

## How to apply

- Put the reads first, one `const` per signal, before any logic or control flow.
- Name the local after what it holds (`entries`, `rate`, `isOpen`), not after the
  signal call.
- This holds even for trivial one-liners — prefer the explicit block over an inline
  arrow so the convention is uniform and diffs stay small when logic grows.
- It applies everywhere signals are consumed reactively: `withComputed` in a
  `signalStore`, component-level `computed`, and `effect`.

Consistent with the signal guidance in `CLAUDE.md` (feed a signal into a store and
read it inside a `computed`) and the `state-management` skill.
