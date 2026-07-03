import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/basic',
    pathMatch: 'full',
  },
  {
    path: 'basic',
    loadComponent: () => import('./pages/basic/basic').then((c) => c.Basic),
  },
  {
    path: 'basic-all',
    loadComponent: () => import('./pages/basic-all/basic-all').then((c) => c.BasicAll),
  },
  {
    path: 'nested-form',
    loadComponent: () => import('./pages/nested/nested').then((c) => c.Nested),
  },
  {
    path: 'form-array',
    loadComponent: () => import('./pages/form-array/form-array').then((c) => c.SignaleFormArray),
  },
  {
    path: 'reuseable',
    loadComponent: () => import('./pages/resuable/resuable').then((c) => c.Resuable),
  },
];
