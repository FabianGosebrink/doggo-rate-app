import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { EMPTY, catchError, concatMap, map, of, tap } from 'rxjs';
import { NotificationService } from '../../common/notifications/notification.service';
import { selectQueryParams } from '../../router.selectors';
import { DoggosService } from '../services/doggos.service';
import { AuthActions } from './../../auth/store/auth.actions';
import {
  selectIsLoggedIn,
  selectUserSubject,
} from './../../auth/store/auth.selectors';
import { UploadService } from './../services/upload.service';
import { DoggosActions } from './doggos.actions';
import {
  getAllDoggos,
  getAllIdsOfMyDoggos,
  getNextDoggoIndex,
  getSelectedDoggo,
} from './doggos.selectors';

export const updateRoute = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(DoggosActions.selectDoggo),
      tap(({ id }) => {
        router.navigate(['/doggos'], {
          queryParams: { doggoId: id },
        });
      })
    );
  },
  { functional: true, dispatch: false }
);

export const selectNextDoggo = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(DoggosActions.selectNextDoggo),
      concatLatestFrom(() => [
        store.pipe(select(getAllDoggos)),
        store.pipe(select(getNextDoggoIndex)),
      ]),
      map(([action, allDoggos, nextDoggoIndex]) => {
        const newSelectedDoggo = allDoggos[nextDoggoIndex];

        return DoggosActions.selectDoggo({ id: newSelectedDoggo.id });
      })
    );
  },
  { functional: true }
);

export const rateDoggo = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    doggosService = inject(DoggosService)
  ) => {
    return actions$.pipe(
      ofType(DoggosActions.rateDoggo),
      concatLatestFrom(() => [
        store.pipe(select(getSelectedDoggo)),
        store.pipe(select(getAllDoggos)),
        store.pipe(select(getNextDoggoIndex)),
      ]),
      concatMap(([{ rating }, selectedDoggo, allDoggos, nextDoggoIndex]) => {
        const { id } = selectedDoggo;

        return doggosService.rate(id, rating).pipe(
          concatMap(() => {
            const newSelectedDoggo = allDoggos[nextDoggoIndex];

            return [DoggosActions.selectDoggo({ id: newSelectedDoggo.id })];
          })
        );
      })
    );
  },
  { functional: true }
);

export const loadDoggos = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    doggosService = inject(DoggosService),
    notificationService = inject(NotificationService)
  ) => {
    return actions$.pipe(
      ofType(DoggosActions.loadDoggos),
      concatLatestFrom(() => store.select(selectQueryParams)),
      concatMap(([action, { doggoId }]) => {
        return doggosService.getDoggos().pipe(
          concatMap((doggos) => {
            const currentDoggoId = doggoId || doggos[0]?.id || '-1';

            notificationService.showSuccess('Doggos Loaded');

            return [
              DoggosActions.loadDoggosFinished({ doggos }),
              DoggosActions.selectDoggo({ id: currentDoggoId }),
            ];
          }),
          catchError(() => {
            notificationService.showError();

            return of(DoggosActions.loadDoggosError());
          })
        );
      })
    );
  },
  { functional: true }
);

export const loadMyDoggosInitially = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(DoggosActions.loadDoggosFinished),
      concatLatestFrom(() => store.select(selectIsLoggedIn)),
      concatMap(([_, isLoggedIn]) => {
        if (isLoggedIn) {
          return [DoggosActions.loadMyDoggos()];
        }

        return EMPTY;
      })
    );
  },
  { functional: true }
);

export const loadMyDoggos = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    doggosService = inject(DoggosService)
  ) => {
    return actions$.pipe(
      ofType(DoggosActions.loadMyDoggos, AuthActions.loginComplete),
      concatLatestFrom(() => store.select(selectUserSubject)),
      concatMap(([action, subject]) => {
        return doggosService
          .getMyDoggos()
          .pipe(
            map((doggos) => DoggosActions.loadMyDoggosFinished({ doggos }))
          );
      })
    );
  },
  { functional: true }
);

export const loadMaddDoggoWithPictureyDoggos = createEffect(
  (
    actions$ = inject(Actions),
    uploadService = inject(UploadService),
    doggosService = inject(DoggosService)
  ) => {
    return actions$.pipe(
      ofType(DoggosActions.addDoggoWithPicture),
      concatMap(({ name, breed, comment, formData }) => {
        return uploadService.upload(formData).pipe(
          map(({ path }) => {
            return { name, breed, comment, path };
          })
        );
      }),
      concatMap(({ name, breed, comment, path }) => {
        return doggosService.addDoggo(name, breed, comment, path).pipe(
          map((doggo) => {
            return DoggosActions.addDoggoFinished({ doggo });
          })
        );
      })
    );
  },
  { functional: true }
);

export const deleteDoggo = createEffect(
  (actions$ = inject(Actions), doggosService = inject(DoggosService)) => {
    return actions$.pipe(
      ofType(DoggosActions.deleteDoggo),
      concatMap(({ doggo }) => {
        return doggosService.deleteDoggo(doggo).pipe(
          map((doggo) => {
            return DoggosActions.deleteDoggoFinished({ id: doggo.id });
          })
        );
      })
    );
  },
  { functional: true }
);

export const rateDoggoRealtimeFinished = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    notificationService = inject(NotificationService)
  ) => {
    return actions$.pipe(
      ofType(DoggosActions.rateDoggoRealtimeFinished),
      concatLatestFrom(() => store.select(getAllIdsOfMyDoggos)),
      map(([{ doggo }, ids]) => {
        const { name, id } = doggo;
        const isMyDoggo = ids.includes(id);

        if (isMyDoggo) {
          notificationService.showSuccess(`${name} was just rated!!!`);
        }

        return DoggosActions.rateDoggoFinished({ doggo });
      })
    );
  },
  { functional: true }
);

export const addDoggoRealtimeFinished = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(DoggosActions.addDoggoRealtimeFinished),
      concatLatestFrom(() => store.select(selectUserSubject)),
      concatMap(([{ doggo }, userSub]) => {
        const { userId } = doggo;
        const isMyDoggo = userId === userSub;

        if (isMyDoggo) {
          return [
            DoggosActions.addDoggoToAllDoggos({
              doggo,
            }),
            DoggosActions.addDoggoToMyDoggos({
              doggo,
            }),
          ];
        }

        return [
          DoggosActions.addDoggoToAllDoggos({
            doggo,
          }),
        ];
      })
    );
  },
  { functional: true }
);
