import { AuthActions } from './../../auth/store/auth.actions';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { catchError, concatMap, EMPTY, map, of, switchMap, tap } from 'rxjs';
import { NotificationService } from '../../common/notifications/notification.service';
import { selectQueryParams } from '../../router.selectors';
import { DoggosService } from '../services/doggos.service';
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

@Injectable()
export class DoggosEffects {
  updateRoute$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DoggosActions.selectDoggo),
        tap(({ id }) => {
          this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { doggoId: id },
            queryParamsHandling: 'merge',
          });
        })
      ),
    { dispatch: false }
  );

  selectNextDoggo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DoggosActions.selectNextDoggo),
      concatLatestFrom(() => [
        this.store.pipe(select(getAllDoggos)),
        this.store.pipe(select(getNextDoggoIndex)),
      ]),
      map(([action, allDoggos, nextDoggoIndex]) => {
        const newSelectedDoggo = allDoggos[nextDoggoIndex];

        return DoggosActions.selectDoggo({ id: newSelectedDoggo.id });
      })
    )
  );

  rateDoggo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DoggosActions.rateDoggo),
      concatLatestFrom(() => [
        this.store.pipe(select(getSelectedDoggo)),
        this.store.pipe(select(getAllDoggos)),
        this.store.pipe(select(getNextDoggoIndex)),
      ]),
      concatMap(([{ rating }, selectedDoggo, allDoggos, nextDoggoIndex]) => {
        const { id } = selectedDoggo;

        return this.doggosService.rate(id, rating).pipe(
          concatMap(() => {
            const newSelectedDoggo = allDoggos[nextDoggoIndex];

            return [DoggosActions.selectDoggo({ id: newSelectedDoggo.id })];
          })
        );
      })
    )
  );

  loadDoggos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DoggosActions.loadDoggos),
      concatLatestFrom(() => this.store.select(selectQueryParams)),
      concatMap(([action, { doggoId }]) => {
        return this.doggosService.getDoggos().pipe(
          concatMap((doggos) => {
            const currentDoggoId = doggoId || doggos[0]?.id || '-1';

            this.notificationService.showSuccess('Doggos Loaded');

            return [
              DoggosActions.loadDoggosFinished({ doggos }),
              DoggosActions.selectDoggo({ id: currentDoggoId }),
            ];
          }),
          catchError(() => {
            this.notificationService.showError();

            return of(DoggosActions.loadDoggosError());
          })
        );
      })
    )
  );

  loadMyDoggosInitially$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DoggosActions.loadDoggosFinished),
      concatLatestFrom(() => this.store.select(selectIsLoggedIn)),
      concatMap(([_, isLoggedIn]) => {
        if (isLoggedIn) {
          return [DoggosActions.loadMyDoggos()];
        }

        return EMPTY;
      })
    )
  );

  loadMyDoggos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DoggosActions.loadMyDoggos, AuthActions.loginComplete),
      concatLatestFrom(() => this.store.select(selectUserSubject)),
      concatMap(([action, subject]) => {
        return this.doggosService
          .getMyDoggos()
          .pipe(
            map((doggos) => DoggosActions.loadMyDoggosFinished({ doggos }))
          );
      })
    )
  );

  addDoggoWithPicture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DoggosActions.addDoggoWithPicture),
      concatMap(({ name, breed, comment, formData }) => {
        return this.uploadService.upload(formData).pipe(
          map(({ path }) => {
            return { name, breed, comment, path };
          })
        );
      }),
      concatMap(({ name, breed, comment, path }) => {
        return this.doggosService.addDoggo(name, breed, comment, path).pipe(
          map((doggo) => {
            return DoggosActions.addDoggoFinished({ doggo });
          })
        );
      })
    )
  );

  deleteDoggo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DoggosActions.deleteDoggo),
      concatMap(({ doggo }) => {
        return this.doggosService.deleteDoggo(doggo).pipe(
          map((doggo) => {
            return DoggosActions.deleteDoggoFinished({ id: doggo.id });
          })
        );
      })
    )
  );

  rateDoggoRealtimeFinished$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DoggosActions.rateDoggoRealtimeFinished),
      concatLatestFrom(() => this.store.select(getAllIdsOfMyDoggos)),
      map(([{ doggo }, ids]) => {
        const { name, id } = doggo;
        const isMyDoggo = ids.includes(id);

        if (isMyDoggo) {
          this.notificationService.showSuccess(`${name} was just rated!!!`);
        }

        return DoggosActions.rateDoggoFinished({ doggo });
      })
    )
  );

  addDoggoRealtimeFinished$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DoggosActions.addDoggoRealtimeFinished),
      concatLatestFrom(() => this.store.select(selectUserSubject)),
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
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private doggosService: DoggosService,
    private uploadService: UploadService,
    private notificationService: NotificationService
  ) {}
}
