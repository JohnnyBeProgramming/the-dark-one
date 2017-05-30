import { Routes, RouterModule } from '@angular/router';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/index';
import { AuthGuard } from '../routes/auth.gaurd';

const appRoutes: Routes = [
  //{ path: 'login', component: LoginPage },
  //{ path: '', component: HomePage, canActivate: [AuthGuard] },

  { path: '', component: HomePage },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
