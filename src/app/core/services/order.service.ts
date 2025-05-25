import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Order } from '../models/order.model';
import { AnalyticsData } from '../models/analytics.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = 'https://server-angular-jac.dev.aws.r-s.cloud/api/api';
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor(private http: HttpClient) {}

  getOrders(filters?: { status?: string }): Observable<Order[]> {
    let params = new HttpParams();
    if (filters?.status) {
      params = params.set('status', filters.status);
    }

    return this.http.get<Order[]>(`${this.apiUrl}/orders`, { params });
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${id}`);
  }

  updateOrderStatus(id: number, status: Order['status']): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/orders/${id}`, { status });
  }

  getAnalytics(): Observable<AnalyticsData> {
    return this.http.get<AnalyticsData>(`${this.apiUrl}/orders/analytics`);
  }

  refreshOrders(): void {
    this.getOrders().subscribe(orders => {
      this.ordersSubject.next(orders);
    });
  }
}