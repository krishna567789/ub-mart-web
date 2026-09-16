import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer-root">
      <div class="container">
        <!-- Top App Download Banner -->
        <div class="footer-app-banner">
          <div class="banner-left">
            <div class="banner-badge">⚡ APP EXCLUSIVE OFFERS</div>
            <h3 class="banner-title">Get 20% OFF on your first order on UB Mart App!</h3>
            <p class="banner-sub">Order anywhere, anytime with real-time GPS rider tracking on your phone.</p>
          </div>
          <div class="banner-right">
            <a href="https://play.google.com" target="_blank" class="app-store-badge">
              <span class="badge-icon">🤖</span>
              <div class="badge-text">
                <span class="badge-sub">GET IT ON</span>
                <span class="badge-main">Google Play</span>
              </div>
            </a>
            <a href="https://apple.com" target="_blank" class="app-store-badge">
              <span class="badge-icon">🍏</span>
              <div class="badge-text">
                <span class="badge-sub">DOWNLOAD ON THE</span>
                <span class="badge-main">App Store</span>
              </div>
            </a>
          </div>
        </div>

        <!-- Main Footer Columns -->
        <div class="footer-columns">
          <div class="footer-col brand-col">
            <div class="footer-logo">
              <div class="footer-logo-icon">⚡</div>
              <span class="footer-logo-text">UB <span class="highlight">MART</span></span>
            </div>
            <p class="footer-brand-desc">
              UB Mart is India's fastest lightning grocery delivery service. Delivering fresh fruits, vegetables, dairy, bakery, snacks, and personal care products to your doorstep in 10 minutes flat.
            </p>
            <div class="footer-socials">
              <a href="#" class="social-circle" aria-label="Instagram">📸</a>
              <a href="#" class="social-circle" aria-label="Facebook">📘</a>
              <a href="#" class="social-circle" aria-label="Twitter">🐦</a>
              <a href="#" class="social-circle" aria-label="WhatsApp">💬</a>
            </div>
          </div>

          <div class="footer-col">
            <h4 class="col-title">Popular Categories</h4>
            <ul class="col-links">
              <li><a routerLink="/category/cat-dairy">Dairy, Bread & Eggs</a></li>
              <li><a routerLink="/category/cat-produce">Fresh Vegetables & Fruits</a></li>
              <li><a routerLink="/category/cat-snacks">Snacks & Munchies</a></li>
              <li><a routerLink="/category/cat-drinks">Cold Drinks & Juices</a></li>
              <li><a routerLink="/category/cat-atta">Atta, Rice & Dal</a></li>
              <li><a routerLink="/category/cat-masala">Oils & Masalas</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4 class="col-title">Quick Links</h4>
            <ul class="col-links">
              <li><a routerLink="/tracking">Live Order Tracking</a></li>
              <li><a routerLink="/categories">All Aisles & Categories</a></li>
              <li><a href="#">UB Mart Express Promise</a></li>
              <li><a href="#">Partner With Us (Store/Rider)</a></li>
              <li><a href="#">Warehouse & Careers</a></li>
              <li><a href="#">Press & Media</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4 class="col-title">Customer Support</h4>
            <div class="support-box">
              <div class="support-item">
                <span class="support-label">Customer Helpline:</span>
                <span class="support-val">+91 98765 43210</span>
              </div>
              <div class="support-item">
                <span class="support-label">Support Email:</span>
                <span class="support-val">care&#64;udaybharatmarts.com</span>
              </div>
              <div class="support-item">
                <span class="support-label">Operating Hours:</span>
                <span class="support-val">6:00 AM – 2:00 AM (Daily)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Copyright -->
        <div class="footer-bottom">
          <div class="copyright-text">
            © 2026 UB Mart (Uday Bharat Marts Private Limited). All rights reserved.
          </div>
          <div class="payment-methods">
            <span class="payment-chip">UPI</span>
            <span class="payment-chip">GPay</span>
            <span class="payment-chip">PhonePe</span>
            <span class="payment-chip">Paytm</span>
            <span class="payment-chip">Visa</span>
            <span class="payment-chip">Mastercard</span>
            <span class="payment-chip">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {}
