import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/accueil/accueil.component').then(m => m.AccueilComponent) },
  { path: 'accueil', loadComponent: () => import('./components/accueil/accueil.component').then(m => m.AccueilComponent) },
  { path: 'males', loadComponent: () => import('./components/males/males.component').then(m => m.MalesComponent) },
  { path: 'males/:id', loadComponent: () => import('./components/males/prosper/prosper.component').then(m => m.ProsperComponent) },
  { path: 'femelles/:id', loadComponent: () => import('./components/males/prosper/prosper.component').then(m => m.ProsperComponent) },
  { path: 'femelles', loadComponent: () => import('./components/femelles/femelles.component').then(m => m.FemellesComponent) },
  { path: 'chatons', loadComponent: () => import('./components/chatons/chatons.component').then(m => m.ChatonsComponent) },
  { path: 'contact', loadComponent: () => import('./components/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'conditions', loadComponent: () => import('./components/conditions/conditions.component').then(m => m.ConditionsComponent) },
  { path: 'livre-dor', loadComponent: () => import('./components/livre-dor/livre-dor.component').then(m => m.LivreDorComponent) },
  { path: 'portee/:id', loadComponent: () => import('./components/chatons/portee/portee.component').then(m => m.PorteeComponent) },
  { path: 'mentions-legales', loadComponent: () => import('./components/mentions-légales/mentions-legales/mentions-legales.component').then(m => m.MentionsLegalesComponent) },
  { path: 'politique-confidentialite', loadComponent: () => import('./components/mentions-légales/politique-confidentialite/politique-confidentialite.component').then(m => m.PolitiqueConfidentialiteComponent) },
];
