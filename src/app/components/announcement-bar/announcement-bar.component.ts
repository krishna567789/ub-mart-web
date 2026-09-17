import { Component, inject } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-announcement-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (settings$ | async; as settings) {
      @if (settings.announcementBar?.isActive && settings.announcementBar?.text) {
        <div class="announcement-bar" [style.background-color]="settings.announcementBar.bgColor || '#ef4444'">
          <div class="announcement-content">
            <span class="pulse-dot"></span>
            <span class="announcement-text">{{ settings.announcementBar.text }}</span>
          </div>
        </div>
      }
    }
  `,
  styles: [`
    .announcement-bar {
      width: 100%;
      padding: 6px 16px;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1100;
      position: relative;
    }
    
    .announcement-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .pulse-dot {
      width: 6px;
      height: 6px;
      background-color: #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
      animation: pulseWhite 1.5s infinite;
    }

    .announcement-text {
      font-family: 'Outfit', sans-serif;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    @keyframes pulseWhite {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
      }
      70% {
        transform: scale(1.2);
        box-shadow: 0 0 0 4px rgba(255, 255, 255, 0);
      }
      100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
      }
    }
  `]
})
export class AnnouncementBarComponent {
  private themeService = inject(ThemeService);
  settings$ = this.themeService.settings$;
}
