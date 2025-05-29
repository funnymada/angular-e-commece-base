import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { ProductService } from "../../../core/services/product.service"
import { CategoryService } from "../../../core/services/category.service"
import { ToastService } from "../../../core/services/toast.service"
import { Product } from "../../../core/models/product.model"
import { Category } from "../../../core/models/category.model"

@Component({
  selector: "app-product-list",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="product-list">
      <div class="page-header">
        <h1 class="page-title">Products</h1>
        <a routerLink="/products/new" class="btn-primary">Add Product</a>
      </div>
      
      <div class="filters">
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (keyup.enter)="loadProducts()"
            placeholder="Search products..." 
            class="search-input"
          >
          <button class="search-btn" (click)="loadProducts()">
            <i class="material-icons">search</i>
          </button>
        </div>
        
        <div class="filter-group">
          <label for="category-filter">Category:</label>
          <select 
            id="category-filter" 
            [(ngModel)]="selectedCategoryId" 
            (change)="loadProducts()"
            class="filter-select"
          >
            <option [value]="null">All Categories</option>
            <option *ngFor="let category of categories" [value]="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="sort-by">Sort By:</label>
          <select 
            id="sort-by" 
            [(ngModel)]="sortBy" 
            (change)="loadProducts()"
            class="filter-select"
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="stock">Stock</option>
            <option value="createdAt">Created Date</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="sort-order">Order:</label>
          <select 
            id="sort-order" 
            [(ngModel)]="sortOrder" 
            (change)="loadProducts()"
            class="filter-select"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of products">
              <td class="image-cell">
                <img 
                  [src]="product.imageUrl || '/assets/placeholder-product.jpg'" 
                  alt="{{ product.name }}"
                  class="product-image"
                >
              </td>
              <td>{{ product.name }}</td>
              <td>{{ getCategoryName(product.categoryId) }}</td>
              <td>{{ product.price | currency }}</td>
              <td>
                <span 
                  class="stock-badge"
                  [ngClass]="{
                    'low-stock': product.stock < 10,
                    'out-of-stock': product.stock === 0
                  }"
                >
                  {{ product.stock }}
                </span>
              </td>
              <td class="actions-cell">
                <a [routerLink]="['/products/edit', product.id]" class="action-btn edit-btn">
                  <i class="material-icons">edit</i>
                </a>
                <button class="action-btn delete-btn" (click)="confirmDelete(product)">
                  <i class="material-icons">delete</i>
                </button>
              </td>
            </tr>
            <tr *ngIf="products.length === 0 && !loading">
              <td colspan="6" class="no-data">No products found</td>
            </tr>
            <tr *ngIf="loading">
              <td colspan="6" class="loading-data">Loading products...</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="pagination" *ngIf="totalProducts > 0">
        <div class="pagination-info">
          Showing {{ (currentPage - 1) * pageSize + 1 }} to 
          {{ Math.min(currentPage * pageSize, totalProducts) }} of {{ totalProducts }} products
        </div>
        <div class="pagination-controls">
          <button 
            class="pagination-btn" 
            [disabled]="currentPage === 1"
            (click)="changePage(currentPage - 1)"
          >
            <i class="material-icons">chevron_left</i>
          </button>
          <span class="pagination-page">{{ currentPage }}</span>
          <button 
            class="pagination-btn" 
            [disabled]="currentPage * pageSize >= totalProducts"
            (click)="changePage(currentPage + 1)"
          >
            <i class="material-icons">chevron_right</i>
          </button>
        </div>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <div class="modal" *ngIf="showDeleteModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Confirm Delete</h3>
            <button class="modal-close" (click)="cancelDelete()">×</button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete <strong>{{ productToDelete?.name }}</strong>?</p>
            <p class="warning-text">This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="cancelDelete()">Cancel</button>
            <button class="btn-danger" (click)="deleteProduct()">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .product-list {
      padding: 20px;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    
    .page-title {
      margin: 0;
      color: #2c3e50;
    }
    
    .btn-primary {
      background-color: #007bff;
      color: white;
      padding: 10px 15px;
      border-radius: 4px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: background-color 0.2s;
    }
    
    .btn-primary:hover {
      background-color: #0069d9;
    }
    
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 20px;
      align-items: center;
    }
    
    .search-box {
      display: flex;
      flex: 1;
      min-width: 200px;
    }
    
    .search-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #ced4da;
      border-right: none;
      border-radius: 4px 0 0 4px;
      font-size: 14px;
    }
    
    .search-btn {
      padding: 8px 12px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    
    .filter-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .filter-select {
      padding: 8px 12px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 14px;
      min-width: 120px;
    }
    
    .table-container {
      overflow-x: auto;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
    }
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .data-table th, .data-table td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #e9ecef;
    }
    
    .data-table th {
      background-color: #f8f9fa;
      font-weight: 600;
      color: #495057;
    }
    
    .data-table tbody tr:hover {
      background-color: #f8f9fa;
    }
    
    .image-cell {
      width: 80px;
    }
    
    .product-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
    }
    
    .stock-badge {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      background-color: #d4edda;
      color: #155724;
    }
    
    .low-stock {
      background-color: #fff3cd;
      color: #856404;
    }
    
    .out-of-stock {
      background-color: #f8d7da;
      color: #721c24;
    }
    
    .actions-cell {
      white-space: nowrap;
      width: 100px;
    }
    
    .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 4px;
      margin-right: 5px;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .edit-btn {
      background-color: #17a2b8;
      color: white;
    }
    
    .edit-btn:hover {
      background-color: #138496;
    }
    
    .delete-btn {
      background-color: #dc3545;
      color: white;
    }
    
    .delete-btn:hover {
      background-color: #c82333;
    }
    
    .no-data, .loading-data {
      text-align: center;
      padding: 30px 0;
      color: #6c757d;
    }
    
    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .pagination-info {
      color: #6c757d;
      font-size: 14px;
    }
    
    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .pagination-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 4px;
      border: 1px solid #ced4da;
      background-color: white;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .pagination-btn:hover:not(:disabled) {
      background-color: #e9ecef;
    }
    
    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .pagination-page {
      font-weight: 600;
    }
    
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .modal-content {
      background-color: white;
      border-radius: 8px;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      border-bottom: 1px solid #e9ecef;
    }
    
    .modal-title {
      margin: 0;
      color: #2c3e50;
    }
    
    .modal-close {
      background: transparent;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #6c757d;
    }
    
    .modal-body {
      padding: 20px;
    }
    
    .warning-text {
      color: #dc3545;
      font-size: 14px;
    }
    
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 15px 20px;
      border-top: 1px solid #e9ecef;
    }
    
    .btn-secondary {
      background-color: #6c757d;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .btn-secondary:hover {
      background-color: #5a6268;
    }
    
    .btn-danger {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .btn-danger:hover {
      background-color: #c82333;
    }
    
    @media (max-width: 768px) {
      .filters {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-box {
        width: 100%;
      }
      
      .filter-group {
        width: 100%;
      }
      
      .filter-select {
        flex: 1;
      }
      
      .pagination {
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
      }
    }
  `,
  ],
})
export class ProductListComponent implements OnInit {
  products: Product[] = []
  categories: Category[] = []
  totalProducts = 0
  loading = false

  // Filters and sorting
  searchTerm = ""
  selectedCategoryId: number | null = null
  sortBy = "createdAt"
  sortOrder: "asc" | "desc" = "desc"

  // Pagination
  currentPage = 1
  pageSize = 10

  // Delete modal
  showDeleteModal = false
  productToDelete: Product | null = null

  // For template use
  Math = Math

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadCategories()
    this.loadProducts()
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories
      },
      error: (error) => {
        console.error("Error loading categories:", error)
        this.toastService.show("Failed to load categories", "error")
      },
    })
  }

  loadProducts(): void {
    this.loading = true

    const params = {
      search: this.searchTerm || undefined,
      categoryId: this.selectedCategoryId || undefined,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      page: this.currentPage,
      limit: this.pageSize,
    }

    this.productService.getProducts(params).subscribe({
      next: (data) => {
        this.products = data.products
        this.totalProducts = data.total
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading products:", error)
        this.toastService.show("Failed to load products", "error")
        this.loading = false
      },
    })
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find((c) => c.id === categoryId)
    return category ? category.name : "Unknown"
  }

  changePage(page: number): void {
    this.currentPage = page
    this.loadProducts()
  }

  confirmDelete(product: Product): void {
    this.productToDelete = product
    this.showDeleteModal = true
  }

  cancelDelete(): void {
    this.productToDelete = null
    this.showDeleteModal = false
  }

  deleteProduct(): void {
    if (!this.productToDelete) return

    this.productService.deleteProduct(this.productToDelete.id).subscribe({
      next: () => {
        this.toastService.show(`Product "${this.productToDelete?.name}" deleted successfully`, "success")
        this.loadProducts()
        this.cancelDelete()
      },
      error: (error) => {
        console.error("Error deleting product:", error)
        this.toastService.show("Failed to delete product", "error")
      },
    })
  }
}

