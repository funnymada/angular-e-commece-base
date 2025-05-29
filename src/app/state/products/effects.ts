import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { of } from "rxjs"
import { map, mergeMap, catchError, tap } from "rxjs/operators"
import { ProductService } from "../../core/services/product.service"
import { ToastService } from "../../core/services/toast.service"
import { Router } from "@angular/router"
import * as ProductActions from "./actions"

@Injectable()
export class ProductEffects {
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      mergeMap(({ params }) =>
        this.productService.getProducts(params).pipe(
          map(({ products, total }) => ProductActions.loadProductsSuccess({ products, total })),
          catchError((error) => of(ProductActions.loadProductsFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProduct),
      mergeMap(({ id }) =>
        this.productService.getProduct(id).pipe(
          map((product) => ProductActions.loadProductSuccess({ product })),
          catchError((error) => of(ProductActions.loadProductFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  createProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.createProduct),
      mergeMap(({ product }) =>
        this.productService.createProduct(product).pipe(
          map((createdProduct) => ProductActions.createProductSuccess({ product: createdProduct })),
          catchError((error) => of(ProductActions.createProductFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.updateProduct),
      mergeMap(({ id, product }) =>
        this.productService.updateProduct(id, product).pipe(
          map((updatedProduct) => ProductActions.updateProductSuccess({ product: updatedProduct })),
          catchError((error) => of(ProductActions.updateProductFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.deleteProduct),
      mergeMap(({ id }) =>
        this.productService.deleteProduct(id).pipe(
          map(() => ProductActions.deleteProductSuccess({ id })),
          catchError((error) => of(ProductActions.deleteProductFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  // Success Effects with Side Effects
  createProductSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductActions.createProductSuccess),
        tap(() => {
          this.toastService.show("Product created successfully", "success")
          this.router.navigate(["/products"])
        }),
      ),
    { dispatch: false },
  )

  updateProductSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductActions.updateProductSuccess),
        tap(() => {
          this.toastService.show("Product updated successfully", "success")
          this.router.navigate(["/products"])
        }),
      ),
    { dispatch: false },
  )

  deleteProductSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductActions.deleteProductSuccess),
        tap(() => {
          this.toastService.show("Product deleted successfully", "success")
        }),
      ),
    { dispatch: false },
  )

  // Error Effects
  productError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ProductActions.loadProductsFailure,
          ProductActions.loadProductFailure,
          ProductActions.createProductFailure,
          ProductActions.updateProductFailure,
          ProductActions.deleteProductFailure,
        ),
        tap(({ error }) => {
          this.toastService.show(error, "error")
        }),
      ),
    { dispatch: false },
  )

  constructor(
    private actions$: Actions,
    private productService: ProductService,
    private toastService: ToastService,
    private router: Router,
  ) {}
}
