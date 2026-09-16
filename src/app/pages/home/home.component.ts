import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroBannerComponent } from '../../components/hero-banner/hero-banner.component';
import { CategoryBarComponent } from '../../components/category-bar/category-bar.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ApiService } from '../../core/services/api.service';
import { Product } from '../../core/models/product.model';
import { HomepageSection } from '../../core/models/category.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    HeroBannerComponent,
    CategoryBarComponent,
    ProductCardComponent
  ],
  template: `
    <div class="home-page-root">
      <!-- 1. Hero Carousel Banner & Trust Highlights -->
      <app-hero-banner></app-hero-banner>

      <!-- 2. Explore Aisles & Categories -->
      <app-category-bar></app-category-bar>

      <!-- 3. Flash Deals Row with Live Countdown Timer -->
      <section class="section-row flash-deals-section">
        <div class="container">
          <div class="deals-header-card">
            <div class="deals-header-left">
              <span class="flash-badge">⚡ FLASH DEALS • 10 MINS</span>
              <h2 class="deals-title">Super Savers & Daily Steals</h2>
              <p class="deals-sub">Lowest wholesale prices guaranteed on daily fresh essentials</p>
            </div>
            <div class="countdown-clock">
              <span class="clock-label">OFFERS END IN:</span>
              <div class="clock-digits">
                <span class="digit-box">{{ hours() }}<small>h</small></span>
                <span class="digit-sep">:</span>
                <span class="digit-box">{{ minutes() }}<small>m</small></span>
                <span class="digit-sep">:</span>
                <span class="digit-box">{{ seconds() }}<small>s</small></span>
              </div>
            </div>
          </div>

          <!-- Products Grid -->
          @if (isLoadingProducts()) {
            <div class="products-skeleton-grid">
              @for (n of [1,2,3,4]; track n) {
                <div class="product-skeleton-card skeleton"></div>
              }
            </div>
          } @else {
            <div class="products-grid">
              @for (prod of flashDeals(); track prod._id) {
                <app-product-card [product]="prod"></app-product-card>
              }
            </div>
          }
        </div>
      </section>

      <!-- 4. Dynamic Live App Sections from MongoDB (/api/homepage) -->
      @for (sec of dynamicSections(); track sec._id) {
        @if (getSectionProducts(sec).length > 0) {
          <section class="section-row dynamic-section">
            <div class="container">
              <div class="section-heading">
                <div>
                  <div class="section-tag-row">
                    <span class="pulse-dot-green"></span>
                    <span class="section-tag-text">FRESH DISPATCH HUB</span>
                  </div>
                  <h2 class="section-main-title">{{ sec.title || 'Curated Essentials' }}</h2>
                </div>
                <div class="scroll-controls">
                  <a routerLink="/categories" class="view-all-btn">View All →</a>
                </div>
              </div>

              <!-- Product Row Carousel -->
              <div class="horizontal-product-scroll">
                @for (prod of getSectionProducts(sec); track prod._id) {
                  <div class="scroll-card-item">
                    <app-product-card [product]="prod"></app-product-card>
                  </div>
                }
              </div>
            </div>
          </section>
        }
      }

      <!-- 5. Mid-Page Visual Promo Banner -->
      <section class="mid-promo-section">
        <div class="container">
          <div class="promo-banner-split">
            <div class="promo-card promo-fresh">
              <div class="promo-content">
                <span class="promo-pill">🌱 100% ORGANIC</span>
                <h3>Farm Direct Veggies & Fresh Fruits</h3>
                <p>Crisp spinach, vine tomatoes & sweet apples delivered at dawn.</p>
                <a routerLink="/categories" class="promo-btn">Explore Produce →</a>
              </div>
              <img src="/assets/banners/hero_fresh_fruits.jpg" alt="Organic Fresh Fruits" class="promo-bg-img" />
            </div>

            <div class="promo-card promo-dairy">
              <div class="promo-content">
                <span class="promo-pill gold">🥛 PURE & UNADULTERATED</span>
                <h3>Morning Milk, Sourdough Bread & Butter</h3>
                <p>Amul, Mother Dairy & fresh bakery loaves delivered in 10 mins.</p>
                <a routerLink="/categories" class="promo-btn">Shop Dairy →</a>
              </div>
              <img src="/assets/banners/hero_dairy_breakfast.jpg" alt="Breakfast & Dairy" class="promo-bg-img" />
            </div>
          </div>
        </div>
      </section>

      <!-- 6. Trending Groceries & Bestsellers Grid -->
      <section class="section-row bestsellers-row">
        <div class="container">
          <div class="section-heading">
            <div>
              <h2 class="section-main-title">Most Loved in Lucknow</h2>
              <p class="section-main-sub">The highest ordered products by your neighbours today</p>
            </div>
            <a routerLink="/categories" class="view-all-btn">View All Products →</a>
          </div>

          @if (isLoadingProducts()) {
            <div class="products-skeleton-grid">
              @for (n of [1,2,3,4,5,6,7,8]; track n) {
                <div class="product-skeleton-card skeleton"></div>
              }
            </div>
          } @else {
            <div class="products-grid">
              @for (prod of bestsellers(); track prod._id) {
                <app-product-card [product]="prod"></app-product-card>
              }
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private apiService = inject(ApiService);

  flashDeals = signal<Product[]>([]);
  bestsellers = signal<Product[]>([]);
  dynamicSections = signal<HomepageSection[]>([]);
  isLoadingProducts = signal<boolean>(true);

  // Live Countdown Signals
  hours = signal<string>('02');
  minutes = signal<string>('45');
  seconds = signal<string>('18');

  private timerInterval: any;

  ngOnInit(): void {
    this.startCountdown();
    this.loadData();
  }

  private startCountdown(): void {
    let remaining = 2 * 3600 + 45 * 60 + 18;
    this.timerInterval = setInterval(() => {
      remaining--;
      if (remaining <= 0) remaining = 3 * 3600;

      const h = Math.floor(remaining / 3600);
      const m = Math.floor((remaining % 3600) / 60);
      const s = remaining % 60;

      this.hours.set(h.toString().padStart(2, '0'));
      this.minutes.set(m.toString().padStart(2, '0'));
      this.seconds.set(s.toString().padStart(2, '0'));
    }, 1000);
  }

  private loadData(): void {
    // 1. Load Live Products from Backend
    this.apiService.getProducts({ limit: 40 }).subscribe({
      next: (products) => {
        if (products && products.length > 0) {
          this.flashDeals.set(products.slice(0, 4));
          this.bestsellers.set(products.slice(4, 16));
        }
        this.isLoadingProducts.set(false);
      },
      error: () => {
        this.isLoadingProducts.set(false);
      }
    });

    // 2. Load Homepage Sections from Backend (Same as Mobile App)
    this.apiService.getHomepageSections().subscribe({
      next: (sections) => {
        if (sections && sections.length > 0) {
          this.dynamicSections.set(
            sections.filter(s => s.type === 'PRODUCT_SCROLL' || s.type === 'BESTSELLER_GRID' || s.type === 'FLASH_SALE')
          );
        }
      }
    });
  }

  getSectionProducts(sec: HomepageSection): Product[] {
    if (sec.productIds && sec.productIds.length > 0) {
      return sec.productIds;
    }
    if (sec.bestsellerItems && sec.bestsellerItems.length > 0) {
      const prods: Product[] = [];
      for (const item of sec.bestsellerItems) {
        if (item.productIds && item.productIds.length > 0) {
          prods.push(...item.productIds);
        }
      }
      return prods;
    }
    return [];
  }
}
