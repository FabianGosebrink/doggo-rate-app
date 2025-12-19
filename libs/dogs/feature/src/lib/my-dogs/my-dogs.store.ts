import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import {
  dogAPIEvents,
  DogsApiService,
  DogsStore,
} from '@dog-rating/dogs/domain';
import { on, withReducer } from '@ngrx/signals/events';
import { NotificationService } from '@dog-rating/shared/util-notification';

export const MyDogsStore = signalStore(
  withState({ myDogsIds: [] as string[] }),
  withComputed(({ myDogsIds }, dogsStore = inject(DogsStore)) => ({
    myDogs: computed(() => {
      const entityMap = dogsStore.entityMap();

      return myDogsIds()
        .map((id) => entityMap[id])
        .filter(Boolean);
    }),
  })),
  withReducer(
    on(dogAPIEvents.deleteDogSuccess, ({ payload }) => (state) => ({
      myDogsIds: state.myDogsIds.filter((id) => id !== payload.id),
    })),
  ),
  withMethods(
    (
      store,
      notificationService = inject(NotificationService),
      dogsApiService = inject(DogsApiService),
    ) => ({
      loadMyDogs: rxMethod<void>(
        exhaustMap(() =>
          dogsApiService.getMyDogs().pipe(
            tapResponse({
              next: (myDogs) => {
                const myDogsIds = myDogs.map(({ id }) => id);
                patchState(store, { myDogsIds });
              },
              error: () => notificationService.showError(),
            }),
          ),
        ),
      ),
    }),
  ),
  withHooks({
    onInit(store) {
      store.loadMyDogs();
    },
  }),
);
