import { Product, ProductVariant } from './product.model';

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface CartSummary {
  items: CartItem[];
  totalItemCount: number;
  itemTotal: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  handlingFee: number;
  tip: number;
  couponDiscount: number;
  appliedCoupon?: string;
  grandTotal: number;
}
