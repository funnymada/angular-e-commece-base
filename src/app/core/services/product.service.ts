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

  // Modifica il metodo getProducts per gestire correttamente sia array che oggetti paginati
  getProducts(params?: {
    categoryId?: number
    search?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
    page?: number
    limit?: number
  }): Observable<Product[] | { products: Product[]; total: number }> {
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

    return this.http.get<Product[] | { products: Product[]; total: number }>(this.apiUrl, { params: httpParams }).pipe(
      tap((response) => {
        console.log("=== PRODUCT SERVICE DEBUG ===")
        console.log("Raw API response:", response)
        console.log("Response type:", typeof response)
        console.log("Is array?", Array.isArray(response))
        console.log("Response keys:", Object.keys(response || {}))
        console.log("Products count:", Array.isArray(response) ? response.length : response?.products?.length)
        console.log("Total from response:", Array.isArray(response) ? undefined : response?.total)
        console.log("==============================")
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
