import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { tap } from "rxjs/operators"
import { environment } from "../../enviroments/enviroment"
import { Order, OrderCreate, OrderUpdate, OrderStatus } from "../models/order.model"

export interface AnalyticsData {
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  salesByDay: { date: string; sales: number }[]
  salesByCategory: { category: string; sales: number }[]
}

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private readonly apiUrl: string

  constructor(private http: HttpClient) {
    const baseApi = environment.apiUrl.endsWith("/") ? environment.apiUrl.slice(0, -1) : environment.apiUrl
    this.apiUrl = `${baseApi}/orders`
  }

  getOrders(params?: {
    status?: OrderStatus
    search?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
    page?: number
    limit?: number
  }): Observable<Order[] | { orders: Order[]; total: number }> {
    const httpParams = new URLSearchParams()

    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key as keyof typeof params]
        if (value !== undefined && value !== null) {
          httpParams.set(key, value.toString())
        }
      })
    }

    console.log("Order API URL:", this.apiUrl)
    console.log("Order request params:", params)
    console.log("Order HTTP params:", httpParams.toString())

    const url = httpParams.toString() ? `${this.apiUrl}?${httpParams.toString()}` : this.apiUrl

    return this.http.get<Order[] | { orders: Order[]; total: number }>(url).pipe(
      tap((response) => {
        console.log("=== ORDER SERVICE DEBUG ===")
        console.log("Raw API response:", response)
        console.log("Response type:", typeof response)
        console.log("Is array?", Array.isArray(response))
        console.log("Response keys:", Object.keys(response || {}))
        console.log("Orders count:", Array.isArray(response) ? response.length : response?.orders?.length)
        if (!Array.isArray(response)) {
          console.log("Total from response:", response.total)
        }
        console.log("============================")
      }),
    )
  }

  getOrder(id: string): Observable<Order> {
    if (!this.isValidObjectId(id)) {
      throw new Error(`Invalid ObjectId format: ${id}`)
    }

    console.log("Getting order with ID:", id)
    console.log("Full URL:", `${this.apiUrl}/${id}`)

    return this.http.get<Order>(`${this.apiUrl}/${id}`)
  }

  createOrder(order: OrderCreate): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order)
  }

  updateOrder(id: string, order: OrderUpdate): Observable<Order> {
    if (!this.isValidObjectId(id)) {
      throw new Error(`Invalid ObjectId format: ${id}`)
    }
    // This method uses PUT, which is more likely to be supported for partial updates if PATCH /status is not.
    return this.http.put<Order>(`${this.apiUrl}/${id}`, order)
  }

  // REMOVED: updateOrderStatus method, as it caused 404 and is replaced by updateOrder
  // updateOrderStatus(id: string | number, statusUpdate: { status: OrderStatus }): Observable<Order> {
  //   const stringId = String(id)
  //   if (!this.isValidObjectId(stringId)) {
  //     throw new Error(`Invalid ObjectId format: ${stringId}`)
  //   }
  //   return this.http.patch<Order>(`${this.apiUrl}/${stringId}/status`, statusUpdate)
  // }

  deleteOrder(id: string): Observable<void> {
    if (!this.isValidObjectId(id)) {
      throw new Error(`Invalid ObjectId format: ${id}`)
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  getAnalytics(): Observable<AnalyticsData> {
    return this.http.get<AnalyticsData>(`${this.apiUrl}/analytics`)
  }

  private isValidObjectId(id: string): boolean {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/
    return objectIdRegex.test(id)
  }

  generateObjectId(): string {
    const timestamp = Math.floor(Date.now() / 1000)
      .toString(16)
      .padStart(8, "0")
    const randomBytes = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
    return timestamp + randomBytes
  }
}
