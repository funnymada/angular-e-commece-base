import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import type { User } from "../../models/user.model"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="logo">
        <h1>E-Commerce Admin</h1>
      </div>
      <div class="user-menu">
        <div class="user-info" *ngIf="currentUser">
          <span>{{ currentUser.username }}</span>
        </div>
        <button class="logout-btn" (click)="logout()">Logout</button>
      </div>
    </header>
  `,
  styles: [
    `
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      height: 60px;
      background-color: #2c3e50;
      color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
    }
    
    .user-menu {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .logout-btn {
      background-color: transparent;
      border: 1px solid white;
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .logout-btn:hover {
      background-color: white;
      color: #2c3e50;
    }
  `,
  ],
})
export class HeaderComponent {
  currentUser: User | null = null

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user
    })
  }

  logout(): void {
    this.authService.logout()
  }
}

