import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-active-order-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="active-order-root">
      <div class="order-content">
        <div class="bike-loader">
          <span class="bike-icon">🛵</span>
        </div>
        <div class="order-text">
          <h3 class="order-title">Arriving in {{ order.eta || '10' }} mins</h3>
          <p class="order-sub">Order #{{ order._id?.substring(0, 8) }} is on the way</p>
        </div>
      </div>
      <a [routerLink]="['/tracking', order._id]" class="track-btn">Track</a>
    </div>
  `,
  styles: [`
    .active-order-root {
      background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.05) 0%, rgba(var(--primary-rgb), 0.02) 100%);
      border: 1px solid rgba(var(--primary-rgb), 0.15);
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.08);
    }

    .order-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .bike-loader {
      width: 48px;
      height: 48px;
      background: var(--primary-color);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: bouncePulse 2s infinite ease-in-out;
    }

    .bike-icon {
      font-size: 24px;
      animation: moveBike 2s infinite;
    }

    @keyframes bouncePulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.4); }
      50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(var(--primary-rgb), 0); }
    }

    @keyframes moveBike {
      0% { transform: translateX(-4px) rotate(-5deg); }
      50% { transform: translateX(4px) rotate(5deg); }
      100% { transform: translateX(-4px) rotate(-5deg); }
    }

    .order-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.1rem;
      font-weight: 800;
      color: #111418;
      margin-bottom: 4px;
    }

    .order-sub {
      font-size: 0.85rem;
      color: #657786;
    }

    .track-btn {
      background: var(--primary-color);
      color: #ffffff;
      padding: 8px 20px;
      border-radius: 20px;
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 0.9rem;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .track-btn:hover {
      background: var(--primary-color);
      filter: brightness(1.1);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.25);
    }
  `]
})
export class ActiveOrderCardComponent {
  @Input() order: any;
}
