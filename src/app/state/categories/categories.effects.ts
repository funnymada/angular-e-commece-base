import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CategoriesActions } from './categories.actions';
import { catchError, map, switchMap, of } from 'rxjs';
import { CategoryService } from '../../../app/core/services/category.service';

@Injectable()
export class CategoriesEffects {
  constructor(
    private actions$: Actions,
    private categoriesService: CategoryService
  ) {}

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.loadCategories),
      switchMap(() =>
        this.categoriesService.getCategories().pipe(
          map(items => CategoriesActions.loadCategoriesSuccess({ items })),
          catchError(error =>
            of(CategoriesActions.loadCategoriesFailure({ error: error.message }))
          )
        )
      )
    )
  );
}