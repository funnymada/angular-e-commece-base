import { bootstrapApplication } from '@angular/platform-browser'
import { AppComponent } from './app/app.component'
import { provideRouter } from '@angular/router'
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core'
import { AuthService } from './app/core/services/auth.service'
import { provideHttpClient } from '@angular/common/http'
import { routes } from './app/app.routes'

export function initApp(authService: AuthService) {
  return () => authService.init()
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [AuthService],
      multi: true
    },
  ]
})
