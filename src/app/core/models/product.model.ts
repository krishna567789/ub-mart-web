export interface ProductVariant {
  _id?: string;
  size?: string;
  packSize?: string;
  price: number;
  originalPrice?: number;
  mrp?: number;
  stock?: number;
  isAvailable?: boolean;
}

export interface Review {
  userName: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  images: string[];
  variants: ProductVariant[];
  subCategory?: {
    _id: string;
    name: string;
    image?: string;
    category?: {
      _id: string;
      name: string;
      image?: string;
    };
  };
  brand?: string;
  badge?: string;
  tags?: string[];
  taxPercentage?: number;
  isAvailable?: boolean;
  isVeg?: boolean;
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];
  discountPercentage?: number;
}

/**
 * Universal Image Resolver: Ensures 100% consistent, high-res images
 * between Product Cards, Product Details, Cart, and Search!
 */
export function getProductImage(product: Product | null | undefined, index: number = 0): string {
  if (!product) return 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/19512a.jpg';

  if (product.images && product.images.length > index) {
    const raw = product.images[index];
    if (raw && typeof raw === 'string' && !raw.endsWith('default.jpg') && raw.trim().length > 0) {
      return raw;
    }
  }

  // Check subcategory image if valid
  if (product.subCategory?.image && !product.subCategory.image.endsWith('default.jpg')) {
    return product.subCategory.image;
  }

  // Consistent keyword matching
  const n = (product.name || '').toLowerCase();
  if (n.includes('atta') || n.includes('flour') || n.includes('aashirvaad')) {
    return 'https://udaybharatmarts.com/storage/product-images/01KDFA4PAXZVPQYGQ558WCVJ9E.jpg';
  }
  if (n.includes('bread') || n.includes('modern')) {
    return 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/477468a.jpg';
  }
  if (n.includes('pea') || n.includes('safal')) {
    return 'https://udaybharatmarts.com/storage/product-images/01KHG9BM3P621G0G2T7XFYVXJX.webp';
  }
  if (n.includes('olive oil') || n.includes('pomace') || n.includes('del monte') || n.includes('borges')) {
    return 'https://udaybharatmarts.com/storage/product-images/01KHG7NA43P0TR9MBRT1HJXQFB.jpg';
  }
  if (n.includes('5 star') || n.includes('bournville') || n.includes('chocolate') || n.includes('cadbury')) {
    return 'https://udaybharatmarts.com/storage/product-images/01KHC3HEMS8TVV98NBWN7EJZM1.png';
  }
  if (n.includes('fanta') || n.includes('coca') || n.includes('coke') || n.includes('drink')) {
    return 'https://udaybharatmarts.com/storage/product-images/01KHG7WDC6TT4P4EEPW57573V8.webp';
  }
  if (n.includes('choco') || n.includes('kellogg')) {
    return 'https://udaybharatmarts.com/storage/product-images/01KHG8C536JAQNARYRKN0QQDJS.webp';
  }
  if (n.includes('oat') || n.includes('saffola')) {
    return 'https://udaybharatmarts.com/storage/product-images/01KHG8NWXWEDS4DF7FP1WX0ZZF.webp';
  }
  if (n.includes('milk') || n.includes('amul')) {
    return 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/19512a.jpg';
  }
  if (n.includes('butter')) {
    return 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/160a.jpg';
  }
  if (n.includes('potato') || n.includes('aloo')) {
    return 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/3888a.jpg';
  }
  if (n.includes('onion') || n.includes('pyaz')) {
    return 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/421714a.jpg';
  }

  return 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/19512a.jpg';
}

/**
 * Returns clean pack size string
 */
export function getVariantPackSize(v: ProductVariant | undefined): string {
  if (!v) return 'Standard Pack';
  return v.size || v.packSize || 'Standard Pack';
}

/**
 * Returns clean MRP
 */
export function getVariantMrp(v: ProductVariant | undefined): number | undefined {
  if (!v) return undefined;
  return v.originalPrice || v.mrp;
}
