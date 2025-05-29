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
  DoggosApiService,
  DoggosStore,
} from '@doggo-rating/doggos/domain';
import { on, withReducer } from '@ngrx/signals/events';
import { NotificationService } from '@doggo-rating/shared/util-notification';

export const MyDoggosStore = signalStore(
  withState({ myDoggosIds: [] as string[] }),
  withComputed(({ myDoggosIds }, doggosStore = inject(DoggosStore)) => ({
    myDoggos: computed(() => {
      const entityMap = doggosStore.entityMap();

      return myDoggosIds()
        .map((id) => entityMap[id])
        .filter(Boolean);
    }),
  })),
  withReducer(
    on(dogAPIEvents.deleteDogSuccess, ({ payload }) => (state) => ({
      myDoggosIds: state.myDoggosIds.filter((id) => id !== payload.id),
    })),
  ),
  withMethods(
    (
      store,
      notificationService = inject(NotificationService),
      doggosApiService = inject(DoggosApiService),
    ) => ({
      loadMyDoggos: rxMethod<void>(
        exhaustMap(() =>
          doggosApiService.getMyDoggos().pipe(
            tapResponse({
              next: (myDoggos) => {
                const myDoggosIds = myDoggos.map(({ id }) => id);
                patchState(store, { myDoggosIds });
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
      store.loadMyDoggos();
    },
  }),
);
