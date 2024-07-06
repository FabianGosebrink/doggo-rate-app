import { computed, inject, Signal } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { signalStoreFeature, withComputed, withMethods } from '@ngrx/signals';
import { ParamsComputed, ParamsConfig } from './models';

type QueryParamsMethods<Config extends ParamsConfig> = {
  [Key in keyof Config as `update${Capitalize<
    Key & string
  >}`]: Config[Key] extends infer TransformFn
    ? TransformFn extends (...args: any[]) => any
      ? (value: ReturnType<TransformFn>) => void
      : never
    : never;
};

export function withQueryParams<Config extends ParamsConfig>(config: Config) {
  return signalStoreFeature(
    withComputed(() => {
      const queryParams = injectQueryParams();

      return Object.keys(config).reduce(
        (acc, key) => ({
          ...acc,
          [key]: computed(() => {
            const value = queryParams()[key];

return config[key](value);
          }),
        }),
        {} as ParamsComputed<Config>
      );
    }),
    withMethods(() => {
      const router = inject(Router);

      return Object.keys(config).reduce(
        (acc, key) => ({
          ...acc,
          [`update${key[0].toUpperCase() + key.slice(1)}`]: (
            value: unknown
          ) => {
            router.navigate([], {
              queryParams: { [key]: value },
              queryParamsHandling: 'merge',
            });
          },
        }),
        {} as QueryParamsMethods<Config>
      );
    })
  );
}

function injectQueryParams(): Signal<Params> {
  const queryParams$ = inject(ActivatedRoute).queryParams;

  return toSignal(queryParams$, {
    initialValue: {} as Record<string, string | undefined>,
  });
}
