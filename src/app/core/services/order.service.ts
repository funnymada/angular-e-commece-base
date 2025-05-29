import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import { Observable } from "rxjs"
import { environment } from "../../enviroments/enviroment"
import { Order, OrderStatusUpdate } from "../models/order.model"

export interface OrdersResponse {
  orders: Order[]
  total: number
}

export interface AnalyticsData {
  salesByDay: {
    date: string
    sales: number
  }[]
  salesByCategory: {
    category: string
    sales: number
  }[]
  totalSales: number
  totalOrders: number
  averageOrderValue: number
}

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private readonly apiUrl = `${environment.apiUrl}/orders`

  constructor(private http: HttpClient) {}

  getOrders(params?: {
    status?: string
    search?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
    page?: number
    limit?: number
  }): Observable<OrdersResponse> {
    let httpParams = new HttpParams()

    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key as keyof typeof params]
        if (value !== undefined) {
          httpParams = httpParams.set(key, value.toString())
        }
      })
    }

    return this.http.get<OrdersResponse>(this.apiUrl, { params: httpParams })
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`)
  }

  updateOrderStatus(id: number, update: OrderStatusUpdate): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, update)
  }

  getAnalytics(): Observable<AnalyticsData> {
    return this.http.get<AnalyticsData>(`${this.apiUrl}/analytics`)
  }
}

