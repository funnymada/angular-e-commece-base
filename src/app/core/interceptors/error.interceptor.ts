import type { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http"
import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { catchError, throwError } from "rxjs"
import { AuthService } from "../services/auth.service"
import { ToastService } from "../services/toast.service"

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router)
  const authService = inject(AuthService)
  const toastService = inject(ToastService)

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout()
        router.navigate(["/auth/login"])
        toastService.show("Session expired. Please login again.", "error")
      } else if (error.status === 403) {
        toastService.show("You do not have permission to perform this action.", "error")
      } else if (error.status === 500) {
        toastService.show("Server error. Please try again later.", "error")
      } else {
        toastService.show(error.error?.message || "An error occurred.", "error")
      }

      return throwError(() => error)
    }),
  )
}

