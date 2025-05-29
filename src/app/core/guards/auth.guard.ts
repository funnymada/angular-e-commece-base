import { inject } from "@angular/core"
import { CanActivateFn, Router } from "@angular/router"
import { AuthService } from "../services/auth.service"
import { combineLatest, filter, take, map } from "rxjs"

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  return combineLatest([
    authService.isAuthenticated$,
    authService.tokenChecked$
  ]).pipe(
    filter(([_, tokenChecked]) => tokenChecked),
    take(1),
    map(([isAuthenticated]) => {
      if (isAuthenticated) {
        return true
      } else {
        router.navigate(["/auth/login"], { queryParams: { returnUrl: state.url } })
        return false
      }
    })
  )
}
