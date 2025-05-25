import { createReducer, on } from '@ngrx/store';
import * as OrderActions from './orders.actions';
import { Order } from '../../../app/core/models/order.model';

export interface OrderState {
  orders: Order[];
  selectedOrder?: Order;
  loading: boolean;
  error?: any;
}

export const initialState: OrderState = {
  orders: [],
  loading: false,
};

export const orderReducer = createReducer(
  initialState,

  // Load Orders
  on(OrderActions.loadOrders, state => ({
    ...state,
    loading: true,
    error: undefined,
  })),
  on(OrderActions.loadOrdersSuccess, (state, { orders }) => ({
    ...state,
    orders,
    loading: false,
  })),
  on(OrderActions.loadOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Single Order
  on(OrderActions.loadOrder, state => ({
    ...state,
    loading: true,
    error: undefined,
  })),
  on(OrderActions.loadOrderSuccess, (state, { order }) => ({
    ...state,
    selectedOrder: order,
    loading: false,
  })),
  on(OrderActions.loadOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Order Status
  on(OrderActions.updateOrderStatus, state => ({
    ...state,
    loading: true,
    error: undefined,
  })),
  on(OrderActions.updateOrderStatusSuccess, (state, { order }) => ({
    ...state,
    orders: state.orders.map(o => (o.id === order.id ? order : o)),
    selectedOrder: state.selectedOrder?.id === order.id ? order : state.selectedOrder,
    loading: false,
  })),
  on(OrderActions.updateOrderStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
