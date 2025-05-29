import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import type { Toast } from "../../services/toast.service"
import { ToastService } from "../../services/toast.service"
import { animate, style, transition, trigger } from "@angular/animations"

@Component({
  selector: "app-toast",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div
        *ngFor="let toast of toasts"
        [@fadeInOut]
        class="toast"
        [ngClass]="'toast-' + toast.type"
      >
        <div class="toast-content">
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" (click)="removeToast(toast.id)">×</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1050;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .toast {
      min-width: 250px;
      padding: 15px;
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .toast-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .toast-success {
      background-color: #d4edda;
      color: #155724;
    }
    
    .toast-error {
      background-color: #f8d7da;
      color: #721c24;
    }
    
    .toast-info {
      background-color: #d1ecf1;
      color: #0c5460;
    }
    
    .toast-warning {
      background-color: #fff3cd;
      color: #856404;
    }
    
    .toast-close {
      background: transparent;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      margin-left: 10px;
    }
  `,
  ],
  animations: [
    trigger("fadeInOut", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(-20px)" }),
        animate("300ms ease-out", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
      transition(":leave", [animate("200ms ease-in", style({ opacity: 0, transform: "translateY(-20px)" }))]),
    ]),
  ],
})
export class ToastComponent implements OnInit {
  toasts: Toast[] = []

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toasts.subscribe((toast) => {
      this.toasts.push(toast)
      setTimeout(() => this.removeToast(toast.id), 5000)
    })
  }

  removeToast(id: number): void {
    this.toasts = this.toasts.filter((t) => t.id !== id)
  }
}

