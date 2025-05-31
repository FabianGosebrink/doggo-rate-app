import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, effect, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, tap } from 'rxjs';
import { NotificationService } from '@doggo-rating/shared/util-notification';
import { tapResponse } from '@ngrx/operators';
import { Router } from '@angular/router';
import {
  DoggosApiService,
  DoggosStore,
  withDoggoRealtime,
} from '@doggo-rating/doggos/domain';

export const MainDoggosStore = signalStore(
  withState({ selectedDoggoId: null as string | null }),
  withDoggoRealtime(),
  withComputed((store, doggoStore = inject(DoggosStore)) => ({
    nextDoggoIndex: computed(() => {
      const currentDoggoIndex = doggoStore
        .entities()
        .findIndex((doggo) => doggo.id === store.selectedDoggoId());

      return (currentDoggoIndex + 1) % doggoStore.entities().length;
    }),
    selectedDoggo: computed(() => {
      const selectedId = store.selectedDoggoId();
      const allEntities = doggoStore.entityMap();

      return selectedId ? allEntities[selectedId] : doggoStore.entities()[0];
    }),
    doggos: doggoStore.entities,
    loading: doggoStore.loading,
  })),
  withMethods(
    (
      store,
      notificationService = inject(NotificationService),
      doggosApiService = inject(DoggosApiService),
      doggoStore = inject(DoggosStore),
    ) => ({
      selectDoggo: rxMethod<string>(
        tap((selectedDoggoId: string) =>
          patchState(store, { selectedDoggoId }),
        ),
      ),

      selectNextDoggo() {
        const nextDoggoIndex = store.nextDoggoIndex();
        const selectedDoggo = doggoStore.entities()[nextDoggoIndex];

        patchState(store, { selectedDoggoId: selectedDoggo.id });
      },

      rateDoggo: rxMethod<number>(
        exhaustMap((rating: number) => {
          const { id } = store.selectedDoggo();

          return doggosApiService.rate(id, rating).pipe(
            tapResponse({
              next: () => {
                const nextDoggoIndex = store.nextDoggoIndex();
                const selectedDoggo = doggoStore.entities()[nextDoggoIndex];

                patchState(store, { selectedDoggoId: selectedDoggo.id });
              },
              error: () => notificationService.showError(),
            }),
          );
        }),
      ),
    }),
  ),
  withHooks({
    onInit(store, router = inject(Router)) {
      effect(() => {
        const selectedDoggo = store.selectedDoggo();

        if (selectedDoggo) {
          navigateToDoggo(router, selectedDoggo.id);
        }
      });
    },
  }),
);

function navigateToDoggo(router: Router, doggoId: string): void {
  router.navigate(['/doggos'], {
    queryParams: { doggoId },
  });
}
