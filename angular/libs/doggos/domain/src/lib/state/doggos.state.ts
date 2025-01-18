import { patchState, signalStore, withComputed, withHooks, withMethods, withState, } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { SignalRService } from '../services/signalr.service';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { DoggosApiService } from '../services/doggos-api.service';
import { NotificationService } from '@doggo-rating/shared/util-notification';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, filter, map, switchMap, tap } from 'rxjs';
import { UploadService } from '../services/upload.service';
import { Doggo, DoggoAddedEvent, DoggoDeletedEvent, DoggoRatedEvent, } from '../models/doggo';
import { AuthStore } from '@doggo-rating/shared/util-auth';

export interface DoggoState {
  doggos: Doggo[];
  myDoggos: Doggo[];
  selectedDoggo: Doggo | null;
  detailDoggo: Doggo | null;
  loading: boolean;
}

export const initialState: DoggoState = {
  doggos: [],
  myDoggos: [],
  selectedDoggo: null,
  detailDoggo: null,
  loading: false,
};

export const DoggosStore = signalStore(
  { providedIn: 'root' },
  withState<DoggoState>(initialState),
  withComputed((store, authStore = inject(AuthStore)) => ({
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
    getUserSub: computed(() => authStore.userSub()),
  })),
  withMethods(
    (
      store,
      signalRService = inject(SignalRService),
      router = inject(Router),
      notificationService = inject(NotificationService),
      doggosApiService = inject(DoggosApiService),
      uploadService = inject(UploadService)
    ) => ({
      loadDoggos: rxMethod<string | null>(
        switchMap((doggoId: string | null) => {
          patchState(store, { loading: true });

          return doggosApiService.getDoggos().pipe(
            tapResponse({
              next: (doggos) => {
                const currentDoggoId = doggoId || doggos[0]?.id || '-1';

                notificationService.showSuccess('Doggos Loaded');
                const selectedDoggo =
                  doggos.find((doggo) => doggo.id === currentDoggoId) ?? null;

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

      loadSingleDoggo: rxMethod<string>(
        switchMap((doggoId: string) => {
          patchState(store, { loading: true });

          return doggosApiService.getSingleDoggo(doggoId).pipe(
            tapResponse({
              next: (detailDoggo) => patchState(store, { detailDoggo }),
              error: () => notificationService.showError(),
              finalize: () => patchState(store, { loading: false }),
            })
          );
        })
      ),

      clearSingleDoggo() {
        patchState(store, { detailDoggo: null });
      },

      loadMyDoggos: rxMethod<void>(
        switchMap(() => {
          patchState(store, { loading: true });

          return doggosApiService.getMyDoggos().pipe(
            tapResponse({
              next: (myDoggos) => patchState(store, { myDoggos }),
              error: () => notificationService.showError(),
              finalize: () => patchState(store, { loading: false }),
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

      selectDoggo(id: string) {
        const selectedDoggo = store.doggos().find((doggo) => doggo.id === id);
        navigateToDoggo(router, selectedDoggo.id);
        patchState(store, { selectedDoggo });
      },

      selectNextDoggo() {
        const nextDoggoId = store.getNextDoggoIndex();
        const selectedDoggo = store.doggos()[nextDoggoId];

        navigateToDoggo(router, selectedDoggo.id);

        patchState(store, { selectedDoggo });
      },

      rateDoggo: rxMethod<number>(
        switchMap((rating: number) => {
          patchState(store, { loading: true });
          const { id } = store.selectedDoggo();

          return doggosApiService.rate(id, rating).pipe(
            tapResponse({
              next: () => {
                const nextDoggoId = store.getNextDoggoIndex();
                const selectedDoggo = store.doggos()[nextDoggoId];

                navigateToDoggo(router, selectedDoggo.id);

                patchState(store, { selectedDoggo });
              },
              error: () => {
                notificationService.showError();
              },
              finalize: () => patchState(store, { loading: false }),
            })
          );
        })
      ),

      rateDoggoFromRealTime: rxMethod<Doggo>(
        tap((ratedDoggo: Doggo) => {
          const { name, id } = ratedDoggo;

          const userId = store.getUserSub();
          if (isMyDoggo(ratedDoggo, userId)) {
            notificationService.showSuccess(`${name} was just rated!!!`);
          }

          const selectedDoggoId = store.selectedDoggo().id;

          if (isRatedDoggoSelected(id, selectedDoggoId)) {
            patchState(store, {
              selectedDoggo: ratedDoggo,
            });
          }

          const newDoggos = replaceItemInArray(store.doggos(), ratedDoggo);

          patchState(store, {
            doggos: newDoggos,
          });
        })
      ),

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
              error: () => {
                notificationService.showError();
              },
              finalize: () => patchState(store, { loading: false }),
            })
          );
        })
      ),

      addDoggoFromRealTime: rxMethod<Doggo>(
        tap((doggo: Doggo) => {
          const userId = store.getUserSub();
          if (isMyDoggo(doggo, userId)) {
            const myDoggos = [...store.myDoggos(), doggo];
            patchState(store, { myDoggos });
          }

          const doggos = [...store.doggos(), doggo];
          patchState(store, { doggos });
        })
      ),

      deleteDoggo: rxMethod<Doggo>(
        switchMap((doggo) => {
          patchState(store, { loading: true });

          return doggosApiService.deleteDoggo(doggo).pipe(
            tapResponse({
              next: (doggo) => {
                notificationService.showSuccess(`Doggo ${doggo.name} deleted`);

                const doggos = removeItemFromArray(store.doggos(), doggo.id);
                const myDoggos = removeItemFromArray(
                  store.myDoggos(),
                  doggo.id
                );

                patchState(store, { doggos, myDoggos });

                router.navigate(['/doggos/my']);
              },
              error: () => notificationService.showError(),
              finalize: () => patchState(store, { loading: false }),
            })
          );
        })
      ),

      deleteDoggoFromRealTime: rxMethod<string>(
        tap((id: string) => {
          const doggos = removeItemFromArray(store.doggos(), id);
          const myDoggos = removeItemFromArray(store.myDoggos(), id);

          patchState(store, { doggos, myDoggos });
        })
      ),
    })
  ),
  withHooks({
    onInit(store, signalRService = inject(SignalRService)) {
      const addedDoggo$ = signalRService.doggoEvents.pipe(
        filter(
          (event): event is DoggoAddedEvent => event.type === 'doggoadded'
        ),
        map(({ doggo }) => doggo)
      );
      const deletedDoggoId$ = signalRService.doggoEvents.pipe(
        filter(
          (event): event is DoggoDeletedEvent => event.type === 'doggodeleted'
        ),
        map(({ id }) => id)
      );
      const ratedDoggo$ = signalRService.doggoEvents.pipe(
        filter(
          (event): event is DoggoRatedEvent => event.type === 'doggorated'
        ),
        map(({ doggo }) => doggo)
      );

      store.addDoggoFromRealTime(addedDoggo$);
      store.rateDoggoFromRealTime(ratedDoggo$);
      store.deleteDoggoFromRealTime(deletedDoggoId$);
    },
  })
);

function navigateToDoggo(router: Router, doggoId: string): void {
  router.navigate(['/doggos'], {
    queryParams: { doggoId },
  });
}

function replaceItemInArray(array: Doggo[], newItem: Doggo): Doggo[] {
  const currentDoggoIndex = array.findIndex((x) => x.id === newItem.id);
  const allDoggosCopy = [...array];
  allDoggosCopy.splice(currentDoggoIndex, 1, newItem);

  return allDoggosCopy;
}

function removeItemFromArray(array: Doggo[], id: string): Doggo[] {
  return [...array].filter((existing) => existing.id !== id);
}

function isMyDoggo(doggo: Doggo, userSub: string): boolean {
  return doggo.userId === userSub;
}

function isRatedDoggoSelected(
  ratedDoggoId: string,
  selectedDoggoId: string
): boolean {
  return ratedDoggoId === selectedDoggoId;
}
