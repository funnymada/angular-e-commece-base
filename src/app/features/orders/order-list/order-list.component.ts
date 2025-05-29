import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { OrderService } from "../../../core/services/order.service"
import { ToastService } from "../../../core/services/toast.service"
import { Order, OrderStatus } from "../../../core/models/order.model"

@Component({
  selector: "app-order-list",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="order-list">
      <div class="page-header">
        <h1 class="page-title">Orders</h1>
      </div>
      
      <div class="filters">
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (keyup.enter)="loadOrders()"
            placeholder="Search orders..." 
            class="search-input"
          >
          <button class="search-btn" (click)="loadOrders()">
            <i class="material-icons">search</i>
          </button>
        </div>
        
        <div class="filter-group">
          <label for="status-filter">Status:</label>
          <select 
            id="status-filter" 
            [(ngModel)]="selectedStatus" 
            (change)="loadOrders()"
            class="filter-select"
          >
            <option [value]="null">All Statuses</option>
            <option *ngFor="let status of orderStatuses" [value]="status">
              {{ status | titlecase }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="sort-by">Sort By:</label>
          <select 
            id="sort-by" 
            [(ngModel)]="sortBy" 
            (change)="loadOrders()"
            class="filter-select"
          >
            <option value="createdAt">Date</option>
            <option value="orderNumber">Order Number</option>
            <option value="totalAmount">Total Amount</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="sort-order">Order:</label>
          <select 
            id="sort-order" 
            [(ngModel)]="sortOrder" 
            (change)="loadOrders()"
            class="filter-select"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>
      
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of orders">
              <td>{{ order.orderNumber }}</td>
              <td>{{ order.user?.username || 'Unknown' }}</td>
              <td>{{ order.createdAt | date:'medium' }}</td>
              <td>{{ order.totalAmount | currency }}</td>
              <td>
                <span class="status-badge" [ngClass]="'status-' + order.status">
                  {{ order.status }}
                </span>
              </td>
              <td class="actions-cell">
                <a [routerLink]="['/orders', order.id]" class="action-btn view-btn">
                  <i class="material-icons">visibility</i>
                </a>
              </td>
            </tr>
            <tr *ngIf="orders.length === 0 && !loading">
              <td colspan="6" class="no-data">No orders found</td>
            </tr>
            <tr *ngIf="loading">
              <td colspan="6" class="loading-data">Loading orders...</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="pagination" *ngIf="totalOrders > 0">
        <div class="pagination-info">
          Showing {{ (currentPage - 1) * pageSize + 1 }} to 
          {{ Math.min(currentPage * pageSize, totalOrders) }} of {{ totalOrders }} orders
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
            [disabled]="currentPage * pageSize >= totalOrders"
            (click)="changePage(currentPage + 1)"
          >
            <i class="material-icons">chevron_right</i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .order-list {
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
    
    .status-badge {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .status-pending {
      background-color: #fff3cd;
      color: #856404;
    }
    
    .status-shipped {
      background-color: #d1ecf1;
      color: #0c5460;
    }
    
    .status-delivered {
      background-color: #d4edda;
      color: #155724;
    }
    
    .status-canceled {
      background-color: #f8d7da;
      color: #721c24;
    }
    
    .actions-cell {
      white-space: nowrap;
      width: 60px;
    }
    
    .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .view-btn {
      background-color: #17a2b8;
      color: white;
    }
    
    .view-btn:hover {
      background-color: #138496;
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
export class OrderListComponent implements OnInit {
  orders: Order[] = []
  totalOrders = 0
  loading = false

  // Filters and sorting
  searchTerm = ""
  selectedStatus: OrderStatus | null = null
  sortBy = "createdAt"
  sortOrder: "asc" | "desc" = "desc"

  // Pagination
  currentPage = 1
  pageSize = 10

  // For template use
  Math = Math
  orderStatuses: OrderStatus[] = ["pending", "shipped", "delivered", "canceled"]

  constructor(
    private orderService: OrderService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadOrders()
  }

  loadOrders(): void {
    this.loading = true

    const params = {
      search: this.searchTerm || undefined,
      status: this.selectedStatus || undefined,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      page: this.currentPage,
      limit: this.pageSize,
    }

    this.orderService.getOrders(params).subscribe({
      next: (data) => {
        this.orders = data.orders
        this.totalOrders = data.total
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading orders:", error)
        this.toastService.show("Failed to load orders", "error")
        this.loading = false
      },
    })
  }

  changePage(page: number): void {
    this.currentPage = page
    this.loadOrders()
  }
}

