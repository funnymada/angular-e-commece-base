import { createReducer, on } from '@ngrx/store';
import { ProductsState } from './products.models';
import { ProductsActions } from './products.actions';

export const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

export const productsReducer = createReducer(
  initialState,
  on(ProductsActions.loadProducts, state => ({ ...state, loading: true })),
  on(ProductsActions.loadProductsSuccess, (state, { items }) => ({
    ...state,
    loading: false,
    items
  })),
  on(ProductsActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);