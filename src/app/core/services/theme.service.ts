import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';
import { AppSettings } from '../models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private apiService = inject(ApiService);
  
  private settingsSubject = new BehaviorSubject<AppSettings | null>(null);
  public settings$ = this.settingsSubject.asObservable();

  public loadSettings(): void {
    this.apiService.getSettings().subscribe(settings => {
      if (settings) {
        this.settingsSubject.next(settings);
        this.applyTheme(settings);
        this.applyDisplayMode(settings);
        this.applySeasonalTheme(settings);
        this.applyTimeBasedTheme();
      }
    });
  }

  private applyTimeBasedTheme(): void {
    const hour = new Date().getHours();
    
    // Remove previous time-based themes
    document.body.classList.remove('theme-morning', 'theme-midnight');

    if (hour >= 6 && hour < 11) {
      document.body.classList.add('theme-morning');
    } else if (hour >= 22 || hour < 4) {
      document.body.classList.add('theme-midnight');
      // Force dark mode during midnight cravings
      document.body.classList.add('theme-dark');
    }
  }

  private hexToRgb(hex: string): string {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '12, 131, 31';
  }

  private applyTheme(settings: AppSettings): void {
    const root = document.documentElement;
    const pColor = settings.primaryColor || '#0c831f';
    const aColor = settings.accentColor || '#ff9800';
    const bgColor = settings.backgroundColor || '#f4f6f8';
    
    root.style.setProperty('--primary-color', pColor);
    root.style.setProperty('--primary-rgb', this.hexToRgb(pColor));
    
    root.style.setProperty('--accent-color', aColor);
    root.style.setProperty('--accent-rgb', this.hexToRgb(aColor));
    
    root.style.setProperty('--bg-color', bgColor);
    root.style.setProperty('--text-primary', settings.textPrimaryColor || '#111418');
    root.style.setProperty('--text-primary', settings.textPrimaryColor || '#111418');
  }

  private applyDisplayMode(settings: AppSettings): void {
    const mode = settings.displayMode || 'AUTO';
    let isDark = false;
    if (mode === 'DARK') {
      isDark = true;
    } else if (mode === 'AUTO') {
      isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    if (isDark) {
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
    }
  }

  private applySeasonalTheme(settings: AppSettings): void {
    const mode = settings.seasonalTheme?.mode?.toLowerCase() || 'none';
    // Remove all previous theme classes
    document.body.classList.forEach(cls => {
      if (cls.startsWith('theme-') && cls !== 'theme-dark') {
        document.body.classList.remove(cls);
      }
    });

    if (mode !== 'none' && mode !== 'auto') {
      document.body.classList.add(`theme-${mode}`);
    }
  }

  public getSettingsSnapshot(): AppSettings | null {
    return this.settingsSubject.getValue();
  }
}
