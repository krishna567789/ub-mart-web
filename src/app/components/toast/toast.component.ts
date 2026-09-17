import { Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-container">
      @for (t of toastService.toasts(); track t.id) {
        <div class="toast-card" [class]="t.type">
          <span class="toast-icon">{{ t.icon || '⚡' }}</span>
          <span class="toast-msg">{{ t.message }}</span>
          <button class="toast-close" (click)="toastService.remove(t.id)" aria-label="Dismiss">✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }

    .toast-card {
      pointer-events: auto;
      background: rgba(17, 20, 24, 0.95);
      color: #ffffff;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 14px;
      padding: 12px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.15);
      font-family: 'Outfit', sans-serif;
      font-size: 0.92rem;
      font-weight: 600;
      animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      max-width: 380px;
    }

    .toast-card.success {
      border-left: 4px solid var(--primary-color);
    }

    .toast-card.warning {
      border-left: 4px solid #ff9800;
    }

    .toast-icon {
      font-size: 1.2rem;
    }

    .toast-msg {
      flex: 1;
      line-height: 1.35;
    }

    .toast-close {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      padding: 4px;
      transition: color 0.15s ease;
    }

    .toast-close:hover {
      color: #ffffff;
    }

    @keyframes toastIn {
      from {
        transform: translateY(20px) scale(0.95);
        opacity: 0;
      }
      to {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
