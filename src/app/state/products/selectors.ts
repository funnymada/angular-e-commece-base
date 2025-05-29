import { createFeatureSelector, createSelector } from "@ngrx/store"
import { type ProductState, selectAll, selectEntities } from "./reducers"

export const selectProductState = createFeatureSelector<ProductState>("products")

export const selectAllProducts = createSelector(selectProductState, selectAll)

export const selectProductEntities = createSelector(selectProductState, selectEntities)

export const selectProductsLoading = createSelector(selectProductState, (state) => state.loading)

export const selectProductsError = createSelector(selectProductState, (state) => state.error)

export const selectProductsTotal = createSelector(selectProductState, (state) => state.total)

export const selectSelectedProductId = createSelector(selectProductState, (state) => state.selectedProductId)

export const selectSelectedProduct = createSelector(
  selectProductEntities,
  selectSelectedProductId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : null),
)

export const selectProductById = (id: number) => createSelector(selectProductEntities, (entities) => entities[id])

export const selectProductsByCategory = (categoryId: number) =>
  createSelector(selectAllProducts, (products) => products.filter((product) => product.categoryId === categoryId))
