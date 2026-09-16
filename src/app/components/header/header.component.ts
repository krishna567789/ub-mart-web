import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { SearchService } from '../../core/services/search.service';
import { LocationService } from '../../core/services/location.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="header-root">
      <!-- Top Announcement Strip -->
      <div class="top-announcement">
        <div class="container announcement-inner">
          <div class="announcement-left">
            <span class="pulse-dot"></span>
            <span>⚡ <strong>10 MIN EXPRESS DELIVERY</strong> ON ALL DAILY ESSENTIALS</span>
          </div>
          <div class="announcement-right">
            <span>🛵 Lucknow Darkstore Active</span>
            <span class="sep">•</span>
            <span>Free Delivery on orders above ₹199</span>
          </div>
        </div>
      </div>

      <!-- Main Navigation Bar -->
      <div class="nav-bar">
        <div class="container nav-inner">
          <!-- Logo & Branding -->
          <div class="nav-left">
            <a routerLink="/" class="logo-link">
              <div class="logo-icon-box">
                <span class="logo-lightning">⚡</span>
              </div>
              <div class="logo-text-group">
                <span class="logo-brand">UB <span class="logo-highlight">MART</span></span>
                <span class="logo-tagline">10 MIN QUICK COMMERCE</span>
              </div>
            </a>

            <!-- Express Delivery Location Badge -->
            <div class="delivery-location" (click)="locationService.openModal()" title="Change Delivery Location">
              <div class="loc-pin">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div class="loc-text">
                <div class="loc-title">
                  <span class="loc-eta">{{ locationService.deliveryEta() }}</span>
                  <span class="loc-arrow">▼</span>
                </div>
                <div class="loc-address">{{ locationService.activeLocationName() }}</div>
              </div>
            </div>
          </div>

          <!-- Central Search Bar Input -->
          <div class="nav-center">
            <div class="search-bar-trigger" (click)="openSearch()">
              <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span class="search-placeholder">Search "milk, bread, potato, amul butter..."</span>
              <kbd class="search-kbd">/</kbd>
            </div>
          </div>

          <!-- Right Action Buttons -->
          <div class="nav-right">
            <!-- Account / Track Order -->
            <a routerLink="/tracking" class="nav-btn track-btn" title="Live Order Tracking">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Track Order</span>
            </a>

            <!-- Animated Cart Trigger Button -->
            <button class="cart-trigger-btn" (click)="toggleCart()" [class.has-items]="cartService.totalCount() > 0">
              <div class="cart-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                @if (cartService.totalCount() > 0) {
                  <span class="cart-badge">{{ cartService.totalCount() }}</span>
                }
              </div>

              <div class="cart-label-wrap">
                @if (cartService.totalCount() > 0) {
                  <span class="cart-count-sub">{{ cartService.totalCount() }} items</span>
                  <span class="cart-total-price">₹{{ cartService.itemTotal() }}</span>
                } @else {
                  <span class="cart-empty-text">My Cart</span>
                }
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  cartService = inject(CartService);
  searchService = inject(SearchService);
  locationService = inject(LocationService);

  openSearch(): void {
    this.searchService.openSearch();
  }

  toggleCart(): void {
    this.cartService.toggleDrawer();
  }
}
