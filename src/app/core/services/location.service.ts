import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  readonly isModalOpen = signal<boolean>(false);
  readonly activeLocationName = signal<string>('Gomti Nagar, Lucknow');
  readonly deliveryEta = signal<string>('10 MINS');

  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  setLocation(name: string): void {
    this.activeLocationName.set(name);
  }
}
