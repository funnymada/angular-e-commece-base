import type { Routes } from "@angular/router"
import { authGuard } from "./core/guards/auth.guard"

export const routes: Routes = [
  {
    path: "",
    canActivate: [authGuard],
    loadChildren: () => import("./features/dashboard/dashboard.routes").then((m) => m.DASHBOARD_ROUTES),
  },
  {
    path: "products",
    canActivate: [authGuard],
    loadChildren: () => import("./features/products/products.routes").then((m) => m.PRODUCTS_ROUTES),
  },
  {
    path: "orders",
    canActivate: [authGuard],
    loadChildren: () => import("./features/orders/orders.routes").then((m) => m.ORDERS_ROUTES),
  },
  {
    path: "categories",
    canActivate: [authGuard],
    loadChildren: () => import("./features/categories/categories.routes").then((m) => m.CATEGORIES_ROUTES),
  },
  {
    path: "auth",
    loadChildren: () => import("./features/auth/auth.routes").then((m) => m.AUTH_ROUTES),
  },
  {
    path: "**",
    redirectTo: "",
  },
]

