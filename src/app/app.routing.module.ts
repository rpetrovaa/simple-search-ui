import { Routes, RouterModule } from '@angular/router';
import { InstructionsComponent } from './instructions/instructions.component';
import { UISearchComponent } from './ui-search/ui-search.component';

const routes: Routes = [
  { path: '', component: UISearchComponent },
  { path: 'instructions', component: InstructionsComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: '' },
];

export const AppRoutingModule = RouterModule.forRoot(routes);
