import { inject } from '@angular/core';
import { signalStoreFeature, withHooks, withMethods } from '@ngrx/signals';
import { Dog } from '../models/dog';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tap } from 'rxjs';
import { NotificationService } from '@dog-rating/shared/util-notification';
import { RealTimeStore } from '@dog-rating/shared/util-real-time';
import { AuthStore } from '@dog-rating/shared/util-auth';
import { DogsStore } from './dogs.store';

export function withDogRealtime() {
  return signalStoreFeature(
    withMethods(
      (
        _,
        notificationService = inject(NotificationService),
        authStore = inject(AuthStore),
        dogStore = inject(DogsStore),
      ) => ({
        deleteDogFromRealTime: rxMethod<string>(
          tap((id: string) => dogStore.removeDog(id)),
        ),

        addDogFromRealTime: rxMethod<Dog>(
          tap((dog: Dog) => dogStore.addDog(dog)),
        ),

        rateDogFromRealTime: rxMethod<Dog>(
          tap((rateddog: Dog) => {
            const { name } = rateddog;
            const userId = authStore.userSub();

            if (isMyDog(rateddog, userId)) {
              notificationService.showSuccess(`${name} was just rated!!!`);
            }

            dogStore.updateDog(rateddog);
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
            .on('dogadded', (dog) => store.addDogFromRealTime(dog));
          realTimeStore
            .connection()
            .on('dogdeleted', (id) => store.deleteDogFromRealTime(id));
          realTimeStore
            .connection()
            .on('dograted', (dog) => store.rateDogFromRealTime(dog));

          realTimeStore.startConnection();
        },
        onDestroy() {
          realTimeStore.stopConnection();
        },
      };
    }),
  );
}

function isMyDog(dog: Dog, userSub: string): boolean {
  return dog.userId === userSub;
}
