import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-category-bar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="category-section">
      <div class="container">
        <div class="section-header">
          <div class="header-left">
            <h2 class="section-title">Explore Categories</h2>
            <span class="section-sub">Shop from 15+ curated aisles with 10-minute delivery</span>
          </div>
          <a routerLink="/categories" class="see-all-link">
            <span>See All</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>

        <!-- Categories Grid / Horizontal Scroll -->
        <div class="categories-scroll-wrapper">
          @if (isLoading()) {
            <div class="categories-skeleton-grid">
              @for (n of [1,2,3,4,5,6,7,8]; track n) {
                <div class="category-card-skeleton skeleton"></div>
              }
            </div>
          } @else {
            <div class="categories-grid">
              @for (cat of categories(); track cat._id) {
                <a [routerLink]="['/category', cat._id]" class="category-card">
                  <div class="category-image-wrap">
                    <img
                      [src]="cat.image || 'https://cdn-icons-png.flaticon.com/512/3724/3724720.png'"
                      [alt]="cat.name"
                      class="category-img"
                      loading="lazy"
                    />
                    <div class="category-circle-glow"></div>
                  </div>
                  <span class="category-name">{{ cat.name }}</span>
                </a>
              }
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./category-bar.component.css']
})
export class CategoryBarComponent implements OnInit {
  private apiService = inject(ApiService);
  categories = signal<Category[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.apiService.getCategories().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.categories.set(data);
        } else {
          // Fallback popular categories
          this.categories.set(this.getFallbackCategories());
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.categories.set(this.getFallbackCategories());
        this.isLoading.set(false);
      }
    });
  }

  private getFallbackCategories(): Category[] {
    return [
      {
        _id: 'cat-dairy',
        name: 'Dairy, Bread & Eggs',
        image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/category/cms_images/icon/14_1681729443209.png'
      },
      {
        _id: 'cat-produce',
        name: 'Fruits & Vegetables',
        image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/category/cms_images/icon/1487_1643448981442.png'
      },
      {
        _id: 'cat-snacks',
        name: 'Snacks & Munchies',
        image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/category/cms_images/icon/1237_1643449339248.png'
      },
      {
        _id: 'cat-drinks',
        name: 'Cold Drinks & Juices',
        image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/category/cms_images/icon/332_1680269046648.png'
      },
      {
        _id: 'cat-atta',
        name: 'Atta, Rice & Dal',
        image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/category/cms_images/icon/16_1643448892690.png'
      },
      {
        _id: 'cat-masala',
        name: 'Masala & Dry Fruits',
        image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/category/cms_images/icon/24_1681729505707.png'
      },
      {
        _id: 'cat-breakfast',
        name: 'Instant Food & Cereal',
        image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/category/cms_images/icon/15_1681729471131.png'
      },
      {
        _id: 'cat-personal',
        name: 'Bath & Body',
        image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/category/cms_images/icon/163_1681729575412.png'
      }
    ];
  }
}
