import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import { Observable } from "rxjs"
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
        if (value !== undefined) {
          httpParams = httpParams.set(key, value.toString())
        }
      })
    }

    return this.http.get<{ products: Product[]; total: number }>(this.apiUrl, { params: httpParams })
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
  }

  createProduct(product: ProductCreate): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product)
  }

  updateProduct(id: number, product: ProductUpdate): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product)
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}

