import { createReducer, on } from '@ngrx/store';
import { CategoriesState } from './categories.models';
import { CategoriesActions } from './categories.actions';

export const initialState: CategoriesState = {
  items: [],
  loading: false,
  error: null,
};

export const categoriesReducer = createReducer(
  initialState,
  on(CategoriesActions.loadCategories, state => ({ ...state, loading: true })),
  on(CategoriesActions.loadCategoriesSuccess, (state, { items }) => ({
    ...state,
    loading: false,
    items
  })),
  on(CategoriesActions.loadCategoriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);