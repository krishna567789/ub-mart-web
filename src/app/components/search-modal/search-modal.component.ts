import { Component, inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchService } from '../../core/services/search.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (searchService.isSearchOpen()) {
      <div class="search-overlay" (click)="closeSearch()">
        <div class="search-dialog" (click)="$event.stopPropagation()">
          <!-- Top Input Bar -->
          <div class="search-input-header">
            <svg class="search-modal-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              #searchInput
              type="text"
              class="search-modal-input"
              placeholder="Search 1,000+ groceries in 10 mins..."
              [value]="searchService.searchQuery()"
              (input)="onInput($event)"
              autofocus
            />
            <button class="search-modal-close" (click)="closeSearch()">
              <kbd>ESC</kbd>
            </button>
          </div>

          <!-- Trending Keywords Pills -->
          <div class="trending-strip">
            <span class="trending-title">🔥 Trending:</span>
            <div class="trending-tags">
              @for (tag of searchService.trendingKeywords; track tag) {
                <button class="trending-tag-btn" (click)="selectTag(tag)">{{ tag }}</button>
              }
            </div>
          </div>

          <!-- Results / Loading / Empty -->
          <div class="search-body">
            @if (searchService.isLoading()) {
              <div class="search-loading">
                <div class="spinner"></div>
                <span>Searching live store inventory...</span>
              </div>
            } @else if (searchService.searchResults().length > 0) {
              <div class="search-results-grid">
                @for (prod of searchService.searchResults(); track prod._id) {
                  <div class="search-prod-card">
                    <a [routerLink]="['/product', prod._id]" (click)="closeSearch()" class="search-prod-img-link">
                      <img
                        [src]="prod.images?.[0] || 'https://cdn-icons-png.flaticon.com/512/3724/3724720.png'"
                        [alt]="prod.name"
                        class="search-prod-img"
                      />
                    </a>
                    <div class="search-prod-info">
                      <a [routerLink]="['/product', prod._id]" (click)="closeSearch()" class="search-prod-title">
                        {{ prod.name }}
                      </a>
                      <div class="search-prod-pack">{{ prod.variants?.[0]?.packSize || 'Standard' }}</div>
                      <div class="search-prod-price-row">
                        <span class="search-prod-price">₹{{ prod.variants?.[0]?.price || 99 }}</span>
                        <button class="search-add-btn" (click)="quickAdd(prod)">+ ADD</button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else if (searchService.searchQuery().trim().length > 0) {
              <div class="no-results-state">
                <div class="no-results-icon">🔍</div>
                <h3>No products found for "{{ searchService.searchQuery() }}"</h3>
                <p>Try searching for milk, bread, butter, or seasonal fruits.</p>
              </div>
            } @else {
              <div class="search-hint-state">
                <p>Type keywords to discover fresh vegetables, dairy, snacks & household essentials delivered to your door in 10 minutes!</p>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styleUrls: ['./search-modal.component.css']
})
export class SearchModalComponent {
  searchService = inject(SearchService);
  cartService = inject(CartService);

  private searchDebounce: any;

  closeSearch(): void {
    this.searchService.closeSearch();
  }

  onInput(event: any): void {
    const val = event.target.value;
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.searchService.executeSearch(val);
    }, 280);
  }

  selectTag(tag: string): void {
    this.searchService.executeSearch(tag);
  }

  quickAdd(prod: any): void {
    this.cartService.addItem(prod, prod.variants?.[0], 1);
  }
}
