import { createReducer, on } from "@ngrx/store"
import { type EntityState, type EntityAdapter, createEntityAdapter } from "@ngrx/entity"
import type { Category } from "../../core/models/category.model"
import * as CategoryActions from "./actions"

export interface CategoryState extends EntityState<Category> {
  selectedCategoryId: number | null
  loading: boolean
  error: string | null
}

export const adapter: EntityAdapter<Category> = createEntityAdapter<Category>()

export const initialState: CategoryState = adapter.getInitialState({
  selectedCategoryId: null,
  loading: false,
  error: null,
})

export const categoryReducer = createReducer(
  initialState,

  // Load Categories
  on(CategoryActions.loadCategories, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CategoryActions.loadCategoriesSuccess, (state, { categories }) =>
    adapter.setAll(categories, {
      ...state,
      loading: false,
      error: null,
    }),
  ),

  on(CategoryActions.loadCategoriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Single Category
  on(CategoryActions.loadCategory, (state, { id }) => ({
    ...state,
    selectedCategoryId: id,
    loading: true,
    error: null,
  })),

  on(CategoryActions.loadCategorySuccess, (state, { category }) =>
    adapter.upsertOne(category, {
      ...state,
      selectedCategoryId: category.id,
      loading: false,
      error: null,
    }),
  ),

  on(CategoryActions.loadCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Category
  on(CategoryActions.createCategory, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CategoryActions.createCategorySuccess, (state, { category }) =>
    adapter.addOne(category, {
      ...state,
      loading: false,
      error: null,
    }),
  ),

  on(CategoryActions.createCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Category
  on(CategoryActions.updateCategory, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CategoryActions.updateCategorySuccess, (state, { category }) =>
    adapter.updateOne(
      { id: category.id, changes: category },
      {
        ...state,
        loading: false,
        error: null,
      },
    ),
  ),

  on(CategoryActions.updateCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Category
  on(CategoryActions.deleteCategory, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CategoryActions.deleteCategorySuccess, (state, { id }) =>
    adapter.removeOne(id, {
      ...state,
      loading: false,
      error: null,
    }),
  ),

  on(CategoryActions.deleteCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Clear Selected Category
  on(CategoryActions.clearSelectedCategory, (state) => ({
    ...state,
    selectedCategoryId: null,
  })),

  // Set Loading
  on(CategoryActions.setCategoriesLoading, (state, { loading }) => ({
    ...state,
    loading,
  })),
)

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors()
