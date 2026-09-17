import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';
import { AnnouncementBarComponent } from './components/announcement-bar/announcement-bar.component';
import { SearchModalComponent } from './components/search-modal/search-modal.component';
import { LocationModalComponent } from './components/location-modal/location-modal.component';
import { ToastComponent } from './components/toast/toast.component';
import { FloatingCartComponent } from './components/floating-cart/floating-cart';
import { CartService } from './core/services/cart.service';
import { SearchService } from './core/services/search.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AnnouncementBarComponent,
    HeaderComponent,
    FooterComponent,
    CartDrawerComponent,
    SearchModalComponent,
    LocationModalComponent,
    ToastComponent,
    FloatingCartComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  cartService = inject(CartService);
  searchService = inject(SearchService);
  themeService = inject(ThemeService);
  title = 'UB Mart';

  constructor() {
    this.themeService.loadSettings();
  }

  openSearch(): void {
    this.searchService.openSearch();
  }

  toggleCart(): void {
    this.cartService.toggleDrawer();
  }
}
