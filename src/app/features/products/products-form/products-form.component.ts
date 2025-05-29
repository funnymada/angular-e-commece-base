import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, ActivatedRoute, Router } from "@angular/router"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { ProductService } from "../../../core/services/product.service"
import { CategoryService } from "../../../core/services/category.service"
import { ToastService } from "../../../core/services/toast.service"
import { Category } from "../../../core/models/category.model"
import { ProductCreate, ProductUpdate } from "../../../core/models/product.model"

@Component({
  selector: "app-product-form",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="product-form">
      <div class="page-header">
        <h1 class="page-title">{{ isEditMode ? 'Edit' : 'Add' }} Product</h1>
        <button class="btn-secondary" routerLink="/products">
          <i class="material-icons">arrow_back</i>
          Back to Products
        </button>
      </div>
      
      <div class="form-container" *ngIf="!loading">
        <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="form-group">
              <label for="name">Product Name *</label>
              <input 
                type="text" 
                id="name" 
                formControlName="name" 
                class="form-control"
                [ngClass]="{'is-invalid': submitted && f['name'].errors}"
              >
              <div *ngIf="submitted && f['name'].errors" class="invalid-feedback">
                <div *ngIf="f['name'].errors['required']">Product name is required</div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="price">Price *</label>
              <input 
                type="number" 
                id="price" 
                formControlName="price" 
                class="form-control"
                [ngClass]="{'is-invalid': submitted && f['price'].errors}"
                min="0"
                step="0.01"
              >
              <div *ngIf="submitted && f['price'].errors" class="invalid-feedback">
                <div *ngIf="f['price'].errors['required']">Price is required</div>
                <div *ngIf="f['price'].errors['min']">Price must be greater than or equal to 0</div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="categoryId">Category *</label>
              <select 
                id="categoryId" 
                formControlName="categoryId" 
                class="form-control"
                [ngClass]="{'is-invalid': submitted && f['categoryId'].errors}"
              >
                <option [ngValue]="null" disabled>Select a category</option>
                <option *ngFor="let category of categories" [ngValue]="category.id">
                  {{ category.name }}
                </option>
              </select>
              <div *ngIf="submitted && f['categoryId'].errors" class="invalid-feedback">
                <div *ngIf="f['categoryId'].errors['required']">Category is required</div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="stock">Stock *</label>
              <input 
                type="number" 
                id="stock" 
                formControlName="stock" 
                class="form-control"
                [ngClass]="{'is-invalid': submitted && f['stock'].errors}"
                min="0"
                step="1"
              >
              <div *ngIf="submitted && f['stock'].errors" class="invalid-feedback">
                <div *ngIf="f['stock'].errors['required']">Stock is required</div>
                <div *ngIf="f['stock'].errors['min']">Stock must be greater than or equal to 0</div>
              </div>
            </div>
            
            <div class="form-group full-width">
              <label for="imageUrl">Image URL</label>
              <input 
                type="text" 
                id="imageUrl" 
                formControlName="imageUrl" 
                class="form-control"
                [ngClass]="{'is-invalid': submitted && f['imageUrl'].errors}"
              >
              <div *ngIf="submitted && f['imageUrl'].errors" class="invalid-feedback">
                <div *ngIf="f['imageUrl'].errors['pattern']">Invalid URL format</div>
              </div>
            </div>
            
            <div class="form-group full-width">
              <label for="description">Description</label>
              <textarea 
                id="description" 
                formControlName="description" 
                class="form-control textarea"
                rows="5"
              ></textarea>
            </div>
          </div>
          
          <div class="preview-section" *ngIf="f['imageUrl'].value">
            <h3 class="preview-title">Image Preview</h3>
            <div class="image-preview">
              <img [src]="f['imageUrl'].value" alt="Product image preview">
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" routerLink="/products">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="formSubmitting">
              <span *ngIf="formSubmitting" class="spinner"></span>
              <span *ngIf="!formSubmitting">{{ isEditMode ? 'Update' : 'Create' }} Product</span>
            </button>
          </div>
        </form>
      </div>
      
      <div class="loading-container" *ngIf="loading">
        <div class="spinner large-spinner"></div>
        <p>Loading product data...</p>
      </div>
    </div>
  `,
  styles: [
    `
    .product-form {
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
    
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .full-width {
      grid-column: span 2;
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
    
    .preview-section {
      margin-top: 30px;
    }
    
    .preview-title {
      margin-top: 0;
      margin-bottom: 15px;
      color: #2c3e50;
    }
    
    .image-preview {
      max-width: 300px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .image-preview img {
      width: 100%;
      height: auto;
      display: block;
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
    
    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .full-width {
        grid-column: span 1;
      }
    }
  `,
  ],
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup
  categories: Category[] = []
  isEditMode = false
  productId: string | null = null // Changed from number to string
  loading = false
  submitted = false
  formSubmitting = false

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastService: ToastService,
  ) {
    this.productForm = this.formBuilder.group({
      name: ["", Validators.required],
      description: [""],
      price: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ["", Validators.pattern("^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?$")],
    })
  }

  ngOnInit(): void {
    this.loadCategories()

    this.route.params.subscribe((params) => {
      if (params["id"]) {
        const id = params["id"]

        // Convert to string and validate
        const stringId = String(id)
        if (stringId && stringId.trim().length > 0) {
          this.isEditMode = true
          this.productId = stringId
          this.loadProduct(this.productId)
        } else {
          this.toastService.show("Invalid product ID", "error")
          this.router.navigate(["/products"])
        }
      }
    })
  }

  get f() {
    return this.productForm.controls
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

  loadProduct(id: string): void {
    // Changed parameter type to string
    this.loading = true
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          categoryId: product.categoryId,
          stock: product.stock,
          imageUrl: product.imageUrl || "",
        })
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading product:", error)
        this.toastService.show("Failed to load product", "error")
        this.loading = false
        this.router.navigate(["/products"])
      },
    })
  }

  onSubmit(): void {
    this.submitted = true

    if (this.productForm.invalid) {
      return
    }

    this.formSubmitting = true

    if (this.isEditMode && this.productId) {
      const productUpdate: ProductUpdate = {
        name: this.f["name"].value,
        description: this.f["description"].value,
        price: this.f["price"].value,
        categoryId: this.f["categoryId"].value,
        stock: this.f["stock"].value,
        imageUrl: this.f["imageUrl"].value || undefined,
      }

      this.productService.updateProduct(this.productId, productUpdate).subscribe({
        next: () => {
          this.toastService.show("Product updated successfully", "success")
          this.router.navigate(["/products"])
        },
        error: (error) => {
          console.error("Error updating product:", error)
          this.toastService.show("Failed to update product", "error")
          this.formSubmitting = false
        },
      })
    } else {
      const productCreate: ProductCreate = {
        name: this.f["name"].value,
        description: this.f["description"].value,
        price: this.f["price"].value,
        categoryId: this.f["categoryId"].value,
        stock: this.f["stock"].value,
        imageUrl: this.f["imageUrl"].value || undefined,
      }

      this.productService.createProduct(productCreate).subscribe({
        next: () => {
          this.toastService.show("Product created successfully", "success")
          this.router.navigate(["/products"])
        },
        error: (error) => {
          console.error("Error creating product:", error)
          this.toastService.show("Failed to create product", "error")
          this.formSubmitting = false
        },
      })
    }
  }
}
