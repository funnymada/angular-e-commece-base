import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router" // Import RouterModule for routerLink

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [CommonModule, RouterModule], // Add RouterModule here
  templateUrl: "./footer.component.html",
  styles: [
    `
      .footer {
        background: #111827;
        color: #d1d5db;
        padding: 2rem 1rem;
        border-top: 1px solid #374151;
        text-align: center;
        font-family: "Segoe UI", sans-serif;
        /* Rimosso height: 200px; per altezza dinamica */
        /* Rimosso position: fixed; per un footer "sticky" */
      }

      .footer-content {
        max-width: 600px;
        margin: 0 auto;
      }

      .footer p {
        margin-bottom: 1rem;
        font-size: 0.95rem;
      }

      .footer-links {
        display: flex;
        justify-content: center;
        gap: 1rem;
        font-size: 0.9rem;
        flex-wrap: wrap;
      }

      .footer-links a {
        color: #9ca3af;
        text-decoration: none;
        transition: color 0.3s ease;
      }

      .footer-links a:hover {
        color: #ffffff;
      }

      .footer-links span {
        color: #6b7280;
      }
    `,
  ],
})
export class FooterComponent {}
