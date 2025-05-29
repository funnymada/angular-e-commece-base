import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"

interface NavItem {
  label: string
  icon: string
  route: string
}

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <nav class="nav">
        <ul class="nav-list">
          <li *ngFor="let item of navItems" class="nav-item">
            <a [routerLink]="item.route" routerLinkActive="active" class="nav-link">
              <i class="material-icons">{{ item.icon }}</i>
              <span>{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  `,
  styles: [
    `
    .sidebar {
      width: 250px;
      background-color: #f8f9fa;
      height: 100%;
      border-right: 1px solid #e9ecef;
      overflow-y: auto;
    }
    
    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .nav-item {
      margin: 0;
    }
    
    .nav-link {
      display: flex;
      align-items: center;
      padding: 15px 20px;
      color: #495057;
      text-decoration: none;
      transition: all 0.2s;
      gap: 10px;
    }
    
    .nav-link:hover {
      background-color: #e9ecef;
    }
    
    .nav-link.active {
      background-color: #e9ecef;
      color: #007bff;
      border-left: 3px solid #007bff;
    }
    
    .material-icons {
      font-size: 20px;
    }
  `,
  ],
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: "Dashboard", icon: "dashboard", route: "/" },
    { label: "Products", icon: "inventory_2", route: "/products" },
    { label: "Categories", icon: "category", route: "/categories" },
    { label: "Orders", icon: "shopping_cart", route: "/orders" },
  ]
}

