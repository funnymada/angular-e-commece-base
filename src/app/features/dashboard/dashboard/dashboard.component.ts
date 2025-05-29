import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { OrderService, AnalyticsData } from "../../../core/services/order.service"
import { ProductService } from "../../../core/services/product.service"
import { Order } from "../../../core/models/order.model"
import { NgChartsModule } from "ng2-charts"
import { ChartConfiguration, ChartData } from "chart.js"

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule, NgChartsModule],
  template: `
    <div class="dashboard">
      <h1 class="dashboard-title">Dashboard</h1>
      
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon sales-icon">
            <i class="material-icons">attach_money</i>
          </div>
          <div class="metric-content">
            <h3 class="metric-title">Total Sales</h3>
            <p class="metric-value">{{ analytics?.totalSales | currency }}</p>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon orders-icon">
            <i class="material-icons">shopping_cart</i>
          </div>
          <div class="metric-content">
            <h3 class="metric-title">Total Orders</h3>
            <p class="metric-value">{{ analytics?.totalOrders }}</p>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon products-icon">
            <i class="material-icons">inventory_2</i>
          </div>
          <div class="metric-content">
            <h3 class="metric-title">Total Products</h3>
            <p class="metric-value">{{ totalProducts }}</p>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon avg-icon">
            <i class="material-icons">trending_up</i>
          </div>
          <div class="metric-content">
            <h3 class="metric-title">Avg. Order Value</h3>
            <p class="metric-value">{{ analytics?.averageOrderValue | currency }}</p>
          </div>
        </div>
      </div>
      
      <div class="charts-grid">
        <div class="chart-card">
          <h3 class="chart-title">Sales by Day</h3>
          <div class="chart-container">
            <canvas baseChart
              [data]="salesByDayChartData"
              [options]="lineChartOptions"
              [type]="'line'"
            >
            </canvas>
          </div>
        </div>
        
        <div class="chart-card">
          <h3 class="chart-title">Sales by Category</h3>
          <div class="chart-container">
            <canvas baseChart
              [data]="salesByCategoryChartData"
              [options]="pieChartOptions"
              [type]="'pie'"
            >
            </canvas>
          </div>
        </div>
      </div>
      
      <div class="recent-orders">
        <div class="section-header">
          <h2 class="section-title">Recent Orders</h2>
          <a routerLink="/orders" class="view-all">View All</a>
        </div>
        
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody *ngIf="recentOrders">
              <tr *ngFor="let order of recentOrders">
                <td>{{ order.orderNumber }}</td>
                <td>{{ order.user?.username || 'Unknown' }}</td>
                <td>{{ order.createdAt | date:'short' }}</td>
                <td>{{ order.totalAmount | currency }}</td>
                <td>
                  <span class="status-badge" [ngClass]="'status-' + order.status">
                    {{ order.status }}
                  </span>
                </td>
              </tr>
              <tr *ngIf="recentOrders.length === 0">
                <td colspan="5" class="no-data">No recent orders found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .dashboard {
      height: 90vh;
      padding: 20px;
    }
    
    .dashboard-title {
      margin-bottom: 30px;
      color: #2c3e50;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .metric-card {
      display: flex;
      align-items: center;
      padding: 20px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .metric-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 15px;
      color: white;
    }
    
    .sales-icon {
      background-color: #4caf50;
    }
    
    .orders-icon {
      background-color: #2196f3;
    }
    
    .products-icon {
      background-color: #ff9800;
    }
    
    .avg-icon {
      background-color: #9c27b0;
    }
    
    .metric-content {
      flex: 1;
    }
    
    .metric-title {
      margin: 0 0 5px 0;
      font-size: 14px;
      color: #6c757d;
    }
    
    .metric-value {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
      color: #2c3e50;
    }
    
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .chart-card {
      padding: 20px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .chart-title {
      margin-top: 0;
      margin-bottom: 20px;
      color: #2c3e50;
    }
    
    .chart-container {
      height: 300px;
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .section-title {
      margin: 0;
      color: #2c3e50;
    }
    
    .view-all {
      color: #007bff;
      text-decoration: none;
    }
    
    .view-all:hover {
      text-decoration: underline;
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
    
    .no-data {
      text-align: center;
      color: #6c757d;
      padding: 20px 0;
    }
    
    @media (max-width: 768px) {
      .charts-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  ],
})
export class DashboardComponent implements OnInit {
  analytics: AnalyticsData | null = null
  recentOrders: Order[] = []
  totalProducts = 0

  salesByDayChartData: ChartData = {
    labels: [],
    datasets: [
      {
        data: [],
        label: "Daily Sales",
        backgroundColor: "rgba(33, 150, 243, 0.2)",
        borderColor: "rgba(33, 150, 243, 1)",
        pointBackgroundColor: "rgba(33, 150, 243, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(33, 150, 243, 1)",
        fill: "origin",
      },
    ],
  }

  salesByCategoryChartData: ChartData = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
        ],
      },
    ],
  }

  lineChartOptions: ChartConfiguration["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  }

  pieChartOptions: ChartConfiguration["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
    },
  }

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.loadAnalytics()
    this.loadRecentOrders()
    this.loadProductCount()
  }

  loadAnalytics(): void {
    this.orderService.getAnalytics().subscribe({
      next: (data) => {
        this.analytics = data
        this.updateCharts()
      },
      error: (error) => {
        console.error("Error loading analytics:", error)
      },
    })
  }

  loadRecentOrders(): void {
    this.orderService.getOrders({ limit: 5, sortBy: "createdAt", sortOrder: "desc" }).subscribe({
      next: (data) => {
        this.recentOrders = data.orders
      },
      error: (error) => {
        console.error("Error loading recent orders:", error)
      },
    })
  }

  loadProductCount(): void {
    this.productService.getProducts({ limit: 1 }).subscribe({
      next: (data) => {
        this.totalProducts = data.total
      },
      error: (error) => {
        console.error("Error loading product count:", error)
      },
    })
  }

  updateCharts(): void {
    if (this.analytics) {
      // Update sales by day chart
      this.salesByDayChartData.labels = this.analytics.salesByDay.map((item) => item.date)
      this.salesByDayChartData.datasets[0].data = this.analytics.salesByDay.map((item) => item.sales)

      // Update sales by category chart
      this.salesByCategoryChartData.labels = this.analytics.salesByCategory.map((item) => item.category)
      this.salesByCategoryChartData.datasets[0].data = this.analytics.salesByCategory.map((item) => item.sales)
    }
  }
}

