import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { CommonModule } from "@angular/common"
import { HeaderComponent } from "./core/components/header/header.component"
import { SidebarComponent } from "./core/components/sidebar/sidebar.component"
import { AuthService } from "../app/core/services/auth.service"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="app-container" [class.is-authenticated]="isAuthenticated">
      <app-header *ngIf="isAuthenticated"></app-header>
      <div class="main-container" *ngIf="isAuthenticated">
        <app-sidebar></app-sidebar>
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
      <div class="auth-container" *ngIf="!isAuthenticated">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [
    `
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }
    
    .main-container {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    
    .content {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
    }
    
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  `,
  ],
})
export class AppComponent {
  isAuthenticated = false

  constructor(private authService: AuthService) {
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth
    })
  }
}

