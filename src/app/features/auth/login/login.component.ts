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
        
        <!-- Messaggio di errore generale -->
        <div *ngIf="errorMessage" class="error-alert">
          <i class="material-icons">error</i>
          <span>{{ errorMessage }}</span>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="username">Email</label>
            <input 
              type="email" 
              id="username" 
              formControlName="username" 
              class="form-control"
              [ngClass]="{
                'is-invalid': (submitted && f['username'].errors) || hasCredentialError,
                'is-valid': submitted && !f['username'].errors && !hasCredentialError
              }"
              placeholder="Inserisci la tua email"
            >
            <div *ngIf="submitted && f['username'].errors" class="invalid-feedback">
              <div *ngIf="f['username'].errors['required']">Email è richiesta</div>
              <div *ngIf="f['username'].errors['email']">Inserisci un'email valida</div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password" 
              class="form-control"
              [ngClass]="{
                'is-invalid': (submitted && f['password'].errors) || hasCredentialError,
                'is-valid': submitted && !f['password'].errors && !hasCredentialError
              }"
              placeholder="Inserisci la tua password"
            >
            <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">
              <div *ngIf="f['password'].errors['required']">Password è richiesta</div>
              <div *ngIf="f['password'].errors['minlength']">Password deve essere di almeno 3 caratteri</div>
            </div>
          </div>
          
          <!-- Messaggio di errore per credenziali -->
          <div *ngIf="hasCredentialError" class="credential-error">
            <i class="material-icons">warning</i>
            <span>Email o password non corretti. Riprova.</span>
          </div>
          
          <div class="form-group">
            <button 
              type="submit" 
              class="login-button" 
              [disabled]="loading || loginForm.invalid"
            >
              <span *ngIf="!loading">Accedi</span>
              <span *ngIf="loading" class="loading-content">
                <span class="spinner"></span>
                Accesso in corso...
              </span>
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
      padding: 20px;
      box-sizing: border-box; /* Importante per il padding */
    }
    
    .login-card {
      width: 480px; /* Larghezza FISSA invece di max-width */
      min-height: 450px;
      padding: 40px;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      box-sizing: border-box; /* Importante per il padding */
      overflow: hidden; /* Previene overflow che potrebbe allargare la card */
    }
    
    .login-title {
      text-align: center;
      margin-bottom: 35px;
      color: #2c3e50;
      font-size: 28px;
      font-weight: 600;
      word-wrap: break-word; /* Previene overflow del testo */
    }
    
    .error-alert {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 15px;
      margin-bottom: 25px;
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
      border-radius: 6px;
      font-size: 15px;
      box-sizing: border-box; /* Importante per il padding */
      width: 100%; /* Forza la larghezza al 100% del container */
      max-width: 100%; /* Previene overflow */
      word-wrap: break-word; /* Testo va a capo se troppo lungo */
      overflow-wrap: break-word; /* Compatibilità browser */
    }
    
    .error-alert i {
      font-size: 20px;
      flex-shrink: 0; /* L'icona non si riduce */
    }
    
    .error-alert span {
      flex: 1; /* Il testo occupa lo spazio rimanente */
      min-width: 0; /* Permette al testo di ridursi */
    }
    
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 25px;
      width: 100%; /* Forza la larghezza al 100% */
      box-sizing: border-box;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%; /* Forza la larghezza al 100% */
      box-sizing: border-box;
    }
    
    .form-group label {
      font-weight: 500;
      color: #495057;
      font-size: 16px;
      word-wrap: break-word;
    }
    
    .form-control {
      width: 100%; /* Forza la larghezza al 100% */
      padding: 15px;
      border: 1px solid #ced4da;
      border-radius: 6px;
      font-size: 16px;
      transition: border-color 0.2s, box-shadow 0.2s;
      min-height: 50px;
      box-sizing: border-box; /* Importante per il padding */
      max-width: 100%; /* Previene overflow */
    }
    
    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
    }
    
    .form-control.is-invalid {
      border-color: #dc3545;
      box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
    }
    
    .form-control.is-valid {
      border-color: #28a745;
      box-shadow: 0 0 0 0.25rem rgba(40, 167, 69, 0.25);
    }
    
    .invalid-feedback {
      color: #dc3545;
      font-size: 14px;
      margin-top: 5px;
      word-wrap: break-word; /* Testo va a capo se troppo lungo */
      overflow-wrap: break-word;
      width: 100%; /* Forza la larghezza al 100% */
      box-sizing: border-box;
    }
    
    .credential-error {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px;
      background-color: #fff3cd;
      color: #856404;
      border: 1px solid #ffeaa7;
      border-radius: 6px;
      font-size: 15px;
      box-sizing: border-box; /* Importante per il padding */
      width: 100%; /* Forza la larghezza al 100% */
      max-width: 100%; /* Previene overflow */
      word-wrap: break-word; /* Testo va a capo se troppo lungo */
      overflow-wrap: break-word;
    }
    
    .credential-error i {
      font-size: 18px;
      flex-shrink: 0; /* L'icona non si riduce */
    }
    
    .credential-error span {
      flex: 1; /* Il testo occupa lo spazio rimanente */
      min-width: 0; /* Permette al testo di ridursi */
    }
    
    .login-button {
      width: 100%; /* Forza la larghezza al 100% */
      padding: 15px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 17px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s, transform 0.1s;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 52px;
      margin-top: 10px;
      box-sizing: border-box; /* Importante per il padding */
      max-width: 100%; /* Previene overflow */
    }
    
    .login-button:hover:not(:disabled) {
      background-color: #0069d9;
      transform: translateY(-1px);
    }
    
    .login-button:active:not(:disabled) {
      transform: translateY(0);
    }
    
    .login-button:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
      transform: none;
    }
    
    .loading-content {
      display: flex;
      align-items: center;
      gap: 12px;
      justify-content: center; /* Centra il contenuto */
    }
    
    .spinner {
      display: inline-block;
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
      flex-shrink: 0; /* Lo spinner non si riduce */
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    /* Responsive design con larghezze fisse */
    @media (max-width: 600px) {
      .login-container {
        padding: 15px;
      }
      
      .login-card {
        width: calc(100vw - 30px); /* Larghezza fissa basata su viewport */
        max-width: 420px; /* Massimo 420px */
        min-width: 300px; /* Minimo 300px */
        padding: 30px;
      }
      
      .login-title {
        font-size: 24px;
      }
    }
    
    @media (max-width: 480px) {
      .login-card {
        width: calc(100vw - 20px); /* Larghezza fissa basata su viewport */
        max-width: 100%;
        min-width: 280px; /* Minimo 280px */
        padding: 25px;
        border-radius: 8px;
      }
      
      .login-title {
        font-size: 22px;
        margin-bottom: 25px;
      }
      
      .form-control {
        padding: 12px;
        min-height: 45px;
      }
      
      .login-button {
        padding: 12px;
        min-height: 48px;
        font-size: 16px;
      }
    }
    
    @media (max-width: 320px) {
      .login-card {
        width: calc(100vw - 15px); /* Larghezza fissa basata su viewport */
        min-width: 260px; /* Minimo 260px */
        padding: 20px;
      }
      
      .login-title {
        font-size: 20px;
      }
      
      .error-alert, .credential-error {
        font-size: 14px;
        padding: 10px;
      }
    }
  `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup
  loading = false
  submitted = false
  errorMessage = ""
  hasCredentialError = false

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
  ) {
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(3)]],
    })

    // Reset errori quando l'utente modifica i campi
    this.loginForm.valueChanges.subscribe(() => {
      this.clearErrors()
    })
  }

  get f() {
    return this.loginForm.controls
  }

  clearErrors(): void {
    this.errorMessage = ""
    this.hasCredentialError = false
  }

  fillTestCredentials(): void {
    this.loginForm.patchValue({
      username: "admin@example.com",
      password: "password",
    })
    this.clearErrors()
  }

  onSubmit(): void {
    this.submitted = true
    this.clearErrors()

    if (this.loginForm.invalid) {
      this.errorMessage = "Compila tutti i campi richiesti correttamente"
      return
    }

    this.loading = true

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log("Login successful:", response)
        this.toastService.show("Accesso effettuato con successo!", "success")

        const returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/"
        this.router.navigateByUrl(returnUrl)
      },
      error: (error) => {
        console.error("Login error:", error)
        this.loading = false

        // Gestione specifica degli errori
        if (error.status === 401) {
          this.hasCredentialError = true
          this.toastService.show("Email o password non corretti", "error")
        } else if (error.status === 403) {
          this.errorMessage = "Accesso negato. Contatta l'amministratore."
          this.toastService.show("Accesso negato", "error")
        } else if (error.status === 0) {
          this.errorMessage = "Impossibile connettersi al server. Verifica la connessione."
          this.toastService.show("Errore di connessione", "error")
        } else if (error.status >= 500) {
          this.errorMessage = "Errore del server. Riprova più tardi."
          this.toastService.show("Errore del server", "error")
        } else {
          // Errore generico
          const message = error.error?.message || error.message || "Errore durante l'accesso"
          this.errorMessage = message
          this.toastService.show(message, "error")
        }
      },
    })
  }
}
