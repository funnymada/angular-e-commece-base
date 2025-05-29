import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { of } from "rxjs"
import { map, mergeMap, catchError, tap } from "rxjs/operators"
import { CategoryService } from "../../core/services/category.service"
import { ToastService } from "../../core/services/toast.service"
import { Router } from "@angular/router"
import * as CategoryActions from "./actions"

@Injectable()
export class CategoryEffects {
  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.loadCategories),
      mergeMap(() =>
        this.categoryService.getCategories().pipe(
          map((categories) => CategoryActions.loadCategoriesSuccess({ categories })),
          catchError((error) => of(CategoryActions.loadCategoriesFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  loadCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.loadCategory),
      mergeMap(({ id }) =>
        this.categoryService.getCategory(id).pipe(
          map((category) => CategoryActions.loadCategorySuccess({ category })),
          catchError((error) => of(CategoryActions.loadCategoryFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  createCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.createCategory),
      mergeMap(({ category }) =>
        this.categoryService.createCategory(category).pipe(
          map((createdCategory) => CategoryActions.createCategorySuccess({ category: createdCategory })),
          catchError((error) => of(CategoryActions.createCategoryFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  updateCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.updateCategory),
      mergeMap(({ id, category }) =>
        this.categoryService.updateCategory(id, category).pipe(
          map((updatedCategory) => CategoryActions.updateCategorySuccess({ category: updatedCategory })),
          catchError((error) => of(CategoryActions.updateCategoryFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  deleteCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.deleteCategory),
      mergeMap(({ id }) =>
        this.categoryService.deleteCategory(id).pipe(
          map(() => CategoryActions.deleteCategorySuccess({ id })),
          catchError((error) => of(CategoryActions.deleteCategoryFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  // Success Effects
  createCategorySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CategoryActions.createCategorySuccess),
        tap(() => {
          this.toastService.show("Category created successfully", "success")
          this.router.navigate(["/categories"])
        }),
      ),
    { dispatch: false },
  )

  updateCategorySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CategoryActions.updateCategorySuccess),
        tap(() => {
          this.toastService.show("Category updated successfully", "success")
          this.router.navigate(["/categories"])
        }),
      ),
    { dispatch: false },
  )

  deleteCategorySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CategoryActions.deleteCategorySuccess),
        tap(() => {
          this.toastService.show("Category deleted successfully", "success")
        }),
      ),
    { dispatch: false },
  )

  // Error Effects
  categoryError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CategoryActions.loadCategoriesFailure,
          CategoryActions.loadCategoryFailure,
          CategoryActions.createCategoryFailure,
          CategoryActions.updateCategoryFailure,
          CategoryActions.deleteCategoryFailure,
        ),
        tap(({ error }) => {
          this.toastService.show(error, "error")
        }),
      ),
    { dispatch: false },
  )

  constructor(
    private actions$: Actions,
    private categoryService: CategoryService,
    private toastService: ToastService,
    private router: Router,
  ) {}
}
