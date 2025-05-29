import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import { Observable } from "rxjs"
import { tap } from "rxjs/operators"
import { environment } from "../../enviroments/enviroment"
import { Product, ProductCreate, ProductUpdate } from "../models/product.model"

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/products`

  constructor(private http: HttpClient) {}

  getProducts(params?: {
    categoryId?: number
    search?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
    page?: number
    limit?: number
  }): Observable<{ products: Product[]; total: number }> {
    let httpParams = new HttpParams()

    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key as keyof typeof params]
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString())
        }
      })
    }

    console.log("API URL:", this.apiUrl)
    console.log("Request params:", params)
    console.log("HTTP params:", httpParams.toString())

    return this.http.get<{ products: Product[]; total: number }>(this.apiUrl, { params: httpParams }).pipe(
      tap((response) => {
        console.log("Raw API response:", response)
        console.log("Products in response:", response?.products)
        console.log("Total in response:", response?.total)
        console.log("Type of response:", typeof response)
        console.log("Is response an array?", Array.isArray(response))
        console.log("Is products an array?", Array.isArray(response?.products))
      }),
    )
  }

  getProduct(id: string): Observable<Product> {
    // Changed from number to string
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
  }

  createProduct(product: ProductCreate): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product)
  }

  updateProduct(id: string, product: ProductUpdate): Observable<Product> {
    // Changed from number to string
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product)
  }

  deleteProduct(id: string): Observable<void> {
    // Changed from number to string
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}
