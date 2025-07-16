import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, exhaustMap, map } from 'rxjs';
import { NotificationService } from '@doggo-rating/shared/util-notification';
import { tapResponse } from '@ngrx/operators';
import { Router } from '@angular/router';
import {
  DoggosApiService,
  DoggosStore,
  UploadService,
} from '@doggo-rating/doggos/domain';

export const AddDoggoStore = signalStore(
  withState({
    loading: false,
  }),
  withMethods(
    (
      store,
      router = inject(Router),
      notificationService = inject(NotificationService),
      doggosApiService = inject(DoggosApiService),
      uploadService = inject(UploadService),
      doggosStore = inject(DoggosStore),
    ) => ({
      addDoggoWithPicture: rxMethod(
        exhaustMap(({ name, breed, comment, formData }) => {
          patchState(store, { loading: true });

          return uploadService.upload(formData).pipe(
            map(({ path }) => ({ name, breed, comment, path })),
            concatMap(({ name, breed, comment, path }) =>
              doggosApiService.addDoggo(name, breed, comment, path),
            ),
            tapResponse({
              next: (doggo) => {
                doggosStore.addDoggo(doggo);
                notificationService.showSuccess(`Dog ${doggo.name} added`);

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
