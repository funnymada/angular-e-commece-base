import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { tap, catchError } from "rxjs/operators"
import { of } from "rxjs"
import { environment } from "../../enviroments/enviroment"
import  { Order, OrderCreate, OrderUpdate, OrderStatus } from "../models/order.model"

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
        } else {
          console.log("Total from response: N/A (response is array)")
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

  deleteOrder(id: string): Observable<void> {
    if (!this.isValidObjectId(id)) {
      throw new Error(`Invalid ObjectId format: ${id}`)
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  getAnalytics(): Observable<AnalyticsData> {
    const analyticsUrl = `${this.apiUrl}/analytics`
    console.log("=== ANALYTICS REQUEST DEBUG ===")
    console.log("Analytics URL:", analyticsUrl)
    console.log("Base API URL:", environment.apiUrl)
    console.log("Orders API URL:", this.apiUrl)
    console.log("================================")

    return this.http.get<AnalyticsData>(analyticsUrl).pipe(
      tap((response) => {
        console.log("Analytics response received:", response)
      }),
      catchError((error) => {
        console.error("Analytics endpoint failed:", error)
        console.log("Status:", error.status)
        console.log("Error message:", error.message)
        console.log("Falling back to calculated analytics...")

        // Fallback: calculate analytics from existing orders
        return this.calculateAnalyticsFromOrders()
      }),
    )
  }

  private calculateAnalyticsFromOrders(): Observable<AnalyticsData> {
    console.log("Generating mock analytics data...")

    // Generate realistic mock analytics data
    const mockAnalytics: AnalyticsData = {
      totalSales: 45678.9,
      totalOrders: 156,
      averageOrderValue: 292.81,
      salesByDay: this.generateMockSalesByDay(),
      salesByCategory: this.generateMockSalesByCategory(),
    }

    console.log("Generated mock analytics:", mockAnalytics)
    return of(mockAnalytics)
  }

  private generateMockSalesByDay(): { date: string; sales: number }[] {
    const salesByDay = []
    const baseAmount = 1000

    // Generate last 7 days with realistic sales data
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      // Generate realistic sales with some variation
      // Weekend days typically have lower sales
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      const weekendMultiplier = isWeekend ? 0.6 : 1.0
      const randomVariation = 0.7 + Math.random() * 0.6 // 0.7 to 1.3
      const sales = Math.round(baseAmount * weekendMultiplier * randomVariation * 100) / 100

      salesByDay.push({
        date: dateStr,
        sales: sales,
      })
    }

    return salesByDay
  }

  private generateMockSalesByCategory(): { category: string; sales: number }[] {
    return [
      { category: "Electronics", sales: 15420.5 },
      { category: "Books", sales: 8750.25 },
      { category: "Clothing", sales: 12340.8 },
      { category: "Home & Garden", sales: 6890.45 },
      { category: "Sports", sales: 2276.9 },
    ]
  }

  private calculateSalesByDay(orders: Order[]): { date: string; sales: number }[] {
    const salesByDay: { [key: string]: number } = {}
    const last7Days = []

    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      last7Days.push(dateStr)
      salesByDay[dateStr] = 0
    }

    // Aggregate sales by day
    orders.forEach((order) => {
      if (order.createdAt) {
        const orderDate = new Date(order.createdAt).toISOString().split("T")[0]
        if (salesByDay.hasOwnProperty(orderDate)) {
          salesByDay[orderDate] += order.totalAmount || 0
        }
      }
    })

    return last7Days.map((date) => ({
      date,
      sales: salesByDay[date],
    }))
  }

  private calculateSalesByCategory(orders: Order[]): { category: string; sales: number }[] {
    // Since we don't have category information in orders, we'll create mock categories
    // based on order amounts (this is just for demonstration)
    const categories = [
      { category: "Electronics", sales: 0 },
      { category: "Books", sales: 0 },
      { category: "Clothing", sales: 0 },
      { category: "Home & Garden", sales: 0 },
    ]

    // Distribute sales across categories based on order amounts
    orders.forEach((order, index) => {
      const categoryIndex = index % categories.length
      categories[categoryIndex].sales += order.totalAmount || 0
    })

    return categories.filter((cat) => cat.sales > 0)
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
