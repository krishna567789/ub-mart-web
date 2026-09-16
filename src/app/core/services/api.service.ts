import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { Product } from '../models/product.model';
import { Category, MainCategory, SubCategory, Banner, HomepageSection } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  // Live Backend Endpoints (Proxied via proxy.conf.json)
  private readonly baseUrl = '/api';
  public readonly defaultStoreId = '6a9bc0af2b4db103cebe7c04';

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-store-id': this.defaultStoreId
    });
  }

  // Banners
  getBanners(): Observable<Banner[]> {
    return this.http.get<Banner[]>(`${this.baseUrl}/banners`, { headers: this.getHeaders() }).pipe(
      catchError(err => {
        console.warn('API getBanners error, fallback to curated banners:', err);
        return of([
          {
            _id: 'b1',
            title: '10-Minute Lightning Grocery Delivery',
            image: '/assets/banners/hero_express_delivery.jpg',
            isActive: true,
            order: 1
          },
          {
            _id: 'b2',
            title: 'Farm Fresh Organic Fruits & Crisp Vegetables',
            image: '/assets/banners/hero_fresh_fruits.jpg',
            isActive: true,
            order: 2
          },
          {
            _id: 'b3',
            title: 'Morning Breakfast & Pure Dairy Essentials',
            image: '/assets/banners/hero_dairy_breakfast.jpg',
            isActive: true,
            order: 3
          }
        ]);
      })
    );
  }

  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`, { headers: this.getHeaders() }).pipe(
      catchError(err => {
        console.warn('API getCategories error:', err);
        return of([]);
      })
    );
  }

  getMainCategories(): Observable<MainCategory[]> {
    return this.http.get<MainCategory[]>(`${this.baseUrl}/main-categories`, { headers: this.getHeaders() }).pipe(
      catchError(err => {
        console.warn('API getMainCategories error:', err);
        return of([]);
      })
    );
  }

  getSubCategories(categoryId?: string): Observable<SubCategory[]> {
    let params = new HttpParams();
    if (categoryId) params = params.set('categoryId', categoryId);
    return this.http.get<SubCategory[]>(`${this.baseUrl}/sub-categories`, { headers: this.getHeaders(), params }).pipe(
      catchError(err => {
        console.warn('API getSubCategories error:', err);
        return of([]);
      })
    );
  }

  // Products
  getProducts(query?: { categoryId?: string; subCategoryId?: string; search?: string; limit?: number }): Observable<Product[]> {
    let params = new HttpParams();
    if (query?.categoryId) params = params.set('category', query.categoryId);
    if (query?.subCategoryId) params = params.set('subCategory', query.subCategoryId);
    if (query?.search) params = params.set('search', query.search);
    if (query?.limit) params = params.set('limit', query.limit.toString());

    return this.http.get<Product[]>(`${this.baseUrl}/products`, { headers: this.getHeaders(), params }).pipe(
      catchError(err => {
        console.warn('API getProducts error:', err);
        return of([]);
      })
    );
  }

  // Single Product by ID
  getProductById(id: string): Observable<Product | null> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(err => {
        console.warn(`API getProductById ${id} error:`, err);
        return of(null);
      })
    );
  }

  // Homepage Sections
  getHomepageSections(): Observable<HomepageSection[]> {
    return this.http.get<HomepageSection[]>(`${this.baseUrl}/homepage`, { headers: this.getHeaders() }).pipe(
      catchError(err => {
        console.warn('API getHomepageSections error:', err);
        return of([]);
      })
    );
  }

  // Order Details
  getOrderById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/orders/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(err => {
        console.warn(`API getOrderById ${id} error:`, err);
        return of(null);
      })
    );
  }

  // Abandoned Cart Sync
  syncCart(cartData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/cart/sync`, cartData, { headers: this.getHeaders() }).pipe(
      catchError(err => {
        console.warn('API syncCart error:', err);
        return of(null);
      })
    );
  }

  // Search Query Analytics Log
  logSearch(keyword: string, resultsCount: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/analytics/search`, { keyword, resultsCount }, { headers: this.getHeaders() }).pipe(
      catchError(err => of(null))
    );
  }
}
