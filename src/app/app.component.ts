import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { CommonModule } from "@angular/common"
import { HeaderComponent } from "./core/components/header/header.component"
import { FooterComponent } from "./core/components/footer/footer.component"
import { SidebarComponent } from "./core/components/sidebar/sidebar.component"
import { AuthService } from "../app/core/services/auth.service"
import { APP_INITIALIZER } from '@angular/core'
@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, SidebarComponent],
  template: `
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

<!-- questo è visibile sempre -->
<app-footer></app-footer>

  `,
  styles: [
    `
    .app-container {
      display: flex;
      flex-direction: column;
      height: 90vh;
      overflow: hidden;
    }
    
    .main-container {
      height: 80vh;
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
      background-color: #f8f9fa;
    }
  `,
  ],
})
export class AppComponent {
  isAuthenticated = false
  loaded = false

  constructor(private authService: AuthService) {
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth
      this.loaded = true
    })
  }
}

