import { inject } from '@angular/core';
import { exhaustMap, pipe, tap } from 'rxjs';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  addEntity,
  removeEntity,
  setAllEntities,
  upsertEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { tapResponse } from '@ngrx/operators';
import { Dog } from '../models/dog';
import { DogsApiService } from '../services/dogs-api.service';
import { NotificationService } from '@dog-rating/shared/util-notification';
import { withDogRemove } from './dog-remove.feature';

export const DogsStore = signalStore(
  { providedIn: 'root' },
  withEntities<Dog>(),
  withDogRemove(),
  withState({ loading: false }),
  withMethods(
    (
      store,
      notificationService = inject(NotificationService),
      dogsApiService = inject(DogsApiService),
    ) => ({
      loadDogs: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          exhaustMap(() =>
            dogsApiService.getDogs().pipe(
              tapResponse({
                next: (dogs) => {
                  patchState(store, setAllEntities(dogs), { loading: false });

                  notificationService.showSuccess('Dogs Loaded');
                },
                error: () => notificationService.showError(),
              }),
            ),
          ),
        ),
      ),

      removeDog(id: string) {
        patchState(store, removeEntity(id));
      },

      addDog(dog: Dog) {
        patchState(store, addEntity(dog));
      },

      updateDog(dog: Dog) {
        patchState(store, upsertEntity(dog));
      },
    }),
  ),
  withHooks({
    onInit(store) {
      store.loadDogs();
    },
  }),
);
