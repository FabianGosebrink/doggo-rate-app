# Mocking and spies

## Capture a spy only when it's free — don't spend a line just to name one

When the test itself creates or configures the spy with `vi.spyOn(...)`, capture its return
value into a local `const` and assert against that variable — the capture costs nothing, since
you're just naming the result of a line you already had to write.

```ts
// Do this
const getSpy = vi.spyOn(httpMock, 'get').mockReturnValue(of(mockDog));

// ...

expect(getSpy).toHaveBeenCalledWith(expect.stringContaining('api/dogs/1'));
```

```ts
// Not this — same line either way, so name the result
vi.spyOn(httpMock, 'get').mockReturnValue(of(mockDog));

// ...

expect(httpMock.get).toHaveBeenCalledWith(expect.stringContaining('api/dogs/1'));
```

**When the mock is already a `vi.fn()` set up elsewhere** — `MockProvider(..., { addDog: vi.fn() })`,
`ngMocks.defaultMock(...)`, a module-level `vi.mock(...)`, or a manually-built mock object like
`{ close: vi.fn() }` — and this test isn't reconfiguring it with `vi.spyOn`/`vi.mocked(...)`,
**don't** add a `const` just to alias it. That line has no other purpose, so it's pure noise;
assert on the object's property directly instead:

```ts
// Do this — dogsStore.addDog is already a vi.fn() from MockProvider, nothing to configure here
store.addDogWithPicture(dogData);

expect(dogsStore.addDog).toHaveBeenCalledWith(newDog);
```

```ts
// Not this — the const buys nothing; dogsStore.addDog was never reassigned in this test
const addDogSpy = dogsStore.addDog;

store.addDogWithPicture(dogData);

expect(addDogSpy).toHaveBeenCalledWith(newDog);
```

Rule of thumb: if a `vi.spyOn(...)` line already exists in this test, name its result. If it
doesn't, don't manufacture one. When you do capture, name the variable after what it does
(`getSpy`, `navigateSpy`, `closeSpy`), not `spy1`/`mockFn`.
