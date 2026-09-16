# UB Mart Web

> ⚡ **10-Minute Grocery Delivery Web App** — Angular 19+ eCommerce platform for UB Mart

A production-grade web app built with **Angular 19 Standalone + Signals**, connected to the live MongoDB backend at `ubmart-admin.vercel.app`.

---

## 🚀 Features

- **Real-time product data** from live MongoDB (419+ products)
- **Flash Deals** with live countdown timer
- **Dynamic Homepage Sections** from `/api/homepage` (PRODUCT_SCROLL, BESTSELLER_GRID, FLASH_SALE)
- **Product Detail Page** with:
  - Multi-image gallery with thumbnails
  - Variant / pack size selector
  - Sticky scroll buy bar
  - Specifications & details table
  - Customer ratings & reviews
  - Similar products carousel
  - WhatsApp share button
- **Smart Cart Drawer** with:
  - Free delivery progress bar
  - Delivery partner tip selector
  - Coupon code (SAVE10, FLAT50, UDAY20)
  - Checkout flow with UPI/Card/COD
  - Live order tracking page
- **Universal Image Resolver** — 100% image consistency across card, detail, and cart
- **Category & Subcategory browsing** with sort/filter
- **Hero Banner Carousel** with auto-play
- **Animated UI** — scroll-driven animations, hover lift effects, pulse indicators
- **Progressive Web App** ready
- **Wishlist** heart toggle per product
- **Deep Link support** (ubmart://product/:id)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 19 (Standalone Components + Signals) |
| Language | TypeScript |
| Styling | Vanilla CSS (Glassmorphism, Gradients, Animations) |
| State | Angular Signals |
| HTTP | Angular HttpClient with Proxy |
| Fonts | Google Fonts (Outfit) |
| Backend | `https://ubmart-admin.vercel.app/api` |
| Build | Angular CLI / Vite |

---

## 📦 Getting Started

```bash
# Install dependencies
npm install

# Start development server (with proxy)
npm start

# App runs at http://localhost:4200
```

> The `proxy.conf.json` routes `/api/*` requests to `https://ubmart-admin.vercel.app` automatically.

---

## 🏗 Build for Production

```bash
npm run build
# Output in dist/ub-mart-web/
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/           # App header with cart icon & location
│   │   ├── hero-banner/      # Auto-play carousel banner
│   │   ├── category-bar/     # Horizontal category scroll
│   │   ├── product-card/     # Reusable product card with stepper
│   │   └── cart-drawer/      # Side cart drawer with checkout
│   ├── pages/
│   │   ├── home/             # Homepage with live sections
│   │   ├── product/          # Product detail page (PDP)
│   │   ├── category/         # Category listing page
│   │   └── tracking/         # Live order tracking
│   └── core/
│       ├── models/           # Product, Cart, Category models
│       └── services/         # API, Cart, Toast, Location services
├── styles.css                # Global design system
└── main.ts                   # App bootstrap
```

---

## 🎨 Design System

- **Primary Color**: `#0c831f` (UB Mart Green)
- **Font**: Outfit (Google Fonts)
- **Border Radius**: 12-16px cards
- **Animations**: Pulse, slide-in, hover lift, scroll-driven sticky bar
- **Dark overlays**: Glassmorphism cart drawer, overlay modals

---

## 📱 Mobile App

The companion Flutter mobile app is at [`un_mart_user_app`](../un_mart_user_app/).

---

## 🔑 API Configuration

The backend `x-store-id` is set to `6a9bc0af2b4db103cebe7c04`.
All API calls go through `src/app/core/services/api.service.ts`.

---

Made with ❤️ by **Sigma IT** • Lucknow, India
