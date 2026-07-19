import { Routes } from '@angular/router';
import { authGuard } from './admin/guards/auth.guard';

export const routes: Routes = [
  { path: 'admin/login', loadComponent: () => import('./admin/login/login.component').then(m => m.LoginComponent) },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./admin/shell/admin-shell.component').then(m => m.AdminShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'chats', loadComponent: () => import('./admin/chats/chats.component').then(m => m.AdminChatsComponent) },
      { path: 'chats/new', loadComponent: () => import('./admin/chats/chat-form/chat-form.component').then(m => m.ChatFormComponent) },
      { path: 'chats/:id/edit', loadComponent: () => import('./admin/chats/chat-form/chat-form.component').then(m => m.ChatFormComponent) },
      { path: 'portees', loadComponent: () => import('./admin/portees/portees.component').then(m => m.AdminPorteesComponent) },
      { path: 'portees/new', loadComponent: () => import('./admin/portees/portee-form/portee-form.component').then(m => m.PorteeFormComponent) },
      { path: 'portees/:id/edit', loadComponent: () => import('./admin/portees/portee-form/portee-form.component').then(m => m.PorteeFormComponent) },
      { path: 'messages', loadComponent: () => import('./admin/messages/messages.component').then(m => m.AdminMessagesComponent) },
      { path: 'blog', loadComponent: () => import('./admin/blog-admin/blog-admin.component').then(m => m.BlogAdminComponent) },
      { path: 'blog/new', loadComponent: () => import('./admin/blog-admin/blog-form/blog-form.component').then(m => m.BlogFormComponent) },
      { path: 'blog/:slug/edit', loadComponent: () => import('./admin/blog-admin/blog-form/blog-form.component').then(m => m.BlogFormComponent) },
    ]
  },
  { path: '', loadComponent: () => import('./components/accueil/accueil.component').then(m => m.AccueilComponent) },
  { path: 'accueil', loadComponent: () => import('./components/accueil/accueil.component').then(m => m.AccueilComponent) },
  { path: 'males', loadComponent: () => import('./components/males/males.component').then(m => m.MalesComponent) },
  { path: 'males/:id', loadComponent: () => import('./components/males/prosper/prosper.component').then(m => m.ProsperComponent) },
  { path: 'femelles/:id', loadComponent: () => import('./components/males/prosper/prosper.component').then(m => m.ProsperComponent) },
  { path: 'femelles', loadComponent: () => import('./components/femelles/femelles.component').then(m => m.FemellesComponent) },
  { path: 'chatons', loadComponent: () => import('./components/chatons/chatons.component').then(m => m.ChatonsComponent) },
  { path: 'blog', loadComponent: () => import('./components/blog/blog.component').then(m => m.BlogComponent) },
  { path: 'blog/:slug', loadComponent: () => import('./components/blog/blog-detail/blog-detail.component').then(m => m.BlogDetailComponent) },
  { path: 'contact', loadComponent: () => import('./components/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'conditions', loadComponent: () => import('./components/conditions/conditions.component').then(m => m.ConditionsComponent) },
  { path: 'liste-attente', loadComponent: () => import('./components/liste-attente/liste-attente.component').then(m => m.ListeAttenteComponent) },
  { path: 'portee/:id', loadComponent: () => import('./components/chatons/portee/portee.component').then(m => m.PorteeComponent) },
  { path: 'mentions-legales', loadComponent: () => import('./components/mentions-légales/mentions-legales/mentions-legales.component').then(m => m.MentionsLegalesComponent) },
  { path: 'politique-confidentialite', loadComponent: () => import('./components/mentions-légales/politique-confidentialite/politique-confidentialite.component').then(m => m.PolitiqueConfidentialiteComponent) },
];
