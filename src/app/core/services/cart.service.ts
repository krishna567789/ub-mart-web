import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { CartItem, CartSummary } from '../models/cart.model';
import { Product, ProductVariant, getVariantPackSize } from '../models/product.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiService = inject(ApiService);
  private readonly STORAGE_KEY = 'ub_mart_cart_v1';
  public readonly FREE_DELIVERY_THRESHOLD = 199;

  // Reactive State using Angular Signals
  readonly items = signal<CartItem[]>(this.loadInitialCart());
  readonly isDrawerOpen = signal<boolean>(false);
  readonly tip = signal<number>(0);
  readonly appliedCoupon = signal<string | null>(null);
  readonly couponDiscount = signal<number>(0);
  readonly isAnimating = signal<boolean>(false);

  // Computed Values
  readonly totalCount = computed(() =>
    this.items().reduce((acc, item) => acc + item.quantity, 0)
  );

  readonly itemTotal = computed(() =>
    this.items().reduce((acc, item) => acc + item.variant.price * item.quantity, 0)
  );

  readonly deliveryFee = computed(() => {
    if (this.totalCount() === 0) return 0;
    return this.itemTotal() >= this.FREE_DELIVERY_THRESHOLD ? 0 : 25;
  });

  readonly handlingFee = computed(() => (this.totalCount() > 0 ? 4 : 0));

  readonly freeDeliveryShortfall = computed(() => {
    const total = this.itemTotal();
    return total >= this.FREE_DELIVERY_THRESHOLD ? 0 : this.FREE_DELIVERY_THRESHOLD - total;
  });

  readonly freeDeliveryPercentage = computed(() => {
    const total = this.itemTotal();
    return Math.min(100, Math.round((total / this.FREE_DELIVERY_THRESHOLD) * 100));
  });

  readonly grandTotal = computed(() => {
    if (this.totalCount() === 0) return 0;
    const raw = this.itemTotal() + this.deliveryFee() + this.handlingFee() + this.tip() - this.couponDiscount();
    return Math.max(0, raw);
  });

  constructor() {
    // Auto-save to localStorage whenever items change
    effect(() => {
      const currentItems = this.items();
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentItems));
      } catch (e) {}

      // Debounced sync with backend cart recovery API
      this.syncWithBackend(currentItems);
    });
  }

  private loadInitialCart(): CartItem[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return [];
  }

  private syncTimeout: any;
  private syncWithBackend(items: CartItem[]) {
    clearTimeout(this.syncTimeout);
    if (items.length === 0) return; // Nothing to sync
    this.syncTimeout = setTimeout(() => {
      const payload = {
        userId: 'guest_web_' + (localStorage.getItem('ub_guest_id') || this.generateGuestId()),
        customerName: 'Web Guest User',
        phone: '9876543210',
        items: items.map(item => ({
          productId: item.product._id,
          productName: item.product.name,
          packSize: item.variant.packSize,
          price: item.variant.price,
          quantity: item.quantity,
          image: item.product.images?.[0] || ''
        })),
        itemTotal: this.itemTotal()
      };
      this.apiService.syncCart(payload).subscribe({ error: () => {} });
    }, 1200);
  }

  private generateGuestId(): string {
    const id = Math.random().toString(36).substring(2, 9);
    try {
      localStorage.setItem('ub_guest_id', id);
    } catch (e) {}
    return id;
  }

  // Cart Operations
  addItem(product: Product, variant?: ProductVariant, quantity: number = 1): void {
    const targetVariant = variant || product.variants?.[0] || { packSize: 'Standard', price: 100 };
    const current = [...this.items()];
    const index = current.findIndex(
      i => i.product._id === product._id && getVariantPackSize(i.variant) === getVariantPackSize(targetVariant)
    );

    if (index > -1) {
      current[index] = {
        ...current[index],
        quantity: current[index].quantity + quantity
      };
    } else {
      current.push({
        product,
        variant: targetVariant,
        quantity
      });
    }
    this.items.set(current);
    this.triggerAnimation();
  }

  private triggerAnimation(): void {
    this.isAnimating.set(true);
    setTimeout(() => this.isAnimating.set(false), 400);
  }

  updateQuantity(productId: string, packSize: string, delta: number): void {
    const current = [...this.items()];
    const index = current.findIndex(
      i => i.product._id === productId && getVariantPackSize(i.variant) === packSize
    );

    if (index > -1) {
      const newQty = current[index].quantity + delta;
      if (newQty <= 0) {
        current.splice(index, 1);
      } else {
        current[index] = {
          ...current[index],
          quantity: newQty
        };
      }
      this.items.set(current);
    }
  }

  removeItem(productId: string, packSize: string): void {
    const filtered = this.items().filter(
      i => !(i.product._id === productId && getVariantPackSize(i.variant) === packSize)
    );
    this.items.set(filtered);
  }

  getItemQuantity(productId: string, packSize?: string): number {
    const target = this.items().find(i => {
      if (packSize) {
        return i.product._id === productId && getVariantPackSize(i.variant) === packSize;
      }
      return i.product._id === productId;
    });
    return target ? target.quantity : 0;
  }

  toggleDrawer(open?: boolean): void {
    if (open !== undefined) {
      this.isDrawerOpen.set(open);
    } else {
      this.isDrawerOpen.set(!this.isDrawerOpen());
    }
  }

  setTip(amount: number): void {
    this.tip.set(this.tip() === amount ? 0 : amount);
  }

  applyCoupon(code: string): { success: boolean; message: string } {
    const upper = code.trim().toUpperCase();
    if (upper === 'SAVE10' || upper === 'UB10') {
      const discount = Math.round(this.itemTotal() * 0.1);
      this.appliedCoupon.set(upper);
      this.couponDiscount.set(discount);
      return { success: true, message: `Coupon ${upper} applied! Saved ₹${discount}` };
    }
    if (upper === 'FREESHIP') {
      this.appliedCoupon.set(upper);
      this.couponDiscount.set(this.deliveryFee());
      return { success: true, message: 'Free delivery applied!' };
    }
    return { success: false, message: 'Invalid or expired coupon code' };
  }

  removeCoupon(): void {
    this.appliedCoupon.set(null);
    this.couponDiscount.set(0);
  }

  clearCart(): void {
    this.items.set([]);
    this.tip.set(0);
    this.appliedCoupon.set(null);
    this.couponDiscount.set(0);
  }
}
