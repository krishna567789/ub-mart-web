import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'UB Mart | 10-Minute Grocery Delivery & Fresh Daily Essentials'
  },
  {
    path: 'categories',
    loadComponent: () => import('./pages/category/category.component').then(m => m.CategoryComponent),
    title: 'All Aisles & Categories | UB Mart'
  },
  {
    path: 'category/:id',
    loadComponent: () => import('./pages/category/category.component').then(m => m.CategoryComponent),
    title: 'Browse Fresh Groceries | UB Mart'
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./pages/product/product.component').then(m => m.ProductComponent),
    title: 'Product Details | UB Mart'
  },
  {
    path: 'tracking',
    loadComponent: () => import('./pages/tracking/tracking.component').then(m => m.TrackingComponent),
    title: 'Live Order Tracking | UB Mart'
  },
  {
    path: 'order/:id',
    loadComponent: () => import('./pages/tracking/tracking.component').then(m => m.TrackingComponent),
    title: 'Live Order Status | UB Mart'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
