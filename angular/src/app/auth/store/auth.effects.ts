import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngrx/effects';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  // login$ = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(fromAuthActions.login),
  //       switchMap(() => this.authService.doLogin())
  //     ),
  //   { dispatch: false }
  // );

  // checkAuth$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(fromAuthActions.checkAuth),
  //     switchMap(({ url }) =>
  //       this.authService
  //         .checkAuth(url)
  //         .pipe(map((isAuth) => fromAuthActions.checkAuthComplete({ isAuth })))
  //     )
  //   )
  // );

  // checkAuthComplete$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(fromAuthActions.checkAuthComplete),
  //     withLatestFrom(this.authService.isLoggedIn),
  //     switchMap(([_, isLoggedIn]) => {
  //       if (isLoggedIn) {
  //         return this.authService.userData$.pipe(
  //           map((profile) =>
  //             fromAuthActions.loginComplete({ profile, isLoggedIn })
  //           )
  //         );
  //       }

  //       return of(fromAuthActions.logoutComplete());
  //     })
  //   )
  // );

  // // redirectAfterLoginComplete$ = createEffect(
  // //   () =>
  // //     this.actions$.pipe(
  // //       ofType(fromAuthActions.loginComplete),
  // //       tap(({ profile }) => {
  // //         console.log('url', this.activatedRoute.snapshot.url);
  // //         this.router.navigate(['/']);
  // //       })
  // //     ),
  // //   { dispatch: false }
  // // );

  // loginComplete$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(fromAuthActions.loginComplete),
  //     switchMap(({ profile }) => {
  //       const { email, name } = profile;
  //       return of(
  //         addSharedProfile({
  //           payload: {
  //             username: `user-${makeId(7)}`,
  //             userIdentifier: email,
  //           },
  //         })
  //       );
  //     })
  //   )
  // );

  // logout$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(fromAuthActions.logout),
  //     switchMap(() => this.authService.signOut()),
  //     map(() => fromAuthActions.logoutComplete())
  //   )
  // );
}
