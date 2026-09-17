import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';

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

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Banner } from '../../core/models/category.model';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero-section" (mouseenter)="pauseAutoPlay()" (mouseleave)="startAutoPlay()">
      <!-- Main Slider Viewport (Full Width) -->
      <div class="slider-viewport">
        @for (slide of slides(); track slide._id; let idx = $index) {
            <div
              class="slide-item"
              [class.active]="currentSlide() === idx"
              [class.prev]="currentSlide() > idx"
              [class.next]="currentSlide() < idx"
              [style.background-color]="slide.themeColor"
            >
              <div class="slide-image-wrap">
                <img [src]="slide.webImageUrl || slide.imageUrl" [alt]="slide.title" class="slide-image" />
                <div class="slide-gradient-overlay"></div>
              </div>

              <div class="container slide-content-container">
                <div class="slide-content">
                  @if (slide.bannerType) {
                    <div class="slide-badge">
                      <span class="slide-badge-dot"></span>
                      <span>{{ slide.bannerType }}</span>
                    </div>
                  }
                  <h1 class="slide-title">{{ slide.title }}</h1>
                  @if (slide.subtitle) {
                    <p class="slide-subtitle">{{ slide.subtitle }}</p>
                  }
                  <div class="slide-actions">
                    <a [routerLink]="slide.link || '/categories'" class="slide-cta-btn">
                      <span>{{ slide.buttonText || 'Shop Now' }}</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </a>
                  </div>
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
            @for (slide of slides(); track slide._id; let idx = $index) {
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

      <div class="container hero-container">
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
  private apiService = inject(ApiService);
  slides = signal<Banner[]>([]);
  currentSlide = signal<number>(0);
  private timer: any;

  ngOnInit(): void {
    this.apiService.getBanners().subscribe((banners: Banner[]) => {
      const heroBanners = banners.filter((b: Banner) => b.bannerType === 'HERO' || !b.bannerType);
      if (heroBanners.length > 0) {
        this.slides.set(heroBanners);
        this.startAutoPlay();
      }
    });
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
    if (this.slides().length === 0) return;
    this.currentSlide.update(curr => (curr + 1) % this.slides().length);
  }

  prevSlide(): void {
    if (this.slides().length === 0) return;
    this.currentSlide.update(curr => (curr - 1 + this.slides().length) % this.slides().length);
  }

  goToSlide(idx: number): void {
    this.currentSlide.set(idx);
    this.startAutoPlay();
  }
}
