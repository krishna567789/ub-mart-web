import { Component, signal, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import { LocationService } from '../../core/services/location.service';

export interface SavedAddress {
  id: string;
  type: 'home' | 'work' | 'other';
  label: string;
  address: string;
}

@Component({
  selector: 'app-location-modal',
  standalone: true,
  template: `
    @if (locationService.isModalOpen()) {
      <div class="modal-overlay" (click)="close()">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="modal-header">
            <div class="header-text">
              <h3 class="modal-title">Select Delivery Location</h3>
              <p class="modal-sub">Express 10-minute delivery is active in your area</p>
            </div>
            <button class="modal-close" (click)="close()">✕</button>
          </div>

          <!-- GPS Detect Current Location -->
          <div class="gps-strip" (click)="detectGPS()">
            <div class="gps-radar-icon">
              <span class="radar-ping"></span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <div class="gps-text">
              <span class="gps-title">Use Current Location</span>
              <span class="gps-sub">Using GPS • Instant 10-min verification</span>
            </div>
            <span class="gps-arrow">→</span>
          </div>

          <!-- Divider -->
          <div class="modal-divider">
            <span>SAVED ADDRESSES</span>
          </div>

          <!-- Saved Addresses List -->
          <div class="addresses-list">
            @for (addr of addresses(); track addr.id) {
              <div
                class="address-item"
                [class.selected]="selectedAddressId() === addr.id"
                (click)="selectAddress(addr)"
              >
                <div class="addr-icon-box" [class]="addr.type">
                  @if (addr.type === 'home') { 🏠 }
                  @else if (addr.type === 'work') { 🏢 }
                  @else { 📍 }
                </div>

                <div class="addr-details">
                  <div class="addr-label-row">
                    <span class="addr-label">{{ addr.label }}</span>
                    @if (selectedAddressId() === addr.id) {
                      <span class="active-badge">DELIVERING HERE</span>
                    }
                  </div>
                  <p class="addr-full">{{ addr.address }}</p>
                </div>

                <div class="addr-radio">
                  <span class="radio-circle"></span>
                </div>
              </div>
            }
          </div>

          <!-- Add New Address Button -->
          <div class="modal-footer">
            <button class="add-addr-btn" (click)="addNewPrompt()">
              <span>+ Add New Address</span>
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(10, 15, 22, 0.7);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      z-index: 3500;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.2s ease;
    }

    .modal-dialog {
      background: #ffffff;
      width: 100%;
      max-width: 480px;
      border-radius: 22px;
      overflow: hidden;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
      animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 24px 28px 18px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }

    .modal-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.35rem;
      font-weight: 800;
      color: #111418;
    }

    .modal-sub {
      font-size: 0.82rem;
      color: #0c831f;
      font-weight: 600;
      margin-top: 2px;
    }

    .modal-close {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #f1f4f8;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 13px;
    }

    .gps-strip {
      margin: 20px 28px 14px;
      background: linear-gradient(135deg, #f3fcf5 0%, #e6f7ec 100%);
      border: 1.5px solid #0c831f;
      border-radius: 16px;
      padding: 14px 18px;
      display: flex;
      align-items: center;
      gap: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .gps-strip:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(12, 131, 31, 0.15);
    }

    .gps-radar-icon {
      position: relative;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #0c831f;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .radar-ping {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid #0c831f;
      animation: pulseGlow 1.5s infinite;
    }

    .gps-text {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .gps-title {
      font-family: 'Outfit', sans-serif;
      font-size: 0.95rem;
      font-weight: 800;
      color: #0c831f;
    }

    .gps-sub {
      font-size: 0.72rem;
      color: #555;
    }

    .gps-arrow {
      font-size: 18px;
      color: #0c831f;
      font-weight: 800;
    }

    .modal-divider {
      padding: 0 28px;
      margin: 12px 0;
      font-family: 'Outfit', sans-serif;
      font-size: 0.72rem;
      font-weight: 800;
      color: #8899a6;
      letter-spacing: 0.08em;
    }

    .addresses-list {
      padding: 0 28px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 280px;
      overflow-y: auto;
    }

    .address-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 14px;
      border-radius: 14px;
      border: 1.5px solid #e1e4e8;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .address-item:hover {
      border-color: #0c831f;
      background: #fafffb;
    }

    .address-item.selected {
      border-color: #0c831f;
      background: #f4faf5;
    }

    .addr-icon-box {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: #f1f4f8;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }

    .addr-details {
      flex: 1;
    }

    .addr-label-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 2px;
    }

    .addr-label {
      font-family: 'Outfit', sans-serif;
      font-size: 0.95rem;
      font-weight: 800;
      color: #111418;
    }

    .active-badge {
      background: #0c831f;
      color: #ffffff;
      font-size: 0.65rem;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .addr-full {
      font-size: 0.78rem;
      color: #657786;
      line-height: 1.35;
    }

    .addr-radio .radio-circle {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 2px solid #c1c8d0;
      display: block;
    }

    .address-item.selected .radio-circle {
      border-color: #0c831f;
      background: #0c831f;
      box-shadow: inset 0 0 0 3px #ffffff;
    }

    .modal-footer {
      padding: 16px 28px 24px;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
    }

    .add-addr-btn {
      width: 100%;
      background: #ffffff;
      color: #0c831f;
      border: 1.5px dashed #0c831f;
      border-radius: 12px;
      padding: 11px;
      font-family: 'Outfit', sans-serif;
      font-size: 0.92rem;
      font-weight: 800;
      transition: all 0.2s ease;
    }

    .add-addr-btn:hover {
      background: #e8f7ec;
    }
  `]
})
export class LocationModalComponent {
  locationService = inject(LocationService);
  toastService = inject(ToastService);

  selectedAddressId = signal<string>('home-1');

  readonly addresses = signal<SavedAddress[]>([
    {
      id: 'home-1',
      type: 'home',
      label: 'Home (Gomti Nagar)',
      address: 'Flat 402, Green Valley Apartments, Gomti Nagar, Lucknow, UP - 226010'
    },
    {
      id: 'work-2',
      type: 'work',
      label: 'Office (Vibhuti Khand)',
      address: 'Tower B, 4th Floor, Cyber Heights, Vibhuti Khand, Lucknow, UP'
    },
    {
      id: 'other-3',
      type: 'other',
      label: 'Parents House (Aliganj)',
      address: 'House 14/B, Sector B, Aliganj, Lucknow, UP'
    }
  ]);

  close(): void {
    this.locationService.closeModal();
  }

  selectAddress(addr: SavedAddress): void {
    this.selectedAddressId.set(addr.id);
    this.locationService.setLocation(addr.label);
    this.toastService.show(`📍 Delivery location set to ${addr.label}!`, 'success', '📍');
    this.close();
  }

  detectGPS(): void {
    this.locationService.setLocation('Current GPS • Gomti Nagar');
    this.toastService.show('🛰️ GPS location verified: Gomti Nagar Hub (10 min delivery)', 'success', '⚡');
    this.close();
  }

  addNewPrompt(): void {
    const loc = prompt('Enter delivery address in Lucknow:');
    if (loc && loc.trim()) {
      const newAddr: SavedAddress = {
        id: 'addr-' + Date.now(),
        type: 'other',
        label: 'Custom: ' + loc.trim().slice(0, 15),
        address: loc.trim()
      };
      this.addresses.update(curr => [...curr, newAddr]);
      this.selectAddress(newAddr);
    }
  }
}
