import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { LocationService } from '../../core/services/location.service';
import { Product, ProductVariant, getProductImage, getVariantPackSize } from '../../core/models/product.model';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [],
  template: `
    @if (cartService.isDrawerOpen()) {
      <div class="drawer-overlay" (click)="closeDrawer()">
        <div class="drawer-panel" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="drawer-header">
            <div class="header-title-box">
              <h2 class="drawer-title">My Cart</h2>
              <span class="drawer-count">({{ cartService.totalCount() }} items)</span>
            </div>
            <button class="close-btn" (click)="closeDrawer()" aria-label="Close Cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Free Delivery Progress Bar -->
          <div class="free-delivery-strip" [class.unlocked]="cartService.freeDeliveryShortfall() === 0">
            <div class="progress-info">
              @if (cartService.freeDeliveryShortfall() > 0) {
                <span>Add <strong>₹{{ cartService.freeDeliveryShortfall() }}</strong> more for <strong>FREE Delivery!</strong> 🛵</span>
              } @else {
                <span>🎉 <strong>Congratulations!</strong> Free Delivery unlocked!</span>
              }
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" [style.width.%]="cartService.freeDeliveryPercentage()"></div>
            </div>
          </div>

          <!-- Items List / Empty State -->
          <div class="drawer-content">
            @if (cartService.items().length === 0) {
              <div class="empty-cart-state">
                <div class="empty-icon">🛒</div>
                <h3 class="empty-title">Your cart is empty</h3>
                <p class="empty-subtitle">Explore 1000+ items and get lightning 10-min delivery!</p>
                <button class="browse-btn" (click)="closeDrawer()">Start Shopping</button>
              </div>
            } @else {
              <div class="cart-items-list">
                @for (item of cartService.items(); track item.product._id + getItemPackSize(item.variant)) {
                  <div class="cart-item-row">
                    <img
                      [src]="getItemImage(item.product)"
                      [alt]="item.product.name"
                      class="item-thumb"
                    />
                    <div class="item-info">
                      <div class="item-name">{{ item.product.name }}</div>
                      <div class="item-pack">{{ getItemPackSize(item.variant) }}</div>
                      <div class="item-price">₹{{ item.variant.price * item.quantity }}</div>
                    </div>

                    <div class="item-stepper">
                      <button class="item-step-btn" (click)="decreaseQty(item.product._id, getItemPackSize(item.variant))">-</button>
                      <span class="item-step-qty">{{ item.quantity }}</span>
                      <button class="item-step-btn" (click)="increaseQty(item.product._id, getItemPackSize(item.variant))">+</button>
                    </div>
                  </div>
                }
              </div>

              <!-- Delivery Tip Section -->
              <div class="tip-section">
                <div class="tip-title">
                  <span>Delivery Partner Tip</span>
                  <span class="tip-sub">100% goes to your rider</span>
                </div>
                <div class="tip-options">
                  @for (t of [10, 20, 30, 50]; track t) {
                    <button
                      class="tip-chip"
                      [class.active]="cartService.tip() === t"
                      (click)="cartService.setTip(t)"
                    >
                      ₹{{ t }}
                    </button>
                  }
                </div>
              </div>

              <!-- Coupon Code Box -->
              <div class="coupon-section">
                <div class="coupon-input-box">
                  <input
                    type="text"
                    #couponInput
                    placeholder="Enter Coupon (e.g. SAVE10)"
                    class="coupon-input"
                  />
                  <button class="coupon-apply-btn" (click)="applyCoupon(couponInput.value)">APPLY</button>
                </div>
                @if (couponMessage()) {
                  <div class="coupon-msg" [class.success]="couponSuccess()">{{ couponMessage() }}</div>
                }
              </div>

              <!-- Bill Breakdown Summary -->
              <div class="bill-card">
                <div class="bill-title">Bill Details</div>
                <div class="bill-row">
                  <span>Items Total</span>
                  <span>₹{{ cartService.itemTotal() }}</span>
                </div>
                <div class="bill-row">
                  <span>Delivery Partner Fee</span>
                  <span>
                    @if (cartService.deliveryFee() === 0) {
                      <span class="free-pill">FREE</span>
                    } @else {
                      ₹{{ cartService.deliveryFee() }}
                    }
                  </span>
                </div>
                <div class="bill-row">
                  <span>Handling Charge</span>
                  <span>₹{{ cartService.handlingFee() }}</span>
                </div>
                @if (cartService.tip() > 0) {
                  <div class="bill-row">
                    <span>Delivery Tip</span>
                    <span>₹{{ cartService.tip() }}</span>
                  </div>
                }
                @if (cartService.couponDiscount() > 0) {
                  <div class="bill-row discount">
                    <span>Coupon Discount</span>
                    <span>-₹{{ cartService.couponDiscount() }}</span>
                  </div>
                }
                <div class="bill-divider"></div>
                <div class="bill-row grand-total">
                  <span>To Pay</span>
                  <span>₹{{ cartService.grandTotal() }}</span>
                </div>
              </div>
            }
          </div>

          <!-- Checkout Action Footer -->
          @if (cartService.totalCount() > 0) {
            <div class="drawer-footer">
              <button class="checkout-btn" (click)="openCheckoutModal()">
                <div class="checkout-left">
                  <span class="checkout-grand">₹{{ cartService.grandTotal() }}</span>
                  <span class="checkout-label">TOTAL AMOUNT</span>
                </div>
                <div class="checkout-right">
                  <span>Proceed to Pay</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </button>
            </div>
          }
        </div>
      </div>
    }

    <!-- Interactive Checkout Modal -->
    @if (isCheckoutModalOpen()) {
      <div class="checkout-modal-overlay" (click)="closeCheckoutModal()">
        <div class="checkout-modal-dialog" (click)="$event.stopPropagation()">
          <div class="c-modal-header">
            <div>
              <h3 class="c-modal-title">Confirm Delivery & Pay</h3>
              <p class="c-modal-sub">⚡ Guaranteed 10-Minute Express Delivery</p>
            </div>
            <button class="c-modal-close" (click)="closeCheckoutModal()">✕</button>
          </div>

          <div class="c-modal-body">
            <!-- Delivery Address Preview -->
            <div class="c-address-card">
              <div class="c-addr-icon">📍</div>
              <div class="c-addr-info">
                <span class="c-addr-type">Delivering To Home</span>
                <span class="c-addr-line">{{ locationService.activeLocationName() }}</span>
                <span class="c-addr-eta">🛵 Arriving in 10-12 mins</span>
              </div>
            </div>

            <!-- Payment Method Selection -->
            <div class="c-payment-section">
              <h4 class="c-section-title">Select Payment Method</h4>
              <div class="c-pay-options">
                <label class="c-pay-option" [class.active]="selectedPayment() === 'upi'">
                  <input type="radio" name="payMethod" value="upi" [checked]="selectedPayment() === 'upi'" (change)="selectedPayment.set('upi')" />
                  <span class="c-pay-icon">⚡</span>
                  <div class="c-pay-text">
                    <strong>UPI (Google Pay, PhonePe, Paytm)</strong>
                    <small>Fastest & recommended for 10-min delivery</small>
                  </div>
                </label>

                <label class="c-pay-option" [class.active]="selectedPayment() === 'card'">
                  <input type="radio" name="payMethod" value="card" [checked]="selectedPayment() === 'card'" (change)="selectedPayment.set('card')" />
                  <span class="c-pay-icon">💳</span>
                  <div class="c-pay-text">
                    <strong>Credit / Debit Card</strong>
                    <small>Visa, Mastercard, RuPay & Amex</small>
                  </div>
                </label>

                <label class="c-pay-option" [class.active]="selectedPayment() === 'cod'">
                  <input type="radio" name="payMethod" value="cod" [checked]="selectedPayment() === 'cod'" (change)="selectedPayment.set('cod')" />
                  <span class="c-pay-icon">💵</span>
                  <div class="c-pay-text">
                    <strong>Cash on Delivery (COD)</strong>
                    <small>Pay cash or UPI to rider at doorstep</small>
                  </div>
                </label>
              </div>
            </div>

            <!-- Total Summary Strip -->
            <div class="c-summary-strip">
              <span>Total Payable Amount:</span>
              <span class="c-summary-amount">₹{{ cartService.grandTotal() }}</span>
            </div>
          </div>

          <!-- Place Order Button -->
          <div class="c-modal-footer">
            <button class="c-place-order-btn" [disabled]="isPlacingOrder()" (click)="confirmAndPlaceOrder()">
              @if (isPlacingOrder()) {
                <span class="c-spinner"></span>
                <span>Connecting to Rider Hub...</span>
              } @else {
                <span>Place Express Order (₹{{ cartService.grandTotal() }})</span>
                <span class="c-arrow">→</span>
              }
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styleUrls: ['./cart-drawer.component.css']
})
export class CartDrawerComponent {
  cartService = inject(CartService);
  toastService = inject(ToastService);
  locationService = inject(LocationService);
  private router = inject(Router);

  couponMessage = signal<string>('');
  couponSuccess = signal<boolean>(false);
  isCheckoutModalOpen = signal<boolean>(false);
  isPlacingOrder = signal<boolean>(false);
  selectedPayment = signal<string>('upi');

  closeDrawer(): void {
    this.cartService.toggleDrawer(false);
  }

  getItemImage(product: Product): string {
    return getProductImage(product);
  }

  getItemPackSize(variant: ProductVariant): string {
    return getVariantPackSize(variant);
  }

  increaseQty(productId: string, packSize: string): void {
    this.cartService.updateQuantity(productId, packSize, 1);
  }

  decreaseQty(productId: string, packSize: string): void {
    this.cartService.updateQuantity(productId, packSize, -1);
  }

  applyCoupon(code: string): void {
    const res = this.cartService.applyCoupon(code);
    this.couponSuccess.set(res.success);
    this.couponMessage.set(res.message);
  }

  openCheckoutModal(): void {
    this.isCheckoutModalOpen.set(true);
  }

  closeCheckoutModal(): void {
    this.isCheckoutModalOpen.set(false);
  }

  confirmAndPlaceOrder(): void {
    this.isPlacingOrder.set(true);

    setTimeout(() => {
      this.isPlacingOrder.set(false);
      this.isCheckoutModalOpen.set(false);
      this.cartService.toggleDrawer(false);
      this.cartService.clearCart();

      this.toastService.show('🎉 Order Placed! Rider Rahul Kumar assigned.', 'success', '🚀');
      this.router.navigate(['/tracking']);
    }, 1200);
  }
}
