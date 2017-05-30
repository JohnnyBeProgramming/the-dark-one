import { Routes, RouterModule } from '@angular/router';

import { IndexPage } from '../pages/index';
import { LoginPage } from '../pages/login/index';
import { AuthGuard } from '../routes/auth.gaurd';

const appRoutes: Routes = [
  //{ path: 'login', component: LoginPage },
  //{ path: '', component: HomePage, canActivate: [AuthGuard] },

  { path: '', component: IndexPage },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
