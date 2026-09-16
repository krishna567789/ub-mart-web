import { Component, Input, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product, ProductVariant, getProductImage, getVariantPackSize, getVariantMrp } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="product-card-root">
      <!-- Top Badges Row -->
      <div class="card-badges">
        <div class="badge-left">
          <span [class]="isVeg() ? 'badge-veg' : 'badge-non-veg'" [title]="isVeg() ? 'Vegetarian' : 'Non-Vegetarian'"></span>
          @if (discountPercent() > 0) {
            <span class="badge-discount">{{ discountPercent() }}% OFF</span>
          }
        </div>
        <div class="badge-right-group">
          <button class="wishlist-btn" [class.active]="isWishlisted()" (click)="toggleWishlist($event)" title="Add to Wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" [attr.fill]="isWishlisted() ? '#ff3b30' : 'none'" [attr.stroke]="isWishlisted() ? '#ff3b30' : '#8899a6'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <span class="badge-delivery">⚡ 10 MINS</span>
        </div>
      </div>

      <!-- Product Image Thumbnail -->
      <a [routerLink]="['/product', product._id]" class="product-img-link">
        <div class="img-wrapper">
          <img
            [src]="productImage()"
            [alt]="product.name"
            class="product-img"
            loading="lazy"
            (error)="handleImageError($event)"
          />
        </div>
      </a>

      <!-- Pack Size Selector / Label -->
      <div class="variant-select-wrap">
        @if (product.variants && product.variants.length > 1) {
          <select class="variant-dropdown" (change)="onVariantChange($event)">
            @for (v of product.variants; track getPackSize(v); let idx = $index) {
              <option [value]="idx" [selected]="selectedVariantIndex() === idx">
                {{ getPackSize(v) }} - ₹{{ v.price }}
              </option>
            }
          </select>
        } @else {
          <span class="pack-size-label">{{ activePackSize() }}</span>
        }
      </div>

      <!-- Product Title -->
      <a [routerLink]="['/product', product._id]" class="product-title-link">
        <h3 class="product-title" [title]="product.name">{{ product.name }}</h3>
      </a>

      <!-- Bottom Price & Add Action Row -->
      <div class="card-bottom">
        <div class="price-stack">
          <span class="current-price">₹{{ activeVariant().price }}</span>
          @if (activeMrp() && activeMrp()! > activeVariant().price) {
            <span class="mrp-price">₹{{ activeMrp() }}</span>
          }
        </div>

        <div class="action-wrap">
          @if (currentQty() === 0) {
            <button class="add-btn" (click)="addToCart($event)">
              <span>ADD</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          } @else {
            <div class="stepper-wrap" (click)="$event.stopPropagation()">
              <button class="stepper-btn minus" (click)="decreaseQty($event)" aria-label="Decrease quantity">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <span class="stepper-qty">{{ currentQty() }}</span>
              <button class="stepper-btn plus" (click)="increaseQty($event)" aria-label="Increase quantity">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input({ required: true }) product!: Product;
  cartService = inject(CartService);
  toastService = inject(ToastService);

  selectedVariantIndex = signal<number>(0);
  isWishlisted = signal<boolean>(false);

  activeVariant = computed<ProductVariant>(() => {
    if (this.product?.variants && this.product.variants.length > 0) {
      return this.product.variants[this.selectedVariantIndex()] || this.product.variants[0];
    }
    return { size: 'Standard', packSize: 'Standard', price: 99 };
  });

  activePackSize = computed<string>(() => getVariantPackSize(this.activeVariant()));
  activeMrp = computed<number | undefined>(() => getVariantMrp(this.activeVariant()));

  currentQty = computed<number>(() => {
    return this.cartService.getItemQuantity(this.product._id, this.activePackSize());
  });

  discountPercent = computed<number>(() => {
    const v = this.activeVariant();
    const mrp = this.activeMrp();
    if (mrp && mrp > v.price) {
      return Math.round(((mrp - v.price) / mrp) * 100);
    }
    return this.product.discountPercentage || 0;
  });

  productImage = computed<string>(() => {
    return getProductImage(this.product, 0);
  });

  isVeg = computed<boolean>(() => {
    if (this.product.isVeg !== undefined) return this.product.isVeg;
    const n = (this.product.name || '').toLowerCase();
    if (n.includes('egg') || n.includes('chicken') || n.includes('meat') || n.includes('fish')) return false;
    return true;
  });

  ngOnInit(): void {}

  getPackSize(v: ProductVariant): string {
    return getVariantPackSize(v);
  }

  onVariantChange(event: any): void {
    this.selectedVariantIndex.set(Number(event.target.value));
  }

  addToCart(e: Event): void {
    e.stopPropagation();
    this.cartService.addItem(this.product, this.activeVariant(), 1);
    this.toastService.show(`Added ${this.product.name} to cart!`, 'success', '🛒');
  }

  increaseQty(e: Event): void {
    e.stopPropagation();
    this.cartService.updateQuantity(this.product._id, this.activePackSize(), 1);
  }

  decreaseQty(e: Event): void {
    e.stopPropagation();
    this.cartService.updateQuantity(this.product._id, this.activePackSize(), -1);
  }

  toggleWishlist(e: Event): void {
    e.stopPropagation();
    this.isWishlisted.set(!this.isWishlisted());
    if (this.isWishlisted()) {
      this.toastService.show(`Saved ${this.product.name} to Wishlist!`, 'success', '❤️');
    }
  }

  handleImageError(event: any): void {
    event.target.src = 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/19512a.jpg';
  }
}
