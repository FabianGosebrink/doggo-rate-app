---
name: create-nx-library
description: Use when the user asks to create a new Nx library in this workspace.
---

# Creating an Nx Library

When creating a new library, keep our architecture intact:

- Generate the library with the Nx Angular generator under the correct
  folder: feature and route libraries under `libs/<scope>/`, domain logic
  under `libs/<scope>/domain`, presentational components under
  `libs/<scope>/ui`, and utilities shared across the workspace under
  `libs/shared`.
- Immediately set the `tags` in the new `project.json` using BOTH a scope
  and a type tag:
  - `scope:` is the area the library belongs to, e.g. `scope:dogs`,
    `scope:about` or `scope:shared`.
  - `type:` is the kind of library: `type:container`, `type:domain`,
    `type:ui` or `type:util`.
- Respect the existing boundaries: a `type:container` may depend on
  `type:domain`, `type:ui` and `type:util`; a `type:domain` may only depend
  on `type:util`; a `scope:dogs` library may only depend on `scope:dogs` and
  `scope:shared`.
- After generating, run `nx run-many -t lint` (or the affected variant) to
  confirm no module boundary rule is violated.

## Example tags

```json
{
  "name": "dogs-ui",
  "tags": ["type:ui", "scope:dogs"]
}
```
