import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { CommonModule } from "@angular/common"
import { HeaderComponent } from "./core/components/header/header.component"
import { FooterComponent } from "./core/components/footer/footer.component"
import { SidebarComponent } from "./core/components/sidebar/sidebar.component"
import { AuthService } from "../app/core/services/auth.service"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, SidebarComponent],
  template: `
    <div class="app-layout">
      <app-header *ngIf="isAuthenticated"></app-header>

      <div class="content-wrapper">
        <ng-container *ngIf="isAuthenticated; else authLayout">
          <app-sidebar></app-sidebar>
          <main class="main-content">
            <router-outlet></router-outlet>
          </main>
        </ng-container>

        <ng-template #authLayout>
          <div class="auth-content">
            <router-outlet></router-outlet>
          </div>
        </ng-template>
      </div>

      <app-footer></app-footer>
    </div>
  `,
  styles: [
    `
      .app-layout {
        display: flex;
        flex-direction: column;
        min-height: 100vh; /* Assicura che il layout occupi almeno l'intera altezza della viewport */
        height: 100%; /* Assicura che il layout occupi il 100% dell'altezza del genitore */
      }

      .content-wrapper {
        flex: 1; /* Permette a questa sezione di espandersi e spingere il footer in basso */
        display: flex; /* Per affiancare sidebar e main content */
        /* Rimosso height e overflow: hidden da qui */
      }

      /* Stili per il layout autenticato (con sidebar) */
      .content-wrapper > ng-container {
        display: flex; /* Per affiancare sidebar e main-content */
        flex: 1; /* Assicura che il contenitore interno si espanda */
      }

      .main-content {
        flex: 1; /* Il contenuto principale occupa lo spazio rimanente */
        padding: 20px;
        /* Aggiungi un padding-bottom per l'altezza stimata del footer */
        /* Il tuo footer ha un padding di 2rem (circa 32px) in alto e in basso, più il testo. */
        /* Un valore di 100px dovrebbe essere sufficiente per evitare sovrapposizioni. */
        padding-bottom: 100px; /* Regola questo valore se l'altezza effettiva del footer cambia */
        overflow-y: auto; /* Permette lo scroll solo al contenuto principale se necessario */
      }

      /* Stili per il layout di autenticazione (senza sidebar) */
      .auth-content {
        flex: 1; /* Assicura che il contenuto di autenticazione si espanda */
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f8f9fa;
        /* Rimosso height: 100%; da qui, flex: 1 nel parent gestisce l'altezza */
      }

      /* Rimosso i vecchi stili .app-container, .main-container, .auth-container */
      /* che avevano altezze fisse e overflow: hidden */
    `,
  ],
})
export class AppComponent {
  isAuthenticated = false
  loaded = false

  constructor(private authService: AuthService) {
    this.authService.checkToken()
  
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth
      this.loaded = true
    })
  }
}
