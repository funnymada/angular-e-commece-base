import { createFeatureSelector, createSelector } from "@ngrx/store"
import { type CategoryState, selectAll, selectEntities } from "./reducers"

export const selectCategoryState = createFeatureSelector<CategoryState>("categories")

export const selectAllCategories = createSelector(selectCategoryState, selectAll)

export const selectCategoryEntities = createSelector(selectCategoryState, selectEntities)

export const selectCategoriesLoading = createSelector(selectCategoryState, (state) => state.loading)

export const selectCategoriesError = createSelector(selectCategoryState, (state) => state.error)

export const selectSelectedCategoryId = createSelector(selectCategoryState, (state) => state.selectedCategoryId)

export const selectSelectedCategory = createSelector(
  selectCategoryEntities,
  selectSelectedCategoryId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : null),
)

export const selectCategoryById = (id: number) => createSelector(selectCategoryEntities, (entities) => entities[id])
