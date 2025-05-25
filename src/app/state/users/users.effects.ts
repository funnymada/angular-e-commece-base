import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UsersActions } from './users.actions';
import { AuthService } from '../../core/services/auth.service';
import { catchError, map, switchMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  // 🔐 Login effect
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.login),
      switchMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map(response => UsersActions.loginSuccess({ user: response.user, token: response.token })),
          catchError(error => of(UsersActions.loginFailure({ error: error.message })))
        )
      )
    )
  );

  // 🚚 Effetto per ottenere l'utente corrente
  getCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.getCurrentUser),
      switchMap(() =>
        this.authService.getCurrentUser().pipe(
          map(user => UsersActions.getCurrentUserSuccess({ user })),
          catchError(error => of(UsersActions.getCurrentUserFailure({ error: error.message })))
        )
      )
    )
  );

  // 🚪 Logout effect (effetto collaterale)
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.logout),
      tap(() => {
        this.authService.logout();
        this.router.navigate(['/login']);
      })
    ),
    { dispatch: false }
  );
}