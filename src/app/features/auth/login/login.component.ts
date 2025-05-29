import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, ActivatedRoute } from "@angular/router"
import { AuthService } from "../../../core/services/auth.service"
import { ToastService } from "../../../core/services/toast.service"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2 class="login-title">E-Commerce Admin</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="username">Mail</label>
            <input 
              type="text" 
              id="username" 
              formControlName="username" 
              class="form-control"
              [ngClass]="{'is-invalid': submitted && f['username'].errors}"
            >
            <div *ngIf="submitted && f['username'].errors" class="invalid-feedback">
              <div *ngIf="f['username'].errors['required']">Mail is required</div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password" 
              class="form-control"
              [ngClass]="{'is-invalid': submitted && f['password'].errors}"
            >
            <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">
              <div *ngIf="f['password'].errors['required']">Password is required</div>
            </div>
          </div>
          
          <div class="form-group">
            <button 
              type="submit" 
              class="login-button" 
              [disabled]="loading"
            >Login
              <span *ngIf="loading" class="spinner"></span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 90vh;
      background-color: #f8f9fa;

    }
    
    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 30px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .login-title {
      text-align: center;
      margin-bottom: 30px;
      color: #2c3e50;
    }
    
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
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
    
    .invalid-feedback {
      color: #dc3545;
      font-size: 14px;
    }
    
    .login-button {
      padding: 12px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.2s;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .login-button:hover {
      background-color: #0069d9;
    }
    
    .login-button:disabled {
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
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup
  loading = false
  submitted = false

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
  ) {
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    })
  }

  get f() {
    return this.loginForm.controls
  }

  onSubmit(): void {
    this.submitted = true

    if (this.loginForm.invalid) {
      return
    }

    this.loading = true
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/"
        this.router.navigateByUrl(returnUrl)
        this.toastService.show("Login successful", "success")
      },
      error: (error) => {
        this.toastService.show(error.error?.message || "Login failed", "error")
        this.loading = false
      },
    })
  }
}

