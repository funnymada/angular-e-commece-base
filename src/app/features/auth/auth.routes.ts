import type { Routes } from "@angular/router"
import { LoginComponent } from "./login/login.component"
import { guestGuard } from "../../core/guards/guest.guards"
export const AUTH_ROUTES: Routes = [
  {
    path: "login",
    component: LoginComponent,
    canActivate: [guestGuard], 
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  }
]
