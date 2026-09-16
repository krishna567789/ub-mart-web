import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="tracking-page-root">
      <div class="container">
        <!-- Top Status Banner -->
        <div class="tracking-top-card">
          <div class="top-badge">
            <span class="pulse-beacon"></span>
            <span>LIVE 10-15 MIN EXPRESS DELIVERY</span>
          </div>

          <div class="eta-box">
            <span class="eta-label">ESTIMATED ARRIVAL IN</span>
            <div class="eta-timer">
              <span class="time-digit">{{ minutes() }}:{{ seconds() }}</span>
              <span class="time-unit">MINS</span>
            </div>
            <p class="eta-status">Rider Rahul Kumar is speeding to your address 🛵💨</p>
          </div>
        </div>

        <!-- Layout Grid -->
        <div class="tracking-layout">
          <!-- Left: Order Status, Map & Timeline -->
          <div class="tracking-main">
            <!-- Animated Live GPS Map -->
            <div class="live-map-card">
              <div class="map-header">
                <div class="map-title-row">
                  <span class="live-radar-dot"></span>
                  <span class="map-title">Live GPS Rider Tracker</span>
                </div>
                <span class="speed-pill">Speed: 32 km/h • 1.1 km away</span>
              </div>
              <div class="map-viewport">
                <svg viewBox="0 0 600 240" class="map-svg">
                  <defs>
                    <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#0c831f" />
                      <stop offset="100%" stop-color="#25d366" />
                    </linearGradient>
                  </defs>
                  <!-- Background Road -->
                  <path d="M 40 180 Q 180 60, 320 150 T 560 70" fill="none" stroke="#e2e8f0" stroke-width="14" stroke-linecap="round" />
                  <!-- Glowing Active Polyline -->
                  <path d="M 40 180 Q 180 60, 320 150 T 560 70" fill="none" stroke="url(#routeGrad)" stroke-width="6" stroke-linecap="round" stroke-dasharray="8 6" class="animated-route" />

                  <!-- Hub Marker -->
                  <circle cx="40" cy="180" r="16" fill="#111418" />
                  <text x="40" y="185" fill="#fff" font-size="12" text-anchor="middle">🏬</text>
                  <text x="40" y="212" fill="#333" font-size="11" font-weight="bold" text-anchor="middle">Lucknow Hub</text>

                  <!-- Destination Marker -->
                  <circle cx="560" cy="70" r="16" fill="#ff3b30" />
                  <text x="560" y="75" fill="#fff" font-size="12" text-anchor="middle">🏠</text>
                  <text x="560" y="102" fill="#333" font-size="11" font-weight="bold" text-anchor="middle">Gomti Nagar Home</text>

                  <!-- Animated Moving Bike Marker -->
                  <g class="animated-bike-group">
                    <circle cx="0" cy="0" r="18" fill="#0c831f" class="bike-glow-circle" />
                    <text x="0" y="6" font-size="16" text-anchor="middle">🛵</text>
                  </g>
                </svg>
              </div>
            </div>

            <!-- Delivery Handover OTP Card -->
            <div class="otp-card">
              <div class="otp-header">
                <div class="otp-title">
                  <span>Safe Delivery Handover PIN</span>
                  <small>Share this 4-digit code with your rider upon arrival</small>
                </div>
                <button class="otp-copy-btn" (click)="copyPin()">Copy PIN</button>
              </div>
              <div class="otp-digits">
                <span class="pin-digit">7</span>
                <span class="pin-digit">2</span>
                <span class="pin-digit">9</span>
                <span class="pin-digit">1</span>
              </div>
            </div>

            <!-- 5-Step Order Timeline -->
            <div class="timeline-card">
              <h3 class="card-title">Live Order Timeline</h3>
              <div class="timeline-steps">
                <div class="step-item completed">
                  <div class="step-icon">✓</div>
                  <div class="step-content">
                    <div class="step-name">Order Placed & Confirmed</div>
                    <div class="step-time">Received by Lucknow Hub (Gomti Nagar)</div>
                  </div>
                </div>

                <div class="step-item completed">
                  <div class="step-icon">✓</div>
                  <div class="step-content">
                    <div class="step-name">Items Packed & Quality Sealed</div>
                    <div class="step-time">Temperature controlled hygienic packing</div>
                  </div>
                </div>

                <div class="step-item active">
                  <div class="step-icon">🛵</div>
                  <div class="step-content">
                    <div class="step-name">Out for Delivery (Express Speed)</div>
                    <div class="step-time">Rider is 1.1 km away (near Riverside Mall intersection)</div>
                  </div>
                </div>

                <div class="step-item pending">
                  <div class="step-icon">🏁</div>
                  <div class="step-content">
                    <div class="step-name">Arrived & Handed Over</div>
                    <div class="step-time">Contactless doorstep verification</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Delivery Partner Card & Delivery Address -->
          <div class="tracking-side">
            <!-- Rider Profile Card -->
            <div class="rider-card">
              <div class="rider-header">
                <div class="rider-avatar">🛵</div>
                <div class="rider-info">
                  <div class="rider-name">Rahul Kumar</div>
                  <div class="rider-badge">🛡️ Verified UB Express Rider • ★ 4.9</div>
                </div>
              </div>

              <div class="rider-vehicle">
                <span>Vehicle: Electric EV Bike (UP 32 AB 4598)</span>
              </div>

              <div class="rider-actions">
                <a href="tel:+919876543210" class="call-rider-btn">
                  <span>📞 Call Rider</span>
                </a>
              </div>
            </div>

            <!-- Delivery Address Card -->
            <div class="address-card">
              <h4 class="addr-title">Delivery Location</h4>
              <p class="addr-text">Flat 402, Green Valley Apartments, Gomti Nagar, Lucknow</p>
              <div class="landmark-pill">
                <span>📍 Near Eldeco Green Gate</span>
              </div>
            </div>

            <!-- Return To Store -->
            <a routerLink="/" class="back-store-btn">← Continue Shopping on UB Mart</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private toastService = inject(ToastService);

  minutes = signal<string>('08');
  seconds = signal<string>('42');
  private timer: any;

  ngOnInit(): void {
    let remaining = 8 * 60 + 42;
    this.timer = setInterval(() => {
      remaining--;
      if (remaining <= 0) remaining = 15 * 60;
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      this.minutes.set(m.toString().padStart(2, '0'));
      this.seconds.set(s.toString().padStart(2, '0'));
    }, 1000);
  }

  copyPin(): void {
    navigator.clipboard.writeText('7291');
    this.toastService.show('📋 PIN 7291 copied to clipboard!', 'success', '🔑');
  }
}
