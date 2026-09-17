export interface AnnouncementBar {
  isActive: boolean;
  text: string;
  bgColor: string;
}

export interface SeasonalTheme {
  mode: string; // 'NONE' | 'SNOW' | 'RAIN' | 'FESTIVE'
  intensity: string; // 'LOW' | 'MEDIUM' | 'HIGH'
  showInApp: boolean;
}

export interface AppSettings {
  storeId?: string;
  storeName?: string;
  storePhone?: string;
  tagline?: string;
  freeDeliveryThreshold?: number;
  isStoreOpen: boolean;
  storeClosedMessage: string;
  minimumOrderValue: number;
  baseDeliveryFee: number;
  
  // Dynamic UI Colors from Admin
  displayMode: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textPrimaryColor: string;

  announcementBar: AnnouncementBar;
  seasonalTheme: SeasonalTheme;
  currencySymbol: string;
}
