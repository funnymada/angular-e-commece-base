import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { of } from "rxjs"
import { map, mergeMap, catchError, tap } from "rxjs/operators"
import { OrderService } from "../../core/services/order.service"
import { ToastService } from "../../core/services/toast.service"
import * as OrderActions from "./actions"

@Injectable()
export class OrderEffects {
  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.loadOrders),
      mergeMap(({ params }) =>
        this.orderService.getOrders(params).pipe(
          map(({ orders, total }) => OrderActions.loadOrdersSuccess({ orders, total })),
          catchError((error) => of(OrderActions.loadOrdersFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  loadOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.loadOrder),
      mergeMap(({ id }) =>
        this.orderService.getOrder(id).pipe(
          map((order) => OrderActions.loadOrderSuccess({ order })),
          catchError((error) => of(OrderActions.loadOrderFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  updateOrderStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.updateOrderStatus),
      mergeMap(({ id, status }) =>
        this.orderService.updateOrderStatus(id, { status }).pipe(
          map((order) => OrderActions.updateOrderStatusSuccess({ order })),
          catchError((error) => of(OrderActions.updateOrderStatusFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  // Success Effects
  updateOrderStatusSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OrderActions.updateOrderStatusSuccess),
        tap(({ order }) => {
          this.toastService.show(`Order status updated to ${order.status}`, "success")
        }),
      ),
    { dispatch: false },
  )

  // Error Effects
  orderError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OrderActions.loadOrdersFailure, OrderActions.loadOrderFailure, OrderActions.updateOrderStatusFailure),
        tap(({ error }) => {
          this.toastService.show(error, "error")
        }),
      ),
    { dispatch: false },
  )

  constructor(
    private actions$: Actions,
    private orderService: OrderService,
    private toastService: ToastService,
  ) {}
}
