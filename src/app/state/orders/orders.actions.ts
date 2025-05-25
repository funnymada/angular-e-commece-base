import { createAction, props } from '@ngrx/store';
import { Order } from '../../../app/core/models/order.model';

// Load Orders
export const loadOrders = createAction(
  '[Order] Load Orders',
  props<{ status?: string }>()
);

export const loadOrdersSuccess = createAction(
  '[Order] Load Orders Success',
  props<{ orders: Order[] }>()
);

export const loadOrdersFailure = createAction(
  '[Order] Load Orders Failure',
  props<{ error: any }>()
);

// Load Single Order
export const loadOrder = createAction(
  '[Order] Load Order',
  props<{ id: number }>()
);

export const loadOrderSuccess = createAction(
  '[Order] Load Order Success',
  props<{ order: Order }>()
);

export const loadOrderFailure = createAction(
  '[Order] Load Order Failure',
  props<{ error: any }>()
);

// Update Order Status
export const updateOrderStatus = createAction(
  '[Order] Update Order Status',
  props<{ id: number; status: Order['status'] }>()
);

export const updateOrderStatusSuccess = createAction(
  '[Order] Update Order Status Success',
  props<{ order: Order }>()
);

export const updateOrderStatusFailure = createAction(
  '[Order] Update Order Status Failure',
  props<{ error: any }>()
);

