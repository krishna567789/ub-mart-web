import { Component, OnInit, OnDestroy, signal } from '@angular/core';

interface Slide {
  id: string;
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  tag: string;
  ctaText: string;
  link: string;
}

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  template: `
    <section class="hero-section" (mouseenter)="pauseAutoPlay()" (mouseleave)="startAutoPlay()">
      <div class="container hero-container">
        <!-- Main Slider Viewport -->
        <div class="slider-viewport">
          @for (slide of slides; track slide.id; let idx = $index) {
            <div
              class="slide-item"
              [class.active]="currentSlide() === idx"
              [class.prev]="currentSlide() > idx"
              [class.next]="currentSlide() < idx"
            >
              <div class="slide-image-wrap">
                <img [src]="slide.image" [alt]="slide.title" class="slide-image" />
                <div class="slide-gradient-overlay"></div>
              </div>

              <div class="slide-content">
                <div class="slide-badge">
                  <span class="slide-badge-dot"></span>
                  <span>{{ slide.badge }}</span>
                </div>
                <h1 class="slide-title">{{ slide.title }}</h1>
                <p class="slide-subtitle">{{ slide.subtitle }}</p>
                <div class="slide-actions">
                  <button class="slide-cta-btn">
                    <span>{{ slide.ctaText }}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                  <span class="slide-promo-tag">{{ slide.tag }}</span>
                </div>
              </div>
            </div>
          }

          <!-- Slider Controls: Prev / Next -->
          <button class="slider-arrow prev-arrow" (click)="prevSlide()" aria-label="Previous Slide">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button class="slider-arrow next-arrow" (click)="nextSlide()" aria-label="Next Slide">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          <!-- Slide Dots Indicator -->
          <div class="slider-dots">
            @for (slide of slides; track slide.id; let idx = $index) {
              <button
                class="dot-btn"
                [class.active]="currentSlide() === idx"
                (click)="goToSlide(idx)"
                [attr.aria-label]="'Go to slide ' + (idx + 1)"
              >
                <span class="dot-progress"></span>
              </button>
            }
          </div>
        </div>

        <!-- Floating Trust Highlights Strip -->
        <div class="trust-highlights">
          <div class="trust-card">
            <div class="trust-icon-box express">⚡</div>
            <div class="trust-info">
              <div class="trust-title">10-Minute Delivery</div>
              <div class="trust-desc">From our dark store to your door</div>
            </div>
          </div>
          <div class="trust-card">
            <div class="trust-icon-box organic">🌱</div>
            <div class="trust-info">
              <div class="trust-title">100% Farm Fresh</div>
              <div class="trust-desc">Handpicked daily harvest fruits & veggies</div>
            </div>
          </div>
          <div class="trust-card">
            <div class="trust-icon-box price">🏷️</div>
            <div class="trust-info">
              <div class="trust-title">Best Wholesale Prices</div>
              <div class="trust-desc">Direct farm sourcing with no middlemen</div>
            </div>
          </div>
          <div class="trust-card">
            <div class="trust-icon-box guarantee">🛡️</div>
            <div class="trust-info">
              <div class="trust-title">Zero Question Return</div>
              <div class="trust-desc">Instant doorstep refund guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./hero-banner.component.css']
})
export class HeroBannerComponent implements OnInit, OnDestroy {
  currentSlide = signal<number>(0);
  private timer: any;

  readonly slides: Slide[] = [
    {
      id: 'express-1',
      image: '/assets/banners/hero_express_delivery.jpg',
      badge: 'LIGHTNING FAST • 10 MINS',
      title: 'Groceries Delivered in 10 Minutes flat!',
      subtitle: 'From fresh vegetables to cold drinks, get everything at wholesale prices right now.',
      tag: '🛵 Express Riders Active',
      ctaText: 'Order Groceries Now',
      link: '/categories'
    },
    {
      id: 'fruits-2',
      image: '/assets/banners/hero_fresh_fruits.jpg',
      badge: 'FARM FRESH • SAVE UP TO 30%',
      title: 'Organic Farm Fresh Fruits & Crisp Greens',
      subtitle: 'Harvested at dawn, delivered to your kitchen before breakfast.',
      tag: '🍎 Direct Farm Produce',
      ctaText: 'Explore Fresh Produce',
      link: '/categories'
    },
    {
      id: 'dairy-3',
      image: '/assets/banners/hero_dairy_breakfast.jpg',
      badge: 'MORNING ESSENTIALS • BEST PRICE',
      title: 'Pure Dairy, Milk & Artisan Bakery',
      subtitle: 'Amul, Mother Dairy, artisan sourdough, butter & farm fresh eggs daily.',
      tag: '🥛 Pure & Fresh Guarantee',
      ctaText: 'Shop Breakfast Essentials',
      link: '/categories'
    }
  ];

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.pauseAutoPlay();
  }

  startAutoPlay(): void {
    this.pauseAutoPlay();
    this.timer = setInterval(() => {
      this.nextSlide();
    }, 4500);
  }

  pauseAutoPlay(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  nextSlide(): void {
    this.currentSlide.update(curr => (curr + 1) % this.slides.length);
  }

  prevSlide(): void {
    this.currentSlide.update(curr => (curr - 1 + this.slides.length) % this.slides.length);
  }

  goToSlide(idx: number): void {
    this.currentSlide.set(idx);
    this.startAutoPlay();
  }
}
