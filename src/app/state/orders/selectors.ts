import { createFeatureSelector, createSelector } from "@ngrx/store"
import { type OrderState, selectAll, selectEntities } from "./reducers"

export const selectOrderState = createFeatureSelector<OrderState>("orders")

export const selectAllOrders = createSelector(selectOrderState, selectAll)

export const selectOrderEntities = createSelector(selectOrderState, selectEntities)

export const selectOrdersLoading = createSelector(selectOrderState, (state) => state.loading)

export const selectOrdersError = createSelector(selectOrderState, (state) => state.error)

export const selectOrdersTotal = createSelector(selectOrderState, (state) => state.total)

export const selectSelectedOrderId = createSelector(selectOrderState, (state) => state.selectedOrderId)

export const selectSelectedOrder = createSelector(selectOrderEntities, selectSelectedOrderId, (entities, selectedId) =>
  selectedId ? entities[selectedId] : null,
)

export const selectOrderById = (id: number) => createSelector(selectOrderEntities, (entities) => entities[id])

export const selectOrdersByStatus = (status: string) =>
  createSelector(selectAllOrders, (orders) => orders.filter((order) => order.status === status))

export const selectRecentOrders = createSelector(selectAllOrders, (orders) => orders.slice(0, 5))
