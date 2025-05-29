import type { Routes } from "@angular/router"
import { ProductListComponent } from "./products-list/products-list.component"
import { ProductFormComponent } from "./products-form/products-form.component"

export const PRODUCTS_ROUTES: Routes = [
  { path: "", component: ProductListComponent },
  { path: "new", component: ProductFormComponent },
  { path: "edit/:id", component: ProductFormComponent },
]

