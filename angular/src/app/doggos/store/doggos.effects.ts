import { UploadService } from './../services/upload.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, EMPTY } from 'rxjs';
import { map, tap } from 'rxjs';
import { selectQueryParams } from '../../router.selectors';
import { Doggo } from '../models/doggo';
import { DoggosService } from '../services/doggos.service';
import { DoggosActions } from './doggos.actions';
import {
  getAllDoggos,
  getSelectedDoggo,
  getNextDoggoIndex,
} from './doggos.selectors';
import { EmptyExpr } from '@angular/compiler';

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
        const ratedCurrentDoggo: Doggo = {
          ...selectedDoggo,
          ratingCount: selectedDoggo.ratingCount + 1,
          ratingSum: selectedDoggo.ratingSum + rating,
        };

        return this.doggosService.update(ratedCurrentDoggo).pipe(
          concatMap((result) => {
            const newSelectedDoggo = allDoggos[nextDoggoIndex];

            return [
              DoggosActions.rateDoggoFinished({ doggo: result }),
              DoggosActions.selectDoggo({ id: newSelectedDoggo.id }),
            ];
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

            return [
              DoggosActions.loadDoggosFinished({ doggos }),
              DoggosActions.selectDoggo({ id: currentDoggoId }),
            ];
          })
        );
      })
    )
  );

  addDoggoPicture$ = createEffect(() =>
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
            return DoggosActions.deleteDoggoFinished({ doggo });
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private doggosService: DoggosService,
    private uploadService: UploadService
  ) {}
}
