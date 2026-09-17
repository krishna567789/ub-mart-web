import { Component, inject, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-floating-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-cart.html',
  styleUrls: ['./floating-cart.css']
})
export class FloatingCartComponent {
  cartService = inject(CartService);

  @ViewChild('magnet', { static: false }) magnetRef!: ElementRef<HTMLElement>;

  toggleCart() {
    this.cartService.toggleDrawer();
  }

  // Magnetic Effect
  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!this.magnetRef) return;
    const el = this.magnetRef.nativeElement;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Move element slightly towards the mouse (magnetic pull)
    el.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px) scale(1.08)`;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (!this.magnetRef) return;
    const el = this.magnetRef.nativeElement;
    // Snap back
    el.style.transform = `translate(0px, 0px) scale(1)`;
  }
}
