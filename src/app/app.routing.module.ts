import { Routes, RouterModule } from '@angular/router';
import { UISearchComponent } from './ui-search/ui-search.component';

const routes: Routes = [
  { path: '', component: UISearchComponent },
  // otherwise redirect to home
  { path: '**', redirectTo: '' },
];

export const AppRoutingModule = RouterModule.forRoot(routes);
