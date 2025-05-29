import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { of } from "rxjs"
import { map, mergeMap, catchError, tap } from "rxjs/operators"
import { AuthService } from "../../core/services/auth.service"
import { ToastService } from "../../core/services/toast.service"
import { Router } from "@angular/router"
import * as AuthActions from "./actions"

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map(({ token, user }) => AuthActions.loginSuccess({ token, user })),
          catchError((error) => of(AuthActions.loginFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  loadCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadCurrentUser),
      mergeMap(() =>
        this.authService.getCurrentUser().pipe(
          map((user) => AuthActions.loadCurrentUserSuccess({ user })),
          catchError((error) => of(AuthActions.loadCurrentUserFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  // Success Effects
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.toastService.show("Login successful", "success")
          this.router.navigate(["/"])
        }),
      ),
    { dispatch: false },
  )

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.logout()
          this.router.navigate(["/auth/login"])
        }),
      ),
    { dispatch: false },
  )

  // Error Effects
  authError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure, AuthActions.loadCurrentUserFailure),
        tap(({ error }) => {
          this.toastService.show(error, "error")
        }),
      ),
    { dispatch: false },
  )

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
  ) {}
}
