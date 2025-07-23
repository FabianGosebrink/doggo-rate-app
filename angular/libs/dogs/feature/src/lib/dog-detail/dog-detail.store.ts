import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, filter, pipe, tap } from 'rxjs';
import { NotificationService } from '@dog-rating/shared/util-notification';
import { tapResponse } from '@ngrx/operators';
import { DogsApiService, DogsStore } from '@dog-rating/dogs/domain';

export const DogDetailsStore = signalStore(
  withState({
    dogId: null as string | null,
  }),
  withComputed((store, dogsStore = inject(DogsStore)) => ({
    detailDog: computed(() => {
      const dogId = store.dogId();
      const entityMap = dogsStore.entityMap();

      return dogId ? entityMap[dogId] : null;
    }),
  })),
  withMethods(
    (
      store,
      dogsStore = inject(DogsStore),
      notificationService = inject(NotificationService),
      doggosApiService = inject(DogsApiService),
    ) => ({
      loadSingleDogIfNotLoaded: rxMethod<string>(
        pipe(
          tap((id) => patchState(store, { dogId: id })),
          filter((id) => !dogsStore.entityMap()[id]),
          exhaustMap((id) =>
            doggosApiService.getSingleDog(id).pipe(
              tapResponse({
                next: (dog) => dogsStore.addDog(dog),
                error: () => notificationService.showError(),
              }),
            ),
          ),
        ),
      ),
    }),
  ),
);
