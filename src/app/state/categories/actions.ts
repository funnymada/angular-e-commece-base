import { createAction, props } from "@ngrx/store"
import { Category, CategoryCreate, CategoryUpdate } from "../../core/models/category.model"

// Load Categories
export const loadCategories = createAction("[Category List] Load Categories")

export const loadCategoriesSuccess = createAction(
  "[Category API] Load Categories Success",
  props<{ categories: Category[] }>(),
)

export const loadCategoriesFailure = createAction("[Category API] Load Categories Failure", props<{ error: string }>())

// Load Single Category
export const loadCategory = createAction("[Category Details] Load Category", props<{ id: number }>())

export const loadCategorySuccess = createAction("[Category API] Load Category Success", props<{ category: Category }>())

export const loadCategoryFailure = createAction("[Category API] Load Category Failure", props<{ error: string }>())

// Create Category
export const createCategory = createAction("[Category Form] Create Category", props<{ category: CategoryCreate }>())

export const createCategorySuccess = createAction(
  "[Category API] Create Category Success",
  props<{ category: Category }>(),
)

export const createCategoryFailure = createAction("[Category API] Create Category Failure", props<{ error: string }>())

// Update Category
export const updateCategory = createAction(
  "[Category Form] Update Category",
  props<{ id: number; category: CategoryUpdate }>(),
)

export const updateCategorySuccess = createAction(
  "[Category API] Update Category Success",
  props<{ category: Category }>(),
)

export const updateCategoryFailure = createAction("[Category API] Update Category Failure", props<{ error: string }>())

// Delete Category
export const deleteCategory = createAction("[Category List] Delete Category", props<{ id: number }>())

export const deleteCategorySuccess = createAction("[Category API] Delete Category Success", props<{ id: number }>())

export const deleteCategoryFailure = createAction("[Category API] Delete Category Failure", props<{ error: string }>())

// Clear Selected Category
export const clearSelectedCategory = createAction("[Category] Clear Selected Category")

// Set Loading
export const setCategoriesLoading = createAction("[Category] Set Loading", props<{ loading: boolean }>())
