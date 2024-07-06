import { computed, inject, Signal } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { signalStoreFeature, withComputed } from '@ngrx/signals';
import { ParamsComputed, ParamsConfig } from './models';

export function withRouteParams<Config extends ParamsConfig>(config: Config) {
  return signalStoreFeature(
    withComputed(() => {
      const routeParams = injectRouteParams();

      return Object.keys(config).reduce(
        (acc, key) => ({
          ...acc,
          [key]: computed(() => {
            const value = routeParams()[key];

return config[key](value);
          }),
        }),
        {} as ParamsComputed<Config>
      );
    })
  );
}

function injectRouteParams(): Signal<Params> {
  const params$ = inject(ActivatedRoute).params;

  return toSignal(params$, {
    initialValue: {} as Record<string, string | undefined>,
  });
}
