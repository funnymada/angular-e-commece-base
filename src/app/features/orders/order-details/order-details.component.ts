import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule,  ActivatedRoute,  Router } from "@angular/router"
import { FormsModule } from "@angular/forms"
import  { OrderService } from "../../../core/services/order.service"
import  { ToastService } from "../../../core/services/toast.service"
import  { Order, OrderStatus } from "../../../core/models/order.model"

@Component({
  selector: "app-order-details",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="order-details">
      <div class="page-header">
        <div class="header-left">
          <button class="btn-back" routerLink="/orders">
            <i class="material-icons">arrow_back</i>
          </button>
          <h1 class="page-title">
            Order #{{ order?.orderNumber }}
            <span class="status-badge" [ngClass]="'status-' + order.status" *ngIf="order">
              {{ order.status }}
            </span>
          </h1>
        </div>
        <div class="header-actions" *ngIf="order">
          <div class="status-select-container">
            <label for="status-select">Update Status:</label>
            <select 
              id="status-select" 
              [(ngModel)]="selectedStatus" 
              class="status-select"
              [disabled]="updatingStatus"
            >
              <option *ngFor="let status of orderStatuses" [value]="status">
                {{ status | titlecase }}
              </option>
            </select>
            <button 
              class="btn-update-status" 
              [disabled]="selectedStatus === order.status || updatingStatus"
              (click)="updateOrderStatus()"
            >
              <span *ngIf="!updatingStatus">Update</span>
              <span *ngIf="updatingStatus" class="spinner small-spinner"></span>
            </button>
          </div>
        </div>
      </div>
      
      <div class="loading-container" *ngIf="loading">
        <div class="spinner large-spinner"></div>
        <p>Loading order details...</p>
      </div>
      
      <div class="order-content" *ngIf="!loading && order">
        <div class="order-grid">
          <div class="order-info-card">
            <h2 class="card-title">Order Information</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Order Number:</span>
                <span class="info-value">{{ order.orderNumber }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Date:</span>
                <span class="info-value">{{ order.createdAt | date:'medium' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Status:</span>
                <span class="info-value status-badge" [ngClass]="'status-' + order.status">
                  {{ order.status }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Total Amount:</span>
                <span class="info-value total-amount">{{ order.totalAmount | currency }}</span>
              </div>
            </div>
          </div>
          
          <div class="customer-card">
            <h2 class="card-title">Customer Information</h2>
            <div class="info-grid" *ngIf="order.user">
              <div class="info-item">
                <span class="info-label">Name:</span>
                <span class="info-value">{{ order.user.username }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">{{ order.user.email }}</span>
              </div>
            </div>
            <div class="no-customer" *ngIf="!order.user">
              <p>Customer information not available</p>
            </div>
          </div>
        </div>
        
        <div class="order-items-card">
          <h2 class="card-title">Order Items</h2>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of order.items">
                  <td class="product-cell">
                    <div class="product-info">
                      <img 
                        [src]="item.product?.imageUrl || '/assets/placeholder-product.jpg'" 
                        alt="Product image"
                        class="product-image"
                      >
                      <span class="product-name">{{ item.product?.name || 'Unknown Product' }}</span>
                    </div>
                  </td>
                  <td>{{ item.price | currency }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ item.price * item.quantity | currency }}</td>
                </tr>
                <tr *ngIf="!order.items || order.items.length === 0">
                  <td colspan="4" class="no-data">No items in this order</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="total-label">Total</td>
                  <td class="total-value">{{ order.totalAmount | currency }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      
      <div class="not-found" *ngIf="!loading && !order">
        <h2>Order Not Found</h2>
        <p>The order you are looking for does not exist or has been deleted.</p>
        <button class="btn-primary" routerLink="/orders">Back to Orders</button>
      </div>
    </div>
  `,
  styles: [
    `
    .order-details {
      padding: 20px;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 15px;
    }
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .btn-back {
      background-color: transparent;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #6c757d;
      padding: 5px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    
    .btn-back:hover {
      background-color: #e9ecef;
    }
    
    .page-title {
      margin: 0;
      color: #2c3e50;
      display: flex;
      align-items: center;
      gap: 10px;
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
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .status-select-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .status-select {
      padding: 8px 12px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .btn-update-status {
      background-color: #28a745;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
      min-width: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .btn-update-status:hover:not(:disabled) {
      background-color: #218838;
    }
    
    .btn-update-status:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
      opacity: 0.7;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 50px 0;
    }
    
    .spinner {
      display: inline-block;
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }
    
    .small-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
    }
    
    .large-spinner {
      width: 40px;
      height: 40px;
      margin-bottom: 20px;
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-top-color: #007bff;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .order-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .order-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .order-info-card, .customer-card, .order-items-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }
    
    .card-title {
      margin-top: 0;
      margin-bottom: 20px;
      color: #2c3e50;
      font-size: 1.25rem;
      border-bottom: 1px solid #e9ecef;
      padding-bottom: 10px;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 15px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    .info-label {
      color: #6c757d;
      font-size: 14px;
    }
    
    .info-value {
      font-weight: 500;
      color: #2c3e50;
    }
    
    .total-amount {
      font-size: 18px;
      font-weight: 600;
      color: #28a745;
    }
    
    .no-customer {
      color: #6c757d;
      font-style: italic;
    }
    
    .table-container {
      overflow-x: auto;
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
    
    .product-cell {
      min-width: 200px;
    }
    
    .product-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .product-image {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
    }
    
    .product-name {
      font-weight: 500;
    }
    
    .no-data {
      text-align: center;
      padding: 20px 0;
      color: #6c757d;
      font-style: italic;
    }
    
    .total-label {
      text-align: right;
      font-weight: 600;
      color: #2c3e50;
    }
    
    .total-value {
      font-weight: 600;
      color: #28a745;
      font-size: 16px;
    }
    
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 50px 0;
      text-align: center;
    }
    
    .not-found h2 {
      color: #2c3e50;
      margin-bottom: 10px;
    }
    
    .not-found p {
      color: #6c757d;
      margin-bottom: 20px;
    }
    
    .btn-primary {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .btn-primary:hover {
      background-color: #0069d9;
    }
    
    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .header-actions {
        width: 100%;
      }
      
      .status-select-container {
        width: 100%;
        flex-wrap: wrap;
      }
      
      .status-select {
        flex: 1;
      }
    }
  `,
  ],
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null
  loading = false

  // Status update
  selectedStatus: OrderStatus = "pending"
  updatingStatus = false
  orderStatuses: OrderStatus[] = ["pending", "shipped", "delivered", "canceled"]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.loadOrder(+params["id"])
      }
    })
  }

  loadOrder(id: number): void {
    this.loading = true
    this.orderService.getOrder(id).subscribe({
      next: (order) => {
        this.order = order
        this.selectedStatus = order.status
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading order:", error)
        this.toastService.show("Failed to load order details", "error")
        this.loading = false
      },
    })
  }

  updateOrderStatus(): void {
    if (!this.order || this.selectedStatus === this.order.status) {
      return
    }

    this.updatingStatus = true
    this.orderService.updateOrderStatus(this.order.id, { status: this.selectedStatus }).subscribe({
      next: (updatedOrder) => {
        this.order = updatedOrder
        this.toastService.show(`Order status updated to ${this.selectedStatus}`, "success")
        this.updatingStatus = false
      },
      error: (error) => {
        console.error("Error updating order status:", error)
        this.toastService.show("Failed to update order status", "error")
        this.updatingStatus = false
      },
    })
  }
}

