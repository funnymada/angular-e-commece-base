import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { AnalyticsData } from '../../core/models/analytics.model';
import { Order } from '../../core/models/order.model';
import { Product } from '../../core/models/product.model';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>E-Commerce Dashboard</h1>
        <p>Welcome back! Here's what's happening with your store today.</p>
      </div>

      <!-- Analytics Cards -->
      <div class="analytics-grid" *ngIf="analytics">
        <div class="analytics-card sales">
          <div class="card-content">
            <div class="card-icon">💰</div>
            <div class="card-info">
              <h3>Total Sales</h3>
              <p class="card-value">€{{ analytics.totalSales | number:'1.2-2' }}</p>
            </div>
          </div>
        </div>

        <div class="analytics-card orders">
          <div class="card-content">
            <div class="card-icon">📦</div>
            <div class="card-info">
              <h3>Total Orders</h3>
              <p class="card-value">{{ analytics.totalOrders }}</p>
            </div>
          </div>
        </div>

        <div class="analytics-card products">
          <div class="card-content">
            <div class="card-icon">🛍️</div>
            <div class="card-info">
              <h3>Total Products</h3>
              <p class="card-value">{{ analytics.totalProducts }}</p>
            </div>
          </div>
        </div>

        <div class="analytics-card pending">
          <div class="card-content">
            <div class="card-icon">⏳</div>
            <div class="card-info">
              <h3>Pending Orders</h3>
              <p class="card-value">{{ pendingOrdersCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section" *ngIf="analytics">
        <div class="chart-container">
          <h3>Sales by Day (Last 7 Days)</h3>
          <div class="simple-chart">
            <div class="chart-bars">
              <div 
                *ngFor="let day of analytics.salesByDay" 
                class="chart-bar"
                [style.height.%]="getBarHeight(day.sales, maxDailySales)"
                [title]="day.date + ': €' + day.sales"
              >
                <span class="bar-value">€{{ day.sales }}</span>
              </div>
            </div>
            <div class="chart-labels">
              <span *ngFor="let day of analytics.salesByDay" class="chart-label">
                {{ formatDate(day.date) }}
              </span>
            </div>
          </div>
        </div>

        <div class="chart-container">
          <h3>Sales by Category</h3>
          <div class="category-chart">
            <div 
              *ngFor="let category of analytics.salesByCategory" 
              class="category-item"
            >
              <div class="category-info">
                <span class="category-name">{{ category.categoryName }}</span>
                <span class="category-value">€{{ category.sales | number:'1.2-2' }}</span>
              </div>
              <div class="category-bar">
                <div 
                  class="category-fill" 
                  [style.width.%]="getBarHeight(category.sales, maxCategorySales)"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="recent-orders-section">
        <div class="section-header">
          <h3>Recent Orders</h3>
          <a routerLink="/orders" class="view-all-link">View All Orders</a>
        </div>
        
        <div class="orders-table" *ngIf="recentOrders.length > 0; else noOrders">
          <div class="table-header">
            <span>Order #</span>
            <span>Total</span>
            <span>Status</span>
            <span>Date</span>
          </div>
          
          <div 
            *ngFor="let order of recentOrders" 
            class="table-row"
            [routerLink]="['/orders', order.id]"
          >
            <span class="order-number">{{ order.orderNumber }}</span>
            <span class="order-total">€{{ order.totalAmount | number:'1.2-2' }}</span>
            <span class="order-status" [ngClass]="'status-' + order.status">
              {{ getStatusLabel(order.status) }}
            </span>
            <span class="order-date">{{ formatDateTime(order.createdAt) }}</span>
          </div>
        </div>

        <ng-template #noOrders>
          <div class="no-data">
            <p>No recent orders found</p>
          </div>
        </ng-template>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="action-buttons">
          <button class="action-btn" routerLink="/products/new">
            <span class="btn-icon">➕</span>
            Add New Product
          </button>
          <button class="action-btn" routerLink="/categories">
            <span class="btn-icon">📁</span>
            Manage Categories
          </button>
          <button class="action-btn" routerLink="/orders">
            <span class="btn-icon">📋</span>
            View All Orders
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 30px;
    }

    .dashboard-header h1 {
      color: #333;
      margin-bottom: 8px;
      font-size: 32px;
      font-weight: 600;
    }

    .dashboard-header p {
      color: #666;
      font-size: 16px;
    }

    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .analytics-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-left: 4px solid;
    }

    .analytics-card.sales { border-left-color: #10b981; }
    .analytics-card.orders { border-left-color: #3b82f6; }
    .analytics-card.products { border-left-color: #f59e0b; }
    .analytics-card.pending { border-left-color: #ef4444; }

    .card-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .card-icon {
      font-size: 32px;
      opacity: 0.8;
    }

    .card-info h3 {
      margin: 0 0 8px 0;
      color: #666;
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .card-value {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      color: #333;
    }

    .charts-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 40px;
    }

    .chart-container {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .chart-container h3 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 18px;
      font-weight: 600;
    }

    .simple-chart {
      height: 200px;
    }

    .chart-bars {
      display: flex;
      align-items: flex-end;
      height: 160px;
      gap: 8px;
      margin-bottom: 10px;
    }

    .chart-bar {
      flex: 1;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 4px 4px 0 0;
      position: relative;
      min-height: 20px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      cursor: pointer;
      transition: opacity 0.3s;
    }

    .chart-bar:hover {
      opacity: 0.8;
    }

    .bar-value {
      color: white;
      font-size: 10px;
      font-weight: 600;
      padding: 4px;
      text-align: center;
    }

    .chart-labels {
      display: flex;
      gap: 8px;
    }

    .chart-label {
      flex: 1;
      text-align: center;
      font-size: 12px;
      color: #666;
    }

    .category-chart {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .category-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .category-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .category-name {
      font-weight: 500;
      color: #333;
    }

    .category-value {
      font-weight: 600;
      color: #667eea;
    }

    .category-bar {
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
    }

    .category-fill {
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 4px;
      transition: width 0.5s ease;
    }

    .recent-orders-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      margin-bottom: 30px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .section-header h3 {
      margin: 0;
      color: #333;
      font-size: 18px;
      font-weight: 600;
    }

    .view-all-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;
    }

    .view-all-link:hover {
      color: #5a67d8;
    }

    .orders-table {
      display: flex;
      flex-direction: column;
    }

    .table-header {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.5fr;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 2px solid #e5e7eb;
      font-weight: 600;
      color: #666;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .table-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.5fr;
      gap: 16px;
      padding: 16px 0;
      border-bottom: 1px solid #f3f4f6;
      cursor: pointer;
      transition: background-color 0.2s;
      text-decoration: none;
      color: inherit;
    }

    .table-row:hover {
      background-color: #f9fafb;
    }

    .order-number {
      font-weight: 600;
      color: #333;
    }

    .order-total {
      font-weight: 600;
      color: #10b981;
    }

    .order-status {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;
      text-align: center;
    }

    .status-pending { background: #fef3c7; color: #d97706; }
    .status-shipped { background: #dbeafe; color: #2563eb; }
    .status-delivered { background: #d1fae5; color: #059669; }
    .status-canceled { background: #fee2e2; color: #dc2626; }

    .order-date {
      color: #666;
      font-size: 14px;
    }

    .quick-actions {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .quick-actions h3 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 18px;
      font-weight: 600;
    }

    .action-buttons {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      text-decoration: none;
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
    }

    .btn-icon {
      font-size: 16px;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e5e7eb;
      border-radius: 50%;
      border-top-color: #667eea;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .charts-section {
        grid-template-columns: 1fr;
      }
      
      .table-header,
      .table-row {
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
      
      .action-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  analytics: AnalyticsData | null = null;
  recentOrders: Order[] = [];
  isLoading = true;
  maxDailySales = 0;
  maxCategorySales = 0;
  pendingOrdersCount = 0;

  constructor(
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;

    // Load analytics data
    this.orderService.getAnalytics().subscribe({
      next: (data) => {
        this.analytics = data;
        this.maxDailySales = Math.max(...data.salesByDay.map(d => d.sales));
        this.maxCategorySales = Math.max(...data.salesByCategory.map(c => c.sales));
      },
      error: (error) => console.error('Error loading analytics:', error)
    });

    // Load recent orders
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.recentOrders = orders.slice(0, 5); // Show only 5 most recent
        this.pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading = false;
      }
    });
  }

  getBarHeight(value: number, max: number): number {
    return max > 0 ? (value / max) * 100 : 0;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'Pending',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'canceled': 'Canceled'
    };
    return labels[status] || status;
  }
}