import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './products.models';

export const selectProductsState = createFeatureSelector<ProductsState>('products');

export const selectAllProducts = createSelector(
  selectProductsState,
  state => state.items
);

export const selectProductsLoading = createSelector(
  selectProductsState,
  state => state.loading
);