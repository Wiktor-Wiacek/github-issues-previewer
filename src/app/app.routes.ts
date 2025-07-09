import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/button-page/button-page.component').then(
        (m) => m.ButtonPageComponent
      ),
  },
  {
    path: 'table',
    loadComponent: () =>
      import('./components/table-page/table-page.component').then(
        (m) => m.TablePageComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
