import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, ActivatedRoute, Router } from "@angular/router"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { CategoryService } from "../../../core/services/category.service"
import { ToastService } from "../../../core/services/toast.service"
import { CategoryCreate, CategoryUpdate } from "../../../core/models/category.model"

@Component({
  selector: "app-category-form",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="category-form">
      <div class="page-header">
        <h1 class="page-title">{{ isEditMode ? 'Edit' : 'Add' }} Category</h1>
        <button class="btn-secondary" routerLink="/categories">
          <i class="material-icons">arrow_back</i>
          Back to Categories
        </button>
      </div>
      
      <div class="form-container" *ngIf="!loading">
        <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Category Name *</label>
            <input 
              type="text" 
              id="name" 
              formControlName="name" 
              class="form-control"
              [ngClass]="{'is-invalid': submitted && f['name'].errors}"
            >
            <div *ngIf="submitted && f['name'].errors" class="invalid-feedback">
              <div *ngIf="f['name'].errors['required']">Category name is required</div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description" 
              formControlName="description" 
              class="form-control textarea"
              rows="5"
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" routerLink="/categories">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="formSubmitting">
              <span *ngIf="formSubmitting" class="spinner"></span>
              <span *ngIf="!formSubmitting">{{ isEditMode ? 'Update' : 'Create' }} Category</span>
            </button>
          </div>
        </form>
      </div>
      
      <div class="loading-container" *ngIf="loading">
        <div class="spinner large-spinner"></div>
        <p>Loading category data...</p>
      </div>
    </div>
  `,
  styles: [
    `
    .category-form {
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
    
    .form-container {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 20px;
    }
    
    .form-control {
      padding: 10px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 16px;
    }
    
    .form-control.is-invalid {
      border-color: #dc3545;
    }
    
    .textarea {
      resize: vertical;
      min-height: 100px;
    }
    
    .invalid-feedback {
      color: #dc3545;
      font-size: 14px;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 30px;
    }
    
    .btn-primary {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 120px;
    }
    
    .btn-primary:hover {
      background-color: #0069d9;
    }
    
    .btn-primary:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
    
    .spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }
    
    .loading-container {
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
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `,
  ],
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup
  isEditMode = false
  categoryId: string | null = null // Changed from number to string
  loading = false
  submitted = false
  formSubmitting = false

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private toastService: ToastService,
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ["", Validators.required],
      description: [""],
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        const id = params["id"]

        // Convert to string and validate
        const stringId = String(id)
        if (stringId && stringId.trim().length > 0) {
          this.isEditMode = true
          this.categoryId = stringId
          this.loadCategory(this.categoryId)
        } else {
          this.toastService.show("Invalid category ID", "error")
          this.router.navigate(["/categories"])
        }
      }
    })
  }

  get f() {
    return this.categoryForm.controls
  }

  loadCategory(id: string): void {
    // Changed parameter type to string
    this.loading = true
    this.categoryService.getCategory(id).subscribe({
      next: (category) => {
        this.categoryForm.patchValue({
          name: category.name,
          description: category.description,
        })
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading category:", error)
        this.toastService.show("Failed to load category", "error")
        this.loading = false
        this.router.navigate(["/categories"])
      },
    })
  }

  onSubmit(): void {
    this.submitted = true

    if (this.categoryForm.invalid) {
      return
    }

    this.formSubmitting = true

    if (this.isEditMode && this.categoryId) {
      const categoryUpdate: CategoryUpdate = {
        name: this.f["name"].value,
        description: this.f["description"].value,
      }

      this.categoryService.updateCategory(this.categoryId, categoryUpdate).subscribe({
        next: () => {
          this.toastService.show("Category updated successfully", "success")
          this.router.navigate(["/categories"])
        },
        error: (error) => {
          console.error("Error updating category:", error)
          this.toastService.show("Failed to update category", "error")
          this.formSubmitting = false
        },
      })
    } else {
      const categoryCreate: CategoryCreate = {
        name: this.f["name"].value,
        description: this.f["description"].value,
      }

      this.categoryService.createCategory(categoryCreate).subscribe({
        next: () => {
          this.toastService.show("Category created successfully", "success")
          this.router.navigate(["/categories"])
        },
        error: (error) => {
          console.error("Error creating category:", error)
          this.toastService.show("Failed to create category", "error")
          this.formSubmitting = false
        },
      })
    }
  }
}
