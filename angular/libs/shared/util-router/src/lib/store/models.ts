import { Signal } from '@angular/core';

export type ParamsConfig = Record<
  string,
  (param: string | undefined) => unknown
>;

export type ParamsComputed<Config extends ParamsConfig> = {
  [Key in keyof Config]: Config[Key] extends infer TransformFn
    ? TransformFn extends (...args: any[]) => any
      ? Signal<ReturnType<TransformFn>>
      : never
    : never;
};
