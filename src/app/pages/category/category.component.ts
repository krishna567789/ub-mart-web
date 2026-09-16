import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  template: `
    <div class="category-page-root">
      <div class="container">
        <!-- Header Banner -->
        <div class="cat-header-strip">
          <div>
            <h1 class="cat-title">{{ currentCategoryName() }}</h1>
            <p class="cat-sub">Delivering fresh in 10 minutes across Lucknow</p>
          </div>
          <div class="sort-box">
            <label>Sort By:</label>
            <select (change)="onSortChange($event)">
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Discount</option>
            </select>
          </div>
        </div>

        <!-- Main Content: Sidebar + Products -->
        <div class="category-content-layout">
          <!-- Sidebar Filters -->
          <aside class="cat-sidebar">
            <div class="sidebar-block">
              <h3 class="sidebar-title">Categories</h3>
              <ul class="sidebar-links">
                @for (c of allCategories(); track c._id) {
                  <li>
                    <a
                      [routerLink]="['/category', c._id]"
                      [class.active]="c._id === activeCategoryId()"
                      class="sidebar-cat-link"
                    >
                      <img [src]="c.image || 'https://cdn-icons-png.flaticon.com/512/3724/3724720.png'" alt="" class="cat-icon" />
                      <span>{{ c.name }}</span>
                    </a>
                  </li>
                }
              </ul>
            </div>
          </aside>

          <!-- Products View -->
          <main class="cat-products-view">
            @if (isLoading()) {
              <div class="cat-skeleton-grid">
                @for (n of [1,2,3,4,5,6]; track n) {
                  <div class="product-skeleton skeleton"></div>
                }
              </div>
            } @else if (products().length > 0) {
              <div class="cat-products-grid">
                @for (p of products(); track p._id) {
                  <app-product-card [product]="p"></app-product-card>
                }
              </div>
            } @else {
              <div class="no-items-card">
                <h3>No products found in this category</h3>
                <p>Try browsing other fresh categories.</p>
                <a routerLink="/" class="btn-primary">Browse All Aisles</a>
              </div>
            }
          </main>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);

  activeCategoryId = signal<string>('');
  currentCategoryName = signal<string>('All Groceries');
  allCategories = signal<Category[]>([]);
  products = signal<Product[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadCategories();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id') || '';
      this.activeCategoryId.set(id);
      this.loadProducts(id);
    });
  }

  private loadCategories(): void {
    this.apiService.getCategories().subscribe(cats => {
      this.allCategories.set(cats);
      this.updateCategoryName();
    });
  }

  private updateCategoryName(): void {
    const id = this.activeCategoryId();
    if (!id) {
      this.currentCategoryName.set('All Grocery Aisles');
      return;
    }
    const found = this.allCategories().find(c => c._id === id);
    if (found) {
      this.currentCategoryName.set(found.name);
    } else {
      this.currentCategoryName.set('Category Products');
    }
  }

  private loadProducts(catId: string): void {
    this.isLoading.set(true);
    this.apiService.getProducts({ categoryId: catId || undefined, limit: 30 }).subscribe(prods => {
      this.products.set(prods);
      this.isLoading.set(false);
      this.updateCategoryName();
    });
  }

  onSortChange(event: any): void {
    const mode = event.target.value;
    const sorted = [...this.products()];
    if (mode === 'price-low') {
      sorted.sort((a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0));
    } else if (mode === 'price-high') {
      sorted.sort((a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0));
    } else if (mode === 'discount') {
      sorted.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
    }
    this.products.set(sorted);
  }
}
