export interface OrderItem {
  product: string;
  name?: string;
  variantSize: string;
  quantity: number;
  priceAtPurchase: number;
  imageUrl?: string;
}

export interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: any;
  items: OrderItem[];

  itemTotal: number;
  deliveryFee: number;
  taxAmount: number;
  discountAmount: number;
  deliveryTip?: number;
  couponCode?: string;
  totalAmount: number;

  assignedRider?: any; // populated rider object
  status: 'PENDING' | 'ACCEPTED' | 'PACKING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: 'COD' | 'ONLINE' | 'WALLET';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';

  deliveryInstructions?: string[];
  deliveryNote?: string;
  otp?: string;
  rating?: number;
  review?: string;

  createdAt?: string;
  updatedAt?: string;
}
