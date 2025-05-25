import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OrderService } from '../../../app/core/services/order.service';
import * as OrderActions from './orders.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class OrderEffects {
  constructor(private actions$: Actions, private orderService: OrderService) {}

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.loadOrders),
      mergeMap(action =>
        this.orderService.getOrders({ status: action.status }).pipe(
          map(orders => OrderActions.loadOrdersSuccess({ orders })),
          catchError(error => of(OrderActions.loadOrdersFailure({ error })))
        )
      )
    )
  );

  loadOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.loadOrder),
      mergeMap(action =>
        this.orderService.getOrder(action.id).pipe(
          map(order => OrderActions.loadOrderSuccess({ order })),
          catchError(error => of(OrderActions.loadOrderFailure({ error })))
        )
      )
    )
  );

  updateOrderStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.updateOrderStatus),
      mergeMap(action =>
        this.orderService.updateOrderStatus(action.id, action.status).pipe(
          map(order => OrderActions.updateOrderStatusSuccess({ order })),
          catchError(error => of(OrderActions.updateOrderStatusFailure({ error })))
        )
      )
    )
  );
}
