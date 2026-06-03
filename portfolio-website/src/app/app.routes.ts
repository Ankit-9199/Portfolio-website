import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home-page.component').then(m => m.HomePageComponent) },
  { path: 'about', loadComponent: () => import('./pages/about/about-page.component').then(m => m.AboutPageComponent) },
  { path: 'projects', loadComponent: () => import('./pages/projects/projects-page.component').then(m => m.ProjectsPageComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact-page.component').then(m => m.ContactPageComponent) },
  { path: '**', redirectTo: '' }
];
