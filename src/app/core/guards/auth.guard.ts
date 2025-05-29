import { inject } from "@angular/core"
import { type CanActivateFn, Router } from "@angular/router"
import { AuthService } from "../services/auth.service"
import { map, take } from "rxjs"

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  return authService.isAuthenticated$.pipe(
    take(1),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true
      } else {
        router.navigate(["/auth/login"], { queryParams: { returnUrl: state.url } })
        return false
      }
    }),
  )
}

