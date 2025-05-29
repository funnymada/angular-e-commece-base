import type { Routes } from "@angular/router"
import { OrderListComponent } from "./order-list/order-list.component"
import { OrderDetailsComponent } from "./order-details/order-details.component"

export const ORDERS_ROUTES: Routes = [
  { path: "", component: OrderListComponent },
  { path: ":id", component: OrderDetailsComponent },
]

