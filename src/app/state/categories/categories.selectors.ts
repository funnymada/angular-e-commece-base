import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoriesState } from './categories.models';

export const selectCategoriesState = createFeatureSelector<CategoriesState>('categories');

export const selectAllCategories = createSelector(
  selectCategoriesState,
  state => state.items
);

export const selectCategoriesLoading = createSelector(
  selectCategoriesState,
  state => state.loading
);