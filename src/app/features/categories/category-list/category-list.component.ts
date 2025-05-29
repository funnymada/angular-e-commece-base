import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { CategoryService } from "../../../core/services/category.service"
import { ToastService } from "../../../core/services/toast.service"
import { Category } from "../../../core/models/category.model"

@Component({
  selector: "app-category-list",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="category-list">
      <div class="page-header">
        <h1 class="page-title">Categories</h1>
        <a routerLink="/categories/new" class="btn-primary">Add Category</a>
      </div>
      
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let category of categories; trackBy: trackByCategoryId">
              <td>{{ category.name }}</td>
              <td>{{ category.description }}</td>
              <td>{{ category.createdAt | date:'medium' }}</td>
              <td class="actions-cell">
                <a 
                  *ngIf="category.id && isValidId(category.id)" 
                  [routerLink]="['/categories/edit', category.id]" 
                  class="action-btn edit-btn"
                >
                  <i class="material-icons">edit</i>
                </a>
                <button 
                  *ngIf="!category.id || !isValidId(category.id)" 
                  class="action-btn edit-btn disabled" 
                  disabled
                  title="Invalid category ID"
                >
                  <i class="material-icons">edit</i>
                </button>
                <button class="action-btn delete-btn" (click)="confirmDelete(category)">
                  <i class="material-icons">delete</i>
                </button>
              </td>
            </tr>
            <tr *ngIf="categories.length === 0 && !loading">
              <td colspan="4" class="no-data">No categories found</td>
            </tr>
            <tr *ngIf="loading">
              <td colspan="4" class="loading-data">Loading categories...</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <div class="modal" *ngIf="showDeleteModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Confirm Delete</h3>
            <button class="modal-close" (click)="cancelDelete()">×</button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete <strong>{{ categoryToDelete?.name }}</strong>?</p>
            <p class="warning-text">This action cannot be undone. Products in this category may be affected.</p>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="cancelDelete()">Cancel</button>
            <button class="btn-danger" (click)="deleteCategory()">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .category-list {
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
    
    .table-container {
      overflow-x: auto;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
    
    .edit-btn:hover:not(.disabled) {
      background-color: #138496;
    }
    
    .edit-btn.disabled {
      background-color: #6c757d;
      cursor: not-allowed;
      opacity: 0.5;
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
  `,
  ],
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = []
  loading = false

  // Delete modal
  showDeleteModal = false
  categoryToDelete: Category | null = null

  constructor(
    private categoryService: CategoryService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadCategories()
  }

  // Added method to validate category ID
  isValidId(id: any): boolean {
    if (id === null || id === undefined) return false
    if (typeof id === "string" && id.trim().length > 0) return true
    if (typeof id === "number" && !isNaN(id) && id > 0) return true
    return false
  }

  loadCategories(): void {
    this.loading = true
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories

        // Debug: Log category IDs to check for invalid values
        this.categories.forEach((category, index) => {
          console.log(`Category ${index}:`, {
            id: category.id,
            idType: typeof category.id,
            isValid: this.isValidId(category.id),
            name: category.name,
          })
        })

        this.loading = false
      },
      error: (error) => {
        console.error("Error loading categories:", error)
        this.toastService.show("Failed to load categories", "error")
        this.loading = false
      },
    })
  }

  confirmDelete(category: Category): void {
    if (!this.isValidId(category.id)) {
      this.toastService.show("Cannot delete category with invalid ID", "error")
      return
    }
    this.categoryToDelete = category
    this.showDeleteModal = true
  }

  cancelDelete(): void {
    this.categoryToDelete = null
    this.showDeleteModal = false
  }

  deleteCategory(): void {
    if (!this.categoryToDelete || !this.isValidId(this.categoryToDelete.id)) return

    const categoryId = String(this.categoryToDelete.id)
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: () => {
        this.toastService.show(`Category "${this.categoryToDelete?.name}" deleted successfully`, "success")
        this.loadCategories()
        this.cancelDelete()
      },
      error: (error) => {
        console.error("Error deleting category:", error)
        this.toastService.show("Failed to delete category", "error")
      },
    })
  }

  trackByCategoryId(index: number, category: Category): string {
    return String(category.id)
  }
}
