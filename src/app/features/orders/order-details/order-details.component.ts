import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, ActivatedRoute, Router } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { OrderService } from "../../../core/services/order.service"
import { ToastService } from "../../../core/services/toast.service"
import { Order, OrderStatus, OrderUpdate } from "../../../core/models/order.model" // Import OrderUpdate

@Component({
  selector: "app-order-details",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="order-details">
      <div class="page-header">
        <h1 class="page-title">Order Details</h1>
        <button class="btn-secondary" routerLink="/orders">
          <i class="material-icons">arrow_back</i>
          Back to Orders
        </button>
      </div>
      
      <div class="order-container" *ngIf="order && !loading">
        <div class="order-info">
          <div class="info-card">
            <h3 class="card-title">Order Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Order Number:</label>
                <span>{{ order.orderNumber }}</span>
              </div>
              <div class="info-item">
                <label>Status:</label>
                <span class="status-badge" [ngClass]="'status-' + order.status">
                  {{ order.status | titlecase }}
                </span>
              </div>
              <div class="info-item">
                <label>Total Amount:</label>
                <span class="amount">{{ order.totalAmount | currency }}</span>
              </div>
              <div class="info-item">
                <label>Order Date:</label>
                <span>{{ order.createdAt | date:'medium' }}</span>
              </div>
            </div>
          </div>
          
          <div class="info-card">
            <h3 class="card-title">Customer Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Name:</label>
                <span>{{ order.user?.username || 'Unknown' }}</span>
              </div>
              <div class="info-item">
                <label>Email:</label>
                <span>{{ order.user?.email || 'N/A' }}</span>
              </div>
            </div>
          </div>
          
          <div class="info-card" *ngIf="order.shippingAddress">
            <h3 class="card-title">Shipping Address</h3>
            <p>{{ order.shippingAddress }}</p>
          </div>
          
          <div class="info-card" *ngIf="order.notes">
            <h3 class="card-title">Notes</h3>
            <p>{{ order.notes }}</p>
          </div>
        </div>
        
        <div class="order-items">
          <div class="info-card">
            <h3 class="card-title">Order Items</h3>
            <div class="items-table">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <ng-container *ngIf="order.items.length > 0; else noItems">
                    <tr *ngFor="let item of order.items">
                      <td>
                        <div class="product-info">
                          <img 
                            *ngIf="item.product?.imageUrl" 
                            [src]="item.product?.imageUrl" 
                            alt="{{ item.product?.name }}"
                            class="product-image"
                          >
                          <span>{{ item.product?.name || 'Product #' + item.productId }}</span>
                        </div>
                      </td>
                      <td>{{ item.quantity }}</td>
                      <td>{{ item.price | currency }}</td>
                      <td>{{ (item.quantity * item.price) | currency }}</td>
                    </tr>
                  </ng-container>
                  <ng-template #noItems>
                    <tr>
                      <td colspan="4" class="no-items">No items found</td>
                    </tr>
                  </ng-template>
                </tbody>
                <tfoot>
                  <tr class="total-row">
                    <td colspan="3"><strong>Total:</strong></td>
                    <td><strong>{{ order.totalAmount | currency }}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        
        <div class="status-update">
          <div class="info-card">
            <h3 class="card-title">Update Status</h3>
            <div class="status-form">
              <select [(ngModel)]="newStatus" class="status-select">
                <option [ngValue]="null" disabled selected>Select a status</option>
                <option *ngFor="let status of orderStatuses" [ngValue]="status">
                  {{ status | titlecase }}
                </option>
              </select>
              <button 
                class="btn-primary" 
                (click)="updateStatus()"
                [disabled]="newStatus === order.status || updating"
              >
                <span *ngIf="updating" class="spinner"></span>
                <span *ngIf="!updating">Update Status (Debug: {{ updating ? 'true' : 'false' }})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="loading-container" *ngIf="loading">
        <div class="spinner large-spinner"></div>
        <p>Loading order details...</p>
      </div>
      
      <div class="error-container" *ngIf="error && !loading">
        <div class="error-message">
          <h3>Error Loading Order</h3>
          <p>{{ error }}</p>
          <button class="btn-primary" (click)="loadOrder()">Retry</button>
        </div>
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
    }
    
    .page-title {
      margin: 0;
      color: #2c3e50;
    }
    
    .btn-secondary {
      background-color: #6c757d;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      text-decoration: none;
    }
    
    .btn-secondary:hover {
      background-color: #5a6268;
    }
    
    .order-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .order-info {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .order-items {
      grid-column: span 2;
    }
    
    .status-update {
      grid-column: span 2;
    }
    
    .info-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }
    
    .card-title {
      margin-top: 0;
      margin-bottom: 15px;
      color: #2c3e50;
      border-bottom: 1px solid #e9ecef;
      padding-bottom: 10px;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    .info-item label {
      font-weight: 600;
      color: #6c757d;
      font-size: 14px;
    }
    
    .info-item span {
      color: #2c3e50;
    }
    
    .status-badge {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      width: fit-content;
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
    
    .amount {
      font-weight: 600;
      color: #28a745;
      font-size: 16px;
    }
    
    .items-table {
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
    
    .data-table tbody tr:hover {
      background-color: #f8f9fa;
    }
    
    .product-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .product-image {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
    }
    
    .no-items {
      text-align: center;
      color: #6c757d;
      padding: 20px 0;
    }
    
    .total-row {
      background-color: #f8f9fa;
    }
    
    .total-row td {
      border-top: 2px solid #dee2e6;
      font-size: 16px;
    }
    
    .status-form {
      display: flex;
      gap: 15px;
      align-items: center;
    }
    
    .status-select {
      padding: 8px 12px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 14px;
      min-width: 150px;
    }
    
    .btn-primary {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 120px;
    }
    
    .btn-primary:hover:not(:disabled) {
      background-color: #0069d9;
    }
    
    .btn-primary:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
    
    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }
    
    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 50px 0;
    }
    
    .large-spinner {
      width: 40px;
      height: 40px;
      margin-bottom: 20px;
      border-width: 4px;
    }
    
    .error-message {
      text-align: center;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 30px;
    }
    
    .error-message h3 {
      color: #dc3545;
      margin-top: 0;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @media (max-width: 768px) {
      .order-container {
        grid-template-columns: 1fr;
      }
      
      .order-items, .status-update {
        grid-column: span 1;
      }
      
      .info-grid {
        grid-template-columns: 1fr;
      }
      
      .status-form {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `,
  ],
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null
  loading = false
  updating = false
  error: string | null = null
  newStatus: OrderStatus = "pending"
  orderStatuses: OrderStatus[] = ["pending", "completed", "cancelled"]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"]
      if (id) {
        this.loadOrder(String(id)) // Convert to string
      } else {
        this.error = "Invalid order ID"
      }
    })
    console.log("OrderDetailsComponent: Initializing...")
    console.log("OrderDetailsComponent: orderStatuses array (ngOnInit):", this.orderStatuses)
    console.log("OrderDetailsComponent: newStatus initial value (ngOnInit):", this.newStatus)
    console.log("OrderDetailsComponent: updating initial value (ngOnInit):", this.updating)
  }

  loadOrder(id?: string): void {
    if (!id) {
      const routeId = this.route.snapshot.params["id"]
      if (!routeId) {
        this.error = "No order ID provided"
        return
      }
      id = String(routeId)
    }

    this.loading = true
    this.error = null

    this.orderService.getOrder(id).subscribe({
      next: (order: Order) => {
        this.order = {
          ...order,
          items: order.items || [], // Ensure items is always an array
        }
        this.newStatus = this.order.status // Set newStatus to current order status
        this.loading = false
        console.log("OrderDetailsComponent: Order loaded successfully:", this.order)
        console.log("OrderDetailsComponent: Initial order status:", this.order.status) // Debug
        console.log("OrderDetailsComponent: order.items length:", this.order.items.length)
        console.log("OrderDetailsComponent: newStatus set to:", this.newStatus)
        console.log("OrderDetailsComponent: orderStatuses array (after load):", this.orderStatuses)
      },
      error: (error: any) => {
        console.error("Error loading order:", error)
        this.error = "Failed to load order details"
        this.loading = false
      },
    })
  }

  updateStatus(): void {
    if (!this.order || this.newStatus === this.order.status) {
      console.log("OrderDetailsComponent: Update skipped. Order:", this.order, "New Status:", this.newStatus)
      return
    }

    this.updating = true
    console.log(
      "OrderDetailsComponent: Attempting to update status from current:",
      this.order.status,
      "to new:",
      this.newStatus,
    )

    // Construct a more complete OrderUpdate object for PUT request
    const orderUpdatePayload: OrderUpdate = {
      status: this.newStatus,
      // Include other fields from the current order if they are part of OrderUpdate
      // This ensures the PUT request sends a more complete representation
      shippingAddress: this.order.shippingAddress,
      billingAddress: this.order.billingAddress,
      paymentMethod: this.order.paymentMethod,
      notes: this.order.notes,
      // Add any other fields from OrderUpdate that might be required by the backend
      // For example, if totalAmount is part of OrderUpdate and required:
      // totalAmount: this.order.totalAmount
    }

    console.log("OrderDetailsComponent: Sending update payload:", orderUpdatePayload) // Debug the payload

    this.orderService.updateOrder(String(this.order.id), orderUpdatePayload).subscribe({
      next: (updatedOrder: Order) => {
        this.order = updatedOrder
        this.toastService.show("Order status updated successfully", "success")
        this.updating = false
        console.log("OrderDetailsComponent: Status updated successfully. New order:", this.order)
      },
      error: (error: any) => {
        console.error("Error updating order status:", error)
        if (error.error && error.error.message) {
          this.toastService.show(`Failed to update order status: ${error.error.message}`, "error")
          console.error("Backend error message:", error.error.message)
        } else if (error.error && error.error.param && error.error.value) {
          this.toastService.show(
            `Failed to update order status: Invalid value '${error.error.value}' for '${error.error.param}'`,
            "error",
          )
          console.error("Backend validation error:", error.error)
        } else {
          this.toastService.show("Failed to update order status", "error")
        }
        this.updating = false
      },
    })
  }
}
