import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { DoggoState, initialState } from './doggos.state';
import { computed, inject } from '@angular/core';
import { SignalRService } from '../services/signalr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { DoggosApiService } from '../services/doggos-api.service';
import { NotificationService } from '@ps-doggo-rating/shared/util-notification';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, map, switchMap } from 'rxjs';
import { UploadService } from '../services/upload.service';

export const DoggosStore = signalStore(
  { providedIn: 'root' },
  withState<DoggoState>(initialState),
  withComputed((store) => ({
    getAllIdsOfMyDoggos: computed(() => {
      const myDoggos = store.myDoggos();

      if (myDoggos.length === 0) {
        return [];
      }

      return myDoggos.map((x) => x.id);
    }),
    getSelectedDoggoIndex: computed(() => {
      return store
        .doggos()
        .findIndex((doggo) => doggo.id === store.selectedDoggo().id);
    }),
    getNextDoggoIndex: computed(() => {
      const currentDoggoIndex = store
        .doggos()
        .findIndex((doggo) => doggo.id === store.selectedDoggo().id);

      return (currentDoggoIndex + 1) % store.doggos().length;
    }),
    getAllDoggosButSelected: computed(() => {
      if (store.doggos().length === 0) {
        return [];
      }

      if (!store.selectedDoggo()) {
        return store.doggos();
      }

      return store
        .doggos()
        .filter((doggo) => doggo.id !== store.selectedDoggo().id);
    }),
  })),
  withMethods(
    (
      store,
      signalRService = inject(SignalRService),
      router = inject(Router),
      notificationService = inject(NotificationService),
      doggosApiService = inject(DoggosApiService),
      uploadService = inject(UploadService),
      activatedRoute = inject(ActivatedRoute)
    ) => ({
      loadDoggos: rxMethod<void>(
        switchMap(() => {
          patchState(store, { loading: true });
          const doggoId = activatedRoute.snapshot.queryParams['id'];

          return doggosApiService.getDoggos().pipe(
            tapResponse({
              next: (doggos) => {
                const currentDoggoId = doggoId || doggos[0]?.id || '-1';

                notificationService.showSuccess('Doggos Loaded');
                const selectedDoggo = doggos[0] ?? null;

                patchState(store, { doggos, selectedDoggo });

                navigateToDoggo(router, currentDoggoId);
              },
              error: () => {
                notificationService.showError();
              },
              finalize: () => patchState(store, { loading: false }),
            })
          );
        })
      ),
      rateDoggo: rxMethod<number>(
        switchMap((rating: number) => {
          patchState(store, { loading: true });
          const { id } = store.selectedDoggo();

          return doggosApiService.rate(id, rating).pipe(
            tapResponse({
              next: () => {
                //const newSelectedDoggo = allDoggos[nextDoggoIndex];

                navigateToDoggo(router, id);
              },
              error: (err) => {
                console.error(err);
              },
            })
          );
        })
      ),
      startListeningToRealtimeDoggoEvents() {
        signalRService.start();
      },

      stopListeningToRealtimeDoggoEvents() {
        signalRService.stop();
      },

      addDoggoWithPicture: rxMethod(
        switchMap(({ name, breed, comment, formData }) => {
          patchState(store, { loading: true });

          return uploadService.upload(formData).pipe(
            map(({ path }) => ({ name, breed, comment, path })),
            concatMap(({ name, breed, comment, path }) => {
              return doggosApiService.addDoggo(name, breed, comment, path);
            }),
            tapResponse({
              next: (doggo) => {
                notificationService.showSuccess(`Doggo ${doggo.name} added`);

                router.navigate(['/doggos/my']);
              },
              error: (err) => console.log(err),
            })
          );
        })
      ),
    })
  )
  // withMethods((store) => {
  //   const signalRService = inject(SignalRService);
  //   const router = inject(Router);
  //   const notificationService = inject(NotificationService);
  //   const doggosApiService = inject(DoggosApiService);
  //   const uploadService = inject(UploadService);
  //   const activatedRoute = inject(ActivatedRoute);
  //
  //   return {
  //     startListeningToRealtimeDoggoEvents() {
  //       signalRService.start();
  //     },
  //
  //     stopListeningToRealtimeDoggoEvents() {
  //       signalRService.stop();
  //     },
  //
  //     selectDoggo(id: string) {
  //       navigateToDoggo(router, id);
  //     },
  //
  //     selectNextDoggo() {
  //       const allDoggos = store.doggos();
  //       const nextDoggoIndex = getNextDoggoIndex(store);
  //       const newSelectedDoggo = allDoggos[nextDoggoIndex];
  //
  //       navigateToDoggo(router, newSelectedDoggo.id);
  //     },
  //
  //     rateDoggo(rating: number) {
  //       const nextDoggoIndex = getNextDoggoIndex(store);
  //       const allDoggos = store.doggos();
  //       const { id } = store.selectedDoggo();
  //
  //       return doggosApiService.rate(id, rating).pipe(
  //         tapResponse({
  //           next: () => {
  //             const newSelectedDoggo = allDoggos[nextDoggoIndex];
  //
  //             navigateToDoggo(router, newSelectedDoggo.id);
  //           },
  //           error: (err) => {
  //             console.error(err);
  //           },
  //         })
  //       );
  //     },
  //
  //     logIntervals: rxMethod(pipe(tap(() => console.log(`Even number:`)))),
  //
  //     loadMyDoggos() {
  //       const doggoId = activatedRoute.snapshot.queryParams['id'];
  //
  //       return doggosApiService.getMyDoggos().pipe(
  //         tapResponse({
  //           next: (doggos) => {
  //             const currentDoggoId = doggoId || doggos[0]?.id || '-1';
  //
  //             notificationService.showSuccess('Doggos Loaded');
  //
  //             navigateToDoggo(router, currentDoggoId);
  //           },
  //           error: () => {
  //             notificationService.showError();
  //           },
  //         })
  //       );
  //     },
  //
  //     // deleteItem: rxMethod<Entity>(
  //     //   switchMap((item) => {
  //     //     patchState(store, { loading: true });
  //     //
  //     //     return service.deleteItem(item).pipe(
  //     //       tapResponse({
  //     //         next: () => {
  //     //           patchState(store, {
  //     //             items: [...store.items().filter((x) => x.id !== item.id)],
  //     //           });
  //     //         },
  //     //         error: console.error,
  //     //         finalize: () => patchState(store, { loading: false }),
  //     //       })
  //     //     );
  //     //   })
  //     // ),
  //

  //   };
  // }),
);

function getNextDoggoIndex(store: any): number {
  const currentDoggoIndex = store
    .doggos()
    .findIndex((doggo) => doggo.id === store.selectedDoggo().id);

  return (currentDoggoIndex + 1) % store.doggos().length;
}

function navigateToDoggo(router: Router, doggoId: string): void {
  router.navigate(['/doggos'], {
    queryParams: { doggoId },
  });
}
