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
import { NotificationService } from '@doggo-rating/shared/util-notification';
import { tapResponse } from '@ngrx/operators';
import { DoggosApiService, DoggosStore } from '@doggo-rating/doggos/domain';

export const DoggoDetailsStore = signalStore(
  withState({
    doggoId: null as string | null,
  }),
  withComputed((store, doggosStore = inject(DoggosStore)) => ({
    detailDoggo: computed(() => {
      const doggoId = store.doggoId();
      const entityMap = doggosStore.entityMap();

      return doggoId ? entityMap[doggoId] : null;
    }),
  })),
  withMethods(
    (
      store,
      doggosStore = inject(DoggosStore),
      notificationService = inject(NotificationService),
      doggosApiService = inject(DoggosApiService),
    ) => ({
      loadSingleDoggoIfNotLoaded: rxMethod<string>(
        pipe(
          tap((id) => patchState(store, { doggoId: id })),
          filter((id) => !doggosStore.entityMap()[id]),
          exhaustMap((id) =>
            doggosApiService.getSingleDoggo(id).pipe(
              tapResponse({
                next: (doggo) => doggosStore.addDoggo(doggo),
                error: () => notificationService.showError(),
              }),
            ),
          ),
        ),
      ),
    }),
  ),
);
