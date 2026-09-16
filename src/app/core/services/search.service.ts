import { Injectable, signal, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiService = inject(ApiService);

  readonly isSearchOpen = signal<boolean>(false);
  readonly searchQuery = signal<string>('');
  readonly searchResults = signal<Product[]>([]);
  readonly isLoading = signal<boolean>(false);

  readonly trendingKeywords = [
    'Milk', 'Amul Butter', 'Bread', 'Potato', 'Onion', 'Maggi', 'Coca Cola', 'Eggs', 'Paneer', 'Atta'
  ];

  openSearch(initialQuery: string = ''): void {
    this.searchQuery.set(initialQuery);
    this.isSearchOpen.set(true);
    if (initialQuery.trim()) {
      this.executeSearch(initialQuery);
    }
  }

  closeSearch(): void {
    this.isSearchOpen.set(false);
  }

  executeSearch(query: string): void {
    const q = query.trim();
    this.searchQuery.set(q);
    if (!q) {
      this.searchResults.set([]);
      return;
    }

    this.isLoading.set(true);
    this.apiService.getProducts({ search: q, limit: 20 }).subscribe({
      next: (products) => {
        this.searchResults.set(products);
        this.isLoading.set(false);
        this.apiService.logSearch(q, products.length).subscribe();
      },
      error: () => {
        this.searchResults.set([]);
        this.isLoading.set(false);
      }
    });
  }
}
