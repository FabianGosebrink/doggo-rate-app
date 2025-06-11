import { inject } from '@angular/core';
import { signalStoreFeature, withHooks, withMethods } from '@ngrx/signals';
import { Doggo } from '../models/doggo';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tap } from 'rxjs';
import { NotificationService } from '@doggo-rating/shared/util-notification';
import { RealTimeStore } from '@doggo-rating/shared/util-real-time';
import { AuthStore } from '@doggo-rating/shared/util-auth';
import { DoggosStore } from './doggos.store';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function withDoggoRealtime() {
  return signalStoreFeature(
    withMethods(
      (
        _,
        notificationService = inject(NotificationService),
        authStore = inject(AuthStore),
        doggoStore = inject(DoggosStore),
      ) => ({
        deleteDoggoFromRealTime: rxMethod<string>(
          tap((id: string) => doggoStore.removeDoggo(id)),
        ),

        addDoggoFromRealTime: rxMethod<Doggo>(
          tap((doggo: Doggo) => doggoStore.addDoggo(doggo)),
        ),

        rateDoggoFromRealTime: rxMethod<Doggo>(
          tap((ratedDoggo: Doggo) => {
            const { name } = ratedDoggo;
            const userId = authStore.userSub();

            if (isMyDoggo(ratedDoggo, userId)) {
              notificationService.showSuccess(`${name} was just rated!!!`);
            }

            doggoStore.updateDoggo(ratedDoggo);
          }),
        ),
      }),
    ),
    withHooks((store) => {
      const realTimeStore = inject(RealTimeStore);

      return {
        onInit() {
          realTimeStore
            .connection()
            .on('doggoadded', (doggo) => store.addDoggoFromRealTime(doggo));
          realTimeStore
            .connection()
            .on('doggodeleted', (id) => store.deleteDoggoFromRealTime(id));
          realTimeStore
            .connection()
            .on('doggorated', (doggo) => store.rateDoggoFromRealTime(doggo));

          realTimeStore.startConnection();
        },
        onDestroy() {
          realTimeStore.stopConnection();
        },
      };
    }),
  );
}

function isMyDoggo(doggo: Doggo, userSub: string): boolean {
  return doggo.userId === userSub;
}
