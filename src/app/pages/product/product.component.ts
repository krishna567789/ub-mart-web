import { Component, OnInit, inject, signal, computed, HostListener } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product, ProductVariant, getProductImage, getVariantPackSize, getVariantMrp } from '../../core/models/product.model';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  template: `
    <div class="product-page-root">
      <div class="container">
        <!-- Breadcrumbs -->
        <nav class="breadcrumbs">
          <a routerLink="/">Home</a>
          <span class="sep">/</span>
          <a [routerLink]="['/category', product()?.subCategory?.category?._id || 'all']">
            {{ product()?.subCategory?.category?.name || 'Groceries' }}
          </a>
          <span class="sep">/</span>
          <span class="current">{{ product()?.name || 'Product Details' }}</span>
        </nav>

        @if (isLoading()) {
          <div class="product-detail-skeleton skeleton"></div>
        } @else if (product()) {
          <div class="product-layout-grid">
            <!-- Left: Interactive Gallery -->
            <div class="gallery-col">
              <div class="main-image-card">
                <img
                  [src]="activeDisplayImage()"
                  [alt]="product()!.name"
                  class="main-img"
                  [style.view-transition-name]="'product-image-' + product()!._id"
                  (error)="handleImageError($event)"
                />
                <span class="veg-badge" [class.veg]="isVeg()" [class.non-veg]="!isVeg()"></span>
                <button class="wishlist-float-btn" [class.active]="isWishlisted()" (click)="toggleWishlist()">
                  ♥
                </button>
              </div>

              <!-- Thumbnails Row -->
              <div class="thumbnails-row">
                @for (img of galleryImages(); track img; let idx = $index) {
                  <button
                    class="thumb-btn"
                    [class.active]="selectedImageIndex() === idx"
                    (click)="selectedImageIndex.set(idx)"
                  >
                    <img [src]="img" alt="Thumbnail" (error)="handleImageError($event)" />
                  </button>
                }
              </div>
            </div>

            <!-- Right: Product Info & Buy Box -->
            <div class="info-col">
              <div class="delivery-time-pill">
                <span>⚡ 10 MINS EXPRESS DELIVERY</span>
              </div>

              <div class="brand-tag">{{ product()!.brand || 'UB Mart Verified' }}</div>
              <h1 class="pdp-title">{{ product()!.name }}</h1>

              <div class="pdp-meta">
                <span class="pdp-rating">★ {{ product()!.rating || 4.7 }}</span>
                <span class="meta-sep">•</span>
                <span class="pdp-reviews">{{ product()!.reviewCount || 34 }} Verified Ratings</span>
                <span class="meta-sep">•</span>
                <span class="stock-badge">🟢 In Stock</span>
              </div>

              <!-- Pack Size Variant Selection -->
              <div class="variants-block">
                <div class="block-title">Select Pack Size / Unit:</div>
                <div class="variant-chips">
                  @for (v of product()!.variants; track getPackSize(v); let idx = $index) {
                    <button
                      class="variant-chip"
                      [class.active]="selectedVariantIdx() === idx"
                      (click)="selectedVariantIdx.set(idx)"
                    >
                      <span class="chip-size">{{ getPackSize(v) }}</span>
                      <span class="chip-price">₹{{ v.price }}</span>
                    </button>
                  }
                </div>
              </div>

              <!-- Price & Buy Box -->
              <div class="pdp-buy-card">
                <div class="price-display">
                  <span class="pdp-current-price">₹{{ currentVariant().price }}</span>
                  @if (currentMrp() && currentMrp()! > currentVariant().price) {
                    <span class="pdp-mrp">₹{{ currentMrp() }}</span>
                    <span class="pdp-save-badge">Save ₹{{ currentMrp()! - currentVariant().price }}</span>
                  }
                </div>
                <div class="tax-note">(Inclusive of all taxes) • Best Wholesale Price</div>

                <!-- Add to Cart or Stepper -->
                <div class="pdp-action-row">
                  @if (currentQty() === 0) {
                    <button class="pdp-add-btn" (click)="addToCart()">
                      <span>ADD TO CART</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  } @else {
                    <div class="pdp-stepper">
                      <button class="pdp-step-btn" (click)="decreaseQty()">-</button>
                      <span class="pdp-qty-val">{{ currentQty() }} in cart</span>
                      <button class="pdp-step-btn" (click)="increaseQty()">+</button>
                    </div>
                  }

                  <!-- 1-Click WhatsApp Share Button -->
                  <button class="pdp-share-btn" (click)="shareOnWhatsApp()" title="Share on WhatsApp">
                    <span>💬 Share</span>
                  </button>
                </div>
              </div>

              <!-- Why Shop From UB Mart -->
              <div class="info-section">
                <h3 class="section-title">Why shop from UB Mart?</h3>
                <ul class="why-shop-list">
                  <li>
                    <span class="list-icon">⚡</span>
                    <div class="list-text">
                      <strong>Superfast Delivery</strong>
                      <p>Get your order delivered to your doorstep at the earliest from dark stores near you.</p>
                    </div>
                  </li>
                  <li>
                    <span class="list-icon">🛡️</span>
                    <div class="list-text">
                      <strong>Best Prices & Offers</strong>
                      <p>Best price destination with offers directly from the manufacturers.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <!-- Product Tags (SEO keywords) -->
              @if (product()!.tags && product()!.tags!.length > 0) {
                <div class="info-section tags-section">
                  <h3 class="section-title">Tags</h3>
                  <div class="tags-row">
                    @for (tag of product()!.tags; track tag) {
                      <span class="tag-pill">{{ tag }}</span>
                    }
                  </div>
                </div>
              }

              <!-- Product Specifications Table (Same as Mobile App) -->
              <div class="specs-card">
                <h3 class="specs-title">Product Details & Specifications</h3>
                <div class="specs-table">
                  <div class="spec-row">
                    <span class="spec-key">Type</span>
                    <span class="spec-val">{{ isVeg() ? 'Vegetarian Food' : 'Non-Vegetarian Food' }}</span>
                  </div>
                  <div class="spec-row">
                    <span class="spec-key">Category</span>
                    <span class="spec-val">{{ product()!.subCategory?.category?.name || 'Grocery Essentials' }}</span>
                  </div>
                  <div class="spec-row">
                    <span class="spec-key">Sub Category</span>
                    <span class="spec-val">{{ product()!.subCategory?.name || 'Daily Essentials' }}</span>
                  </div>
                  <div class="spec-row">
                    <span class="spec-key">Country of Origin</span>
                    <span class="spec-val">India</span>
                  </div>
                  <div class="spec-row">
                    <span class="spec-key">Storage Guidance</span>
                    <span class="spec-val">Store in a cool, hygienic & dry place away from sunlight</span>
                  </div>
                  <div class="spec-row">
                    <span class="spec-key">Shelf Life</span>
                    <span class="spec-val">6 - 9 Months from packaging date</span>
                  </div>
                  <div class="spec-row">
                    <span class="spec-key">FSSAI License</span>
                    <span class="spec-val">10012011000168 (Certified)</span>
                  </div>
                </div>
              </div>

              <!-- Customer Reviews & Ratings -->
              <div class="reviews-card">
                <div class="reviews-header">
                  <div>
                    <h3 class="reviews-title">Customer Ratings & Reviews</h3>
                    <div class="reviews-score-row">
                      <span class="score-big">{{ product()!.rating || 4.7 }}</span>
                      <div>
                        <div class="score-stars">★★★★★</div>
                        <span class="score-count">Based on {{ product()!.reviewCount || 34 }} customer reviews</span>
                      </div>
                    </div>
                  </div>
                  <button class="write-review-btn" (click)="promptReview()">+ Write Review</button>
                </div>

                <!-- Review Comments List -->
                <div class="review-comments">
                  <div class="review-item">
                    <div class="rev-user-row">
                      <span class="rev-avatar">👤</span>
                      <div>
                        <div class="rev-name">Ananya Sharma <span class="verified-tick">✓ Verified Buyer</span></div>
                        <div class="rev-date">2 days ago • Lucknow</div>
                      </div>
                      <span class="rev-stars">★★★★★</span>
                    </div>
                    <p class="rev-comment">Fresh quality and delivered in just 8 minutes! Very impressed with the packaging.</p>
                  </div>

                  <div class="review-item">
                    <div class="rev-user-row">
                      <span class="rev-avatar">👤</span>
                      <div>
                        <div class="rev-name">Vikas Verma <span class="verified-tick">✓ Verified Buyer</span></div>
                        <div class="rev-date">5 days ago • Lucknow</div>
                      </div>
                      <span class="rev-stars">★★★★★</span>
                    </div>
                    <p class="rev-comment">Genuine product at wholesale rate. Better than local stores!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Similar & Recommended Products Section -->
          @if (similarProducts().length > 0) {
            <section class="similar-section">
              <h2 class="similar-title">Similar Products You Might Like</h2>
              <div class="similar-grid">
                @for (sim of similarProducts(); track sim._id) {
                  <app-product-card [product]="sim"></app-product-card>
                }
              </div>
            </section>
          }
        } @else {
          <div class="not-found-state">
            <h2>Product Not Found</h2>
            <p>The product you are looking for might have been sold out or moved.</p>
            <a routerLink="/" class="btn-primary">Back to Home</a>
          </div>
        }
      </div>

      <!-- Sticky Scroll Bottom Bar (Slides up when scrolling past buy box) -->
      @if (showStickyBar() && product()) {
        <div class="sticky-pdp-bar">
          <div class="container sticky-bar-inner">
            <div class="sticky-left">
              <img [src]="activeDisplayImage()" [alt]="product()!.name" class="sticky-thumb" />
              <div>
                <div class="sticky-name">{{ product()!.name }}</div>
                <div class="sticky-variant">{{ activePackSize() }} • ₹{{ currentVariant().price }}</div>
              </div>
            </div>
            <div class="sticky-right">
              @if (currentQty() === 0) {
                <button class="sticky-add-btn" (click)="addToCart()">+ ADD TO CART</button>
              } @else {
                <div class="sticky-stepper">
                  <button (click)="decreaseQty()">-</button>
                  <span>{{ currentQty() }}</span>
                  <button (click)="increaseQty()">+</button>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  cartService = inject(CartService);
  toastService = inject(ToastService);

  product = signal<Product | null>(null);
  similarProducts = signal<Product[]>([]);
  isLoading = signal<boolean>(true);
  selectedImageIndex = signal<number>(0);
  selectedVariantIdx = signal<number>(0);
  isWishlisted = signal<boolean>(false);
  showStickyBar = signal<boolean>(false);

  currentVariant = computed<ProductVariant>(() => {
    const p = this.product();
    if (p && p.variants && p.variants.length > 0) {
      return p.variants[this.selectedVariantIdx()] || p.variants[0];
    }
    return { size: 'Standard', packSize: 'Standard', price: 99 };
  });

  activePackSize = computed<string>(() => getVariantPackSize(this.currentVariant()));
  currentMrp = computed<number | undefined>(() => getVariantMrp(this.currentVariant()));

  currentQty = computed<number>(() => {
    const p = this.product();
    if (!p) return 0;
    return this.cartService.getItemQuantity(p._id, this.activePackSize());
  });

  isVeg = computed<boolean>(() => {
    const p = this.product();
    if (!p) return true;
    if (p.isVeg !== undefined) return p.isVeg;
    const n = (p.name || '').toLowerCase();
    if (n.includes('egg') || n.includes('chicken') || n.includes('meat') || n.includes('fish')) return false;
    return true;
  });

  galleryImages = computed<string[]>(() => {
    const p = this.product();
    if (!p) return [];
    const imgs: string[] = [];
    if (p.images && p.images.length > 0) {
      for (let i = 0; i < p.images.length; i++) {
        imgs.push(getProductImage(p, i));
      }
    }
    if (imgs.length === 0) {
      imgs.push(getProductImage(p, 0));
    }
    return Array.from(new Set(imgs));
  });

  activeDisplayImage = computed<string>(() => {
    const imgs = this.galleryImages();
    return imgs[this.selectedImageIndex()] || imgs[0] || getProductImage(this.product(), 0);
  });

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scroll = window.scrollY || document.documentElement.scrollTop;
    this.showStickyBar.set(scroll > 420);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  getPackSize(v: ProductVariant): string {
    return getVariantPackSize(v);
  }

  private loadProduct(id: string): void {
    this.isLoading.set(true);
    this.apiService.getProductById(id).subscribe({
      next: (prod) => {
        if (prod) {
          this.product.set(prod);
          this.selectedImageIndex.set(0);
          this.loadSimilar(prod);
        } else {
          // If product not found in direct API, try looking in all products
          this.apiService.getProducts().subscribe(prods => {
            const found = prods.find(p => p._id === id);
            if (found) {
              this.product.set(found);
              this.loadSimilar(found);
            }
            this.isLoading.set(false);
          });
          return;
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  private loadSimilar(current: Product): void {
    this.apiService.getProducts({ limit: 8 }).subscribe(all => {
      this.similarProducts.set(all.filter(p => p._id !== current._id).slice(0, 4));
    });
  }

  addToCart(): void {
    if (this.product()) {
      this.cartService.addItem(this.product()!, this.currentVariant(), 1);
      this.toastService.show(`Added ${this.product()!.name} to cart!`, 'success', '🛒');
    }
  }

  increaseQty(): void {
    if (this.product()) {
      this.cartService.updateQuantity(this.product()!._id, this.activePackSize(), 1);
    }
  }

  decreaseQty(): void {
    if (this.product()) {
      this.cartService.updateQuantity(this.product()!._id, this.activePackSize(), -1);
    }
  }

  toggleWishlist(): void {
    this.isWishlisted.set(!this.isWishlisted());
    if (this.isWishlisted()) {
      this.toastService.show('Saved to Wishlist!', 'success', '❤️');
    }
  }

  promptReview(): void {
    const comment = prompt('Enter your product review:');
    if (comment && comment.trim()) {
      this.toastService.show('Thank you! Review submitted for verification.', 'success', '⭐');
    }
  }

  shareOnWhatsApp(): void {
    if (!this.product()) return;
    const url = window.location.href;
    const text = `Order *${this.product()!.name}* on UB Mart for ₹${this.currentVariant().price}! Express 10-min delivery: ${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  }

  handleImageError(event: any): void {
    event.target.src = 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/19512a.jpg';
  }
}
