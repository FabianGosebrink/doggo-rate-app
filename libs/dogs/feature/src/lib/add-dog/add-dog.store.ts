import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, exhaustMap, map } from 'rxjs';
import { NotificationService } from '@dog-rating/shared/util-notification';
import { tapResponse } from '@ngrx/operators';
import { Router } from '@angular/router';
import {
  DogsApiService,
  DogsStore,
  UploadService,
} from '@dog-rating/dogs/domain';

export const AddDogStore = signalStore(
  withState({
    loading: false,
  }),
  withMethods(
    (
      store,
      router = inject(Router),
      notificationService = inject(NotificationService),
      dogsApiService = inject(DogsApiService),
      uploadService = inject(UploadService),
      dogsStore = inject(DogsStore),
    ) => ({
      addDogWithPicture: rxMethod(
        exhaustMap(({ name, breed, comment, formData }) => {
          patchState(store, { loading: true });

          return uploadService.upload(formData).pipe(
            map(({ path }) => ({ name, breed, comment, path })),
            concatMap(({ name, breed, comment, path }) =>
              dogsApiService.addDog(name, breed, comment, path),
            ),
            tapResponse({
              next: (dog) => {
                dogsStore.addDog(dog);
                notificationService.showSuccess(`Dog ${dog.name} added`);

                router.navigate(['/dogs/my']);
              },
              error: () => {
                notificationService.showError();
              },
              finalize: () => patchState(store, { loading: false }),
            }),
          );
        }),
      ),
    }),
  ),
);
