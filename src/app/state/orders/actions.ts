import { createAction, props } from "@ngrx/store"
import type { Order, OrderStatus } from "../../core/models/order.model"

// Load Orders
export const loadOrders = createAction(
  "[Order List] Load Orders",
  props<{
    params?: {
      status?: string
      search?: string
      sortBy?: string
      sortOrder?: "asc" | "desc"
      page?: number
      limit?: number
    }
  }>(),
)

export const loadOrdersSuccess = createAction(
  "[Order API] Load Orders Success",
  props<{ orders: Order[]; total: number }>(),
)

export const loadOrdersFailure = createAction("[Order API] Load Orders Failure", props<{ error: string }>())

// Load Single Order
export const loadOrder = createAction("[Order Details] Load Order", props<{ id: number }>())

export const loadOrderSuccess = createAction("[Order API] Load Order Success", props<{ order: Order }>())

export const loadOrderFailure = createAction("[Order API] Load Order Failure", props<{ error: string }>())

// Update Order Status
export const updateOrderStatus = createAction(
  "[Order Details] Update Order Status",
  props<{ id: number; status: OrderStatus }>(),
)

export const updateOrderStatusSuccess = createAction(
  "[Order API] Update Order Status Success",
  props<{ order: Order }>(),
)

export const updateOrderStatusFailure = createAction(
  "[Order API] Update Order Status Failure",
  props<{ error: string }>(),
)

// Clear Selected Order
export const clearSelectedOrder = createAction("[Order] Clear Selected Order")

// Set Loading
export const setOrdersLoading = createAction("[Order] Set Loading", props<{ loading: boolean }>())
