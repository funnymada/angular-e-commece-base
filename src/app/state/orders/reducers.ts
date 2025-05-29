import { createReducer, on } from "@ngrx/store"
import { type EntityState, type EntityAdapter, createEntityAdapter } from "@ngrx/entity"
import type { Order } from "../../core/models/order.model"
import * as OrderActions from "./actions"

export interface OrderState extends EntityState<Order> {
  selectedOrderId: number | null
  loading: boolean
  error: string | null
  total: number
  currentPage: number
  pageSize: number
}

export const adapter: EntityAdapter<Order> = createEntityAdapter<Order>()

export const initialState: OrderState = adapter.getInitialState({
  selectedOrderId: null,
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  pageSize: 10,
})

export const orderReducer = createReducer(
  initialState,

  // Load Orders
  on(OrderActions.loadOrders, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(OrderActions.loadOrdersSuccess, (state, { orders, total }) =>
    adapter.setAll(orders, {
      ...state,
      loading: false,
      total,
      error: null,
    }),
  ),

  on(OrderActions.loadOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Single Order
  on(OrderActions.loadOrder, (state, { id }) => ({
    ...state,
    selectedOrderId: id,
    loading: true,
    error: null,
  })),

  on(OrderActions.loadOrderSuccess, (state, { order }) =>
    adapter.upsertOne(order, {
      ...state,
      selectedOrderId: order.id,
      loading: false,
      error: null,
    }),
  ),

  on(OrderActions.loadOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Order Status
  on(OrderActions.updateOrderStatus, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(OrderActions.updateOrderStatusSuccess, (state, { order }) =>
    adapter.updateOne(
      { id: order.id, changes: order },
      {
        ...state,
        loading: false,
        error: null,
      },
    ),
  ),

  on(OrderActions.updateOrderStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Clear Selected Order
  on(OrderActions.clearSelectedOrder, (state) => ({
    ...state,
    selectedOrderId: null,
  })),

  // Set Loading
  on(OrderActions.setOrdersLoading, (state, { loading }) => ({
    ...state,
    loading,
  })),
)

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors()
