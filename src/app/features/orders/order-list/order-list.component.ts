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
          (keyup.enter)="applyFilters()"
          placeholder="Search orders..." 
          class="search-input"
        >
        <button class="search-btn" (click)="applyFilters()">
          <i class="material-icons">search</i>
        </button>
      </div>
      
      <div class="filter-group">
        <label for="status-filter">Status:</label>
        <select 
          id="status-filter" 
          [(ngModel)]="selectedStatus" 
          (ngModelChange)="applyFilters()"
          class="filter-select"
        >
          <option [ngValue]="null">All Statuses</option>
          <option *ngFor="let status of orderStatuses" [ngValue]="status">
            {{ status | titlecase }}
          </option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="sort-by">Sort By:</label>
        <select 
          id="sort-by" 
          [(ngModel)]="sortBy" 
          (change)="applyFilters()"
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
          (change)="applyFilters()"
          class="filter-select"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>
      
      <!-- Debug buttons -->
      <button (click)="loadMockOrders()" class="btn-primary" style="margin-left: auto;">
        Load Mock Orders
      </button>
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
          <tr *ngFor="let order of paginatedOrders">
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
          <tr *ngIf="paginatedOrders.length === 0 && !loading">
            <td colspan="6" class="no-data">No orders found</td>
          </tr>
          <tr *ngIf="loading">
            <td colspan="6" class="loading-data">Loading orders...</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="pagination" *ngIf="!loading && filteredOrders.length > 0">
      <div class="pagination-info">
        Showing {{ (currentPage - 1) * pageSize + 1 }} to 
        {{ Math.min(currentPage * pageSize, filteredOrders.length) }} of {{ filteredOrders.length }} orders
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
          [disabled]="currentPage * pageSize >= filteredOrders.length"
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
  
  .btn-primary {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .btn-primary:hover {
    background-color: #0069d9;
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
  allOrders: Order[] = []
  filteredOrders: Order[] = []
  paginatedOrders: Order[] = []
  loading = false

  // Filters and sorting
  searchTerm = ""
  selectedStatus: OrderStatus | null = null
  sortBy = "createdAt"
  sortOrder: "asc" | "desc" = "desc"

  // Pagination
  currentPage = 1
  pageSize = 10
  totalOrders = 0

  // For template use
  Math = Math
  orderStatuses: OrderStatus[] = ["pending", "completed", "cancelled"]

  constructor(
    private orderService: OrderService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadOrders()
  }

  loadOrders(): void {
    this.loading = true

    // Carica tutti gli ordini senza filtri per la paginazione lato client
    this.orderService.getOrders().subscribe({
      next: (data) => {
        console.log("=== LOAD ORDERS DEBUG ===")
        console.log("Orders data received:", data)
        console.log("Data type:", typeof data)
        console.log("Is array:", Array.isArray(data))

        if (Array.isArray(data)) {
          this.allOrders = data
          this.totalOrders = data.length
        } else if (data && typeof data === "object") {
          this.allOrders = data.orders || []
          this.totalOrders = data.total || this.allOrders.length
        } else {
          this.allOrders = []
          this.totalOrders = 0
        }

        console.log("All orders loaded:", this.allOrders.length)

        // Debug: mostra gli status degli ordini
        if (this.allOrders.length > 0) {
          console.log("Order statuses found:")
          const statuses = [...new Set(this.allOrders.map((order) => order.status))]
          console.log("Unique statuses:", statuses)

          this.allOrders.slice(0, 3).forEach((order, index) => {
            console.log(`Order ${index + 1}:`, {
              orderNumber: order.orderNumber,
              status: order.status,
              statusType: typeof order.status,
            })
          })
        } else {
          console.log("No orders found in the response")
        }
        console.log("========================")

        this.applyFilters()
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading orders:", error)
        this.toastService.show("Failed to load orders", "error")
        this.allOrders = []
        this.filteredOrders = []
        this.paginatedOrders = []
        this.loading = false
      },
    })
  }

  applyFilters(): void {
    // Debug logging
    console.log("=== APPLY FILTERS DEBUG ===")
    console.log("Search term:", this.searchTerm)
    console.log("Selected status:", this.selectedStatus)
    console.log("Selected status type:", typeof this.selectedStatus)
    console.log("All orders count:", this.allOrders.length)

    // Filtra per termine di ricerca
    let filtered = [...this.allOrders]

    if (this.searchTerm && this.searchTerm.trim()) {
      const search = this.searchTerm.trim().toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(search) ||
          (order.user?.username && order.user.username.toLowerCase().includes(search)) ||
          (order.user?.email && order.user.email.toLowerCase().includes(search)),
      )
    }

    console.log("After search filter:", filtered.length)

    // Filtra per stato - con debug migliorato
    if (this.selectedStatus !== null && this.selectedStatus !== undefined) {
      console.log("Filtering by status:", this.selectedStatus)
      console.log("Status type:", typeof this.selectedStatus)

      const beforeFilter = filtered.length
      filtered = filtered.filter((order) => {
        const orderStatus = order.status || "unknown"
        const matches = orderStatus === this.selectedStatus
        console.log(
          `Order ${order.orderNumber}: status="${orderStatus}" vs selected="${this.selectedStatus}" -> matches: ${matches}`,
        )
        return matches
      })

      console.log(`Status filter: ${beforeFilter} -> ${filtered.length} orders`)
    } else {
      console.log("No status filter applied (showing all)")
    }

    console.log("After status filter:", filtered.length)

    // Debug: mostra i primi ordini filtrati
    if (filtered.length > 0) {
      console.log("First filtered order:", {
        orderNumber: filtered[0].orderNumber,
        status: filtered[0].status,
        user: filtered[0].user?.username,
      })
    } else {
      console.log("No orders match the current filters")
    }

    // Ordina gli ordini
    if (this.sortBy) {
      filtered.sort((a, b) => {
        let valueA = a[this.sortBy as keyof Order]
        let valueB = b[this.sortBy as keyof Order]

        // Gestisci valori null/undefined
        if (valueA === null || valueA === undefined) valueA = ""
        if (valueB === null || valueB === undefined) valueB = ""

        // Converti a numeri per confronto numerico se necessario
        if (this.sortBy === "totalAmount") {
          valueA = Number(valueA)
          valueB = Number(valueB)
          return this.sortOrder === "asc" ? valueA - valueB : valueB - valueA
        }

        // Confronto stringhe
        if (typeof valueA === "string" && typeof valueB === "string") {
          return this.sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
        }

        // Fallback per altri tipi
        if (valueA < valueB) return this.sortOrder === "asc" ? -1 : 1
        if (valueA > valueB) return this.sortOrder === "asc" ? 1 : -1
        return 0
      })
    }

    this.filteredOrders = filtered
    this.currentPage = 1 // Reset alla prima pagina quando si applicano filtri
    this.updatePaginatedOrders()

    console.log("Final filtered orders:", this.filteredOrders.length)
    console.log("Current page:", this.currentPage)
    console.log("Paginated orders:", this.paginatedOrders.length)
    console.log("==============================")
  }

  updatePaginatedOrders(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize
    const endIndex = startIndex + this.pageSize
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex)
  }

  changePage(page: number): void {
    this.currentPage = page
    this.updatePaginatedOrders()
  }

  // Funzione per caricare ordini di test con ObjectIds validi e dati più realistici
  loadMockOrders(): void {
    const mockOrders: Order[] = [
      {
        id: "507f1f77bcf86cd799439011",
        orderNumber: "ORD-2024-001",
        user: { id: "507f1f77bcf86cd799439012", username: "mario.rossi", email: "mario.rossi@example.com" },
        totalAmount: 299.99,
        status: "pending",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        updatedAt: new Date().toISOString(),
        items: [],
      },
      {
        id: "507f1f77bcf86cd799439013",
        orderNumber: "ORD-2024-002",
        user: { id: "507f1f77bcf86cd799439014", username: "giulia.bianchi", email: "giulia.bianchi@example.com" },
        totalAmount: 156.75,
        status: "completed",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        updatedAt: new Date().toISOString(),
        items: [],
      },
      {
        id: "507f1f77bcf86cd799439015",
        orderNumber: "ORD-2024-003",
        user: { id: "507f1f77bcf86cd799439016", username: "luca.verdi", email: "luca.verdi@example.com" },
        totalAmount: 445.2,
        status: "completed",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        updatedAt: new Date().toISOString(),
        items: [],
      },
      {
        id: "507f1f77bcf86cd799439017",
        orderNumber: "ORD-2024-004",
        user: { id: "507f1f77bcf86cd799439018", username: "anna.neri", email: "anna.neri@example.com" },
        totalAmount: 89.99,
        status: "cancelled",
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        updatedAt: new Date().toISOString(),
        items: [],
      },
      {
        id: "507f1f77bcf86cd799439019",
        orderNumber: "ORD-2024-005",
        user: { id: "507f1f77bcf86cd799439020", username: "francesco.blu", email: "francesco.blu@example.com" },
        totalAmount: 678.5,
        status: "pending",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        updatedAt: new Date().toISOString(),
        items: [],
      },
      {
        id: "507f1f77bcf86cd799439021",
        orderNumber: "ORD-2024-006",
        user: { id: "507f1f77bcf86cd799439022", username: "sara.gialli", email: "sara.gialli@example.com" },
        totalAmount: 234.8,
        status: "completed",
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
        updatedAt: new Date().toISOString(),
        items: [],
      },
      {
        id: "507f1f77bcf86cd799439023",
        orderNumber: "ORD-2024-007",
        user: { id: "507f1f77bcf86cd799439024", username: "marco.viola", email: "marco.viola@example.com" },
        totalAmount: 567.25,
        status: "pending",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        updatedAt: new Date().toISOString(),
        items: [],
      },
      {
        id: "507f1f77bcf86cd799439025",
        orderNumber: "ORD-2024-008",
        user: { id: "507f1f77bcf86cd799439026", username: "elena.rosa", email: "elena.rosa@example.com" },
        totalAmount: 123.45,
        status: "completed",
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
        updatedAt: new Date().toISOString(),
        items: [],
      },
      {
        id: "507f1f77bcf86cd799439027",
        orderNumber: "ORD-2024-009",
        user: { id: "507f1f77bcf86cd799439028", username: "davide.arancio", email: "davide.arancio@example.com" },
        totalAmount: 890.75,
        status: "completed",
        createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
        updatedAt: new Date().toISOString(),
        items: [],
      },
      {
        id: "507f1f77bcf86cd799439029",
        orderNumber: "ORD-2024-010",
        user: { id: "507f1f77bcf86cd799439030", username: "chiara.azzurro", email: "chiara.azzurro@example.com" },
        totalAmount: 345.6,
        status: "pending",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        updatedAt: new Date().toISOString(),
        items: [],
      },
    ]

    this.allOrders = mockOrders
    this.totalOrders = mockOrders.length
    this.toastService.show(`Loaded ${mockOrders.length} realistic mock orders`, "success")
    this.applyFilters()
  }

  getUniqueStatuses(): string {
    const statuses = [...new Set(this.allOrders.map((order) => order.status))]
    return JSON.stringify(statuses)
  }

  getSelectedStatusType(): string {
    return typeof this.selectedStatus
  }
}
