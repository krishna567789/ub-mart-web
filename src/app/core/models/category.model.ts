import { Product } from './product.model';

export interface MainCategory {
  _id: string;
  name: string;
  image?: string;
  isActive?: boolean;
}

export interface Category {
  _id: string;
  name: string;
  image?: string;
  mainCategory?: MainCategory;
  isActive?: boolean;
}

export interface SubCategory {
  _id: string;
  name: string;
  image?: string;
  category?: Category;
  isActive?: boolean;
}

export interface Banner {
  _id: string;
  title: string;
  image: string;
  link?: string;
  isActive?: boolean;
  order?: number;
}

export interface HomepageSection {
  _id: string;
  title: string;
  type: string; // 'banner_slider' | 'category_grid' | 'product_grid' | 'deal_row'
  productIds?: Product[];
  categoryIds?: Category[];
  bestsellerItems?: { categoryId: any; productIds: Product[] }[];
  order: number;
  isActive?: boolean;
}
