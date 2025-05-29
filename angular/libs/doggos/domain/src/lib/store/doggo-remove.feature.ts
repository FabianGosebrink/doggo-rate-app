import { inject } from '@angular/core';
import { signalStoreFeature, type } from '@ngrx/signals';
import { Doggo } from '../models/doggo';
import { exhaustMap } from 'rxjs';
import { mapResponse } from '@ngrx/operators';
import { DoggosApiService } from '../services/doggos-api.service';
import { Router } from '@angular/router';
import { NotificationService } from '@doggo-rating/shared/util-notification';
import {
  eventGroup,
  Events,
  on,
  withEffects,
  withReducer,
} from '@ngrx/signals/events';
import { removeEntity } from '@ngrx/signals/entities';

export const dogUserEvents = eventGroup({
  source: 'Dogs User',
  events: {
    deleteDog: type<Doggo>(),
  },
});

export const dogAPIEvents = eventGroup({
  source: 'Dogs API',
  events: {
    deleteDogSuccess: type<Doggo>(),
  },
});

export function withDoggoRemove() {
  return signalStoreFeature(
    withReducer(
      on(dogAPIEvents.deleteDogSuccess, ({ payload }) =>
        removeEntity(payload.id),
      ),
    ),
    withEffects(
      (
        _,
        events = inject(Events),
        doggosApiService = inject(DoggosApiService),
        router = inject(Router),
        notificationService = inject(NotificationService),
      ) => ({
        deleteDog: events.on(dogUserEvents.deleteDog).pipe(
          exhaustMap(({ payload }) =>
            doggosApiService.deleteDoggo(payload).pipe(
              mapResponse({
                next: () => {
                  router.navigate(['/doggos/my']);

                  return dogAPIEvents.deleteDogSuccess(payload);
                },
                error: () => notificationService.showError(),
              }),
            ),
          ),
        ),
      }),
    ),
  );
}
