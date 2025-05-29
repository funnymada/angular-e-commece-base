import { createReducer, on } from "@ngrx/store"
import { type EntityState, type EntityAdapter, createEntityAdapter } from "@ngrx/entity"
import type { Product } from "../../core/models/product.model"
import * as ProductActions from "./actions"

export interface ProductState extends EntityState<Product> {
  selectedProductId: number | null
  loading: boolean
  error: string | null
  total: number
  currentPage: number
  pageSize: number
}

export const adapter: EntityAdapter<Product> = createEntityAdapter<Product>()

export const initialState: ProductState = adapter.getInitialState({
  selectedProductId: null,
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  pageSize: 10,
})

export const productReducer = createReducer(
  initialState,

  // Load Products
  on(ProductActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductActions.loadProductsSuccess, (state, { products, total }) =>
    adapter.setAll(products, {
      ...state,
      loading: false,
      total,
      error: null,
    }),
  ),

  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Single Product
  on(ProductActions.loadProduct, (state, { id }) => ({
    ...state,
    selectedProductId: id,
    loading: true,
    error: null,
  })),

  on(ProductActions.loadProductSuccess, (state, { product }) =>
    adapter.upsertOne(product, {
      ...state,
      selectedProductId: product.id,
      loading: false,
      error: null,
    }),
  ),

  on(ProductActions.loadProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Product
  on(ProductActions.createProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductActions.createProductSuccess, (state, { product }) =>
    adapter.addOne(product, {
      ...state,
      loading: false,
      error: null,
    }),
  ),

  on(ProductActions.createProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Product
  on(ProductActions.updateProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductActions.updateProductSuccess, (state, { product }) =>
    adapter.updateOne(
      { id: product.id, changes: product },
      {
        ...state,
        loading: false,
        error: null,
      },
    ),
  ),

  on(ProductActions.updateProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Product
  on(ProductActions.deleteProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductActions.deleteProductSuccess, (state, { id }) =>
    adapter.removeOne(id, {
      ...state,
      loading: false,
      error: null,
    }),
  ),

  on(ProductActions.deleteProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Clear Selected Product
  on(ProductActions.clearSelectedProduct, (state) => ({
    ...state,
    selectedProductId: null,
  })),

  // Set Loading
  on(ProductActions.setProductsLoading, (state, { loading }) => ({
    ...state,
    loading,
  })),
)

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors()
