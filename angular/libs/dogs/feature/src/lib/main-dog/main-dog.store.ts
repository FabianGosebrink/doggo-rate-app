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
import { NotificationService } from '@dog-rating/shared/util-notification';
import { tapResponse } from '@ngrx/operators';
import { Router } from '@angular/router';
import {
  DogsApiService,
  DogsStore,
  withDogRealtime,
} from '@dog-rating/dogs/domain';

export const MainDogStore = signalStore(
  withState({ selectedDogId: null as string | null }),
  withDogRealtime(),
  withComputed((store, dogsStore = inject(DogsStore)) => ({
    nextDogIndex: computed(() => {
      const currentDogIndex = dogsStore
        .entities()
        .findIndex((dog) => dog.id === store.selectedDogId());

      return (currentDogIndex + 1) % dogsStore.entities().length;
    }),
    selectedDog: computed(() => {
      const selectedId = store.selectedDogId();
      const allEntities = dogsStore.entityMap();

      return selectedId ? allEntities[selectedId] : dogsStore.entities()[0];
    }),
    dogs: dogsStore.entities,
    loading: dogsStore.loading,
  })),
  withMethods(
    (
      store,
      notificationService = inject(NotificationService),
      dogsApiService = inject(DogsApiService),
      dogsStore = inject(DogsStore),
    ) => ({
      selectDog: rxMethod<string>(
        tap((selectedDogId: string) => patchState(store, { selectedDogId })),
      ),

      selectNextDog() {
        const nextDogIndex = store.nextDogIndex();
        const selectedDog = dogsStore.entities()[nextDogIndex];

        patchState(store, { selectedDogId: selectedDog.id });
      },

      rateDog: rxMethod<number>(
        exhaustMap((rating: number) => {
          const { id } = store.selectedDog();

          return dogsApiService.rate(id, rating).pipe(
            tapResponse({
              next: () => {
                const nextDogIndex = store.nextDogIndex();
                const selectedDog = dogsStore.entities()[nextDogIndex];

                patchState(store, { selectedDogId: selectedDog.id });
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
        const selectedDog = store.selectedDog();

        if (selectedDog) {
          navigateToDog(router, selectedDog.id);
        }
      });
    },
  }),
);

function navigateToDog(router: Router, dogId: string): void {
  router.navigate(['/dogs'], {
    queryParams: { dogId },
  });
}
