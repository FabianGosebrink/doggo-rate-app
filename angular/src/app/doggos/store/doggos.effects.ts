import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap } from 'rxjs';
import { map, tap } from 'rxjs';
import { selectQueryParams } from '../../router.selectors';
import { DoggosService } from '../services/doggos.service';
import { DoggosActions } from './doggos.actions';
import { getSelectedDoggoIndex, getAllDoggos } from './doggos.selectors';

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
        this.store.pipe(select(getSelectedDoggoIndex)),
        this.store.pipe(select(getAllDoggos)),
      ]),
      map(([action, currentDoggoIndex, allDoggos]) => {
        const nextIndex = (currentDoggoIndex + 1) % allDoggos.length;
        const newSelectedDoggo = allDoggos[nextIndex];

        return DoggosActions.selectDoggo({ id: newSelectedDoggo.id });
      })
    )
  );

  loadDoggos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DoggosActions.loadDoggos),
      concatLatestFrom(() => this.store.select(selectQueryParams)),
      concatMap(([action, { doggoId }]) => {
        return this.doggosService.getItems().pipe(
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

  constructor(
    private actions$: Actions,
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private doggosService: DoggosService
  ) {}
}
