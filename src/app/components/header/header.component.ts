import { Component, inject, effect, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { SearchService } from '../../core/services/search.service';
import { LocationService } from '../../core/services/location.service';
import { ThemeService } from '../../core/services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <header class="header-root">
      <!-- Top Announcement Strip -->
      <div class="top-announcement">
        <div class="announcement-inner">
          <div class="announcement-left">
            <span class="pulse-dot"></span>
            <span>{{ getTimeBasedMessage() }}</span>
          </div>
          <div class="announcement-right">
            <span>🛵 Lucknow Darkstore Active</span>
            <span class="sep">•</span>
            <span>Free Delivery on orders above ₹{{ (themeService.settings$ | async)?.freeDeliveryThreshold || 199 }}</span>
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
                <span class="logo-brand">{{ (themeService.settings$ | async)?.storeName || 'UB' }} <span class="logo-highlight">MART</span></span>
                <span class="logo-tagline">{{ (themeService.settings$ | async)?.tagline || '10 MIN QUICK COMMERCE' }}</span>
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
              <span class="search-placeholder">
                {{ searchService.isListening() ? 'Listening... Speak now' : 'Search "milk, bread, amul..."' }}
              </span>
              <kbd class="search-kbd">/</kbd>
              
              <button class="mic-btn" [class.listening]="searchService.isListening()" (click)="startVoice($event)" title="Voice Search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                   <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                   <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                   <line x1="12" y1="19" x2="12" y2="23"></line>
                   <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
              </button>
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
            <button class="cart-trigger-btn" (click)="toggleCart()" [class.has-items]="cartService.totalCount() > 0" [class.bounce-active]="isBouncing()">
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
  themeService = inject(ThemeService);

  isBouncing = signal(false);

  constructor() {
    effect(() => {
      const count = this.cartService.totalCount();
      if (count > 0) {
        this.isBouncing.set(false);
        setTimeout(() => this.isBouncing.set(true), 10);
      }
    }, { allowSignalWrites: true });
  }

  openSearch(): void {
    this.searchService.openSearch();
  }

  startVoice(event: Event): void {
    event.stopPropagation();
    this.searchService.startVoiceSearch();
  }

  toggleCart(): void {
    this.cartService.toggleDrawer();
  }

  getTimeBasedMessage(): string {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) {
      return "Good Morning! Get your daily milk & bread in 10 mins 🌅";
    } else if (hour >= 22 || hour < 4) {
      return "Midnight Cravings? We're delivering snacks till 2 AM 🌙";
    }
    return "10 MIN EXPRESS DELIVERY ON ALL DAILY ESSENTIALS";
  }
}
