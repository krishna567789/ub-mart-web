import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroBannerComponent } from '../../components/hero-banner/hero-banner.component';
import { CategoryBarComponent } from '../../components/category-bar/category-bar.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ActiveOrderCardComponent } from '../../components/active-order-card/active-order-card.component';
import { ScrollRevealDirective } from '../../core/directives/scroll-reveal.directive';
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
    ProductCardComponent,
    ActiveOrderCardComponent,
    ScrollRevealDirective
  ],
  template: `
    <div class="home-page-root">
      <!-- 1. Hero Carousel Banner & Trust Highlights -->
      <app-hero-banner></app-hero-banner>

      <!-- 2. Explore Aisles & Categories -->
      <app-category-bar></app-category-bar>

      <!-- Active Order Dashboard Card -->
      @if (activeOrder()) {
        <div class="container" style="margin-top: 16px;">
          <app-active-order-card [order]="activeOrder()"></app-active-order-card>
        </div>
      }

      <!-- 3. Flash Deals Row with Live Countdown Timer -->
      <section class="section-row flash-deals-section" appScrollReveal>
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
              @for (n of [1,2,3,4,5,6]; track n) {
                <div class="product-skeleton-card skeleton"></div>
              }
            </div>
          } @else {
            <div class="products-grid">
              @for (prod of flashDeals(); track prod._id; let i = $index) {
                <app-product-card [product]="prod" class="stagger-enter" [style.animation-delay.ms]="i * 50"></app-product-card>
              }
            </div>
          }
        </div>
      </section>

      <!-- 4. Dynamic Live App Sections from MongoDB (/api/homepage) -->
      @for (sec of dynamicSections(); track sec._id) {
        @if (getSectionProducts(sec).length > 0) {
          <section class="section-row dynamic-section" appScrollReveal>
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
                @for (prod of getSectionProducts(sec); track prod._id; let i = $index) {
                  <div class="scroll-card-item stagger-enter" [style.animation-delay.ms]="i * 50">
                    <app-product-card [product]="prod"></app-product-card>
                  </div>
                }
              </div>
            </div>
          </section>
        }
      }

      <!-- 5. Mid-Page Visual Promo Banner -->
      <section class="mid-promo-section" appScrollReveal>
        <div class="container">
          <div class="promo-banner-split">
            @for (promo of promoBanners(); track promo._id) {
              <div class="promo-card">
                <div class="promo-content">
                  <span class="promo-pill" [style.background-color]="promo.themeColor || 'var(--primary-color)'">✨ PROMO</span>
                  <h3>{{ promo.title }}</h3>
                  @if (promo.subtitle) {
                    <p>{{ promo.subtitle }}</p>
                  }
                  <a [routerLink]="promo.link || '/categories'" class="promo-btn">{{ promo.buttonText || 'Explore Now' }} →</a>
                </div>
                <img [src]="promo.webImageUrl || promo.imageUrl" [alt]="promo.title" class="promo-bg-img" />
              </div>
            }
          </div>
        </div>
      </section>

      <!-- 6. Trending Groceries & Bestsellers Grid -->
      <section class="section-row bestsellers-row" appScrollReveal>
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
              @for (n of [1,2,3,4,5,6,7,8,9,10,11,12]; track n) {
                <div class="product-skeleton-card skeleton"></div>
              }
            </div>
          } @else {
            <div class="products-grid">
              @for (prod of bestsellers(); track prod._id; let i = $index) {
                <app-product-card [product]="prod" class="stagger-enter" [style.animation-delay.ms]="i * 50"></app-product-card>
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
  promoBanners = signal<any[]>([]);
  isLoadingProducts = signal<boolean>(true);

  // Live Countdown Signals
  hours = signal<string>('02');
  minutes = signal<string>('45');
  seconds = signal<string>('18');

  activeOrder = signal<any>(null);
  private timerInterval: any;
  private orderPollInterval: any;

  ngOnInit(): void {
    this.startCountdown();
    this.loadData();
    this.pollActiveOrder();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.orderPollInterval) clearInterval(this.orderPollInterval);
  }

  private pollActiveOrder(): void {
    const fetchOrder = () => {
      // Mock or fetch active order, using 'active' as a placeholder ID
      this.apiService.getOrderById('active').subscribe({
        next: (order) => {
          if (order && order.status !== 'DELIVERED') {
            this.activeOrder.set(order);
          } else {
            this.activeOrder.set(null);
          }
        },
        error: () => this.activeOrder.set(null)
      });
    };
    
    fetchOrder();
    this.orderPollInterval = setInterval(fetchOrder, 30000); // 30s poll
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
          this.flashDeals.set(products.slice(0, 6));
          this.bestsellers.set(products.slice(6, 18));
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

    // 3. Load PROMO Banners
    this.apiService.getBanners().subscribe(banners => {
      this.promoBanners.set(banners.filter(b => b.bannerType === 'PROMO'));
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
