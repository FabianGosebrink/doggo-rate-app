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
import { Doggo } from '../models/doggo';
import { DoggosApiService } from '../services/doggos-api.service';
import { NotificationService } from '@doggo-rating/shared/util-notification';
import { withDoggoRemove } from './doggo-remove.feature';

export const DoggosStore = signalStore(
  { providedIn: 'root' },
  withEntities<Doggo>(),
  withDoggoRemove(),
  withState({ loading: false }),
  withMethods(
    (
      store,
      notificationService = inject(NotificationService),
      doggosApiService = inject(DoggosApiService),
    ) => ({
      loadDoggos: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          exhaustMap(() =>
            doggosApiService.getDoggos().pipe(
              tapResponse({
                next: (doggos) => {
                  patchState(store, setAllEntities(doggos), { loading: false });

                  notificationService.showSuccess('Dogs Loaded');
                },
                error: () => notificationService.showError(),
              }),
            ),
          ),
        ),
      ),

      removeDoggo(id: string) {
        patchState(store, removeEntity(id));
      },

      addDoggo(doggo: Doggo) {
        patchState(store, addEntity(doggo));
      },

      updateDoggo(doggo: Doggo) {
        patchState(store, upsertEntity(doggo));
      },
    }),
  ),
  withHooks({
    onInit(store) {
      store.loadDoggos();
    },
  }),
);
