---
name: create-component-pair
description: Use when the user asks for a new screen or feature component that displays data.
---

# Creating a Container and Presentational Component Pair

When a feature needs to show data and react to user actions, create two
components, not one:

## Container (smart) component

- Lives in the feature or container library.
- Injects the relevant Signal Store and reads state from it.
- Holds NO markup logic beyond wiring: it passes state down through inputs
  and reacts to outputs by calling store methods.
- Uses `changeDetection: ChangeDetectionStrategy.OnPush`.

## Presentational (dumb) component

- Lives in the `ui` library of the same scope.
- Receives data through `input()` (use `input.required()` when the value is
  mandatory) and reports user actions through `output()`.
- Injects NO store and NO services. It only renders inputs and emits
  outputs, which keeps it trivial to reuse and to test.

## Example presentational component

```ts
import { Component, input, output } from '@angular/core';
import { Dog } from '@dog-rating/dogs/domain';

@Component({
  selector: 'lib-dog-list',
  templateUrl: './dog-list.component.html',
  styleUrl: './dog-list.component.scss',
})
export class DogListComponent {
  dogs = input<Dog[]>([]);
  dogSelected = output<string>();
}
```
